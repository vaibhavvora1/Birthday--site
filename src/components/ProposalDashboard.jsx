import React, { useState, useEffect } from 'react';
import { Heart, Clock, CheckCircle, AlertCircle, Calendar, RefreshCw } from 'lucide-react';

const STORAGE_KEY = 'bestFriendResponse';

function formatDateTime(isoString) {
  try {
    const d = new Date(isoString);
    return {
      date: d.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }),
      time: d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }),
    };
  } catch {
    return { date: '—', time: '—' };
  }
}

export default function ProposalDashboard() {
  const [data, setData] = useState(null);
  const [loaded, setLoaded] = useState(false);

  const readStorage = () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        setData(JSON.parse(raw));
      } else {
        setData(null);
      }
    } catch {
      setData(null);
    }
    setLoaded(true);
  };

  useEffect(() => {
    readStorage();
  }, []);

  const formatted = data ? formatDateTime(data.submittedAt) : null;

  const isYes = data?.response === 'YES' || data?.response === 'OF_COURSE';
  const isNeedTime = data?.response === 'NEED_TIME' || data?.response === 'ALWAYS';

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fff5f8] via-[#ffe4e9] to-[#fff0f4] flex flex-col items-center justify-center px-4 py-12 font-sans">
      {/* Header */}
      <div className="w-full max-w-lg mb-8 text-center space-y-1">
        <p className="text-xs font-extrabold uppercase tracking-widest text-rose-400">Private Dashboard</p>
        <h1 className="text-2xl sm:text-3xl font-black text-rose-950 tracking-tight">
          Best Friend Response
        </h1>
        <p className="text-sm text-rose-500 font-medium">Frontend-only · No backend · Read from localStorage</p>
      </div>

      {/* Card */}
      <div className="w-full max-w-lg rounded-3xl bg-white/95 border-2 border-rose-200 shadow-[0_20px_60px_rgba(244,63,94,0.15)] p-8 sm:p-10 space-y-6">

        {!loaded ? (
          <div className="flex items-center justify-center py-8 text-rose-400 gap-3">
            <RefreshCw className="w-5 h-5 animate-spin" />
            <span className="font-semibold">Loading...</span>
          </div>
        ) : data === null ? (
          /* ── No response yet ─────────────────────────────────────── */
          <div className="flex flex-col items-center gap-4 py-6 text-center">
            <AlertCircle className="w-14 h-14 text-rose-300" />
            <div>
              <p className="text-xl font-black text-rose-950">No response yet</p>
              <p className="text-sm text-rose-500 mt-1">She hasn't answered the best-friend question.</p>
            </div>
            <div className="mt-2 w-full p-4 rounded-2xl bg-rose-50 border border-rose-100 text-left space-y-1">
              <p className="text-xs font-bold uppercase tracking-widest text-rose-400">localStorage key</p>
              <code className="text-xs text-rose-700 break-all">{STORAGE_KEY}</code>
              <p className="text-xs text-rose-400 pt-1">Response will appear here as soon as she clicks a button on the site.</p>
            </div>
          </div>
        ) : (
          /* ── Response found ───────────────────────────────────────── */
          <div className="space-y-6">
            {/* Response Badge */}
            <div className={`flex items-center gap-4 p-5 rounded-2xl border-2 ${
              isYes
                ? 'bg-rose-50 border-rose-300'
                : 'bg-slate-50 border-slate-200'
            }`}>
              {isYes ? (
                <div className="w-14 h-14 rounded-full bg-rose-100 border border-rose-300 flex items-center justify-center shrink-0">
                  <Heart className="w-7 h-7 fill-rose-500 text-rose-500" />
                </div>
              ) : (
                <div className="w-14 h-14 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
                  <Clock className="w-7 h-7 text-slate-400" />
                </div>
              )}
              <div>
                <p className="text-xs font-extrabold uppercase tracking-widest text-rose-400 mb-0.5">Her Answer</p>
                <p className={`text-2xl font-black tracking-tight ${isYes ? 'text-rose-700' : 'text-slate-700'}`}>
                  {isYes ? 'Of course ❤️' : 'Always 🤍'}
                </p>
                <p className="text-xs text-rose-400 font-medium mt-0.5">
                  Raw value: <code className="bg-rose-100 px-1 rounded text-rose-700">{data.response}</code>
                </p>
              </div>
            </div>

            {/* Date & Time */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-100 space-y-1">
                <div className="flex items-center gap-1.5 text-rose-400">
                  <Calendar className="w-3.5 h-3.5" />
                  <p className="text-xs font-extrabold uppercase tracking-widest">Date</p>
                </div>
                <p className="text-sm font-bold text-rose-950">{formatted.date}</p>
              </div>
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-100 space-y-1">
                <div className="flex items-center gap-1.5 text-rose-400">
                  <Clock className="w-3.5 h-3.5" />
                  <p className="text-xs font-extrabold uppercase tracking-widest">Time</p>
                </div>
                <p className="text-sm font-bold text-rose-950">{formatted.time}</p>
              </div>
            </div>

            {/* Raw JSON */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center gap-1.5 text-slate-400">
                <CheckCircle className="w-3.5 h-3.5" />
                <p className="text-xs font-extrabold uppercase tracking-widest">Raw localStorage Data</p>
              </div>
              <pre className="text-xs text-slate-700 bg-white rounded-xl p-3 border border-slate-200 overflow-x-auto">
                {JSON.stringify(data, null, 2)}
              </pre>
            </div>
          </div>
        )}

        {/* Refresh button */}
        <button
          onClick={readStorage}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border-2 border-rose-200 text-rose-600 font-bold text-sm hover:bg-rose-50 transition-all"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Footer */}
      <p className="mt-6 text-xs text-rose-300 font-medium">
        This page is only visible if you know the URL · Data lives in your browser's localStorage
      </p>
    </div>
  );
}
