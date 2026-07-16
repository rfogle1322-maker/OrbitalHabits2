import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Rocket, Trash2, Check, Flame, Plus, X } from "lucide-react";

const SUGGESTED_HABITS = [
  // Fitness & Movement
  "Exercise for 30 min", "Walk 10k steps", "Do 20 push-ups", "Stretch for 10 min",
  "Go for a run", "Cycle 5km", "Do yoga", "Swim laps",
  // Mind & Focus
  "Meditate for 10 min", "Journal your day", "Read 20 pages", "Practice deep breathing",
  "No phone first hour", "Do a brain puzzle", "Write 3 grateful things",
  // Health & Body
  "Drink 2L of water", "Sleep 8 hours", "No junk food today", "Eat a healthy breakfast",
  "Take vitamins", "Cook a meal at home", "Avoid caffeine after 2pm",
  // Learning & Skills
  "Practice a skill", "Watch an educational video", "Write 200 words",
  "Study for 30 min", "Learn a new word", "Practice a language", "Code for 30 min",
  // Social & Wellbeing
  "Call a friend or family", "Do a kind act", "Spend time outside",
  "Clean your workspace", "Plan tomorrow", "Unplug for 1 hour",
];

const CATEGORIES = [
  { label: "All", filter: () => true },
  { label: "Fitness", filter: (h) => ["Exercise for 30 min","Walk 10k steps","Do 20 push-ups","Stretch for 10 min","Go for a run","Cycle 5km","Do yoga","Swim laps"].includes(h) },
  { label: "Mind", filter: (h) => ["Meditate for 10 min","Journal your day","Read 20 pages","Practice deep breathing","No phone first hour","Do a brain puzzle","Write 3 grateful things"].includes(h) },
  { label: "Health", filter: (h) => ["Drink 2L of water","Sleep 8 hours","No junk food today","Eat a healthy breakfast","Take vitamins","Cook a meal at home","Avoid caffeine after 2pm"].includes(h) },
  { label: "Learning", filter: (h) => ["Practice a skill","Watch an educational video","Write 200 words","Study for 30 min","Learn a new word","Practice a language","Code for 30 min"].includes(h) },
  { label: "Wellbeing", filter: (h) => ["Call a friend or family","Do a kind act","Spend time outside","Clean your workspace","Plan tomorrow","Unplug for 1 hour"].includes(h) },
];

export default function HabitList({ habits, onAdd, onDelete, onToggle }) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [showPicker, setShowPicker] = useState(false);

  const activeCat = CATEGORIES.find((c) => c.label === activeCategory);
  const filtered = SUGGESTED_HABITS.filter(activeCat.filter);
  const addedTitles = new Set((habits || []).map((h) => h?.title?.toLowerCase() || ""));

  return (
    <div className="rounded-2xl border border-indigo-500/30 bg-slate-900/60 backdrop-blur-xl p-5 sm:p-6 shadow-[0_0_30px_rgba(99,102,241,0.15)]">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Rocket className="w-5 h-5 text-indigo-400" />
          <h2 className="text-sm font-semibold tracking-[0.2em] text-indigo-300 uppercase">
            Daily Checklist
          </h2>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-slate-500">
            {(habits || []).filter((h) => h?.completed).length}/{(habits || []).length}


          </span>
          <button
            onClick={() => setShowPicker((v) => !v)}
            className="rounded-lg bg-indigo-600/80 hover:bg-indigo-500 active:scale-95 px-3 py-1.5 text-xs font-medium text-white transition flex items-center gap-1.5"
          >
            {showPicker ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
            {showPicker ? "Close" : "Add Habit"}
          </button>
        </div>
      </div>

      {/* Habit Picker */}
      <AnimatePresence>
        {showPicker && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden mb-4"
          >
            {/* Category tabs */}
            <div className="flex gap-1.5 flex-wrap mb-3">
              {CATEGORIES.map((c) => (
                <button
                  key={c.label}
                  onClick={() => setActiveCategory(c.label)}
                  className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                    activeCategory === c.label
                      ? "bg-indigo-600 text-white"
                      : "bg-slate-800/60 text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
            {/* Habit chips */}
            <div className="flex flex-wrap gap-2">
              {filtered.map((s) => {
                const added = addedTitles.has(s.toLowerCase());
                return (
                  <button
                    key={s}
                    type="button"
                    disabled={added}
                    onClick={() => { onAdd(s); }}
                    className={`rounded-full border px-3 py-1.5 text-xs transition ${
                      added
                        ? "border-slate-700/40 bg-slate-800/30 text-slate-600 cursor-not-allowed"
                        : "border-indigo-500/40 bg-indigo-500/10 text-indigo-300 hover:bg-indigo-500/20 active:scale-95"
                    }`}
                  >
                    {added ? `${s} ✓` : `+ ${s}`}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Habit list */}
      <div className="space-y-2 max-h-[340px] overflow-y-auto pr-1">
        <AnimatePresence initial={false}>
          {habits.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-10 text-slate-600 text-sm"
            >
              No objectives yet — tap <span className="text-indigo-400">Add Habit</span> to get started.
            </motion.div>
          )}
          {habits.map((habit) => (
            <motion.div
              key={habit.id}
              layout
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20, height: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className={`group flex items-center gap-3 rounded-xl border px-3 py-2.5 transition-all duration-300 ${
                habit.completed
                  ? "border-emerald-500/40 bg-emerald-500/5"
                  : "border-slate-700/40 bg-slate-950/40 hover:border-indigo-500/40"
              }`}
            >
              <Rocket
                className={`w-4 h-4 shrink-0 transition-colors ${
                  habit.completed ? "text-emerald-400" : "text-indigo-400"
                }`}
              />
              <button
                onClick={() => onToggle(habit)}
                className={`flex-1 text-left text-sm transition-colors ${
                  habit.completed
                    ? "text-emerald-300 line-through decoration-emerald-500/50"
                    : "text-slate-200"
                }`}
              >
                {habit.title}
              </button>
              {habit.streak > 0 && (
                <div className="flex items-center gap-1 text-orange-400 text-xs font-mono shrink-0">
                  <Flame className="w-3.5 h-3.5" />
                  {habit.streak}
                </div>
              )}
              <button
                onClick={() => onToggle(habit)}
                className={`w-6 h-6 rounded-md border flex items-center justify-center transition active:scale-90 ${
                  habit.completed
                    ? "border-emerald-500 bg-emerald-500/20"
                    : "border-slate-600 hover:border-indigo-500"
                }`}
              >
                {habit.completed && <Check className="w-3.5 h-3.5 text-emerald-400" />}
              </button>
              <button
                onClick={() => onDelete(habit)}
                className="text-slate-600 hover:text-red-400 transition opacity-0 group-hover:opacity-100 active:scale-90"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
