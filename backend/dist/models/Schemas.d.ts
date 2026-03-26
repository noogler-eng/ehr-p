import mongoose from 'mongoose';
export declare const User: mongoose.Model<{
    walletAddress: string;
    name: string;
    role: "Patient" | "Doctor" | "Lab Technician" | "Pharmacist" | "Admin";
    age: number;
    gender: string;
    bloodGroup: string;
    activeMedications: string[];
    lastUpdated: NativeDate;
}, {}, {}, {
    id: string;
}, mongoose.Document<unknown, {}, {
    walletAddress: string;
    name: string;
    role: "Patient" | "Doctor" | "Lab Technician" | "Pharmacist" | "Admin";
    age: number;
    gender: string;
    bloodGroup: string;
    activeMedications: string[];
    lastUpdated: NativeDate;
}, {
    id: string;
}, mongoose.DefaultSchemaOptions> & Omit<{
    walletAddress: string;
    name: string;
    role: "Patient" | "Doctor" | "Lab Technician" | "Pharmacist" | "Admin";
    age: number;
    gender: string;
    bloodGroup: string;
    activeMedications: string[];
    lastUpdated: NativeDate;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, {
    walletAddress: string;
    name: string;
    role: "Patient" | "Doctor" | "Lab Technician" | "Pharmacist" | "Admin";
    age: number;
    gender: string;
    bloodGroup: string;
    activeMedications: string[];
    lastUpdated: NativeDate;
}, mongoose.Document<unknown, {}, {
    walletAddress: string;
    name: string;
    role: "Patient" | "Doctor" | "Lab Technician" | "Pharmacist" | "Admin";
    age: number;
    gender: string;
    bloodGroup: string;
    activeMedications: string[];
    lastUpdated: NativeDate;
}, {
    id: string;
}, mongoose.ResolveSchemaOptions<mongoose.DefaultSchemaOptions>> & Omit<{
    walletAddress: string;
    name: string;
    role: "Patient" | "Doctor" | "Lab Technician" | "Pharmacist" | "Admin";
    age: number;
    gender: string;
    bloodGroup: string;
    activeMedications: string[];
    lastUpdated: NativeDate;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    [path: string]: mongoose.SchemaDefinitionProperty<undefined, any, any>;
} | {
    [x: string]: mongoose.SchemaDefinitionProperty<any, any, mongoose.Document<unknown, {}, {
        walletAddress: string;
        name: string;
        role: "Patient" | "Doctor" | "Lab Technician" | "Pharmacist" | "Admin";
        age: number;
        gender: string;
        bloodGroup: string;
        activeMedications: string[];
        lastUpdated: NativeDate;
    }, {
        id: string;
    }, mongoose.ResolveSchemaOptions<mongoose.DefaultSchemaOptions>> & Omit<{
        walletAddress: string;
        name: string;
        role: "Patient" | "Doctor" | "Lab Technician" | "Pharmacist" | "Admin";
        age: number;
        gender: string;
        bloodGroup: string;
        activeMedications: string[];
        lastUpdated: NativeDate;
    } & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, {
    walletAddress: string;
    name: string;
    role: "Patient" | "Doctor" | "Lab Technician" | "Pharmacist" | "Admin";
    age: number;
    gender: string;
    bloodGroup: string;
    activeMedications: string[];
    lastUpdated: NativeDate;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>, {
    walletAddress: string;
    name: string;
    role: "Patient" | "Doctor" | "Lab Technician" | "Pharmacist" | "Admin";
    age: number;
    gender: string;
    bloodGroup: string;
    activeMedications: string[];
    lastUpdated: NativeDate;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;
export declare const EHR: mongoose.Model<{
    patientAddress: string;
    prescriptions: mongoose.Types.DocumentArray<{
        prescribedDate: NativeDate;
        medicineName?: string | null;
        dosage?: string | null;
        duration?: string | null;
        frequency?: string | null;
        timing?: string | null;
        instructions?: string | null;
        prescribedBy?: string | null;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        prescribedDate: NativeDate;
        medicineName?: string | null;
        dosage?: string | null;
        duration?: string | null;
        frequency?: string | null;
        timing?: string | null;
        instructions?: string | null;
        prescribedBy?: string | null;
    }> & {
        prescribedDate: NativeDate;
        medicineName?: string | null;
        dosage?: string | null;
        duration?: string | null;
        frequency?: string | null;
        timing?: string | null;
        instructions?: string | null;
        prescribedBy?: string | null;
    }>;
    images: mongoose.Types.DocumentArray<{
        uploadDate: NativeDate;
        type?: "lab_report" | "medical_imaging" | "prescription" | "other" | null;
        filename?: string | null;
        path?: string | null;
        uploadedBy?: string | null;
        uploadedByRole?: string | null;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        uploadDate: NativeDate;
        type?: "lab_report" | "medical_imaging" | "prescription" | "other" | null;
        filename?: string | null;
        path?: string | null;
        uploadedBy?: string | null;
        uploadedByRole?: string | null;
    }> & {
        uploadDate: NativeDate;
        type?: "lab_report" | "medical_imaging" | "prescription" | "other" | null;
        filename?: string | null;
        path?: string | null;
        uploadedBy?: string | null;
        uploadedByRole?: string | null;
    }>;
    updateHistory: mongoose.Types.DocumentArray<{
        timestamp: NativeDate;
        updatedBy?: string | null;
        updatedByRole?: string | null;
        action?: string | null;
        description?: string | null;
        changes?: any;
        txHash?: string | null;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        timestamp: NativeDate;
        updatedBy?: string | null;
        updatedByRole?: string | null;
        action?: string | null;
        description?: string | null;
        changes?: any;
        txHash?: string | null;
    }> & {
        timestamp: NativeDate;
        updatedBy?: string | null;
        updatedByRole?: string | null;
        action?: string | null;
        description?: string | null;
        changes?: any;
        txHash?: string | null;
    }>;
    createdAt: NativeDate;
    lastModified: NativeDate;
    doctorRecommendations?: string | null;
    patientNotes?: string | null;
    blockchainTxHash?: string | null;
    primaryDoctorId?: string | null;
    clinicalData?: {
        symptoms: string[];
        vitals?: {
            bp?: string | null;
            heartRate?: number | null;
            cholesterol?: number | null;
            sugarLevel?: number | null;
        } | null;
    } | null;
    prediction?: {
        predicted_conditions: mongoose.Types.DocumentArray<{
            name?: string | null;
            probability?: number | null;
            severity?: string | null;
        }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
            name?: string | null;
            probability?: number | null;
            severity?: string | null;
        }> & {
            name?: string | null;
            probability?: number | null;
            severity?: string | null;
        }>;
        riskLevel?: string | null;
        summary?: string | null;
        xgboostRisk?: number | null;
        xgboostConfidence?: number | null;
        recommendation?: string | null;
        clinical_recommendations?: string | null;
    } | null;
}, {}, {}, {
    id: string;
}, mongoose.Document<unknown, {}, {
    patientAddress: string;
    prescriptions: mongoose.Types.DocumentArray<{
        prescribedDate: NativeDate;
        medicineName?: string | null;
        dosage?: string | null;
        duration?: string | null;
        frequency?: string | null;
        timing?: string | null;
        instructions?: string | null;
        prescribedBy?: string | null;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        prescribedDate: NativeDate;
        medicineName?: string | null;
        dosage?: string | null;
        duration?: string | null;
        frequency?: string | null;
        timing?: string | null;
        instructions?: string | null;
        prescribedBy?: string | null;
    }> & {
        prescribedDate: NativeDate;
        medicineName?: string | null;
        dosage?: string | null;
        duration?: string | null;
        frequency?: string | null;
        timing?: string | null;
        instructions?: string | null;
        prescribedBy?: string | null;
    }>;
    images: mongoose.Types.DocumentArray<{
        uploadDate: NativeDate;
        type?: "lab_report" | "medical_imaging" | "prescription" | "other" | null;
        filename?: string | null;
        path?: string | null;
        uploadedBy?: string | null;
        uploadedByRole?: string | null;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        uploadDate: NativeDate;
        type?: "lab_report" | "medical_imaging" | "prescription" | "other" | null;
        filename?: string | null;
        path?: string | null;
        uploadedBy?: string | null;
        uploadedByRole?: string | null;
    }> & {
        uploadDate: NativeDate;
        type?: "lab_report" | "medical_imaging" | "prescription" | "other" | null;
        filename?: string | null;
        path?: string | null;
        uploadedBy?: string | null;
        uploadedByRole?: string | null;
    }>;
    updateHistory: mongoose.Types.DocumentArray<{
        timestamp: NativeDate;
        updatedBy?: string | null;
        updatedByRole?: string | null;
        action?: string | null;
        description?: string | null;
        changes?: any;
        txHash?: string | null;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        timestamp: NativeDate;
        updatedBy?: string | null;
        updatedByRole?: string | null;
        action?: string | null;
        description?: string | null;
        changes?: any;
        txHash?: string | null;
    }> & {
        timestamp: NativeDate;
        updatedBy?: string | null;
        updatedByRole?: string | null;
        action?: string | null;
        description?: string | null;
        changes?: any;
        txHash?: string | null;
    }>;
    createdAt: NativeDate;
    lastModified: NativeDate;
    doctorRecommendations?: string | null;
    patientNotes?: string | null;
    blockchainTxHash?: string | null;
    primaryDoctorId?: string | null;
    clinicalData?: {
        symptoms: string[];
        vitals?: {
            bp?: string | null;
            heartRate?: number | null;
            cholesterol?: number | null;
            sugarLevel?: number | null;
        } | null;
    } | null;
    prediction?: {
        predicted_conditions: mongoose.Types.DocumentArray<{
            name?: string | null;
            probability?: number | null;
            severity?: string | null;
        }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
            name?: string | null;
            probability?: number | null;
            severity?: string | null;
        }> & {
            name?: string | null;
            probability?: number | null;
            severity?: string | null;
        }>;
        riskLevel?: string | null;
        summary?: string | null;
        xgboostRisk?: number | null;
        xgboostConfidence?: number | null;
        recommendation?: string | null;
        clinical_recommendations?: string | null;
    } | null;
}, {
    id: string;
}, mongoose.DefaultSchemaOptions> & Omit<{
    patientAddress: string;
    prescriptions: mongoose.Types.DocumentArray<{
        prescribedDate: NativeDate;
        medicineName?: string | null;
        dosage?: string | null;
        duration?: string | null;
        frequency?: string | null;
        timing?: string | null;
        instructions?: string | null;
        prescribedBy?: string | null;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        prescribedDate: NativeDate;
        medicineName?: string | null;
        dosage?: string | null;
        duration?: string | null;
        frequency?: string | null;
        timing?: string | null;
        instructions?: string | null;
        prescribedBy?: string | null;
    }> & {
        prescribedDate: NativeDate;
        medicineName?: string | null;
        dosage?: string | null;
        duration?: string | null;
        frequency?: string | null;
        timing?: string | null;
        instructions?: string | null;
        prescribedBy?: string | null;
    }>;
    images: mongoose.Types.DocumentArray<{
        uploadDate: NativeDate;
        type?: "lab_report" | "medical_imaging" | "prescription" | "other" | null;
        filename?: string | null;
        path?: string | null;
        uploadedBy?: string | null;
        uploadedByRole?: string | null;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        uploadDate: NativeDate;
        type?: "lab_report" | "medical_imaging" | "prescription" | "other" | null;
        filename?: string | null;
        path?: string | null;
        uploadedBy?: string | null;
        uploadedByRole?: string | null;
    }> & {
        uploadDate: NativeDate;
        type?: "lab_report" | "medical_imaging" | "prescription" | "other" | null;
        filename?: string | null;
        path?: string | null;
        uploadedBy?: string | null;
        uploadedByRole?: string | null;
    }>;
    updateHistory: mongoose.Types.DocumentArray<{
        timestamp: NativeDate;
        updatedBy?: string | null;
        updatedByRole?: string | null;
        action?: string | null;
        description?: string | null;
        changes?: any;
        txHash?: string | null;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        timestamp: NativeDate;
        updatedBy?: string | null;
        updatedByRole?: string | null;
        action?: string | null;
        description?: string | null;
        changes?: any;
        txHash?: string | null;
    }> & {
        timestamp: NativeDate;
        updatedBy?: string | null;
        updatedByRole?: string | null;
        action?: string | null;
        description?: string | null;
        changes?: any;
        txHash?: string | null;
    }>;
    createdAt: NativeDate;
    lastModified: NativeDate;
    doctorRecommendations?: string | null;
    patientNotes?: string | null;
    blockchainTxHash?: string | null;
    primaryDoctorId?: string | null;
    clinicalData?: {
        symptoms: string[];
        vitals?: {
            bp?: string | null;
            heartRate?: number | null;
            cholesterol?: number | null;
            sugarLevel?: number | null;
        } | null;
    } | null;
    prediction?: {
        predicted_conditions: mongoose.Types.DocumentArray<{
            name?: string | null;
            probability?: number | null;
            severity?: string | null;
        }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
            name?: string | null;
            probability?: number | null;
            severity?: string | null;
        }> & {
            name?: string | null;
            probability?: number | null;
            severity?: string | null;
        }>;
        riskLevel?: string | null;
        summary?: string | null;
        xgboostRisk?: number | null;
        xgboostConfidence?: number | null;
        recommendation?: string | null;
        clinical_recommendations?: string | null;
    } | null;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, {
    patientAddress: string;
    prescriptions: mongoose.Types.DocumentArray<{
        prescribedDate: NativeDate;
        medicineName?: string | null;
        dosage?: string | null;
        duration?: string | null;
        frequency?: string | null;
        timing?: string | null;
        instructions?: string | null;
        prescribedBy?: string | null;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        prescribedDate: NativeDate;
        medicineName?: string | null;
        dosage?: string | null;
        duration?: string | null;
        frequency?: string | null;
        timing?: string | null;
        instructions?: string | null;
        prescribedBy?: string | null;
    }> & {
        prescribedDate: NativeDate;
        medicineName?: string | null;
        dosage?: string | null;
        duration?: string | null;
        frequency?: string | null;
        timing?: string | null;
        instructions?: string | null;
        prescribedBy?: string | null;
    }>;
    images: mongoose.Types.DocumentArray<{
        uploadDate: NativeDate;
        type?: "lab_report" | "medical_imaging" | "prescription" | "other" | null;
        filename?: string | null;
        path?: string | null;
        uploadedBy?: string | null;
        uploadedByRole?: string | null;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        uploadDate: NativeDate;
        type?: "lab_report" | "medical_imaging" | "prescription" | "other" | null;
        filename?: string | null;
        path?: string | null;
        uploadedBy?: string | null;
        uploadedByRole?: string | null;
    }> & {
        uploadDate: NativeDate;
        type?: "lab_report" | "medical_imaging" | "prescription" | "other" | null;
        filename?: string | null;
        path?: string | null;
        uploadedBy?: string | null;
        uploadedByRole?: string | null;
    }>;
    updateHistory: mongoose.Types.DocumentArray<{
        timestamp: NativeDate;
        updatedBy?: string | null;
        updatedByRole?: string | null;
        action?: string | null;
        description?: string | null;
        changes?: any;
        txHash?: string | null;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        timestamp: NativeDate;
        updatedBy?: string | null;
        updatedByRole?: string | null;
        action?: string | null;
        description?: string | null;
        changes?: any;
        txHash?: string | null;
    }> & {
        timestamp: NativeDate;
        updatedBy?: string | null;
        updatedByRole?: string | null;
        action?: string | null;
        description?: string | null;
        changes?: any;
        txHash?: string | null;
    }>;
    createdAt: NativeDate;
    lastModified: NativeDate;
    doctorRecommendations?: string | null;
    patientNotes?: string | null;
    blockchainTxHash?: string | null;
    primaryDoctorId?: string | null;
    clinicalData?: {
        symptoms: string[];
        vitals?: {
            bp?: string | null;
            heartRate?: number | null;
            cholesterol?: number | null;
            sugarLevel?: number | null;
        } | null;
    } | null;
    prediction?: {
        predicted_conditions: mongoose.Types.DocumentArray<{
            name?: string | null;
            probability?: number | null;
            severity?: string | null;
        }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
            name?: string | null;
            probability?: number | null;
            severity?: string | null;
        }> & {
            name?: string | null;
            probability?: number | null;
            severity?: string | null;
        }>;
        riskLevel?: string | null;
        summary?: string | null;
        xgboostRisk?: number | null;
        xgboostConfidence?: number | null;
        recommendation?: string | null;
        clinical_recommendations?: string | null;
    } | null;
}, mongoose.Document<unknown, {}, {
    patientAddress: string;
    prescriptions: mongoose.Types.DocumentArray<{
        prescribedDate: NativeDate;
        medicineName?: string | null;
        dosage?: string | null;
        duration?: string | null;
        frequency?: string | null;
        timing?: string | null;
        instructions?: string | null;
        prescribedBy?: string | null;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        prescribedDate: NativeDate;
        medicineName?: string | null;
        dosage?: string | null;
        duration?: string | null;
        frequency?: string | null;
        timing?: string | null;
        instructions?: string | null;
        prescribedBy?: string | null;
    }> & {
        prescribedDate: NativeDate;
        medicineName?: string | null;
        dosage?: string | null;
        duration?: string | null;
        frequency?: string | null;
        timing?: string | null;
        instructions?: string | null;
        prescribedBy?: string | null;
    }>;
    images: mongoose.Types.DocumentArray<{
        uploadDate: NativeDate;
        type?: "lab_report" | "medical_imaging" | "prescription" | "other" | null;
        filename?: string | null;
        path?: string | null;
        uploadedBy?: string | null;
        uploadedByRole?: string | null;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        uploadDate: NativeDate;
        type?: "lab_report" | "medical_imaging" | "prescription" | "other" | null;
        filename?: string | null;
        path?: string | null;
        uploadedBy?: string | null;
        uploadedByRole?: string | null;
    }> & {
        uploadDate: NativeDate;
        type?: "lab_report" | "medical_imaging" | "prescription" | "other" | null;
        filename?: string | null;
        path?: string | null;
        uploadedBy?: string | null;
        uploadedByRole?: string | null;
    }>;
    updateHistory: mongoose.Types.DocumentArray<{
        timestamp: NativeDate;
        updatedBy?: string | null;
        updatedByRole?: string | null;
        action?: string | null;
        description?: string | null;
        changes?: any;
        txHash?: string | null;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        timestamp: NativeDate;
        updatedBy?: string | null;
        updatedByRole?: string | null;
        action?: string | null;
        description?: string | null;
        changes?: any;
        txHash?: string | null;
    }> & {
        timestamp: NativeDate;
        updatedBy?: string | null;
        updatedByRole?: string | null;
        action?: string | null;
        description?: string | null;
        changes?: any;
        txHash?: string | null;
    }>;
    createdAt: NativeDate;
    lastModified: NativeDate;
    doctorRecommendations?: string | null;
    patientNotes?: string | null;
    blockchainTxHash?: string | null;
    primaryDoctorId?: string | null;
    clinicalData?: {
        symptoms: string[];
        vitals?: {
            bp?: string | null;
            heartRate?: number | null;
            cholesterol?: number | null;
            sugarLevel?: number | null;
        } | null;
    } | null;
    prediction?: {
        predicted_conditions: mongoose.Types.DocumentArray<{
            name?: string | null;
            probability?: number | null;
            severity?: string | null;
        }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
            name?: string | null;
            probability?: number | null;
            severity?: string | null;
        }> & {
            name?: string | null;
            probability?: number | null;
            severity?: string | null;
        }>;
        riskLevel?: string | null;
        summary?: string | null;
        xgboostRisk?: number | null;
        xgboostConfidence?: number | null;
        recommendation?: string | null;
        clinical_recommendations?: string | null;
    } | null;
}, {
    id: string;
}, mongoose.ResolveSchemaOptions<mongoose.DefaultSchemaOptions>> & Omit<{
    patientAddress: string;
    prescriptions: mongoose.Types.DocumentArray<{
        prescribedDate: NativeDate;
        medicineName?: string | null;
        dosage?: string | null;
        duration?: string | null;
        frequency?: string | null;
        timing?: string | null;
        instructions?: string | null;
        prescribedBy?: string | null;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        prescribedDate: NativeDate;
        medicineName?: string | null;
        dosage?: string | null;
        duration?: string | null;
        frequency?: string | null;
        timing?: string | null;
        instructions?: string | null;
        prescribedBy?: string | null;
    }> & {
        prescribedDate: NativeDate;
        medicineName?: string | null;
        dosage?: string | null;
        duration?: string | null;
        frequency?: string | null;
        timing?: string | null;
        instructions?: string | null;
        prescribedBy?: string | null;
    }>;
    images: mongoose.Types.DocumentArray<{
        uploadDate: NativeDate;
        type?: "lab_report" | "medical_imaging" | "prescription" | "other" | null;
        filename?: string | null;
        path?: string | null;
        uploadedBy?: string | null;
        uploadedByRole?: string | null;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        uploadDate: NativeDate;
        type?: "lab_report" | "medical_imaging" | "prescription" | "other" | null;
        filename?: string | null;
        path?: string | null;
        uploadedBy?: string | null;
        uploadedByRole?: string | null;
    }> & {
        uploadDate: NativeDate;
        type?: "lab_report" | "medical_imaging" | "prescription" | "other" | null;
        filename?: string | null;
        path?: string | null;
        uploadedBy?: string | null;
        uploadedByRole?: string | null;
    }>;
    updateHistory: mongoose.Types.DocumentArray<{
        timestamp: NativeDate;
        updatedBy?: string | null;
        updatedByRole?: string | null;
        action?: string | null;
        description?: string | null;
        changes?: any;
        txHash?: string | null;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        timestamp: NativeDate;
        updatedBy?: string | null;
        updatedByRole?: string | null;
        action?: string | null;
        description?: string | null;
        changes?: any;
        txHash?: string | null;
    }> & {
        timestamp: NativeDate;
        updatedBy?: string | null;
        updatedByRole?: string | null;
        action?: string | null;
        description?: string | null;
        changes?: any;
        txHash?: string | null;
    }>;
    createdAt: NativeDate;
    lastModified: NativeDate;
    doctorRecommendations?: string | null;
    patientNotes?: string | null;
    blockchainTxHash?: string | null;
    primaryDoctorId?: string | null;
    clinicalData?: {
        symptoms: string[];
        vitals?: {
            bp?: string | null;
            heartRate?: number | null;
            cholesterol?: number | null;
            sugarLevel?: number | null;
        } | null;
    } | null;
    prediction?: {
        predicted_conditions: mongoose.Types.DocumentArray<{
            name?: string | null;
            probability?: number | null;
            severity?: string | null;
        }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
            name?: string | null;
            probability?: number | null;
            severity?: string | null;
        }> & {
            name?: string | null;
            probability?: number | null;
            severity?: string | null;
        }>;
        riskLevel?: string | null;
        summary?: string | null;
        xgboostRisk?: number | null;
        xgboostConfidence?: number | null;
        recommendation?: string | null;
        clinical_recommendations?: string | null;
    } | null;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    [path: string]: mongoose.SchemaDefinitionProperty<undefined, any, any>;
} | {
    [x: string]: mongoose.SchemaDefinitionProperty<any, any, mongoose.Document<unknown, {}, {
        patientAddress: string;
        prescriptions: mongoose.Types.DocumentArray<{
            prescribedDate: NativeDate;
            medicineName?: string | null;
            dosage?: string | null;
            duration?: string | null;
            frequency?: string | null;
            timing?: string | null;
            instructions?: string | null;
            prescribedBy?: string | null;
        }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
            prescribedDate: NativeDate;
            medicineName?: string | null;
            dosage?: string | null;
            duration?: string | null;
            frequency?: string | null;
            timing?: string | null;
            instructions?: string | null;
            prescribedBy?: string | null;
        }> & {
            prescribedDate: NativeDate;
            medicineName?: string | null;
            dosage?: string | null;
            duration?: string | null;
            frequency?: string | null;
            timing?: string | null;
            instructions?: string | null;
            prescribedBy?: string | null;
        }>;
        images: mongoose.Types.DocumentArray<{
            uploadDate: NativeDate;
            type?: "lab_report" | "medical_imaging" | "prescription" | "other" | null;
            filename?: string | null;
            path?: string | null;
            uploadedBy?: string | null;
            uploadedByRole?: string | null;
        }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
            uploadDate: NativeDate;
            type?: "lab_report" | "medical_imaging" | "prescription" | "other" | null;
            filename?: string | null;
            path?: string | null;
            uploadedBy?: string | null;
            uploadedByRole?: string | null;
        }> & {
            uploadDate: NativeDate;
            type?: "lab_report" | "medical_imaging" | "prescription" | "other" | null;
            filename?: string | null;
            path?: string | null;
            uploadedBy?: string | null;
            uploadedByRole?: string | null;
        }>;
        updateHistory: mongoose.Types.DocumentArray<{
            timestamp: NativeDate;
            updatedBy?: string | null;
            updatedByRole?: string | null;
            action?: string | null;
            description?: string | null;
            changes?: any;
            txHash?: string | null;
        }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
            timestamp: NativeDate;
            updatedBy?: string | null;
            updatedByRole?: string | null;
            action?: string | null;
            description?: string | null;
            changes?: any;
            txHash?: string | null;
        }> & {
            timestamp: NativeDate;
            updatedBy?: string | null;
            updatedByRole?: string | null;
            action?: string | null;
            description?: string | null;
            changes?: any;
            txHash?: string | null;
        }>;
        createdAt: NativeDate;
        lastModified: NativeDate;
        doctorRecommendations?: string | null;
        patientNotes?: string | null;
        blockchainTxHash?: string | null;
        primaryDoctorId?: string | null;
        clinicalData?: {
            symptoms: string[];
            vitals?: {
                bp?: string | null;
                heartRate?: number | null;
                cholesterol?: number | null;
                sugarLevel?: number | null;
            } | null;
        } | null;
        prediction?: {
            predicted_conditions: mongoose.Types.DocumentArray<{
                name?: string | null;
                probability?: number | null;
                severity?: string | null;
            }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
                name?: string | null;
                probability?: number | null;
                severity?: string | null;
            }> & {
                name?: string | null;
                probability?: number | null;
                severity?: string | null;
            }>;
            riskLevel?: string | null;
            summary?: string | null;
            xgboostRisk?: number | null;
            xgboostConfidence?: number | null;
            recommendation?: string | null;
            clinical_recommendations?: string | null;
        } | null;
    }, {
        id: string;
    }, mongoose.ResolveSchemaOptions<mongoose.DefaultSchemaOptions>> & Omit<{
        patientAddress: string;
        prescriptions: mongoose.Types.DocumentArray<{
            prescribedDate: NativeDate;
            medicineName?: string | null;
            dosage?: string | null;
            duration?: string | null;
            frequency?: string | null;
            timing?: string | null;
            instructions?: string | null;
            prescribedBy?: string | null;
        }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
            prescribedDate: NativeDate;
            medicineName?: string | null;
            dosage?: string | null;
            duration?: string | null;
            frequency?: string | null;
            timing?: string | null;
            instructions?: string | null;
            prescribedBy?: string | null;
        }> & {
            prescribedDate: NativeDate;
            medicineName?: string | null;
            dosage?: string | null;
            duration?: string | null;
            frequency?: string | null;
            timing?: string | null;
            instructions?: string | null;
            prescribedBy?: string | null;
        }>;
        images: mongoose.Types.DocumentArray<{
            uploadDate: NativeDate;
            type?: "lab_report" | "medical_imaging" | "prescription" | "other" | null;
            filename?: string | null;
            path?: string | null;
            uploadedBy?: string | null;
            uploadedByRole?: string | null;
        }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
            uploadDate: NativeDate;
            type?: "lab_report" | "medical_imaging" | "prescription" | "other" | null;
            filename?: string | null;
            path?: string | null;
            uploadedBy?: string | null;
            uploadedByRole?: string | null;
        }> & {
            uploadDate: NativeDate;
            type?: "lab_report" | "medical_imaging" | "prescription" | "other" | null;
            filename?: string | null;
            path?: string | null;
            uploadedBy?: string | null;
            uploadedByRole?: string | null;
        }>;
        updateHistory: mongoose.Types.DocumentArray<{
            timestamp: NativeDate;
            updatedBy?: string | null;
            updatedByRole?: string | null;
            action?: string | null;
            description?: string | null;
            changes?: any;
            txHash?: string | null;
        }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
            timestamp: NativeDate;
            updatedBy?: string | null;
            updatedByRole?: string | null;
            action?: string | null;
            description?: string | null;
            changes?: any;
            txHash?: string | null;
        }> & {
            timestamp: NativeDate;
            updatedBy?: string | null;
            updatedByRole?: string | null;
            action?: string | null;
            description?: string | null;
            changes?: any;
            txHash?: string | null;
        }>;
        createdAt: NativeDate;
        lastModified: NativeDate;
        doctorRecommendations?: string | null;
        patientNotes?: string | null;
        blockchainTxHash?: string | null;
        primaryDoctorId?: string | null;
        clinicalData?: {
            symptoms: string[];
            vitals?: {
                bp?: string | null;
                heartRate?: number | null;
                cholesterol?: number | null;
                sugarLevel?: number | null;
            } | null;
        } | null;
        prediction?: {
            predicted_conditions: mongoose.Types.DocumentArray<{
                name?: string | null;
                probability?: number | null;
                severity?: string | null;
            }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
                name?: string | null;
                probability?: number | null;
                severity?: string | null;
            }> & {
                name?: string | null;
                probability?: number | null;
                severity?: string | null;
            }>;
            riskLevel?: string | null;
            summary?: string | null;
            xgboostRisk?: number | null;
            xgboostConfidence?: number | null;
            recommendation?: string | null;
            clinical_recommendations?: string | null;
        } | null;
    } & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, {
    patientAddress: string;
    prescriptions: mongoose.Types.DocumentArray<{
        prescribedDate: NativeDate;
        medicineName?: string | null;
        dosage?: string | null;
        duration?: string | null;
        frequency?: string | null;
        timing?: string | null;
        instructions?: string | null;
        prescribedBy?: string | null;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        prescribedDate: NativeDate;
        medicineName?: string | null;
        dosage?: string | null;
        duration?: string | null;
        frequency?: string | null;
        timing?: string | null;
        instructions?: string | null;
        prescribedBy?: string | null;
    }> & {
        prescribedDate: NativeDate;
        medicineName?: string | null;
        dosage?: string | null;
        duration?: string | null;
        frequency?: string | null;
        timing?: string | null;
        instructions?: string | null;
        prescribedBy?: string | null;
    }>;
    images: mongoose.Types.DocumentArray<{
        uploadDate: NativeDate;
        type?: "lab_report" | "medical_imaging" | "prescription" | "other" | null;
        filename?: string | null;
        path?: string | null;
        uploadedBy?: string | null;
        uploadedByRole?: string | null;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        uploadDate: NativeDate;
        type?: "lab_report" | "medical_imaging" | "prescription" | "other" | null;
        filename?: string | null;
        path?: string | null;
        uploadedBy?: string | null;
        uploadedByRole?: string | null;
    }> & {
        uploadDate: NativeDate;
        type?: "lab_report" | "medical_imaging" | "prescription" | "other" | null;
        filename?: string | null;
        path?: string | null;
        uploadedBy?: string | null;
        uploadedByRole?: string | null;
    }>;
    updateHistory: mongoose.Types.DocumentArray<{
        timestamp: NativeDate;
        updatedBy?: string | null;
        updatedByRole?: string | null;
        action?: string | null;
        description?: string | null;
        changes?: any;
        txHash?: string | null;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        timestamp: NativeDate;
        updatedBy?: string | null;
        updatedByRole?: string | null;
        action?: string | null;
        description?: string | null;
        changes?: any;
        txHash?: string | null;
    }> & {
        timestamp: NativeDate;
        updatedBy?: string | null;
        updatedByRole?: string | null;
        action?: string | null;
        description?: string | null;
        changes?: any;
        txHash?: string | null;
    }>;
    createdAt: NativeDate;
    lastModified: NativeDate;
    doctorRecommendations?: string | null;
    patientNotes?: string | null;
    blockchainTxHash?: string | null;
    primaryDoctorId?: string | null;
    clinicalData?: {
        symptoms: string[];
        vitals?: {
            bp?: string | null;
            heartRate?: number | null;
            cholesterol?: number | null;
            sugarLevel?: number | null;
        } | null;
    } | null;
    prediction?: {
        predicted_conditions: mongoose.Types.DocumentArray<{
            name?: string | null;
            probability?: number | null;
            severity?: string | null;
        }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
            name?: string | null;
            probability?: number | null;
            severity?: string | null;
        }> & {
            name?: string | null;
            probability?: number | null;
            severity?: string | null;
        }>;
        riskLevel?: string | null;
        summary?: string | null;
        xgboostRisk?: number | null;
        xgboostConfidence?: number | null;
        recommendation?: string | null;
        clinical_recommendations?: string | null;
    } | null;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>, {
    patientAddress: string;
    prescriptions: mongoose.Types.DocumentArray<{
        prescribedDate: NativeDate;
        medicineName?: string | null;
        dosage?: string | null;
        duration?: string | null;
        frequency?: string | null;
        timing?: string | null;
        instructions?: string | null;
        prescribedBy?: string | null;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        prescribedDate: NativeDate;
        medicineName?: string | null;
        dosage?: string | null;
        duration?: string | null;
        frequency?: string | null;
        timing?: string | null;
        instructions?: string | null;
        prescribedBy?: string | null;
    }> & {
        prescribedDate: NativeDate;
        medicineName?: string | null;
        dosage?: string | null;
        duration?: string | null;
        frequency?: string | null;
        timing?: string | null;
        instructions?: string | null;
        prescribedBy?: string | null;
    }>;
    images: mongoose.Types.DocumentArray<{
        uploadDate: NativeDate;
        type?: "lab_report" | "medical_imaging" | "prescription" | "other" | null;
        filename?: string | null;
        path?: string | null;
        uploadedBy?: string | null;
        uploadedByRole?: string | null;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        uploadDate: NativeDate;
        type?: "lab_report" | "medical_imaging" | "prescription" | "other" | null;
        filename?: string | null;
        path?: string | null;
        uploadedBy?: string | null;
        uploadedByRole?: string | null;
    }> & {
        uploadDate: NativeDate;
        type?: "lab_report" | "medical_imaging" | "prescription" | "other" | null;
        filename?: string | null;
        path?: string | null;
        uploadedBy?: string | null;
        uploadedByRole?: string | null;
    }>;
    updateHistory: mongoose.Types.DocumentArray<{
        timestamp: NativeDate;
        updatedBy?: string | null;
        updatedByRole?: string | null;
        action?: string | null;
        description?: string | null;
        changes?: any;
        txHash?: string | null;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        timestamp: NativeDate;
        updatedBy?: string | null;
        updatedByRole?: string | null;
        action?: string | null;
        description?: string | null;
        changes?: any;
        txHash?: string | null;
    }> & {
        timestamp: NativeDate;
        updatedBy?: string | null;
        updatedByRole?: string | null;
        action?: string | null;
        description?: string | null;
        changes?: any;
        txHash?: string | null;
    }>;
    createdAt: NativeDate;
    lastModified: NativeDate;
    doctorRecommendations?: string | null;
    patientNotes?: string | null;
    blockchainTxHash?: string | null;
    primaryDoctorId?: string | null;
    clinicalData?: {
        symptoms: string[];
        vitals?: {
            bp?: string | null;
            heartRate?: number | null;
            cholesterol?: number | null;
            sugarLevel?: number | null;
        } | null;
    } | null;
    prediction?: {
        predicted_conditions: mongoose.Types.DocumentArray<{
            name?: string | null;
            probability?: number | null;
            severity?: string | null;
        }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
            name?: string | null;
            probability?: number | null;
            severity?: string | null;
        }> & {
            name?: string | null;
            probability?: number | null;
            severity?: string | null;
        }>;
        riskLevel?: string | null;
        summary?: string | null;
        xgboostRisk?: number | null;
        xgboostConfidence?: number | null;
        recommendation?: string | null;
        clinical_recommendations?: string | null;
    } | null;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;
export declare const BlockchainLedger: mongoose.Model<{
    txHash: string;
    timestamp: NativeDate;
    blockNumber: number;
    status: "pending" | "confirmed" | "failed";
    action?: "CREATE_RECORD" | "UPDATE_RECORD" | "GRANT_ACCESS" | "REVOKE_ACCESS" | null;
    from?: string | null;
    to?: string | null;
    data?: any;
    gasUsed?: number | null;
    recordId?: mongoose.Types.ObjectId | null;
}, {}, {}, {
    id: string;
}, mongoose.Document<unknown, {}, {
    txHash: string;
    timestamp: NativeDate;
    blockNumber: number;
    status: "pending" | "confirmed" | "failed";
    action?: "CREATE_RECORD" | "UPDATE_RECORD" | "GRANT_ACCESS" | "REVOKE_ACCESS" | null;
    from?: string | null;
    to?: string | null;
    data?: any;
    gasUsed?: number | null;
    recordId?: mongoose.Types.ObjectId | null;
}, {
    id: string;
}, mongoose.DefaultSchemaOptions> & Omit<{
    txHash: string;
    timestamp: NativeDate;
    blockNumber: number;
    status: "pending" | "confirmed" | "failed";
    action?: "CREATE_RECORD" | "UPDATE_RECORD" | "GRANT_ACCESS" | "REVOKE_ACCESS" | null;
    from?: string | null;
    to?: string | null;
    data?: any;
    gasUsed?: number | null;
    recordId?: mongoose.Types.ObjectId | null;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, {
    txHash: string;
    timestamp: NativeDate;
    blockNumber: number;
    status: "pending" | "confirmed" | "failed";
    action?: "CREATE_RECORD" | "UPDATE_RECORD" | "GRANT_ACCESS" | "REVOKE_ACCESS" | null;
    from?: string | null;
    to?: string | null;
    data?: any;
    gasUsed?: number | null;
    recordId?: mongoose.Types.ObjectId | null;
}, mongoose.Document<unknown, {}, {
    txHash: string;
    timestamp: NativeDate;
    blockNumber: number;
    status: "pending" | "confirmed" | "failed";
    action?: "CREATE_RECORD" | "UPDATE_RECORD" | "GRANT_ACCESS" | "REVOKE_ACCESS" | null;
    from?: string | null;
    to?: string | null;
    data?: any;
    gasUsed?: number | null;
    recordId?: mongoose.Types.ObjectId | null;
}, {
    id: string;
}, mongoose.ResolveSchemaOptions<mongoose.DefaultSchemaOptions>> & Omit<{
    txHash: string;
    timestamp: NativeDate;
    blockNumber: number;
    status: "pending" | "confirmed" | "failed";
    action?: "CREATE_RECORD" | "UPDATE_RECORD" | "GRANT_ACCESS" | "REVOKE_ACCESS" | null;
    from?: string | null;
    to?: string | null;
    data?: any;
    gasUsed?: number | null;
    recordId?: mongoose.Types.ObjectId | null;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    [path: string]: mongoose.SchemaDefinitionProperty<undefined, any, any>;
} | {
    [x: string]: mongoose.SchemaDefinitionProperty<any, any, mongoose.Document<unknown, {}, {
        txHash: string;
        timestamp: NativeDate;
        blockNumber: number;
        status: "pending" | "confirmed" | "failed";
        action?: "CREATE_RECORD" | "UPDATE_RECORD" | "GRANT_ACCESS" | "REVOKE_ACCESS" | null;
        from?: string | null;
        to?: string | null;
        data?: any;
        gasUsed?: number | null;
        recordId?: mongoose.Types.ObjectId | null;
    }, {
        id: string;
    }, mongoose.ResolveSchemaOptions<mongoose.DefaultSchemaOptions>> & Omit<{
        txHash: string;
        timestamp: NativeDate;
        blockNumber: number;
        status: "pending" | "confirmed" | "failed";
        action?: "CREATE_RECORD" | "UPDATE_RECORD" | "GRANT_ACCESS" | "REVOKE_ACCESS" | null;
        from?: string | null;
        to?: string | null;
        data?: any;
        gasUsed?: number | null;
        recordId?: mongoose.Types.ObjectId | null;
    } & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, {
    txHash: string;
    timestamp: NativeDate;
    blockNumber: number;
    status: "pending" | "confirmed" | "failed";
    action?: "CREATE_RECORD" | "UPDATE_RECORD" | "GRANT_ACCESS" | "REVOKE_ACCESS" | null;
    from?: string | null;
    to?: string | null;
    data?: any;
    gasUsed?: number | null;
    recordId?: mongoose.Types.ObjectId | null;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>, {
    txHash: string;
    timestamp: NativeDate;
    blockNumber: number;
    status: "pending" | "confirmed" | "failed";
    action?: "CREATE_RECORD" | "UPDATE_RECORD" | "GRANT_ACCESS" | "REVOKE_ACCESS" | null;
    from?: string | null;
    to?: string | null;
    data?: any;
    gasUsed?: number | null;
    recordId?: mongoose.Types.ObjectId | null;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;
export declare const Chat: mongoose.Model<{
    messages: mongoose.Types.DocumentArray<{
        text: string;
        timestamp: NativeDate;
        sender: string;
        read: boolean;
        senderName?: string | null;
        senderRole?: "Patient" | "Doctor" | null;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        text: string;
        timestamp: NativeDate;
        sender: string;
        read: boolean;
        senderName?: string | null;
        senderRole?: "Patient" | "Doctor" | null;
    }> & {
        text: string;
        timestamp: NativeDate;
        sender: string;
        read: boolean;
        senderName?: string | null;
        senderRole?: "Patient" | "Doctor" | null;
    }>;
    lastMessage: NativeDate;
    participants?: {
        patientAddress: string;
        doctorAddress: string;
    } | null;
}, {}, {}, {
    id: string;
}, mongoose.Document<unknown, {}, {
    messages: mongoose.Types.DocumentArray<{
        text: string;
        timestamp: NativeDate;
        sender: string;
        read: boolean;
        senderName?: string | null;
        senderRole?: "Patient" | "Doctor" | null;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        text: string;
        timestamp: NativeDate;
        sender: string;
        read: boolean;
        senderName?: string | null;
        senderRole?: "Patient" | "Doctor" | null;
    }> & {
        text: string;
        timestamp: NativeDate;
        sender: string;
        read: boolean;
        senderName?: string | null;
        senderRole?: "Patient" | "Doctor" | null;
    }>;
    lastMessage: NativeDate;
    participants?: {
        patientAddress: string;
        doctorAddress: string;
    } | null;
}, {
    id: string;
}, mongoose.DefaultSchemaOptions> & Omit<{
    messages: mongoose.Types.DocumentArray<{
        text: string;
        timestamp: NativeDate;
        sender: string;
        read: boolean;
        senderName?: string | null;
        senderRole?: "Patient" | "Doctor" | null;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        text: string;
        timestamp: NativeDate;
        sender: string;
        read: boolean;
        senderName?: string | null;
        senderRole?: "Patient" | "Doctor" | null;
    }> & {
        text: string;
        timestamp: NativeDate;
        sender: string;
        read: boolean;
        senderName?: string | null;
        senderRole?: "Patient" | "Doctor" | null;
    }>;
    lastMessage: NativeDate;
    participants?: {
        patientAddress: string;
        doctorAddress: string;
    } | null;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, {
    messages: mongoose.Types.DocumentArray<{
        text: string;
        timestamp: NativeDate;
        sender: string;
        read: boolean;
        senderName?: string | null;
        senderRole?: "Patient" | "Doctor" | null;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        text: string;
        timestamp: NativeDate;
        sender: string;
        read: boolean;
        senderName?: string | null;
        senderRole?: "Patient" | "Doctor" | null;
    }> & {
        text: string;
        timestamp: NativeDate;
        sender: string;
        read: boolean;
        senderName?: string | null;
        senderRole?: "Patient" | "Doctor" | null;
    }>;
    lastMessage: NativeDate;
    participants?: {
        patientAddress: string;
        doctorAddress: string;
    } | null;
}, mongoose.Document<unknown, {}, {
    messages: mongoose.Types.DocumentArray<{
        text: string;
        timestamp: NativeDate;
        sender: string;
        read: boolean;
        senderName?: string | null;
        senderRole?: "Patient" | "Doctor" | null;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        text: string;
        timestamp: NativeDate;
        sender: string;
        read: boolean;
        senderName?: string | null;
        senderRole?: "Patient" | "Doctor" | null;
    }> & {
        text: string;
        timestamp: NativeDate;
        sender: string;
        read: boolean;
        senderName?: string | null;
        senderRole?: "Patient" | "Doctor" | null;
    }>;
    lastMessage: NativeDate;
    participants?: {
        patientAddress: string;
        doctorAddress: string;
    } | null;
}, {
    id: string;
}, mongoose.ResolveSchemaOptions<mongoose.DefaultSchemaOptions>> & Omit<{
    messages: mongoose.Types.DocumentArray<{
        text: string;
        timestamp: NativeDate;
        sender: string;
        read: boolean;
        senderName?: string | null;
        senderRole?: "Patient" | "Doctor" | null;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        text: string;
        timestamp: NativeDate;
        sender: string;
        read: boolean;
        senderName?: string | null;
        senderRole?: "Patient" | "Doctor" | null;
    }> & {
        text: string;
        timestamp: NativeDate;
        sender: string;
        read: boolean;
        senderName?: string | null;
        senderRole?: "Patient" | "Doctor" | null;
    }>;
    lastMessage: NativeDate;
    participants?: {
        patientAddress: string;
        doctorAddress: string;
    } | null;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    [path: string]: mongoose.SchemaDefinitionProperty<undefined, any, any>;
} | {
    [x: string]: mongoose.SchemaDefinitionProperty<any, any, mongoose.Document<unknown, {}, {
        messages: mongoose.Types.DocumentArray<{
            text: string;
            timestamp: NativeDate;
            sender: string;
            read: boolean;
            senderName?: string | null;
            senderRole?: "Patient" | "Doctor" | null;
        }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
            text: string;
            timestamp: NativeDate;
            sender: string;
            read: boolean;
            senderName?: string | null;
            senderRole?: "Patient" | "Doctor" | null;
        }> & {
            text: string;
            timestamp: NativeDate;
            sender: string;
            read: boolean;
            senderName?: string | null;
            senderRole?: "Patient" | "Doctor" | null;
        }>;
        lastMessage: NativeDate;
        participants?: {
            patientAddress: string;
            doctorAddress: string;
        } | null;
    }, {
        id: string;
    }, mongoose.ResolveSchemaOptions<mongoose.DefaultSchemaOptions>> & Omit<{
        messages: mongoose.Types.DocumentArray<{
            text: string;
            timestamp: NativeDate;
            sender: string;
            read: boolean;
            senderName?: string | null;
            senderRole?: "Patient" | "Doctor" | null;
        }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
            text: string;
            timestamp: NativeDate;
            sender: string;
            read: boolean;
            senderName?: string | null;
            senderRole?: "Patient" | "Doctor" | null;
        }> & {
            text: string;
            timestamp: NativeDate;
            sender: string;
            read: boolean;
            senderName?: string | null;
            senderRole?: "Patient" | "Doctor" | null;
        }>;
        lastMessage: NativeDate;
        participants?: {
            patientAddress: string;
            doctorAddress: string;
        } | null;
    } & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, {
    messages: mongoose.Types.DocumentArray<{
        text: string;
        timestamp: NativeDate;
        sender: string;
        read: boolean;
        senderName?: string | null;
        senderRole?: "Patient" | "Doctor" | null;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        text: string;
        timestamp: NativeDate;
        sender: string;
        read: boolean;
        senderName?: string | null;
        senderRole?: "Patient" | "Doctor" | null;
    }> & {
        text: string;
        timestamp: NativeDate;
        sender: string;
        read: boolean;
        senderName?: string | null;
        senderRole?: "Patient" | "Doctor" | null;
    }>;
    lastMessage: NativeDate;
    participants?: {
        patientAddress: string;
        doctorAddress: string;
    } | null;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>, {
    messages: mongoose.Types.DocumentArray<{
        text: string;
        timestamp: NativeDate;
        sender: string;
        read: boolean;
        senderName?: string | null;
        senderRole?: "Patient" | "Doctor" | null;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        text: string;
        timestamp: NativeDate;
        sender: string;
        read: boolean;
        senderName?: string | null;
        senderRole?: "Patient" | "Doctor" | null;
    }> & {
        text: string;
        timestamp: NativeDate;
        sender: string;
        read: boolean;
        senderName?: string | null;
        senderRole?: "Patient" | "Doctor" | null;
    }>;
    lastMessage: NativeDate;
    participants?: {
        patientAddress: string;
        doctorAddress: string;
    } | null;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;
export declare const FollowUp: mongoose.Model<{
    patientAddress: string;
    createdAt: NativeDate;
    status: "pending" | "completed" | "missed" | "cancelled";
    doctorAddress: string;
    followUpDate: NativeDate;
    reason: string;
    priority: "routine" | "important" | "urgent";
    doctorName?: string | null;
    notes?: string | null;
}, {}, {}, {
    id: string;
}, mongoose.Document<unknown, {}, {
    patientAddress: string;
    createdAt: NativeDate;
    status: "pending" | "completed" | "missed" | "cancelled";
    doctorAddress: string;
    followUpDate: NativeDate;
    reason: string;
    priority: "routine" | "important" | "urgent";
    doctorName?: string | null;
    notes?: string | null;
}, {
    id: string;
}, mongoose.DefaultSchemaOptions> & Omit<{
    patientAddress: string;
    createdAt: NativeDate;
    status: "pending" | "completed" | "missed" | "cancelled";
    doctorAddress: string;
    followUpDate: NativeDate;
    reason: string;
    priority: "routine" | "important" | "urgent";
    doctorName?: string | null;
    notes?: string | null;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, {
    patientAddress: string;
    createdAt: NativeDate;
    status: "pending" | "completed" | "missed" | "cancelled";
    doctorAddress: string;
    followUpDate: NativeDate;
    reason: string;
    priority: "routine" | "important" | "urgent";
    doctorName?: string | null;
    notes?: string | null;
}, mongoose.Document<unknown, {}, {
    patientAddress: string;
    createdAt: NativeDate;
    status: "pending" | "completed" | "missed" | "cancelled";
    doctorAddress: string;
    followUpDate: NativeDate;
    reason: string;
    priority: "routine" | "important" | "urgent";
    doctorName?: string | null;
    notes?: string | null;
}, {
    id: string;
}, mongoose.ResolveSchemaOptions<mongoose.DefaultSchemaOptions>> & Omit<{
    patientAddress: string;
    createdAt: NativeDate;
    status: "pending" | "completed" | "missed" | "cancelled";
    doctorAddress: string;
    followUpDate: NativeDate;
    reason: string;
    priority: "routine" | "important" | "urgent";
    doctorName?: string | null;
    notes?: string | null;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    [path: string]: mongoose.SchemaDefinitionProperty<undefined, any, any>;
} | {
    [x: string]: mongoose.SchemaDefinitionProperty<any, any, mongoose.Document<unknown, {}, {
        patientAddress: string;
        createdAt: NativeDate;
        status: "pending" | "completed" | "missed" | "cancelled";
        doctorAddress: string;
        followUpDate: NativeDate;
        reason: string;
        priority: "routine" | "important" | "urgent";
        doctorName?: string | null;
        notes?: string | null;
    }, {
        id: string;
    }, mongoose.ResolveSchemaOptions<mongoose.DefaultSchemaOptions>> & Omit<{
        patientAddress: string;
        createdAt: NativeDate;
        status: "pending" | "completed" | "missed" | "cancelled";
        doctorAddress: string;
        followUpDate: NativeDate;
        reason: string;
        priority: "routine" | "important" | "urgent";
        doctorName?: string | null;
        notes?: string | null;
    } & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, {
    patientAddress: string;
    createdAt: NativeDate;
    status: "pending" | "completed" | "missed" | "cancelled";
    doctorAddress: string;
    followUpDate: NativeDate;
    reason: string;
    priority: "routine" | "important" | "urgent";
    doctorName?: string | null;
    notes?: string | null;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>, {
    patientAddress: string;
    createdAt: NativeDate;
    status: "pending" | "completed" | "missed" | "cancelled";
    doctorAddress: string;
    followUpDate: NativeDate;
    reason: string;
    priority: "routine" | "important" | "urgent";
    doctorName?: string | null;
    notes?: string | null;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;
export declare const MedicationLog: mongoose.Model<{
    date: string;
    patientAddress: string;
    medicineName: string;
    status: "missed" | "taken" | "skipped";
    loggedAt: NativeDate;
    dosage?: string | null;
    notes?: string | null;
    time?: string | null;
}, {}, {}, {
    id: string;
}, mongoose.Document<unknown, {}, {
    date: string;
    patientAddress: string;
    medicineName: string;
    status: "missed" | "taken" | "skipped";
    loggedAt: NativeDate;
    dosage?: string | null;
    notes?: string | null;
    time?: string | null;
}, {
    id: string;
}, mongoose.DefaultSchemaOptions> & Omit<{
    date: string;
    patientAddress: string;
    medicineName: string;
    status: "missed" | "taken" | "skipped";
    loggedAt: NativeDate;
    dosage?: string | null;
    notes?: string | null;
    time?: string | null;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, {
    date: string;
    patientAddress: string;
    medicineName: string;
    status: "missed" | "taken" | "skipped";
    loggedAt: NativeDate;
    dosage?: string | null;
    notes?: string | null;
    time?: string | null;
}, mongoose.Document<unknown, {}, {
    date: string;
    patientAddress: string;
    medicineName: string;
    status: "missed" | "taken" | "skipped";
    loggedAt: NativeDate;
    dosage?: string | null;
    notes?: string | null;
    time?: string | null;
}, {
    id: string;
}, mongoose.ResolveSchemaOptions<mongoose.DefaultSchemaOptions>> & Omit<{
    date: string;
    patientAddress: string;
    medicineName: string;
    status: "missed" | "taken" | "skipped";
    loggedAt: NativeDate;
    dosage?: string | null;
    notes?: string | null;
    time?: string | null;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    [path: string]: mongoose.SchemaDefinitionProperty<undefined, any, any>;
} | {
    [x: string]: mongoose.SchemaDefinitionProperty<any, any, mongoose.Document<unknown, {}, {
        date: string;
        patientAddress: string;
        medicineName: string;
        status: "missed" | "taken" | "skipped";
        loggedAt: NativeDate;
        dosage?: string | null;
        notes?: string | null;
        time?: string | null;
    }, {
        id: string;
    }, mongoose.ResolveSchemaOptions<mongoose.DefaultSchemaOptions>> & Omit<{
        date: string;
        patientAddress: string;
        medicineName: string;
        status: "missed" | "taken" | "skipped";
        loggedAt: NativeDate;
        dosage?: string | null;
        notes?: string | null;
        time?: string | null;
    } & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, {
    date: string;
    patientAddress: string;
    medicineName: string;
    status: "missed" | "taken" | "skipped";
    loggedAt: NativeDate;
    dosage?: string | null;
    notes?: string | null;
    time?: string | null;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>, {
    date: string;
    patientAddress: string;
    medicineName: string;
    status: "missed" | "taken" | "skipped";
    loggedAt: NativeDate;
    dosage?: string | null;
    notes?: string | null;
    time?: string | null;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;
export declare const VitalsHistory: mongoose.Model<{
    date: NativeDate;
    patientAddress: string;
    vitals?: {
        bp?: string | null;
        heartRate?: number | null;
        cholesterol?: number | null;
        sugarLevel?: number | null;
        systolicBP?: number | null;
        diastolicBP?: number | null;
    } | null;
    recordedBy?: string | null;
}, {}, {}, {
    id: string;
}, mongoose.Document<unknown, {}, {
    date: NativeDate;
    patientAddress: string;
    vitals?: {
        bp?: string | null;
        heartRate?: number | null;
        cholesterol?: number | null;
        sugarLevel?: number | null;
        systolicBP?: number | null;
        diastolicBP?: number | null;
    } | null;
    recordedBy?: string | null;
}, {
    id: string;
}, mongoose.DefaultSchemaOptions> & Omit<{
    date: NativeDate;
    patientAddress: string;
    vitals?: {
        bp?: string | null;
        heartRate?: number | null;
        cholesterol?: number | null;
        sugarLevel?: number | null;
        systolicBP?: number | null;
        diastolicBP?: number | null;
    } | null;
    recordedBy?: string | null;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, {
    date: NativeDate;
    patientAddress: string;
    vitals?: {
        bp?: string | null;
        heartRate?: number | null;
        cholesterol?: number | null;
        sugarLevel?: number | null;
        systolicBP?: number | null;
        diastolicBP?: number | null;
    } | null;
    recordedBy?: string | null;
}, mongoose.Document<unknown, {}, {
    date: NativeDate;
    patientAddress: string;
    vitals?: {
        bp?: string | null;
        heartRate?: number | null;
        cholesterol?: number | null;
        sugarLevel?: number | null;
        systolicBP?: number | null;
        diastolicBP?: number | null;
    } | null;
    recordedBy?: string | null;
}, {
    id: string;
}, mongoose.ResolveSchemaOptions<mongoose.DefaultSchemaOptions>> & Omit<{
    date: NativeDate;
    patientAddress: string;
    vitals?: {
        bp?: string | null;
        heartRate?: number | null;
        cholesterol?: number | null;
        sugarLevel?: number | null;
        systolicBP?: number | null;
        diastolicBP?: number | null;
    } | null;
    recordedBy?: string | null;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    [path: string]: mongoose.SchemaDefinitionProperty<undefined, any, any>;
} | {
    [x: string]: mongoose.SchemaDefinitionProperty<any, any, mongoose.Document<unknown, {}, {
        date: NativeDate;
        patientAddress: string;
        vitals?: {
            bp?: string | null;
            heartRate?: number | null;
            cholesterol?: number | null;
            sugarLevel?: number | null;
            systolicBP?: number | null;
            diastolicBP?: number | null;
        } | null;
        recordedBy?: string | null;
    }, {
        id: string;
    }, mongoose.ResolveSchemaOptions<mongoose.DefaultSchemaOptions>> & Omit<{
        date: NativeDate;
        patientAddress: string;
        vitals?: {
            bp?: string | null;
            heartRate?: number | null;
            cholesterol?: number | null;
            sugarLevel?: number | null;
            systolicBP?: number | null;
            diastolicBP?: number | null;
        } | null;
        recordedBy?: string | null;
    } & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, {
    date: NativeDate;
    patientAddress: string;
    vitals?: {
        bp?: string | null;
        heartRate?: number | null;
        cholesterol?: number | null;
        sugarLevel?: number | null;
        systolicBP?: number | null;
        diastolicBP?: number | null;
    } | null;
    recordedBy?: string | null;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>, {
    date: NativeDate;
    patientAddress: string;
    vitals?: {
        bp?: string | null;
        heartRate?: number | null;
        cholesterol?: number | null;
        sugarLevel?: number | null;
        systolicBP?: number | null;
        diastolicBP?: number | null;
    } | null;
    recordedBy?: string | null;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;
//# sourceMappingURL=Schemas.d.ts.map