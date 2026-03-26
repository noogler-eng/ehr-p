import { useEffect, useState } from "react";
import axios from "axios";
import { Users, FileText, Blocks, Activity, TrendingUp, Shield } from "lucide-react";

const API_BASE = "http://localhost:8080/api";

interface Stats {
  totalPatients: number;
  totalDoctors: number;
  totalRecords: number;
  totalTransactions: number;
  aiAnalyses: number;
  latestBlockNumber: number;
  riskDistribution: { high: number; medium: number; low: number };
}

export const DashboardStats = ({ userRole }: { userRole: string }) => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await axios.get(`${API_BASE}/dashboard/stats`);
        setStats(data.stats);
      } catch (err) {
        console.error("Failed to fetch stats:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-5 animate-pulse">
            <div className="h-3 bg-zinc-800 rounded w-16 mb-3" />
            <div className="h-6 bg-zinc-800 rounded w-10" />
          </div>
        ))}
      </div>
    );
  }

  if (!stats) return null;

  const statCards = [
    { label: "Patients", value: stats.totalPatients, icon: Users, highlight: false },
    { label: "Doctors", value: stats.totalDoctors, icon: Activity, highlight: false },
    { label: "Records", value: stats.totalRecords, icon: FileText, highlight: false },
    { label: "Blockchain Txns", value: stats.totalTransactions, icon: Blocks, highlight: true },
    { label: "AI Analyses", value: stats.aiAnalyses, icon: TrendingUp, highlight: false },
    { label: "Latest Block", value: `#${stats.latestBlockNumber}`, icon: Shield, highlight: true },
  ];

  return (
    <div className="space-y-4 mb-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {statCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div
              key={i}
              className={`border rounded-2xl p-4 transition-all hover:border-zinc-600 ${
                card.highlight
                  ? "bg-white/5 border-white/10"
                  : "bg-zinc-900/50 border-zinc-800"
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <Icon size={14} className={card.highlight ? "text-white/60" : "text-zinc-600"} />
                <p className="text-[8px] font-black text-zinc-500 uppercase tracking-[0.2em]">{card.label}</p>
              </div>
              <p className={`text-xl font-black tracking-tighter ${card.highlight ? "text-white" : "text-zinc-300"}`}>
                {card.value}
              </p>
            </div>
          );
        })}
      </div>

      {/* Risk Distribution (only for Doctor/Admin) */}
      {(userRole === "Doctor" || userRole === "Admin") && (
        <div className="bg-zinc-900/30 border border-zinc-800 rounded-2xl p-5">
          <p className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-3">
            AI Risk Distribution Across All Patients
          </p>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 h-4 rounded-full overflow-hidden bg-zinc-800">
                {stats.riskDistribution.high > 0 && (
                  <div
                    className="h-full bg-white/80 rounded-l-full"
                    style={{ width: `${(stats.riskDistribution.high / stats.totalRecords) * 100}%` }}
                  />
                )}
                {stats.riskDistribution.medium > 0 && (
                  <div
                    className="h-full bg-zinc-500"
                    style={{ width: `${(stats.riskDistribution.medium / stats.totalRecords) * 100}%` }}
                  />
                )}
                {stats.riskDistribution.low > 0 && (
                  <div
                    className="h-full bg-zinc-700"
                    style={{ width: `${(stats.riskDistribution.low / stats.totalRecords) * 100}%` }}
                  />
                )}
              </div>
            </div>
            <div className="flex gap-4 text-[9px] font-bold">
              <span className="text-white">High: {stats.riskDistribution.high}</span>
              <span className="text-zinc-400">Med: {stats.riskDistribution.medium}</span>
              <span className="text-zinc-600">Low: {stats.riskDistribution.low}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
