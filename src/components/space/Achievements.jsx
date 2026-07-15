import React from "react";
import {
  Trophy, Rocket, Compass, Map, Flag, Flame, Orbit, Star,
  ListChecks, Satellite, Sparkles, Gem, Lock, Zap, Globe,
  Target, Shield, Crown, Timer, Telescope, FlameKindling,
  BookOpen, Dumbbell, Heart, Infinity, Award, TrendingUp,
} from "lucide-react";

const ACHIEVEMENTS = [
  // Discovery milestones
  { id: "first_contact",  name: "First Contact",       desc: "Discover your first body",        icon: Rocket,        check: (s) => s.planets >= 1 },
  { id: "explorer",       name: "Explorer",             desc: "Discover 5 bodies",               icon: Compass,       check: (s) => s.planets >= 5 },
  { id: "cartographer",   name: "Cartographer",         desc: "Discover 10 bodies",              icon: Map,           check: (s) => s.planets >= 10 },
  { id: "pioneer",        name: "Space Pioneer",        desc: "Discover 25 bodies",              icon: Flag,          check: (s) => s.planets >= 25 },
  { id: "astronomer",     name: "Astronomer",           desc: "Discover 50 bodies",              icon: Telescope,     check: (s) => s.planets >= 50 },
  { id: "galactic",       name: "Galactic Surveyor",    desc: "Discover 100 bodies",             icon: Globe,         check: (s) => s.planets >= 100 },

  // Rarity discoveries
  { id: "rare_find",      name: "Rare Find",            desc: "Discover a rare planet",          icon: Gem,           check: (s) => s.hasRare },
  { id: "star_hunter",    name: "Star Hunter",          desc: "Discover a star",                 icon: Sparkles,      check: (s) => s.hasStar },
  { id: "constellation",  name: "Constellation",        desc: "Discover 5 stars",                icon: Star,          check: (s) => s.starCount >= 5 },
  { id: "rare_collector", name: "Rare Collector",       desc: "Discover 10 rare planets",        icon: Crown,         check: (s) => s.rareCount >= 10 },

  // Streak milestones
  { id: "on_fire",        name: "On Fire",              desc: "Reach a 3-day streak",            icon: Flame,         check: (s) => s.bestStreak >= 3 },
  { id: "weekly",         name: "Weekly Warrior",       desc: "Reach a 7-day streak",            icon: Orbit,         check: (s) => s.bestStreak >= 7 },
  { id: "fortnight",      name: "Fortnight Focus",      desc: "Reach a 14-day streak",           icon: FlameKindling, check: (s) => s.bestStreak >= 14 },
  { id: "stellar",        name: "Stellar Discipline",   desc: "Reach a 30-day streak",           icon: TrendingUp,    check: (s) => s.bestStreak >= 30 },
  { id: "unstoppable",    name: "Unstoppable",          desc: "Reach a 60-day streak",           icon: Zap,           check: (s) => s.bestStreak >= 60 },
  { id: "legend",         name: "Legend",               desc: "Reach a 100-day streak",          icon: Infinity,      check: (s) => s.bestStreak >= 100 },

  // Launch milestones
  { id: "first_launch",   name: "Liftoff",              desc: "Complete your first launch",      icon: Rocket,        check: (s) => s.planets >= 1 },
  { id: "five_launches",  name: "Veteran Pilot",        desc: "Complete 5 launches",             icon: Target,        check: (s) => s.planets >= 5 },
  { id: "ten_launches",   name: "Ace Commander",        desc: "Complete 10 launches",            icon: Award,         check: (s) => s.planets >= 10 },
  { id: "mission_elite",  name: "Mission Elite",        desc: "Complete 20 launches",            icon: Shield,        check: (s) => s.planets >= 20 },

  // Habit collection
  { id: "builder",        name: "Habit Builder",        desc: "Add 5 habits",                   icon: ListChecks,    check: (s) => s.habits >= 5 },
  { id: "mission_control",name: "Mission Control",      desc: "Add 10 habits",                  icon: Satellite,     check: (s) => s.habits >= 10 },
  { id: "dedication",     name: "Dedicated",            desc: "Add 15 habits",                  icon: Dumbbell,      check: (s) => s.habits >= 15 },
  { id: "balanced",       name: "Balanced Life",        desc: "Add habits from 3+ categories",  icon: Heart,         check: (s) => s.habitCategories >= 3 },
  { id: "scholar",        name: "Scholar",              desc: "Complete 50 habit checks",        icon: BookOpen,      check: (s) => s.totalCompletions >= 50 },
  { id: "centurion",      name: "Centurion",            desc: "Complete 100 habit checks",       icon: Timer,         check: (s) => s.totalCompletions >= 100 },
];

const CATEGORY_MAP = {
  "Exercise for 30 min": "Fitness", "Walk 10k steps": "Fitness", "Do 20 push-ups": "Fitness",
  "Stretch for 10 min": "Fitness", "Go for a run": "Fitness", "Cycle 5km": "Fitness",
  "Do yoga": "Fitness", "Swim laps": "Fitness",
  "Meditate for 10 min": "Mind", "Journal your day": "Mind", "Read 20 pages": "Mind",
  "Practice deep breathing": "Mind", "No phone first hour": "Mind", "Do a brain puzzle": "Mind",
  "Write 3 grateful things": "Mind",
  "Drink 2L of water": "Health", "Sleep 8 hours": "Health", "No junk food today": "Health",
  "Eat a healthy breakfast": "Health", "Take vitamins": "Health", "Cook a meal at home": "Health",
  "Avoid caffeine after 2pm": "Health",
  "Practice a skill": "Learning", "Watch an educational video": "Learning", "Write 200 words": "Learning",
  "Study for 30 min": "Learning", "Learn a new word": "Learning", "Practice a language": "Learning",
  "Code for 30 min": "Learning",
  "Call a friend or family": "Wellbeing", "Do a kind act": "Wellbeing", "Spend time outside": "Wellbeing",
  "Clean your workspace": "Wellbeing", "Plan tomorrow": "Wellbeing", "Unplug for 1 hour": "Wellbeing",
};

export default function Achievements({ stats }) {
  // Compute extra stats needed
  const enriched = {
    ...stats,
    starCount: stats.starCount || 0,
    rareCount: stats.rareCount || 0,
    habitCategories: stats.habitCategories || 0,
    totalCompletions: stats.totalCompletions || 0,
  };

  const unlocked = ACHIEVEMENTS.filter((a) => a.check(enriched)).length;

  return (
    <div className="rounded-2xl border border-amber-500/30 bg-slate-900/60 backdrop-blur-xl p-5 sm:p-6 shadow-[0_0_30px_rgba(245,158,11,0.12)]">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-400" />
          <h2 className="text-sm font-semibold tracking-[0.2em] text-amber-300 uppercase">
            Achievements
          </h2>
        </div>
        <span className="text-xs font-mono text-slate-500">
          {unlocked}/{ACHIEVEMENTS.length}
        </span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {ACHIEVEMENTS.map((a) => {
          const isUnlocked = a.check(enriched);
          const Icon = a.icon;
          return (
            <div
              key={a.id}
              className={`relative rounded-xl border p-3 transition-all duration-300 ${
                isUnlocked
                  ? "border-amber-500/40 bg-amber-500/5"
                  : "border-slate-700/40 bg-slate-950/40 opacity-50"
              }`}
            >
              {!isUnlocked && <Lock className="absolute top-2 right-2 w-3 h-3 text-slate-700" />}
              <div className="flex items-center gap-2 mb-1.5">
                <Icon className={`w-4 h-4 shrink-0 ${isUnlocked ? "text-amber-400" : "text-slate-600"}`} />
                <span className={`text-xs font-semibold ${isUnlocked ? "text-amber-200" : "text-slate-500"}`}>
                  {a.name}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 leading-snug">{a.desc}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}