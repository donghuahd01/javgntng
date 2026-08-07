import React, { useState, useEffect } from "react";
import {
  X,
  Calendar as CalendarIcon,
  CloudSun,
  MapPin,
  Wind,
  Droplets,
  Sun,
  ChevronLeft,
  ChevronRight,
  Plus,
  Trash2,
  Sparkles,
  CalendarCheck,
  CheckCircle2,
  Clock,
  Thermometer,
} from "lucide-react";
import { WeatherData } from "../types";

interface WeatherCalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface AgendaEvent {
  id: string;
  dateStr: string; // YYYY-MM-DD
  title: string;
  category: "Penting" | "Pribadi" | "Kerja" | "Libur";
}

const INDONESIA_CITIES = [
  "Jakarta",
  "Surabaya",
  "Bandung",
  "Medan",
  "Yogyakarta",
  "Semarang",
  "Makassar",
  "Palembang",
  "Denpasar",
];

const NATIONAL_HOLIDAYS_2026: { [key: string]: string } = {
  "2026-01-01": "Tahun Baru 2026 Masehi",
  "2026-01-16": "Isra Mi'raj Nabi Muhammad SAW",
  "2026-02-17": "Tahun Baru Imlek 2577 Kongzili",
  "2026-03-19": "Hari Suci Nyepi (Tahun Baru Saka 1948)",
  "2026-03-20": "Hari Raya Idul Fitri 1447 H",
  "2026-03-21": "Hari Raya Idul Fitri 1447 H (Hari Ke-2)",
  "2026-04-03": "Wafat Yesus Kristus",
  "2026-05-01": "Hari Buruh Internasional",
  "2026-05-14": "Kenaikan Yesus Kristus",
  "2026-05-27": "Hari Raya Idul Adha 1447 H",
  "2026-05-31": "Hari Raya Waisak 2570 BE",
  "2026-06-01": "Hari Lahir Pancasila",
  "2026-06-16": "Tahun Baru Islam 1448 Hijriah",
  "2026-08-17": "Hari Kemerdekaan Republik Indonesia ke-81",
  "2026-08-25": "Maulid Nabi Muhammad SAW",
  "2026-12-25": "Hari Raya Natal",
};

export const WeatherCalendarModal: React.FC<WeatherCalendarModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<"weather" | "calendar">("calendar");

  // Weather State
  const [selectedCity, setSelectedCity] = useState<string>("Jakarta");
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isLoadingWeather, setIsLoadingWeather] = useState<boolean>(false);

  // Calendar State
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedDayStr, setSelectedDayStr] = useState<string>(
    new Date().toISOString().split("T")[0]
  );

  // Agenda State
  const [agendas, setAgendas] = useState<AgendaEvent[]>(() => {
    const saved = localStorage.getItem("java_tools_agendas");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    return [
      {
        id: "1",
        dateStr: new Date().toISOString().split("T")[0],
        title: "Gunakan JAVA TOOLS Multi Suite",
        category: "Penting",
      },
    ];
  });

  const [newAgendaTitle, setNewAgendaTitle] = useState<string>("");
  const [newAgendaCategory, setNewAgendaCategory] = useState<
    "Penting" | "Pribadi" | "Kerja" | "Libur"
  >("Penting");

  // Save agendas to localStorage
  useEffect(() => {
    localStorage.setItem("java_tools_agendas", JSON.stringify(agendas));
  }, [agendas]);

  // Fetch Weather
  useEffect(() => {
    if (isOpen && activeTab === "weather") {
      fetchWeather(selectedCity);
    }
  }, [isOpen, selectedCity, activeTab]);

  const fetchWeather = async (city: string) => {
    setIsLoadingWeather(true);
    try {
      const res = await fetch(`/api/weather?city=${encodeURIComponent(city)}`);
      const data = await res.json();
      if (data.success) {
        setWeatherData(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingWeather(false);
    }
  };

  const handleAddAgenda = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAgendaTitle.trim()) return;

    const item: AgendaEvent = {
      id: Date.now().toString(),
      dateStr: selectedDayStr,
      title: newAgendaTitle.trim(),
      category: newAgendaCategory,
    };

    setAgendas((prev) => [item, ...prev]);
    setNewAgendaTitle("");
  };

  const handleDeleteAgenda = (id: string) => {
    setAgendas((prev) => prev.filter((a) => a.id !== id));
  };

  // Calendar Math
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const monthNames = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDayStr(today.toISOString().split("T")[0]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in selection:bg-cyan-500 selection:text-white">
      <div className="relative w-full max-w-4xl h-[92vh] bg-[#080318] border border-cyan-500/30 rounded-3xl shadow-[0_0_50px_rgba(6,182,212,0.2)] flex flex-col overflow-hidden text-purple-100">
        
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-purple-800/40 bg-purple-950/40 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/30">
              <CalendarIcon className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                <span>Kalender & Cuaca Realtime</span>
              </h2>
              <p className="text-xs text-purple-300/80">
                Prakiraan Cuaca Indonesia • Agenda Catatan • Hari Libur Nasional
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2.5 rounded-full bg-purple-900/40 border border-purple-700/50 text-purple-300 hover:text-white hover:bg-rose-500/20 hover:border-rose-500/50 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-purple-800/40 bg-purple-950/20 px-6 pt-3 gap-3">
          <button
            onClick={() => setActiveTab("calendar")}
            className={`pb-3 px-4 font-bold text-xs sm:text-sm border-b-2 flex items-center gap-2 transition-all ${
              activeTab === "calendar"
                ? "border-cyan-400 text-cyan-300"
                : "border-transparent text-purple-300/70 hover:text-white"
            }`}
          >
            <CalendarCheck className="w-4 h-4" />
            <span>Kalender & Agenda</span>
          </button>

          <button
            onClick={() => setActiveTab("weather")}
            className={`pb-3 px-4 font-bold text-xs sm:text-sm border-b-2 flex items-center gap-2 transition-all ${
              activeTab === "weather"
                ? "border-cyan-400 text-cyan-300"
                : "border-transparent text-purple-300/70 hover:text-white"
            }`}
          >
            <CloudSun className="w-4 h-4" />
            <span>Cuaca Realtime</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 custom-scrollbar">
          
          {/* TAB 1: KALENDER & AGENDA */}
          {activeTab === "calendar" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Left Column: Interactive Calendar Grid */}
              <div className="lg:col-span-2 space-y-4">
                {/* Month Navigator Header */}
                <div className="flex items-center justify-between bg-purple-950/40 p-3.5 rounded-2xl border border-purple-800/40">
                  <button
                    onClick={handlePrevMonth}
                    className="p-2 rounded-xl bg-purple-900/40 border border-purple-700/40 text-purple-200 hover:bg-cyan-600/30 hover:border-cyan-500 transition-all"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <div className="text-center">
                    <h3 className="font-extrabold text-white text-base sm:text-lg">
                      {monthNames[month]} {year}
                    </h3>
                    <p className="text-[11px] text-cyan-400 font-mono">
                      Kalender Masehi Indonesia
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleToday}
                      className="px-3 py-1.5 rounded-xl bg-cyan-950 border border-cyan-500/40 text-cyan-300 font-mono text-xs font-bold hover:bg-cyan-500 hover:text-white transition-all"
                    >
                      Hari Ini
                    </button>
                    <button
                      onClick={handleNextMonth}
                      className="p-2 rounded-xl bg-purple-900/40 border border-purple-700/40 text-purple-200 hover:bg-cyan-600/30 hover:border-cyan-500 transition-all"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Calendar Days Header */}
                <div className="grid grid-cols-7 gap-1 text-center font-mono text-xs font-bold text-purple-300/80 py-1">
                  <span className="text-rose-400">Min</span>
                  <span>Sen</span>
                  <span>Sel</span>
                  <span>Rab</span>
                  <span>Kam</span>
                  <span>Jum</span>
                  <span className="text-cyan-400">Sab</span>
                </div>

                {/* Days Grid */}
                <div className="grid grid-cols-7 gap-1.5">
                  {/* Empty Cells before first day */}
                  {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                    <div key={`empty-${i}`} className="h-12 rounded-xl bg-transparent" />
                  ))}

                  {/* Day Cells */}
                  {Array.from({ length: daysInMonth }).map((_, i) => {
                    const dayNum = i + 1;
                    const dateFormatted = `${year}-${String(
                      month + 1
                    ).padStart(2, "0")}-${String(dayNum).padStart(2, "0")}`;

                    const isToday =
                      new Date().toISOString().split("T")[0] === dateFormatted;
                    const isSelected = selectedDayStr === dateFormatted;
                    const holidayName = NATIONAL_HOLIDAYS_2026[dateFormatted];
                    const hasAgenda = agendas.some(
                      (a) => a.dateStr === dateFormatted
                    );

                    return (
                      <button
                        key={dayNum}
                        onClick={() => setSelectedDayStr(dateFormatted)}
                        className={`h-12 rounded-2xl border flex flex-col items-center justify-center p-1 relative transition-all duration-150 ${
                          isSelected
                            ? "bg-cyan-500 text-white font-bold border-white shadow-[0_0_15px_#00e5ff]"
                            : isToday
                            ? "bg-purple-800/80 text-white border-cyan-400 shadow-md font-bold"
                            : holidayName
                            ? "bg-rose-950/40 border-rose-500/40 text-rose-300 hover:bg-rose-900/40"
                            : "bg-purple-950/30 border-purple-800/40 text-purple-200 hover:bg-purple-900/40"
                        }`}
                      >
                        <span className="text-xs">{dayNum}</span>

                        {/* Event / Holiday Dots Indicator */}
                        <div className="flex gap-1 mt-0.5">
                          {holidayName && (
                            <div className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                          )}
                          {hasAgenda && (
                            <div className="w-1.5 h-1.5 rounded-full bg-cyan-300 animate-pulse" />
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Calendar Legend */}
                <div className="flex items-center gap-4 text-[11px] font-mono text-purple-300/80 pt-2">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                    <span>Hari Libur</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                    <span>Catatan Agenda</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Selected Date Details & Agenda Creator */}
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-purple-950/40 border border-purple-800/40 space-y-3">
                  <h4 className="font-bold text-white text-sm flex items-center gap-2">
                    <CalendarCheck className="w-4 h-4 text-cyan-400" />
                    <span>Tanggal Ditunjuk:</span>
                  </h4>
                  <p className="text-sm font-mono text-cyan-300 font-semibold bg-purple-900/40 px-3 py-2 rounded-xl border border-purple-700/40">
                    {selectedDayStr}
                  </p>

                  {/* Holiday Banner if any */}
                  {NATIONAL_HOLIDAYS_2026[selectedDayStr] && (
                    <div className="p-3 rounded-xl bg-rose-950/50 border border-rose-500/40 text-rose-300 text-xs font-semibold flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-rose-400 flex-shrink-0" />
                      <span>{NATIONAL_HOLIDAYS_2026[selectedDayStr]}</span>
                    </div>
                  )}
                </div>

                {/* Add Agenda Form */}
                <form
                  onSubmit={handleAddAgenda}
                  className="p-4 rounded-2xl bg-purple-950/40 border border-purple-800/40 space-y-3"
                >
                  <h4 className="font-bold text-white text-sm">
                    Tambah Catatan / Agenda:
                  </h4>
                  <input
                    type="text"
                    value={newAgendaTitle}
                    onChange={(e) => setNewAgendaTitle(e.target.value)}
                    placeholder="Judul agenda (contoh: Rapat Tim, Ujian)..."
                    className="w-full px-3 py-2 rounded-xl bg-purple-900/50 border border-purple-700/50 text-xs text-white placeholder-purple-400/60 focus:outline-none focus:border-cyan-400"
                  />

                  <div className="flex gap-2">
                    <select
                      value={newAgendaCategory}
                      onChange={(e: any) => setNewAgendaCategory(e.target.value)}
                      className="px-3 py-2 rounded-xl bg-purple-900/50 border border-purple-700/50 text-xs text-purple-200"
                    >
                      <option value="Penting">Penting</option>
                      <option value="Pribadi">Pribadi</option>
                      <option value="Kerja">Kerja</option>
                      <option value="Libur">Libur</option>
                    </select>

                    <button
                      type="submit"
                      className="flex-1 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Simpan Agenda</span>
                    </button>
                  </div>
                </form>

                {/* Agendas for Selected Date */}
                <div className="space-y-2">
                  <h4 className="font-bold text-white text-xs font-mono uppercase text-purple-300/80">
                    Daftar Agenda Tanggal Ini ({selectedDayStr})
                  </h4>

                  <div className="space-y-2 max-h-56 overflow-y-auto custom-scrollbar pr-1">
                    {agendas
                      .filter((a) => a.dateStr === selectedDayStr)
                      .map((a) => (
                        <div
                          key={a.id}
                          className="p-3 rounded-xl bg-purple-900/30 border border-purple-800/40 flex items-center justify-between gap-2 text-xs"
                        >
                          <div className="min-w-0">
                            <span className="font-bold text-white block truncate">
                              {a.title}
                            </span>
                            <span className="text-[10px] font-mono text-cyan-400">
                              [{a.category}]
                            </span>
                          </div>

                          <button
                            onClick={() => handleDeleteAgenda(a.id)}
                            className="p-1.5 rounded-lg hover:bg-rose-500/20 text-purple-400 hover:text-rose-400 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}

                    {agendas.filter((a) => a.dateStr === selectedDayStr).length ===
                      0 && (
                      <p className="text-xs text-purple-400/60 italic py-3 text-center">
                        Belum ada agenda tersimpan di tanggal ini.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CUACA REALTIME */}
          {activeTab === "weather" && (
            <div className="space-y-6">
              {/* City Selection Bar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-purple-950/40 p-4 rounded-2xl border border-purple-800/40">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-cyan-400" />
                  <span className="font-bold text-white text-sm">Pilih Kota:</span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {INDONESIA_CITIES.map((city) => (
                    <button
                      key={city}
                      onClick={() => setSelectedCity(city)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                        selectedCity === city
                          ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20"
                          : "bg-purple-900/30 text-purple-300 border border-purple-800/50 hover:text-white"
                      }`}
                    >
                      {city}
                    </button>
                  ))}
                </div>
              </div>

              {/* Weather Display */}
              {isLoadingWeather ? (
                <div className="h-64 rounded-3xl bg-purple-950/30 border border-purple-900/40 animate-pulse flex items-center justify-center">
                  <span className="text-xs text-purple-300 font-mono">
                    Memuat data cuaca realtime {selectedCity}...
                  </span>
                </div>
              ) : weatherData ? (
                <div className="space-y-6">
                  {/* Main Weather Card */}
                  <div className="relative p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-cyan-950/80 via-purple-950/80 to-blue-950/80 border border-cyan-500/40 flex flex-col sm:flex-row items-center justify-between gap-6 overflow-hidden shadow-xl">
                    <div className="space-y-2 text-center sm:text-left">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-900/40 border border-cyan-500/30 text-cyan-300 text-xs font-mono">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>Kota {weatherData.city}, Indonesia</span>
                      </div>

                      <div className="flex items-baseline justify-center sm:justify-start gap-2">
                        <span className="text-5xl sm:text-6xl font-black text-white font-mono">
                          {weatherData.temperature}°
                        </span>
                        <span className="text-2xl text-cyan-300 font-bold">C</span>
                      </div>

                      <p className="text-lg font-bold text-cyan-200">
                        {weatherData.condition}
                      </p>
                    </div>

                    {/* Weather Icon & Stats */}
                    <div className="flex flex-col items-center sm:items-end space-y-4">
                      <span className="text-6xl sm:text-7xl drop-shadow-[0_0_20px_rgba(0,229,255,0.4)]">
                        {weatherData.icon}
                      </span>

                      <div className="grid grid-cols-2 gap-3 text-xs font-mono bg-purple-900/50 p-3 rounded-2xl border border-purple-700/40">
                        <div className="flex items-center gap-1.5 text-purple-200">
                          <Droplets className="w-4 h-4 text-cyan-400" />
                          <span>Kelembaban: {weatherData.humidity}%</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-purple-200">
                          <Wind className="w-4 h-4 text-cyan-400" />
                          <span>Angin: {weatherData.windSpeed} km/h</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 5-Day Forecast Grid */}
                  <div className="space-y-3">
                    <h3 className="font-extrabold text-white text-sm flex items-center gap-2">
                      <CloudSun className="w-4 h-4 text-cyan-400" />
                      <span>Prakiraan Cuaca 5 Hari Ke Depan</span>
                    </h3>

                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                      {weatherData.forecast?.map((item, index) => (
                        <div
                          key={index}
                          className="p-4 rounded-2xl bg-purple-950/40 border border-purple-800/40 text-center space-y-2 hover:border-cyan-500/50 transition-all"
                        >
                          <span className="text-xs font-bold text-purple-200 block font-mono">
                            {item.day}
                          </span>
                          <span className="text-3xl block">{item.icon}</span>
                          <span className="text-xs font-semibold text-cyan-300 block">
                            {item.condition}
                          </span>
                          <div className="text-[11px] font-mono text-purple-300/80">
                            <span>{item.tempMin}°</span> -{" "}
                            <span className="text-white font-bold">
                              {item.tempMax}°C
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-center text-xs text-purple-400 py-8">
                  Data cuaca tidak dapat dimuat.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
