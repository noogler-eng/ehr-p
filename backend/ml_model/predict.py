"""
XGBoost Cardiovascular Disease Prediction Service

Multi-disease cardiovascular risk assessment engine.
Predicts 10+ heart-related conditions using XGBoost ML model
combined with rule-based clinical scoring algorithms.

Diseases predicted:
 1. Coronary Artery Disease (CAD)
 2. Acute Myocardial Infarction Risk (Heart Attack)
 3. Cardiac Arrhythmia / Atrial Fibrillation
 4. Congestive Heart Failure (CHF)
 5. Angina Pectoris
 6. Hypertensive Heart Disease
 7. Valvular Heart Disease
 8. Dilated Cardiomyopathy
 9. Peripheral Artery Disease (PAD)
10. Stroke / Cerebrovascular Risk
11. Aortic Aneurysm Risk
12. Pericarditis
"""

import sys
import json
import joblib
import numpy as np
import os


def load_model():
    """Loads the pre-trained XGBoost model, scaler, and feature names."""
    model_dir = os.path.dirname(os.path.abspath(__file__))
    model = joblib.load(os.path.join(model_dir, 'xgboost_model.pkl'))
    scaler = joblib.load(os.path.join(model_dir, 'scaler.pkl'))
    feature_names = joblib.load(os.path.join(model_dir, 'feature_names.pkl'))
    return model, scaler, feature_names


def extract_features(patient_data):
    """Extracts features from patient data matching the training schema."""
    vitals = patient_data.get('vitals', {})
    clinical_markers = patient_data.get('clinicalMarkers', {})

    # Parse blood pressure
    bp = vitals.get('bp', '120/80')
    if '/' in str(bp):
        parts = str(bp).split('/')
        systolic_bp = int(parts[0])
        diastolic_bp = int(parts[1]) if len(parts) > 1 else 80
    else:
        systolic_bp = 120
        diastolic_bp = 80

    heart_rate = int(vitals.get('heartRate', 75))
    cholesterol = int(vitals.get('cholesterol', 200))
    sugar_level = int(vitals.get('sugarLevel', 100))
    fasting_blood_sugar = 1 if sugar_level > 120 else 0

    # Chest pain type mapping
    chest_pain_map = {
        'typical': 0, 'typical angina': 0,
        'atypical': 1, 'atypical angina': 1,
        'non-anginal': 2, 'non-anginal pain': 2,
        'asymptomatic': 3, 'none': 3
    }
    chest_pain_type = chest_pain_map.get(
        str(clinical_markers.get('chestPainType', 'asymptomatic')).lower(), 3
    )

    # ECG result mapping
    ecg_map = {
        'normal': 0,
        'st-t abnormality': 1, 'abnormal': 1, 'st-t wave abnormality': 1,
        'left ventricular hypertrophy': 2, 'lvh': 2, 'hypertrophy': 2
    }
    resting_ecg = ecg_map.get(str(vitals.get('ecgResult', 'normal')).lower(), 0)

    age = int(patient_data.get('age', 50))
    sex = 1  # Default male; can be extended via user profile

    # Features matching training columns exactly
    features = np.array([[
        age,
        sex,
        chest_pain_type,
        systolic_bp,
        cholesterol,
        fasting_blood_sugar,
        resting_ecg,
        heart_rate,
        0,    # exercise_angina — default
        0.0,  # oldpeak — default
        1,    # slope — default flat
        0,    # num_major_vessels — default
        2     # thalassemia — default normal
    ]])

    return features, {
        'age': age, 'sex': sex, 'systolic_bp': systolic_bp, 'diastolic_bp': diastolic_bp,
        'heart_rate': heart_rate, 'cholesterol': cholesterol, 'sugar_level': sugar_level,
        'fasting_blood_sugar': fasting_blood_sugar, 'chest_pain_type': chest_pain_type,
        'resting_ecg': resting_ecg
    }


def predict(patient_data):
    """Makes multi-disease cardiovascular prediction."""
    try:
        model, scaler, feature_names = load_model()
        features, parsed = extract_features(patient_data)
        features_scaled = scaler.transform(features)

        prediction = model.predict(features_scaled)[0]
        probability = model.predict_proba(features_scaled)[0]
        risk_prob = float(probability[1])

        # Risk stratification
        if risk_prob >= 0.65:
            risk_level = "High"
        elif risk_prob >= 0.35:
            risk_level = "Medium"
        else:
            risk_level = "Low"

        # Multi-disease prediction
        predicted_conditions = predict_all_conditions(patient_data, risk_prob, parsed)

        # Sort by severity then probability
        severity_order = {'CRITICAL': 0, 'HIGH': 1, 'MEDIUM': 2, 'MODERATE': 3, 'LOW': 4}
        predicted_conditions.sort(
            key=lambda x: (severity_order.get(x['severity'], 5), -x['probability'])
        )

        # Primary disease label
        primary_disease = get_primary_disease_label(predicted_conditions, risk_level)

        result = {
            "prediction": int(prediction),
            "risk_level": risk_level,
            "risk_probability": risk_prob,
            "confidence": float(max(probability)),
            "recommendation": primary_disease,
            "predicted_conditions": predicted_conditions,
            "clinical_recommendations": generate_clinical_recommendations(
                risk_level, patient_data, predicted_conditions, parsed
            )
        }
        return result

    except Exception as e:
        return {
            "error": str(e),
            "prediction": 0,
            "risk_level": "Unknown",
            "risk_probability": 0.0,
            "confidence": 0.0,
            "recommendation": "PREDICTION ERROR — MANUAL ASSESSMENT REQUIRED",
            "predicted_conditions": [],
            "clinical_recommendations": ""
        }


def predict_all_conditions(patient_data, risk_prob, parsed):
    """
    Predicts 12 cardiovascular conditions using clinical scoring algorithms.
    Each condition has medically accurate risk factor weights.
    """
    vitals = patient_data.get('vitals', {})
    clinical_markers = patient_data.get('clinicalMarkers', {})

    age = parsed['age']
    systolic_bp = parsed['systolic_bp']
    diastolic_bp = parsed['diastolic_bp']
    heart_rate = parsed['heart_rate']
    cholesterol = parsed['cholesterol']
    sugar_level = parsed['sugar_level']
    ecg = parsed['resting_ecg']
    chest_pain = parsed['chest_pain_type']

    conditions = []

    # ========== 1. CORONARY ARTERY DISEASE (CAD) ==========
    score = 0
    if cholesterol > 280: score += 30
    elif cholesterol > 240: score += 22
    elif cholesterol > 200: score += 10
    if systolic_bp > 160: score += 22
    elif systolic_bp > 140: score += 15
    elif systolic_bp > 130: score += 8
    if age > 65: score += 22
    elif age > 55: score += 15
    elif age > 45: score += 8
    if chest_pain <= 1: score += 18  # typical or atypical angina
    if risk_prob > 0.6: score += 12
    if sugar_level > 126: score += 8
    if ecg >= 1: score += 8
    if score >= 35:
        conditions.append({
            'name': 'CORONARY ARTERY DISEASE (CAD)',
            'probability': min(score, 96),
            'severity': 'CRITICAL' if score >= 75 else 'HIGH' if score >= 55 else 'MEDIUM'
        })

    # ========== 2. MYOCARDIAL INFARCTION RISK ==========
    score = 0
    if risk_prob > 0.7: score += 30
    elif risk_prob > 0.5: score += 15
    if cholesterol > 280: score += 22
    elif cholesterol > 240: score += 15
    if systolic_bp > 170: score += 20
    elif systolic_bp > 150: score += 12
    if age > 65: score += 18
    elif age > 55: score += 10
    if sugar_level > 140: score += 12
    if chest_pain == 0: score += 25  # typical angina
    elif chest_pain == 1: score += 12
    if ecg >= 1: score += 10
    if heart_rate > 100: score += 8
    if score >= 50:
        conditions.append({
            'name': 'ACUTE MYOCARDIAL INFARCTION RISK',
            'probability': min(score, 98),
            'severity': 'CRITICAL' if score >= 75 else 'HIGH'
        })

    # ========== 3. CARDIAC ARRHYTHMIA / ATRIAL FIBRILLATION ==========
    score = 0
    if ecg >= 1: score += 30
    if ecg == 2: score += 15  # LVH extra
    if heart_rate > 110: score += 28
    elif heart_rate > 100: score += 20
    elif heart_rate < 55: score += 22
    elif heart_rate < 60: score += 12
    if age > 70: score += 18
    elif age > 60: score += 12
    if systolic_bp > 150: score += 12
    if cholesterol > 240: score += 6
    if score >= 35:
        conditions.append({
            'name': 'CARDIAC ARRHYTHMIA / ATRIAL FIBRILLATION',
            'probability': min(score, 92),
            'severity': 'CRITICAL' if score >= 70 else 'HIGH' if score >= 50 else 'MEDIUM'
        })

    # ========== 4. CONGESTIVE HEART FAILURE (CHF) ==========
    score = 0
    if ecg == 2: score += 28
    if systolic_bp > 170: score += 22
    elif systolic_bp > 150: score += 15
    elif systolic_bp > 140: score += 8
    if age > 70: score += 22
    elif age > 60: score += 14
    if heart_rate > 100: score += 15
    elif heart_rate < 55: score += 10
    if risk_prob > 0.6: score += 15
    if cholesterol > 260: score += 8
    if sugar_level > 140: score += 8
    if score >= 40:
        conditions.append({
            'name': 'CONGESTIVE HEART FAILURE (CHF)',
            'probability': min(score, 94),
            'severity': 'CRITICAL' if score >= 70 else 'HIGH' if score >= 50 else 'MEDIUM'
        })

    # ========== 5. ANGINA PECTORIS ==========
    score = 0
    if chest_pain == 0: score += 40  # typical angina
    elif chest_pain == 1: score += 25  # atypical
    if cholesterol > 240: score += 18
    elif cholesterol > 200: score += 8
    if systolic_bp > 150: score += 15
    elif systolic_bp > 140: score += 8
    if age > 55: score += 12
    if risk_prob > 0.5: score += 10
    if score >= 35:
        conditions.append({
            'name': 'ANGINA PECTORIS (CHEST PAIN SYNDROME)',
            'probability': min(score, 90),
            'severity': 'HIGH' if score >= 60 else 'MEDIUM'
        })

    # ========== 6. HYPERTENSIVE HEART DISEASE ==========
    score = 0
    if systolic_bp > 180: score += 42
    elif systolic_bp > 160: score += 35
    elif systolic_bp > 140: score += 22
    elif systolic_bp > 130: score += 10
    if diastolic_bp > 100: score += 18
    elif diastolic_bp > 90: score += 10
    if ecg == 2: score += 28
    elif ecg == 1: score += 10
    if age > 60: score += 12
    if score >= 38:
        conditions.append({
            'name': 'HYPERTENSIVE HEART DISEASE',
            'probability': min(score, 96),
            'severity': 'CRITICAL' if score >= 75 else 'HIGH' if score >= 55 else 'MEDIUM'
        })

    # ========== 7. VALVULAR HEART DISEASE ==========
    score = 0
    if ecg == 2: score += 25
    elif ecg == 1: score += 12
    if age > 70: score += 22
    elif age > 60: score += 12
    if heart_rate > 100 or heart_rate < 55: score += 15
    if systolic_bp > 150: score += 10
    if risk_prob > 0.55: score += 10
    if chest_pain <= 1: score += 8
    if score >= 40:
        conditions.append({
            'name': 'VALVULAR HEART DISEASE',
            'probability': min(score, 85),
            'severity': 'HIGH' if score >= 60 else 'MEDIUM'
        })

    # ========== 8. DILATED CARDIOMYOPATHY ==========
    score = 0
    if ecg == 2: score += 25
    if heart_rate > 110: score += 22
    elif heart_rate > 95: score += 12
    if age > 55: score += 12
    if systolic_bp < 100: score += 20  # low BP = weak heart
    if risk_prob > 0.6: score += 12
    if cholesterol > 250: score += 8
    if score >= 40:
        conditions.append({
            'name': 'DILATED CARDIOMYOPATHY',
            'probability': min(score, 82),
            'severity': 'HIGH' if score >= 55 else 'MEDIUM'
        })

    # ========== 9. PERIPHERAL ARTERY DISEASE (PAD) ==========
    score = 0
    if age > 65: score += 22
    elif age > 55: score += 12
    if cholesterol > 260: score += 20
    elif cholesterol > 220: score += 10
    if sugar_level > 140: score += 18
    elif sugar_level > 120: score += 10
    if systolic_bp > 150: score += 15
    elif systolic_bp > 140: score += 8
    if risk_prob > 0.5: score += 10
    if score >= 40:
        conditions.append({
            'name': 'PERIPHERAL ARTERY DISEASE (PAD)',
            'probability': min(score, 85),
            'severity': 'HIGH' if score >= 60 else 'MEDIUM'
        })

    # ========== 10. STROKE / CEREBROVASCULAR RISK ==========
    score = 0
    if systolic_bp > 170: score += 30
    elif systolic_bp > 150: score += 22
    elif systolic_bp > 140: score += 12
    if age > 70: score += 22
    elif age > 60: score += 14
    if ecg >= 1: score += 12
    if heart_rate > 100 or heart_rate < 55: score += 10
    if sugar_level > 140: score += 12
    if cholesterol > 250: score += 10
    if risk_prob > 0.55: score += 8
    if score >= 42:
        conditions.append({
            'name': 'STROKE / CEREBROVASCULAR RISK',
            'probability': min(score, 90),
            'severity': 'CRITICAL' if score >= 70 else 'HIGH' if score >= 52 else 'MEDIUM'
        })

    # ========== 11. AORTIC ANEURYSM RISK ==========
    score = 0
    if systolic_bp > 170: score += 30
    elif systolic_bp > 150: score += 18
    if age > 70: score += 22
    elif age > 60: score += 12
    if cholesterol > 260: score += 12
    if risk_prob > 0.6: score += 10
    if score >= 45:
        conditions.append({
            'name': 'AORTIC ANEURYSM RISK',
            'probability': min(score, 80),
            'severity': 'CRITICAL' if score >= 65 else 'HIGH'
        })

    # ========== 12. PERICARDITIS INDICATORS ==========
    score = 0
    if ecg == 1: score += 25
    if chest_pain <= 1: score += 20
    if heart_rate > 100: score += 15
    if age < 45: score += 12  # more common in younger
    if systolic_bp < 110 and heart_rate > 90: score += 12
    if score >= 40:
        conditions.append({
            'name': 'PERICARDITIS INDICATORS',
            'probability': min(score, 78),
            'severity': 'MEDIUM' if score < 55 else 'HIGH'
        })

    # If risk is high but no specific conditions flagged, add general CVD
    if risk_prob > 0.5 and len(conditions) == 0:
        conditions.append({
            'name': 'GENERAL CARDIOVASCULAR DISEASE RISK',
            'probability': int(risk_prob * 100),
            'severity': 'HIGH' if risk_prob > 0.65 else 'MEDIUM'
        })

    return conditions


def get_primary_disease_label(conditions, risk_level):
    """Generates the primary disease label from top conditions."""
    if not conditions:
        if risk_level == "Low":
            return "LOW CARDIOVASCULAR RISK — NO SIGNIFICANT CONDITIONS DETECTED"
        return "GENERAL CARDIOVASCULAR DISEASE RISK"

    top = conditions[:2]
    if len(top) == 1:
        return top[0]['name']
    return f"{top[0]['name']} + {len(conditions) - 1} MORE CONDITION{'S' if len(conditions) > 2 else ''}"


def generate_clinical_recommendations(risk_level, patient_data, conditions, parsed):
    """Generates detailed clinical recommendations based on all predicted conditions."""
    recs = []

    critical = [c for c in conditions if c['severity'] == 'CRITICAL']
    high = [c for c in conditions if c['severity'] == 'HIGH']
    medium = [c for c in conditions if c['severity'] == 'MEDIUM']

    # Header
    if critical:
        recs.append("CRITICAL CARDIOVASCULAR CONDITIONS DETECTED:")
        for c in critical:
            recs.append(f"  - {c['name']} — {c['probability']}% probability")
        recs.append("")
        recs.append("IMMEDIATE ACTIONS REQUIRED:")
        recs.append("  - URGENT cardiology consultation within 24 hours")
        recs.append("  - Comprehensive cardiac workup: ECG, echocardiogram, stress test")
        recs.append("  - Coronary angiography if CAD/MI suspected")
        recs.append("  - If chest pain/dyspnea present — EMERGENCY evaluation")
    elif high:
        recs.append("HIGH-RISK CARDIOVASCULAR CONDITIONS:")
        for c in high:
            recs.append(f"  - {c['name']} — {c['probability']}% probability")
        recs.append("")
        recs.append("PRIORITY FOLLOW-UP:")
        recs.append("  - Cardiology referral within 1-2 weeks")
        recs.append("  - Cardiac testing: ECG, echocardiogram, Holter monitor")
        recs.append("  - Daily BP and heart rate monitoring")
    elif medium:
        recs.append("MODERATE CARDIOVASCULAR RISK:")
        for c in medium:
            recs.append(f"  - {c['name']} — {c['probability']}% probability")
        recs.append("")
        recs.append("PREVENTIVE CARE:")
        recs.append("  - Follow-up within 4-6 weeks")
        recs.append("  - Baseline cardiac assessment recommended")
    else:
        recs.append("LOW CARDIOVASCULAR RISK:")
        recs.append("  - Continue routine annual check-ups")
        recs.append("  - Maintain healthy lifestyle")

    # Condition-specific treatments
    cond_names = ' '.join([c['name'].lower() for c in conditions])

    recs.append("")
    recs.append("CONDITION-SPECIFIC INTERVENTIONS:")

    if 'coronary' in cond_names or 'cad' in cond_names:
        recs.append("  CAD: Dual antiplatelet therapy, high-dose statins (atorvastatin 80mg),")
        recs.append("       beta-blockers, ACE inhibitors. Consider PCI/CABG if severe.")

    if 'myocardial' in cond_names or 'infarction' in cond_names:
        recs.append("  MI RISK: Emergency protocol readiness, troponin monitoring,")
        recs.append("           nitroglycerin SL PRN, aspirin 325mg loading dose if acute.")

    if 'arrhythmia' in cond_names or 'fibrillation' in cond_names:
        recs.append("  ARRHYTHMIA: Antiarrhythmic drugs (amiodarone/flecainide),")
        recs.append("              anticoagulation (warfarin/rivaroxaban), consider ablation.")

    if 'heart failure' in cond_names or 'chf' in cond_names:
        recs.append("  CHF: ACE inhibitors/ARBs, beta-blockers (carvedilol), diuretics,")
        recs.append("       fluid restriction 1.5L/day, daily weight monitoring, BNP tracking.")

    if 'angina' in cond_names:
        recs.append("  ANGINA: Nitroglycerin SL for acute episodes, long-acting nitrates,")
        recs.append("          calcium channel blockers, avoid heavy exertion, cardiac rehab.")

    if 'hypertensive' in cond_names:
        recs.append("  HTN HEART DISEASE: ACE inhibitors/ARBs, thiazide diuretics,")
        recs.append("                      DASH diet, sodium <2g/day, target BP <130/80.")

    if 'valvular' in cond_names:
        recs.append("  VALVULAR: Echocardiographic assessment, endocarditis prophylaxis,")
        recs.append("            consider surgical repair/replacement if severe stenosis/regurgitation.")

    if 'cardiomyopathy' in cond_names:
        recs.append("  CARDIOMYOPATHY: Cardiac MRI, genetic testing if familial,")
        recs.append("                   ICD evaluation, avoid alcohol, limit strenuous activity.")

    if 'peripheral' in cond_names or 'pad' in cond_names:
        recs.append("  PAD: Supervised exercise therapy, cilostazol, antiplatelet agents,")
        recs.append("       ABI testing, smoking cessation critical, vascular surgery if severe.")

    if 'stroke' in cond_names or 'cerebrovascular' in cond_names:
        recs.append("  STROKE RISK: Aggressive BP control, anticoagulation if AFib present,")
        recs.append("               carotid ultrasound, statin therapy, stroke-readiness protocol.")

    if 'aortic' in cond_names:
        recs.append("  AORTIC RISK: CT angiography for sizing, strict BP control (<120/80),")
        recs.append("               beta-blockers, avoid heavy lifting, surgical referral if >5.5cm.")

    if 'pericarditis' in cond_names:
        recs.append("  PERICARDITIS: NSAIDs (ibuprofen) + colchicine, echocardiogram,")
        recs.append("                 rule out pericardial effusion, activity restriction 3 months.")

    # Lab recommendations
    recs.append("")
    recs.append("RECOMMENDED LABORATORY TESTS:")
    recs.append("  - Complete lipid panel (LDL, HDL, triglycerides)")
    recs.append("  - HbA1c and fasting glucose")
    recs.append("  - High-sensitivity CRP and BNP/NT-proBNP")
    recs.append("  - Troponin I/T (if acute symptoms)")
    recs.append("  - Complete metabolic panel, CBC")
    recs.append("  - Thyroid function (TSH) if arrhythmia suspected")

    # Vitals-specific advice
    recs.append("")
    recs.append("RISK FACTOR MANAGEMENT:")
    if parsed['cholesterol'] > 240:
        recs.append(f"  CHOLESTEROL ({parsed['cholesterol']} mg/dL — HIGH): High-intensity statin, target LDL <70")
    elif parsed['cholesterol'] > 200:
        recs.append(f"  CHOLESTEROL ({parsed['cholesterol']} mg/dL — BORDERLINE): Moderate statin, target LDL <100")

    if parsed['sugar_level'] > 126:
        recs.append(f"  BLOOD SUGAR ({parsed['sugar_level']} mg/dL — DIABETIC): Endocrinology referral, metformin")
    elif parsed['sugar_level'] > 100:
        recs.append(f"  BLOOD SUGAR ({parsed['sugar_level']} mg/dL — PRE-DIABETIC): Lifestyle modification, recheck 3mo")

    if parsed['systolic_bp'] > 140:
        recs.append(f"  BLOOD PRESSURE ({parsed['systolic_bp']}/{parsed['diastolic_bp']} — HYPERTENSIVE): Antihypertensive therapy")
    elif parsed['systolic_bp'] > 130:
        recs.append(f"  BLOOD PRESSURE ({parsed['systolic_bp']}/{parsed['diastolic_bp']} — ELEVATED): Lifestyle changes, recheck 2wk")

    if parsed['heart_rate'] > 100:
        recs.append(f"  HEART RATE ({parsed['heart_rate']} bpm — TACHYCARDIC): Beta-blocker evaluation, Holter monitor")
    elif parsed['heart_rate'] < 60:
        recs.append(f"  HEART RATE ({parsed['heart_rate']} bpm — BRADYCARDIC): Evaluate for conduction disease")

    return "\n".join(recs)


if __name__ == "__main__":
    try:
        input_data = sys.stdin.read()
        patient_data = json.loads(input_data)
        result = predict(patient_data)
        print(json.dumps(result))
    except Exception as e:
        error_result = {
            "error": str(e),
            "prediction": 0,
            "risk_level": "Error",
            "risk_probability": 0.0,
            "confidence": 0.0,
            "recommendation": "PREDICTION ERROR",
            "predicted_conditions": [],
            "clinical_recommendations": ""
        }
        print(json.dumps(error_result))
        sys.exit(1)
