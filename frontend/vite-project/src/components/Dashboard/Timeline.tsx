/**
 * Timeline Component - Medical Records Display
 *
 * Displays a chronological timeline of all medical visits/records.
 * Shows different information based on user role:
 * - Doctors: See full AI predictions, risk levels, and clinical analysis
 * - Patients: See history without AI predictions
 * - Pharmacists: See prescriptions and recommendations only
 *
 * Pure black-themed design with only shades of black/white/gray
 */

import { Activity, Shield, Pill, Image as ImageIcon, FileText, Edit, Plus, RefreshCw, Heart, MessageCircle } from "lucide-react";
import { useState } from "react";
import { ReportExport } from "../ReportExport";

/**
 * Props interface for Timeline component
 */
interface TimelineProps {
  history: any[];
  userRole: string;
  isOwner: boolean;
  currentUserAddress?: string;
  onEditRecord?: (record: any) => void;
  onPatientUpdate?: (record: any) => void;
  onReanalyze?: (record: any) => void;
  onMessageDoctor?: (doctorAddress: string) => void;
  onMessagePatient?: (patientAddress: string) => void;
}

/**
 * Main Timeline component
 * Renders medical records in chronological order (latest first)
 */
export const Timeline = ({ history, userRole, isOwner, currentUserAddress, onEditRecord, onPatientUpdate, onReanalyze, onMessageDoctor, onMessagePatient }: TimelineProps) => {
  return (
    <div className="space-y-8">

      {/* Timeline Header */}
      <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
        <h2 className="text-2xl font-black italic tracking-tighter text-white">
          MEDICAL <span className="text-zinc-500">LEDGER</span>
        </h2>
        <div className="flex gap-2">
          <span className="bg-zinc-900 text-zinc-500 text-[10px] font-bold px-3 py-1 rounded-full border border-zinc-800 uppercase">
            {history.length} Entries Secured
          </span>
        </div>
      </div>

      {/* Empty State - No Records */}
      {history.length === 0 && (
        <div className="text-center py-20">
          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl inline-block mb-4">
            <Shield size={48} className="text-zinc-700" />
          </div>
          <h3 className="text-xl font-bold text-zinc-400 mb-2">
            {userRole === "Patient"
              ? "No Medical Records Yet"
              : "Select a Patient"}
          </h3>
          <p className="text-zinc-600 text-sm">
            {userRole === "Doctor"
              ? "Click on a patient from the list to view their medical history"
              : userRole === "Pharmacist"
              ? "Select a patient from the directory to view their prescriptions"
              : userRole === "Admin"
              ? "Select a patient from the list to view their complete medical records"
              : "Your medical history will appear here once you visit a doctor"}
          </p>
        </div>
      )}

      {/* Timeline Records */}
      {history.map((item: any, i: number) => {
        // Determine risk level for styling (black/white theme)
        const isHighRisk = item.prediction?.riskLevel === "High";
        const isMediumRisk = item.prediction?.riskLevel === "Medium";

        return (
          <div key={i} className="relative group">

            {/* Timeline Connector Line */}
            <div className="absolute -left-[33px] top-0 h-full w-[2px] bg-zinc-800 group-last:h-0" />

            {/* Timeline Dot */}
            <div className="absolute -left-[40px] top-2 h-4 w-4 rounded-full bg-zinc-900 border-2 border-zinc-700 z-10" />

            {/* Record Card */}
            <div className="bg-zinc-900/40 border border-zinc-800 rounded-[2.5rem] p-8 backdrop-blur-md hover:border-zinc-600 transition-all">

              {/* Header: Date + Title */}
              <div className="mb-4">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                    Last Updated: {new Date(item.lastModified || item.createdAt).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })} • Created: {new Date(item.createdAt).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </p>
                  {item.patientNotes && userRole === "Doctor" && (
                    <span className="bg-white/10 border border-white/30 text-white text-[8px] font-black px-2 py-1 rounded-full uppercase animate-pulse">
                      Patient Updated
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-bold text-white mt-1 italic">Medical Record</h3>
              </div>

              {/* Action Buttons Row — wraps properly */}
              <div className="flex flex-wrap items-center gap-2 mb-6">
                {/* Risk Badge first */}
                {(userRole === "Doctor" || userRole === "Admin") && item.prediction?.riskLevel && (
                  <div className={`px-4 py-1.5 rounded-full border flex items-center gap-2 ${
                    isHighRisk
                      ? "bg-white/10 border-white/30 text-white"
                      : isMediumRisk
                        ? "bg-zinc-700/50 border-zinc-600 text-zinc-300"
                        : "bg-zinc-900 border-zinc-700 text-zinc-500"
                  }`}>
                    <Shield size={14} />
                    <span className="text-[10px] font-black uppercase tracking-widest">
                      {item.prediction.riskLevel} Risk
                    </span>
                  </div>
                )}

                {/* Spacer pushes buttons to the right on wide screens */}
                <div className="flex-1" />

                {/* Patient Add Update */}
                {userRole === "Patient" && isOwner && onPatientUpdate && (
                  <button
                    onClick={() => onPatientUpdate(item)}
                    className="px-3 py-2 bg-zinc-800 border border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-500 rounded-xl flex items-center gap-2 transition-all font-black text-[10px] uppercase tracking-wider"
                    title="Add symptoms, images, or notes to this visit"
                  >
                    <Plus size={14} />
                    Add Update
                  </button>
                )}

                {/* Doctor Edit */}
                {userRole === "Doctor" && onEditRecord && (
                  <button
                    onClick={() => onEditRecord(item)}
                    className="px-3 py-2 bg-zinc-800 border border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-500 rounded-xl flex items-center gap-2 transition-all font-black text-[10px] uppercase tracking-wider"
                    title="Update prescriptions and recommendations"
                  >
                    <Edit size={14} />
                    Edit
                  </button>
                )}

                {/* Doctor Re-analyze */}
                {userRole === "Doctor" && onReanalyze && (
                  <button
                    onClick={() => onReanalyze(item)}
                    className="px-3 py-2 bg-white/5 border border-zinc-700 text-zinc-400 hover:text-white hover:border-white/30 hover:bg-white/10 rounded-xl flex items-center gap-2 transition-all font-black text-[10px] uppercase tracking-wider"
                    title="Re-run ML Disease Prediction with latest patient data"
                  >
                    <RefreshCw size={14} />
                    Reanalyze
                  </button>
                )}

                {/* Export Report */}
                <ReportExport record={item} userRole={userRole} />
              </div>

              {/* ML DISEASE PREDICTION - PROMINENT DISPLAY */}
              {(userRole === "Doctor" || userRole === "Admin") && item.prediction?.recommendation && (
                <div className={`mb-8 rounded-2xl border-2 p-6 ${
                  isHighRisk
                    ? "bg-red-950/30 border-red-500/50"
                    : isMediumRisk
                      ? "bg-orange-950/20 border-orange-500/30"
                      : "bg-green-950/20 border-green-500/30"
                }`}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <Shield size={24} className={
                        isHighRisk ? "text-red-400" : isMediumRisk ? "text-orange-400" : "text-green-400"
                      } />
                      <h4 className="text-[11px] font-black uppercase tracking-widest text-zinc-400">
                        🤖 ML CARDIOVASCULAR DISEASE PREDICTION
                      </h4>
                    </div>
                    {/* Re-predict Button */}
                    {userRole === "Doctor" && onReanalyze && (
                      <button
                        onClick={() => onReanalyze(item)}
                        className="px-3 py-1.5 bg-white/10 hover:bg-white/20 border border-white/30 text-white rounded-lg flex items-center gap-2 transition-all font-black text-[9px] uppercase tracking-wider"
                      >
                        <RefreshCw size={12} />
                        Re-predict
                      </button>
                    )}
                  </div>

                  {/* Primary Disease */}
                  <p className={`text-2xl font-black uppercase tracking-tight mb-4 ${
                    isHighRisk
                      ? "text-red-400"
                      : isMediumRisk
                        ? "text-orange-400"
                        : "text-green-400"
                  }`}>
                    {item.prediction.recommendation}
                  </p>

                  {/* All Detected Cardiovascular Conditions */}
                  {item.prediction.predicted_conditions && item.prediction.predicted_conditions.length > 0 && (
                    <div className="mb-4 space-y-2">
                      <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Detected Conditions:</p>
                      {item.prediction.predicted_conditions.map((condition: any, idx: number) => (
                        <div key={idx} className={`flex items-center justify-between p-3 rounded-lg border ${
                          condition.severity === 'CRITICAL'
                            ? 'bg-red-900/20 border-red-500/30'
                            : condition.severity === 'HIGH'
                              ? 'bg-orange-900/20 border-orange-500/30'
                              : 'bg-yellow-900/10 border-yellow-500/20'
                        }`}>
                          <div className="flex-1">
                            <p className={`text-sm font-black uppercase ${
                              condition.severity === 'CRITICAL'
                                ? 'text-red-300'
                                : condition.severity === 'HIGH'
                                  ? 'text-orange-300'
                                  : 'text-yellow-300'
                            }`}>
                              {condition.name}
                            </p>
                            <p className="text-[9px] text-zinc-500 mt-0.5">Probability: {condition.probability}%</p>
                          </div>
                          <span className={`px-2 py-1 rounded text-[8px] font-black uppercase ${
                            condition.severity === 'CRITICAL'
                              ? 'bg-red-500/30 text-red-200'
                              : condition.severity === 'HIGH'
                                ? 'bg-orange-500/30 text-orange-200'
                                : 'bg-yellow-500/20 text-yellow-200'
                          }`}>
                            {condition.severity}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center gap-4 mt-4">
                    <div>
                      <p className="text-[9px] text-zinc-600 uppercase tracking-wider">Overall Risk</p>
                      <p className={`text-xl font-black ${
                        isHighRisk ? "text-red-400" : isMediumRisk ? "text-orange-400" : "text-green-400"
                      }`}>
                        {(item.prediction.xgboostRisk * 100).toFixed(1)}%
                      </p>
                    </div>
                    <div>
                      <p className="text-[9px] text-zinc-600 uppercase tracking-wider">Model Confidence</p>
                      <p className="text-xl font-black text-white">
                        {(item.prediction.xgboostConfidence * 100).toFixed(1)}%
                      </p>
                    </div>
                    <div className="ml-auto">
                      <span className={`px-4 py-2 rounded-full text-xs font-black uppercase ${
                        isHighRisk
                          ? "bg-red-500/20 text-red-300 border border-red-500/50"
                          : isMediumRisk
                            ? "bg-orange-500/20 text-orange-300 border border-orange-500/50"
                            : "bg-green-500/20 text-green-300 border border-green-500/50"
                      }`}>
                        {item.prediction.riskLevel} RISK
                      </span>
                    </div>
                  </div>

                  {/* Clinical Recommendations from XGBoost */}
                  {item.prediction.clinical_recommendations && (
                    <div className="mt-4 pt-4 border-t border-zinc-800/50">
                      <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-2">
                        ML Clinical Recommendations
                      </p>
                      <pre className="text-[10px] text-zinc-400 leading-relaxed font-mono whitespace-pre-wrap bg-black/30 rounded-xl p-4 border border-zinc-800/50 max-h-60 overflow-y-auto custom-scrollbar">
                        {item.prediction.clinical_recommendations}
                      </pre>
                    </div>
                  )}
                </div>
              )}

              {/* Vitals Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <VitalCard
                  label="Blood Pressure"
                  value={item.clinicalData?.vitals?.bp || "N/A"}
                  unit="mmHg"
                />
                <VitalCard
                  label="Heart Rate"
                  value={item.clinicalData?.vitals?.heartRate || "N/A"}
                  unit="bpm"
                />
                <VitalCard
                  label="Cholesterol"
                  value={item.clinicalData?.vitals?.cholesterol || "N/A"}
                  unit="mg/dl"
                />
                <VitalCard
                  label="Sugar Level"
                  value={item.clinicalData?.vitals?.sugarLevel || "N/A"}
                  unit="mg/dl"
                />
              </div>

              {/* Symptoms Section */}
              {item.clinicalData?.symptoms && item.clinicalData.symptoms.length > 0 && (
                <div className="mb-8">
                  <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-3">
                    Reported Symptoms
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {item.clinicalData.symptoms.map((s: string, idx: number) => (
                      <span
                        key={idx}
                        className="bg-zinc-800 text-zinc-300 text-[10px] font-bold px-3 py-1 rounded-lg border border-zinc-700"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Prescriptions Section - Visible to all roles */}
              {item.prescriptions && item.prescriptions.length > 0 && (
                <div className="mb-8">
                  <div className="flex items-center gap-2 mb-3">
                    <Pill size={14} className="text-zinc-600" />
                    <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">
                      Prescriptions ({item.prescriptions.length})
                    </p>
                  </div>
                  <div className="space-y-3">
                    {item.prescriptions.map((p: any, idx: number) => (
                      <div key={idx} className="bg-black/20 border border-zinc-800 rounded-xl p-4">
                        {/* Medicine Name & Duration */}
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-sm font-bold text-white">{p.medicineName}</span>
                          {p.duration && (
                            <span className="text-[9px] text-zinc-600 font-mono bg-zinc-900 px-2 py-1 rounded">
                              {p.duration}
                            </span>
                          )}
                        </div>

                        {/* Dosage */}
                        <div className="text-[11px] text-zinc-400 mb-2">
                          <span className="font-semibold">Dosage:</span> {p.dosage}
                        </div>

                        {/* Frequency & Timing (if available) */}
                        {(p.frequency || p.timing) && (
                          <div className="flex flex-wrap gap-2 mb-2">
                            {p.frequency && (
                              <span className="text-[9px] bg-zinc-800 text-zinc-400 px-2 py-1 rounded border border-zinc-700">
                                📅 {p.frequency}
                              </span>
                            )}
                            {p.timing && (
                              <span className="text-[9px] bg-zinc-800 text-zinc-400 px-2 py-1 rounded border border-zinc-700">
                                🕐 {p.timing}
                              </span>
                            )}
                          </div>
                        )}

                        {/* Special Instructions */}
                        {p.instructions && (
                          <div className="mt-2 pt-2 border-t border-zinc-800/50">
                            <p className="text-[9px] text-zinc-600 uppercase font-bold mb-1">Instructions:</p>
                            <p className="text-[10px] text-zinc-400 leading-relaxed italic">
                              {p.instructions}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Patient Notes / Self-Reports - Visible to doctors and patient */}
              {item.patientNotes && (userRole === "Doctor" || userRole === "Patient") && (
                <div className="mb-8">
                  <div className="flex items-center gap-2 mb-3">
                    <Heart size={14} className="text-zinc-600" />
                    <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">
                      Patient Updates & Notes
                    </p>
                  </div>
                  <div className="bg-zinc-800/30 border border-zinc-700 rounded-xl p-4">
                    <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap">{item.patientNotes}</p>
                  </div>
                </div>
              )}

              {/* Doctor Recommendations - Visible to all roles (Doctors, Patients, Pharmacists, Admins) */}
              {item.doctorRecommendations && (
                <div className="mb-8">
                  <div className="flex items-center gap-2 mb-3">
                    <FileText size={14} className="text-zinc-600" />
                    <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">
                      Doctor Recommendations
                    </p>
                  </div>
                  <div className="bg-black/20 border border-zinc-800 rounded-xl p-4">
                    <p className="text-sm text-zinc-400 leading-relaxed">{item.doctorRecommendations}</p>
                  </div>
                </div>
              )}

              {/* AI Diagnostic Analysis - ONLY visible to doctors and admins */}
              {(userRole === "Doctor" || userRole === "Admin") && item.prediction?.summary && (
                <div className="mb-8">
                  <ExpandableAIAnalysis prediction={item.prediction} isHighRisk={isHighRisk} isMediumRisk={isMediumRisk} />
                </div>
              )}

              {/* Medical Images */}
              {item.images && item.images.length > 0 && (
                <div className="mb-8">
                  <div className="flex items-center gap-2 mb-3">
                    <ImageIcon size={14} className="text-zinc-600" />
                    <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">
                      Medical Images ({item.images.length})
                    </p>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {item.images.map((img: any, idx: number) => {
                      const imageUrl = `http://localhost:8080${img.path}`;
                      const isPDF = img.filename?.toLowerCase().endsWith('.pdf');

                      return (
                        <a
                          key={idx}
                          href={imageUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group bg-black/20 border border-zinc-800 rounded-xl p-3 hover:border-zinc-600 transition-all cursor-pointer"
                        >
                          {/* Check if image or PDF */}
                          {isPDF ? (
                            <div className="aspect-square bg-zinc-900 rounded-lg mb-2 flex flex-col items-center justify-center gap-2">
                              <FileText size={32} className="text-zinc-600 group-hover:text-zinc-400" />
                              <span className="text-[8px] text-zinc-700 uppercase font-black">PDF Document</span>
                            </div>
                          ) : (
                            <div className="aspect-square bg-zinc-900 rounded-lg mb-2 overflow-hidden relative">
                              <img
                                src={imageUrl}
                                alt={img.filename}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                                onError={(e) => {
                                  // Fallback to icon if image fails to load
                                  const target = e.target as HTMLImageElement;
                                  target.style.display = 'none';
                                  if (target.parentElement) {
                                    target.parentElement.innerHTML =
                                      '<div class="w-full h-full flex flex-col items-center justify-center gap-2"><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-zinc-700"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg><span class="text-[8px] text-zinc-700 uppercase font-black">Image</span></div>';
                                  }
                                }}
                              />
                            </div>
                          )}
                          <p className="text-[9px] text-zinc-500 truncate group-hover:text-zinc-400 transition-colors font-medium">
                            {img.filename}
                          </p>
                          <p className="text-[8px] text-zinc-700 uppercase mt-1 font-black">Click to view full</p>
                        </a>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Blockchain Verification Footer */}
              <div className="mt-8 pt-6 border-t border-zinc-800/50 flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-2 text-zinc-600">
                  <Shield size={12} />
                  <span className="text-[9px] font-mono uppercase tracking-tighter">
                    TX: {item.blockchainTxHash}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  {/* Message Doctor button (Patient only) */}
                  {userRole === "Patient" && item.primaryDoctorId && onMessageDoctor && (
                    <button
                      onClick={() => onMessageDoctor(item.primaryDoctorId)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800 border border-zinc-700 rounded-xl text-zinc-400 hover:text-white hover:border-zinc-500 transition-all"
                    >
                      <MessageCircle size={12} />
                      <span className="text-[9px] font-black uppercase tracking-wider">Message Doctor</span>
                    </button>
                  )}

                  {/* Message Patient button (Doctor only) */}
                  {userRole === "Doctor" && item.patientAddress && onMessagePatient && (
                    <button
                      onClick={() => onMessagePatient(item.patientAddress)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800 border border-zinc-700 rounded-xl text-zinc-400 hover:text-white hover:border-zinc-500 transition-all"
                    >
                      <MessageCircle size={12} />
                      <span className="text-[9px] font-black uppercase tracking-wider">Message Patient</span>
                    </button>
                  )}

                  <div className="text-[9px] text-zinc-700 font-bold uppercase tracking-widest">
                    Physician: {(item.primaryDoctorId || item.doctorId)?.slice(0, 6)}...{(item.primaryDoctorId || item.doctorId)?.slice(-4)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

/**
 * ExpandableAIAnalysis Component
 * Shows the Gemini AI summary with a Show More / Show Less toggle
 */
const ExpandableAIAnalysis = ({ prediction, isHighRisk, isMediumRisk }: { prediction: any; isHighRisk: boolean; isMediumRisk: boolean }) => {
  const [expanded, setExpanded] = useState(false);
  const summary = prediction.summary || "";
  const isLong = summary.length > 400;

  return (
    <div className="bg-black/40 border border-zinc-800 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Activity size={16} className="text-zinc-500" />
          <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">
            AI Diagnostic Analysis — Gemini AI
          </span>
        </div>
        {isLong && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-[9px] font-black text-zinc-500 hover:text-white uppercase tracking-wider transition-colors px-3 py-1 rounded-lg border border-zinc-800 hover:border-zinc-600"
          >
            {expanded ? "Show Less" : "Show Full"}
          </button>
        )}
      </div>

      {/* Gemini AI Summary */}
      <div className="prose prose-invert prose-xs max-w-none text-zinc-400 leading-relaxed font-medium mb-4">
        <p className="whitespace-pre-wrap">
          {isLong && !expanded ? summary.slice(0, 400) + "..." : summary}
        </p>
      </div>

      {/* XGBoost Metrics */}
      {prediction.xgboostRisk !== undefined && (
        <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-zinc-800">
          <div>
            <p className="text-[9px] text-zinc-600 uppercase tracking-wider mb-1">
              ML Risk Probability
            </p>
            <p className="text-lg font-bold text-white">
              {(prediction.xgboostRisk * 100).toFixed(1)}%
            </p>
          </div>
          <div>
            <p className="text-[9px] text-zinc-600 uppercase tracking-wider mb-1">
              Model Confidence
            </p>
            <p className="text-lg font-bold text-white">
              {(prediction.xgboostConfidence * 100).toFixed(1)}%
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * VitalCard Component
 * Displays a single vital sign measurement
 *
 * @param label - Name of the vital (e.g., "Blood Pressure")
 * @param value - The measured value
 * @param unit - Unit of measurement (e.g., "mmHg")
 */
const VitalCard = ({ label, value, unit }: { label: string; value: any; unit: string }) => (
  <div className="bg-black/20 border border-zinc-800/50 p-4 rounded-2xl">
    <p className="text-[8px] font-black text-zinc-600 uppercase tracking-widest mb-1">
      {label}
    </p>
    <div className="flex items-baseline gap-1">
      <span className="text-lg font-bold text-white tracking-tighter">{value}</span>
      <span className="text-[8px] font-bold text-zinc-500 uppercase">{unit}</span>
    </div>
  </div>
);
