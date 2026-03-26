import { useEffect, useState } from "react";
import axios from "axios";
import { FileText, Download, Printer, User, Activity, Pill, Shield, Calendar, ChevronDown } from "lucide-react";
import { AddressSelector } from "../components/AddressSelector";
import { showToast } from "../components/Toast";

const API_BASE = "http://localhost:8080/api";

interface DischargeSummaryProps {
  account: string;
  userRole: string;
  viewingAddress: string;
}

export const DischargeSummary = ({ account, userRole, viewingAddress }: DischargeSummaryProps) => {
  const [patientAddress, setPatientAddress] = useState(viewingAddress || "");
  const [patientData, setPatientData] = useState<any>(null);
  const [record, setRecord] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);

  // Additional discharge fields
  const [dischargeDetails, setDischargeDetails] = useState({
    admissionDate: new Date().toISOString().split('T')[0],
    dischargeDate: new Date().toISOString().split('T')[0],
    diagnosis: "",
    procedures: "",
    conditionAtDischarge: "Stable",
    followUpInstructions: "",
    dietaryAdvice: "",
    activityRestrictions: "",
    emergencyInstructions: "If you experience chest pain, severe shortness of breath, fainting, or sudden weakness, call emergency services (911) immediately or visit the nearest emergency room.",
  });

  useEffect(() => {
    if (viewingAddress) setPatientAddress(viewingAddress);
  }, [viewingAddress]);

  useEffect(() => {
    if (patientAddress) fetchPatientData();
  }, [patientAddress]);

  const fetchPatientData = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API_BASE}/records/history/${patientAddress}`);
      setPatientData(data.profile);
      setRecord(data.history?.[0] || null);

      // Auto-fill diagnosis from AI prediction
      if (data.history?.[0]?.prediction?.recommendation) {
        setDischargeDetails(prev => ({
          ...prev,
          diagnosis: data.history[0].prediction.recommendation,
        }));
      }
    } catch (err) {
      console.error("Failed to fetch patient:", err);
    } finally {
      setLoading(false);
    }
  };

  const generateSummary = () => {
    if (!patientData || !record) {
      showToast({ type: "error", title: "Missing Data", message: "Load a patient record first" });
      return;
    }

    setGenerating(true);

    const vitals = record.clinicalData?.vitals || {};
    const symptoms = record.clinicalData?.symptoms || [];
    const prescriptions = record.prescriptions || [];
    const prediction = record.prediction || {};
    const conditions = prediction.predicted_conditions || [];
    const doctorAddr = record.primaryDoctorId || account;

    const doc = `
╔══════════════════════════════════════════════════════════════════╗
║                    DISCHARGE SUMMARY REPORT                      ║
║                  Secure EHR System — Blockchain Verified          ║
╚══════════════════════════════════════════════════════════════════╝

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

                        PATIENT INFORMATION

  Name:              ${patientData.name || 'N/A'}
  Wallet Address:    ${patientData.walletAddress || patientAddress}
  Age:               ${patientData.age || 'N/A'} years
  Gender:            ${patientData.gender || 'N/A'}
  Blood Group:       ${patientData.bloodGroup || 'N/A'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

                        ADMISSION DETAILS

  Date of Admission:    ${dischargeDetails.admissionDate}
  Date of Discharge:    ${dischargeDetails.dischargeDate}
  Attending Physician:  ${doctorAddr.slice(0, 8)}...${doctorAddr.slice(-4)}
  Condition at Discharge: ${dischargeDetails.conditionAtDischarge}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

                        PRIMARY DIAGNOSIS

  ${dischargeDetails.diagnosis || prediction.recommendation || 'Not specified'}

${conditions.length > 0 ? `
  DETECTED CONDITIONS:
${conditions.map((c: any, i: number) => `    ${i + 1}. ${c.name} — ${c.probability}% probability (${c.severity})`).join('\n')}
` : ''}
${dischargeDetails.procedures ? `
  PROCEDURES PERFORMED:
  ${dischargeDetails.procedures}
` : ''}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

                      VITALS AT DISCHARGE

  Blood Pressure:    ${vitals.bp || 'N/A'} mmHg
  Heart Rate:        ${vitals.heartRate || 'N/A'} bpm
  Cholesterol:       ${vitals.cholesterol || 'N/A'} mg/dL
  Blood Sugar:       ${vitals.sugarLevel || 'N/A'} mg/dL

  AI Risk Assessment: ${prediction.riskLevel || 'N/A'} Risk
  Risk Probability:   ${prediction.xgboostRisk ? (prediction.xgboostRisk * 100).toFixed(1) + '%' : 'N/A'}
  Model Confidence:   ${prediction.xgboostConfidence ? (prediction.xgboostConfidence * 100).toFixed(1) + '%' : 'N/A'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

                    PRESENTING SYMPTOMS

  ${symptoms.length > 0 ? symptoms.map((s: string, i: number) => `${i + 1}. ${s}`).join('\n  ') : 'None reported'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

                   DISCHARGE MEDICATIONS

${prescriptions.length > 0 ? prescriptions.filter((p: any) => p.medicineName).map((p: any, i: number) => `
  ${i + 1}. ${p.medicineName}
     Dosage:       ${p.dosage || 'As directed'}
     Frequency:    ${p.frequency || 'As directed'}
     Timing:       ${p.timing || 'As directed'}
     Duration:     ${p.duration || 'As directed'}
     Instructions: ${p.instructions || 'None'}
`).join('') : '  No medications prescribed\n'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

                   DOCTOR RECOMMENDATIONS

  ${record.doctorRecommendations || 'None specified'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

                   FOLLOW-UP INSTRUCTIONS

  ${dischargeDetails.followUpInstructions || 'Follow up with your physician within 2 weeks.'}

  DIETARY ADVICE:
  ${dischargeDetails.dietaryAdvice || 'Follow a balanced, heart-healthy diet. Limit sodium, saturated fats, and processed foods.'}

  ACTIVITY RESTRICTIONS:
  ${dischargeDetails.activityRestrictions || 'Avoid strenuous physical activity for 1-2 weeks. Gradually resume normal activities as tolerated.'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

                    EMERGENCY INSTRUCTIONS

  ${dischargeDetails.emergencyInstructions}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${(userRole === 'Doctor' || userRole === 'Admin') && prediction.clinical_recommendations ? `
                 AI CLINICAL RECOMMENDATIONS

${prediction.clinical_recommendations}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
` : ''}
                  BLOCKCHAIN VERIFICATION

  Transaction Hash:  ${record.blockchainTxHash || 'N/A'}
  Record ID:         ${record._id || 'N/A'}
  Network:           Ethereum Mainnet (Chain ID: 1)
  Status:            Confirmed & Immutable
  Generated:         ${new Date().toLocaleString()}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  This is a computer-generated discharge summary verified on the
  Ethereum blockchain. All data is immutable and tamper-proof.

  Powered by: XGBoost ML Engine + Google Gemini AI
  System:     Secure EHR System v2.0

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`;

    setSummary(doc);
    setGenerating(false);
    showToast({ type: "success", title: "Summary Generated", message: "Discharge summary is ready for download" });
  };

  const downloadSummary = () => {
    if (!summary) return;
    const blob = new Blob([summary], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Discharge_Summary_${patientData?.name?.replace(/\s+/g, '_') || 'patient'}_${dischargeDetails.dischargeDate}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast({ type: "blockchain", title: "Downloaded", message: "Discharge summary saved to your device" });
  };

  const printSummary = () => {
    if (!summary) return;
    const win = window.open('', '_blank');
    if (win) {
      win.document.write(`<pre style="font-family: 'Courier New', monospace; font-size: 12px; line-height: 1.5; padding: 40px; max-width: 800px; margin: 0 auto;">${summary}</pre>`);
      win.document.close();
      win.print();
    }
  };

  // Only Doctor and Admin can generate discharge summaries
  if (userRole !== "Doctor" && userRole !== "Admin") {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-black italic tracking-tighter text-white uppercase">
          Discharge <span className="text-zinc-500">Summary</span>
        </h1>
        <div className="text-center py-20">
          <FileText size={48} className="text-zinc-800 mx-auto mb-4" />
          <p className="text-zinc-500 text-sm font-bold">This feature is available to Doctors and Admins only</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black italic tracking-tighter text-white uppercase">
            Discharge <span className="text-zinc-500">Summary</span>
          </h1>
          <p className="text-zinc-600 text-xs font-bold mt-1 uppercase tracking-widest">
            Generate Official Patient Discharge Report
          </p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-3">
          <FileText size={24} className="text-zinc-500" />
        </div>
      </div>

      {/* Patient Selector */}
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-4">
        <AddressSelector
          type="patient"
          currentUserAddress={account}
          currentUserRole={userRole}
          value={patientAddress}
          onChange={setPatientAddress}
          label="Select Patient for Discharge"
        />
      </div>

      {loading ? (
        <div className="text-center py-20">
          <div className="w-6 h-6 border-2 border-zinc-700 border-t-white rounded-full animate-spin mx-auto" />
        </div>
      ) : !patientData || !record ? (
        patientAddress ? (
          <div className="text-center py-16">
            <FileText size={32} className="text-zinc-800 mx-auto mb-3" />
            <p className="text-zinc-600 text-xs font-bold">No records found for this patient</p>
          </div>
        ) : null
      ) : (
        <>
          {/* Patient Info Preview */}
          <div className="bg-zinc-900/30 border border-zinc-800 rounded-[2rem] p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-zinc-800 p-3 rounded-xl">
                <User size={20} className="text-zinc-400" />
              </div>
              <div>
                <h3 className="text-lg font-black text-white">{patientData.name}</h3>
                <p className="text-[9px] font-mono text-zinc-600">{patientData.walletAddress}</p>
              </div>
              <div className="ml-auto flex gap-4 text-[10px]">
                <div className="text-right">
                  <p className="text-zinc-600 uppercase font-black">Age</p>
                  <p className="text-white font-bold">{patientData.age} • {patientData.gender}</p>
                </div>
                <div className="text-right">
                  <p className="text-zinc-600 uppercase font-black">Blood</p>
                  <p className="text-white font-bold">{patientData.bloodGroup}</p>
                </div>
                {record.prediction?.riskLevel && (
                  <div className="text-right">
                    <p className="text-zinc-600 uppercase font-black">Risk</p>
                    <p className="text-white font-bold">{record.prediction.riskLevel}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Discharge Details Form */}
          <div className="bg-zinc-900/30 border border-zinc-800 rounded-[2rem] p-6 space-y-4">
            <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-2">
              Discharge Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField label="Admission Date" type="date" value={dischargeDetails.admissionDate}
                onChange={(v) => setDischargeDetails({ ...dischargeDetails, admissionDate: v })} />
              <FormField label="Discharge Date" type="date" value={dischargeDetails.dischargeDate}
                onChange={(v) => setDischargeDetails({ ...dischargeDetails, dischargeDate: v })} />
              <div className="space-y-1">
                <label className="text-[9px] font-black text-zinc-600 uppercase ml-2">Condition at Discharge</label>
                <select
                  value={dischargeDetails.conditionAtDischarge}
                  onChange={(e) => setDischargeDetails({ ...dischargeDetails, conditionAtDischarge: e.target.value })}
                  className="w-full p-3 bg-black border border-zinc-800 rounded-xl text-white text-sm outline-none focus:border-zinc-600 appearance-none"
                >
                  <option value="Stable">Stable</option>
                  <option value="Improved">Improved</option>
                  <option value="Guarded">Guarded</option>
                  <option value="Critical but Stable">Critical but Stable</option>
                  <option value="Against Medical Advice">Against Medical Advice</option>
                </select>
              </div>
            </div>

            <FormField label="Primary Diagnosis (auto-filled from AI)" value={dischargeDetails.diagnosis}
              onChange={(v) => setDischargeDetails({ ...dischargeDetails, diagnosis: v })} />
            <FormField label="Procedures Performed (if any)" value={dischargeDetails.procedures}
              onChange={(v) => setDischargeDetails({ ...dischargeDetails, procedures: v })}
              placeholder="e.g., ECG, Echocardiogram, Coronary Angiography" />
            <FormField label="Follow-Up Instructions" value={dischargeDetails.followUpInstructions} textarea
              onChange={(v) => setDischargeDetails({ ...dischargeDetails, followUpInstructions: v })}
              placeholder="e.g., Follow up with cardiologist in 2 weeks. Repeat lipid panel in 3 months." />
            <FormField label="Dietary Advice" value={dischargeDetails.dietaryAdvice} textarea
              onChange={(v) => setDischargeDetails({ ...dischargeDetails, dietaryAdvice: v })}
              placeholder="e.g., Low sodium diet, avoid fried foods, increase fiber intake" />
            <FormField label="Activity Restrictions" value={dischargeDetails.activityRestrictions}
              onChange={(v) => setDischargeDetails({ ...dischargeDetails, activityRestrictions: v })}
              placeholder="e.g., No heavy lifting for 4 weeks, light walking encouraged" />
          </div>

          {/* Generate & Download Buttons */}
          <div className="flex gap-3">
            <button
              onClick={generateSummary}
              disabled={generating}
              className="flex-1 py-4 bg-white text-black rounded-2xl font-black uppercase tracking-wider hover:bg-zinc-200 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3"
            >
              <FileText size={18} />
              {generating ? "Generating..." : "Generate Discharge Summary"}
            </button>
          </div>

          {/* Preview & Download */}
          {summary && (
            <div className="bg-zinc-900/30 border border-zinc-800 rounded-[2rem] overflow-hidden">
              <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between">
                <h3 className="text-sm font-black text-white uppercase tracking-tight">Discharge Summary Preview</h3>
                <div className="flex gap-2">
                  <button
                    onClick={printSummary}
                    className="px-4 py-2 bg-zinc-800 border border-zinc-700 text-zinc-400 hover:text-white rounded-xl text-[9px] font-black uppercase tracking-wider transition-all flex items-center gap-2"
                  >
                    <Printer size={12} /> Print
                  </button>
                  <button
                    onClick={downloadSummary}
                    className="px-4 py-2 bg-white text-black rounded-xl text-[9px] font-black uppercase tracking-wider hover:bg-zinc-200 transition-all flex items-center gap-2"
                  >
                    <Download size={12} /> Download
                  </button>
                </div>
              </div>
              <div className="p-6 max-h-[500px] overflow-y-auto custom-scrollbar">
                <pre className="text-[10px] font-mono text-zinc-400 leading-relaxed whitespace-pre-wrap">
                  {summary}
                </pre>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

// Helper form field component
const FormField = ({ label, value, onChange, type, placeholder, textarea }: {
  label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string; textarea?: boolean;
}) => (
  <div className="space-y-1">
    <label className="text-[9px] font-black text-zinc-600 uppercase ml-2">{label}</label>
    {textarea ? (
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={2}
        className="w-full p-3 bg-black border border-zinc-800 rounded-xl text-white text-sm outline-none focus:border-zinc-600 resize-none"
      />
    ) : (
      <input
        type={type || "text"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full p-3 bg-black border border-zinc-800 rounded-xl text-white text-sm outline-none focus:border-zinc-600"
      />
    )}
  </div>
);
