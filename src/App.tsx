import React, { useState } from "react";
import { Header } from "./components/Header";
import { ClockPrayerCard } from "./components/ClockPrayerCard";
import { DeviceInfoCard } from "./components/DeviceInfoCard";
import { CategoryTabs } from "./components/CategoryTabs";
import { TikTokDownloaderView } from "./components/TikTokDownloaderView";
import { TranslatorView } from "./components/TranslatorView";
import { CalculatorModal } from "./components/CalculatorModal";
import { QuranModal } from "./components/QuranModal";
import { WeatherCalendarModal } from "./components/WeatherCalendarModal";
import { NotificationModal } from "./components/NotificationModal";
import { ShootingStars } from "./components/ShootingStars";
import { LoadingScreen } from "./components/LoadingScreen";
import { CategoryFilter, ActiveTool } from "./types";
import {
  Languages,
  Calculator,
  ArrowRight,
  LayoutGrid,
  Music,
  Zap,
  BookOpen,
  Calendar,
} from "lucide-react";

export default function App() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>("All");
  const [activeTool, setActiveTool] = useState<ActiveTool>(null);
  const [showNotification, setShowNotification] = useState<boolean>(false);

  // Tool items data
  const tools = [
    {
      id: "tiktok" as const,
      category: "Downloader" as const,
      title: "Tiktok Downloader",
      description: "Download video, foto & audio TikTok tanpa watermark",
      badge: "MP4 / MP3",
      featured: true,
      icon: (
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-600 via-fuchsia-600 to-purple-600 border border-pink-400/50 flex items-center justify-center text-white shadow-lg shadow-pink-600/30">
          <Music className="w-6 h-6" />
        </div>
      ),
    },
    {
      id: "quran" as const,
      category: "Agama" as const,
      title: "Al-Qur'an Digital 30 Juz",
      description: "Teks Arab, Latin, Terjemahan & Audio Qari Murottal lengkap",
      badge: "114 SURAT",
      featured: false,
      icon: (
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-800 to-teal-900 border border-emerald-400/50 flex items-center justify-center text-emerald-300 shadow-lg shadow-emerald-900/40">
          <BookOpen className="w-6 h-6 text-emerald-400" />
        </div>
      ),
    },
    {
      id: "weather_calendar" as const,
      category: "Utility" as const,
      title: "Kalender & Cuaca Realtime",
      description: "Cuaca realtime kota Indonesia, agenda & hari libur nasional",
      badge: "CUACA & AGENDA",
      featured: false,
      icon: (
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-900 to-blue-900 border border-cyan-400/50 flex items-center justify-center text-cyan-300 shadow-lg shadow-cyan-900/40">
          <Calendar className="w-6 h-6 text-cyan-400" />
        </div>
      ),
    },
    {
      id: "translator" as const,
      category: "Utility" as const,
      title: "Terjemahkan Bahasa",
      description: "Terjemahkan teks ke berbagai bahasa secara instan & akurat",
      badge: "AI & NEURAL",
      featured: false,
      icon: (
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-900/80 to-pink-900/80 border border-purple-500/40 flex items-center justify-center text-pink-300 shadow-lg shadow-purple-900/40">
          <Languages className="w-6 h-6 text-pink-400" />
        </div>
      ),
    },
    {
      id: "calculator" as const,
      category: "Utility" as const,
      title: "Calculator Online",
      description: "Kalkulator online cepat untuk hitungan sehari-hari",
      badge: "MATH",
      featured: false,
      icon: (
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-900/80 to-indigo-900/80 border border-purple-500/40 flex items-center justify-center text-pink-300 shadow-lg shadow-purple-900/40">
          <Calculator className="w-6 h-6 text-pink-400" />
        </div>
      ),
    },
  ];


  // Filter tools based on active category
  const filteredTools = tools.filter((tool) => {
    if (activeCategory === "All") return true;
    return tool.category === activeCategory;
  });

  return (
    <div className="min-h-screen bg-[#070312] text-purple-100 font-sans antialiased relative selection:bg-pink-500 selection:text-white pb-12 overflow-x-hidden">
      {/* Initial Loading Screen */}
      {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}

      {/* Background Shooting Stars Animation */}
      <ShootingStars />

      {/* Background Animated Gradient Aura */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[550px] h-[550px] bg-purple-600/15 rounded-full blur-[140px]" />
        <div className="absolute bottom-1/4 right-0 w-[450px] h-[450px] bg-pink-600/10 rounded-full blur-[130px]" />
        <div className="absolute top-1/3 left-0 w-[400px] h-[400px] bg-indigo-600/10 rounded-full blur-[130px]" />
      </div>

      <div className="relative z-10 max-w-md mx-auto px-4 space-y-5">
        {/* Header */}
        <Header
          onHomeClick={() => {
            if ("speechSynthesis" in window) {
              window.speechSynthesis.cancel();
            }
            setActiveTool(null);
          }}
          onNotificationClick={() => setShowNotification(true)}
        />

        {/* Notification Modal Drawer */}
        {showNotification && (
          <NotificationModal onClose={() => setShowNotification(false)} />
        )}

        {/* View Switcher: Active Tool View or Main Dashboard Grid */}
        {activeTool === "tiktok" ? (
          <div className="rounded-3xl bg-[#100824]/95 border border-purple-500/30 p-4 sm:p-5 shadow-2xl backdrop-blur-xl">
            <TikTokDownloaderView onBack={() => setActiveTool(null)} />
          </div>
        ) : activeTool === "translator" ? (
          <div className="rounded-3xl bg-[#100824]/95 border border-purple-500/30 p-4 sm:p-5 shadow-2xl backdrop-blur-xl">
            <TranslatorView onBack={() => setActiveTool(null)} />
          </div>
        ) : activeTool === "calculator" ? (
          <div className="rounded-3xl bg-[#100824]/95 border border-purple-500/30 p-4 sm:p-5 shadow-2xl backdrop-blur-xl">
            <CalculatorModal onBack={() => setActiveTool(null)} />
          </div>
        ) : (
          <main className="space-y-5">
            {/* Modal for Quran Digital */}
            <QuranModal
              isOpen={activeTool === "quran"}
              onClose={() => setActiveTool(null)}
            />

            {/* Modal for Kalender & Cuaca Realtime */}
            <WeatherCalendarModal
              isOpen={activeTool === "weather_calendar"}
              onClose={() => setActiveTool(null)}
            />

            {/* Widget 1: Clock & Prayer Schedule */}
            <ClockPrayerCard />

            {/* Widget 2: Device & User Info */}
            <DeviceInfoCard />

            {/* Category Filter Chips */}
            <CategoryTabs
              activeCategory={activeCategory}
              onSelectCategory={setActiveCategory}
            />

            {/* Section Title */}
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-2">
                <LayoutGrid className="w-4 h-4 text-pink-400" />
                <h2 className="text-sm font-extrabold text-white tracking-wide uppercase">
                  Daftar Tools ({filteredTools.length})
                </h2>
              </div>
              <span className="text-[10px] text-purple-300/60 font-mono">
                SIAP DIGUNAKAN
              </span>
            </div>

            {/* Tool Cards Grid Layout */}
            <div className="space-y-3.5">
              {filteredTools.map((tool) => {
                if (tool.featured) {
                  // Featured Full-Width Card (TikTok Downloader)
                  return (
                    <div
                      key={tool.id}
                      onClick={() => setActiveTool(tool.id)}
                      className="group relative rounded-3xl bg-gradient-to-r from-[#1f0f42] via-[#160b33] to-[#110729] border border-pink-500/40 p-4 sm:p-5 flex items-center justify-between gap-4 shadow-xl shadow-pink-950/20 hover:border-pink-400 hover:shadow-pink-500/30 transition-all cursor-pointer active:scale-[0.99] overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 -mr-6 -mt-6 w-24 h-24 rounded-full bg-pink-500/10 blur-xl pointer-events-none" />

                      <div className="flex items-center gap-3.5 flex-1 min-w-0">
                        {tool.icon}
                        <div className="space-y-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="font-extrabold text-white text-base truncate group-hover:text-pink-300 transition-colors">
                              {tool.title}
                            </h3>
                            <span className="flex-shrink-0 text-[9px] font-mono font-bold text-pink-200 bg-pink-600/40 border border-pink-400/60 px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-0.5">
                              <Zap className="w-2.5 h-2.5 text-pink-300" />
                              Populer
                            </span>
                          </div>
                          <p className="text-purple-200/80 text-xs line-clamp-2 leading-relaxed">
                            {tool.description}
                          </p>
                        </div>
                      </div>

                      <div className="flex-shrink-0 flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveTool(tool.id);
                          }}
                          aria-label={`Buka ${tool.title}`}
                          className="w-10 h-10 rounded-2xl bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white flex items-center justify-center border border-pink-400/60 shadow-md transition-all active:scale-90"
                        >
                          <ArrowRight className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  );
                }

                // Grid or Compact Cards
                return null;
              })}

              {/* Standard 2-Column Grid for non-featured tools */}
              <div className="grid grid-cols-2 gap-3.5">
                {filteredTools
                  .filter((t) => !t.featured)
                  .map((tool) => (
                    <div
                      key={tool.id}
                      onClick={() => setActiveTool(tool.id)}
                      className="group relative rounded-3xl bg-gradient-to-b from-[#180d35]/90 via-[#120929]/95 to-[#0b051c]/95 border border-purple-500/25 p-4 flex flex-col items-center text-center justify-between gap-3 shadow-lg shadow-purple-950/30 hover:border-pink-500/50 hover:shadow-pink-500/20 transition-all cursor-pointer active:scale-[0.98]"
                    >
                      <div className="pt-1 group-hover:scale-105 transition-transform">
                        {tool.icon}
                      </div>

                      <div className="space-y-1">
                        <h3 className="font-extrabold text-white text-xs sm:text-sm leading-tight group-hover:text-pink-300 transition-colors">
                          {tool.title}
                        </h3>
                        <p className="text-purple-300/70 text-[10px] sm:text-[11px] leading-snug line-clamp-2">
                          {tool.description}
                        </p>
                      </div>

                      <div className="w-full flex flex-col items-center gap-2 pt-1 border-t border-purple-800/20">
                        <span className="text-[9px] font-mono font-bold text-pink-300/90 bg-purple-950/60 border border-purple-700/40 px-2.5 py-0.5 rounded-full">
                          {tool.badge}
                        </span>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveTool(tool.id);
                          }}
                          aria-label={`Buka ${tool.title}`}
                          className="w-8 h-8 rounded-xl bg-purple-900/60 border border-purple-500/40 flex items-center justify-center text-purple-200 group-hover:bg-pink-600 group-hover:text-white group-hover:border-pink-400 transition-all shadow-md active:scale-90"
                        >
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </main>
        )}

        {/* Footer */}
        <footer className="text-center pt-6 text-[11px] text-purple-400/60 font-mono">
          <p>© 2026 JAVA TOOLS — Multi Utility Suite</p>
        </footer>
      </div>
    </div>
  );
}
