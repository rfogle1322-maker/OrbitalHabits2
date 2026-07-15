import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Globe, Star, Sparkles, Zap, Diamond } from "lucide-react";
import { RARITY_CONFIG } from "@/components/space/DiscoveryLog";

const RARITY_FANFARE = {
  common:    { particles: 8,  particleColor: "#94a3b8", title: "Planet Discovered",   subtitle: "A new world added to your atlas." },
  uncommon:  { particles: 14, particleColor: "#34d399", title: "Uncommon Discovery!",  subtitle: "Not every pilot finds one of these." },
  rare:      { particles: 20, particleColor: "#60a5fa", title: "Rare Discovery!",      subtitle: "A blue-class world — exceptional find." },
  epic:      { particles: 28, particleColor: "#c084fc", title: "Epic Discovery!!",     subtitle: "The cosmos rewards the disciplined." },
  legendary: { particles: 36, particleColor: "#fde047", title: "LEGENDARY DISCOVERY!!!", subtitle: "Only the most consistent pilots ever see this." },
  star:      { particles: 40, particleColor: "#fbbf24", title: "A STAR IS BORN ✦",    subtitle: "You've charted a living star. Incredible." },
};

function Particle({ color, index, total }) {
  const angle = (index / total) * 360;
  const distance = 60 + Math.random() * 50;
  const rad = (angle * Math.PI) / 180;
  const tx = Math.cos(rad) * distance;
  const ty = Math.sin(rad) * distance;
  return (
    <motion.div
      className="absolute w-2 h-2 rounded-full"
      style={{ background: color, left: "50%", top: "50%", marginLeft: -4, marginTop: -4 }}
      initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
      animate={{ x: tx, y: ty, opacity: 0, scale: 0 }}
      transition={{ duration: 0.9 + Math.random() * 0.5, ease: "easeOut", delay: 0.1 }}
    />
  );
}

export default function DiscoveryReveal({ planet, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 4000);
    return () => clearTimeout(t);
  }, [onClose]);

  if (!planet) return null;

  const rarity = planet.rarity || "common";
  const cfg = RARITY_CONFIG[rarity] || RARITY_CONFIG.common;
  const fanfare = RARITY_FANFARE[rarity] || RARITY_FANFARE.common;
  const Icon = cfg.icon;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className={`relative rounded-3xl border-2 ${cfg.border} bg-slate-900 p-8 sm:p-12 text-center mx-6 max-w-sm w-full ${cfg.glow}`}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: "spring", stiffness: 280, damping: 22 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Particles */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl">
            {Array.from({ length: fanfare.particles }).map((_, i) => (
              <Particle key={i} color={fanfare.particleColor} index={i} total={fanfare.particles} />
            ))}
          </div>

          <button onClick={onClose} className="absolute top-3 right-3 text-slate-600 hover:text-slate-300 transition">
            <X className="w-4 h-4" />
          </button>

          {/* Rarity badge */}
          <span className={`inline-block text-[10px] font-mono font-bold tracking-widest px-3 py-1 rounded-full mb-4 ${cfg.badge}`}>
            {cfg.label.toUpperCase()}
          </span>

          {/* Icon */}
          <motion.div
            className="flex items-center justify-center mb-4"
            animate={{ rotate: [0, -8, 8, -4, 4, 0], scale: [1, 1.15, 1] }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Icon className={`w-16 h-16 ${cfg.color}`} style={{ filter: `drop-shadow(0 0 16px ${fanfare.particleColor})` }} />
          </motion.div>

          {/* Name */}
          <h2 className={`text-2xl font-bold mb-1 ${cfg.color}`}>{planet.name}</h2>

          {/* Title & subtitle */}
          <p className="text-xs font-mono tracking-widest text-slate-400 uppercase mb-1">{fanfare.title}</p>
          <p className="text-sm text-slate-500">{fanfare.subtitle}</p>

          <button
            onClick={onClose}
            className={`mt-6 rounded-xl px-6 py-2.5 text-sm font-semibold transition active:scale-95 ${cfg.badge} border ${cfg.border}`}
          >
            Log Discovery →
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}