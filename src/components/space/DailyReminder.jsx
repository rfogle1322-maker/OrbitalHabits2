import React, { useState, useEffect } from "react";
import { Bell, BellOff, Check } from "lucide-react";

export default function DailyReminder() {
  const [permission, setPermission] = useState(
    typeof Notification !== "undefined" ? Notification.permission : "denied"
  );
  const [reminderTime, setReminderTime] = useState(
    () => localStorage.getItem("orbital_reminder_time") || "20:00"
  );
  const [saved, setSaved] = useState(false);

  // Check if browser supports notifications
  const supported = typeof Notification !== "undefined" && "serviceWorker" in navigator;

  const handleEnable = async () => {
    if (!supported) return;
    const result = await Notification.requestPermission();
    setPermission(result);
    if (result === "granted") {
      scheduleReminder(reminderTime);
    }
  };

  const scheduleReminder = (time) => {
    localStorage.setItem("orbital_reminder_time", time);
    // Show immediate confirmation
    if (Notification.permission === "granted") {
      new Notification("Orbital Habits 🚀", {
        body: `Daily reminder set for ${time}. Stay on mission, Commander!`,
        icon: "/favicon.ico",
      });
    }
  };

  const handleSaveTime = () => {
    localStorage.setItem("orbital_reminder_time", reminderTime);
    if (permission === "granted") {
      scheduleReminder(reminderTime);
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  // Simple in-tab reminder check using setInterval
  useEffect(() => {
    if (permission !== "granted") return;
    const interval = setInterval(() => {
      const now = new Date();
      const [h, m] = reminderTime.split(":").map(Number);
      if (now.getHours() === h && now.getMinutes() === m && now.getSeconds() < 30) {
        new Notification("Orbital Habits 🚀", {
          body: "Mission reminder: complete your daily habits and launch your rocket!",
          icon: "/favicon.ico",
        });
      }
    }, 30000);
    return () => clearInterval(interval);
  }, [permission, reminderTime]);

  return (
    <div className="rounded-2xl border border-sky-500/30 bg-slate-900/60 backdrop-blur-xl p-5 sm:p-6 shadow-[0_0_20px_rgba(14,165,233,0.1)]">
      <div className="flex items-center gap-2 mb-4">
        <Bell className="w-5 h-5 text-sky-400" />
        <h2 className="text-sm font-semibold tracking-[0.2em] text-sky-300 uppercase">
          Daily Reminder
        </h2>
      </div>

      {!supported ? (
        <p className="text-xs text-slate-500">Notifications not supported in this browser.</p>
      ) : permission === "denied" ? (
        <p className="text-xs text-slate-500">Notifications blocked. Enable them in browser settings.</p>
      ) : permission === "default" ? (
        <div>
          <p className="text-sm text-slate-400 mb-3">Get a daily nudge to complete your mission.</p>
          <button
            onClick={handleEnable}
            className="rounded-lg bg-sky-600/80 hover:bg-sky-500 px-4 py-2 text-sm font-medium text-white transition flex items-center gap-2"
          >
            <Bell className="w-4 h-4" />
            Enable Reminders
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 flex-1">
            <Bell className="w-4 h-4 text-sky-400 shrink-0" />
            <span className="text-xs text-slate-400">Remind me at</span>
            <input
              type="time"
              value={reminderTime}
              onChange={(e) => setReminderTime(e.target.value)}
              className="rounded-lg bg-slate-800 border border-slate-700 text-sky-300 text-sm px-2 py-1 font-mono focus:outline-none focus:border-sky-500"
            />
          </div>
          <button
            onClick={handleSaveTime}
            className="rounded-lg bg-sky-600/80 hover:bg-sky-500 px-3 py-1.5 text-xs font-medium text-white transition flex items-center gap-1.5 active:scale-95"
          >
            {saved ? <Check className="w-3.5 h-3.5" /> : null}
            {saved ? "Saved!" : "Save"}
          </button>
        </div>
      )}
    </div>
  );
}