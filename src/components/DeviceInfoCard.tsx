import React, { useState, useEffect } from "react";
import { User, Battery, BatteryCharging, Shield, Monitor, Wifi } from "lucide-react";
import { DeviceInfo } from "../types";

export const DeviceInfoCard: React.FC = () => {
  const [info, setInfo] = useState<DeviceInfo>({
    country: "Indonesia",
    flag: "🇮🇩",
    device: "Android",
    browser: "Chrome",
    status: "Online",
    batteryLevel: 31,
    isCharging: false,
  });

  useEffect(() => {
    // 1. Detect Browser & OS/Device
    const userAgent = navigator.userAgent;
    let detectedDevice = "Android";
    if (/android/i.test(userAgent)) {
      detectedDevice = "Android";
    } else if (/iPhone|iPad|iPod/i.test(userAgent)) {
      detectedDevice = "iOS";
    } else if (/Win/i.test(userAgent)) {
      detectedDevice = "Windows";
    } else if (/Mac/i.test(userAgent)) {
      detectedDevice = "Macintosh";
    } else if (/Linux/i.test(userAgent)) {
      detectedDevice = "Linux";
    }

    let detectedBrowser = "Chrome";
    if (userAgent.indexOf("Edg") > -1) {
      detectedBrowser = "Edge";
    } else if (userAgent.indexOf("Chrome") > -1) {
      detectedBrowser = "Chrome";
    } else if (userAgent.indexOf("Safari") > -1) {
      detectedBrowser = "Safari";
    } else if (userAgent.indexOf("Firefox") > -1) {
      detectedBrowser = "Firefox";
    }

    setInfo((prev) => ({
      ...prev,
      device: detectedDevice,
      browser: detectedBrowser,
      status: navigator.onLine ? "Online" : "Offline",
    }));

    // 2. Battery API Detection (if supported)
    if ("getBattery" in navigator) {
      (navigator as any)
        .getBattery()
        .then((battery: any) => {
          const updateBattery = () => {
            setInfo((prev) => ({
              ...prev,
              batteryLevel: Math.round(battery.level * 100),
              isCharging: battery.charging,
            }));
          };
          updateBattery();
          battery.addEventListener("levelchange", updateBattery);
          battery.addEventListener("chargingchange", updateBattery);
        })
        .catch(() => {});
    }

    // 3. Online/Offline status listeners
    const handleOnline = () => setInfo((prev) => ({ ...prev, status: "Online" }));
    const handleOffline = () => setInfo((prev) => ({ ...prev, status: "Offline" }));
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#1a0e38]/90 via-[#13092b]/95 to-[#0e0620]/95 border border-purple-500/25 p-4 sm:p-5 shadow-xl shadow-purple-950/40 backdrop-blur-xl">
      {/* Background Subtle Glow */}
      <div className="absolute top-0 right-0 -mr-10 -mt-10 w-36 h-36 rounded-full bg-pink-500/10 blur-2xl pointer-events-none" />

      {/* Header Info Banner */}
      <div className="flex items-center justify-between border-b border-purple-800/30 pb-3 mb-3.5">
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-800 via-fuchsia-600 to-pink-500 p-0.5 shadow-md shadow-pink-500/20">
              <div className="w-full h-full rounded-[14px] bg-[#160c2d] flex items-center justify-center">
                <User className="w-5 h-5 text-pink-300" />
              </div>
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-[#120a27] shadow-[0_0_8px_#10b981]" />
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-xs font-bold text-white tracking-wide">Pengguna Java Tools</h3>
              <span className="text-xs">{info.flag}</span>
            </div>
            <p className="text-[10px] font-mono text-purple-300/70">Sistem Informasi Perangkat</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-950/60 border border-purple-700/40 text-[10px] font-mono font-bold text-emerald-400">
          <Wifi className="w-3 h-3 text-emerald-400 animate-pulse" />
          <span>{info.status}</span>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-2 gap-2.5">
        <div className="p-2.5 rounded-2xl bg-purple-950/30 border border-purple-800/30 flex items-center gap-2.5">
          <div className="p-1.5 rounded-xl bg-purple-900/50 text-pink-300">
            <Shield className="w-4 h-4" />
          </div>
          <div>
            <span className="block text-[9px] font-mono text-purple-300/60 uppercase">Negara</span>
            <span className="text-xs font-bold text-white flex items-center gap-1">
              {info.country} {info.flag}
            </span>
          </div>
        </div>

        <div className="p-2.5 rounded-2xl bg-purple-950/30 border border-purple-800/30 flex items-center gap-2.5">
          <div className="p-1.5 rounded-xl bg-purple-900/50 text-pink-300">
            <Monitor className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <span className="block text-[9px] font-mono text-purple-300/60 uppercase">Perangkat</span>
            <span className="text-xs font-bold text-white truncate block">
              {info.device} ({info.browser})
            </span>
          </div>
        </div>

        <div className="col-span-2 p-2.5 rounded-2xl bg-purple-950/30 border border-purple-800/30 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-xl bg-purple-900/50 text-pink-300">
              {info.isCharging ? (
                <BatteryCharging className="w-4 h-4 text-emerald-400 animate-pulse" />
              ) : (
                <Battery className="w-4 h-4 text-pink-400" />
              )}
            </div>
            <div>
              <span className="block text-[9px] font-mono text-purple-300/60 uppercase">Status Baterai</span>
              <span className="text-xs font-bold text-white">
                {info.isCharging ? "Sedang Diisi (Charging)" : "Penggunaan Baterai"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-20 bg-purple-950/80 h-2 rounded-full overflow-hidden border border-purple-800/50">
              <div
                className="h-full bg-gradient-to-r from-pink-500 to-purple-500 rounded-full transition-all duration-500"
                style={{ width: `${info.batteryLevel ?? 31}%` }}
              />
            </div>
            <span className="text-xs font-mono font-extrabold text-pink-300">
              {info.batteryLevel !== null ? `${info.batteryLevel}%` : "31%"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
