/**
 * Navbar Component - Application Navigation Bar
 * Fixed header with brand identity, wallet connection, and user profile.
 */

import { Shield, User as UserIcon, Loader2, LogOut, Menu } from "lucide-react";

interface NavbarProps {
  account: string;
  user: any;
  onConnect: () => void;
  authLoading: boolean;
  onMenuToggle?: () => void;
  showMenu?: boolean;
}

export const Navbar = ({ account, user, onConnect, authLoading, onMenuToggle, showMenu }: NavbarProps) => {

  const handleLogout = () => {
    localStorage.removeItem("userAddress");
    window.location.reload();
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-md border-b border-zinc-800 px-8 py-4 flex justify-between items-center text-white">

      {/* Left Side: Menu + Brand */}
      <div className="flex items-center gap-3">
        {/* Sidebar toggle (mobile + when logged in) */}
        {showMenu && onMenuToggle && (
          <button
            onClick={onMenuToggle}
            className="lg:hidden p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all"
          >
            <Menu size={18} />
          </button>
        )}

        {/* Brand */}
        <div className="flex items-center gap-2 font-black text-xl tracking-tighter">
          <Shield className="text-white fill-white/10" size={28} />
          <div className="flex flex-col leading-none">
            <span>
              SECURE<span className="text-zinc-500">EHR</span>
            </span>
            <span className="text-[8px] tracking-[0.3em] text-zinc-600 font-bold uppercase">
              Blockchain Node v2.0
            </span>
          </div>
        </div>
      </div>

      {/* Right Side: Auth */}
      <div className="flex items-center gap-4">
        {!account ? (
          <button
            onClick={onConnect}
            disabled={authLoading}
            className="bg-white text-black px-6 py-2.5 rounded-full font-bold hover:bg-zinc-200 transition-all active:scale-95 shadow-lg shadow-white/5 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {authLoading ? (
              <span className="flex items-center gap-2">
                <Loader2 size={16} className="animate-spin" />
                Connecting...
              </span>
            ) : (
              "Connect Wallet"
            )}
          </button>
        ) : (
          <div className="flex items-center gap-3">
            {/* User Profile Capsule */}
            <div className="flex items-center gap-3 bg-zinc-900/50 p-1.5 pr-4 rounded-2xl border border-zinc-800 transition-all hover:border-zinc-700">
              <div className="bg-zinc-800 p-2 rounded-xl text-zinc-400">
                {authLoading ? (
                  <Loader2 size={18} className="animate-spin text-white" />
                ) : (
                  <UserIcon size={18} />
                )}
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-black text-white leading-none">
                  {user?.name || "Authenticating..."}
                </span>
                {user && (
                  <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider mt-1">
                    {user.role}
                  </span>
                )}
              </div>
            </div>

            {/* Logout */}
            <button
              onClick={handleLogout}
              title="Sign Out"
              className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-500 hover:text-white hover:bg-zinc-800 hover:border-zinc-700 transition-all active:scale-90"
            >
              <LogOut size={18} />
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};
