export interface PrayerTimings {
  Subuh: string;
  Syuruq: string;
  Dzuhur: string;
  Ashar: string;
  Maghrib: string;
  Isya: string;
  Imsak: string;
}

export interface PrayerData {
  city: string;
  country: string;
  date: {
    readable: string;
    hijri: string;
    gregorian: string;
  };
  timings: PrayerTimings;
}

export interface DeviceInfo {
  country: string;
  flag: string;
  device: string;
  browser: string;
  status: "Online" | "Offline";
  batteryLevel: number | null;
  isCharging: boolean;
}

export interface TikTokAuthor {
  nickname: string;
  unique_id: string;
  avatar?: string;
}

export interface TikTokStats {
  digg_count: number;
  comment_count: number;
  share_count: number;
  play_count: number;
}

export interface TikTokResult {
  id: string;
  title: string;
  cover?: string;
  origin_cover?: string;
  duration?: number;
  play: string;
  wmplay?: string | null;
  hdplay?: string | null;
  music?: string | null;
  music_info?: {
    title: string;
    author: string;
    play?: string;
  } | null;
  author: TikTokAuthor;
  stats: TikTokStats;
  images?: string[];
}

export interface InstagramResult {
  success: boolean;
  title?: string;
  thumbnail?: string;
  video?: string;
  audio?: string;
  images?: string[];
  author?: {
    nickname?: string;
    unique_id?: string;
    avatar?: string;
  };
}

export interface TranslationResult {
  success: boolean;
  translatedText: string;
  detectedSourceLang: string;
  phonetic?: string | null;
  notes?: string | null;
  synonyms?: string[];
  engine: string;
}

export type CategoryFilter = "All" | "Downloader" | "Agama" | "Utility";

export type ActiveTool = "tiktok" | "instagram" | "translator" | "calculator" | "quran" | "weather_calendar" | "piggy_bank" | null;

export interface PiggyGoal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  categoryIcon: "piggy" | "laptop" | "phone" | "plane" | "car" | "home" | "heart";
  colorTheme: string;
  createdAt: string;
  isCompleted: boolean;
}

export interface PiggyTransaction {
  id: string;
  goalId: string;
  type: "deposit" | "withdraw";
  amount: number;
  note: string;
  timestamp: string;
}

export interface SurahSummary {
  nomor: number;
  nama: string;
  namaLatin: string;
  jumlahAyat: number;
  tempatTurun: string;
  arti: string;
  deskripsi?: string;
  audioFull?: {
    [key: string]: string;
  };
}

export interface AyatItem {
  nomorAyat: number;
  teksArab: string;
  teksLatin: string;
  teksIndonesia: string;
  audio?: {
    [key: string]: string;
  };
}

export interface SurahDetail extends SurahSummary {
  ayat: AyatItem[];
}

export interface WeatherData {
  city: string;
  temperature: number;
  condition: string;
  icon: string;
  humidity: number;
  windSpeed: number;
  uvIndex: number;
  forecast: {
    day: string;
    tempMin: number;
    tempMax: number;
    condition: string;
  }[];
}
