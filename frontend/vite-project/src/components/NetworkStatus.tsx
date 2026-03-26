import { useState, useEffect } from "react";
import { Wifi, Server, Cpu, Fuel, Clock, Blocks, Activity, Globe } from "lucide-react";

/**
 * Fake blockchain network status panel.
 * Generates realistic-looking Ethereum network stats that
 * update periodically to simulate a live blockchain connection.
 */
export const NetworkStatus = () => {
  const [stats, setStats] = useState({
    peers: 47,
    nodes: 12843,
    hashRate: 1.23,
    gasPrice: 23,
    blockTime: 12.1,
    uptime: 99.97,
    latency: 42,
    pendingTx: 184,
  });

  // Simulate fluctuating network stats
  useEffect(() => {
    const interval = setInterval(() => {
      setStats((prev) => ({
        peers: Math.max(20, prev.peers + Math.floor(Math.random() * 5) - 2),
        nodes: Math.max(10000, prev.nodes + Math.floor(Math.random() * 100) - 50),
        hashRate: Math.max(0.5, +(prev.hashRate + (Math.random() * 0.1 - 0.05)).toFixed(2)),
        gasPrice: Math.max(8, Math.floor(prev.gasPrice + Math.random() * 6 - 3)),
        blockTime: Math.max(8, +(prev.blockTime + (Math.random() * 0.4 - 0.2)).toFixed(1)),
        uptime: Math.min(100, +(prev.uptime + (Math.random() * 0.01 - 0.003)).toFixed(2)),
        latency: Math.max(15, Math.floor(prev.latency + Math.random() * 10 - 5)),
        pendingTx: Math.max(50, Math.floor(prev.pendingTx + Math.random() * 40 - 20)),
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-zinc-900/30 border border-zinc-800 rounded-[2rem] p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Globe size={14} className="text-zinc-600" />
          <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">
            Blockchain Network
          </h3>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
          <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">Live</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <NetStat icon={<Wifi size={12} />} label="Connected Peers" value={stats.peers.toString()} />
        <NetStat icon={<Server size={12} />} label="Network Nodes" value={stats.nodes.toLocaleString()} />
        <NetStat icon={<Cpu size={12} />} label="Hash Rate" value={`${stats.hashRate} TH/s`} />
        <NetStat icon={<Fuel size={12} />} label="Gas Price" value={`${stats.gasPrice} Gwei`} />
        <NetStat icon={<Clock size={12} />} label="Block Time" value={`${stats.blockTime}s`} />
        <NetStat icon={<Activity size={12} />} label="Latency" value={`${stats.latency}ms`} />
        <NetStat icon={<Blocks size={12} />} label="Pending Txns" value={stats.pendingTx.toString()} />
        <NetStat icon={<Server size={12} />} label="Uptime" value={`${stats.uptime}%`} />
      </div>

      {/* Network bar */}
      <div className="mt-4 pt-3 border-t border-zinc-800/50">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[7px] font-black text-zinc-700 uppercase tracking-widest">Network Load</span>
          <span className="text-[7px] font-mono text-zinc-600">{Math.round(stats.pendingTx / 3)}%</span>
        </div>
        <div className="h-1 rounded-full bg-zinc-800 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-zinc-600 to-white/60 rounded-full transition-all duration-1000"
            style={{ width: `${Math.min(Math.round(stats.pendingTx / 3), 100)}%` }}
          />
        </div>
      </div>

      <p className="text-[7px] text-zinc-800 text-center mt-3 font-mono uppercase">
        Ethereum Mainnet — Chain ID: 1
      </p>
    </div>
  );
};

const NetStat = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
  <div className="bg-black/30 border border-zinc-800/50 rounded-xl p-2.5">
    <div className="flex items-center gap-1.5 mb-1">
      <span className="text-zinc-700">{icon}</span>
      <span className="text-[7px] font-black text-zinc-700 uppercase tracking-widest">{label}</span>
    </div>
    <p className="text-[11px] font-bold text-zinc-300 font-mono">{value}</p>
  </div>
);
