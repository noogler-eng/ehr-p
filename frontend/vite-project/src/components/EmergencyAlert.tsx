import { AlertTriangle, Phone, X } from "lucide-react";
import { useState } from "react";

interface EmergencyAlertProps {
  history: any[];
  userRole: string;
}

export const EmergencyAlert = ({ history, userRole }: EmergencyAlertProps) => {
  const [dismissed, setDismissed] = useState(false);

  // Only show to Doctor/Admin
  if (userRole !== "Doctor" && userRole !== "Admin") return null;
  if (dismissed) return null;

  // Check for critical conditions
  const criticalRecords = history.filter((item) => {
    const conditions = item.prediction?.predicted_conditions || [];
    return conditions.some((c: any) => c.severity === "CRITICAL");
  });

  if (criticalRecords.length === 0) return null;

  // Get all critical conditions
  const allCritical: { name: string; probability: number }[] = [];
  criticalRecords.forEach((record) => {
    (record.prediction?.predicted_conditions || []).forEach((c: any) => {
      if (c.severity === "CRITICAL") {
        allCritical.push({ name: c.name, probability: c.probability });
      }
    });
  });

  return (
    <div className="mb-6 animate-emergency">
      <div className="bg-white/5 border-2 border-white/30 rounded-[2rem] p-6 backdrop-blur-md relative overflow-hidden">
        {/* Pulsing background */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/5 via-transparent to-white/5 animate-pulse" />

        <div className="relative flex items-start gap-4">
          {/* Alert Icon */}
          <div className="bg-white/10 p-3 rounded-xl border border-white/20 shrink-0 animate-pulse">
            <AlertTriangle size={24} className="text-white" />
          </div>

          {/* Content */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-sm font-black text-white uppercase tracking-wider">
                Critical Alert — Immediate Attention Required
              </h3>
              <span className="px-2 py-0.5 bg-white/20 border border-white/30 rounded-full text-[8px] font-black text-white uppercase tracking-widest animate-pulse">
                Priority 1
              </span>
            </div>

            <p className="text-[10px] text-zinc-400 mb-3">
              AI models have detected {allCritical.length} critical cardiovascular condition{allCritical.length > 1 ? "s" : ""} requiring urgent clinical evaluation:
            </p>

            <div className="flex flex-wrap gap-2 mb-3">
              {allCritical.slice(0, 4).map((c, i) => (
                <span
                  key={i}
                  className="px-3 py-1.5 bg-white/10 border border-white/20 rounded-xl text-[9px] font-black text-white uppercase tracking-wider"
                >
                  {c.name} — {c.probability}%
                </span>
              ))}
              {allCritical.length > 4 && (
                <span className="px-3 py-1.5 bg-zinc-800 border border-zinc-700 rounded-xl text-[9px] font-bold text-zinc-400">
                  +{allCritical.length - 4} more
                </span>
              )}
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-zinc-500">
                <Phone size={12} />
                <span className="text-[9px] font-bold uppercase tracking-wider">
                  Emergency Cardiology Consultation Recommended
                </span>
              </div>
            </div>
          </div>

          {/* Dismiss */}
          <button
            onClick={() => setDismissed(true)}
            className="shrink-0 p-2 text-zinc-600 hover:text-white transition-colors rounded-xl hover:bg-white/5"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
