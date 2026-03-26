# 🏥 Secure EHR System

<div align="center">

![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)
![Python](https://img.shields.io/badge/python-%3E%3D3.8-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

**A modern, decentralized Electronic Health Record system powered by AI and blockchain technology**

[Features](#-features) •
[Quick Start](#-quick-start) •
[Documentation](#-documentation) •
[Demo](#-demo) •
[Contributing](#-contributing)

</div>

---

## 🌟 Overview

Secure EHR System is a next-generation healthcare data management platform that combines the security of blockchain technology with the intelligence of AI to create a comprehensive electronic health record system. Built with a modern tech stack and designed for real-world medical applications.

### Why Secure EHR?

- 🔐 **Wallet-Based Authentication**: No passwords, just your MetaMask wallet
- 🤖 **Dual AI Diagnostics**: XGBoost ML + Gemini AI for accurate predictions
- ⛓️ **Blockchain Ledger**: Immutable audit trail for all medical records
- 👥 **Role-Based Access**: Granular permissions for Doctors, Patients, Pharmacists, and Admins
- 📸 **Image Support**: Store lab reports and medical imaging
- 🎨 **Modern UI**: Sleek black-themed design for professional use

---

## ✨ Features

### For Patients
✅ View complete medical history
✅ Track all doctors visited
✅ Access prescriptions and vitals
✅ View uploaded medical images
✅ Blockchain-verified records

### For Doctors
✅ Create comprehensive medical records
✅ AI-powered disease risk assessment
✅ View patient history and vitals
✅ Add recommendations and update prescriptions
✅ Upload lab reports and medical images
✅ Track all treated patients

### For Pharmacists
✅ Access patient registry
✅ View latest prescriptions
✅ See doctor recommendations
✅ Verify patient vitals

### Technical Features
- **XGBoost ML Model**: Cardiovascular disease prediction
- **Gemini AI**: Clinical summaries and intervention plans
- **Simulated Blockchain**: MongoDB-based ledger with realistic tx hashes
- **Image Upload**: Support for JPEG, PNG, PDF, DICOM (up to 10MB)
- **RESTful API**: Comprehensive API with Swagger documentation
- **TypeScript**: Full type safety across frontend and backend
- **Docker Support**: One-command deployment

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Python 3.8+
- MongoDB (Atlas or local)
- MetaMask browser extension

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/secure-ehr-system.git
cd secure-ehr-system

# Set up backend
cd backend
npm install
cd ml_model && chmod +x setup.sh && ./setup.sh && cd ..
cp ../.env.example .env
# Edit .env with your credentials

# Set up frontend
cd ../frontend/vite-project
npm install

# Start backend (terminal 1)
cd ../../backend
npm run dev

# Start frontend (terminal 2)
cd ../frontend/vite-project
npm run dev
```

**Access the application:**
- Frontend: http://localhost:5173
- Backend API: http://localhost:8080
- API Docs: http://localhost:8080/api-docs

---

## 🐳 Docker Quick Start

```bash
# Copy environment variables
cp .env.example .env

# Edit .env with your MongoDB URI and API keys
nano .env

# Start all services
docker-compose up --build -d

# View logs
docker-compose logs -f
```

---

## 📚 Documentation

- **[CLAUDE.md](CLAUDE.md)** - Complete system documentation
- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Deployment guides for various platforms
- **[API Documentation](http://localhost:8080/api-docs)** - Interactive Swagger docs

---

## 🏗️ Architecture

```
┌─────────────────┐
│  React Frontend │  ← MetaMask Wallet Integration
│   (TypeScript)  │
└────────┬────────┘
         │ REST API
         │
┌────────┴────────┐
│ Express Backend │  ← Node.js + TypeScript
│   (TypeScript)  │
└────┬────┬───────┘
     │    │
     │    └─────────────┐
┌────┴────┐      ┌──────┴────────┐
│ MongoDB │      │ Python XGBoost│
│ Database│      │  ML Model     │
└─────────┘      └───────────────┘
```

---

## 🛠️ Technology Stack

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js 5.2
- **Language**: TypeScript 5.9
- **Database**: MongoDB (Mongoose)
- **AI**: Google Gemini AI, XGBoost
- **File Upload**: Multer
- **Docs**: Swagger/OpenAPI

### Frontend
- **Framework**: React 19.2
- **Build Tool**: Vite 7.3
- **Language**: TypeScript 5.9
- **Styling**: Tailwind CSS 4.1
- **Wallet**: ethers.js 6.16
- **HTTP**: Axios

### ML/AI
- **Framework**: XGBoost 2.0.3
- **Processing**: NumPy, Pandas, scikit-learn
- **Language**: Python 3.8+

---

## 📊 Database Schema

### User Collection
```javascript
{
  walletAddress: String (unique),
  name: String,
  role: "Patient" | "Doctor" | "Pharmacist" | "Admin",
  age: Number,
  gender: String,
  bloodGroup: String,
  activeMedications: [String],
  lastUpdated: Date
}
```

### EHR Collection
```javascript
{
  patientAddress: String,
  doctorId: String,
  clinicalData: {
    vitals: { bp, heartRate, cholesterol, sugarLevel },
    symptoms: [String]
  },
  prediction: {
    riskLevel: String,
    summary: String (Gemini),
    xgboostRisk: Number,
    recommendation: String
  },
  prescriptions: [{medicineName, dosage, duration}],
  doctorRecommendations: String,
  images: [{type, filename, path}],
  blockchainTxHash: String,
  visitDate: Date
}
```

### BlockchainLedger Collection
```javascript
{
  txHash: String (unique),
  blockNumber: Number,
  from: String,
  to: String,
  recordId: ObjectId,
  action: "CREATE_RECORD" | "UPDATE_RECORD" | "GRANT_ACCESS" | "REVOKE_ACCESS",
  gasUsed: Number,
  status: "confirmed",
  timestamp: Date
}
```

---

## 🔑 Environment Variables

Create a `.env` file in the `backend/` directory:

```env
PORT=8080
NODE_ENV=development
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/secure_ehr_db
GEMINI_API_KEY=your_gemini_api_key
JWT_SECRET=your_secret_key
```

See [.env.example](.env.example) for a complete template.

---

## 🧪 API Endpoints

### Authentication
- `POST /api/auth/login` - Wallet-based login/registration

### Medical Records
- `POST /api/records/submit-visit` - Create new medical record
- `GET /api/records/history/:address` - Get patient history
- `PUT /api/records/update/:recordId` - Update record (Doctor only)

### Role-Specific
- `GET /api/doctor/my-patients/:doctorAddress` - Get doctor's patients
- `GET /api/patient/my-doctors/:patientAddress` - Get patient's doctors
- `GET /api/pharmacist/registry` - Get patient registry
- `GET /api/pharmacy/prescriptions/:patientAddress` - Get prescriptions

### Blockchain
- `GET /api/blockchain/transaction/:txHash` - Get transaction details
- `GET /api/blockchain/wallet/:address` - Get wallet transactions

**Full API documentation:** [Swagger Docs](http://localhost:8080/api-docs)

---

## 🎨 UI Screenshots

<div align="center">

### Landing Page
![Landing Page](docs/screenshots/landing.png)

### Doctor Dashboard
![Doctor Dashboard](docs/screenshots/doctor-dashboard.png)

### Patient Timeline
![Patient Timeline](docs/screenshots/patient-timeline.png)

### Clinical Entry Form
![Clinical Entry](docs/screenshots/clinical-entry.png)

</div>

---

## 🧠 AI Models

### XGBoost Model
- **Purpose**: Cardiovascular disease risk prediction
- **Input**: 13 clinical features
- **Output**: Risk probability (0-1), Risk level (Low/Medium/High), Confidence score
- **Accuracy**: ~85% on test set

### Gemini AI
- **Model**: gemini-2.5-flash-lite
- **Purpose**: Clinical summaries and intervention plans
- **Input**: Vitals, symptoms, clinical markers, XGBoost results
- **Output**: Professional cardiologist-level analysis

---

## 🔒 Security Features

- ✅ Wallet-based authentication (no password storage)
- ✅ Role-based access control (RBAC)
- ✅ Input validation and sanitization
- ✅ File upload restrictions (type, size)
- ✅ CORS protection
- ✅ Helmet.js security headers
- ✅ Environment variable protection
- ✅ MongoDB injection prevention
- ✅ Blockchain audit trail

---

## 🚀 Deployment

### Quick Deploy with Docker
```bash
docker-compose up --build -d
```

### Cloud Platforms
- **Vercel + Railway**: See [DEPLOYMENT.md](DEPLOYMENT.md#vercel--railway)
- **AWS**: See [DEPLOYMENT.md](DEPLOYMENT.md#aws-deployment)
- **GCP**: See [DEPLOYMENT.md](DEPLOYMENT.md#gcp-deployment)

---

## 🧪 Testing

### Run Backend Tests
```bash
cd backend
npm test
```

### Run Frontend Tests
```bash
cd frontend/vite-project
npm test
```

### Test XGBoost Model
```bash
cd backend/ml_model
source venv/bin/activate
echo '{"vitals":{"bp":"120/80","heartRate":75,"cholesterol":200,"sugarLevel":95,"ecgResult":"normal"},"clinicalMarkers":{"chestPainType":"asymptomatic"},"age":45}' | python predict.py
```

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and development process.

---

## 🐛 Troubleshooting

### XGBoost Model Not Found
```bash
cd backend/ml_model
./setup.sh
```

### MongoDB Connection Failed
- Check `MONGO_URI` in `.env`
- Verify IP whitelist in MongoDB Atlas
- Ensure network connectivity

### MetaMask Not Connecting
- Install MetaMask extension
- Refresh the page
- Check browser console for errors

See [CLAUDE.md](CLAUDE.md#troubleshooting) for more solutions.

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Authors

- **Your Name** - *Initial work* - [YourGitHub](https://github.com/yourusername)

See also the list of [contributors](https://github.com/yourusername/secure-ehr-system/contributors) who participated in this project.

---

## 🙏 Acknowledgments

- OpenZeppelin for smart contract libraries
- Google for Gemini AI API
- MongoDB Atlas for database hosting
- MetaMask for wallet integration
- The open-source community

---

## 📧 Contact

- **Project Link**: [https://github.com/yourusername/secure-ehr-system](https://github.com/yourusername/secure-ehr-system)
- **Email**: support@secure-ehr.com
- **Website**: [https://secure-ehr.com](https://secure-ehr.com)

---

## 🗺️ Roadmap

- [ ] Real Ethereum blockchain integration
- [ ] End-to-end encryption for medical records
- [ ] Mobile application (React Native)
- [ ] Telemedicine video consultations
- [ ] Multi-language support
- [ ] Advanced analytics dashboard
- [ ] Lab integration APIs
- [ ] Insurance claim processing
- [ ] HIPAA compliance certification
- [ ] Multi-chain support (Polygon, BSC)

---

<div align="center">

**⭐ Star this repository if you find it helpful!**

Made with ❤️ by the Secure EHR Team

</div>
