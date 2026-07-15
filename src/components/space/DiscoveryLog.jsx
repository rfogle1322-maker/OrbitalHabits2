import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, Rocket, Star, Sparkles, Zap, Diamond, Lock, CheckCircle2 } from "lucide-react";

export const RARITY_CONFIG = {
  common:     { label: "Common",     color: "text-slate-300",   border: "border-slate-600/40",   bg: "bg-slate-800/30",   badge: "bg-slate-700/50 text-slate-400",    glow: "",                                          icon: Globe },
  uncommon:   { label: "Uncommon",   color: "text-emerald-300", border: "border-emerald-500/40", bg: "bg-emerald-500/5",  badge: "bg-emerald-500/20 text-emerald-300", glow: "shadow-[0_0_12px_rgba(52,211,153,0.2)]",    icon: Globe },
  rare:       { label: "Rare",       color: "text-blue-300",    border: "border-blue-500/40",    bg: "bg-blue-500/5",     badge: "bg-blue-500/20 text-blue-300",       glow: "shadow-[0_0_14px_rgba(59,130,246,0.3)]",    icon: Zap },
  epic:       { label: "Epic",       color: "text-purple-300",  border: "border-purple-500/40",  bg: "bg-purple-500/8",   badge: "bg-purple-500/20 text-purple-300",   glow: "shadow-[0_0_18px_rgba(168,85,247,0.4)]",    icon: Diamond },
  legendary:  { label: "Legendary",  color: "text-yellow-300",  border: "border-yellow-500/50",  bg: "bg-yellow-500/8",   badge: "bg-yellow-500/20 text-yellow-300",   glow: "shadow-[0_0_24px_rgba(234,179,8,0.5)]",     icon: Star },
  star:       { label: "Star",       color: "text-amber-200",   border: "border-amber-400/50",   bg: "bg-amber-500/8",    badge: "bg-amber-500/20 text-amber-200",     glow: "shadow-[0_0_28px_rgba(251,191,36,0.6)]",    icon: Sparkles },
};

export default function DiscoveryLog({ planets, canLaunch, onLaunch, launching, requiredTasks, launchedToday }) {
  return (
    <div className="rounded-2xl border border-indigo-500/30 bg-slate-900/60 backdrop-blur-xl p-5 sm:p-6 shadow-[0_0_30px_rgba(99,102,241,0.15)]">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Globe className="w-5 h-5 text-purple-400" />
          <h2 className="text-sm font-semibold tracking-[0.2em] text-purple-300 uppercase">
            Discovery Log
          </h2>
        </div>
        <span className="text-xs font-mono text-slate-500">{planets.length} found</span>
      </div>

      {launchedToday ? (
        <div className="w-full mb-4 rounded-xl px-4 py-3.5 text-sm font-bold tracking-wider uppercase flex items-center justify-center gap-2 border border-emerald-500/30 bg-emerald-500/5 text-emerald-400">
          <CheckCircle2 className="w-5 h-5" />
          Mission Complete — Return Tomorrow
        </div>
      ) : (
        <button
          onClick={onLaunch}
          disabled={!canLaunch || launching}
          className={`w-full mb-4 rounded-xl px-4 py-3.5 text-sm font-bold tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-2 ${
            canLaunch && !launching
              ? "bg-gradient-to-r from-emerald-500 to-green-400 text-slate-950 hover:scale-[1.02] active:scale-95 shadow-[0_0_25px_rgba(34,255,136,0.4)] cursor-pointer"
              : "bg-slate-800/50 text-slate-600 cursor-not-allowed border border-slate-700/30"
          }`}
        >
          {canLaunch && !launching
            ? <Rocket className="w-5 h-5 animate-pulse" />
            : <Lock className="w-4 h-4" />}
          {launching ? "Launching..." : canLaunch ? "Launch Rocket" : `Complete ${requiredTasks} tasks to launch`}
        </button>
      )}

      <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1">
        <AnimatePresence initial={false}>
          {planets.length === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-8 text-slate-600 text-sm">
              No planets discovered yet. Complete your checklist and launch!
            </motion.div>
          )}
          {planets.map((planet, i) => {
            const rarity = planet.rarity || "common";
            const cfg = RARITY_CONFIG[rarity] || RARITY_CONFIG.common;
            const Icon = cfg.icon;
            const showBadge = rarity !== "common";
            return (
              <motion.div
                key={planet.id}
                layout
                initial={{ opacity: 0, scale: 0.85, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                className={`flex items-center gap-3 rounded-xl border px-3 py-2.5 ${cfg.border} ${cfg.bg} ${cfg.glow}`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${cfg.color}`} />
                <span className={`flex-1 text-sm font-medium ${cfg.color}`}>{planet.name}</span>
                {showBadge && (
                  <span className={`text-[9px] font-mono font-bold tracking-wider px-1.5 py-0.5 rounded ${cfg.badge}`}>
                    {cfg.label.toUpperCase()}
                  </span>
                )}
                <span className="text-[10px] font-mono text-slate-600">#{planets.length - i}</span>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}