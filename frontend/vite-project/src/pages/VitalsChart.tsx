import { useEffect, useState } from "react";
import axios from "axios";
import { Activity, TrendingUp, Heart, Droplets, Zap, Database } from "lucide-react";

const API_BASE = "http://localhost:8080/api";

interface VitalsChartProps {
  patientAddress: string;
  userRole: string;
}

interface VitalsEntry {
  date: string;
  vitals: {
    systolicBP: number;
    diastolicBP: number;
    heartRate: number;
    cholesterol: number;
    sugarLevel: number;
  };
}

type VitalKey = "systolicBP" | "heartRate" | "cholesterol" | "sugarLevel";

export const VitalsChart = ({ patientAddress, userRole }: VitalsChartProps) => {
  const [history, setHistory] = useState<VitalsEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [activeMetric, setActiveMetric] = useState<VitalKey>("systolicBP");

  useEffect(() => {
    if (patientAddress) fetchVitals();
  }, [patientAddress]);

  const fetchVitals = async () => {
    try {
      const { data } = await axios.get(`${API_BASE}/vitals/history/${patientAddress}`);
      setHistory(data.history);
    } catch (err) {
      console.error("Failed to fetch vitals:", err);
    } finally {
      setLoading(false);
    }
  };

  const metrics: { key: VitalKey; label: string; unit: string; icon: React.ReactNode; normalRange: string; color: string }[] = [
    { key: "systolicBP", label: "Blood Pressure", unit: "mmHg", icon: <Activity size={14} />, normalRange: "90-120", color: "white" },
    { key: "heartRate", label: "Heart Rate", unit: "bpm", icon: <Heart size={14} />, normalRange: "60-100", color: "zinc-300" },
    { key: "cholesterol", label: "Cholesterol", unit: "mg/dL", icon: <Droplets size={14} />, normalRange: "< 200", color: "zinc-400" },
    { key: "sugarLevel", label: "Blood Sugar", unit: "mg/dL", icon: <Zap size={14} />, normalRange: "70-100", color: "zinc-500" },
  ];

  const activeMetricInfo = metrics.find((m) => m.key === activeMetric)!;
  const values = history.map((h) => h.vitals[activeMetric] || 0);
  const maxVal = Math.max(...values, 1);
  const minVal = Math.min(...values, 0);
  const range = maxVal - minVal || 1;

  // Current values (latest entry)
  const latest = history.length > 0 ? history[history.length - 1].vitals : null;

  const seedDemoData = async () => {
    if (!patientAddress) return;
    setSeeding(true);
    try {
      await axios.post(`${API_BASE}/vitals/seed-demo/${patientAddress}`);
      await fetchVitals();
    } catch (err) {
      console.error("Failed to seed demo data:", err);
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black italic tracking-tighter text-white uppercase">
            Vitals <span className="text-zinc-500">Trends</span>
          </h1>
          <p className="text-zinc-600 text-xs font-bold mt-1 uppercase tracking-widest">
            Patient Health Metrics Over Time
          </p>
        </div>
        <div className="flex items-center gap-3">
          {patientAddress && history.length < 8 && (
            <button
              onClick={seedDemoData}
              disabled={seeding}
              className="px-4 py-2.5 bg-zinc-800 border border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-500 rounded-xl font-black text-[9px] uppercase tracking-wider transition-all flex items-center gap-2 disabled:opacity-50"
            >
              <Database size={14} />
              {seeding ? "Generating..." : "Load Demo Data"}
            </button>
          )}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-3">
            <TrendingUp size={24} className="text-zinc-500" />
          </div>
        </div>
      </div>

      {!patientAddress ? (
        <div className="text-center py-20">
          <TrendingUp size={48} className="text-zinc-800 mx-auto mb-4" />
          <p className="text-zinc-500 text-sm font-bold">Select a patient to view vitals trends</p>
          <p className="text-zinc-700 text-xs mt-1">Go to Dashboard and click on a patient from the list</p>
        </div>
      ) : loading ? (
        <div className="text-center py-20">
          <div className="w-6 h-6 border-2 border-zinc-700 border-t-white rounded-full animate-spin mx-auto" />
        </div>
      ) : (
        <>
          {/* Current Vitals Cards */}
          {latest && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {metrics.map((m) => (
                <button
                  key={m.key}
                  onClick={() => setActiveMetric(m.key)}
                  className={`p-4 rounded-2xl border transition-all text-left ${
                    activeMetric === m.key
                      ? "bg-white/5 border-white/20 animate-glow"
                      : "bg-zinc-900/50 border-zinc-800 hover:border-zinc-600"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className={activeMetric === m.key ? "text-white" : "text-zinc-600"}>{m.icon}</span>
                    <p className="text-[8px] font-black text-zinc-500 uppercase tracking-[0.15em]">{m.label}</p>
                  </div>
                  <p className={`text-xl font-black tracking-tighter ${activeMetric === m.key ? "text-white" : "text-zinc-400"}`}>
                    {latest[m.key] || "—"}
                    <span className="text-[9px] font-bold text-zinc-600 ml-1">{m.unit}</span>
                  </p>
                  <p className="text-[8px] text-zinc-700 mt-1">Normal: {m.normalRange}</p>
                </button>
              ))}
            </div>
          )}

          {/* Chart */}
          <div className="bg-zinc-900/30 border border-zinc-800 rounded-[2rem] p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                {activeMetricInfo.icon}
                <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                  {activeMetricInfo.label} Trend
                </span>
              </div>
              <span className="text-[9px] font-mono text-zinc-600">{history.length} data points</span>
            </div>

            {history.length < 2 ? (
              <div className="text-center py-16">
                <Activity size={32} className="text-zinc-800 mx-auto mb-3" />
                <p className="text-zinc-600 text-xs font-bold">Not enough data for chart</p>
                <p className="text-zinc-700 text-[10px] mt-1 mb-4">Vitals will be charted as more records are added</p>
                <button
                  onClick={seedDemoData}
                  disabled={seeding}
                  className="px-6 py-3 bg-white text-black rounded-xl font-black text-xs uppercase tracking-wider hover:bg-zinc-200 transition-all active:scale-95 disabled:opacity-50 inline-flex items-center gap-2"
                >
                  <Database size={14} />
                  {seeding ? "Generating 12 Months of Data..." : "Generate Demo Vitals (12 Months)"}
                </button>
              </div>
            ) : (
              <div className="relative h-64">
                {/* Y-axis labels */}
                <div className="absolute left-0 top-0 bottom-6 w-12 flex flex-col justify-between">
                  <span className="text-[8px] font-mono text-zinc-600">{Math.round(maxVal)}</span>
                  <span className="text-[8px] font-mono text-zinc-600">{Math.round((maxVal + minVal) / 2)}</span>
                  <span className="text-[8px] font-mono text-zinc-600">{Math.round(minVal)}</span>
                </div>

                {/* Chart area */}
                <div className="ml-14 h-full flex items-end gap-1">
                  {history.map((entry, i) => {
                    const val = entry.vitals[activeMetric] || 0;
                    const height = ((val - minVal) / range) * 100;

                    return (
                      <div key={i} className="flex-1 flex flex-col items-center group relative" style={{ minWidth: 0 }}>
                        {/* Tooltip */}
                        <div className="absolute -top-10 bg-zinc-800 border border-zinc-700 px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity z-10 whitespace-nowrap pointer-events-none">
                          <p className="text-[9px] font-bold text-white">{val} {activeMetricInfo.unit}</p>
                          <p className="text-[7px] text-zinc-500">{new Date(entry.date).toLocaleDateString()}</p>
                        </div>

                        {/* Bar */}
                        <div className="w-full flex justify-center" style={{ height: `${Math.max(height, 3)}%` }}>
                          <div
                            className={`w-full max-w-8 rounded-t-lg transition-all group-hover:opacity-100 ${
                              i === history.length - 1
                                ? "bg-white opacity-100"
                                : "bg-zinc-600 opacity-60 group-hover:bg-zinc-400"
                            }`}
                          />
                        </div>

                        {/* X label */}
                        <p className="text-[7px] text-zinc-700 mt-1.5 truncate w-full text-center font-mono">
                          {new Date(entry.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Data Table */}
          {history.length > 0 && (
            <div className="bg-zinc-900/30 border border-zinc-800 rounded-[2rem] overflow-hidden">
              <div className="px-6 py-4 border-b border-zinc-800">
                <h3 className="text-sm font-black text-white uppercase tracking-tight">Vitals Log</h3>
              </div>
              <div className="divide-y divide-zinc-800/50 max-h-60 overflow-y-auto custom-scrollbar">
                {[...history].reverse().map((entry, i) => (
                  <div key={i} className="px-6 py-3 flex items-center gap-6 text-[10px]">
                    <span className="text-zinc-600 font-mono w-24 shrink-0">
                      {new Date(entry.date).toLocaleDateString()}
                    </span>
                    <span className="text-zinc-400 font-bold">BP: {entry.vitals.systolicBP}/{entry.vitals.diastolicBP}</span>
                    <span className="text-zinc-400">HR: {entry.vitals.heartRate}</span>
                    <span className="text-zinc-400">Chol: {entry.vitals.cholesterol}</span>
                    <span className="text-zinc-400">Sugar: {entry.vitals.sugarLevel}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
