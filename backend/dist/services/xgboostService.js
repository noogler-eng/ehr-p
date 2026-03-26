/**
 * XGBoost Disease Prediction Service
 * Integrates the Python XGBoost model with Node.js backend.
 * Supports multi-disease cardiovascular prediction with 12+ conditions.
 */
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
/**
 * Calls the Python XGBoost model for multi-disease cardiovascular prediction.
 */
export async function predictDisease(patientData) {
    return new Promise((resolve, reject) => {
        const pythonScript = path.join(__dirname, '../../ml_model/predict.py');
        const pythonExecutable = path.join(__dirname, '../../ml_model/venv/bin/python');
        const pythonProcess = spawn(pythonExecutable, [pythonScript]);
        let dataString = '';
        let errorString = '';
        pythonProcess.stdout.on('data', (data) => {
            dataString += data.toString();
        });
        pythonProcess.stderr.on('data', (data) => {
            errorString += data.toString();
        });
        pythonProcess.on('close', (code) => {
            if (code !== 0) {
                console.error('Python process error:', errorString);
                reject(new Error(`XGBoost prediction failed: ${errorString}`));
                return;
            }
            try {
                const result = JSON.parse(dataString);
                // Ensure all fields exist with defaults
                resolve({
                    prediction: result.prediction ?? 0,
                    risk_level: result.risk_level ?? 'Unknown',
                    risk_probability: result.risk_probability ?? 0,
                    confidence: result.confidence ?? 0,
                    recommendation: result.recommendation ?? 'Assessment unavailable',
                    predicted_conditions: result.predicted_conditions ?? [],
                    clinical_recommendations: result.clinical_recommendations ?? '',
                    error: result.error
                });
            }
            catch (error) {
                console.error('Failed to parse Python output:', dataString);
                reject(new Error('Failed to parse prediction result'));
            }
        });
        pythonProcess.stdin.write(JSON.stringify(patientData));
        pythonProcess.stdin.end();
        pythonProcess.on('error', (error) => {
            console.error('Failed to start Python process:', error);
            reject(new Error('Failed to start prediction service'));
        });
    });
}
//# sourceMappingURL=xgboostService.js.map