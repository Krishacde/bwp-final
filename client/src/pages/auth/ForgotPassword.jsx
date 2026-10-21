import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../../components/Logo";
import Toast from "../../components/Toast";
import { apiClient } from "../../services/apiClient";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  const submit = async (event) => {
    event.preventDefault();
    setBusy(true);
    try {
      const response = await apiClient.post("/api/auth/forgot-password", { email: email.trim().toLowerCase() });
      // Accept both the current backend field and the earlier local-demo
      // field so an already-running backend can still send us to the form.
      const resetUrl = response.resetUrl || response.developmentResetUrl;
      if (resetUrl) {
        const resetLink = new URL(resetUrl, window.location.origin);
        navigate(`/reset-password${resetLink.search}`, { replace: true });
        return;
      }
      setToast({ message: response.message || "Could not open the password reset page. Try again.", type: "error" });
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
        <div className="mb-6 text-center">
          <div className="inline-flex rounded-2xl bg-slate-800 p-2"><Logo /></div>
          <h1 className="mt-4 text-2xl font-bold text-white">Forgot password?</h1>
          <p className="mt-2 text-sm text-slate-400">Enter your account email to continue to password reset.</p>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <label className="block text-sm font-medium text-slate-300">Email address<input type="email" required autoFocus autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-500" /></label>
          <button type="submit" disabled={busy} className="w-full rounded-xl bg-blue-600 px-5 py-3 font-bold text-white hover:bg-blue-500 disabled:opacity-50">{busy ? "Opening reset page…" : "Continue"}</button>
        </form>
        <div className="mt-6 text-center"><Link to="/login" className="text-sm font-semibold text-slate-400 hover:text-white">Back to sign in</Link></div>
      </section>
    </main>
  );
}
