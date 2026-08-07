import React, { useState, useEffect, useRef } from "react";
import {
  X,
  Search,
  BookOpen,
  Volume2,
  VolumeX,
  Play,
  Pause,
  ArrowLeft,
  Sparkles,
  Bookmark,
  Share2,
  Info,
  ChevronRight,
  ListFilter,
  Check,
} from "lucide-react";
import { SurahSummary, SurahDetail, AyatItem } from "../types";

interface QuranModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QuranModal: React.FC<QuranModalProps> = ({ isOpen, onClose }) => {
  const [surahList, setSurahList] = useState<SurahSummary[]>([]);
  const [filteredSurahs, setFilteredSurahs] = useState<SurahSummary[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filterRevelation, setFilterRevelation] = useState<"All" | "Makkiyyah" | "Madaniyyah">("All");

  const [selectedSurah, setSelectedSurah] = useState<SurahDetail | null>(null);
  const [isLoadingList, setIsLoadingList] = useState<boolean>(true);
  const [isLoadingDetail, setIsLoadingDetail] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Audio Playback State
  const [currentAudioUrl, setCurrentAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playingAyatNomor, setPlayingAyatNomor] = useState<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Bookmarks
  const [bookmarkedVerses, setBookmarkedVerses] = useState<{ [key: string]: boolean }>({});

  // Qari Selection state (default: Mishary Alafasy - HQ Jernih)
  const [selectedQari, setSelectedQari] = useState<"alafasy" | "sudais" | "abdulbasit" | "minshawi">("alafasy");

  const QARI_OPTIONS = [
    { id: "alafasy", name: "Mishary Al-Afasy", detail: "HQ 128kbps (Jernih HD)" },
    { id: "sudais", name: "Abdurrahman As-Sudais", detail: "192kbps (Masjidil Haram)" },
    { id: "abdulbasit", name: "Abdul Basit", detail: "192kbps (Murattal)" },
    { id: "minshawi", name: "Siddiq Al-Minshawi", detail: "128kbps (Murattal)" },
  ] as const;

  const getSurahAudioUrl = (qariId: string, surahNo: number, audioFullObj?: Record<string, string>) => {
    const s3 = String(surahNo).padStart(3, "0");
    if (qariId === "alafasy") {
      return `https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/${surahNo}.mp3`;
    }
    if (qariId === "sudais") {
      return `https://cdn.islamic.network/quran/audio-surah/128/ar.abdurrahmaanas-sudais/${surahNo}.mp3`;
    }
    if (qariId === "abdulbasit") {
      return `https://download.quranicaudio.com/quran/abdul_basit_murattal/${s3}.mp3`;
    }
    if (qariId === "minshawi") {
      return `https://download.quranicaudio.com/quran/muhammad_siddeeq_al-minshaawi/${s3}.mp3`;
    }
    return `https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/${surahNo}.mp3`;
  };

  const getAyatAudioUrl = (qariId: string, surahNo: number, ayatNo: number) => {
    const s3 = String(surahNo).padStart(3, "0");
    const a3 = String(ayatNo).padStart(3, "0");
    if (qariId === "alafasy") {
      return `https://everyayah.com/data/Alafasy_128kbps/${s3}${a3}.mp3`;
    }
    if (qariId === "sudais") {
      return `https://everyayah.com/data/Sudais_192kbps/${s3}${a3}.mp3`;
    }
    if (qariId === "abdulbasit") {
      return `https://everyayah.com/data/Abdul_Basit_Murattal_192kbps/${s3}${a3}.mp3`;
    }
    if (qariId === "minshawi") {
      return `https://everyayah.com/data/Minshawy_Murattal_128kbps/${s3}${a3}.mp3`;
    }
    return `https://everyayah.com/data/Alafasy_128kbps/${s3}${a3}.mp3`;
  };

  useEffect(() => {
    if (isOpen) {
      fetchSurahList();
    } else {
      stopAudio();
    }
  }, [isOpen]);

  const fetchSurahList = async () => {
    setIsLoadingList(true);
    setErrorMsg(null);
    try {
      const res = await fetch("/api/quran/surat");
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setSurahList(data.data);
        setFilteredSurahs(data.data);
      } else {
        throw new Error("Gagal mengambil data surat");
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Gagal memuat daftar surat Al-Qur'an. Periksa koneksi internet.");
    } finally {
      setIsLoadingList(false);
    }
  };

  const fetchSurahDetail = async (surahNumber: number) => {
    setIsLoadingDetail(true);
    setErrorMsg(null);
    stopAudio();
    try {
      const res = await fetch(`/api/quran/surat/${surahNumber}`);
      const data = await res.json();
      if (data.success && data.data) {
        setSelectedSurah(data.data);
      } else {
        throw new Error("Gagal memuat detail surat");
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Terjadi kesalahan saat memuat ayat-ayat Al-Qur'an.");
    } finally {
      setIsLoadingDetail(false);
    }
  };

  // Filter Search
  useEffect(() => {
    let result = surahList;

    if (filterRevelation !== "All") {
      result = result.filter(
        (s) => s.tempatTurun.toLowerCase() === filterRevelation.toLowerCase()
      );
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (s) =>
          s.namaLatin.toLowerCase().includes(q) ||
          s.arti.toLowerCase().includes(q) ||
          s.nomor.toString() === q
      );
    }

    setFilteredSurahs(result);
  }, [searchQuery, filterRevelation, surahList]);

  // Handle Audio Playback
  const playAudio = (url: string, ayatNo: number | null = null) => {
    if (!url) return;

    if (currentAudioUrl === url && isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
      return;
    }

    if (audioRef.current) {
      audioRef.current.pause();
    }

    const audio = new Audio(url);
    audioRef.current = audio;
    setCurrentAudioUrl(url);
    setPlayingAyatNomor(ayatNo);
    setIsPlaying(true);

    audio.play().catch((e) => {
      console.warn("Audio play error:", e);
      setIsPlaying(false);
    });

    audio.onended = () => {
      setIsPlaying(false);
      setPlayingAyatNomor(null);
    };
  };

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setIsPlaying(false);
    setCurrentAudioUrl(null);
    setPlayingAyatNomor(null);
  };

  const toggleBookmark = (surahNo: number, ayatNo: number) => {
    const key = `${surahNo}:${ayatNo}`;
    setBookmarkedVerses((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in selection:bg-emerald-500 selection:text-white">
      <div className="relative w-full max-w-4xl h-[92vh] bg-[#0c061a] border border-emerald-500/30 rounded-3xl shadow-[0_0_50px_rgba(16,185,129,0.2)] flex flex-col overflow-hidden text-purple-100">
        
        {/* Header Bar */}
        <div className="p-4 sm:p-5 border-b border-purple-800/40 bg-purple-950/40 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            {selectedSurah ? (
              <button
                onClick={() => {
                  setSelectedSurah(null);
                  stopAudio();
                }}
                className="p-2 rounded-xl bg-purple-900/40 border border-purple-700/50 hover:bg-emerald-600/30 text-emerald-300 transition-all flex items-center gap-1.5 text-xs font-semibold"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Daftar Surat</span>
              </button>
            ) : (
              <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-lg shadow-emerald-500/30">
                <BookOpen className="w-6 h-6" />
              </div>
            )}

            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                {selectedSurah ? (
                  <>
                    <span>Surat {selectedSurah.namaLatin}</span>
                    <span className="text-emerald-400 font-serif text-lg">({selectedSurah.nama})</span>
                  </>
                ) : (
                  "Al-Qur'an Digital 30 Juz"
                )}
              </h2>
              <p className="text-xs text-purple-300/80">
                {selectedSurah
                  ? `${selectedSurah.arti} • ${selectedSurah.jumlahAyat} Ayat • ${selectedSurah.tempatTurun}`
                  : "Teks Arab, Latin, Terjemahan Lengkap & Audio Qari"}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              stopAudio();
              onClose();
            }}
            className="p-2.5 rounded-full bg-purple-900/40 border border-purple-700/50 text-purple-300 hover:text-white hover:bg-rose-500/20 hover:border-rose-500/50 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 custom-scrollbar">
          {errorMsg && (
            <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs flex items-center justify-between">
              <span>{errorMsg}</span>
              <button
                onClick={fetchSurahList}
                className="px-3 py-1 bg-rose-600/40 rounded-lg font-semibold hover:bg-rose-600/60"
              >
                Coba Lagi
              </button>
            </div>
          )}

          {/* VIEW 1: SURAH LIST */}
          {!selectedSurah && (
            <div className="space-y-5">
              {/* Qari Selector Bar */}
              <div className="p-3.5 rounded-2xl bg-purple-950/40 border border-purple-800/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-300">
                  <Volume2 className="w-4 h-4 text-emerald-400" />
                  <span>Pilih Qari Murottal (Audio Jernih HD):</span>
                </div>
                <div className="flex flex-wrap gap-1.5 w-full sm:w-auto">
                  {QARI_OPTIONS.map((q) => (
                    <button
                      key={q.id}
                      onClick={() => {
                        stopAudio();
                        setSelectedQari(q.id as any);
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                        selectedQari === q.id
                          ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md font-bold"
                          : "bg-purple-900/40 text-purple-300 hover:text-white border border-purple-800/40"
                      }`}
                      title={q.detail}
                    >
                      {q.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Search & Filter Bar */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari nama surat (cth: Yasin, Al-Mulk, Al-Baqarah) atau nomor (1-114)..."
                    className="w-full pl-11 pr-4 py-3 rounded-2xl bg-purple-950/50 border border-purple-800/60 text-sm text-white placeholder-purple-400/60 focus:outline-none focus:border-emerald-400/80 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-purple-400 hover:text-white"
                    >
                      Batal
                    </button>
                  )}
                </div>

                {/* Revelation Category Tabs */}
                <div className="flex bg-purple-950/60 p-1 rounded-2xl border border-purple-800/50 self-start sm:self-auto text-xs font-semibold">
                  {(["All", "Makkiyyah", "Madaniyyah"] as const).map((type) => (
                    <button
                      key={type}
                      onClick={() => setFilterRevelation(type)}
                      className={`px-3 py-2 rounded-xl transition-all ${
                        filterRevelation === type
                          ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md"
                          : "text-purple-300/80 hover:text-white"
                      }`}
                    >
                      {type === "All" ? "Semua Surat" : type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Surah Cards Grid */}
              {isLoadingList ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 py-8">
                  {Array.from({ length: 9 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-24 rounded-2xl bg-purple-950/30 border border-purple-900/40 animate-pulse"
                    />
                  ))}
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                    {filteredSurahs.map((surah) => {
                      const audioUrl = getSurahAudioUrl(selectedQari, surah.nomor, surah.audioFull);

                      const isThisPlaying =
                        isPlaying && currentAudioUrl === audioUrl;

                      return (
                        <div
                          key={surah.nomor}
                          onClick={() => fetchSurahDetail(surah.nomor)}
                          className="group relative p-4 rounded-2xl bg-purple-950/30 border border-purple-800/40 hover:border-emerald-500/60 hover:bg-purple-900/30 transition-all duration-200 cursor-pointer flex items-center justify-between gap-3 shadow-sm hover:shadow-[0_0_20px_rgba(16,185,129,0.15)]"
                        >
                          <div className="flex items-center gap-3.5 min-w-0">
                            {/* Surah Number Badge */}
                            <div className="w-10 h-10 rounded-xl bg-purple-900/50 border border-emerald-500/30 group-hover:border-emerald-400 group-hover:bg-emerald-950/50 flex items-center justify-center flex-shrink-0 text-emerald-300 font-mono text-sm font-bold transition-all">
                              {surah.nomor}
                            </div>

                            <div className="min-w-0">
                              <h3 className="font-bold text-white text-sm group-hover:text-emerald-300 transition-colors truncate">
                                {surah.namaLatin}
                              </h3>
                              <p className="text-xs text-purple-300/70 truncate">
                                {surah.arti}
                              </p>
                              <div className="flex items-center gap-2 mt-1 text-[10px] text-purple-400/80 font-mono">
                                <span>{surah.jumlahAyat} Ayat</span>
                                <span>•</span>
                                <span className="text-teal-400">{surah.tempatTurun}</span>
                              </div>
                            </div>
                          </div>

                          {/* Right Side: Arabic Name & Quick Play Button */}
                          <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                            <span className="text-lg font-serif text-emerald-400 font-semibold group-hover:scale-105 transition-transform">
                              {surah.nama}
                            </span>

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                playAudio(audioUrl, null);
                              }}
                              title={`Dengarkan Audio Surat (${QARI_OPTIONS.find(q => q.id === selectedQari)?.name})`}
                              className={`p-2 rounded-xl transition-all ${
                                isThisPlaying
                                  ? "bg-pink-500 text-white animate-pulse"
                                  : "bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-500 hover:text-white"
                              }`}
                            >
                              {isThisPlaying ? (
                                <Pause className="w-3.5 h-3.5" />
                              ) : (
                                <Play className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {filteredSurahs.length === 0 && (
                    <div className="text-center py-12 space-y-3">
                      <BookOpen className="w-12 h-12 text-purple-500/40 mx-auto" />
                      <p className="text-purple-300/70 text-sm font-medium">
                        Tidak ada surat yang cocok dengan pencarian "{searchQuery}".
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* VIEW 2: SURAH DETAIL & AYAT */}
          {selectedSurah && (
            <div className="space-y-6">
              {/* Qari Selector inside Detail View */}
              <div className="p-3.5 rounded-2xl bg-purple-950/40 border border-purple-800/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-300">
                  <Volume2 className="w-4 h-4 text-emerald-400" />
                  <span>Qari Murottal Dipilih:</span>
                </div>
                <div className="flex flex-wrap gap-1.5 w-full sm:w-auto">
                  {QARI_OPTIONS.map((q) => (
                    <button
                      key={q.id}
                      onClick={() => {
                        stopAudio();
                        setSelectedQari(q.id as any);
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                        selectedQari === q.id
                          ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md font-bold"
                          : "bg-purple-900/40 text-purple-300 hover:text-white border border-purple-800/40"
                      }`}
                      title={q.detail}
                    >
                      {q.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Bismillah Banner */}
              <div className="relative p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-emerald-950/80 via-purple-950/80 to-teal-950/80 border border-emerald-500/40 text-center space-y-3 overflow-hidden shadow-lg">
                <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
                
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-900/40 border border-emerald-500/30 text-emerald-300 text-xs font-mono">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Surat Ke-{selectedSurah.nomor} • {selectedSurah.tempatTurun}</span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                  {selectedSurah.namaLatin}
                </h2>
                <p className="text-sm text-emerald-300/80 font-medium">
                  "{selectedSurah.arti}" • {selectedSurah.jumlahAyat} Ayat
                </p>

                {/* Calligraphic Bismillah (except Surah At-Tawbah) */}
                {selectedSurah.nomor !== 9 && (
                  <div className="pt-2">
                    <p className="text-2xl sm:text-3xl font-serif text-emerald-300 tracking-wide leading-relaxed">
                      بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                    </p>
                    <p className="text-[11px] text-purple-300/70 italic mt-1">
                      Dengan nama Allah Yang Maha Pengasih lagi Maha Penyayang
                    </p>
                  </div>
                )}

                {/* Full Surah Audio Player Controls */}
                <div className="pt-3 flex items-center justify-center gap-3">
                  <button
                    onClick={() => {
                      const url = getSurahAudioUrl(selectedQari, selectedSurah.nomor, selectedSurah.audioFull);
                      playAudio(url, null);
                    }}
                    className={`px-5 py-2.5 rounded-2xl font-bold text-xs flex items-center gap-2 transition-all shadow-md ${
                      isPlaying && playingAyatNomor === null
                        ? "bg-pink-600 text-white shadow-pink-500/30 animate-pulse"
                        : "bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:from-emerald-400 hover:to-teal-400 shadow-emerald-500/20"
                    }`}
                  >
                    {isPlaying && playingAyatNomor === null ? (
                      <>
                        <Pause className="w-4 h-4" />
                        <span>Jeda Audio Surat</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4" />
                        <span>Putar Audio Full ({QARI_OPTIONS.find(q => q.id === selectedQari)?.name})</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Ayat List */}
              {isLoadingDetail ? (
                <div className="space-y-4 py-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-32 rounded-2xl bg-purple-950/30 border border-purple-900/40 animate-pulse"
                    />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {selectedSurah.ayat?.map((ayat) => {
                    const audioAyatUrl = getAyatAudioUrl(selectedQari, selectedSurah.nomor, ayat.nomorAyat);

                    const isThisAyatPlaying =
                      isPlaying && currentAudioUrl === audioAyatUrl;
                    const isBookmarked =
                      bookmarkedVerses[`${selectedSurah.nomor}:${ayat.nomorAyat}`];

                    return (
                      <div
                        key={ayat.nomorAyat}
                        className={`p-5 rounded-2xl border transition-all duration-200 space-y-4 ${
                          isThisAyatPlaying
                            ? "bg-purple-900/40 border-pink-500/60 shadow-[0_0_25px_rgba(236,72,153,0.2)]"
                            : "bg-purple-950/30 border-purple-800/40 hover:border-emerald-500/40"
                        }`}
                      >
                        {/* Ayat Top Control Bar */}
                        <div className="flex items-center justify-between border-b border-purple-800/30 pb-3">
                          <div className="flex items-center gap-2">
                            <span className="w-8 h-8 rounded-xl bg-emerald-950 border border-emerald-500/40 flex items-center justify-center text-xs font-bold font-mono text-emerald-300">
                              {ayat.nomorAyat}
                            </span>
                            <span className="text-[11px] font-mono text-purple-300/70">
                              Ayat {ayat.nomorAyat}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            {/* Bookmark Button */}
                            <button
                              onClick={() =>
                                toggleBookmark(selectedSurah.nomor, ayat.nomorAyat)
                              }
                              className={`p-2 rounded-xl transition-all ${
                                isBookmarked
                                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/50"
                                  : "text-purple-400 hover:text-amber-300 hover:bg-purple-900/40"
                              }`}
                              title="Tandai Ayat"
                            >
                              <Bookmark className="w-4 h-4" />
                            </button>

                            {/* Audio Play Button per Ayat */}
                            {audioAyatUrl && (
                              <button
                                onClick={() =>
                                  playAudio(audioAyatUrl, ayat.nomorAyat)
                                }
                                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                                  isThisAyatPlaying
                                    ? "bg-pink-500 text-white shadow-md shadow-pink-500/30 animate-pulse"
                                    : "bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-500 hover:text-white"
                                }`}
                              >
                                {isThisAyatPlaying ? (
                                  <>
                                    <Pause className="w-3.5 h-3.5" />
                                    <span>Stop</span>
                                  </>
                                ) : (
                                  <>
                                    <Play className="w-3.5 h-3.5" />
                                    <span>Murottal</span>
                                  </>
                                )}
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Arabic Text (Large & Calligraphic) */}
                        <div className="text-right py-2">
                          <p className="text-2xl sm:text-3xl font-serif text-emerald-200 leading-[2.2] tracking-wide font-medium">
                            {ayat.teksArab}
                          </p>
                        </div>

                        {/* Latin Transliteration */}
                        {ayat.teksLatin && (
                          <p className="text-xs text-teal-300/90 italic font-mono bg-emerald-950/20 p-2.5 rounded-xl border border-emerald-900/30">
                            {ayat.teksLatin}
                          </p>
                        )}

                        {/* Indonesian Translation */}
                        <p className="text-xs sm:text-sm text-purple-100/90 leading-relaxed font-sans">
                          {ayat.teksIndonesia}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer Audio Bar (Sticky if playing) */}
        {isPlaying && (
          <div className="p-3 bg-gradient-to-r from-purple-950 via-pink-950 to-purple-950 border-t border-pink-500/40 flex items-center justify-between px-6 text-xs animate-slide-up">
            <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <span className="font-semibold text-white">
                Memutar Audio Murottal • <span className="text-emerald-300 font-bold">{QARI_OPTIONS.find(q => q.id === selectedQari)?.name}</span> (Audio HD Jernih)
              </span>
            </div>
            <button
              onClick={stopAudio}
              className="px-3 py-1 bg-rose-600 text-white rounded-lg font-bold text-xs hover:bg-rose-700 transition-colors"
            >
              Matikan Audio
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
