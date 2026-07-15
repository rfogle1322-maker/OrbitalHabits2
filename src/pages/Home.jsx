const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import React, { useEffect, useState, useCallback } from "react";

import FuelMeter from "@/components/space/FuelMeter";
import LaunchStatus from "@/components/space/LaunchStatus";
import HabitList from "@/components/space/HabitList";
import DiscoveryLog from "@/components/space/DiscoveryLog";
import Starfield from "@/components/space/Starfield";
import StreakTimer from "@/components/space/StreakTimer";
import Achievements from "@/components/space/Achievements";
import DiscoveryReveal from "@/components/space/DiscoveryReveal";
import LaunchHistory from "@/components/space/LaunchHistory";
import DailyReminder from "@/components/space/DailyReminder";
import { Rocket } from "lucide-react";
import moment from "moment";

const RARITY_TABLE = [
  { rarity: "common",    weight: 50 },
  { rarity: "uncommon",  weight: 25 },
  { rarity: "rare",      weight: 14 },
  { rarity: "epic",      weight: 7  },
  { rarity: "legendary", weight: 3  },
  { rarity: "star",      weight: 1  },
];

const COMMON_PREFIXES = ["Kepler", "Proxima", "Gliese", "Trappist", "Wolf", "Tau", "HD", "GJ", "Xeno", "Helios"];
const COMMON_SUFFIXES = ["b", "c", "d", "e", "IX", "VII", "Alpha", "Beta"];
const RARE_PREFIXES = ["Aurelia", "Elysium", "Lumina", "Solenia", "Zephyrion", "Mirage", "Celestia", "Nebulis", "Aetheris", "Crystallus"];
const RARE_SUFFIXES = ["Prime", "Nova", "Omega", "Major", "Minor", "Delta", "Sigma"];
const STAR_NAMES = ["Vega", "Sirius", "Rigel", "Polaris", "Antares", "Aldebaran", "Arcturus", "Capella", "Procyon", "Deneb", "Spica", "Regulus", "Altair", "Canopus"];
const STAR_GREEK = ["Alpha", "Beta", "Gamma", "Delta", "Epsilon", "Zeta"];
const STAR_CONSTELLATIONS = ["Lyrae", "Cygni", "Orionis", "Centauri", "Draconis", "Aquilae", "Persei"];

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

function rollRarity() {
  const total = RARITY_TABLE.reduce((s, r) => s + r.weight, 0);
  let roll = Math.random() * total;
  for (const r of RARITY_TABLE) {
    if (roll < r.weight) return r.rarity;
    roll -= r.weight;
  }
  return "common";
}

function generateCelestialBody() {
  const rarity = rollRarity();
  let name;
  if (rarity === "star") {
    name = Math.random() > 0.5 ? pick(STAR_NAMES) : `${pick(STAR_GREEK)} ${pick(STAR_CONSTELLATIONS)}`;
  } else if (["rare", "epic", "legendary"].includes(rarity)) {
    name = Math.random() > 0.4 ? `${pick(RARE_PREFIXES)} ${pick(RARE_SUFFIXES)}` : `${pick(RARE_PREFIXES)}-${Math.floor(Math.random() * 99)}`;
  } else {
    const useNumber = Math.random() > 0.4;
    name = useNumber
      ? `${pick(COMMON_PREFIXES)}-${Math.floor(Math.random() * 900 + 100)}${pick(COMMON_SUFFIXES)}`
      : `${pick(COMMON_PREFIXES)}-${pick(COMMON_SUFFIXES)}`;
  }
  return { name, rarity };
}

const MIN_TASKS = 4;

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

export default function Home() {
  const [habits, setHabits] = useState([]);
  const [planets, setPlanets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [launching, setLaunching] = useState(false);
  const [revealPlanet, setRevealPlanet] = useState(null);
  const [launchedToday, setLaunchedToday] = useState(false);

  const loadData = useCallback(async () => {
    const today = moment().format("YYYY-MM-DD");
    try {
      const [habitList, planetList] = await Promise.all([
        db.entities.Habit.list("-created_date", 100),
        db.entities.Planet.list("-created_date", 100),
      ]);
      // Daily reset: uncheck habits completed on a previous day (streaks preserved)
      const stale = habitList.filter((h) => h.completed && h.last_completed_date !== today);
      let resolved = habitList;
      if (stale.length > 0) {
        await db.entities.Habit.bulkUpdate(stale.map((h) => ({ id: h.id, completed: false })));
        resolved = habitList.map((h) => stale.find((s) => s.id === h.id) ? { ...h, completed: false } : h);
      }
      setHabits(resolved);
      setPlanets(planetList);
      // Lock launch if already launched today
      const alreadyLaunched = planetList.some((p) => (p.launch_date || p.created_date?.slice(0, 10)) === today);
      setLaunchedToday(alreadyLaunched);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const completedCount = habits.filter((h) => h.completed).length;
  const fuel = (Math.min(completedCount, MIN_TASKS) / MIN_TASKS) * 100;
  const canLaunch = completedCount >= MIN_TASKS && !launchedToday;

  const habitCategories = new Set(habits.map((h) => CATEGORY_MAP[h.title]).filter(Boolean)).size;

  const stats = {
    planets: planets.length,
    habits: habits.length,
    bestStreak: habits.reduce((max, h) => Math.max(max, h.best_streak || h.streak || 0), 0),
    hasStar: planets.some((p) => ["star", "legendary", "epic"].includes(p.rarity || "common")),
    hasRare: planets.some((p) => ["rare", "epic", "legendary", "star"].includes(p.rarity || "common")),
    starCount: planets.filter((p) => (p.rarity || "common") === "star").length,
    rareCount: planets.filter((p) => ["rare", "epic", "legendary"].includes(p.rarity || "common")).length,
    habitCategories,
    totalCompletions: habits.reduce((sum, h) => sum + (h.streak || 0), 0),
  };

  const handleAdd = async (title) => {
    const created = await db.entities.Habit.create({ title, completed: false });
    setHabits((prev) => [...prev, created]);
  };

  const handleToggle = async (habit) => {
    const today = moment().format("YYYY-MM-DD");
    const yesterday = moment().subtract(1, "day").format("YYYY-MM-DD");
    let newStreak = habit.streak || 0;
    let newLastDate = habit.last_completed_date || null;

    if (!habit.completed && newLastDate !== today) {
      newStreak = newLastDate === yesterday ? newStreak + 1 : 1;
      newLastDate = today;
    }

    const newBestStreak = Math.max(habit.best_streak || 0, newStreak);
    const updated = await db.entities.Habit.update(habit.id, {
      completed: !habit.completed,
      streak: newStreak,
      last_completed_date: newLastDate,
      best_streak: newBestStreak,
    });
    setHabits((prev) => prev.map((h) => (h.id === habit.id ? updated : h)));
  };

  const handleDelete = async (habit) => {
    await db.entities.Habit.delete(habit.id);
    setHabits((prev) => prev.filter((h) => h.id !== habit.id));
  };

  const handleLaunch = async () => {
    if (!canLaunch || launching) return;
    setLaunching(true);
    const today = moment().format("YYYY-MM-DD");
    try {
      const { name, rarity } = generateCelestialBody();
      const planet = await db.entities.Planet.create({ name, rarity, launch_date: today });
      setPlanets((prev) => [planet, ...prev]);
      setRevealPlanet(planet);
      setLaunchedToday(true);
      // Reset all habits to uncompleted
      const updates = habits.map((h) => ({ id: h.id, completed: false }));
      await db.entities.Habit.bulkUpdate(updates);
      setHabits((prev) => prev.map((h) => ({ ...h, completed: false })));
    } finally {
      setLaunching(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-slate-950">
        <div className="w-10 h-10 border-4 border-indigo-900 border-t-indigo-400 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-950 text-slate-100 relative">
      <Starfield />
      <DiscoveryReveal planet={revealPlanet} onClose={() => setRevealPlanet(null)} />

      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        {/* Header */}
        <header className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-3">
            <div className="relative">
              <Rocket className="w-8 h-8 text-indigo-400" />
              <div className="absolute inset-0 blur-md text-indigo-400">
                <Rocket className="w-8 h-8" />
              </div>
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight bg-gradient-to-r from-indigo-300 via-purple-300 to-emerald-300 bg-clip-text text-transparent">
            Orbital Habits
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-2 tracking-[0.25em] uppercase">
            Mission Control Dashboard
          </p>
        </header>

        {/* Fuel Meter */}
        <div className="mb-5">
          <FuelMeter fuel={fuel} />
        </div>

        {/* Streak Timer + Launch Status */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
          <StreakTimer />
          <LaunchStatus fuel={fuel} />
        </div>

        {/* Checklist */}
        <div className="mb-5">
          <HabitList
            habits={habits}
            onAdd={handleAdd}
            onToggle={handleToggle}
            onDelete={handleDelete}
          />
        </div>

        {/* Discovery Log */}
        <div className="mb-5">
          <DiscoveryLog
            planets={planets}
            canLaunch={canLaunch}
            onLaunch={handleLaunch}
            launching={launching}
            requiredTasks={MIN_TASKS}
            launchedToday={launchedToday}
          />
        </div>

        {/* Launch History */}
        <div className="mb-5">
          <LaunchHistory planets={planets} />
        </div>

        {/* Daily Reminder */}
        <div className="mb-8">
          <DailyReminder />
        </div>

        {/* Achievements */}
        <div className="mb-8">
          <Achievements stats={stats} />
        </div>

        <footer className="text-center text-[10px] text-slate-700 font-mono tracking-widest pb-4">
          ORBITAL // MISSION CONTROL v1.0
        </footer>
      </div>
    </div>
  );
}