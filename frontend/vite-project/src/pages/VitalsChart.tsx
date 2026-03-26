import { useEffect, useState } from "react";
import axios from "axios";
import { Activity, TrendingUp, Heart, Droplets, Zap, Database } from "lucide-react";
import { AddressSelector } from "../components/AddressSelector";

const API_BASE = "http://localhost:8080/api";

interface VitalsChartProps {
  patientAddress: string;
  userRole: string;
  currentUserAddress: string;
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

export const VitalsChart = ({ patientAddress: initialAddress, userRole, currentUserAddress }: VitalsChartProps) => {
  const [patientAddress, setPatientAddress] = useState(initialAddress || "");
  const [history, setHistory] = useState<VitalsEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [activeMetric, setActiveMetric] = useState<VitalKey>("systolicBP");

  // Update when prop changes
  useEffect(() => {
    if (initialAddress) setPatientAddress(initialAddress);
  }, [initialAddress]);

  useEffect(() => {
    if (patientAddress) fetchVitals();
  }, [patientAddress]);

  const fetchVitals = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API_BASE}/vitals/history/${patientAddress}`);
      setHistory(data.history || []);
    } catch (err) {
      console.error("Failed to fetch vitals:", err);
    } finally {
      setLoading(false);
    }
  };

  const seedDemoData = async () => {
    if (!patientAddress) return;
    setSeeding(true);
    try {
      await axios.post(`${API_BASE}/vitals/seed-demo/${patientAddress}`);
      await fetchVitals();
    } catch (err) {
      console.error("Failed to seed:", err);
    } finally {
      setSeeding(false);
    }
  };

  const metrics: { key: VitalKey; label: string; unit: string; icon: React.ReactNode; normalRange: string }[] = [
    { key: "systolicBP", label: "Blood Pressure", unit: "mmHg", icon: <Activity size={14} />, normalRange: "90-120" },
    { key: "heartRate", label: "Heart Rate", unit: "bpm", icon: <Heart size={14} />, normalRange: "60-100" },
    { key: "cholesterol", label: "Cholesterol", unit: "mg/dL", icon: <Droplets size={14} />, normalRange: "< 200" },
    { key: "sugarLevel", label: "Blood Sugar", unit: "mg/dL", icon: <Zap size={14} />, normalRange: "70-100" },
  ];

  const activeMetricInfo = metrics.find((m) => m.key === activeMetric)!;
  const values = history.map((h) => h.vitals?.[activeMetric] || 0).filter(v => v > 0);
  const dataMax = values.length > 0 ? Math.max(...values) : 200;
  const dataMin = values.length > 0 ? Math.min(...values) : 60;
  const padding = Math.max((dataMax - dataMin) * 0.15, 10);
  const chartMax = dataMax + padding;
  const chartMin = Math.max(dataMin - padding, 0);
  const chartRange = chartMax - chartMin || 1;

  const latest = history.length > 0 ? history[history.length - 1].vitals : null;

  // SVG chart dimensions
  const W = 700;
  const H = 250;
  const PL = 50; // padding left
  const PR = 20;
  const PT = 20;
  const PB = 35;
  const chartW = W - PL - PR;
  const chartH = H - PT - PB;

  const getX = (i: number) => PL + (history.length > 1 ? (i / (history.length - 1)) * chartW : chartW / 2);
  const getY = (val: number) => PT + chartH - ((val - chartMin) / chartRange) * chartH;

  // Build SVG line path
  const linePath = history
    .map((entry, i) => {
      const val = entry.vitals?.[activeMetric] || 0;
      const x = getX(i);
      const y = getY(val);
      return `${i === 0 ? "M" : "L"} ${x} ${y}`;
    })
    .join(" ");

  // Build area path (for gradient fill under line)
  const areaPath = linePath + ` L ${getX(history.length - 1)} ${PT + chartH} L ${getX(0)} ${PT + chartH} Z`;

  return (
    <div className="space-y-6">
      {/* Header */}
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
          {patientAddress && (
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

      {/* Patient Selector (for Doctor/Admin if no patient pre-selected) */}
      {(userRole === "Doctor" || userRole === "Admin") && (
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-4">
          <AddressSelector
            type="patient"
            currentUserAddress={currentUserAddress}
            currentUserRole={userRole}
            value={patientAddress}
            onChange={setPatientAddress}
            label="Select Patient to View Vitals"
          />
        </div>
      )}

      {!patientAddress ? (
        <div className="text-center py-20">
          <TrendingUp size={48} className="text-zinc-800 mx-auto mb-4" />
          <p className="text-zinc-500 text-sm font-bold">Select a patient to view vitals trends</p>
        </div>
      ) : loading ? (
        <div className="text-center py-20">
          <div className="w-6 h-6 border-2 border-zinc-700 border-t-white rounded-full animate-spin mx-auto" />
        </div>
      ) : (
        <>
          {/* Metric Selector Cards */}
          {latest && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {metrics.map((m) => (
                <button
                  key={m.key}
                  onClick={() => setActiveMetric(m.key)}
                  className={`p-4 rounded-2xl border transition-all text-left ${
                    activeMetric === m.key
                      ? "bg-white/5 border-white/20"
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

          {/* SVG Line Chart */}
          <div className="bg-zinc-900/30 border border-zinc-800 rounded-[2rem] p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                {activeMetricInfo.icon}
                <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                  {activeMetricInfo.label} Trend
                </span>
              </div>
              <span className="text-[9px] font-mono text-zinc-600">{history.length} data points</span>
            </div>

            {history.length === 0 ? (
              <div className="text-center py-16">
                <Activity size={32} className="text-zinc-800 mx-auto mb-3" />
                <p className="text-zinc-600 text-xs font-bold">No vitals data yet</p>
                <p className="text-zinc-700 text-[10px] mt-1 mb-4">Click the button below to generate sample data</p>
                <button
                  onClick={seedDemoData}
                  disabled={seeding}
                  className="px-6 py-3 bg-white text-black rounded-xl font-black text-xs uppercase tracking-wider hover:bg-zinc-200 transition-all active:scale-95 disabled:opacity-50 inline-flex items-center gap-2"
                >
                  <Database size={14} />
                  {seeding ? "Generating..." : "Generate Demo Vitals (12 Months)"}
                </button>
              </div>
            ) : (
              <div className="w-full overflow-x-auto">
                <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-64" preserveAspectRatio="xMidYMid meet">
                  {/* Gradient for area fill */}
                  <defs>
                    <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="white" stopOpacity="0.15" />
                      <stop offset="100%" stopColor="white" stopOpacity="0" />
                    </linearGradient>
                  </defs>

                  {/* Horizontal grid lines */}
                  {[0, 0.25, 0.5, 0.75, 1].map((frac) => {
                    const y = PT + chartH * frac;
                    const val = Math.round(chartMax - frac * chartRange);
                    return (
                      <g key={frac}>
                        <line x1={PL} y1={y} x2={W - PR} y2={y} stroke="#27272a" strokeWidth="1" />
                        <text x={PL - 8} y={y + 3} textAnchor="end" fill="#52525b" fontSize="9" fontFamily="monospace">
                          {val}
                        </text>
                      </g>
                    );
                  })}

                  {/* Area fill */}
                  {history.length > 1 && (
                    <path d={areaPath} fill="url(#areaGrad)" />
                  )}

                  {/* Line */}
                  {history.length > 1 && (
                    <path d={linePath} fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  )}

                  {/* Data points + labels */}
                  {history.map((entry, i) => {
                    const val = entry.vitals?.[activeMetric] || 0;
                    const x = getX(i);
                    const y = getY(val);
                    const dateLabel = new Date(entry.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
                    return (
                      <g key={i}>
                        {/* Dot */}
                        <circle cx={x} cy={y} r="5" fill="#050505" stroke="white" strokeWidth="2" />
                        {/* Value label on hover area */}
                        <circle cx={x} cy={y} r="16" fill="transparent" className="cursor-pointer">
                          <title>{`${val} ${activeMetricInfo.unit} — ${dateLabel}`}</title>
                        </circle>
                        {/* Value above dot (show for first, last, and every 3rd) */}
                        {(i === 0 || i === history.length - 1 || i % 3 === 0) && (
                          <text x={x} y={y - 12} textAnchor="middle" fill="#a1a1aa" fontSize="9" fontWeight="bold" fontFamily="monospace">
                            {val}
                          </text>
                        )}
                        {/* X-axis date label */}
                        {(history.length <= 6 || i % Math.ceil(history.length / 6) === 0 || i === history.length - 1) && (
                          <text x={x} y={H - 5} textAnchor="middle" fill="#3f3f46" fontSize="8" fontFamily="monospace">
                            {dateLabel}
                          </text>
                        )}
                      </g>
                    );
                  })}
                </svg>
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
                    <span className="text-zinc-400 font-bold">BP: {entry.vitals?.systolicBP}/{entry.vitals?.diastolicBP}</span>
                    <span className="text-zinc-400">HR: {entry.vitals?.heartRate}</span>
                    <span className="text-zinc-400">Chol: {entry.vitals?.cholesterol}</span>
                    <span className="text-zinc-400">Sugar: {entry.vitals?.sugarLevel}</span>
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
