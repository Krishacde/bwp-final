import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Logo from "../../components/Logo";
import Toast from "../../components/Toast";
import { apiClient } from "../../services/apiClient";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [toast, setToast] = useState(!token ? { message: "Reset link is invalid or expired.", type: "error" } : null);

  const submit = async (event) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      setToast({ message: "Passwords do not match.", type: "error" });
      return;
    }
    setBusy(true);
    try {
      await apiClient.post("/api/auth/reset-password", { token, password });
      setDone(true);
      setToast({ message: "Password updated.", type: "success" });
    } catch (error) {
      setToast({ message: error.message, type: "error" });
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
      <Toast toast={toast} onClose={() => setToast(null)} />
      <section className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900 p-8 shadow-2xl">
        <div className="mb-6 text-center"><div className="inline-flex rounded-2xl bg-slate-800 p-2"><Logo /></div><h1 className="mt-4 text-2xl font-bold text-white">Reset password</h1></div>
        {done ? <div className="text-center"><p className="mb-5 text-sm text-slate-300">Your password has been updated.</p><Link to="/login" className="inline-flex rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white hover:bg-blue-500">Back to sign in</Link></div> : (
          <form onSubmit={submit} className="space-y-4">
            <label className="block text-sm font-medium text-slate-300">New password<input type="password" minLength={6} required autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-500" /></label>
            <label className="block text-sm font-medium text-slate-300">Confirm new password<input type="password" minLength={6} required autoComplete="new-password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-500" /></label>
            <button type="submit" disabled={busy || !token} className="w-full rounded-xl bg-blue-600 px-5 py-3 font-bold text-white hover:bg-blue-500 disabled:opacity-50">{busy ? "Updating…" : "Update password"}</button>
          </form>
        )}
      </section>
    </main>
  );
}
