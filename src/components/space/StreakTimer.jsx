import React, { useState, useEffect } from "react";
import { Hourglass } from "lucide-react";

function getTimeLeft() {
  const now = new Date();
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0);
  const diff = midnight - now;
  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  return { h, m, s };
}

export default function StreakTimer() {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft());

  useEffect(() => {
    const id = setInterval(() => setTimeLeft(getTimeLeft()), 1000);
    return () => clearInterval(id);
  }, []);

  const pad = (n) => String(n).padStart(2, "0");

  return (
    <div className="rounded-2xl border border-cyan-500/30 bg-slate-900/60 backdrop-blur-xl p-5 sm:p-6 shadow-[0_0_30px_rgba(34,211,238,0.12)] h-full">
      <div className="flex items-center gap-2 mb-3">
        <Hourglass className="w-5 h-5 text-cyan-400" />
        <h2 className="text-sm font-semibold tracking-[0.2em] text-cyan-300 uppercase">
          Streak Timer
        </h2>
      </div>
      <div
        className="font-mono text-2xl sm:text-3xl font-bold tabular-nums text-cyan-200"
        style={{ textShadow: "0 0 12px rgba(34,211,238,0.4)" }}
      >
        {pad(timeLeft.h)}:{pad(timeLeft.m)}:{pad(timeLeft.s)}
      </div>
      <p className="text-xs text-slate-500 mt-2 tracking-wider">
        Time left today to keep your streak alive
      </p>
    </div>
  );
}