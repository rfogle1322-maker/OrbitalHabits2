import React from "react";
import { motion } from "framer-motion";
import { Rocket, Fuel } from "lucide-react";

export default function FuelMeter({ fuel }) {
  const fuelColor =
    fuel === 100
      ? "#22ff88"
      : fuel >= 71
      ? "#39ff14"
      : fuel >= 31
      ? "#ffcc00"
      : "#ff3355";

  const glowColor =
    fuel === 100
      ? "rgba(34,255,136,0.6)"
      : fuel >= 71
      ? "rgba(57,255,20,0.5)"
      : fuel >= 31
      ? "rgba(255,204,0,0.5)"
      : "rgba(255,51,85,0.5)";

  return (
    <div className="rounded-2xl border border-indigo-500/30 bg-slate-900/60 backdrop-blur-xl p-5 sm:p-6 shadow-[0_0_30px_rgba(99,102,241,0.15)]">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Fuel className="w-5 h-5 text-emerald-400" />
          <h2 className="text-sm font-semibold tracking-[0.2em] text-emerald-300 uppercase">
            Launch Fuel
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <Rocket
            className="w-5 h-5 transition-transform duration-500"
            style={{ color: fuelColor, transform: fuel > 0 ? `translateX(${fuel * 0.3}px)` : "none" }}
          />
          <span
            className="text-2xl font-bold tabular-nums font-mono"
            style={{ color: fuelColor, textShadow: `0 0 12px ${glowColor}` }}
          >
            {Math.round(fuel)}%
          </span>
        </div>
      </div>

      {/* Fuel bar track */}
      <div className="relative h-6 rounded-full bg-slate-950/80 border border-slate-700/50 overflow-hidden">
        {/* Segment ticks */}
        <div className="absolute inset-0 flex">
          <div className="flex-1 border-r border-slate-700/40" />
          <div className="flex-1 border-r border-slate-700/40" />
          <div className="flex-1 border-r border-slate-700/40" />
          <div className="flex-1" />
        </div>
        <motion.div
          className="h-full rounded-full relative"
          style={{
            background: `linear-gradient(90deg, ${fuelColor}aa, ${fuelColor})`,
            boxShadow: `0 0 20px ${glowColor}, inset 0 0 10px rgba(255,255,255,0.3)`,
          }}
          initial={{ width: 0 }}
          animate={{ width: `${fuel}%` }}
          transition={{ type: "spring", stiffness: 120, damping: 18 }}
        >
          <div className="absolute inset-0 opacity-40 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.6),transparent)] animate-pulse" />
        </motion.div>
      </div>

      <div className="flex justify-between mt-2 text-[10px] font-mono text-slate-500 tracking-widest">
        <span>EMPTY</span>
        <span>CRITICAL</span>
        <span>FLIGHT READY</span>
        <span>LAUNCH</span>
      </div>
    </div>
  );
}