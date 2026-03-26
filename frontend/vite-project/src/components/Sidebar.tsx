import { LayoutDashboard, Blocks, ShieldCheck, FileCode2, X, ChevronRight, MessageCircle, TrendingUp, CalendarClock, Pill } from "lucide-react";

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  userRole: string;
  isOpen: boolean;
  onClose: () => void;
}

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, description: "Overview & Records", roles: null },
  { id: "chat", label: "Messages", icon: MessageCircle, description: "Doctor-Patient Chat", roles: ["Doctor", "Patient"] },
  { id: "vitals", label: "Vitals Trends", icon: TrendingUp, description: "Health Metrics Chart", roles: ["Doctor", "Patient", "Admin"] },
  { id: "followups", label: "Follow-Ups", icon: CalendarClock, description: "Appointment Schedule", roles: ["Doctor", "Patient"] },
  { id: "medications", label: "Med Tracker", icon: Pill, description: "Medication Adherence", roles: ["Patient"] },
  { id: "blockchain", label: "Blockchain Explorer", icon: Blocks, description: "Transaction Ledger", roles: null },
  { id: "access", label: "Access Control", icon: ShieldCheck, description: "Permissions", roles: null },
  { id: "contract", label: "Smart Contract", icon: FileCode2, description: "EHRRegistry.sol", roles: null },
];

export const Sidebar = ({ currentPage, onNavigate, userRole, isOpen, onClose }: SidebarProps) => {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden" onClick={onClose} />
      )}

      {/* Sidebar */}
      <aside className={`fixed top-[73px] left-0 h-[calc(100vh-73px)] w-64 bg-zinc-950/95 border-r border-zinc-800 backdrop-blur-xl z-40 transition-transform duration-300 ${
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      }`}>
        <div className="flex flex-col h-full p-4">
          {/* Close button (mobile) */}
          <button onClick={onClose} className="lg:hidden absolute top-4 right-4 text-zinc-500 hover:text-white">
            <X size={20} />
          </button>

          {/* Role Badge */}
          <div className="mb-6 px-3 pt-2">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
              <p className="text-[8px] font-black text-zinc-600 uppercase tracking-[0.3em]">Active Role</p>
              <p className="text-sm font-black text-white uppercase tracking-tight mt-1">{userRole}</p>
              <div className="flex items-center gap-1.5 mt-2">
                <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                <span className="text-[8px] text-zinc-500 font-bold uppercase tracking-widest">Node Active</span>
              </div>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 space-y-1.5 px-1">
            <p className="text-[8px] font-black text-zinc-700 uppercase tracking-[0.3em] px-3 mb-3">Navigation</p>
            {navItems.filter((item) => !item.roles || item.roles.includes(userRole)).map((item) => {
              const isActive = currentPage === item.id;
              const Icon = item.icon;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.id);
                    onClose();
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all group ${
                    isActive
                      ? "bg-white text-black"
                      : "text-zinc-500 hover:text-white hover:bg-zinc-900"
                  }`}
                >
                  <Icon size={18} className={isActive ? "text-black" : "text-zinc-600 group-hover:text-white"} />
                  <div className="flex-1 text-left">
                    <p className={`text-xs font-black uppercase tracking-wide ${isActive ? "text-black" : ""}`}>
                      {item.label}
                    </p>
                    <p className={`text-[8px] font-bold mt-0.5 ${isActive ? "text-black/60" : "text-zinc-700"}`}>
                      {item.description}
                    </p>
                  </div>
                  {isActive && <ChevronRight size={14} className="text-black/40" />}
                </button>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="px-3 pb-4">
            <div className="border-t border-zinc-800 pt-4">
              <p className="text-[7px] font-black text-zinc-700 uppercase tracking-[0.3em] text-center">
                Blockchain Node v2.0
              </p>
              <p className="text-[7px] text-zinc-800 text-center mt-1 font-mono">
                Ethereum Mainnet (Simulated)
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
