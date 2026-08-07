import React, { useState, useEffect } from "react";
import { Clock, Calendar, MapPin, ChevronDown, Sparkles } from "lucide-react";
import { PrayerData } from "../types";

const CITIES = [
  { id: "Jakarta", name: "Jakarta" },
  { id: "Surabaya", name: "Surabaya" },
  { id: "Bandung", name: "Bandung" },
  { id: "Medan", name: "Medan" },
  { id: "Yogyakarta", name: "Yogyakarta" },
  { id: "Semarang", name: "Semarang" },
  { id: "Makassar", name: "Makassar" },
  { id: "Palembang", name: "Palembang" },
  { id: "Denpasar", name: "Denpasar" },
];

export const ClockPrayerCard: React.FC = () => {
  const [currentTime, setCurrentTime] = useState<string>("");
  const [currentDateStr, setCurrentDateStr] = useState<string>("");
  const [selectedCity, setSelectedCity] = useState<string>("Jakarta");
  const [prayerData, setPrayerData] = useState<PrayerData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [nextPrayer, setNextPrayer] = useState<{ name: string; time: string; minutesLeft: number } | null>(null);
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState<boolean>(false);

  // Live Digital Clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      
      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      const seconds = String(now.getSeconds()).padStart(2, "0");
      setCurrentTime(`${hours}:${minutes}:${seconds}`);

      const days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
      const months = [
        "Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
        "Jul", "Agt", "Sep", "Okt", "Nov", "Des"
      ];
      const dayName = days[now.getDay()];
      const dayNum = now.getDate();
      const monthName = months[now.getMonth()];
      const year = now.getFullYear();
      setCurrentDateStr(`${dayName}, ${dayNum} ${monthName} ${year}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Fetch Prayer Times
  const fetchPrayerTimes = async (city: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/prayer-times?city=${encodeURIComponent(city)}`);
      const data = await res.json();
      if (data && data.success && data.timings) {
        setPrayerData(data);
      }
    } catch (err) {
      console.error("Error fetching prayer times:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrayerTimes(selectedCity);
  }, [selectedCity]);

  // Calculate Next Prayer
  useEffect(() => {
    if (!prayerData || !prayerData.timings) return;
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    const list = [
      { name: "Subuh", time: prayerData.timings.Subuh },
      { name: "Dzuhur", time: prayerData.timings.Dzuhur },
      { name: "Ashar", time: prayerData.timings.Ashar },
      { name: "Maghrib", time: prayerData.timings.Maghrib },
      { name: "Isya", time: prayerData.timings.Isya },
    ];

    let upcoming = null;
    for (const item of list) {
      const [h, m] = item.time.split(":").map(Number);
      const prayerMinutes = h * 60 + m;
      if (prayerMinutes > currentMinutes) {
        upcoming = {
          name: item.name,
          time: item.time,
          minutesLeft: prayerMinutes - currentMinutes,
        };
        break;
      }
    }

    if (!upcoming) {
      const [h, m] = list[0].time.split(":").map(Number);
      const subuhMinutes = h * 60 + m;
      const minutesLeft = 24 * 60 - currentMinutes + subuhMinutes;
      upcoming = {
        name: list[0].name,
        time: list[0].time,
        minutesLeft,
      };
    }

    setNextPrayer(upcoming);
  }, [prayerData, currentTime]);

  const defaultTimings = {
    Subuh: "04:42",
    Dzuhur: "11:58",
    Ashar: "15:19",
    Maghrib: "17:55",
    Isya: "19:06",
  };

  const timings = prayerData?.timings || defaultTimings;

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#1c1137]/90 via-[#150d2b]/95 to-[#0f0921]/95 border border-purple-500/25 p-3.5 sm:p-4 shadow-xl shadow-purple-950/40 backdrop-blur-xl">
      {/* Background Subtle Ambient Light */}
      <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-pink-500/10 blur-2xl pointer-events-none" />

      {/* Compact Top Header Row */}
      <div className="flex items-center justify-between gap-2 border-b border-purple-800/30 pb-2.5 mb-2.5">
        {/* Left: Clock & Date */}
        <div className="flex items-center gap-2 min-w-0">
          <div className="p-1.5 rounded-xl bg-pink-500/15 border border-pink-500/30 text-pink-400 flex-shrink-0">
            <Clock className="w-4 h-4 animate-pulse" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-lg sm:text-xl font-black font-mono tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-fuchsia-300 to-pink-300 drop-shadow-[0_0_8px_rgba(236,72,153,0.5)] leading-none">
                {currentTime || "15:39:33"}
              </span>
              <span className="text-[10px] font-medium text-purple-300/80 bg-purple-950/60 border border-purple-800/40 px-2 py-0.5 rounded-md truncate">
                {currentDateStr || "Jumat, 7 Ags"}
              </span>
            </div>
          </div>
        </div>

        {/* Right: City Dropdown */}
        <div className="relative flex-shrink-0">
          <button
            onClick={() => setIsCityDropdownOpen(!isCityDropdownOpen)}
            className="flex items-center gap-1 text-[11px] font-bold text-purple-200 bg-purple-900/50 hover:bg-purple-800/60 px-2.5 py-1 rounded-xl border border-purple-500/30 transition-all shadow-sm"
          >
            <MapPin className="w-3 h-3 text-pink-400" />
            <span>{selectedCity}</span>
            <ChevronDown className="w-3 h-3 text-purple-400" />
          </button>

          {isCityDropdownOpen && (
            <div className="absolute right-0 mt-1.5 w-32 bg-[#160c2e] border border-purple-500/40 rounded-xl shadow-2xl py-1 z-50 max-h-48 overflow-y-auto">
              {CITIES.map((c) => (
                <button
                  key={c.id}
                  onClick={() => {
                    setSelectedCity(c.name);
                    setIsCityDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 text-xs font-medium transition-colors ${
                    selectedCity === c.name
                      ? "bg-pink-500/20 text-pink-300 font-bold"
                      : "text-purple-200 hover:bg-purple-800/40"
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Prayer Schedule 5-Column Compact Grid */}
      <div className="grid grid-cols-5 gap-1 sm:gap-1.5 text-center">
        {[
          { name: "Subuh", time: timings.Subuh },
          { name: "Dzuhur", time: timings.Dzuhur },
          { name: "Ashar", time: timings.Ashar },
          { name: "Maghrib", time: timings.Maghrib },
          { name: "Isya", time: timings.Isya },
        ].map((item) => {
          const isNext = nextPrayer?.name === item.name;
          return (
            <div
              key={item.name}
              className={`p-1.5 sm:p-2 rounded-xl border text-center transition-all ${
                isNext
                  ? "bg-gradient-to-b from-pink-600/30 to-purple-600/30 border-pink-400/80 text-white shadow-[0_0_10px_rgba(236,72,153,0.35)] font-semibold scale-[1.02]"
                  : "bg-purple-950/40 border-purple-800/30 text-purple-200"
              }`}
            >
              <span className="block text-[9px] sm:text-[10px] text-purple-300/80 font-medium uppercase tracking-wider truncate">
                {item.name}
              </span>
              <span className="block font-mono font-bold text-pink-200 text-[11px] sm:text-xs">
                {item.time}
              </span>
            </div>
          );
        })}
      </div>

      {/* Next Prayer Compact Banner */}
      {nextPrayer && (
        <div className="mt-2 flex items-center justify-between text-[10px] sm:text-[11px] text-purple-300/80 font-medium bg-purple-950/30 rounded-lg py-1 px-2.5 border border-purple-800/20">
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-pink-400 animate-ping" />
            Mendekati <strong className="text-pink-300">{nextPrayer.name}</strong> ({nextPrayer.time})
          </span>
          <span className="font-mono text-purple-200 font-bold">
            {Math.floor(nextPrayer.minutesLeft / 60)}j {nextPrayer.minutesLeft % 60}m lagi
          </span>
        </div>
      )}
    </div>
  );
};
