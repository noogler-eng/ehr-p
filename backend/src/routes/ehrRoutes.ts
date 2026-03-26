/**
 * EHR Routes - Electronic Health Record API Endpoints
 * This file contains all API routes for the secure EHR system including:
 * - Authentication (wallet-based login)
 * - Medical record management
 * - AI predictions (XGBoost + Gemini)
 * - Role-based access control
 * - Image upload and management
 * - Blockchain ledger integration
 */

import express from "express";
import type { Request, Response } from "express";
import { User, EHR, BlockchainLedger, Chat, FollowUp, MedicationLog, VitalsHistory } from "../models/Schemas.js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { predictDisease } from "../services/xgboostService.js";
import { createBlockchainTransaction, getTransaction, getTransactionsByWallet } from "../services/blockchainService.js";
import { upload, getFileUrl } from "../middleware/upload.js";

const router = express.Router();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "AIzaSyB9WCwcmQDRsXSC8NjV6u5O63MLprkJ4LM");

// ==================== AUTHENTICATION ====================

/**
 * Wallet-based authentication endpoint
 * Handles both new user registration and existing user login
 *
 * @route POST /api/auth/login
 * @param {string} walletAddress - User's Ethereum wallet address (required)
 * @param {string} name - User's full name (required for new users)
 * @param {string} role - User role: Patient, Doctor, Pharmacist, Admin (required for new users)
 * @param {number} age - User's age (required for new users)
 * @param {string} gender - User's gender (required for new users)
 * @param {string} bloodGroup - User's blood group (required for new users)
 * @returns {object} User profile and authentication status
 *
 * @openapi
 * /api/auth/login:
 *   post:
 *     summary: Wallet-based login or registration
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - walletAddress
 *             properties:
 *               walletAddress:
 *                 type: string
 *               name:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [Patient, Doctor, Pharmacist, Admin]
 *     responses:
 *       200:
 *         description: Login successful
 */
router.post('/auth/login', async (req: Request, res: Response) => {
    // Extract user data from request body
    const { walletAddress, name, role, age, gender, bloodGroup } = req.body;

    try {
        let user = await User.findOne({ walletAddress });

        // CASE 1: Returning User - Already has a profile
        if (user && user.name) {
            return res.status(200).json({
                success: true,
                user,
                message: "Welcome back!"
            });
        }

        // CASE 2: New User - First time connecting wallet
        // Create new user profile if name is provided
        if (!user && name) {
            user = await User.create({
                walletAddress,
                name,
                role,
                age,
                gender,
                bloodGroup,
                activeMedications: []
            });
            return res.status(201).json({ success: true, user });
        }

        // CASE 3: Wallet connected but no profile found
        // Frontend should display onboarding modal
        res.status(200).json({ success: true, user: null });

    } catch (err) {
        console.error("Authentication error:", err);
        res.status(500).json({ error: "Authentication failed" });
    }
});

// ==================== MEDICAL RECORDS ====================

/**
 * Submit a new medical visit record with AI analysis
 * Integrates both XGBoost ML model and Gemini AI for comprehensive risk assessment
 * Records transaction in blockchain ledger
 *
 * @route POST /api/records/submit-visit
 * @param {string} patientAddress - Patient's wallet address
 * @param {string} doctorAddress - Doctor's wallet address
 * @param {object} vitals - Patient vitals (BP, heart rate, cholesterol, sugar level, ECG)
 * @param {object} clinicalMarkers - Clinical data (chest pain type, etc.)
 * @param {array} symptoms - List of patient symptoms
 * @param {array} prescriptions - List of prescribed medications
 * @param {array} images - Uploaded medical images (optional)
 * @returns {object} Visit record with AI predictions and blockchain transaction hash
 *
 * @openapi
 * /api/records/submit-visit:
 *   post:
 *     summary: Submit medical visit and generate AI prediction
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - patientAddress
 *               - doctorAddress
 *               - vitals
 *             properties:
 *               patientAddress:
 *                 type: string
 *               doctorAddress:
 *                 type: string
 *               vitals:
 *                 type: object
 *               symptoms:
 *                 type: array
 *                 items:
 *                   type: string
 *               prescriptions:
 *                 type: array
 *                 items:
 *                   type: object
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Visit recorded successfully
 */
router.post("/records/submit-visit", upload.array('images', 5), async (req: Request, res: Response) => {
    const { patientAddress, doctorAddress, vitals, clinicalMarkers, symptoms, prescriptions, doctorRecommendations } = req.body;
    console.log("Doctor clinical entry received:", { patientAddress, doctorAddress });

    try {
        // Parse JSON strings from form data
        const parsedVitals = typeof vitals === 'string' ? JSON.parse(vitals) : vitals;
        const parsedClinicalMarkers = typeof clinicalMarkers === 'string' ? JSON.parse(clinicalMarkers) : clinicalMarkers;
        const parsedSymptoms = typeof symptoms === 'string' ? JSON.parse(symptoms) : symptoms || [];
        const parsedPrescriptions = typeof prescriptions === 'string' ? JSON.parse(prescriptions) : prescriptions || [];

        // Get patient info
        const patient = await User.findOne({ walletAddress: patientAddress });
        if (!patient) {
            return res.status(404).json({ error: "Patient not found" });
        }
        const patientAge = patient.age || 50;

        // Check if patient already has a record
        let existingRecord = await EHR.findOne({ patientAddress });
        const isNewRecord = !existingRecord;

        // ==== XGBoost Prediction ====
        console.log("Running XGBoost ML model...");
        const xgboostPrediction = await predictDisease({
            vitals: parsedVitals,
            clinicalMarkers: parsedClinicalMarkers,
            age: patientAge
        });

        // ==== Gemini AI Analysis ====
        console.log("Running Gemini AI analysis...");
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

        const prompt = `
            Act as a Senior Cardiologist. Perform cardiovascular risk assessment:
            - Vitals: BP (${parsedVitals.bp}), HR (${parsedVitals.heartRate}), Cholesterol (${parsedVitals.cholesterol}), Sugar (${parsedVitals.sugarLevel})
            - ECG: ${parsedVitals.ecgResult || 'Normal'}, Chest Pain: ${parsedClinicalMarkers?.chestPainType || 'None'}
            - Symptoms: ${parsedSymptoms.join(", ") || 'None reported'}
            - ML Model: ${xgboostPrediction.risk_level} risk (${(xgboostPrediction.risk_probability * 100).toFixed(1)}% probability)

            Provide:
            1. Risk Stratification (High/Medium/Low)
            2. Clinical Summary with expert interpretation
            3. Intervention Plan and recommendations
        `;

        const geminiResult = await model.generateContent(prompt);
        const geminiText = geminiResult.response.text();

        // Determine final risk level
        const geminiRisk = geminiText.includes("High") ? "High" :
                          geminiText.includes("Medium") ? "Medium" : "Low";
        const riskLevels: { [key: string]: number } = { "Low": 1, "Medium": 2, "High": 3 };
        const xgboostLevel = riskLevels[xgboostPrediction.risk_level || 'Low'] || 1;
        const geminiLevel = riskLevels[geminiRisk || 'Low'] || 1;
        const finalRiskLevel = xgboostLevel >= geminiLevel
            ? xgboostPrediction.risk_level : geminiRisk;

        // Process uploaded images
        const uploadedImages = (req.files as any[])?.map(file => ({
            type: 'lab_report' as const,
            filename: file.filename,
            path: getFileUrl(file.filename),
            uploadedBy: doctorAddress,
            uploadedByRole: 'Doctor',
            uploadDate: new Date()
        })) || [];

        // Enhanced prescriptions with doctor info
        const enhancedPrescriptions = parsedPrescriptions.map((p: any) => ({
            ...p,
            prescribedBy: doctorAddress,
            prescribedDate: new Date()
        }));

        let record: any;
        let txHash: string;
        let action: string;

        if (isNewRecord) {
            // ==== CREATE NEW RECORD ====
            console.log("Creating new patient record...");

            record = await EHR.create({
                patientAddress,
                primaryDoctorId: doctorAddress,
                clinicalData: {
                    vitals: parsedVitals,
                    symptoms: parsedSymptoms
                },
                prediction: {
                    riskLevel: finalRiskLevel,
                    summary: geminiText,
                    xgboostRisk: xgboostPrediction.risk_probability,
                    xgboostConfidence: xgboostPrediction.confidence,
                    recommendation: xgboostPrediction.recommendation,
                    predicted_conditions: (xgboostPrediction.predicted_conditions || []) as any,
                    clinical_recommendations: xgboostPrediction.clinical_recommendations || ''
                },
                prescriptions: enhancedPrescriptions,
                doctorRecommendations: doctorRecommendations || '',
                images: uploadedImages,
                updateHistory: [{
                    timestamp: new Date(),
                    updatedBy: doctorAddress,
                    updatedByRole: 'Doctor',
                    action: 'INITIAL_CREATE',
                    description: `Initial medical record created by Dr. ${doctorAddress.slice(0, 6)}...${doctorAddress.slice(-4)}`,
                    changes: { vitals: true, symptoms: true, prescriptions: true, aiAnalysis: true }
                }],
                blockchainTxHash: '', // Set after blockchain tx
                createdAt: new Date(),
                lastModified: new Date()
            });

            txHash = await createBlockchainTransaction(
                doctorAddress,
                'CREATE_RECORD',
                record._id,
                { patientAddress, riskLevel: finalRiskLevel, action: 'INITIAL_CREATE' }
            );

            record.blockchainTxHash = txHash;
            action = 'CREATED';

        } else {
            // ==== UPDATE EXISTING RECORD ====
            console.log("Updating existing patient record...");

            // Merge new symptoms with existing (avoid duplicates)
            const existingSymptoms = existingRecord.clinicalData?.symptoms || [];
            const mergedSymptoms = Array.from(new Set([...existingSymptoms, ...parsedSymptoms]));

            // Append new prescriptions
            const existingPrescriptions = existingRecord.prescriptions || [];
            const mergedPrescriptions = [...existingPrescriptions, ...enhancedPrescriptions];

            // Append new images
            const existingImages = existingRecord.images || [];
            const mergedImages = [...existingImages, ...uploadedImages];

            // Update record fields
            existingRecord.primaryDoctorId = doctorAddress;
            existingRecord.clinicalData = {
                vitals: parsedVitals, // Update to latest vitals
                symptoms: mergedSymptoms
            };
            existingRecord.prediction = {
                riskLevel: finalRiskLevel,
                summary: geminiText,
                xgboostRisk: xgboostPrediction.risk_probability,
                xgboostConfidence: xgboostPrediction.confidence,
                recommendation: xgboostPrediction.recommendation,
                predicted_conditions: (xgboostPrediction.predicted_conditions || []) as any,
                clinical_recommendations: xgboostPrediction.clinical_recommendations || ''
            };
            existingRecord.prescriptions = mergedPrescriptions as any;
            existingRecord.images = mergedImages as any;
            if (doctorRecommendations) {
                existingRecord.doctorRecommendations = doctorRecommendations;
            }

            // Add to update history
            txHash = await createBlockchainTransaction(
                doctorAddress,
                'UPDATE_RECORD',
                existingRecord._id,
                { action: 'DOCTOR_UPDATE', newSymptoms: parsedSymptoms.length, newPrescriptions: enhancedPrescriptions.length }
            );

            if (!existingRecord.updateHistory) {
                existingRecord.updateHistory = [] as any;
            }

            existingRecord.updateHistory.push({
                timestamp: new Date(),
                updatedBy: doctorAddress,
                updatedByRole: 'Doctor',
                action: 'DOCTOR_UPDATE',
                description: `Doctor updated vitals, added ${parsedSymptoms.length} symptoms, ${enhancedPrescriptions.length} prescriptions, ${uploadedImages.length} images`,
                changes: { vitals: true, symptoms: parsedSymptoms.length > 0, prescriptions: enhancedPrescriptions.length > 0, images: uploadedImages.length > 0, aiAnalysis: true },
                txHash
            });

            existingRecord.lastModified = new Date();
            await existingRecord.save();

            record = existingRecord;
            action = 'UPDATED';
        }

        await record.save();

        // Update patient's active medications
        if (enhancedPrescriptions.length > 0) {
            const newMeds = enhancedPrescriptions.map((p: any) => p.medicineName).filter((m: string) => m);
            await User.findOneAndUpdate(
                { walletAddress: patientAddress },
                {
                    $addToSet: { activeMedications: { $each: newMeds } },
                    $set: { lastUpdated: new Date() }
                }
            );
        }

        res.status(isNewRecord ? 201 : 200).json({
            success: true,
            action,
            mongoId: record._id,
            txHash,
            prediction: {
                riskLevel: finalRiskLevel,
                geminiSummary: geminiText,
                xgboostRisk: xgboostPrediction.risk_probability,
                recommendation: xgboostPrediction.recommendation
            },
            message: isNewRecord
                ? "New patient record created successfully"
                : "Patient record updated with new clinical data"
        });

    } catch (err) {
        console.error("Error during clinical entry:", err);
        res.status(500).json({ error: "Clinical processing failed", details: (err as Error).message });
    }
});

/**
 * Retrieve complete medical history for a patient
 * Includes user profile and all EHR records sorted chronologically
 *
 * @route GET /api/records/history/:address
 * @param {string} address - Patient's wallet address
 * @returns {object} Patient profile and medical history
 *
 * @openapi
 * /api/records/history/{address}:
 *   get:
 *     tags:
 *       - Records
 *     summary: Retrieve medical history and user profile for a wallet address
 *     parameters:
 *       - name: address
 *         in: path
 *         required: true
 *         description: Patient wallet address
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User profile and medical history retrieved successfully
 */
router.get("/records/history/:address", async (req: Request, res: Response) => {
    try {
        const address = req.params.address;

        // Validate wallet address
        if (!address || typeof address !== 'string') {
            return res.status(400).json({
                success: false,
                error: "A valid wallet address is required"
            });
        }

        // Fetch patient profile and their ONE medical record
        const [profile, record] = await Promise.all([
            User.findOne({ walletAddress: address }),
            EHR.findOne({ patientAddress: address })
        ]);

        res.json({
            success: true,
            profile: profile || null,
            record: record || null,
            // Return as array for frontend compatibility (single item array)
            history: record ? [record] : []
        });

    } catch (err) {
        console.error("History & Profile Retrieval Error:", err);
        res.status(500).json({
            success: false,
            error: "Internal server error during data fetch"
        });
    }
});

/**
 * Update an existing medical record (Doctor only)
 * Allows doctors to add recommendations, update prescriptions, and upload additional images
 *
 * @route PUT /api/records/update/:recordId
 * @param {string} recordId - MongoDB ObjectId of the EHR record
 * @param {string} doctorAddress - Doctor's wallet address (for verification)
 * @param {string} doctorRecommendations - Additional doctor notes
 * @param {array} prescriptions - Updated prescription list (JSON string)
 * @param {files} images - Additional medical images (max 5)
 * @returns {object} Updated record
 */
router.put("/records/update/:recordId", upload.array('images', 5), async (req: Request, res: Response) => {
    try {
        const { recordId } = req.params;

        // Handle case where req.body might be undefined or empty
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({ error: "Request body is empty. Please provide data to update." });
        }

        const { doctorAddress, doctorRecommendations, prescriptions } = req.body;

        // Validate required fields
        if (!doctorAddress) {
            return res.status(400).json({ error: "doctorAddress is required" });
        }

        // Find the record
        const record = await EHR.findById(recordId);

        if (!record) {
            return res.status(404).json({ error: "Record not found" });
        }

        // Verify doctor is authorized to update this record
        if (record.primaryDoctorId !== doctorAddress) {
            return res.status(403).json({ error: "Unauthorized: Only the primary doctor can update this record" });
        }

        // Parse prescriptions if it's a JSON string
        const parsedPrescriptions = prescriptions && typeof prescriptions === 'string'
            ? JSON.parse(prescriptions)
            : prescriptions;

        // Enhance prescriptions with doctor info and date
        const enhancedPrescriptions = parsedPrescriptions ? parsedPrescriptions.map((p: any) => ({
            ...p,
            prescribedBy: doctorAddress,
            prescribedDate: new Date()
        })) : null;

        // Update the record fields
        if (doctorRecommendations) {
            record.doctorRecommendations = doctorRecommendations;
        }

        if (enhancedPrescriptions) {
            // Append new prescriptions to existing ones
            const existingPrescriptions = record.prescriptions || [];
            record.prescriptions = [...existingPrescriptions, ...enhancedPrescriptions] as any;
        }

        // Process and add new uploaded images
        let imageCount = 0;
        if (req.files && (req.files as any[]).length > 0) {
            const newImages = (req.files as any[]).map(file => ({
                type: 'lab_report' as const,
                filename: file.filename,
                path: getFileUrl(file.filename),
                uploadedBy: doctorAddress,
                uploadedByRole: 'Doctor',
                uploadDate: new Date()
            }));

            // Append new images to existing images
            const existingImages = record.images || [];
            newImages.forEach(img => existingImages.push(img));
            imageCount = newImages.length;
        }

        // Record update in blockchain ledger
        const updatedFields = [];
        if (doctorRecommendations) updatedFields.push('doctorRecommendations');
        if (enhancedPrescriptions) updatedFields.push('prescriptions');
        if (imageCount > 0) updatedFields.push('images');

        const txHash = await createBlockchainTransaction(
            doctorAddress,
            'UPDATE_RECORD',
            record._id,
            {
                updatedFields,
                timestamp: new Date(),
                newImagesCount: imageCount
            }
        );

        // Add to update history
        if (!record.updateHistory) {
            record.updateHistory = [] as any;
        }

        record.updateHistory.push({
            timestamp: new Date(),
            updatedBy: doctorAddress,
            updatedByRole: 'Doctor',
            action: 'DOCTOR_EDIT',
            description: `Doctor edited: ${updatedFields.join(', ')} (${enhancedPrescriptions?.length || 0} prescriptions, ${imageCount} images)`,
            changes: { doctorRecommendations: !!doctorRecommendations, prescriptions: !!enhancedPrescriptions, images: imageCount > 0 },
            txHash
        } as any);

        record.lastModified = new Date();
        await record.save();

        res.json({
            success: true,
            record,
            txHash,
            message: `Record updated successfully. ${updatedFields.join(', ')} were modified.`
        });

    } catch (err) {
        console.error("Record update error:", err);
        res.status(500).json({ error: "Failed to update record" });
    }
});

// ==================== DOCTOR OPERATIONS ====================

/**
 * Get list of all patients treated by a specific doctor
 * Returns unique patients with their profiles
 *
 * @route GET /api/doctor/my-patients/:doctorAddress
 * @param {string} doctorAddress - Doctor's wallet address
 * @returns {array} List of patients with profiles
 *
 * @openapi
 * /api/doctor/my-patients/{doctorAddress}:
 *   get:
 *     tags:
 *       - Doctor
 *     summary: Get unique patients treated by a doctor
 *     parameters:
 *       - name: doctorAddress
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of patients treated by the doctor
 */
router.get("/doctor/my-patients/:doctorAddress", async (req: Request, res: Response) => {
    try {
        const doctorAddress = req.params.doctorAddress as string;

        if (!doctorAddress) {
            return res.status(400).json({ error: "Doctor address is required" });
        }

        // Get unique patient addresses
        const patientAddrs = await EHR.distinct("patientAddress", {
            primaryDoctorId: doctorAddress
        });

        // Fetch patient profiles
        const patients = await User.find({ walletAddress: { $in: patientAddrs } });

        // Structure response
        const structured = patientAddrs.map(addr => ({
            walletAddress: addr,
            profile: patients.find(p => p.walletAddress === addr) || null
        }));

        res.json({ success: true, patients: structured });
    } catch (err) {
        console.error("Doctor patients fetch error:", err);
        res.status(500).json({ error: "Failed to fetch patient list" });
    }
});

// ==================== PATIENT OPERATIONS ====================

/**
 * Get list of all doctors a patient has visited
 * Returns unique doctors with their profiles
 *
 * @route GET /api/patient/my-doctors/:patientAddress
 * @param {string} patientAddress - Patient's wallet address
 * @returns {array} List of doctors with profiles
 *
 * @openapi
 * /api/patient/my-doctors/{patientAddress}:
 *   get:
 *     tags:
 *       - Patient
 *     summary: Get doctors visited by a patient
 *     parameters:
 *       - name: patientAddress
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of doctors visited by the patient
 */
router.get("/patient/my-doctors/:patientAddress", async (req: Request, res: Response) => {
    try {
        const patientAddress = req.params.patientAddress;

        if (!patientAddress || typeof patientAddress !== 'string') {
            return res.status(400).json({
                success: false,
                error: "A valid patient wallet address is required"
            });
        }

        // Get unique doctor addresses
        const doctorAddrs = await EHR.distinct("doctorId", {
            patientAddress: patientAddress
        });

        // Fetch doctor profiles
        const doctors = await User.find({
            walletAddress: { $in: doctorAddrs as string[] },
            role: "Doctor"
        });

        // Structure response
        const structured = doctorAddrs.map(addr => ({
            walletAddress: addr,
            profile: doctors.find(p => p.walletAddress === addr) || null
        }));

        res.json({ success: true, doctors: structured });
    } catch (err) {
        console.error("Patient doctors fetch error:", err);
        res.status(500).json({ success: false, error: "Failed to fetch doctor list" });
    }
});

// ==================== PHARMACIST OPERATIONS ====================

/**
 * Get patient registry for pharmacists
 * Returns all patients with EHR records
 *
 * @route GET /api/pharmacist/registry
 * @returns {array} Complete patient registry
 *
 * @openapi
 * /api/pharmacist/registry:
 *   get:
 *     tags:
 *       - Pharmacist
 *     summary: Get patient registry
 *     responses:
 *       200:
 *         description: Patient registry retrieved successfully
 */
router.get("/pharmacist/registry", async (_req: Request, res: Response) => {
    try {
        const patientAddrs = await EHR.distinct("patientAddress");
        const profiles = await User.find({ walletAddress: { $in: patientAddrs } });

        const structured = patientAddrs.map(addr => ({
            walletAddress: addr,
            profile: profiles.find(p => p.walletAddress === addr) || null
        }));

        res.json({ success: true, registry: structured });
    } catch (err) {
        console.error("Registry retrieval error:", err);
        res.status(500).json({ error: "Registry retrieval failed" });
    }
});

/**
 * Get latest prescriptions for a patient (Pharmacist access)
 * Pharmacists can see prescriptions and doctor recommendations but NOT AI predictions
 *
 * @route GET /api/pharmacy/prescriptions/:patientAddress
 * @param {string} patientAddress - Patient's wallet address
 * @returns {object} Latest prescriptions with doctor information
 *
 * @openapi
 * /api/pharmacy/prescriptions/{patientAddress}:
 *   get:
 *     summary: Get latest prescription for a patient (Pharmacist Role)
 *     parameters:
 *       - in: path
 *         name: patientAddress
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success
 */
router.get("/pharmacy/prescriptions/:patientAddress", async (req: Request, res: Response) => {
    try {
        const patientAddress = req.params.patientAddress as string;

        if (!patientAddress) {
            return res.status(400).json({ error: "Patient address is required" });
        }

        // Find the patient's record
        const patientRecord = await EHR.findOne({ patientAddress: patientAddress })
            .select("prescriptions primaryDoctorId doctorRecommendations lastModified clinicalData.vitals");

        if (!patientRecord) {
            return res.status(404).json({
                error: "No medical history or prescriptions found for this patient",
            });
        }

        // Pharmacist view: prescriptions + doctor recommendations + vitals
        // NO AI predictions or risk assessments
        res.json({
            success: true,
            prescriptions: patientRecord.prescriptions,
            doctorRecommendations: patientRecord.doctorRecommendations,
            prescribedBy: patientRecord.primaryDoctorId,
            lastUpdated: patientRecord.lastModified,
            vitals: patientRecord.clinicalData?.vitals
        });
    } catch (err) {
        console.error("Pharmacy query error:", err);
        res.status(500).json({ error: "Pharmacy query failed" });
    }
});

// ==================== BLOCKCHAIN OPERATIONS ====================

/**
 * Get blockchain transaction details
 *
 * @route GET /api/blockchain/transaction/:txHash
 * @param {string} txHash - Transaction hash
 * @returns {object} Transaction details
 */
router.get("/blockchain/transaction/:txHash", async (req: Request, res: Response) => {
    try {
        const txHash = req.params.txHash as string;
        const transaction = await getTransaction(txHash);

        if (!transaction) {
            return res.status(404).json({ error: "Transaction not found" });
        }

        res.json({ success: true, transaction });
    } catch (err) {
        console.error("Blockchain query error:", err);
        res.status(500).json({ error: "Failed to fetch transaction" });
    }
});

/**
 * Get all transactions for a wallet address
 *
 * @route GET /api/blockchain/wallet/:address
 * @param {string} address - Wallet address
 * @returns {array} List of transactions
 */
router.get("/blockchain/wallet/:address", async (req: Request, res: Response) => {
    try {
        const address = req.params.address as string;
        const transactions = await getTransactionsByWallet(address);

        res.json({ success: true, transactions, count: transactions.length });
    } catch (err) {
        console.error("Wallet transactions fetch error:", err);
        res.status(500).json({ error: "Failed to fetch wallet transactions" });
    }
});

// ==================== PATIENT OPERATIONS ====================

/**
 * Patient can add updates to their existing medical records
 * Allows patients to add new symptoms, notes, and upload images
 *
 * @route PUT /api/records/patient-update/:recordId
 * @param {string} recordId - MongoDB ObjectId of the EHR record
 * @param {string} patientAddress - Patient's wallet address (for verification)
 * @param {array} symptoms - Updated symptoms list (JSON string)
 * @param {string} patientNotes - Patient's notes about their condition
 * @param {files} images - Additional medical images
 * @returns {object} Updated record
 */
router.put("/records/patient-update/:recordId", upload.array('images', 5), async (req: Request, res: Response) => {
    try {
        const { recordId } = req.params;

        // Handle case where req.body might be undefined or empty
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({ error: "Request body is empty. Please provide data to update." });
        }

        const { patientAddress, symptoms, patientNotes } = req.body;

        // Validate required fields
        if (!patientAddress) {
            return res.status(400).json({ error: "patientAddress is required" });
        }

        // Find the record
        const record = await EHR.findById(recordId);

        if (!record) {
            return res.status(404).json({ error: "Record not found" });
        }

        // Verify patient is authorized (this is their record)
        if (record.patientAddress !== patientAddress) {
            return res.status(403).json({ error: "Unauthorized: You can only update your own records" });
        }

        // Update symptoms if provided
        if (symptoms && record.clinicalData) {
            const parsedSymptoms = typeof symptoms === 'string' ? JSON.parse(symptoms) : symptoms;
            record.clinicalData.symptoms = parsedSymptoms;
        }

        // Update patient notes if provided
        if (patientNotes) {
            record.patientNotes = patientNotes;
        }

        // Process and add new uploaded images
        let imageCount = 0;
        if (req.files && (req.files as any[]).length > 0) {
            const newImages = (req.files as any[]).map(file => ({
                type: 'lab_report' as const,
                filename: file.filename,
                path: getFileUrl(file.filename),
                uploadedBy: patientAddress,
                uploadedByRole: 'Patient',
                uploadDate: new Date()
            }));

            const existingImages = record.images || [];
            newImages.forEach(img => existingImages.push(img));
            imageCount = newImages.length;
        }

        // Record update in blockchain ledger
        const updatedFields = [];
        if (symptoms) updatedFields.push('symptoms');
        if (patientNotes) updatedFields.push('patientNotes');
        if (imageCount > 0) updatedFields.push('images');

        const txHash = await createBlockchainTransaction(
            patientAddress,
            'UPDATE_RECORD',
            record._id,
            {
                updatedFields,
                updatedBy: 'patient',
                timestamp: new Date()
            }
        );

        // Add to update history
        if (!record.updateHistory) {
            record.updateHistory = [] as any;
        }

        const symptomsCount = symptoms ? (typeof symptoms === 'string' ? JSON.parse(symptoms) : symptoms).length : 0;

        record.updateHistory.push({
            timestamp: new Date(),
            updatedBy: patientAddress,
            updatedByRole: 'Patient',
            action: 'PATIENT_UPDATE',
            description: `Patient added ${symptomsCount} symptoms, ${patientNotes ? 'notes' : 'no notes'}, ${imageCount} images`,
            changes: { symptoms: symptomsCount > 0, patientNotes: !!patientNotes, images: imageCount > 0 },
            txHash
        });

        record.lastModified = new Date();
        await record.save();

        res.json({
            success: true,
            record,
            txHash,
            message: `Patient updates added successfully. Doctor will be notified.`
        });

    } catch (err) {
        console.error("Patient update error:", err);
        res.status(500).json({ error: "Failed to add patient updates" });
    }
});

/**
 * Re-run AI analysis on an existing record with latest data
 * Allows doctors to get updated risk assessment after patient adds new information
 *
 * @route POST /api/records/reanalyze/:recordId
 * @param {string} recordId - MongoDB ObjectId of the EHR record
 * @param {string} doctorAddress - Doctor's wallet address (for verification)
 * @returns {object} Updated record with new AI analysis
 */
router.post("/records/reanalyze/:recordId", async (req: Request, res: Response) => {
    try {
        const { recordId } = req.params;

        // Handle case where req.body might be undefined
        if (!req.body || !req.body.doctorAddress) {
            return res.status(400).json({ error: "doctorAddress is required in request body" });
        }

        const { doctorAddress } = req.body;

        // Find the record
        const record = await EHR.findById(recordId);

        if (!record) {
            return res.status(404).json({ error: "Record not found" });
        }

        // Verify doctor is authorized
        if (record.primaryDoctorId !== doctorAddress) {
            return res.status(403).json({ error: "Unauthorized: Only the primary doctor can re-analyze" });
        }

        // Get patient age
        const patient = await User.findOne({ walletAddress: record.patientAddress });
        const patientAge = patient?.age || 50;

        console.log("Re-running AI analysis for record:", recordId);

        // Validate clinical data exists
        if (!record.clinicalData || !record.clinicalData.vitals) {
            return res.status(400).json({ error: "Record missing clinical data for analysis" });
        }

        // ==== XGBoost Prediction ====
        const xgboostPrediction = await predictDisease({
            vitals: {
                bp: record.clinicalData.vitals.bp || '120/80',
                heartRate: record.clinicalData.vitals.heartRate || 70,
                cholesterol: record.clinicalData.vitals.cholesterol || 200,
                sugarLevel: record.clinicalData.vitals.sugarLevel || 100,
                ecgResult: (record.clinicalData.vitals as any).ecgResult || 'Normal'
            },
            clinicalMarkers: (record.clinicalData as any).clinicalMarkers || {},
            age: patientAge
        });

        // ==== Gemini AI Prediction with updated symptoms ====
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

        const symptoms = record.clinicalData.symptoms || [];
        const prompt = `
            Act as a Senior Cardiologist. Perform a cardiovascular risk assessment based on these UCI-standard metrics:
            - Vitals: BP (${record.clinicalData.vitals.bp || 'N/A'}), HR (${record.clinicalData.vitals.heartRate || 'N/A'}), Cholesterol (${record.clinicalData.vitals.cholesterol || 'N/A'} mg/dl), Sugar (${record.clinicalData.vitals.sugarLevel || 'N/A'} mg/dl).
            - Clinical: Chest Pain Type (N/A), ECG Results (${(record.clinicalData.vitals as any).ecgResult || 'Normal'}).
            - Patient Symptoms (UPDATED): ${symptoms.join(", ")}.
            - Patient Self-Report: ${record.patientNotes || 'None provided'}
            - ML Model Risk Assessment: ${xgboostPrediction.risk_level} (Probability: ${(xgboostPrediction.risk_probability * 100).toFixed(1)}%)

            Provide a structured response considering the patient's self-reported updates:
            1. Risk Stratification: (High/Medium/Low)
            2. Clinical Summary: Expert interpretation considering new symptoms and patient notes
            3. Intervention Plan: Updated recommendations based on patient's current condition

            Keep the tone professional and clinical.
        `;

        const geminiResult = await model.generateContent(prompt);
        const geminiText = geminiResult.response.text();

        // Determine final risk level
        const geminiRisk = geminiText.includes("High") ? "High" :
                          geminiText.includes("Medium") ? "Medium" : "Low";

        const riskLevels: { [key: string]: number } = { "Low": 1, "Medium": 2, "High": 3 };
        const xgboostLevel = riskLevels[xgboostPrediction.risk_level] || 1;
        const geminiLevel = riskLevels[geminiRisk] || 1;
        const finalRiskLevel = xgboostLevel >= geminiLevel
            ? xgboostPrediction.risk_level
            : geminiRisk;

        // Store previous risk level
        const previousRiskLevel = record.prediction?.riskLevel || 'Unknown';

        // Update prediction
        record.prediction = {
            riskLevel: finalRiskLevel,
            summary: geminiText,
            xgboostRisk: xgboostPrediction.risk_probability,
            xgboostConfidence: xgboostPrediction.confidence,
            recommendation: xgboostPrediction.recommendation,
            predicted_conditions: (xgboostPrediction.predicted_conditions || []) as any,
            clinical_recommendations: xgboostPrediction.clinical_recommendations || ''
        };

        // Record in blockchain ledger
        const txHash = await createBlockchainTransaction(
            doctorAddress,
            'UPDATE_RECORD',
            record._id,
            {
                action: 'AI_REANALYSIS',
                previousRisk: previousRiskLevel,
                newRisk: finalRiskLevel,
                timestamp: new Date()
            }
        );

        // Add to update history
        if (!record.updateHistory) {
            record.updateHistory = [] as any;
        }

        record.updateHistory.push({
            timestamp: new Date(),
            updatedBy: doctorAddress,
            updatedByRole: 'Doctor',
            action: 'AI_REANALYSIS',
            description: `AI re-analysis completed: Risk level changed from ${previousRiskLevel} to ${finalRiskLevel}`,
            changes: { aiAnalysis: true, riskLevel: true },
            txHash
        } as any);

        record.lastModified = new Date();
        await record.save();

        res.json({
            success: true,
            record,
            txHash,
            message: `AI analysis completed. Risk level: ${finalRiskLevel}`,
            previousRisk: record.prediction?.riskLevel,
            newRisk: finalRiskLevel
        });

    } catch (err) {
        console.error("Re-analysis error:", err);
        res.status(500).json({ error: "Failed to re-analyze record" });
    }
});

// ==================== DASHBOARD STATS ====================

/**
 * Get dashboard statistics for the authenticated user
 * Returns counts of patients, records, transactions, and AI analyses
 *
 * @route GET /api/dashboard/stats
 * @returns {object} Dashboard statistics
 */
router.get("/dashboard/stats", async (_req: Request, res: Response) => {
    try {
        const [totalPatients, totalDoctors, totalRecords, totalTransactions] = await Promise.all([
            User.countDocuments({ role: 'Patient' }),
            User.countDocuments({ role: 'Doctor' }),
            EHR.countDocuments(),
            BlockchainLedger.countDocuments()
        ]);

        // Count records with AI predictions
        const aiAnalyses = await EHR.countDocuments({ 'prediction.riskLevel': { $exists: true, $ne: null } });

        // Get latest block number
        const latestBlock = await BlockchainLedger.findOne().sort({ blockNumber: -1 }).select('blockNumber');

        // Risk distribution
        const [highRisk, mediumRisk, lowRisk] = await Promise.all([
            EHR.countDocuments({ 'prediction.riskLevel': 'High' }),
            EHR.countDocuments({ 'prediction.riskLevel': 'Medium' }),
            EHR.countDocuments({ 'prediction.riskLevel': 'Low' })
        ]);

        res.json({
            success: true,
            stats: {
                totalPatients,
                totalDoctors,
                totalRecords,
                totalTransactions,
                aiAnalyses,
                latestBlockNumber: latestBlock?.blockNumber || 0,
                riskDistribution: { high: highRisk, medium: mediumRisk, low: lowRisk }
            }
        });
    } catch (err) {
        console.error("Dashboard stats error:", err);
        res.status(500).json({ error: "Failed to fetch dashboard stats" });
    }
});

// ==================== BLOCKCHAIN EXPLORER ====================

/**
 * Get all blockchain transactions with pagination for explorer view
 *
 * @route GET /api/blockchain/explorer
 * @query {number} page - Page number (default 1)
 * @query {number} limit - Items per page (default 20)
 * @returns {object} Paginated transactions with stats
 */
router.get("/blockchain/explorer", async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 20;
        const skip = (page - 1) * limit;

        const [transactions, totalCount, latestBlock] = await Promise.all([
            BlockchainLedger.find()
                .sort({ blockNumber: -1, timestamp: -1 })
                .skip(skip)
                .limit(limit),
            BlockchainLedger.countDocuments(),
            BlockchainLedger.findOne().sort({ blockNumber: -1 }).select('blockNumber')
        ]);

        // Get action counts
        const actionCounts = await BlockchainLedger.aggregate([
            { $group: { _id: '$action', count: { $sum: 1 } } }
        ]);

        // Total gas used
        const gasStats = await BlockchainLedger.aggregate([
            { $group: { _id: null, totalGas: { $sum: '$gasUsed' }, avgGas: { $avg: '$gasUsed' } } }
        ]);

        res.json({
            success: true,
            transactions,
            pagination: {
                page,
                limit,
                totalCount,
                totalPages: Math.ceil(totalCount / limit)
            },
            stats: {
                totalTransactions: totalCount,
                latestBlockNumber: latestBlock?.blockNumber || 0,
                totalGasUsed: gasStats[0]?.totalGas || 0,
                avgGasUsed: Math.round(gasStats[0]?.avgGas || 0),
                actionBreakdown: actionCounts.reduce((acc: any, item: any) => {
                    acc[item._id] = item.count;
                    return acc;
                }, {})
            }
        });
    } catch (err) {
        console.error("Blockchain explorer error:", err);
        res.status(500).json({ error: "Failed to fetch blockchain data" });
    }
});

/**
 * Search blockchain by transaction hash
 *
 * @route GET /api/blockchain/search/:query
 */
router.get("/blockchain/search/:query", async (req: Request, res: Response) => {
    try {
        const query = req.params.query as string;

        // Search by tx hash
        let transaction = await BlockchainLedger.findOne({ txHash: query });
        if (transaction) {
            return res.json({ success: true, type: 'transaction', result: transaction });
        }

        // Search by block number
        const blockNum = parseInt(query);
        if (!isNaN(blockNum)) {
            const blockTxs = await BlockchainLedger.find({ blockNumber: blockNum }).sort({ timestamp: -1 });
            if (blockTxs.length > 0) {
                return res.json({ success: true, type: 'block', result: blockTxs });
            }
        }

        // Search by wallet address
        const walletTxs = await BlockchainLedger.find({
            $or: [{ from: query }, { to: query }]
        }).sort({ timestamp: -1 }).limit(50);

        if (walletTxs.length > 0) {
            return res.json({ success: true, type: 'wallet', result: walletTxs });
        }

        res.status(404).json({ success: false, error: "No results found" });
    } catch (err) {
        console.error("Blockchain search error:", err);
        res.status(500).json({ error: "Search failed" });
    }
});

// ==================== ACCESS CONTROL ====================

/**
 * Grant access to a doctor for viewing patient records
 *
 * @route POST /api/access/grant
 */
router.post("/access/grant", async (req: Request, res: Response) => {
    try {
        const { patientAddress, doctorAddress } = req.body;

        if (!patientAddress || !doctorAddress) {
            return res.status(400).json({ error: "Both patientAddress and doctorAddress are required" });
        }

        // Verify doctor exists
        const doctor = await User.findOne({ walletAddress: doctorAddress, role: 'Doctor' });
        if (!doctor) {
            return res.status(404).json({ error: "Doctor not found" });
        }

        // Find patient record
        const record = await EHR.findOne({ patientAddress });

        // Create blockchain transaction for access grant
        const txHash = await createBlockchainTransaction(
            patientAddress,
            'GRANT_ACCESS',
            record?._id,
            { grantedTo: doctorAddress, doctorName: doctor.name, timestamp: new Date() }
        );

        res.json({
            success: true,
            txHash,
            message: `Access granted to Dr. ${doctor.name}`,
            transaction: {
                from: patientAddress,
                to: doctorAddress,
                action: 'GRANT_ACCESS',
                txHash,
                timestamp: new Date()
            }
        });
    } catch (err) {
        console.error("Access grant error:", err);
        res.status(500).json({ error: "Failed to grant access" });
    }
});

/**
 * Revoke access from a doctor
 *
 * @route POST /api/access/revoke
 */
router.post("/access/revoke", async (req: Request, res: Response) => {
    try {
        const { patientAddress, doctorAddress } = req.body;

        if (!patientAddress || !doctorAddress) {
            return res.status(400).json({ error: "Both patientAddress and doctorAddress are required" });
        }

        const record = await EHR.findOne({ patientAddress });

        const txHash = await createBlockchainTransaction(
            patientAddress,
            'REVOKE_ACCESS',
            record?._id,
            { revokedFrom: doctorAddress, timestamp: new Date() }
        );

        res.json({
            success: true,
            txHash,
            message: `Access revoked from doctor ${doctorAddress.slice(0, 6)}...${doctorAddress.slice(-4)}`,
            transaction: {
                from: patientAddress,
                to: doctorAddress,
                action: 'REVOKE_ACCESS',
                txHash,
                timestamp: new Date()
            }
        });
    } catch (err) {
        console.error("Access revoke error:", err);
        res.status(500).json({ error: "Failed to revoke access" });
    }
});

/**
 * Get access control history for a wallet
 *
 * @route GET /api/access/history/:address
 */
router.get("/access/history/:address", async (req: Request, res: Response) => {
    try {
        const address = req.params.address as string;

        const accessTxs = await BlockchainLedger.find({
            $or: [
                { from: address, action: { $in: ['GRANT_ACCESS', 'REVOKE_ACCESS'] } },
                { 'data.grantedTo': address, action: 'GRANT_ACCESS' },
                { 'data.revokedFrom': address, action: 'REVOKE_ACCESS' }
            ]
        }).sort({ timestamp: -1 });

        // Get all doctors in system for the grant UI
        const doctors = await User.find({ role: 'Doctor' }).select('walletAddress name');

        res.json({ success: true, accessHistory: accessTxs, doctors });
    } catch (err) {
        console.error("Access history error:", err);
        res.status(500).json({ error: "Failed to fetch access history" });
    }
});

// ==================== CHAT SYSTEM ====================
// IMPORTANT: Static routes (/chat/list, /chat/send) must come BEFORE parameterized routes (/chat/:x/:y)

/**
 * Get all chats for a user
 */
router.get("/chat/list/:address", async (req: Request, res: Response) => {
    try {
        const address = req.params.address as string;
        const user = await User.findOne({ walletAddress: address } as any);

        let chats;
        if (user?.role === 'Doctor') {
            chats = await Chat.find({ 'participants.doctorAddress': address } as any).sort({ lastMessage: -1 });
        } else {
            chats = await Chat.find({ 'participants.patientAddress': address } as any).sort({ lastMessage: -1 });
        }

        const enriched = await Promise.all(chats.map(async (chat) => {
            const otherAddress = user?.role === 'Doctor'
                ? chat.participants?.patientAddress
                : chat.participants?.doctorAddress;
            const otherUser = await User.findOne({ walletAddress: otherAddress } as any).select('name role');
            const unreadCount = chat.messages.filter((m: any) => !m.read && m.sender !== address).length;
            return {
                _id: chat._id,
                otherAddress,
                otherName: otherUser?.name || 'Unknown',
                otherRole: otherUser?.role || 'Unknown',
                lastMessage: chat.lastMessage,
                lastText: chat.messages.length > 0 ? (chat.messages[chat.messages.length - 1] as any).text : '',
                unreadCount,
                messageCount: chat.messages.length
            };
        }));

        res.json({ success: true, chats: enriched });
    } catch (err) {
        console.error("Chat list error:", err);
        res.status(500).json({ error: "Failed to fetch chats" });
    }
});

/**
 * Send a message in a chat
 */
router.post("/chat/send", async (req: Request, res: Response) => {
    try {
        const { doctorAddress, patientAddress, senderAddress, text } = req.body;

        if (!doctorAddress || !patientAddress || !senderAddress || !text) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const sender = await User.findOne({ walletAddress: senderAddress } as any);

        let chat = await Chat.findOne({
            'participants.doctorAddress': doctorAddress,
            'participants.patientAddress': patientAddress
        } as any);

        if (!chat) {
            chat = await Chat.create({
                participants: { doctorAddress, patientAddress },
                messages: [],
                lastMessage: new Date()
            });
        }

        chat.messages.push({
            sender: senderAddress,
            senderRole: sender?.role === 'Doctor' ? 'Doctor' : 'Patient',
            senderName: sender?.name || 'Unknown',
            text,
            timestamp: new Date(),
            read: false
        } as any);

        chat.lastMessage = new Date();
        await chat.save();

        res.json({ success: true, message: "Message sent" });
    } catch (err) {
        console.error("Chat send error:", err);
        res.status(500).json({ error: "Failed to send message" });
    }
});

/**
 * Mark messages as read
 */
router.put("/chat/read/:doctorAddress/:patientAddress/:readerAddress", async (req: Request, res: Response) => {
    try {
        const doctorAddress = req.params.doctorAddress as string;
        const patientAddress = req.params.patientAddress as string;
        const readerAddress = req.params.readerAddress as string;
        const chat = await Chat.findOne({
            'participants.doctorAddress': doctorAddress,
            'participants.patientAddress': patientAddress
        } as any);
        if (chat) {
            chat.messages.forEach((m: any) => {
                if (m.sender !== readerAddress) m.read = true;
            });
            await chat.save();
        }
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: "Failed to mark as read" });
    }
});

/**
 * Get or create a chat between doctor and patient
 * NOTE: This parameterized route MUST come after /chat/list and /chat/send
 */
router.get("/chat/:doctorAddress/:patientAddress", async (req: Request, res: Response) => {
    try {
        const doctorAddress = req.params.doctorAddress as string;
        const patientAddress = req.params.patientAddress as string;

        let chat = await Chat.findOne({
            'participants.doctorAddress': doctorAddress,
            'participants.patientAddress': patientAddress
        } as any);

        if (!chat) {
            chat = await Chat.create({
                participants: { doctorAddress, patientAddress },
                messages: [],
                lastMessage: new Date()
            });
        }

        const [doctor, patient] = await Promise.all([
            User.findOne({ walletAddress: doctorAddress } as any).select('name'),
            User.findOne({ walletAddress: patientAddress } as any).select('name')
        ]);

        res.json({
            success: true,
            chat,
            doctorName: doctor?.name || 'Doctor',
            patientName: patient?.name || 'Patient'
        });
    } catch (err) {
        console.error("Chat fetch error:", err);
        res.status(500).json({ error: "Failed to fetch chat" });
    }
});

// ==================== FOLLOW-UP REMINDERS ====================

/**
 * Create a follow-up reminder
 */
router.post("/followup/create", async (req: Request, res: Response) => {
    try {
        const { patientAddress, doctorAddress, followUpDate, reason, notes, priority } = req.body;
        const doctor = await User.findOne({ walletAddress: doctorAddress });

        const followUp = await FollowUp.create({
            patientAddress,
            doctorAddress,
            doctorName: doctor?.name || 'Doctor',
            followUpDate: new Date(followUpDate),
            reason,
            notes,
            priority: priority || 'routine'
        });

        res.status(201).json({ success: true, followUp });
    } catch (err) {
        console.error("Follow-up create error:", err);
        res.status(500).json({ error: "Failed to create follow-up" });
    }
});

/**
 * Get follow-ups for a user (doctor or patient)
 */
router.get("/followup/list/:address", async (req: Request, res: Response) => {
    try {
        const address = req.params.address as string;
        const user = await User.findOne({ walletAddress: address } as any);
        const query = user?.role === 'Doctor'
            ? { doctorAddress: address }
            : { patientAddress: address };

        const followUps = await FollowUp.find(query).sort({ followUpDate: 1 });

        // Enrich with patient/doctor names
        const enriched = await Promise.all(followUps.map(async (fu) => {
            const otherAddress = user?.role === 'Doctor' ? fu.patientAddress : fu.doctorAddress;
            const other = await User.findOne({ walletAddress: otherAddress }).select('name');
            return { ...fu.toObject(), otherName: other?.name || 'Unknown' };
        }));

        res.json({ success: true, followUps: enriched });
    } catch (err) {
        console.error("Follow-up list error:", err);
        res.status(500).json({ error: "Failed to fetch follow-ups" });
    }
});

/**
 * Update follow-up status
 */
router.put("/followup/update/:id", async (req: Request, res: Response) => {
    try {
        const { status } = req.body;
        const followUp = await FollowUp.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );
        res.json({ success: true, followUp });
    } catch (err) {
        res.status(500).json({ error: "Failed to update follow-up" });
    }
});

// ==================== MEDICATION TRACKER ====================

/**
 * Log medication taken/missed
 */
router.post("/medication/log", async (req: Request, res: Response) => {
    try {
        const { patientAddress, medicineName, dosage, date, status, time, notes } = req.body;

        // Upsert — update if exists for same patient+medicine+date
        const log = await MedicationLog.findOneAndUpdate(
            { patientAddress, medicineName, date },
            { patientAddress, medicineName, dosage, date, status, time, notes, loggedAt: new Date() },
            { upsert: true, new: true }
        );

        res.json({ success: true, log });
    } catch (err) {
        console.error("Medication log error:", err);
        res.status(500).json({ error: "Failed to log medication" });
    }
});

/**
 * Get medication logs for a patient (optionally filtered by date)
 */
router.get("/medication/logs/:patientAddress", async (req: Request, res: Response) => {
    try {
        const patientAddress = req.params.patientAddress as string;
        const date = req.query.date as string | undefined;

        // Fetch logs for this date (if no date filter, get all recent)
        const logQuery: any = { patientAddress };
        if (date) logQuery.date = date;

        const logs = await MedicationLog.find(logQuery).sort({ date: -1, medicineName: 1 });

        // Get ALL prescriptions from patient's EHR record
        const ehr = await EHR.findOne({ patientAddress } as any);
        const prescriptions = ehr?.prescriptions || [];

        console.log(`MedTracker: patient=${patientAddress}, prescriptions=${prescriptions.length}, logs=${logs.length}`);

        res.json({ success: true, logs, prescriptions });
    } catch (err) {
        console.error("Medication logs fetch error:", err);
        res.status(500).json({ error: "Failed to fetch medication logs" });
    }
});

// ==================== VITALS HISTORY ====================

/**
 * Save a vitals snapshot (called automatically when records are created/updated)
 */
router.post("/vitals/save", async (req: Request, res: Response) => {
    try {
        const { patientAddress, recordedBy, vitals } = req.body;

        const bp = vitals.bp || '120/80';
        const parts = bp.split('/');

        await VitalsHistory.create({
            patientAddress,
            recordedBy,
            date: new Date(),
            vitals: {
                bp,
                systolicBP: parseInt(parts[0]) || 120,
                diastolicBP: parseInt(parts[1]) || 80,
                heartRate: vitals.heartRate || 0,
                cholesterol: vitals.cholesterol || 0,
                sugarLevel: vitals.sugarLevel || 0
            }
        });

        res.json({ success: true });
    } catch (err) {
        console.error("Vitals save error:", err);
        res.status(500).json({ error: "Failed to save vitals" });
    }
});

/**
 * Get vitals history for charting
 */
router.get("/vitals/history/:patientAddress", async (req: Request, res: Response) => {
    try {
        const patientAddress = req.params.patientAddress as string;
        const history = await VitalsHistory.find({ patientAddress } as any)
            .sort({ date: 1 })
            .limit(50);

        // If no history saved yet, create one from current EHR record
        if (history.length === 0) {
            const ehr = await EHR.findOne({ patientAddress } as any);
            if (ehr?.clinicalData?.vitals) {
                const v = ehr.clinicalData.vitals;
                const bp = v.bp || '120/80';
                const parts = String(bp).split('/');
                const snapshot = await VitalsHistory.create({
                    patientAddress,
                    recordedBy: ehr.primaryDoctorId || '',
                    date: ehr.createdAt,
                    vitals: {
                        bp: String(bp),
                        systolicBP: parseInt(String(parts[0])) || 120,
                        diastolicBP: parseInt(String(parts[1] || '80')) || 80,
                        heartRate: v.heartRate || 0,
                        cholesterol: v.cholesterol || 0,
                        sugarLevel: v.sugarLevel || 0
                    }
                });
                return res.json({ success: true, history: [snapshot] });
            }
        }

        res.json({ success: true, history });
    } catch (err) {
        console.error("Vitals history error:", err);
        res.status(500).json({ error: "Failed to fetch vitals history" });
    }
});

/**
 * Seed demo vitals data for a patient (for chart demonstration)
 */
router.post("/vitals/seed-demo/:patientAddress", async (req: Request, res: Response) => {
    try {
        const patientAddress = req.params.patientAddress as string;

        // Check if demo data already exists
        const existing = await VitalsHistory.countDocuments({ patientAddress } as any);
        if (existing >= 8) {
            return res.json({ success: true, message: "Demo data already exists", count: existing });
        }

        // Generate 12 months of realistic vitals data
        const demoData = [];
        const baseDate = new Date();
        baseDate.setMonth(baseDate.getMonth() - 11);

        let systolic = 125 + Math.floor(Math.random() * 15);
        let diastolic = 80 + Math.floor(Math.random() * 8);
        let heartRate = 72 + Math.floor(Math.random() * 10);
        let cholesterol = 210 + Math.floor(Math.random() * 30);
        let sugar = 95 + Math.floor(Math.random() * 15);

        for (let i = 0; i < 12; i++) {
            const date = new Date(baseDate);
            date.setMonth(date.getMonth() + i);

            // Simulate realistic fluctuations
            systolic = Math.max(105, Math.min(175, systolic + Math.floor(Math.random() * 14) - 7));
            diastolic = Math.max(60, Math.min(100, diastolic + Math.floor(Math.random() * 8) - 4));
            heartRate = Math.max(58, Math.min(110, heartRate + Math.floor(Math.random() * 10) - 5));
            cholesterol = Math.max(150, Math.min(300, cholesterol + Math.floor(Math.random() * 20) - 10));
            sugar = Math.max(70, Math.min(160, sugar + Math.floor(Math.random() * 14) - 7));

            demoData.push({
                patientAddress,
                recordedBy: 'demo-doctor',
                date,
                vitals: {
                    bp: `${systolic}/${diastolic}`,
                    systolicBP: systolic,
                    diastolicBP: diastolic,
                    heartRate,
                    cholesterol,
                    sugarLevel: sugar
                }
            });
        }

        await VitalsHistory.insertMany(demoData);

        res.json({ success: true, message: `Seeded ${demoData.length} months of vitals data`, count: demoData.length });
    } catch (err) {
        console.error("Seed demo error:", err);
        res.status(500).json({ error: "Failed to seed demo data" });
    }
});

export default router;
