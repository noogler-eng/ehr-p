"""
XGBoost Cardiovascular Disease Prediction Model Trainer

Trains an XGBoost model on medically realistic synthetic data where
risk factors (age, BP, cholesterol, etc.) are properly correlated with
heart disease outcomes — so predictions make clinical sense.
"""

import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import classification_report, roc_auc_score
import xgboost as xgb
import joblib
import os


def create_realistic_dataset():
    """
    Creates a medically realistic synthetic cardiovascular dataset.
    Risk factors are correlated with outcomes based on real clinical patterns.
    """
    np.random.seed(42)
    n_samples = 3000

    # --- Generate base demographics ---
    age = np.random.normal(55, 14, n_samples).clip(25, 85).astype(int)
    sex = np.random.binomial(1, 0.55, n_samples)  # 55% male (higher CVD incidence)

    # --- Generate vitals correlated with age ---
    # Blood pressure increases with age
    resting_bp = (100 + age * 0.8 + np.random.normal(0, 12, n_samples)).clip(85, 200).astype(int)

    # Cholesterol correlated with age and sex
    cholesterol = (150 + age * 1.2 + sex * 15 + np.random.normal(0, 35, n_samples)).clip(100, 450).astype(int)

    # Fasting blood sugar — higher chance in older patients
    fbs_prob = 0.05 + (age - 30) * 0.005
    fasting_blood_sugar = np.array([np.random.binomial(1, min(p, 0.5)) for p in fbs_prob])

    # Max heart rate decreases with age (220 - age is rough max)
    max_heart_rate = (220 - age - np.random.normal(0, 12, n_samples)).clip(60, 210).astype(int)

    # --- Clinical markers ---
    # Chest pain type: 0=typical angina, 1=atypical, 2=non-anginal, 3=asymptomatic
    # Sicker patients more likely to have typical/atypical
    chest_pain_base = np.random.choice([0, 1, 2, 3], n_samples, p=[0.15, 0.20, 0.30, 0.35])

    # ECG: 0=normal, 1=ST-T abnormality, 2=LV hypertrophy
    resting_ecg = np.random.choice([0, 1, 2], n_samples, p=[0.50, 0.35, 0.15])

    # Exercise-induced angina — more likely in high BP + high cholesterol patients
    angina_prob = 0.05 + (resting_bp > 140).astype(float) * 0.15 + (cholesterol > 240).astype(float) * 0.15
    exercise_angina = np.array([np.random.binomial(1, min(p, 0.6)) for p in angina_prob])

    # ST depression (oldpeak) — correlated with disease
    oldpeak = (np.random.exponential(0.8, n_samples) + exercise_angina * 1.5).clip(0, 6.2)
    oldpeak = np.round(oldpeak, 1)

    # Slope: 0=upsloping, 1=flat, 2=downsloping
    slope = np.random.choice([0, 1, 2], n_samples, p=[0.35, 0.40, 0.25])

    # Number of major vessels colored by fluoroscopy (0-3)
    num_major_vessels = np.random.choice([0, 1, 2, 3], n_samples, p=[0.50, 0.25, 0.15, 0.10])

    # Thalassemia: 0=normal, 1=fixed defect, 2=normal, 3=reversible defect
    thalassemia = np.random.choice([0, 1, 2, 3], n_samples, p=[0.05, 0.10, 0.55, 0.30])

    # --- Build realistic target variable ---
    # Each factor contributes to heart disease probability
    risk_score = np.zeros(n_samples, dtype=float)

    # Age contribution (major factor)
    risk_score += np.where(age >= 70, 0.20, np.where(age >= 60, 0.15, np.where(age >= 50, 0.08, 0.02)))

    # Sex (male higher risk)
    risk_score += sex * 0.08

    # Blood pressure
    risk_score += np.where(resting_bp >= 160, 0.18, np.where(resting_bp >= 140, 0.12, np.where(resting_bp >= 130, 0.05, 0.0)))

    # Cholesterol
    risk_score += np.where(cholesterol >= 280, 0.18, np.where(cholesterol >= 240, 0.12, np.where(cholesterol >= 200, 0.05, 0.0)))

    # Chest pain type (typical angina = highest risk)
    risk_score += np.where(chest_pain_base == 0, 0.15, np.where(chest_pain_base == 1, 0.10, 0.0))

    # ECG abnormalities
    risk_score += np.where(resting_ecg == 2, 0.12, np.where(resting_ecg == 1, 0.08, 0.0))

    # Low max heart rate = higher risk
    risk_score += np.where(max_heart_rate < 120, 0.10, np.where(max_heart_rate < 140, 0.05, 0.0))

    # Exercise-induced angina
    risk_score += exercise_angina * 0.12

    # ST depression
    risk_score += np.where(oldpeak >= 3.0, 0.12, np.where(oldpeak >= 1.5, 0.08, np.where(oldpeak >= 0.5, 0.03, 0.0)))

    # Number of vessels
    risk_score += num_major_vessels * 0.06

    # Thalassemia defects
    risk_score += np.where(thalassemia == 3, 0.10, np.where(thalassemia == 1, 0.08, 0.0))

    # Fasting blood sugar
    risk_score += fasting_blood_sugar * 0.06

    # Slope
    risk_score += np.where(slope == 2, 0.08, np.where(slope == 1, 0.04, 0.0))

    # Add small noise and create binary target
    risk_score += np.random.normal(0, 0.06, n_samples)
    target = (risk_score > 0.38).astype(int)

    # --- Adjust chest pain to be more correlated with disease ---
    # Patients with disease more likely to have angina-type pain
    for i in range(n_samples):
        if target[i] == 1 and np.random.random() < 0.35:
            chest_pain_base[i] = np.random.choice([0, 1])
        elif target[i] == 0 and np.random.random() < 0.25:
            chest_pain_base[i] = np.random.choice([2, 3])

    df = pd.DataFrame({
        'age': age,
        'sex': sex,
        'chest_pain_type': chest_pain_base,
        'resting_bp': resting_bp,
        'cholesterol': cholesterol,
        'fasting_blood_sugar': fasting_blood_sugar,
        'resting_ecg': resting_ecg,
        'max_heart_rate': max_heart_rate,
        'exercise_angina': exercise_angina,
        'oldpeak': oldpeak,
        'slope': slope,
        'num_major_vessels': num_major_vessels,
        'thalassemia': thalassemia,
        'target': target
    })

    print(f"Dataset created: {n_samples} samples")
    print(f"Disease prevalence: {target.mean():.1%}")
    print(f"Age range: {age.min()}-{age.max()}")
    print(f"BP range: {resting_bp.min()}-{resting_bp.max()}")
    print(f"Cholesterol range: {cholesterol.min()}-{cholesterol.max()}")

    return df


def train_xgboost_model():
    """
    Trains an XGBoost classifier on realistic cardiovascular data.
    Saves model, scaler, and feature names for production use.
    """
    print("=" * 60)
    print("  CARDIOVASCULAR DISEASE PREDICTION MODEL TRAINER")
    print("  XGBoost Multi-Feature Classifier")
    print("=" * 60)
    print()

    print("Creating realistic cardiovascular dataset...")
    df = create_realistic_dataset()
    print()

    X = df.drop('target', axis=1)
    y = df['target']

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    # Scale features
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)

    # Train XGBoost with tuned hyperparameters
    print("Training XGBoost model...")
    model = xgb.XGBClassifier(
        n_estimators=200,
        max_depth=6,
        learning_rate=0.08,
        subsample=0.85,
        colsample_bytree=0.85,
        min_child_weight=3,
        gamma=0.1,
        reg_alpha=0.1,
        reg_lambda=1.0,
        objective='binary:logistic',
        random_state=42,
        eval_metric='logloss',
        scale_pos_weight=len(y_train[y_train == 0]) / max(len(y_train[y_train == 1]), 1)
    )

    model.fit(
        X_train_scaled, y_train,
        eval_set=[(X_test_scaled, y_test)],
        verbose=False
    )

    # Evaluate
    train_score = model.score(X_train_scaled, y_train)
    test_score = model.score(X_test_scaled, y_test)
    y_pred = model.predict(X_test_scaled)
    y_proba = model.predict_proba(X_test_scaled)[:, 1]
    auc = roc_auc_score(y_test, y_proba)

    print(f"\nTraining Accuracy:  {train_score:.4f}")
    print(f"Testing Accuracy:   {test_score:.4f}")
    print(f"ROC-AUC Score:      {auc:.4f}")
    print()
    print("Classification Report:")
    print(classification_report(y_test, y_pred, target_names=['No Disease', 'Heart Disease']))

    # Feature importance
    print("Feature Importance (Top 5):")
    importances = model.feature_importances_
    feature_imp = sorted(zip(X.columns, importances), key=lambda x: x[1], reverse=True)
    for feat, imp in feature_imp[:5]:
        print(f"  {feat:25s} {imp:.4f}")

    # Save
    model_dir = os.path.dirname(os.path.abspath(__file__))
    joblib.dump(model, os.path.join(model_dir, 'xgboost_model.pkl'))
    joblib.dump(scaler, os.path.join(model_dir, 'scaler.pkl'))
    joblib.dump(X.columns.tolist(), os.path.join(model_dir, 'feature_names.pkl'))

    print(f"\nModel saved successfully!")
    print("=" * 60)


if __name__ == "__main__":
    train_xgboost_model()
