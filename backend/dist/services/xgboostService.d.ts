/**
 * XGBoost Disease Prediction Service
 * Integrates the Python XGBoost model with Node.js backend.
 * Supports multi-disease cardiovascular prediction with 12+ conditions.
 */
interface PatientData {
    vitals: {
        bp: string;
        heartRate: number;
        cholesterol: number;
        sugarLevel: number;
        ecgResult?: string;
    };
    clinicalMarkers?: {
        chestPainType?: string;
    };
    age?: number;
}
interface PredictedCondition {
    name: string;
    probability: number;
    severity: string;
}
interface PredictionResult {
    prediction: number;
    risk_level: string;
    risk_probability: number;
    confidence: number;
    recommendation: string;
    predicted_conditions: PredictedCondition[];
    clinical_recommendations: string;
    error?: string;
}
/**
 * Calls the Python XGBoost model for multi-disease cardiovascular prediction.
 */
export declare function predictDisease(patientData: PatientData): Promise<PredictionResult>;
export {};
//# sourceMappingURL=xgboostService.d.ts.map