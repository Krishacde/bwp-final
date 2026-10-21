import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { useNavigate, Link } from "react-router-dom";
import Logo from "../../components/Logo";
import Toast from "../../components/Toast";

export default function Login() {
  const { login } = useApp();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);
  const demoAccounts = [
    { name: "Rajesh V. Sharma", role: "Government Officer", email: "government.demo@innoprocure.test" },
    { name: "Dr. Ananya Sen", role: "Evaluator", email: "evaluator.demo@innoprocure.test" },
    { name: "Vikramaditya Kulkarni", role: "Startup", email: "startup.demo@innoprocure.test" },
    { name: "Priya Nair", role: "Administrator", email: "admin.demo@innoprocure.test" },
  ];

  const handleLogin = async (e) => {
    e.preventDefault();
    setToast(null); setLoading(true);
    try {
      const user = await login(email, password);
      navigate(`/${user.role}/dashboard`);
    } catch (err) { setToast({ message: err.message, type: "error" }); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 flex items-center justify-center p-4 sm:p-6 lg:p-8 text-slate-100 font-sans relative overflow-hidden">
      <Toast toast={toast} onClose={() => setToast(null)} />

      {/* Decorative Background Glows */}
      <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-amber-500 via-blue-600 to-emerald-500" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-2xl bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8 z-10 my-auto">

        {/* Portal Branding Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center p-2 rounded-2xl bg-slate-800/80 border border-slate-700/80 mb-1">
            <Logo />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Innovation Procurement Portal
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
            Government-to-Startup Piloting & Public Sector Procurement Platform
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4 space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-amber-400">Demo accounts · password: Demo123!</div>
          <div className="grid gap-2 sm:grid-cols-2">
            {demoAccounts.map((account) => <button key={account.email} type="button" onClick={() => { setEmail(account.email); setPassword("Demo123!"); }} className="rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-left hover:border-blue-500">
              <span className="block text-xs font-semibold text-white">{account.name}</span>
              <span className="block text-[11px] text-slate-400">{account.role} · click to fill</span>
            </button>)}
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4 pt-2 border-t border-slate-800">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Authorized Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition autofill:bg-slate-950 autofill:text-white [&:-webkit-autofill]:bg-slate-950 [&:-webkit-autofill]:text-white [&:-webkit-autofill]:[box-shadow:0_0_0_1000px_#020617_inset] [&:-webkit-autofill]:[-webkit-text-fill-color:white]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition autofill:bg-slate-950 autofill:text-white [&:-webkit-autofill]:bg-slate-950 [&:-webkit-autofill]:text-white [&:-webkit-autofill]:[box-shadow:0_0_0_1000px_#020617_inset] [&:-webkit-autofill]:[-webkit-text-fill-color:white]"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2">
            <Link to="/forgot-password" className="text-xs font-semibold text-blue-300 hover:text-blue-200">
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-60 text-white font-bold py-3.5 px-6 rounded-xl text-sm shadow-xl transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer flex items-center justify-center space-x-2"
          >
            <span>{loading ? "Signing in…" : "Sign in"}</span>
            <span>→</span>
          </button>
        </form>

        {/* Footer info */}
        <div className="pt-2 border-t border-slate-800">
          <div className="flex items-center justify-center text-xs text-slate-400 mb-3">
            <span>New to the portal?</span>
            <Link
              to="/signup"
              className="ml-2 font-semibold text-emerald-400 hover:text-emerald-300 transition"
            >
              Create an account →
            </Link>
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium">
            <span>Rule 194 GFR 2017 Innovation Compliant</span>
            <span>National Informatics Centre (NIC) Mock Portal</span>
          </div>
        </div>

      </div>
    </div>
  );
}
