import { useEffect } from "react";

export default function Toast({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return undefined;
    const timer = window.setTimeout(onClose, 3500);
    return () => window.clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;
  const isError = toast.type === "error";
  return (
    <div role={isError ? "alert" : "status"} className={`fixed right-4 top-4 z-[100] max-w-sm rounded-xl border px-4 py-3 text-sm font-medium shadow-xl ${isError ? "border-rose-300 bg-rose-50 text-rose-900" : "border-emerald-300 bg-emerald-50 text-emerald-900"}`}>
      <div className="flex items-start gap-3">
        <span className="flex-1">{toast.message}</span>
        <button type="button" onClick={onClose} aria-label="Close notification" className="opacity-60 hover:opacity-100">×</button>
      </div>
    </div>
  );
}
