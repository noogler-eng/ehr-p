import { useEffect, useState } from "react";
import axios from "axios";
import { ShieldCheck, ShieldOff, Users, ArrowRight, Clock, Hash, Loader2 } from "lucide-react";

const API_BASE = "http://localhost:8080/api";

interface AccessTx {
  txHash: string;
  blockNumber: number;
  timestamp: string;
  from: string;
  to: string;
  action: string;
  data?: any;
  gasUsed: number;
}

interface Doctor {
  walletAddress: string;
  name: string;
}

interface AccessControlProps {
  account: string;
  userRole: string;
}

export const AccessControl = ({ account, userRole }: AccessControlProps) => {
  const [accessHistory, setAccessHistory] = useState<AccessTx[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [lastTx, setLastTx] = useState<any>(null);

  useEffect(() => {
    fetchAccessHistory();
  }, [account]);

  const fetchAccessHistory = async () => {
    try {
      const { data } = await axios.get(`${API_BASE}/access/history/${account}`);
      setAccessHistory(data.accessHistory);
      setDoctors(data.doctors);
    } catch (err) {
      console.error("Failed to fetch access history:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleGrantAccess = async () => {
    if (!selectedDoctor) return;
    setActionLoading(true);
    try {
      const { data } = await axios.post(`${API_BASE}/access/grant`, {
        patientAddress: account,
        doctorAddress: selectedDoctor,
      });
      setLastTx(data.transaction);
      setSelectedDoctor("");
      fetchAccessHistory();
    } catch (err: any) {
      alert(err.response?.data?.error || "Failed to grant access");
    } finally {
      setActionLoading(false);
    }
  };

  const handleRevokeAccess = async (doctorAddress: string) => {
    if (!confirm("Revoke access from this doctor? This will be recorded on the blockchain.")) return;
    setActionLoading(true);
    try {
      const { data } = await axios.post(`${API_BASE}/access/revoke`, {
        patientAddress: account,
        doctorAddress,
      });
      setLastTx(data.transaction);
      fetchAccessHistory();
    } catch (err: any) {
      alert(err.response?.data?.error || "Failed to revoke access");
    } finally {
      setActionLoading(false);
    }
  };

  // Get currently granted doctors from history
  const grantedDoctors = new Set<string>();
  const revokedDoctors = new Set<string>();
  accessHistory.forEach((tx) => {
    if (tx.action === "GRANT_ACCESS" && tx.data?.grantedTo) {
      if (!revokedDoctors.has(tx.data.grantedTo)) {
        grantedDoctors.add(tx.data.grantedTo);
      }
    }
    if (tx.action === "REVOKE_ACCESS" && tx.data?.revokedFrom) {
      revokedDoctors.add(tx.data.revokedFrom);
      grantedDoctors.delete(tx.data.revokedFrom);
    }
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black italic tracking-tighter text-white uppercase">
            Access <span className="text-zinc-500">Control</span>
          </h1>
          <p className="text-zinc-600 text-xs font-bold mt-1 uppercase tracking-widest">
            Smart Contract Permissions — Blockchain-Secured Access Management
          </p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-3">
          <ShieldCheck size={24} className="text-zinc-500" />
        </div>
      </div>

      {/* Grant Access Panel (Patient/Admin only) */}
      {(userRole === "Patient" || userRole === "Admin") && (
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-[2rem] p-6">
          <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-4">
            Grant Record Access to Doctor
          </h3>
          <div className="flex gap-3">
            <select
              value={selectedDoctor}
              onChange={(e) => setSelectedDoctor(e.target.value)}
              className="flex-1 p-4 bg-black border border-zinc-800 rounded-xl text-white outline-none focus:border-zinc-600 appearance-none text-sm"
            >
              <option value="">Select a Doctor...</option>
              {doctors.map((doc) => (
                <option key={doc.walletAddress} value={doc.walletAddress}>
                  {doc.name} ({doc.walletAddress.slice(0, 8)}...{doc.walletAddress.slice(-4)})
                </option>
              ))}
            </select>
            <button
              onClick={handleGrantAccess}
              disabled={!selectedDoctor || actionLoading}
              className="px-8 bg-white text-black rounded-xl font-black text-xs uppercase tracking-wider hover:bg-zinc-200 transition-all active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {actionLoading ? <Loader2 size={14} className="animate-spin" /> : <ShieldCheck size={14} />}
              Grant Access
            </button>
          </div>

          {/* Last Transaction Confirmation */}
          {lastTx && (
            <div className="mt-4 bg-black/40 border border-zinc-800 rounded-xl p-4">
              <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-2">
                Transaction Confirmed
              </p>
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <p className="text-[10px] font-mono text-zinc-500 truncate">TX: {lastTx.txHash}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[9px] text-zinc-600 font-mono">{lastTx.from?.slice(0, 8)}...</span>
                    <ArrowRight size={10} className="text-zinc-700" />
                    <span className="text-[9px] text-zinc-600 font-mono">{lastTx.to?.slice(0, 8)}...</span>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-lg border text-[8px] font-black uppercase ${
                  lastTx.action === "GRANT_ACCESS"
                    ? "bg-white/10 border-white/20 text-white"
                    : "bg-zinc-800 border-zinc-700 text-zinc-400"
                }`}>
                  {lastTx.action?.replace(/_/g, " ")}
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Active Permissions */}
      <div className="bg-zinc-900/30 border border-zinc-800 rounded-[2rem] p-6">
        <div className="flex items-center gap-2 mb-4">
          <Users size={14} className="text-zinc-600" />
          <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">
            Active Access Permissions
          </h3>
        </div>

        {grantedDoctors.size === 0 ? (
          <div className="py-8 text-center">
            <ShieldOff size={32} className="text-zinc-800 mx-auto mb-2" />
            <p className="text-zinc-600 text-xs font-bold">No active permissions</p>
          </div>
        ) : (
          <div className="space-y-2">
            {Array.from(grantedDoctors).map((addr) => {
              const doc = doctors.find((d) => d.walletAddress === addr);
              return (
                <div
                  key={addr}
                  className="flex items-center justify-between p-4 bg-black/40 border border-zinc-800 rounded-xl hover:border-zinc-600 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                    <div>
                      <p className="text-sm font-bold text-white">{doc?.name || "Unknown Doctor"}</p>
                      <p className="text-[9px] font-mono text-zinc-600">{addr}</p>
                    </div>
                  </div>
                  {(userRole === "Patient" || userRole === "Admin") && (
                    <button
                      onClick={() => handleRevokeAccess(addr)}
                      disabled={actionLoading}
                      className="px-4 py-2 bg-zinc-800 border border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-500 rounded-xl text-[9px] font-black uppercase tracking-wider transition-all flex items-center gap-2"
                    >
                      <ShieldOff size={12} />
                      Revoke
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Access History */}
      <div className="bg-zinc-900/30 border border-zinc-800 rounded-[2rem] overflow-hidden">
        <div className="px-6 py-4 border-b border-zinc-800">
          <h3 className="text-sm font-black text-white uppercase tracking-tight">Access Control Ledger</h3>
          <p className="text-[8px] text-zinc-600 font-bold uppercase tracking-widest mt-0.5">
            Blockchain-verified permission changes
          </p>
        </div>

        {loading ? (
          <div className="p-12 text-center">
            <div className="w-6 h-6 border-2 border-zinc-700 border-t-white rounded-full animate-spin mx-auto mb-3" />
            <p className="text-zinc-600 text-xs font-bold">Loading ledger...</p>
          </div>
        ) : accessHistory.length === 0 ? (
          <div className="p-12 text-center">
            <ShieldCheck size={32} className="text-zinc-800 mx-auto mb-2" />
            <p className="text-zinc-600 text-xs font-bold">No access control transactions yet</p>
          </div>
        ) : (
          <div className="divide-y divide-zinc-800/50">
            {accessHistory.map((tx, i) => (
              <div key={i} className="px-6 py-4 hover:bg-zinc-800/20 transition-all">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-xl ${
                      tx.action === "GRANT_ACCESS" ? "bg-white/10" : "bg-zinc-800"
                    }`}>
                      {tx.action === "GRANT_ACCESS" ? (
                        <ShieldCheck size={16} className="text-white" />
                      ) : (
                        <ShieldOff size={16} className="text-zinc-500" />
                      )}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">
                        {tx.action === "GRANT_ACCESS" ? "Access Granted" : "Access Revoked"}
                      </p>
                      <p className="text-[9px] font-mono text-zinc-600 mt-0.5">{tx.txHash?.slice(0, 30)}...</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 justify-end">
                      <Hash size={10} className="text-zinc-700" />
                      <p className="text-[9px] font-mono text-zinc-500">Block #{tx.blockNumber}</p>
                    </div>
                    <div className="flex items-center gap-1 justify-end mt-1">
                      <Clock size={10} className="text-zinc-700" />
                      <p className="text-[8px] text-zinc-600">{new Date(tx.timestamp).toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
