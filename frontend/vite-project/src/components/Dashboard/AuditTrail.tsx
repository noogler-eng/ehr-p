import { Clock, Shield, FileText, RefreshCw, User, Plus, Hash, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

interface AuditTrailProps {
  history: any[];
  userRole: string;
}

export const AuditTrail = ({ history, userRole }: AuditTrailProps) => {
  const [expanded, setExpanded] = useState(false);

  // Only show to Doctor/Admin
  if (userRole !== "Doctor" && userRole !== "Admin") return null;

  // Collect all update history entries across records
  const allUpdates: any[] = [];
  history.forEach((record) => {
    if (record.updateHistory) {
      record.updateHistory.forEach((update: any) => {
        allUpdates.push({ ...update, patientAddress: record.patientAddress });
      });
    }
  });

  // Sort by timestamp desc
  allUpdates.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  if (allUpdates.length === 0) return null;

  const displayUpdates = expanded ? allUpdates : allUpdates.slice(0, 3);

  const getActionIcon = (action: string) => {
    switch (action) {
      case "INITIAL_CREATE": return <Plus size={14} className="text-white" />;
      case "DOCTOR_UPDATE":
      case "DOCTOR_EDIT": return <FileText size={14} className="text-zinc-300" />;
      case "PATIENT_UPDATE": return <User size={14} className="text-zinc-400" />;
      case "AI_REANALYSIS": return <RefreshCw size={14} className="text-zinc-300" />;
      default: return <Shield size={14} className="text-zinc-500" />;
    }
  };

  const getActionLabel = (action: string) => {
    switch (action) {
      case "INITIAL_CREATE": return "Record Created";
      case "DOCTOR_UPDATE": return "Doctor Updated";
      case "DOCTOR_EDIT": return "Doctor Edited";
      case "PATIENT_UPDATE": return "Patient Updated";
      case "AI_REANALYSIS": return "AI Re-analysis";
      default: return action;
    }
  };

  return (
    <div className="bg-zinc-900/30 border border-zinc-800 rounded-[2rem] p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Clock size={14} className="text-zinc-600" />
          <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">
            Blockchain Audit Trail
          </h3>
        </div>
        <span className="text-[8px] font-black text-zinc-700 uppercase tracking-widest">
          {allUpdates.length} Verified Entries
        </span>
      </div>

      <div className="space-y-2">
        {displayUpdates.map((update, i) => (
          <div
            key={i}
            className="flex items-center gap-4 p-3 bg-black/30 border border-zinc-800/50 rounded-xl hover:border-zinc-700 transition-all"
          >
            {/* Timeline dot */}
            <div className={`p-2 rounded-lg shrink-0 ${
              update.action === "INITIAL_CREATE" ? "bg-white/10" : "bg-zinc-800"
            }`}>
              {getActionIcon(update.action)}
            </div>

            {/* Details */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black text-white uppercase">{getActionLabel(update.action)}</span>
                <span className={`px-2 py-0.5 rounded text-[7px] font-black uppercase tracking-wider ${
                  update.updatedByRole === "Doctor"
                    ? "bg-white/10 text-white border border-white/20"
                    : "bg-zinc-800 text-zinc-500 border border-zinc-700"
                }`}>
                  {update.updatedByRole}
                </span>
              </div>
              <p className="text-[9px] text-zinc-500 mt-0.5 truncate">{update.description}</p>
            </div>

            {/* Tx Hash + Time */}
            <div className="text-right shrink-0">
              {update.txHash && (
                <div className="flex items-center gap-1 justify-end mb-0.5">
                  <Hash size={8} className="text-zinc-700" />
                  <span className="text-[8px] font-mono text-zinc-600">
                    {update.txHash.slice(0, 12)}...
                  </span>
                </div>
              )}
              <span className="text-[8px] text-zinc-700">
                {new Date(update.timestamp).toLocaleDateString()} {new Date(update.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Expand/Collapse */}
      {allUpdates.length > 3 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full mt-3 py-2 flex items-center justify-center gap-2 text-zinc-600 hover:text-white transition-colors text-[9px] font-black uppercase tracking-wider"
        >
          {expanded ? (
            <>Show Less <ChevronUp size={12} /></>
          ) : (
            <>Show {allUpdates.length - 3} More <ChevronDown size={12} /></>
          )}
        </button>
      )}
    </div>
  );
};
