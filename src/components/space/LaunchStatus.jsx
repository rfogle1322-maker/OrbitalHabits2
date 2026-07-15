import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Satellite, Rocket, Orbit, Sparkles } from "lucide-react";

function getStatus(fuel) {
  if (fuel === 100)
    return {
      label: "Status: LAUNCH SUCCESSFUL! Planet Discovered!",
      icon: Sparkles,
      color: "#22ff88",
      bg: "rgba(34,255,136,0.1)",
    };
  if (fuel >= 71)
    return {
      label: "Status: Flight Ready. Final countdown initiated.",
      icon: Rocket,
      color: "#39ff14",
      bg: "rgba(57,255,20,0.08)",
    };
  if (fuel >= 31)
    return {
      label: "Status: Systems Checklist Incomplete. Secondary engines online.",
      icon: Orbit,
      color: "#ffcc00",
      bg: "rgba(255,204,0,0.08)",
    };
  return {
    label: "Status: Grounded. Critical fuel shortage.",
    icon: Satellite,
    color: "#ff3355",
    bg: "rgba(255,51,85,0.08)",
  };
}

export default function LaunchStatus({ fuel }) {
  const status = getStatus(fuel);
  const Icon = status.icon;

  return (
    <div
      className="rounded-2xl border p-5 sm:p-6 backdrop-blur-xl transition-colors duration-500"
      style={{
        borderColor: `${status.color}40`,
        backgroundColor: status.bg,
        boxShadow: `0 0 25px ${status.color}15`,
      }}
    >
      <div className="flex items-center gap-2 mb-3">
        <Icon className="w-5 h-5" style={{ color: status.color }} />
        <h2 className="text-sm font-semibold tracking-[0.2em] uppercase text-slate-300">
          Launch Status
        </h2>
      </div>
      <AnimatePresence mode="wait">
        <motion.p
          key={status.label}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3 }}
          className="text-base sm:text-lg font-medium"
          style={{ color: status.color, textShadow: `0 0 10px ${status.color}40` }}
        >
          {status.label}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}