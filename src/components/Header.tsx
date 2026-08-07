import React from "react";
import { Home, Bell } from "lucide-react";

interface HeaderProps {
  onHomeClick: () => void;
  onNotificationClick: () => void;
  hasUnreadNotifications?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onHomeClick,
  onNotificationClick,
  hasUnreadNotifications = true,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-[#0c071e]/85 backdrop-blur-md border-b border-purple-900/30 px-4 py-3.5 transition-all">
      <div className="max-w-md mx-auto flex items-center justify-between">
        {/* Home Button */}
        <button
          onClick={onHomeClick}
          aria-label="Kembali ke Beranda"
          className="w-11 h-11 rounded-2xl bg-purple-950/70 border border-purple-500/30 flex items-center justify-center text-purple-300 hover:text-white hover:bg-purple-900/50 hover:border-purple-400/50 transition-all active:scale-95 shadow-lg shadow-purple-950/40"
        >
          <Home className="w-5 h-5" />
        </button>

        {/* Title Brand */}
        <div className="text-center flex flex-col items-center">
          <h1 className="rainbow-text text-2xl font-black tracking-wider drop-shadow-[0_0_16px_rgba(217,70,239,0.5)] font-mono">
            JAVA TOOLS
          </h1>
          <p className="text-[10px] font-semibold tracking-[0.25em] text-purple-300/80 uppercase">
            Multi Utility Suite
          </p>
        </div>

        {/* Notification Button */}
        <button
          onClick={onNotificationClick}
          aria-label="Buka Notifikasi"
          className="relative w-11 h-11 rounded-2xl bg-purple-950/70 border border-purple-500/30 flex items-center justify-center text-purple-300 hover:text-white hover:bg-purple-900/50 hover:border-purple-400/50 transition-all active:scale-95 shadow-lg shadow-purple-950/40"
        >
          <Bell className="w-5 h-5" />
          {hasUnreadNotifications && (
            <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 rounded-full bg-pink-500 animate-ping" />
          )}
          {hasUnreadNotifications && (
            <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 rounded-full bg-pink-500 shadow-[0_0_8px_#ec4899]" />
          )}
        </button>
      </div>
    </header>
  );
};
