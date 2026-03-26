import { useEffect, useState } from "react";
import axios from "axios";
import { Pill, CheckCircle, XCircle, Clock, ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { showToast } from "../components/Toast";

const API_BASE = "http://localhost:8080/api";

interface MedicationTrackerProps {
  account: string;
  userRole: string;
}

interface Prescription {
  medicineName: string;
  dosage: string;
  frequency: string;
  timing: string;
  instructions: string;
}

interface MedLog {
  medicineName: string;
  status: string;
  time: string;
  notes: string;
}

export const MedicationTracker = ({ account, userRole }: MedicationTrackerProps) => {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [logs, setLogs] = useState<MedLog[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [account, selectedDate]);

  const fetchData = async () => {
    try {
      const { data } = await axios.get(`${API_BASE}/medication/logs/${account}?date=${selectedDate}`);
      // Filter out prescriptions with empty/null medicine names
      const validPrescriptions = (data.prescriptions || []).filter(
        (p: any) => p.medicineName && p.medicineName.trim()
      );
      setPrescriptions(validPrescriptions);
      setLogs(data.logs || []);
    } catch (err) {
      console.error("Failed to fetch medication data:", err);
    } finally {
      setLoading(false);
    }
  };

  const logMedication = async (medicineName: string, dosage: string, status: 'taken' | 'missed' | 'skipped') => {
    try {
      await axios.post(`${API_BASE}/medication/log`, {
        patientAddress: account,
        medicineName,
        dosage,
        date: selectedDate,
        status,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
      showToast({
        type: status === 'taken' ? 'success' : 'warning',
        title: status === 'taken' ? 'Medication Taken' : status === 'missed' ? 'Missed' : 'Skipped',
        message: `${medicineName} — ${status}`
      });
      fetchData();
    } catch (err) {
      showToast({ type: "error", title: "Failed", message: "Could not log medication" });
    }
  };

  const changeDate = (days: number) => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + days);
    setSelectedDate(d.toISOString().split('T')[0]);
  };

  const isToday = selectedDate === new Date().toISOString().split('T')[0];

  // Map logs to a lookup
  const logMap: Record<string, MedLog> = {};
  logs.forEach((l) => { logMap[l.medicineName] = l; });

  // Stats
  const totalMeds = prescriptions.length;
  const takenCount = prescriptions.filter(p => logMap[p.medicineName]?.status === 'taken').length;
  const missedCount = prescriptions.filter(p => logMap[p.medicineName]?.status === 'missed').length;
  const pendingCount = totalMeds - Object.keys(logMap).length;

  // Only patients can use this
  if (userRole !== "Patient") {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-black italic tracking-tighter text-white uppercase">
          Medication <span className="text-zinc-500">Tracker</span>
        </h1>
        <div className="text-center py-20">
          <Pill size={48} className="text-zinc-800 mx-auto mb-4" />
          <p className="text-zinc-500 text-sm font-bold">This feature is for patients only</p>
          <p className="text-zinc-700 text-xs mt-1">Patients can track their daily medication intake here</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black italic tracking-tighter text-white uppercase">
            Medication <span className="text-zinc-500">Tracker</span>
          </h1>
          <p className="text-zinc-600 text-xs font-bold mt-1 uppercase tracking-widest">
            Daily Medication Adherence Log
          </p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-3">
          <Pill size={24} className="text-zinc-500" />
        </div>
      </div>

      {/* Date Selector */}
      <div className="flex items-center justify-center gap-4">
        <button onClick={() => changeDate(-1)} className="p-2 bg-zinc-800 border border-zinc-700 rounded-xl text-zinc-400 hover:text-white transition-all">
          <ChevronLeft size={18} />
        </button>
        <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-2xl px-6 py-3">
          <Calendar size={16} className="text-zinc-500" />
          <span className="text-sm font-black text-white">
            {isToday ? "Today" : new Date(selectedDate + 'T00:00:00').toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
          </span>
          <span className="text-[9px] text-zinc-500 font-mono">{selectedDate}</span>
        </div>
        <button
          onClick={() => changeDate(1)}
          disabled={isToday}
          className="p-2 bg-zinc-800 border border-zinc-700 rounded-xl text-zinc-400 hover:text-white transition-all disabled:opacity-30"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
          <p className="text-2xl font-black text-white">{takenCount}</p>
          <p className="text-[8px] font-black text-zinc-500 uppercase tracking-widest mt-1">Taken</p>
        </div>
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-4 text-center">
          <p className="text-2xl font-black text-zinc-400">{missedCount}</p>
          <p className="text-[8px] font-black text-zinc-600 uppercase tracking-widest mt-1">Missed</p>
        </div>
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-4 text-center">
          <p className="text-2xl font-black text-zinc-400">{pendingCount > 0 ? pendingCount : 0}</p>
          <p className="text-[8px] font-black text-zinc-600 uppercase tracking-widest mt-1">Pending</p>
        </div>
      </div>

      {/* Progress Bar */}
      {totalMeds > 0 && (
        <div className="bg-zinc-900/30 border border-zinc-800 rounded-2xl p-4">
          <div className="flex justify-between mb-2">
            <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Daily Adherence</span>
            <span className="text-[9px] font-mono text-zinc-500">{totalMeds > 0 ? Math.round((takenCount / totalMeds) * 100) : 0}%</span>
          </div>
          <div className="h-2 rounded-full bg-zinc-800 overflow-hidden">
            <div
              className="h-full bg-white rounded-full transition-all duration-500"
              style={{ width: `${totalMeds > 0 ? (takenCount / totalMeds) * 100 : 0}%` }}
            />
          </div>
        </div>
      )}

      {/* Medication List */}
      <div className="bg-zinc-900/30 border border-zinc-800 rounded-[2rem] p-6">
        <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-4">
          Prescribed Medications ({prescriptions.length})
        </h3>

        {loading ? (
          <div className="py-12 text-center">
            <div className="w-6 h-6 border-2 border-zinc-700 border-t-white rounded-full animate-spin mx-auto" />
          </div>
        ) : prescriptions.length === 0 ? (
          <div className="py-12 text-center">
            <Pill size={32} className="text-zinc-800 mx-auto mb-2" />
            <p className="text-zinc-600 text-xs font-bold">No prescriptions on file</p>
            <p className="text-zinc-700 text-[10px] mt-1">Your doctor will prescribe medications after a visit</p>
          </div>
        ) : (
          <div className="space-y-3">
            {prescriptions.map((med, i) => {
              const log = logMap[med.medicineName];
              const isTaken = log?.status === 'taken';
              const isMissed = log?.status === 'missed';
              const isLogged = !!log;

              return (
                <div
                  key={i}
                  className={`p-4 rounded-2xl border transition-all ${
                    isTaken ? "bg-white/5 border-white/15 opacity-75"
                      : isMissed ? "bg-zinc-800/30 border-zinc-700 opacity-60"
                      : "bg-black/30 border-zinc-800 hover:border-zinc-600"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className={`text-sm font-bold ${isTaken ? "text-zinc-400 line-through" : "text-white"}`}>
                          {med.medicineName}
                        </h4>
                        {isLogged && (
                          <span className={`px-2 py-0.5 rounded-lg text-[8px] font-black uppercase ${
                            isTaken ? "bg-white/10 text-white border border-white/20"
                              : "bg-zinc-800 text-zinc-500 border border-zinc-700"
                          }`}>
                            {log.status} {log.time ? `at ${log.time}` : ""}
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-zinc-500 mt-1">
                        {med.dosage} • {med.frequency || "As directed"} • {med.timing || "Any time"}
                      </p>
                      {med.instructions && (
                        <p className="text-[9px] text-zinc-600 mt-1 italic">{med.instructions}</p>
                      )}
                    </div>

                    {/* Action Buttons */}
                    {!isLogged && (
                      <div className="flex gap-2 shrink-0">
                        <button
                          onClick={() => logMedication(med.medicineName, med.dosage, 'taken')}
                          className="p-2.5 bg-white text-black rounded-xl hover:bg-zinc-200 transition-all active:scale-95"
                          title="Mark as taken"
                        >
                          <CheckCircle size={16} />
                        </button>
                        <button
                          onClick={() => logMedication(med.medicineName, med.dosage, 'missed')}
                          className="p-2.5 bg-zinc-800 border border-zinc-700 text-zinc-500 rounded-xl hover:text-white hover:border-zinc-500 transition-all"
                          title="Mark as missed"
                        >
                          <XCircle size={16} />
                        </button>
                      </div>
                    )}

                    {isLogged && (
                      <div className="shrink-0">
                        {isTaken ? (
                          <CheckCircle size={20} className="text-white/40" />
                        ) : (
                          <XCircle size={20} className="text-zinc-600" />
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
