import React, { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { TrendingUp } from "lucide-react";
import { RARITY_CONFIG } from "./DiscoveryLog";

const RARITY_ORDER = ["common", "uncommon", "rare", "epic", "legendary", "star"];
const RARITY_COLORS = {
  common:    "#94a3b8",
  uncommon:  "#34d399",
  rare:      "#60a5fa",
  epic:      "#c084fc",
  legendary: "#fde047",
  star:      "#fbbf24",
};

export default function LaunchHistory({ planets }) {
  // Last 14 days
  const data = useMemo(() => {
    const days = [];
    for (let i = 13; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().slice(0, 10);
      const label = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      const dayPlanets = planets.filter((p) => (p.launch_date || p.created_date?.slice(0, 10)) === dateStr);
      const topRarity = dayPlanets.reduce((best, p) => {
        const ri = RARITY_ORDER.indexOf(p.rarity || "common");
        const bi = RARITY_ORDER.indexOf(best);
        return ri > bi ? p.rarity : best;
      }, "common");
      days.push({ label, date: dateStr, count: dayPlanets.length, topRarity });
    }
    return days;
  }, [planets]);

  const totalLaunches = planets.length;
  const last7 = data.slice(-7).reduce((s, d) => s + d.count, 0);

  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null;
    const d = payload[0].payload;
    if (!d.count) return null;
    const cfg = RARITY_CONFIG[d.topRarity] || RARITY_CONFIG.common;
    return (
      <div className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs shadow-xl">
        <p className="text-slate-400 mb-1">{d.date}</p>
        <p className="text-slate-200 font-semibold">{d.count} launch{d.count > 1 ? "es" : ""}</p>
        <p className={`${cfg.color} font-mono`}>Best: {cfg.label}</p>
      </div>
    );
  };

  return (
    <div className="rounded-2xl border border-indigo-500/30 bg-slate-900/60 backdrop-blur-xl p-5 sm:p-6 shadow-[0_0_30px_rgba(99,102,241,0.15)]">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-indigo-400" />
          <h2 className="text-sm font-semibold tracking-[0.2em] text-indigo-300 uppercase">
            Launch History
          </h2>
        </div>
        <div className="flex items-center gap-3 text-xs font-mono text-slate-500">
          <span><span className="text-slate-300">{last7}</span> this week</span>
          <span><span className="text-slate-300">{totalLaunches}</span> total</span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={120}>
        <BarChart data={data} barSize={14} margin={{ top: 4, right: 2, left: -28, bottom: 0 }}>
          <XAxis
            dataKey="label"
            tick={{ fill: "#475569", fontSize: 9 }}
            tickLine={false}
            axisLine={false}
            interval={2}
          />
          <YAxis
            allowDecimals={false}
            tick={{ fill: "#475569", fontSize: 9 }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(99,102,241,0.08)" }} />
          <Bar dataKey="count" radius={[4, 4, 0, 0]}>
            {data.map((entry, i) => (
              <Cell
                key={i}
                fill={entry.count > 0 ? RARITY_COLORS[entry.topRarity] : "#1e293b"}
                opacity={entry.count > 0 ? 1 : 0.4}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Rarity legend */}
      <div className="flex flex-wrap gap-3 mt-3">
        {RARITY_ORDER.map((r) => (
          <div key={r} className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full" style={{ background: RARITY_COLORS[r] }} />
            <span className="text-[10px] font-mono text-slate-500 capitalize">{r}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
