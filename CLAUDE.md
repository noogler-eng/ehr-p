# Secure EHR System - Complete Documentation

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [System Architecture](#system-architecture)
3. [Features](#features)
4. [Technology Stack](#technology-stack)
5. [Setup Instructions](#setup-instructions)
6. [API Documentation](#api-documentation)
7. [Role-Based Access Control](#role-based-access-control)
8. [AI Models](#ai-models)
9. [Blockchain Integration](#blockchain-integration)
10. [Deployment](#deployment)
11. [Troubleshooting](#troubleshooting)

---

## 🏥 Project Overview

The Secure EHR System is a decentralized Electronic Health Record platform that combines blockchain technology, AI-powered diagnostics, and role-based access control to create a secure and intelligent healthcare data management system.

###Key Innovations:
- **MetaMask Wallet Authentication**: Password-less login using Ethereum wallets
- **Dual AI System**: XGBoost ML model + Gemini AI for comprehensive disease prediction
- **Simulated Blockchain Ledger**: MongoDB-based fake blockchain for transaction tracking
- **Role-Based Access**: Doctor, Patient, Pharmacist, and Admin roles with specific permissions
- **Image Support**: Upload and store medical images locally
- **Modern UI**: Sleek black-themed design with only shades of black/white/gray

---

## 🏗️ System Architecture

```
┌─────────────────┐
│                 │
│   Frontend      │  React + Vite + TypeScript
│   (Port 5173)   │  MetaMask Integration
│                 │
└────────┬────────┘
         │
         │ HTTP/REST
         │
┌────────┴────────┐
│                 │
│   Backend API   │  Node.js + Express + TypeScript
│   (Port 8080)   │
│                 │
└────┬────┬───────┘
     │    │
     │    └──────────┐
     │               │
┌────┴─────┐   ┌────┴────────┐
│          │   │             │
│ MongoDB  │   │   Python    │
│ Database │   │   XGBoost   │
│          │   │   Model     │
└──────────┘   └─────────────┘
```

### Directory Structure

```
secure-ehr-system/
├── backend/
│   ├── src/
│   │   ├── index.ts                 # Main server entry point
│   │   ├── models/
│   │   │   └── Schemas.ts           # MongoDB schemas (User, EHR, BlockchainLedger)
│   │   ├── routes/
│   │   │   └── ehrRoutes.ts         # All API endpoints
│   │   ├── services/
│   │   │   ├── xgboostService.ts    # XGBoost integration
│   │   │   └── blockchainService.ts # Blockchain ledger functions
│   │   └── middleware/
│   │       └── upload.ts            # Multer image upload middleware
│   ├── ml_model/
│   │   ├── train_model.py           # XGBoost model training script
│   │   ├── predict.py               # XGBoost prediction script
│   │   ├── requirements.txt         # Python dependencies
│   │   └── setup.sh                 # Model setup script
│   ├── uploads/                     # Uploaded images storage
│   ├── package.json
│   └── .env
├── frontend/
│   └── vite-project/
│       ├── src/
│       │   ├── App.tsx              # Main application component
│       │   ├── components/
│       │   │   ├── Navbar.tsx       # Navigation bar
│       │   │   ├── Dashboard/
│       │   │   │   ├── Timeline.tsx     # Medical records timeline
│       │   │   │   └── DiscoveryList.tsx # Role-based lists
│       │   │   └── Modals/
│       │   │       ├── OnboardingModal.tsx # New user registration
│       │   │       └── AddRecordModal.tsx  # Clinical entry form
│       │   └── index.css
│       └── package.json
├── blockchain/
│   └── contracts/
│       └── EHRRegistry.sol          # Smart contract (for reference)
├── CLAUDE.md                        # This file
└── README.md
```

---

## ✨ Features

### 1. Wallet-Based Authentication
- No passwords required
- MetaMask integration for secure login
- Session persistence using localStorage
- Automatic reconnection on page reload

### 2. Role-Based Access Control (RBAC)

#### **Doctor** 🩺
- ✅ Create new medical records for any patient
- ✅ View **only their own patients** (patients they've treated)
- ✅ See complete medical history **WITH AI predictions**
- ✅ See XGBoost ML risk analysis **WITH confidence scores**
- ✅ See Gemini AI clinical summaries **WITH intervention plans**
- ✅ Add recommendations to existing records
- ✅ Update prescriptions
- ✅ Upload medical images (max 5 per visit)
- ✅ Discovery list shows "Treated Patients" (Clinical Registry)
- ❌ Cannot view patients they haven't treated

#### **Patient** 🧑‍⚕️
- ✅ View **ONLY their own medical history** (automatically loaded on login)
- ✅ See all vitals, symptoms, and prescriptions
- ✅ See doctor recommendations
- ✅ View medical images
- ✅ See all doctors they've visited
- ❌ **CANNOT see AI risk predictions** (hidden completely)
- ❌ **CANNOT see XGBoost analysis** (hidden completely)
- ❌ **CANNOT see Gemini AI summaries** (hidden completely)
- ❌ No discovery list (only see their own data)
- ❌ Cannot view other patients' records

#### **Pharmacist** 💊
- ✅ Access **complete patient registry** (all patients in system)
- ✅ View all patients' prescriptions
- ✅ See doctor recommendations
- ✅ View patient vitals and symptoms
- ✅ See medical images
- ✅ Discovery list shows "All Patients" (Complete Registry)
- ❌ **CANNOT see AI risk predictions** (hidden completely)
- ❌ **CANNOT see XGBoost analysis** (hidden completely)
- ❌ **CANNOT see Gemini AI summaries** (hidden completely)
- ❌ Cannot create or modify records

#### **Admin** 🔐
- ✅ Access **complete patient registry** (all patients in system)
- ✅ View any patient's complete medical history
- ✅ See **full AI predictions and analysis** (same as doctors)
- ✅ See XGBoost ML risk analysis **WITH confidence scores**
- ✅ See Gemini AI clinical summaries **WITH intervention plans**
- ✅ View all prescriptions and recommendations
- ✅ View all medical images
- ✅ Discovery list shows "All Patients" (System Administrator View)
- ❌ Cannot create new records (read-only access)
- ❌ Cannot modify existing records (read-only access)

### 3. AI-Powered Diagnostics

#### **XGBoost ML Model**
- Trained on cardiovascular disease data
- Provides risk probability (0-1 scale)
- Risk stratification: Low/Medium/High
- Confidence scores
- Personalized recommendations

#### **Gemini AI**
- Natural language clinical summaries
- Expert cardiologist-level analysis
- Intervention plans
- Lifestyle recommendations

### 4. Blockchain Ledger Simulation
- Fake transaction hashes (Ethereum-style 0x...)
- Block number tracking
- Transaction history for each wallet
- Immutable audit trail
- Gas simulation
- Transaction types: CREATE_RECORD, UPDATE_RECORD, GRANT_ACCESS, REVOKE_ACCESS

### 5. Image Management
- Support for lab reports and medical imaging
- Local file storage in `backend/uploads/`
- Formats: JPEG, PNG, PDF, DICOM
- Maximum file size: 10MB per file
- Multiple images per visit (up to 5)

---

## 🎨 UI Design - Pure Black Theme

### Color Palette

The entire application uses **only shades of black, white, and gray** for a sleek, professional, medical-grade aesthetic. No colors (red, green, blue, etc.) are used anywhere in the interface.

**Primary Colors:**
- `#050505` - Main background (pure black)
- `zinc-900` (`#18181b`) - Card backgrounds
- `zinc-800` (`#27272a`) - Borders, secondary elements
- `zinc-700` (`#3f3f46`) - Tertiary elements
- `zinc-600` (`#52525b`) - Muted text
- `zinc-500` (`#71717a`) - Secondary text
- `zinc-400` (`#a1a1aa`) - Body text
- `zinc-300` (`#d4d4d8`) - Light text
- `zinc-200` (`#e4e4e7`) - Very light elements
- `white` (`#ffffff`) - Primary text, high emphasis

**Risk Level Colors (Black Theme):**
- **High Risk**: `bg-white/10 border-white/30 text-white` (white badges)
- **Medium Risk**: `bg-zinc-700/50 border-zinc-600 text-zinc-300` (gray badges)
- **Low Risk**: `bg-zinc-900 border-zinc-700 text-zinc-500` (dark gray badges)

**Interactive States:**
- Hover: `hover:border-zinc-600 hover:bg-zinc-800`
- Active: `active:scale-95` or `active:scale-[0.98]`
- Focus: `focus:ring-zinc-700`

**Typography:**
- Headers: `font-black italic tracking-tighter uppercase`
- Body: `font-medium` or `font-semibold`
- Labels: `text-[10px] font-black uppercase tracking-widest`
- Mono: `font-mono` (for wallet addresses, tx hashes)

### Key Design Elements

**Cards:**
```css
bg-zinc-900/50 border border-zinc-800 rounded-[2.5rem] backdrop-blur-md
```

**Timeline Records:**
```css
bg-zinc-900/40 border border-zinc-800 rounded-[2.5rem] p-8 hover:border-zinc-600
```

**Buttons:**
```css
/* Primary Action */
bg-white text-black rounded-[2.5rem] font-black hover:bg-zinc-200 active:scale-95

/* Secondary Action */
bg-zinc-900 border border-zinc-800 text-zinc-500 hover:text-white hover:bg-zinc-800
```

**Vital Cards:**
```css
bg-black/20 border border-zinc-800/50 p-4 rounded-2xl
```

### Design Philosophy

- **No Color Distractions**: Medical data should be presented neutrally without emotional color associations
- **High Contrast**: White text on black backgrounds ensures readability
- **Professional Aesthetic**: Black/gray palette conveys seriousness and trustworthiness
- **Modern & Clean**: Large rounded corners (2.5rem), generous padding, clear hierarchy

---

## 🛠️ Technology Stack

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js v5.2.1
- **Language**: TypeScript v5.9.3
- **Database**: MongoDB (Cloud Atlas)
- **ODM**: Mongoose v9.1.6
- **AI**: Google Generative AI (Gemini 2.5 Flash Lite)
- **ML**: Python XGBoost (called via child_process)
- **File Upload**: Multer v1.4.5
- **API Docs**: Swagger/OpenAPI

### Frontend
- **Framework**: React v19.2.0
- **Build Tool**: Vite v7.3.1
- **Language**: TypeScript v5.9.3
- **Styling**: Tailwind CSS v4.1.18
- **HTTP Client**: Axios v1.13.5
- **Wallet**: ethers.js v6.16.0
- **Icons**: Lucide React

### Python ML
- **ML Library**: XGBoost v2.0.3
- **Data Processing**: NumPy v1.24.3, Pandas v2.0.3
- **ML Utilities**: scikit-learn v1.3.0
- **Serialization**: joblib v1.3.2

---

## 🚀 Setup Instructions

### Prerequisites
- Node.js 18+ and npm
- Python 3.8+ with pip
- MongoDB Atlas account (or local MongoDB)
- MetaMask browser extension
- Git

### 1. Clone the Repository
```bash
git clone <repository-url>
cd secure-ehr-system
```

### 2. Backend Setup

#### Install Node.js Dependencies
```bash
cd backend
npm install
```

#### Set Up Python Environment and XGBoost Model
```bash
cd ml_model
chmod +x setup.sh
./setup.sh
```

This script will:
- Create a Python virtual environment
- Install all Python dependencies
- Train the XGBoost model
- Save model files (xgboost_model.pkl, scaler.pkl, feature_names.pkl)

#### Configure Environment Variables
Create a `.env` file in the `backend/` directory:

```env
PORT=8080
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/secure_ehr_db
GEMINI_API_KEY=your_gemini_api_key_here
JWT_SECRET=your_secret_key_here
NODE_ENV=development
```

**Important**: Replace with your actual MongoDB URI and Gemini API key.

#### Start Backend Server
```bash
npm run dev
```

The backend will be available at `http://localhost:8080`
API documentation: `http://localhost:8080/api-docs`

### 3. Frontend Setup

#### Install Dependencies
```bash
cd frontend/vite-project
npm install
```

#### Configure API Endpoint
If deploying to production, update the API_BASE URL in `src/App.tsx`:
```typescript
const API_BASE = "https://your-backend-url.com/api";
```

#### Start Development Server
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

### 4. MetaMask Setup
1. Install MetaMask browser extension
2. Create or import a wallet
3. Switch to any Ethereum network (doesn't matter for this app)
4. Connect to the application

---

## 📡 API Documentation

### Base URL
```
http://localhost:8080/api
```

### Authentication Endpoints

#### POST `/auth/login`
Wallet-based login or registration.

**Request Body:**
```json
{
  "walletAddress": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
  "name": "Dr. Sarah Johnson",  // Required for new users
  "role": "Doctor",              // Patient | Doctor | Pharmacist | Admin
  "age": 35,
  "gender": "Female",
  "bloodGroup": "O+"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "_id": "...",
    "walletAddress": "0x742...",
    "name": "Dr. Sarah Johnson",
    "role": "Doctor",
    "age": 35,
    "gender": "Female",
    "bloodGroup": "O+",
    "activeMedications": [],
    "lastUpdated": "2025-01-20T10:30:00.000Z"
  },
  "message": "Welcome back!"
}
```

### Medical Record Endpoints

#### POST `/records/submit-visit`
Submit a new medical visit with AI analysis.

**Content-Type:** `multipart/form-data`

**Form Fields:**
- `patientAddress`: string
- `doctorAddress`: string
- `vitals`: JSON string
- `clinicalMarkers`: JSON string
- `symptoms`: JSON string (array)
- `prescriptions`: JSON string (array)
- `images`: File[] (optional, max 5 files)

**Response:**
```json
{
  "success": true,
  "mongoId": "676d8e9f2a1b3c4d5e6f7a8b",
  "txHash": "0xa3f5d8c2b9e4...",
  "prediction": {
    "riskLevel": "Medium",
    "geminiSummary": "...",
    "xgboostRisk": 0.45,
    "recommendation": "..."
  },
  "images": [...]
}
```

#### GET `/records/history/:address`
Retrieve complete medical history for a patient.

**Response:**
```json
{
  "success": true,
  "profile": {...},
  "count": 5,
  "history": [...]
}
```

#### PUT `/records/update/:recordId`
Update an existing medical record (Doctor only).

**Request Body:**
```json
{
  "doctorAddress": "0x...",
  "doctorRecommendations": "Follow up in 2 weeks...",
  "prescriptions": [...]
}
```

### Doctor Endpoints

#### GET `/doctor/my-patients/:doctorAddress`
Get list of all patients treated by a doctor.

**Response:**
```json
{
  "success": true,
  "patients": [
    {
      "walletAddress": "0x...",
      "profile": {...}
    }
  ]
}
```

### Patient Endpoints

#### GET `/patient/my-doctors/:patientAddress`
Get list of all doctors visited by a patient.

### Pharmacist Endpoints

#### GET `/pharmacist/registry`
Get complete patient registry.

#### GET `/pharmacy/prescriptions/:patientAddress`
Get latest prescriptions for a patient.

### Blockchain Endpoints

#### GET `/blockchain/transaction/:txHash`
Get transaction details.

#### GET `/blockchain/wallet/:address`
Get all transactions for a wallet.

---

## 🔐 Role-Based Access Control

### Data Visibility Matrix

| Data Type | Doctor | Patient | Pharmacist | Admin |
|-----------|--------|---------|------------|-------|
| **Discovery List Scope** | Only their patients | None (auto-loads own data) | All patients | All patients |
| Patient Demographics | ✅ (own patients) | ✅ (own only) | ✅ (all patients) | ✅ (all patients) |
| Visit Date | ✅ | ✅ (own only) | ✅ | ✅ |
| Vitals (BP, HR, Cholesterol, Sugar) | ✅ | ✅ (own only) | ✅ | ✅ |
| Symptoms | ✅ | ✅ (own only) | ✅ | ✅ |
| Prescriptions | ✅ | ✅ (own only) | ✅ | ✅ |
| Doctor Recommendations | ✅ | ✅ (own only) | ✅ | ✅ |
| **AI Risk Badge (High/Medium/Low)** | ✅ **Visible** | ❌ **Hidden** | ❌ **Hidden** | ✅ **Visible** |
| **AI Diagnostic Analysis Section** | ✅ **Visible** | ❌ **Hidden** | ❌ **Hidden** | ✅ **Visible** |
| **Gemini AI Clinical Summary** | ✅ **Visible** | ❌ **Hidden** | ❌ **Hidden** | ✅ **Visible** |
| **XGBoost ML Risk Probability** | ✅ **Visible** | ❌ **Hidden** | ❌ **Hidden** | ✅ **Visible** |
| **XGBoost Model Confidence** | ✅ **Visible** | ❌ **Hidden** | ❌ **Hidden** | ✅ **Visible** |
| Medical Images | ✅ | ✅ (own only) | ✅ | ✅ |
| Blockchain Tx Hash | ✅ | ✅ (own only) | ✅ | ✅ |
| **Can Create Records** | ✅ Yes | ❌ No | ❌ No | ❌ No |
| **Can Update Records** | ✅ Yes | ❌ No | ❌ No | ❌ No |

### Frontend Implementation Details

**Timeline.tsx (Lines 102-238):**
- Risk badge only renders when `userRole === "Doctor" || userRole === "Admin"`
- AI Diagnostic Analysis section only renders when `userRole === "Doctor" || userRole === "Admin"`
- Doctor Recommendations visible to Doctors, Pharmacists, and Patients
- Prescriptions visible to all roles

**App.tsx (Lines 96-134):**
- Patients auto-load their own history on login (no manual selection)
- Doctors fetch patient list via `/doctor/my-patients/:doctorAddress`
- Pharmacists fetch all patients via `/pharmacist/registry`
- Admins fetch all patients via `/pharmacist/registry`

**DiscoveryList.tsx (Lines 24-39):**
- Dynamically changes title based on role:
  - Doctor: "Treated Patients" - "Clinical Registry"
  - Patient: N/A (component not rendered)
  - Pharmacist: "All Patients" - "Complete Registry"
  - Admin: "All Patients" - "System Administrator View"

---

## 🤖 AI Models

### XGBoost Model

**Location:** `backend/ml_model/`

**Input Features:**
- Age
- Sex (0: Female, 1: Male)
- Chest pain type (0-3)
- Resting blood pressure
- Cholesterol level
- Fasting blood sugar (>120 mg/dl)
- Resting ECG results (0-2)
- Maximum heart rate
- Exercise-induced angina (0/1)
- ST depression (oldpeak)
- Slope of peak exercise ST segment
- Number of major vessels (0-3)
- Thalassemia type (0-3)

**Output:**
- Prediction (0 or 1)
- Risk level (Low/Medium/High)
- Risk probability (0-1)
- Confidence score
- Personalized recommendations

**Training:**
```bash
cd backend/ml_model
source venv/bin/activate
python train_model.py
```

**Prediction:**
The model is automatically called by the backend when submitting a visit.

### Gemini AI

**Model:** gemini-2.5-flash-lite

**Prompt Structure:**
```
Act as a Senior Cardiologist. Perform a cardiovascular risk assessment based on:
- Vitals: BP, HR, Cholesterol, Sugar Level
- Clinical markers: Chest pain type, ECG results
- Patient symptoms
- XGBoost ML Model risk assessment

Provide:
1. Risk Stratification (High/Medium/Low)
2. Clinical Summary
3. Intervention Plan
```

**Integration:** Automatic during visit submission

---

## ⛓️ Blockchain Integration

### Simulated Blockchain Ledger

The system uses MongoDB to simulate a blockchain ledger with realistic transaction hashes and block numbers.

**Transaction Structure:**
```javascript
{
  txHash: "0xa3f5d8c2b9e4...",  // 66-char hex string
  blockNumber: 12345,
  timestamp: Date,
  from: "0x...",                 // Initiator wallet address
  to: "0x...",                   // Contract address
  recordId: ObjectId,            // Reference to EHR record
  action: "CREATE_RECORD",       // Transaction type
  data: {...},                   // Additional metadata
  gasUsed: 45823,                // Simulated gas
  status: "confirmed"
}
```

**Transaction Types:**
- `CREATE_RECORD`: New medical record created
- `UPDATE_RECORD`: Existing record modified
- `GRANT_ACCESS`: Access granted to doctor
- `REVOKE_ACCESS`: Access revoked from doctor

**Viewing Transactions:**
- GET `/api/blockchain/transaction/:txHash`
- GET `/api/blockchain/wallet/:address`

---

## 🚀 Deployment

### Option 1: Docker Deployment

#### Build and Run
```bash
# Build images
docker-compose build

# Start services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Option 2: Vercel + Railway Deployment

#### Frontend (Vercel)
1. Push code to GitHub
2. Import project in Vercel
3. Set build command: `cd frontend/vite-project && npm run build`
4. Set output directory: `frontend/vite-project/dist`
5. Add environment variable: `VITE_API_URL=https://your-backend.railway.app/api`
6. Deploy

#### Backend (Railway)
1. Create new project in Railway
2. Connect GitHub repository
3. Set root directory: `backend`
4. Add environment variables:
   - `PORT=8080`
   - `MONGO_URI=your_mongodb_uri`
   - `GEMINI_API_KEY=your_api_key`
   - `NODE_ENV=production`
5. Deploy

#### Python Model (Railway)
Since Railway supports Python:
1. Ensure `ml_model/` directory is included
2. Add `Procfile`:
   ```
   web: cd backend && npm start
   ```
3. Railway will automatically detect and install Python dependencies

### Option 3: AWS/GCP/Azure

See detailed deployment guides in the `deployment/` directory.

---

## 🐛 Troubleshooting

### Common Issues

#### 1. Frontend Changes Not Showing / Browser Cache Issues

**Error/Symptom:** Code changes made to frontend components are not visible in the browser despite restarting the dev server.

**Root Cause:**
- Browser cache storing old JavaScript/CSS files
- Vite's internal cache in `node_modules/.vite/`
- Service workers caching old assets
- Browser still using cached HTML/JS from previous build

**Solutions (try in order):**

**A. Hard Refresh Browser (Try This First):**
```
Windows/Linux: Ctrl + Shift + R  or  Ctrl + F5
Mac: Cmd + Shift + R  or  Cmd + Option + R
```

**B. Clear Vite Cache and Restart:**
```bash
cd frontend/vite-project

# Kill the dev server first (Ctrl+C)

# Clear Vite cache
rm -rf node_modules/.vite

# Clear dist folder
rm -rf dist

# Restart dev server
npm run dev
```

**C. Clear Browser Cache Completely:**
1. Open browser DevTools (F12)
2. Go to Application tab (Chrome) or Storage tab (Firefox)
3. Click "Clear Storage" or "Clear Site Data"
4. Check all boxes (Cache, Cookies, Storage)
5. Click "Clear site data"
6. Hard refresh again (Ctrl+Shift+R)

**D. Open in Incognito/Private Mode:**
```
Chrome: Ctrl+Shift+N
Firefox: Ctrl+Shift+P
Safari: Cmd+Shift+N
```
This bypasses all cache and extensions. If changes show here, it's definitely a cache issue.

**E. Clear Node Modules and Reinstall:**
```bash
cd frontend/vite-project
rm -rf node_modules package-lock.json
npm install
npm run dev
```

**F. Check if Vite is Actually Reloading:**
- Look for `[vite] hmr update` messages in terminal when you save files
- If HMR (Hot Module Replacement) isn't working, kill and restart server
- Check for any TypeScript errors preventing reload

**G. Verify File Timestamps:**
```bash
# Check when files were last modified
ls -la src/components/Dashboard/Timeline.tsx
ls -la src/App.tsx
```
Ensure timestamps are recent.

**H. Nuclear Option - Full Reset:**
```bash
# Stop all servers
pkill -f vite
pkill -f node

# Frontend cleanup
cd frontend/vite-project
rm -rf node_modules .vite dist package-lock.json
npm install
npm run dev

# Backend cleanup (if needed)
cd ../../backend
rm -rf node_modules package-lock.json
npm install
npm run dev
```

**Prevention:**
- Always use hard refresh (Ctrl+Shift+R) when testing frontend changes
- Use DevTools with "Disable cache" enabled during development
- Keep DevTools open to see HMR updates in real-time

#### 2. XGBoost Model Not Found
**Error:** `Failed to start prediction service`

**Solution:**
```bash
cd backend/ml_model
./setup.sh
```

#### 2. MongoDB Connection Failed
**Error:** `MongooseServerSelectionError`

**Solution:**
- Check MongoDB URI in `.env`
- Ensure IP address is whitelisted in MongoDB Atlas
- Verify network connection

#### 3. MetaMask Connection Issues
**Error:** `window.ethereum is undefined`

**Solution:**
- Install MetaMask extension
- Refresh the page
- Check browser console for errors

#### 4. Image Upload Fails
**Error:** `Invalid file type`

**Solution:**
- Ensure file is JPEG, PNG, PDF, or DICOM
- Check file size (max 10MB)
- Verify `uploads/` directory exists

#### 5. CORS Errors
**Error:** `Access-Control-Allow-Origin`

**Solution:**
- Update CORS settings in `backend/src/index.ts`
- Add your frontend URL to allowed origins

### Environment Variables Checklist

Backend `.env`:
- [ ] `PORT` set
- [ ] `MONGO_URI` valid
- [ ] `GEMINI_API_KEY` valid
- [ ] `JWT_SECRET` set
- [ ] `NODE_ENV` set

Frontend:
- [ ] `VITE_API_URL` set (for production)

### Testing the System

1. **Backend Health Check:**
   ```bash
   curl http://localhost:8080/
   ```

2. **API Documentation:**
   Open `http://localhost:8080/api-docs`

3. **XGBoost Model Test:**
   ```bash
   cd backend/ml_model
   source venv/bin/activate
   echo '{"vitals":{"bp":"120/80","heartRate":75,"cholesterol":200,"sugarLevel":95,"ecgResult":"normal"},"clinicalMarkers":{"chestPainType":"asymptomatic"},"age":45}' | python predict.py
   ```

4. **Database Connection:**
   Check backend logs for:
   ```
   EHR System Backend running on port 8080
   ```

---

## 📝 Development Notes

### Adding New Features

1. **New API Endpoint:**
   - Add route in `backend/src/routes/ehrRoutes.ts`
   - Update Swagger documentation
   - Add corresponding frontend API call

2. **New User Role:**
   - Update `UserSchema` in `backend/src/models/Schemas.ts`
   - Add role logic in `ehrRoutes.ts`
   - Update frontend role checks in `App.tsx`

3. **New AI Model:**
   - Add model files to `backend/ml_model/`
   - Create service in `backend/src/services/`
   - Integrate in record submission flow

### Code Style Guidelines

- Use TypeScript strict mode
- Add JSDoc comments to all functions
- Follow existing naming conventions
- Use async/await over Promises
- Handle errors gracefully
- Log important operations

### Git Workflow

```bash
# Create feature branch
git checkout -b feature/your-feature-name

# Make changes and commit
git add .
git commit -m "feat: add your feature"

# Push to remote
git push origin feature/your-feature-name

# Create pull request
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Update documentation
6. Submit a pull request

---

## 📄 License

This project is licensed under the MIT License.

---

## 👥 Support

For issues, questions, or contributions:
- Open an issue on GitHub
- Email: support@secure-ehr.com
- Documentation: https://docs.secure-ehr.com

---

## 🎯 Future Enhancements

- [ ] Real blockchain integration (Ethereum/Polygon)
- [ ] End-to-end encryption for medical records
- [ ] Mobile app (React Native)
- [ ] Telemedicine video calls
- [ ] Lab integration APIs
- [ ] Insurance claim processing
- [ ] Multi-language support
- [ ] Advanced analytics dashboard
- [ ] Automated appointment scheduling
- [ ] Prescription e-signing with digital certificates

---

**Last Updated:** January 2025
**Version:** 2.0.0
**Maintained by:** Secure EHR Team
