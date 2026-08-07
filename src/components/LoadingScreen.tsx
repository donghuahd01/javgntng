import React, { useState, useEffect } from "react";
import { Cpu, ShieldCheck, CheckCircle2, Sparkles, Zap, Radio } from "lucide-react";

interface LoadingScreenProps {
  onComplete: () => void;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState<number>(0);
  const [statusText, setStatusText] = useState<string>("Inisialisasi Sistem...");
  const [isFadingOut, setIsFadingOut] = useState<boolean>(false);

  // System modules status
  const modules = [
    { name: "Core System", at: 10 },
    { name: "TikTok Downloader", at: 35 },
    { name: "Terjemahkan Bahasa", at: 60 },
    { name: "Jadwal Sholat", at: 85 },
  ];

  useEffect(() => {
    const statuses = [
      { at: 15, text: "Menyiapkan Multi Utility Suite..." },
      { at: 40, text: "Menghubungkan API Jadwal Sholat..." },
      { at: 70, text: "Memuat TikTok & Terjemahkan Engine..." },
      { at: 90, text: "Mengoptimalkan Performa App..." },
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

        const next = prev + Math.floor(Math.random() * 10) + 5;
        const boundedNext = Math.min(next, 100);

        const currentStatus = statuses.find((s) => boundedNext >= s.at);
        if (currentStatus) {
          setStatusText(currentStatus.text);
        }

        return boundedNext;
      });
    }, 110);

    return () => clearInterval(timer);
  }, [onComplete]);

  // Floating Particles Config
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
      className={`fixed inset-0 z-50 bg-[#060210] flex flex-col items-center justify-center p-6 overflow-hidden transition-opacity duration-500 selection:bg-pink-500 selection:text-white ${
        isFadingOut ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      {/* Background Animated Floating Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {particles.map((p, index) => (
          <div
            key={index}
            className={`animate-float-particle absolute rounded-full ${p.color} ${p.size} shadow-[0_0_10px_currentColor]`}
            style={{
              left: p.left,
              bottom: p.bottom,
              animationDelay: p.delay,
            }}
          />
        ))}
      </div>

      {/* Background Ambient Spheres */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-600/20 rounded-full blur-[110px] pointer-events-none" />
      <div className="absolute bottom-1/3 left-1/2 -translate-x-1/2 w-80 h-80 bg-pink-600/15 rounded-full blur-[110px] pointer-events-none" />

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-sm flex flex-col items-center text-center space-y-7">
        
        {/* Animated 3D Core Logo Module */}
        <div className="relative flex items-center justify-center">
          {/* Concentric Expanding Radar Energy Rings */}
          <div className="animate-expand-ring absolute w-28 h-28 rounded-full border border-pink-500/40 pointer-events-none" />
          <div
            className="animate-expand-ring absolute w-28 h-28 rounded-full border border-cyan-400/30 pointer-events-none"
            style={{ animationDelay: "1.2s" }}
          />

          {/* Outer Rotating Glowing Square Ring */}
          <div className="w-28 h-28 rounded-3xl bg-gradient-to-tr from-pink-500 via-fuchsia-500 to-cyan-400 p-0.5 animate-spin [animation-duration:5s] shadow-[0_0_35px_rgba(236,72,153,0.5)]">
            <div className="w-full h-full rounded-[22px] bg-[#0c051f]" />
          </div>

          {/* Counter-Clockwise Orbiting Satellite Particle */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="animate-reverse-orbit w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_12px_#00e5ff] border border-white" />
          </div>

          {/* Inner Core Card with Laser Scan Line */}
          <div className="absolute inset-0 flex items-center justify-center overflow-hidden rounded-2xl">
            <div className="w-18 h-18 rounded-2xl bg-gradient-to-tr from-purple-950 via-[#180b33] to-pink-950 border border-pink-400/60 flex items-center justify-center text-pink-300 shadow-2xl relative overflow-hidden">
              {/* Laser Scan Line Sweeping Vertically */}
              <div className="animate-scan-line absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_8px_#00e5ff]" />
              
              <Cpu className="w-9 h-9 text-pink-400 animate-pulse drop-shadow-[0_0_12px_rgba(236,72,153,0.8)]" />
            </div>
          </div>
        </div>

        {/* Brand Title with Rainbow Animation */}
        <div className="space-y-1">
          <div className="flex items-center justify-center gap-1.5">
            <Sparkles className="w-4 h-4 text-pink-400 animate-bounce" />
            <h1 className="rainbow-text text-3xl font-black tracking-wider drop-shadow-[0_0_20px_rgba(217,70,239,0.7)] font-mono">
              JAVA TOOLS
            </h1>
            <Zap className="w-4 h-4 text-cyan-400 animate-pulse" />
          </div>
          <p className="text-[10px] font-bold tracking-[0.35em] text-purple-300/80 uppercase">
            Multi Utility Suite v2.5
          </p>
        </div>

        {/* System Modules Checklist */}
        <div className="grid grid-cols-2 gap-2 w-full text-[10px] font-mono">
          {modules.map((m) => {
            const isReady = progress >= m.at;
            return (
              <div
                key={m.name}
                className={`p-2 rounded-xl border flex items-center gap-1.5 transition-all ${
                  isReady
                    ? "bg-purple-950/60 border-pink-500/40 text-pink-200 shadow-sm"
                    : "bg-purple-950/20 border-purple-900/40 text-purple-400/50"
                }`}
              >
                <CheckCircle2
                  className={`w-3.5 h-3.5 flex-shrink-0 transition-colors ${
                    isReady ? "text-emerald-400" : "text-purple-700"
                  }`}
                />
                <span className="truncate">{m.name}</span>
              </div>
            );
          })}
        </div>

        {/* Glowing Progress Bar Container */}
        <div className="w-full space-y-2.5">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-purple-300/90 font-semibold flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-pink-400 animate-ping" />
              {statusText}
            </span>
            <span className="text-cyan-300 font-extrabold font-mono text-sm">{progress}%</span>
          </div>

          {/* Glowing Track & Fill Bar */}
          <div className="w-full h-3 rounded-full bg-purple-950/90 border border-purple-800/60 overflow-hidden p-0.5 shadow-inner relative">
            <div
              className="h-full rounded-full bg-gradient-to-r from-pink-500 via-fuchsia-500 to-cyan-400 transition-all duration-200 ease-out shadow-[0_0_15px_#ec4899] relative"
              style={{ width: `${progress}%` }}
            >
              {/* Particle highlight at tip of bar */}
              <div className="absolute right-0 top-0 bottom-0 w-2 bg-white rounded-full shadow-[0_0_10px_#ffffff]" />
            </div>
          </div>
        </div>

        {/* Security / System Footer Badge */}
        <div className="flex items-center gap-2 text-[10px] font-mono text-purple-300/70 bg-purple-950/40 px-3.5 py-1.5 rounded-full border border-purple-800/40 shadow-sm">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Sistem Terverifikasi • Bebas Iklan</span>
        </div>

      </div>
    </div>
  );
};
