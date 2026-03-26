import { AlertTriangle, CheckCircle, Shield } from "lucide-react";

// Common dangerous drug interactions in cardiology
const INTERACTIONS: Record<string, { conflicts: string[]; severity: string; warning: string }> = {
  warfarin: {
    conflicts: ["aspirin", "ibuprofen", "naproxen", "clopidogrel", "rivaroxaban"],
    severity: "CRITICAL",
    warning: "Major bleeding risk — concurrent anticoagulants/antiplatelets can cause fatal hemorrhage"
  },
  aspirin: {
    conflicts: ["warfarin", "rivaroxaban", "apixaban", "ibuprofen", "naproxen"],
    severity: "HIGH",
    warning: "Increased bleeding risk — avoid combining with other blood thinners or NSAIDs"
  },
  metformin: {
    conflicts: ["contrast dye", "alcohol"],
    severity: "HIGH",
    warning: "Risk of lactic acidosis — hold metformin 48h before/after contrast procedures"
  },
  lisinopril: {
    conflicts: ["spironolactone", "potassium", "losartan", "valsartan"],
    severity: "HIGH",
    warning: "Hyperkalemia risk — ACE inhibitor + ARB/K-sparing diuretic combination is dangerous"
  },
  enalapril: {
    conflicts: ["spironolactone", "potassium", "losartan", "valsartan"],
    severity: "HIGH",
    warning: "Hyperkalemia risk — ACE inhibitor + potassium-sparing agents"
  },
  atorvastatin: {
    conflicts: ["gemfibrozil", "clarithromycin", "erythromycin", "cyclosporine"],
    severity: "HIGH",
    warning: "Rhabdomyolysis risk — statin combined with fibrate/macrolide antibiotics"
  },
  simvastatin: {
    conflicts: ["amlodipine", "gemfibrozil", "amiodarone", "diltiazem"],
    severity: "HIGH",
    warning: "Rhabdomyolysis risk — simvastatin dose must be limited with these drugs"
  },
  amiodarone: {
    conflicts: ["digoxin", "warfarin", "simvastatin", "metoprolol", "diltiazem"],
    severity: "CRITICAL",
    warning: "Multiple serious interactions — amiodarone increases levels of digoxin, warfarin, statins"
  },
  digoxin: {
    conflicts: ["amiodarone", "verapamil", "quinidine", "spironolactone"],
    severity: "CRITICAL",
    warning: "Digoxin toxicity risk — these drugs increase digoxin levels causing cardiac arrhythmias"
  },
  metoprolol: {
    conflicts: ["verapamil", "diltiazem", "clonidine"],
    severity: "HIGH",
    warning: "Severe bradycardia/heart block — beta-blocker + calcium channel blocker combination"
  },
  amlodipine: {
    conflicts: ["simvastatin", "cyclosporine"],
    severity: "MEDIUM",
    warning: "Amlodipine increases simvastatin levels — limit simvastatin to 20mg/day"
  },
  clopidogrel: {
    conflicts: ["omeprazole", "esomeprazole", "warfarin"],
    severity: "HIGH",
    warning: "Omeprazole reduces clopidogrel effectiveness — use pantoprazole instead"
  },
  rivaroxaban: {
    conflicts: ["aspirin", "warfarin", "ketoconazole", "rifampin"],
    severity: "CRITICAL",
    warning: "Dual anticoagulation — extreme bleeding risk, avoid combination"
  },
  nitroglycerin: {
    conflicts: ["sildenafil", "tadalafil", "vardenafil"],
    severity: "CRITICAL",
    warning: "FATAL HYPOTENSION — nitrates + PDE5 inhibitors can cause cardiovascular collapse"
  },
  spironolactone: {
    conflicts: ["lisinopril", "enalapril", "losartan", "potassium"],
    severity: "HIGH",
    warning: "Life-threatening hyperkalemia — K-sparing diuretic + ACE/ARB + potassium"
  }
};

interface DrugInteractionResult {
  drug1: string;
  drug2: string;
  severity: string;
  warning: string;
}

export const checkInteractions = (medications: string[]): DrugInteractionResult[] => {
  const results: DrugInteractionResult[] = [];
  const normalizedMeds = medications.map((m) => m.toLowerCase().trim());

  for (let i = 0; i < normalizedMeds.length; i++) {
    const drug = normalizedMeds[i];
    // Check each known drug
    for (const [knownDrug, info] of Object.entries(INTERACTIONS)) {
      if (drug.includes(knownDrug)) {
        // Check if any conflicting drug is in the list
        for (let j = 0; j < normalizedMeds.length; j++) {
          if (i === j) continue;
          const otherDrug = normalizedMeds[j];
          for (const conflict of info.conflicts) {
            if (otherDrug.includes(conflict)) {
              // Avoid duplicates
              const exists = results.some(
                (r) => (r.drug1 === drug && r.drug2 === otherDrug) || (r.drug1 === otherDrug && r.drug2 === drug)
              );
              if (!exists) {
                results.push({
                  drug1: medications[i],
                  drug2: medications[j],
                  severity: info.severity,
                  warning: info.warning,
                });
              }
            }
          }
        }
      }
    }
  }

  return results;
};

interface DrugInteractionDisplayProps {
  interactions: DrugInteractionResult[];
}

export const DrugInteractionDisplay = ({ interactions }: DrugInteractionDisplayProps) => {
  if (interactions.length === 0) {
    return (
      <div className="flex items-center gap-2 p-3 bg-zinc-900/50 border border-zinc-800 rounded-xl">
        <CheckCircle size={14} className="text-zinc-500" />
        <span className="text-[10px] text-zinc-500 font-bold">No drug interactions detected</span>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 mb-1">
        <AlertTriangle size={14} className="text-white animate-pulse" />
        <span className="text-[10px] font-black text-white uppercase tracking-wider">
          Drug Interactions Detected ({interactions.length})
        </span>
      </div>
      {interactions.map((interaction, i) => (
        <div
          key={i}
          className={`p-3 rounded-xl border ${
            interaction.severity === "CRITICAL"
              ? "bg-white/5 border-white/30 animate-emergency"
              : interaction.severity === "HIGH"
              ? "bg-zinc-800/50 border-zinc-600"
              : "bg-zinc-900 border-zinc-700"
          }`}
        >
          <div className="flex items-center gap-2 mb-1">
            <Shield size={12} className={interaction.severity === "CRITICAL" ? "text-white" : "text-zinc-400"} />
            <span className={`text-[9px] font-black uppercase tracking-wider ${
              interaction.severity === "CRITICAL" ? "text-white" : "text-zinc-300"
            }`}>
              {interaction.severity} — {interaction.drug1} + {interaction.drug2}
            </span>
          </div>
          <p className="text-[9px] text-zinc-400 leading-relaxed ml-5">{interaction.warning}</p>
        </div>
      ))}
    </div>
  );
};
