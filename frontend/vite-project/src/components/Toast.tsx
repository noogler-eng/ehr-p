import { useState, useEffect, useCallback } from "react";
import { CheckCircle, AlertTriangle, Info, X, Shield, Blocks } from "lucide-react";

export interface ToastData {
  id: string;
  type: "success" | "error" | "warning" | "info" | "blockchain";
  title: string;
  message?: string;
  duration?: number;
}

let toastCallback: ((toast: Omit<ToastData, "id">) => void) | null = null;

/** Call this from anywhere to show a toast */
export const showToast = (toast: Omit<ToastData, "id">) => {
  if (toastCallback) toastCallback(toast);
};

export const ToastContainer = () => {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const addToast = useCallback((toast: Omit<ToastData, "id">) => {
    const id = Date.now().toString() + Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { ...toast, id }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, toast.duration || 4000);
  }, []);

  useEffect(() => {
    toastCallback = addToast;
    return () => { toastCallback = null; };
  }, [addToast]);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const getIcon = (type: ToastData["type"]) => {
    switch (type) {
      case "success": return <CheckCircle size={18} className="text-white" />;
      case "error": return <AlertTriangle size={18} className="text-white" />;
      case "warning": return <AlertTriangle size={18} className="text-zinc-300" />;
      case "blockchain": return <Blocks size={18} className="text-white" />;
      default: return <Info size={18} className="text-zinc-400" />;
    }
  };

  const getStyles = (type: ToastData["type"]) => {
    switch (type) {
      case "success": return "bg-zinc-900 border-white/20";
      case "error": return "bg-zinc-900 border-white/40";
      case "warning": return "bg-zinc-900 border-zinc-600";
      case "blockchain": return "bg-zinc-900 border-white/30";
      default: return "bg-zinc-900 border-zinc-700";
    }
  };

  return (
    <div className="fixed top-20 right-6 z-[200] space-y-3 max-w-sm">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-start gap-3 px-5 py-4 rounded-2xl border backdrop-blur-xl shadow-2xl shadow-black/50 animate-slide-in ${getStyles(toast.type)}`}
        >
          <div className="shrink-0 mt-0.5">{getIcon(toast.type)}</div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-black text-white uppercase tracking-wide">{toast.title}</p>
            {toast.message && (
              <p className="text-[10px] text-zinc-400 mt-0.5 leading-relaxed">{toast.message}</p>
            )}
          </div>
          <button onClick={() => removeToast(toast.id)} className="shrink-0 text-zinc-600 hover:text-white transition-colors">
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
};
