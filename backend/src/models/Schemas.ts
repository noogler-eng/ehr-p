import mongoose from 'mongoose';

// 1. User Master Profile - Informative Identity
const UserSchema = new mongoose.Schema({
    walletAddress: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    role: { type: String, enum: ['Patient', 'Doctor', 'Lab Technician', 'Pharmacist', 'Admin'], default: 'Patient' }, 
    age: { type: Number, required: true },
    gender: { type: String, required: true },
    bloodGroup: { type: String, required: true },
    activeMedications: [String], // Cumulative list across visits
    lastUpdated: { type: Date, default: Date.now }
});

// 2. EHR History - ONE record per patient that continuously updates
const EHRSchema = new mongoose.Schema({
    patientAddress: { type: String, required: true, unique: true, index: true }, // UNIQUE: One record per patient
    primaryDoctorId: { type: String }, // Most recent/primary doctor

    // Current/Latest Clinical Data
    clinicalData: {
        symptoms: [String], // Accumulated symptoms over time
        vitals: {
            bp: String,
            heartRate: Number,
            cholesterol: Number,
            sugarLevel: Number
        }
    },

    // Latest AI Prediction
    prediction: {
        riskLevel: String, // High/Medium/Low from AI models
        summary: String, // Gemini AI summary
        xgboostRisk: Number, // XGBoost risk probability (0-1)
        xgboostConfidence: Number, // XGBoost confidence score
        recommendation: String, // Primary disease label
        predicted_conditions: [{ // All detected cardiovascular conditions
            name: String,
            probability: Number,
            severity: String
        }],
        clinical_recommendations: String // Detailed clinical recommendations
    },

    // Prescriptions (accumulated over time)
    prescriptions: [{
        medicineName: String,
        dosage: String,
        duration: String,
        frequency: String, // Once daily, Twice daily, etc.
        timing: String, // Before meals, After meals, etc.
        instructions: String, // Special instructions
        prescribedBy: String, // Doctor wallet address
        prescribedDate: { type: Date, default: Date.now }
    }],

    doctorRecommendations: String, // Latest doctor recommendations
    patientNotes: String, // Patient's self-reported notes

    // Medical Images (accumulated over time)
    images: [{
        type: {type: String, enum: ['lab_report', 'medical_imaging', 'prescription', 'other']},
        filename: String,
        path: String,
        uploadedBy: String, // Wallet address of uploader
        uploadedByRole: String, // Doctor/Patient
        uploadDate: {type: Date, default: Date.now}
    }],

    // Update History Timeline
    updateHistory: [{
        timestamp: { type: Date, default: Date.now },
        updatedBy: String, // Wallet address
        updatedByRole: String, // Doctor/Patient
        action: String, // 'INITIAL_CREATE', 'VITALS_UPDATE', 'PRESCRIPTIONS_ADDED', 'PATIENT_UPDATE', 'AI_REANALYSIS'
        description: String, // Human-readable description of update
        changes: mongoose.Schema.Types.Mixed, // What changed (field names)
        txHash: String // Blockchain transaction hash for this update
    }],

    blockchainTxHash: String, // Initial creation transaction hash
    createdAt: { type: Date, default: Date.now },
    lastModified: { type: Date, default: Date.now }
});

// 3. Blockchain Ledger - Simulated blockchain transactions stored in MongoDB
const BlockchainLedgerSchema = new mongoose.Schema({
    txHash: { type: String, required: true, unique: true, index: true },
    blockNumber: { type: Number, required: true },
    timestamp: { type: Date, default: Date.now },
    from: String, // Wallet address of transaction initiator
    to: String, // Contract address or recipient
    recordId: { type: mongoose.Schema.Types.ObjectId, ref: 'EHR' }, // Reference to EHR record
    action: { type: String, enum: ['CREATE_RECORD', 'UPDATE_RECORD', 'GRANT_ACCESS', 'REVOKE_ACCESS'] },
    data: mongoose.Schema.Types.Mixed, // Additional transaction data
    gasUsed: Number, // Simulated gas
    status: { type: String, enum: ['pending', 'confirmed', 'failed'], default: 'confirmed' }
});

// 4. Chat Messages - Doctor-Patient messaging
const ChatSchema = new mongoose.Schema({
    participants: {
        doctorAddress: { type: String, required: true, index: true },
        patientAddress: { type: String, required: true, index: true }
    },
    messages: [{
        sender: { type: String, required: true }, // wallet address
        senderRole: { type: String, enum: ['Doctor', 'Patient'] },
        senderName: String,
        text: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
        read: { type: Boolean, default: false }
    }],
    lastMessage: { type: Date, default: Date.now }
});
ChatSchema.index({ 'participants.doctorAddress': 1, 'participants.patientAddress': 1 }, { unique: true });

// 5. Follow-up Reminders - Doctor sets follow-up dates
const FollowUpSchema = new mongoose.Schema({
    patientAddress: { type: String, required: true, index: true },
    doctorAddress: { type: String, required: true, index: true },
    doctorName: String,
    followUpDate: { type: Date, required: true },
    reason: { type: String, required: true },
    notes: String,
    priority: { type: String, enum: ['routine', 'important', 'urgent'], default: 'routine' },
    status: { type: String, enum: ['pending', 'completed', 'missed', 'cancelled'], default: 'pending' },
    createdAt: { type: Date, default: Date.now }
});

// 6. Medication Tracker - Patient logs daily medication intake
const MedicationLogSchema = new mongoose.Schema({
    patientAddress: { type: String, required: true, index: true },
    medicineName: { type: String, required: true },
    dosage: String,
    date: { type: String, required: true }, // YYYY-MM-DD format
    status: { type: String, enum: ['taken', 'missed', 'skipped'], required: true },
    time: String, // HH:MM when taken
    notes: String,
    loggedAt: { type: Date, default: Date.now }
});
MedicationLogSchema.index({ patientAddress: 1, date: 1, medicineName: 1 }, { unique: true });

// 7. Vitals History - Snapshots of vitals over time for charting
const VitalsHistorySchema = new mongoose.Schema({
    patientAddress: { type: String, required: true, index: true },
    recordedBy: String, // doctor wallet address
    date: { type: Date, default: Date.now },
    vitals: {
        bp: String,
        systolicBP: Number,
        diastolicBP: Number,
        heartRate: Number,
        cholesterol: Number,
        sugarLevel: Number
    }
});

export const User = mongoose.model('User', UserSchema);
export const EHR = mongoose.model('EHR', EHRSchema);
export const BlockchainLedger = mongoose.model('BlockchainLedger', BlockchainLedgerSchema);
export const Chat = mongoose.model('Chat', ChatSchema);
export const FollowUp = mongoose.model('FollowUp', FollowUpSchema);
export const MedicationLog = mongoose.model('MedicationLog', MedicationLogSchema);
export const VitalsHistory = mongoose.model('VitalsHistory', VitalsHistorySchema);