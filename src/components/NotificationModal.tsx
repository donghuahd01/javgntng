import React from "react";
import { Bell, X, Sparkles, CheckCircle2, ShieldCheck, Clock } from "lucide-react";

interface NotificationModalProps {
  onClose: () => void;
}

export const NotificationModal: React.FC<NotificationModalProps> = ({ onClose }) => {
  const notifications = [
    {
      id: 1,
      title: "TikTok Downloader v2.5 Online",
      desc: "Fitur unduh video TikTok tanpa watermark & MP3 audio kini terintegrasi dengan API pihak ketiga super cepat.",
      time: "Baru saja",
      icon: <Sparkles className="w-4 h-4 text-pink-400" />,
    },
    {
      id: 2,
      title: "Penerjemah Bahasa Multi-Tone",
      desc: "Mendukung 50+ bahasa dengan mode pilihan gaya Formal, Santai/Daily, dan Slang/Gaul serta fitur pengucapan suara.",
      time: "5 menit lalu",
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-400" />,
    },
    {
      id: 3,
      title: "Jadwal Sholat Otomatis",
      desc: "Jadwal sholat otomatis terintegrasi dengan API Aladhan untuk wilayah Jakarta & kota-kota besar Indonesia.",
      time: "Hari ini",
      icon: <Clock className="w-4 h-4 text-purple-400" />,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="w-full max-w-sm rounded-3xl bg-[#140b2b] border border-purple-500/40 p-5 shadow-2xl space-y-4 relative">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-purple-800/40 pb-3">
          <div className="flex items-center gap-2 text-white font-bold text-sm">
            <Bell className="w-4 h-4 text-pink-400 animate-bounce" />
            <span>Pemberitahuan & Update</span>
          </div>
          <button
            onClick={onClose}
            aria-label="Tutup Notifikasi"
            className="p-1.5 rounded-xl bg-purple-900/40 hover:bg-purple-800/60 text-purple-300 hover:text-white transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Notifications List */}
        <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
          {notifications.map((n) => (
            <div
              key={n.id}
              className="p-3 rounded-2xl bg-purple-950/40 border border-purple-800/30 space-y-1 hover:border-purple-600/40 transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {n.icon}
                  <h4 className="text-xs font-bold text-white">{n.title}</h4>
                </div>
                <span className="text-[9px] text-purple-400 font-mono">{n.time}</span>
              </div>
              <p className="text-[11px] text-purple-200/80 leading-relaxed pl-6">{n.desc}</p>
            </div>
          ))}
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-purple-800/50 hover:bg-purple-700/60 text-purple-200 text-xs font-bold border border-purple-600/30 transition-all"
        >
          Tutup Pemberitahuan
        </button>
      </div>
    </div>
  );
};
