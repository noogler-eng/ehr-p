import { useEffect, useState } from "react";
import axios from "axios";
import { Blocks, Search, ChevronLeft, ChevronRight, Hash, Fuel, Clock, ArrowRight, Shield, Copy, Check } from "lucide-react";

const API_BASE = "http://localhost:8080/api";

interface Transaction {
  txHash: string;
  blockNumber: number;
  timestamp: string;
  from: string;
  to: string;
  action: string;
  gasUsed: number;
  status: string;
  data?: any;
}

interface ExplorerStats {
  totalTransactions: number;
  latestBlockNumber: number;
  totalGasUsed: number;
  avgGasUsed: number;
  actionBreakdown: Record<string, number>;
}

export const BlockchainExplorer = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [stats, setStats] = useState<ExplorerStats | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState<any>(null);
  const [searchType, setSearchType] = useState("");
  const [copiedHash, setCopiedHash] = useState("");
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);

  useEffect(() => {
    fetchExplorerData();
  }, [page]);

  const fetchExplorerData = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API_BASE}/blockchain/explorer?page=${page}&limit=15`);
      setTransactions(data.transactions);
      setStats(data.stats);
      setTotalPages(data.pagination.totalPages);
    } catch (err) {
      console.error("Failed to fetch explorer data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    try {
      const { data } = await axios.get(`${API_BASE}/blockchain/search/${searchQuery.trim()}`);
      setSearchResult(data.result);
      setSearchType(data.type);
    } catch {
      setSearchResult(null);
      setSearchType("not_found");
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedHash(text);
    setTimeout(() => setCopiedHash(""), 2000);
  };

  const getActionBadge = (action: string) => {
    const styles: Record<string, string> = {
      CREATE_RECORD: "bg-white/10 border-white/20 text-white",
      UPDATE_RECORD: "bg-zinc-700/50 border-zinc-600 text-zinc-300",
      GRANT_ACCESS: "bg-zinc-800 border-zinc-700 text-zinc-400",
      REVOKE_ACCESS: "bg-zinc-900 border-zinc-800 text-zinc-500",
    };
    return styles[action] || "bg-zinc-900 border-zinc-800 text-zinc-500";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black italic tracking-tighter text-white uppercase">
            Blockchain <span className="text-zinc-500">Explorer</span>
          </h1>
          <p className="text-zinc-600 text-xs font-bold mt-1 uppercase tracking-widest">
            Ethereum Mainnet Ledger — Immutable Transaction History
          </p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-3">
          <Blocks size={24} className="text-zinc-500" />
        </div>
      </div>

      {/* Stats Row */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatBox icon={<Blocks size={14} />} label="Total Blocks" value={`#${stats.latestBlockNumber}`} />
          <StatBox icon={<Hash size={14} />} label="Total Transactions" value={stats.totalTransactions.toString()} />
          <StatBox icon={<Fuel size={14} />} label="Total Gas Used" value={stats.totalGasUsed.toLocaleString()} />
          <StatBox icon={<Fuel size={14} />} label="Avg Gas / Tx" value={stats.avgGasUsed.toLocaleString()} />
        </div>
      )}

      {/* Action Breakdown */}
      {stats?.actionBreakdown && (
        <div className="bg-zinc-900/30 border border-zinc-800 rounded-2xl p-5">
          <p className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-3">
            Transaction Type Breakdown
          </p>
          <div className="flex flex-wrap gap-3">
            {Object.entries(stats.actionBreakdown).map(([action, count]) => (
              <div key={action} className={`px-4 py-2 rounded-xl border ${getActionBadge(action)}`}>
                <span className="text-[9px] font-black uppercase tracking-wider">
                  {action.replace(/_/g, " ")} — {count}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Search Bar */}
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-4">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Search by Tx Hash, Block Number, or Wallet Address..."
              className="w-full pl-11 pr-4 py-3.5 bg-black border border-zinc-800 rounded-xl text-sm text-white placeholder-zinc-700 outline-none focus:border-zinc-600 font-mono"
            />
          </div>
          <button
            onClick={handleSearch}
            className="px-6 bg-white text-black rounded-xl font-black text-xs uppercase tracking-wider hover:bg-zinc-200 transition-all active:scale-95"
          >
            Search
          </button>
        </div>

        {/* Search Results */}
        {searchType === "not_found" && (
          <p className="text-zinc-600 text-xs mt-3 px-2">No results found for this query.</p>
        )}
        {searchResult && searchType === "transaction" && (
          <div className="mt-4 bg-black/40 border border-zinc-800 rounded-xl p-4">
            <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-2">Transaction Found</p>
            <TxRow tx={searchResult} onCopy={copyToClipboard} copiedHash={copiedHash} onSelect={setSelectedTx} />
          </div>
        )}
        {searchResult && searchType === "block" && (
          <div className="mt-4 bg-black/40 border border-zinc-800 rounded-xl p-4">
            <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-2">
              Block Transactions ({searchResult.length})
            </p>
            <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar">
              {searchResult.map((tx: Transaction) => (
                <TxRow key={tx.txHash} tx={tx} onCopy={copyToClipboard} copiedHash={copiedHash} onSelect={setSelectedTx} />
              ))}
            </div>
          </div>
        )}
        {searchResult && searchType === "wallet" && (
          <div className="mt-4 bg-black/40 border border-zinc-800 rounded-xl p-4">
            <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-2">
              Wallet Transactions ({searchResult.length})
            </p>
            <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar">
              {searchResult.map((tx: Transaction) => (
                <TxRow key={tx.txHash} tx={tx} onCopy={copyToClipboard} copiedHash={copiedHash} onSelect={setSelectedTx} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Transaction Detail Modal */}
      {selectedTx && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-6" onClick={() => setSelectedTx(null)}>
          <div className="bg-zinc-900 border border-zinc-800 rounded-[2rem] p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto custom-scrollbar" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-black text-white uppercase tracking-tight">Transaction Details</h3>
              <button onClick={() => setSelectedTx(null)} className="text-zinc-500 hover:text-white transition-colors text-sm font-black">CLOSE</button>
            </div>
            <div className="space-y-4">
              <DetailRow label="Transaction Hash" value={selectedTx.txHash} mono />
              <DetailRow label="Block Number" value={`#${selectedTx.blockNumber}`} />
              <DetailRow label="Timestamp" value={new Date(selectedTx.timestamp).toLocaleString()} />
              <DetailRow label="From" value={selectedTx.from} mono />
              <DetailRow label="To (Contract)" value={selectedTx.to} mono />
              <DetailRow label="Action" value={selectedTx.action.replace(/_/g, " ")} />
              <DetailRow label="Gas Used" value={`${selectedTx.gasUsed.toLocaleString()} wei`} />
              <DetailRow label="Status" value={selectedTx.status.toUpperCase()} />
              {selectedTx.data && (
                <div>
                  <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-1">Transaction Data</p>
                  <pre className="bg-black/40 border border-zinc-800 rounded-xl p-4 text-[10px] font-mono text-zinc-400 overflow-x-auto">
                    {JSON.stringify(selectedTx.data, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Transactions Table */}
      <div className="bg-zinc-900/30 border border-zinc-800 rounded-[2rem] overflow-hidden">
        <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-black text-white uppercase tracking-tight">Latest Transactions</h3>
            <p className="text-[8px] text-zinc-600 font-bold uppercase tracking-widest mt-0.5">Immutable Ledger Records</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page <= 1}
              className="p-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-500 hover:text-white disabled:opacity-30 transition-all"
            >
              <ChevronLeft size={14} />
            </button>
            <span className="text-[10px] font-black text-zinc-500 px-2">
              {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page >= totalPages}
              className="p-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-500 hover:text-white disabled:opacity-30 transition-all"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center">
            <div className="w-6 h-6 border-2 border-zinc-700 border-t-white rounded-full animate-spin mx-auto mb-3" />
            <p className="text-zinc-600 text-xs font-bold">Syncing blocks...</p>
          </div>
        ) : (
          <div className="divide-y divide-zinc-800/50">
            {transactions.map((tx) => (
              <TxRow key={tx.txHash} tx={tx} onCopy={copyToClipboard} copiedHash={copiedHash} onSelect={setSelectedTx} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Sub-components

const StatBox = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
  <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-4 hover:border-zinc-600 transition-all">
    <div className="flex items-center gap-2 mb-1.5">
      <span className="text-zinc-600">{icon}</span>
      <p className="text-[8px] font-black text-zinc-600 uppercase tracking-[0.2em]">{label}</p>
    </div>
    <p className="text-lg font-black text-white tracking-tighter">{value}</p>
  </div>
);

const TxRow = ({ tx, onCopy, copiedHash, onSelect }: { tx: Transaction; onCopy: (s: string) => void; copiedHash: string; onSelect: (tx: Transaction) => void }) => (
  <div
    className="px-6 py-4 hover:bg-zinc-800/30 transition-all cursor-pointer flex items-center gap-4"
    onClick={() => onSelect(tx)}
  >
    {/* Block Number */}
    <div className="w-16 shrink-0">
      <p className="text-[8px] font-black text-zinc-600 uppercase">Block</p>
      <p className="text-xs font-bold text-white font-mono">#{tx.blockNumber}</p>
    </div>

    {/* Tx Hash */}
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2">
        <p className="text-xs font-mono text-zinc-400 truncate">{tx.txHash}</p>
        <button
          onClick={(e) => { e.stopPropagation(); onCopy(tx.txHash); }}
          className="shrink-0 text-zinc-700 hover:text-white transition-colors"
        >
          {copiedHash === tx.txHash ? <Check size={12} /> : <Copy size={12} />}
        </button>
      </div>
      <div className="flex items-center gap-2 mt-1">
        <span className="text-[8px] font-mono text-zinc-600 truncate">{tx.from?.slice(0, 10)}...</span>
        <ArrowRight size={10} className="text-zinc-700 shrink-0" />
        <span className="text-[8px] font-mono text-zinc-600 truncate">{tx.to?.slice(0, 10)}...</span>
      </div>
    </div>

    {/* Action Badge */}
    <div className={`px-3 py-1 rounded-lg border text-[8px] font-black uppercase tracking-wider shrink-0 ${
      tx.action === "CREATE_RECORD" ? "bg-white/10 border-white/20 text-white"
        : tx.action === "GRANT_ACCESS" ? "bg-zinc-800 border-zinc-600 text-zinc-300"
        : tx.action === "REVOKE_ACCESS" ? "bg-zinc-900 border-zinc-800 text-zinc-500"
        : "bg-zinc-700/30 border-zinc-700 text-zinc-400"
    }`}>
      {tx.action.replace(/_/g, " ")}
    </div>

    {/* Gas & Time */}
    <div className="text-right shrink-0 w-24">
      <div className="flex items-center gap-1 justify-end">
        <Fuel size={10} className="text-zinc-700" />
        <p className="text-[9px] font-mono text-zinc-500">{tx.gasUsed?.toLocaleString()}</p>
      </div>
      <div className="flex items-center gap-1 justify-end mt-1">
        <Clock size={10} className="text-zinc-700" />
        <p className="text-[8px] text-zinc-600">{new Date(tx.timestamp).toLocaleDateString()}</p>
      </div>
    </div>
  </div>
);

const DetailRow = ({ label, value, mono }: { label: string; value: string; mono?: boolean }) => (
  <div>
    <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-1">{label}</p>
    <p className={`text-sm text-zinc-300 break-all ${mono ? "font-mono text-xs" : "font-semibold"}`}>{value}</p>
  </div>
);
