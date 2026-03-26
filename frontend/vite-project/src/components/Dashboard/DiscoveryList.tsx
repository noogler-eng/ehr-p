import { useState } from "react";
import { Users, ChevronRight, Activity, Search, X } from "lucide-react";

interface DiscoveryItem {
  walletAddress: string;
  profile?: {
    name: string;
    bloodGroup?: string;
    role?: string;
  };
}

interface DiscoveryListProps {
  role: string;
  data: DiscoveryItem[];
  onItemClick: (walletAddress: string) => void;
}

export const DiscoveryList = ({
  role,
  data,
  onItemClick,
}: DiscoveryListProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  const getHeaderInfo = () => {
    switch (role) {
      case "Doctor":
        return { title: "Treated Patients", sub: "Clinical Registry" };
      case "Patient":
        return { title: "My Specialists", sub: "Verified Doctors" };
      case "Pharmacist":
        return { title: "All Patients", sub: "Complete Registry" };
      case "Admin":
        return { title: "All Patients", sub: "System Administrator View" };
      default:
        return { title: "Network", sub: "Connected Nodes" };
    }
  };

  const { title, sub } = getHeaderInfo();

  // Filter data based on search
  const filteredData = data.filter((item) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.profile?.name?.toLowerCase().includes(q) ||
      item.walletAddress.toLowerCase().includes(q) ||
      item.profile?.bloodGroup?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="bg-zinc-900/30 border border-zinc-800 p-6 rounded-[2.5rem] backdrop-blur-sm transition-all hover:bg-zinc-900/40">
      {/* Header */}
      <div className="flex justify-between items-center mb-4 px-2">
        <div>
          <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] flex items-center gap-2">
            <Users size={12} className="text-zinc-600" /> {title}
          </h3>
          <p className="text-[8px] font-bold text-zinc-700 uppercase mt-1 tracking-widest">
            {sub}
          </p>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative mb-4">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by name or address..."
          className="w-full pl-9 pr-8 py-2.5 bg-black/40 border border-zinc-800 rounded-xl text-[10px] text-white placeholder-zinc-700 outline-none focus:border-zinc-600 font-medium"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-white"
          >
            <X size={12} />
          </button>
        )}
      </div>

      {/* List */}
      <div className="space-y-3 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
        {filteredData.length > 0 ? (
          filteredData.map((item, i) => (
            <div
              key={i}
              className="group flex items-center justify-between p-4 bg-black/40 border border-zinc-800/50 rounded-2xl hover:border-zinc-600 hover:bg-zinc-900/50 transition-all cursor-pointer active:scale-[0.98]"
              onClick={() => onItemClick(item.walletAddress)}
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="w-1.5 h-1.5 rounded-full bg-zinc-800 group-hover:bg-white transition-colors"></div>
                <div className="flex flex-col overflow-hidden">
                  <span className="text-xs font-bold text-zinc-200 group-hover:text-white transition-colors truncate">
                    {item.profile?.name || "Anonymous User"}
                  </span>
                  <span className="text-[8px] font-mono text-zinc-600 truncate uppercase mt-0.5 tracking-tighter">
                    {item.walletAddress}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {item.profile?.bloodGroup && (
                  <span className="text-[8px] font-black text-zinc-700 border border-zinc-800 px-1.5 py-0.5 rounded group-hover:border-zinc-600 transition-colors">
                    {item.profile.bloodGroup}
                  </span>
                )}
                <ChevronRight
                  size={14}
                  className="text-zinc-800 group-hover:text-zinc-400 transition-colors translate-x-1 group-hover:translate-x-0"
                />
              </div>
            </div>
          ))
        ) : (
          <div className="py-12 flex flex-col items-center justify-center border border-dashed border-zinc-800 rounded-3xl">
            <Activity size={24} className="text-zinc-800 mb-2 animate-pulse" />
            <p className="text-[10px] text-zinc-700 font-black uppercase tracking-widest">
              {searchQuery ? "No Matches Found" : "No Peer Activity"}
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-zinc-800/50 flex justify-center">
        <span className="text-[8px] font-black text-zinc-700 uppercase tracking-widest">
          {filteredData.length} of {data.length} Nodes
        </span>
      </div>
    </div>
  );
};
