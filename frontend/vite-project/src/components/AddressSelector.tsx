import { useEffect, useState } from "react";
import axios from "axios";
import { Search, User, ChevronDown } from "lucide-react";

const API_BASE = "http://localhost:8080/api";

interface Person {
  walletAddress: string;
  name: string;
  role?: string;
  bloodGroup?: string;
}

interface AddressSelectorProps {
  /** "patient" or "doctor" — what kind of person to list */
  type: "patient" | "doctor";
  /** Current user's wallet address (used for doctor → show their patients) */
  currentUserAddress: string;
  /** Current user's role */
  currentUserRole: string;
  /** The selected address */
  value: string;
  /** Callback when address is selected */
  onChange: (address: string) => void;
  /** HTML name attribute for form submission */
  name?: string;
  /** Whether this field is required */
  required?: boolean;
  /** Label text */
  label?: string;
}

export const AddressSelector = ({
  type,
  currentUserAddress,
  currentUserRole,
  value,
  onChange,
  name,
  required,
  label,
}: AddressSelectorProps) => {
  const [people, setPeople] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    fetchPeople();
  }, [currentUserAddress, type]);

  const fetchPeople = async () => {
    try {
      let list: Person[] = [];

      if (type === "patient") {
        // If current user is a doctor, fetch their patients
        if (currentUserRole === "Doctor") {
          const { data } = await axios.get(`${API_BASE}/doctor/my-patients/${currentUserAddress}`);
          list = (data.patients || []).map((p: any) => ({
            walletAddress: p.walletAddress,
            name: p.profile?.name || "Unknown",
            bloodGroup: p.profile?.bloodGroup,
            role: "Patient",
          }));
        }
        // Also fetch all patients from registry for completeness
        try {
          const { data } = await axios.get(`${API_BASE}/pharmacist/registry`);
          const registryList = (data.registry || []).map((p: any) => ({
            walletAddress: p.walletAddress,
            name: p.profile?.name || "Unknown",
            bloodGroup: p.profile?.bloodGroup,
            role: "Patient",
          }));
          // Merge, avoiding duplicates
          const existing = new Set(list.map((p) => p.walletAddress));
          registryList.forEach((p: Person) => {
            if (!existing.has(p.walletAddress)) list.push(p);
          });
        } catch {}
      } else {
        // Fetch all doctors
        try {
          const { data } = await axios.get(`${API_BASE}/access/history/${currentUserAddress}`);
          list = (data.doctors || []).map((d: any) => ({
            walletAddress: d.walletAddress,
            name: d.name || "Unknown",
            role: "Doctor",
          }));
        } catch {}
      }

      setPeople(list);
    } catch (err) {
      console.error("Failed to fetch people:", err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = people.filter((p) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return p.name.toLowerCase().includes(q) || p.walletAddress.toLowerCase().includes(q);
  });

  const selectedPerson = people.find((p) => p.walletAddress === value);

  return (
    <div className="space-y-1 relative">
      {label && (
        <label className="text-[9px] font-black text-zinc-500 uppercase ml-2 tracking-wider">{label}</label>
      )}

      {/* Hidden input for form submission */}
      {name && <input type="hidden" name={name} value={value} />}

      {/* Selector button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 bg-black border border-zinc-800 rounded-2xl text-left outline-none focus:border-zinc-600 transition-all flex items-center justify-between"
      >
        {selectedPerson ? (
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="bg-zinc-800 p-1.5 rounded-lg shrink-0">
              <User size={14} className="text-zinc-400" />
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-white truncate">{selectedPerson.name}</p>
              <p className="text-[8px] font-mono text-zinc-600 truncate">{selectedPerson.walletAddress}</p>
            </div>
          </div>
        ) : (
          <span className="text-zinc-600 text-sm">
            {loading ? "Loading..." : `Select a ${type}...`}
          </span>
        )}
        <ChevronDown size={16} className={`text-zinc-600 shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-zinc-900 border border-zinc-700 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden">
          {/* Search */}
          <div className="p-3 border-b border-zinc-800">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name..."
                className="w-full pl-9 pr-3 py-2 bg-black border border-zinc-800 rounded-xl text-[11px] text-white placeholder-zinc-700 outline-none focus:border-zinc-600"
                autoFocus
              />
            </div>
          </div>

          {/* Options */}
          <div className="max-h-52 overflow-y-auto custom-scrollbar">
            {filtered.length === 0 ? (
              <div className="p-6 text-center">
                <p className="text-[10px] text-zinc-600 font-bold">
                  {people.length === 0 ? `No ${type}s found in system` : "No matches"}
                </p>
              </div>
            ) : (
              filtered.map((person) => (
                <button
                  key={person.walletAddress}
                  type="button"
                  onClick={() => {
                    onChange(person.walletAddress);
                    setIsOpen(false);
                    setSearchQuery("");
                  }}
                  className={`w-full px-4 py-3 flex items-center gap-3 hover:bg-zinc-800 transition-all text-left ${
                    value === person.walletAddress ? "bg-zinc-800/50" : ""
                  }`}
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-700 shrink-0" />
                  <div className="overflow-hidden flex-1">
                    <p className="text-xs font-bold text-zinc-200 truncate">{person.name}</p>
                    <p className="text-[8px] font-mono text-zinc-600 truncate">{person.walletAddress}</p>
                  </div>
                  {person.bloodGroup && (
                    <span className="text-[7px] font-black text-zinc-700 border border-zinc-800 px-1.5 py-0.5 rounded shrink-0">
                      {person.bloodGroup}
                    </span>
                  )}
                </button>
              ))
            )}
          </div>
        </div>
      )}

      {/* Click outside to close */}
      {isOpen && (
        <div className="fixed inset-0 z-40" onClick={() => { setIsOpen(false); setSearchQuery(""); }} />
      )}
    </div>
  );
};
