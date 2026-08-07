import React, { useState, useEffect } from "react";
import { Cpu, ShieldCheck, CheckCircle2, Sparkles, Zap, Radio, Layers } from "lucide-react";

interface LoadingScreenProps {
  onComplete: () => void;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState<number>(0);
  const [statusText, setStatusText] = useState<string>("Inisialisasi Sistem...");
  const [isFadingOut, setIsFadingOut] = useState<boolean>(false);

  // System modules status checklist
  const modules = [
    { name: "Core System", at: 10 },
    { name: "TikTok Downloader", at: 35 },
    { name: "Terjemahkan Bahasa", at: 60 },
    { name: "Jadwal Sholat & Quran", at: 85 },
  ];

  useEffect(() => {
    const statuses = [
      { at: 15, text: "Memuat Modul Utama & Tema Obsidian..." },
      { at: 40, text: "Sinkronisasi Engine TikTok & Video Downloader..." },
      { at: 70, text: "Mengkoneksikan API Terjemahan Multi-Bahasa..." },
      { at: 90, text: "Menyiapkan Data Jadwal Sholat & Al-Qur'an..." },
      { at: 100, text: "Sistem Siap Digunakan!" },
    ];

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            setIsFadingOut(true);
            setTimeout(() => {
              onComplete();
            }, 500);
          }, 300);
          return 100;
        }

        const next = prev + Math.floor(Math.random() * 8) + 4;
        const boundedNext = Math.min(next, 100);

        const currentStatus = statuses.find((s) => boundedNext >= s.at);
        if (currentStatus) {
          setStatusText(currentStatus.text);
        }

        return boundedNext;
      });
    }, 100);

    return () => clearInterval(timer);
  }, [onComplete]);

  // Floating Ambient Particles
  const particles = [
    { left: "15%", bottom: "20%", delay: "0s", color: "bg-pink-400", size: "w-2 h-2" },
    { left: "25%", bottom: "10%", delay: "1.2s", color: "bg-cyan-400", size: "w-1.5 h-1.5" },
    { left: "40%", bottom: "30%", delay: "0.5s", color: "bg-fuchsia-400", size: "w-2 h-2" },
    { left: "60%", bottom: "15%", delay: "2.1s", color: "bg-purple-400", size: "w-1.5 h-1.5" },
    { left: "75%", bottom: "25%", delay: "0.8s", color: "bg-amber-400", size: "w-2 h-2" },
    { left: "85%", bottom: "35%", delay: "1.6s", color: "bg-pink-300", size: "w-1 h-1" },
    { left: "10%", bottom: "45%", delay: "2.5s", color: "bg-cyan-300", size: "w-1.5 h-1.5" },
    { left: "50%", bottom: "5%", delay: "1.8s", color: "bg-emerald-400", size: "w-2 h-2" },
  ];

  return (
    <div
      className={`fixed inset-0 z-50 bg-[#050212] flex flex-col items-center justify-center p-6 overflow-hidden transition-all duration-700 select-none ${
        isFadingOut ? "opacity-0 scale-105 pointer-events-none" : "opacity-100 scale-100"
      }`}
    >
      {/* Background Animated Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {particles.map((p, index) => (
          <div
            key={index}
            className={`animate-float-particle absolute rounded-full ${p.color} ${p.size} shadow-[0_0_12px_currentColor]`}
            style={{
              left: p.left,
              bottom: p.bottom,
              animationDelay: p.delay,
            }}
          />
        ))}
      </div>

      {/* Luxury Radial Backlight Orbs */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] h-[420px] bg-gradient-to-tr from-purple-600/20 via-pink-600/20 to-cyan-500/10 rounded-full blur-[130px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-[340px] h-[340px] bg-pink-600/15 rounded-full blur-[120px] pointer-events-none" />

      {/* Main Glassmorphic Card Container */}
      <div className="relative z-10 w-full max-w-sm flex flex-col items-center text-center space-y-7 p-7 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-2xl shadow-[0_0_60px_rgba(217,70,239,0.18)]">
        
        {/* Luxury Glowing Emblem Badge */}
        <div className="relative flex items-center justify-center my-2">
          {/* Energy Waves */}
          <div className="animate-expand-ring absolute w-24 h-24 rounded-full border border-pink-500/30 pointer-events-none" />
          <div
            className="animate-expand-ring absolute w-24 h-24 rounded-full border border-cyan-400/20 pointer-events-none"
            style={{ animationDelay: "1.2s" }}
          />

          {/* Elegant Circular Glow Halo */}
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-pink-500/20 via-fuchsia-500/25 to-cyan-400/20 p-0.5 border border-pink-400/40 shadow-[0_0_35px_rgba(236,72,153,0.35)] flex items-center justify-center animate-pulse">
            <div className="w-full h-full rounded-full bg-[#0c051f]/80 backdrop-blur-sm" />
          </div>

          {/* Orbiting Light Satellite Dot */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="animate-reverse-orbit w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_14px_#00e5ff] border border-white" />
          </div>

          {/* Center Emblem Core */}
          <div className="absolute inset-0 flex items-center justify-center overflow-hidden rounded-2xl">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-950 via-[#160a33] to-pink-950 border border-pink-400/60 flex items-center justify-center text-pink-300 shadow-2xl relative overflow-hidden">
              {/* Vertical Laser Scan Effect */}
              <div className="animate-scan-line absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_14px_#00e5ff]" />
              
              <Layers className="w-8 h-8 text-pink-300 animate-pulse drop-shadow-[0_0_16px_rgba(236,72,153,0.9)]" />
            </div>
          </div>
        </div>

        {/* Brand Header */}
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-900/40 border border-pink-500/30 text-pink-300 text-[10px] font-bold tracking-widest uppercase shadow-inner">
            <Sparkles className="w-3 h-3 text-pink-400 animate-bounce" />
            <span>Multi Utility Suite</span>
          </div>

          <h1 className="text-3xl font-black tracking-[0.18em] text-transparent bg-clip-text bg-gradient-to-r from-white via-pink-200 to-cyan-200 drop-shadow-[0_0_25px_rgba(236,72,153,0.6)] font-mono uppercase">
            JAVA TOOLS
          </h1>
          <p className="text-[10px] font-medium tracking-wider text-purple-200/70">
            Aplikasi Utilitas Serbaguna & Presisi
          </p>
        </div>

        {/* System Checklist Grid */}
        <div className="grid grid-cols-2 gap-2 w-full text-[10px] font-mono">
          {modules.map((m) => {
            const isReady = progress >= m.at;
            return (
              <div
                key={m.name}
                className={`p-2.5 rounded-xl border flex items-center gap-2 transition-all duration-300 ${
                  isReady
                    ? "bg-purple-950/70 border-pink-500/40 text-pink-100 shadow-[0_0_12px_rgba(236,72,153,0.15)]"
                    : "bg-purple-950/20 border-purple-900/40 text-purple-400/50"
                }`}
              >
                <CheckCircle2
                  className={`w-3.5 h-3.5 flex-shrink-0 transition-all duration-300 ${
                    isReady ? "text-emerald-400 scale-110 drop-shadow-[0_0_8px_#10b981]" : "text-purple-800"
                  }`}
                />
                <span className="truncate font-semibold">{m.name}</span>
              </div>
            );
          })}
        </div>

        {/* Progress Bar & Status Section */}
        <div className="w-full space-y-2.5">
          <div className="flex items-center justify-between text-xs font-sans">
            <span className="text-purple-200/90 font-medium text-[11px] flex items-center gap-1.5 truncate max-w-[210px]">
              <Radio className="w-3.5 h-3.5 text-pink-400 animate-ping flex-shrink-0" />
              <span className="truncate">{statusText}</span>
            </span>
            <span className="text-cyan-300 font-black font-mono text-base tracking-tight">{progress}%</span>
          </div>

          {/* Glass Progress Bar */}
          <div className="w-full h-3 rounded-full bg-white/[0.06] border border-white/10 overflow-hidden p-0.5 backdrop-blur-md shadow-inner relative">
            <div
              className="h-full rounded-full bg-gradient-to-r from-pink-500 via-fuchsia-500 to-cyan-400 transition-all duration-300 ease-out shadow-[0_0_20px_#ec4899] relative overflow-hidden"
              style={{ width: `${progress}%` }}
            >
              {/* Traveling Shimmer Light Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-shimmer" />
              {/* Glowing Tip Accent */}
              <div className="absolute right-0 top-0 bottom-0 w-2 bg-white rounded-full shadow-[0_0_12px_#ffffff]" />
            </div>
          </div>
        </div>

        {/* Security & Version Footer */}
        <div className="flex items-center justify-between w-full pt-1 border-t border-white/10 text-[10px] font-mono text-purple-300/70">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Keamanan Terjamin</span>
          </div>
          <div className="flex items-center gap-1 text-pink-300/80 font-bold">
            <Zap className="w-3 h-3 text-cyan-400" />
            <span>v2.5 PRO</span>
          </div>
        </div>

      </div>
    </div>
  );
};
