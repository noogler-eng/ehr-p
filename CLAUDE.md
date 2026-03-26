# Secure EHR System - Complete Documentation

## Project Overview

The Secure EHR System is a decentralized Electronic Health Record platform combining blockchain technology, AI-powered diagnostics (XGBoost ML + Google Gemini AI), and role-based access control for intelligent healthcare data management.

### Key Innovations
- **MetaMask Wallet Authentication** — Password-less login using Ethereum wallets
- **Dual AI System** — XGBoost ML model (12 cardiovascular diseases) + Gemini AI clinical summaries
- **Simulated Blockchain Ledger** — MongoDB-based blockchain with realistic Ethereum tx hashes, block numbers, gas tracking
- **Role-Based Access Control** — Doctor, Patient, Pharmacist, Admin with granular permissions
- **Doctor-Patient Chat** — Real-time messaging system between connected doctor-patient pairs
- **Drug Interaction Checker** — Auto-detects 15+ dangerous drug combinations when prescribing
- **Vitals Trend Charts** — SVG line charts showing BP, heart rate, cholesterol, sugar over time
- **Medication Tracker** — Daily medication adherence logging for patients
- **Follow-Up Reminders** — Doctors schedule follow-ups, patients see alerts for overdue appointments
- **Discharge Summary Generator** — Auto-generates formal discharge reports with AI analysis
- **Blockchain Explorer** — Full Etherscan-like transaction explorer with search
- **Smart Contract Viewer** — Solidity code display with syntax highlighting
- **Emergency Alerts** — Flashing banners for critical AI-detected conditions
- **Medical Report Export** — Download patient records as formatted reports
- **80+ Medicine Database** — Searchable medicine selector with categories and auto-fill dosage
- **Toast Notification System** — Professional animated alerts for all actions
- **Pure Black Theme** — Sleek medical-grade UI using only black/white/gray

---

## System Architecture

```
┌─────────────────────┐
│   Frontend          │  React 19 + Vite + TypeScript
│   (Port 5173)       │  MetaMask + Tailwind CSS
│   11 Pages          │  Sidebar Navigation
└────────┬────────────┘
         │ HTTP/REST API
┌────────┴────────────┐
│   Backend API       │  Node.js + Express + TypeScript
│   (Port 8080)       │  40+ API Endpoints
│   7 MongoDB Models  │  Swagger Documentation
└────┬────┬───────────┘
     │    │
┌────┴────┴───────────┐
│  MongoDB Atlas      │  7 Collections: User, EHR, BlockchainLedger,
│  + Python XGBoost   │  Chat, FollowUp, MedicationLog, VitalsHistory
└─────────────────────┘
```

### Directory Structure

```
secure-ehr-system/
├── backend/
│   ├── src/
│   │   ├── index.ts                    # Server entry point
│   │   ├── models/Schemas.ts           # 7 MongoDB schemas
│   │   ├── routes/ehrRoutes.ts         # 40+ API endpoints
│   │   ├── services/
│   │   │   ├── xgboostService.ts       # XGBoost ML integration
│   │   │   └── blockchainService.ts    # Blockchain ledger simulation
│   │   └── middleware/upload.ts        # Multer image upload
│   ├── ml_model/
│   │   ├── train_model.py              # XGBoost training (3000 samples, 93.5% accuracy)
│   │   ├── predict.py                  # Multi-disease prediction (12 conditions)
│   │   ├── xgboost_model.pkl           # Trained model
│   │   ├── scaler.pkl                  # Feature scaler
│   │   └── requirements.txt           # Python dependencies
│   └── .env
├── frontend/
│   └── vite-project/
│       └── src/
│           ├── App.tsx                 # Main app with routing
│           ├── components/
│           │   ├── Navbar.tsx          # Top navigation bar
│           │   ├── Sidebar.tsx         # Left navigation (role-filtered)
│           │   ├── Toast.tsx           # Notification system
│           │   ├── EmergencyAlert.tsx  # Critical condition alerts
│           │   ├── NetworkStatus.tsx   # Fake blockchain network stats
│           │   ├── ReportExport.tsx    # Medical report download
│           │   ├── AddressSelector.tsx # Patient/Doctor dropdown selector
│           │   ├── MedicineSelector.tsx # 80+ medicine search/select
│           │   ├── DrugInteractionChecker.tsx # Drug interaction warnings
│           │   ├── AboutModal.tsx      # Project info modal
│           │   ├── Dashboard/
│           │   │   ├── Timeline.tsx    # Medical records timeline
│           │   │   ├── DiscoveryList.tsx # Patient/Doctor search list
│           │   │   ├── DashboardStats.tsx # Stats cards
│           │   │   └── AuditTrail.tsx  # Blockchain audit history
│           │   └── Modals/
│           │       ├── OnboardingModal.tsx  # New user registration
│           │       ├── AddRecordModal.tsx   # Create medical record
│           │       ├── EditRecordModal.tsx  # Edit record
│           │       └── PatientUpdateModal.tsx # Patient self-report
│           └── pages/
│               ├── BlockchainExplorer.tsx  # Transaction explorer
│               ├── AccessControl.tsx       # Grant/revoke access
│               ├── SmartContract.tsx       # Solidity code viewer
│               ├── ChatSystem.tsx          # Doctor-Patient messaging
│               ├── VitalsChart.tsx         # SVG vitals trend chart
│               ├── FollowUps.tsx           # Follow-up scheduler
│               ├── MedicationTracker.tsx   # Daily medication log
│               └── DischargeSummary.tsx    # Discharge report generator
└── blockchain/
    └── contracts/EHRRegistry.sol          # Smart contract (reference)
```

---

## Complete Feature List (30+ Features)

### 1. Authentication & Identity
- MetaMask wallet-based login (no passwords)
- Session persistence via localStorage
- Auto-reconnect on page reload
- Role selection during onboarding (Patient, Doctor, Pharmacist, Admin)

### 2. Role-Based Access Control (RBAC)

| Feature | Doctor | Patient | Pharmacist | Admin |
|---------|--------|---------|------------|-------|
| Create medical records | Yes | No | No | No |
| Edit records | Yes | No | No | No |
| View AI predictions | Yes | No | No | Yes |
| View prescriptions | Yes | Yes (own) | Yes | Yes |
| View all patients | Own only | Self only | All | All |
| Chat messaging | Yes | Yes | No | No |
| Follow-up scheduling | Yes | Yes (view) | No | No |
| Medication tracker | No | Yes | No | No |
| Discharge summary | Yes | No | No | Yes |
| Blockchain explorer | Yes | Yes | Yes | Yes |
| Access control | Yes | Yes | Yes | Yes |

### 3. AI-Powered Diagnostics

#### XGBoost ML Model
- Trained on 3000 medically realistic samples
- 93.5% accuracy, 0.98 AUC ROC score
- 13 input features (age, BP, cholesterol, heart rate, ECG, chest pain type, etc.)
- **Predicts 12 cardiovascular diseases:**
  1. Coronary Artery Disease (CAD)
  2. Acute Myocardial Infarction (Heart Attack)
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
- Each condition includes probability %, severity (CRITICAL/HIGH/MEDIUM)
- Generates condition-specific drug recommendations
- Risk factor management based on actual vitals

#### Google Gemini AI (gemini-2.5-flash-lite)
- Natural language clinical summaries
- Expert cardiologist-level risk assessment
- Intervention plans and lifestyle recommendations

### 4. Blockchain Simulation
- Realistic Ethereum-style transaction hashes (66-char hex, 0x...)
- Block number tracking with sequential numbering
- Gas usage simulation (21,000-121,000 wei)
- Transaction types: CREATE_RECORD, UPDATE_RECORD, GRANT_ACCESS, REVOKE_ACCESS
- Full transaction explorer with search by hash, block, or wallet
- Smart contract viewer with Solidity syntax highlighting and ABI

### 5. Doctor-Patient Chat System
- Real-time messaging with 3-second polling
- Role-based conversations (Doctor-Patient pairs only)
- Unread message count badges
- Patient/Doctor dropdown selector (no address typing)
- "Message Doctor" button on medical records (one-click)
- "Message Patient" button for doctors (one-click)
- Encrypted channel styling

### 6. Medical Records Management
- Create records with vitals, symptoms, prescriptions, images
- Merge symptoms/prescriptions across visits (accumulative)
- Patient self-update (add symptoms, notes, images)
- Doctor edit existing records
- Re-run AI analysis with updated patient data
- Image upload (JPEG, PNG, PDF, DICOM, max 10MB)
- Blockchain transaction hash for every create/update

### 7. Drug Interaction Checker
- 15+ drug interaction rules covering common cardiac medications
- Auto-checks in real-time as doctor types prescriptions
- Severity levels: CRITICAL, HIGH, MEDIUM
- Examples: Warfarin+Aspirin, Nitroglycerin+Sildenafil, ACE+K-sparing
- Animated emergency pulse for critical interactions

### 8. Medicine Database & Selector
- 80+ pre-populated cardiac medicines with categories
- Categories: Antiplatelet, Statin, ACE Inhibitor, ARB, Beta Blocker, CCB, Diuretic, Nitrate, Antiarrhythmic, Antidiabetic, NSAID, Supplement
- Searchable combo-box (type to filter + click to select)
- Auto-fills common dosage when selecting from list
- Doctor can also type custom medicine names

### 9. Patient Vitals Trend Chart
- SVG line chart with gradient fill
- 4 switchable metrics: Blood Pressure, Heart Rate, Cholesterol, Blood Sugar
- Data point values shown on chart
- Dynamic Y-axis scaling
- Patient selector dropdown for doctors
- "Load Demo Data" button generates 12 months of realistic data
- Data table below chart

### 10. Follow-Up Reminders
- Doctors create follow-ups with date, reason, priority (routine/important/urgent)
- Patient selector dropdown
- Overdue alerts with pulsing emergency banner
- Mark as completed
- Sorted: overdue → upcoming → completed

### 11. Patient Medication Tracker
- Shows all prescribed medications for selected date
- Mark each medicine as Taken or Missed
- Daily adherence progress bar (% taken)
- Date navigation (prev/next day)
- Stats cards: Taken / Missed / Pending

### 12. Discharge Summary Generator
- Select patient from dropdown
- Auto-fills diagnosis from AI prediction
- Customizable fields: admission/discharge dates, condition, procedures, diet, activity restrictions
- Generates comprehensive formatted report
- Preview, Download, and Print buttons
- Includes blockchain verification, AI analysis, all prescriptions

### 13. Dashboard & Stats
- Total patients, doctors, records, transactions, AI analyses
- Latest block number
- Risk distribution bar (High/Medium/Low)
- Emergency alert banner for critical conditions

### 14. Blockchain Explorer
- Paginated transaction list
- Search by tx hash, block number, or wallet address
- Transaction detail modal (hash, block, from, to, gas, status, data)
- Action breakdown stats
- Total/average gas used
- Copy transaction hash

### 15. Access Control
- Grant/revoke doctor access via blockchain transactions
- Active permissions list
- Access control ledger with blockchain tx history
- Doctor dropdown selector

### 16. Audit Trail
- Visual timeline of all record changes
- Shows action type, who made it, when, blockchain tx hash
- Expandable/collapsible
- Doctor/Admin only

### 17. Network Status Panel
- Fake real-time blockchain network stats (updates every 3s)
- Connected Peers, Network Nodes, Hash Rate, Gas Price
- Block Time, Latency, Pending Transactions, Uptime
- Network load bar
- "Ethereum Mainnet — Chain ID: 1"

### 18. Emergency Alert System
- Flashing animated banner for CRITICAL AI-detected conditions
- Shows all critical conditions with probability %
- Dismissible
- Doctor/Admin only

### 19. Toast Notification System
- 5 types: success, error, warning, info, blockchain
- Animated slide-in from right
- Auto-dismiss after 4 seconds
- Used across all actions

### 20. Medical Report Export
- Download button on every medical record
- Formatted text report with patient info, vitals, AI analysis, prescriptions
- Blockchain verification included

### 21. UI/UX Features
- Pure black theme (only black/white/gray)
- Responsive sidebar navigation (role-filtered)
- Working search in patient discovery list
- Mobile sidebar toggle
- Custom scrollbars
- Large rounded corners (2.5rem)
- Glassmorphism effects

---

## Technology Stack

### Backend
- Node.js 18+ / Express.js v5 / TypeScript
- MongoDB Atlas / Mongoose v9
- Google Generative AI (Gemini 2.5 Flash Lite)
- Python XGBoost (child_process)
- Multer (file uploads)
- Swagger/OpenAPI

### Frontend
- React v19 / Vite v7 / TypeScript
- Tailwind CSS v4
- ethers.js v6 (MetaMask)
- Axios / Lucide React Icons
- Framer Motion

### Python ML
- XGBoost v2+ / scikit-learn / NumPy / Pandas / joblib

---

## Setup Instructions

### Prerequisites
- Node.js 18+, Python 3.8+, MongoDB Atlas account, MetaMask extension

### Backend
```bash
cd backend
npm install
cd ml_model && python3 -m venv venv && ./venv/bin/pip install -r requirements.txt && ./venv/bin/python train_model.py
cd ..
# Create .env with: PORT=8080, MONGO_URI, GEMINI_API_KEY, JWT_SECRET
npm run dev
```

### Frontend
```bash
cd frontend/vite-project
npm install
npm run dev
```

Open http://localhost:5173, connect MetaMask, select a role, and explore.

---

## API Endpoints (40+)

### Auth
- `POST /api/auth/login` — Wallet-based login/registration

### Records
- `POST /api/records/submit-visit` — Create record with AI analysis
- `GET /api/records/history/:address` — Get patient history
- `PUT /api/records/update/:recordId` — Doctor update record
- `PUT /api/records/patient-update/:recordId` — Patient self-update
- `POST /api/records/reanalyze/:recordId` — Re-run AI analysis

### Doctor/Patient/Pharmacist
- `GET /api/doctor/my-patients/:doctorAddress`
- `GET /api/patient/my-doctors/:patientAddress`
- `GET /api/pharmacist/registry`
- `GET /api/pharmacy/prescriptions/:patientAddress`

### Blockchain
- `GET /api/blockchain/explorer` — Paginated tx list + stats
- `GET /api/blockchain/search/:query` — Search by hash/block/wallet
- `GET /api/blockchain/transaction/:txHash`
- `GET /api/blockchain/wallet/:address`

### Dashboard
- `GET /api/dashboard/stats` — System statistics

### Access Control
- `POST /api/access/grant` — Grant doctor access
- `POST /api/access/revoke` — Revoke doctor access
- `GET /api/access/history/:address` — Access history

### Chat
- `GET /api/chat/list/:address` — User's conversations
- `GET /api/chat/:doctorAddr/:patientAddr` — Get/create chat
- `POST /api/chat/send` — Send message
- `PUT /api/chat/read/:doc/:pat/:reader` — Mark read

### Follow-Ups
- `POST /api/followup/create` — Schedule follow-up
- `GET /api/followup/list/:address` — User's follow-ups
- `PUT /api/followup/update/:id` — Update status

### Medication
- `POST /api/medication/log` — Log taken/missed
- `GET /api/medication/logs/:patientAddress` — Get logs + prescriptions

### Vitals
- `POST /api/vitals/save` — Save vitals snapshot
- `GET /api/vitals/history/:patientAddress` — Get vitals history
- `POST /api/vitals/seed-demo/:patientAddress` — Generate demo data

---

## MongoDB Collections (7)

1. **User** — walletAddress, name, role, age, gender, bloodGroup, activeMedications
2. **EHR** — patientAddress, clinicalData, prediction (12 conditions), prescriptions, images, updateHistory
3. **BlockchainLedger** — txHash, blockNumber, from, to, action, gasUsed, status
4. **Chat** — participants (doctor+patient), messages array, lastMessage
5. **FollowUp** — patientAddress, doctorAddress, followUpDate, reason, priority, status
6. **MedicationLog** — patientAddress, medicineName, date, status (taken/missed)
7. **VitalsHistory** — patientAddress, vitals (BP, HR, cholesterol, sugar), date

---

**Version:** 3.0.0
**Last Updated:** March 2026
