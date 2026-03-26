import { useState, useRef, useEffect } from "react";
import { Pill, ChevronDown, Search } from "lucide-react";

// Comprehensive cardiology & general medicine database
const MEDICINES = [
  // --- Antiplatelets & Anticoagulants ---
  { name: "Aspirin", category: "Antiplatelet", commonDosage: "75-325mg" },
  { name: "Clopidogrel (Plavix)", category: "Antiplatelet", commonDosage: "75mg" },
  { name: "Ticagrelor (Brilinta)", category: "Antiplatelet", commonDosage: "90mg" },
  { name: "Prasugrel (Effient)", category: "Antiplatelet", commonDosage: "10mg" },
  { name: "Warfarin (Coumadin)", category: "Anticoagulant", commonDosage: "2-10mg" },
  { name: "Rivaroxaban (Xarelto)", category: "Anticoagulant", commonDosage: "10-20mg" },
  { name: "Apixaban (Eliquis)", category: "Anticoagulant", commonDosage: "2.5-5mg" },
  { name: "Dabigatran (Pradaxa)", category: "Anticoagulant", commonDosage: "150mg" },
  { name: "Enoxaparin (Lovenox)", category: "Anticoagulant", commonDosage: "40-80mg" },
  { name: "Heparin", category: "Anticoagulant", commonDosage: "5000 IU" },

  // --- Statins (Cholesterol) ---
  { name: "Atorvastatin (Lipitor)", category: "Statin", commonDosage: "10-80mg" },
  { name: "Rosuvastatin (Crestor)", category: "Statin", commonDosage: "5-40mg" },
  { name: "Simvastatin (Zocor)", category: "Statin", commonDosage: "10-40mg" },
  { name: "Pravastatin (Pravachol)", category: "Statin", commonDosage: "10-80mg" },
  { name: "Pitavastatin (Livalo)", category: "Statin", commonDosage: "1-4mg" },
  { name: "Ezetimibe (Zetia)", category: "Cholesterol", commonDosage: "10mg" },
  { name: "Fenofibrate (Tricor)", category: "Fibrate", commonDosage: "145mg" },
  { name: "Gemfibrozil (Lopid)", category: "Fibrate", commonDosage: "600mg" },

  // --- ACE Inhibitors ---
  { name: "Lisinopril (Prinivil)", category: "ACE Inhibitor", commonDosage: "5-40mg" },
  { name: "Enalapril (Vasotec)", category: "ACE Inhibitor", commonDosage: "5-40mg" },
  { name: "Ramipril (Altace)", category: "ACE Inhibitor", commonDosage: "2.5-20mg" },
  { name: "Captopril (Capoten)", category: "ACE Inhibitor", commonDosage: "25-150mg" },
  { name: "Perindopril (Aceon)", category: "ACE Inhibitor", commonDosage: "4-8mg" },

  // --- ARBs ---
  { name: "Losartan (Cozaar)", category: "ARB", commonDosage: "25-100mg" },
  { name: "Valsartan (Diovan)", category: "ARB", commonDosage: "80-320mg" },
  { name: "Telmisartan (Micardis)", category: "ARB", commonDosage: "20-80mg" },
  { name: "Irbesartan (Avapro)", category: "ARB", commonDosage: "150-300mg" },
  { name: "Olmesartan (Benicar)", category: "ARB", commonDosage: "20-40mg" },

  // --- Beta Blockers ---
  { name: "Metoprolol (Lopressor)", category: "Beta Blocker", commonDosage: "25-200mg" },
  { name: "Atenolol (Tenormin)", category: "Beta Blocker", commonDosage: "25-100mg" },
  { name: "Carvedilol (Coreg)", category: "Beta Blocker", commonDosage: "3.125-25mg" },
  { name: "Bisoprolol (Zebeta)", category: "Beta Blocker", commonDosage: "2.5-10mg" },
  { name: "Propranolol (Inderal)", category: "Beta Blocker", commonDosage: "20-160mg" },
  { name: "Nebivolol (Bystolic)", category: "Beta Blocker", commonDosage: "5-40mg" },

  // --- Calcium Channel Blockers ---
  { name: "Amlodipine (Norvasc)", category: "CCB", commonDosage: "2.5-10mg" },
  { name: "Diltiazem (Cardizem)", category: "CCB", commonDosage: "120-360mg" },
  { name: "Verapamil (Calan)", category: "CCB", commonDosage: "120-480mg" },
  { name: "Nifedipine (Procardia)", category: "CCB", commonDosage: "30-90mg" },

  // --- Diuretics ---
  { name: "Furosemide (Lasix)", category: "Diuretic", commonDosage: "20-80mg" },
  { name: "Hydrochlorothiazide (HCTZ)", category: "Diuretic", commonDosage: "12.5-50mg" },
  { name: "Spironolactone (Aldactone)", category: "Diuretic", commonDosage: "25-100mg" },
  { name: "Torsemide (Demadex)", category: "Diuretic", commonDosage: "10-20mg" },
  { name: "Chlorthalidone", category: "Diuretic", commonDosage: "12.5-25mg" },
  { name: "Indapamide (Lozol)", category: "Diuretic", commonDosage: "1.25-2.5mg" },

  // --- Nitrates ---
  { name: "Nitroglycerin (Nitrostat)", category: "Nitrate", commonDosage: "0.4mg SL" },
  { name: "Isosorbide Mononitrate (Imdur)", category: "Nitrate", commonDosage: "30-120mg" },
  { name: "Isosorbide Dinitrate (Isordil)", category: "Nitrate", commonDosage: "10-40mg" },

  // --- Antiarrhythmics ---
  { name: "Amiodarone (Cordarone)", category: "Antiarrhythmic", commonDosage: "200-400mg" },
  { name: "Flecainide (Tambocor)", category: "Antiarrhythmic", commonDosage: "50-150mg" },
  { name: "Sotalol (Betapace)", category: "Antiarrhythmic", commonDosage: "80-160mg" },
  { name: "Digoxin (Lanoxin)", category: "Cardiac Glycoside", commonDosage: "0.125-0.25mg" },
  { name: "Adenosine (Adenocard)", category: "Antiarrhythmic", commonDosage: "6-12mg IV" },

  // --- Diabetes (Cardiac-related) ---
  { name: "Metformin (Glucophage)", category: "Antidiabetic", commonDosage: "500-2000mg" },
  { name: "Glimepiride (Amaryl)", category: "Antidiabetic", commonDosage: "1-4mg" },
  { name: "Sitagliptin (Januvia)", category: "Antidiabetic", commonDosage: "100mg" },
  { name: "Empagliflozin (Jardiance)", category: "SGLT2 Inhibitor", commonDosage: "10-25mg" },
  { name: "Dapagliflozin (Farxiga)", category: "SGLT2 Inhibitor", commonDosage: "5-10mg" },
  { name: "Insulin Glargine (Lantus)", category: "Insulin", commonDosage: "10-80 units" },

  // --- Pain / Anti-inflammatory ---
  { name: "Ibuprofen (Advil)", category: "NSAID", commonDosage: "200-800mg" },
  { name: "Naproxen (Aleve)", category: "NSAID", commonDosage: "250-500mg" },
  { name: "Paracetamol (Tylenol)", category: "Analgesic", commonDosage: "500-1000mg" },
  { name: "Colchicine (Colcrys)", category: "Anti-inflammatory", commonDosage: "0.5-0.6mg" },

  // --- GI / Acid (Commonly co-prescribed) ---
  { name: "Omeprazole (Prilosec)", category: "PPI", commonDosage: "20-40mg" },
  { name: "Pantoprazole (Protonix)", category: "PPI", commonDosage: "40mg" },
  { name: "Esomeprazole (Nexium)", category: "PPI", commonDosage: "20-40mg" },

  // --- Anxiety / Sleep (Cardiac patients) ---
  { name: "Alprazolam (Xanax)", category: "Anxiolytic", commonDosage: "0.25-0.5mg" },
  { name: "Zolpidem (Ambien)", category: "Sleep Aid", commonDosage: "5-10mg" },

  // --- Supplements ---
  { name: "Potassium Chloride (K-Dur)", category: "Supplement", commonDosage: "10-20mEq" },
  { name: "Magnesium Oxide", category: "Supplement", commonDosage: "400mg" },
  { name: "Fish Oil (Omega-3)", category: "Supplement", commonDosage: "1000-4000mg" },
  { name: "Coenzyme Q10", category: "Supplement", commonDosage: "100-200mg" },
  { name: "Vitamin D3", category: "Supplement", commonDosage: "1000-5000 IU" },
  { name: "Iron (Ferrous Sulfate)", category: "Supplement", commonDosage: "325mg" },
  { name: "Folic Acid", category: "Supplement", commonDosage: "1mg" },
];

// Group medicines by category
const CATEGORIES = [...new Set(MEDICINES.map((m) => m.category))];

interface MedicineSelectorProps {
  value: string;
  onChange: (name: string, dosage?: string) => void;
  placeholder?: string;
}

export const MedicineSelector = ({ value, onChange, placeholder }: MedicineSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [isOpen]);

  const filtered = MEDICINES.filter((m) => {
    const q = (search || value).toLowerCase();
    if (!q) return true;
    return (
      m.name.toLowerCase().includes(q) ||
      m.category.toLowerCase().includes(q)
    );
  });

  const filteredByCategory = activeCategory
    ? filtered.filter((m) => m.category === activeCategory)
    : filtered;

  const handleSelect = (med: typeof MEDICINES[0]) => {
    onChange(med.name, med.commonDosage);
    setSearch("");
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Input — user can type freely OR select from dropdown */}
      <div className="relative">
        <Pill size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" />
        <input
          ref={inputRef}
          type="text"
          value={search || value}
          onChange={(e) => {
            setSearch(e.target.value);
            onChange(e.target.value);
            if (!isOpen) setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder || "Search or type medicine name..."}
          className="w-full pl-9 pr-8 p-3 bg-black border border-zinc-800 rounded-xl text-white text-sm outline-none focus:border-zinc-500"
        />
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-zinc-600 hover:text-white"
        >
          <ChevronDown size={14} className={`transition-transform ${isOpen ? "rotate-180" : ""}`} />
        </button>
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-zinc-900 border border-zinc-700 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden">
          {/* Category tabs */}
          <div className="px-3 pt-3 pb-2 border-b border-zinc-800 flex flex-wrap gap-1">
            <button
              type="button"
              onClick={() => setActiveCategory(null)}
              className={`px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-wider transition-all ${
                !activeCategory ? "bg-white text-black" : "text-zinc-500 hover:text-white bg-zinc-800"
              }`}
            >
              All
            </button>
            {CATEGORIES.slice(0, 8).map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
                className={`px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-wider transition-all ${
                  activeCategory === cat ? "bg-white text-black" : "text-zinc-600 hover:text-white bg-zinc-800"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Medicine list */}
          <div className="max-h-48 overflow-y-auto custom-scrollbar">
            {filteredByCategory.length === 0 ? (
              <div className="p-4 text-center">
                <p className="text-[10px] text-zinc-600">No matches — your typed text will be used as the medicine name</p>
              </div>
            ) : (
              filteredByCategory.slice(0, 20).map((med, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleSelect(med)}
                  className="w-full px-4 py-2.5 flex items-center justify-between hover:bg-zinc-800 transition-all text-left"
                >
                  <div>
                    <p className="text-xs font-bold text-zinc-200">{med.name}</p>
                    <p className="text-[8px] text-zinc-600">{med.category}</p>
                  </div>
                  <span className="text-[9px] font-mono text-zinc-500 bg-zinc-800 px-2 py-0.5 rounded shrink-0">
                    {med.commonDosage}
                  </span>
                </button>
              ))
            )}
            {filteredByCategory.length > 20 && (
              <p className="text-[9px] text-zinc-700 text-center py-2">
                Type to narrow results ({filteredByCategory.length - 20} more)
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
