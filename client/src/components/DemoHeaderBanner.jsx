import React from "react";
import { useApp } from "../context/AppContext";
import { useNavigate } from "react-router-dom";

export default function DemoHeaderBanner() {
  const { currentUser, isPublicView, setIsPublicView } = useApp();
  const navigate = useNavigate();

  const handlePublicToggle = () => {
    if (!isPublicView) {
      setIsPublicView(true);
      navigate("/public/challenges/ch_1");
    } else {
      setIsPublicView(false);
      navigate(`/${currentUser.role}/dashboard`);
    }
  };

  return (
    <div className="bg-slate-950 text-slate-300 text-xs px-4 sm:px-6 py-2 flex flex-wrap items-center justify-between border-b border-slate-800/80 shadow-inner z-50 gap-2">
      <div className="flex items-center space-x-2.5">
        <span className="bg-amber-500 text-slate-950 font-extrabold px-2 py-0.5 rounded text-[10px] tracking-wider uppercase">
          Signed in as {currentUser?.role}
        </span>
        <span className="hidden lg:inline text-slate-400 text-xs">
          {currentUser?.name} · sign in with another demo account to check its permissions
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
        <button
          onClick={handlePublicToggle}
          className={`px-3 py-1 rounded-lg transition font-semibold text-xs flex items-center space-x-1 cursor-pointer ${
            isPublicView
              ? "bg-emerald-600 text-white ring-2 ring-emerald-400/40"
              : "bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800"
          }`}
        >
          <span>🌐 Public View</span>
        </button>

      </div>
    </div>
  );
}
