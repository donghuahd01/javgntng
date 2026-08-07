import React, { useState } from "react";
import {
  Languages,
  ArrowLeftRight,
  Copy,
  Volume2,
  Mic,
  MicOff,
  Clipboard,
  X,
  Loader2,
  Check,
  Sparkles,
  ArrowLeft,
  BookOpen,
  MessageSquare,
} from "lucide-react";
import { TranslationResult } from "../types";

interface TranslatorViewProps {
  onBack: () => void;
}

const LANGUAGES = [
  { code: "auto", name: "Deteksi Otomatis" },
  { code: "id", name: "Indonesia 🇮🇩" },
  { code: "en", name: "Inggris 🇬🇧" },
  { code: "jv", name: "Jawa 🇮🇩" },
  { code: "su", name: "Sunda 🇮🇩" },
  { code: "ar", name: "Arab 🇸🇦" },
  { code: "ja", name: "Jepang 🇯🇵" },
  { code: "ko", name: "Korea 🇰🇷" },
  { code: "zh", name: "Mandarin 🇨🇳" },
  { code: "es", name: "Spanyol 🇪🇸" },
  { code: "fr", name: "Prancis 🇫🇷" },
  { code: "de", name: "Jerman 🇩🇪" },
  { code: "ru", name: "Rusia 🇷🇺" },
  { code: "pt", name: "Portugis 🇵🇹" },
  { code: "it", name: "Italia 🇮🇹" },
  { code: "nl", name: "Belanda 🇳🇱" },
  { code: "tr", name: "Turki 🇹🇷" },
  { code: "hi", name: "Hindi 🇮🇳" },
];

const STYLES = [
  { id: "general", label: "Umum" },
  { id: "formal", label: "Formal / Baku" },
  { id: "casual", label: "Santai / Daily" },
  { id: "slang", label: "Slang / Gaul" },
];

export const TranslatorView: React.FC<TranslatorViewProps> = ({ onBack }) => {
  const [inputText, setInputText] = useState<string>("");
  const [sourceLang, setSourceLang] = useState<string>("auto");
  const [targetLang, setTargetLang] = useState<string>("en");
  const [style, setStyle] = useState<string>("general");
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<TranslationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false);

  // Swap Source and Target Languages
  const handleSwapLanguages = () => {
    if (sourceLang === "auto") {
      setSourceLang(targetLang);
      setTargetLang("id");
    } else {
      const temp = sourceLang;
      setSourceLang(targetLang);
      setTargetLang(temp);
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setInputText(text);
        setError(null);
      }
    } catch (e) {
      setError("Izin clipboard tidak tersedia. Tempel manual.");
    }
  };

  const handleTranslate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) {
      setError("Masukkan teks yang ingin diterjemahkan.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: inputText.trim(),
          sourceLang,
          targetLang,
          style,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Gagal menerjemahkan teks.");
      }

      setResult(data);
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan saat menerjemahkan.");
    } finally {
      setLoading(false);
    }
  };

  // Text To Speech Audio Pronunciation
  const handleSpeak = (textToSpeak: string, langCode: string) => {
    if (!("speechSynthesis" in window)) {
      alert("Browser Anda tidak mendukung pengucapan suara.");
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = langCode === "auto" ? "id-ID" : langCode;
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  };

  // Voice Dictation
  const handleMicToggle = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Fitur Dikte Suara tidak didukung oleh browser Anda.");
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = sourceLang === "auto" ? "id-ID" : sourceLang;
      recognition.interimResults = false;

      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputText((prev) => (prev ? prev + " " + transcript : transcript));
        setIsListening(false);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);

      recognition.start();
    } catch (e) {
      setIsListening(false);
    }
  };

  const handleCopy = () => {
    if (result?.translatedText) {
      navigator.clipboard.writeText(result.translatedText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="space-y-5">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-purple-800/40 pb-3">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-bold text-purple-300 hover:text-white bg-purple-900/40 hover:bg-purple-800/60 px-3 py-1.5 rounded-xl border border-purple-500/30 transition-all active:scale-95"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali</span>
        </button>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-purple-600/30 flex items-center justify-center text-pink-400">
            <Languages className="w-4 h-4" />
          </div>
          <h2 className="text-sm font-bold text-white tracking-wide">Terjemahkan Bahasa</h2>
        </div>
      </div>

      {/* Language Selector Controls */}
      <div className="flex items-center justify-between gap-2 p-2 rounded-2xl bg-[#140b2b] border border-purple-500/30">
        {/* Source Language */}
        <select
          value={sourceLang}
          onChange={(e) => setSourceLang(e.target.value)}
          className="flex-1 bg-purple-950/60 text-purple-100 text-xs font-semibold py-2 px-3 rounded-xl border border-purple-700/40 focus:outline-none cursor-pointer"
        >
          {LANGUAGES.map((l) => (
            <option key={l.code} value={l.code} className="bg-[#140b2b] text-white">
              {l.name}
            </option>
          ))}
        </select>

        {/* Swap Button */}
        <button
          onClick={handleSwapLanguages}
          aria-label="Tukar Bahasa"
          className="p-2.5 rounded-xl bg-purple-800/40 hover:bg-purple-700/60 text-pink-300 hover:text-white transition-all active:scale-90 border border-purple-500/30"
        >
          <ArrowLeftRight className="w-4 h-4" />
        </button>

        {/* Target Language */}
        <select
          value={targetLang}
          onChange={(e) => setTargetLang(e.target.value)}
          className="flex-1 bg-purple-950/60 text-purple-100 text-xs font-semibold py-2 px-3 rounded-xl border border-purple-700/40 focus:outline-none cursor-pointer"
        >
          {LANGUAGES.filter((l) => l.code !== "auto").map((l) => (
            <option key={l.code} value={l.code} className="bg-[#140b2b] text-white">
              {l.name}
            </option>
          ))}
        </select>
      </div>

      {/* Translation Style / Tone Selector */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider pl-1">Gaya:</span>
        {STYLES.map((s) => (
          <button
            key={s.id}
            onClick={() => setStyle(s.id)}
            className={`px-3 py-1 rounded-xl text-[11px] font-semibold transition-all flex-shrink-0 ${
              style === s.id
                ? "bg-pink-500/30 text-pink-300 border border-pink-400/60 shadow-[0_0_8px_rgba(236,72,153,0.3)]"
                : "bg-purple-950/40 text-purple-300/80 hover:text-white border border-purple-800/30"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Input Text Box */}
      <div className="relative rounded-2xl bg-[#120a27] border border-purple-500/40 p-3.5 focus-within:border-pink-500 transition-all shadow-inner">
        <textarea
          rows={4}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Ketik atau tempel teks di sini..."
          className="w-full bg-transparent text-xs text-purple-100 placeholder-purple-400/50 focus:outline-none resize-none leading-relaxed"
        />

        {/* Text Actions Toolbar */}
        <div className="flex items-center justify-between pt-2 border-t border-purple-900/40 text-xs">
          <span className="text-[10px] text-purple-400 font-mono">
            {inputText.length} Karakter
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleMicToggle}
              className={`p-1.5 rounded-lg border transition-all ${
                isListening
                  ? "bg-pink-600 text-white animate-pulse border-pink-400"
                  : "bg-purple-900/40 text-purple-300 hover:text-white border-purple-700/40"
              }`}
              title="Dikte Suara (Mic)"
            >
              {isListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
            </button>

            {inputText && (
              <button
                type="button"
                onClick={() => handleSpeak(inputText, sourceLang)}
                className="p-1.5 rounded-lg bg-purple-900/40 hover:bg-purple-800/60 text-purple-300 hover:text-white border border-purple-700/40 transition-all"
                title="Dengarkan Pengucapan"
              >
                <Volume2 className="w-3.5 h-3.5" />
              </button>
            )}

            {!inputText ? (
              <button
                type="button"
                onClick={handlePaste}
                className="flex items-center gap-1 text-[11px] font-semibold text-purple-300 hover:text-white bg-purple-900/40 px-2 py-1 rounded-lg border border-purple-700/40 transition-all"
              >
                <Clipboard className="w-3 h-3" />
                <span>Tempel</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setInputText("")}
                className="p-1.5 text-purple-400 hover:text-white transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Submit Translate Button */}
      <button
        onClick={() => handleTranslate()}
        disabled={loading || !inputText.trim()}
        className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold text-xs tracking-wider uppercase shadow-lg shadow-purple-600/30 border border-pink-400/50 transition-all active:scale-98 disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin text-white" />
            <span>Menerjemahkan Teks...</span>
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4 text-pink-300" />
            <span>Terjemahkan Instan</span>
          </>
        )}
      </button>

      {/* Error Banner */}
      {error && (
        <p className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs">
          {error}
        </p>
      )}

      {/* Translation Output Card */}
      {result && (
        <div className="space-y-3 rounded-3xl bg-[#140b2b] border border-purple-500/40 p-4 sm:p-5 shadow-2xl relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-purple-800/40 pb-2">
            <span className="text-[11px] font-bold text-pink-300 tracking-wider uppercase flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              Hasil Terjemahan ({result.detectedSourceLang} ➔ {targetLang.toUpperCase()})
            </span>
            <span className="text-[9px] text-purple-400 font-mono bg-purple-950/60 px-2 py-0.5 rounded-md border border-purple-800/40">
              {result.engine}
            </span>
          </div>

          {/* Translated Text Content */}
          <div className="text-sm font-medium text-white leading-relaxed whitespace-pre-wrap selection:bg-pink-500/30">
            {result.translatedText}
          </div>

          {/* Phonetic Transliteration (if any) */}
          {result.phonetic && (
            <div className="text-xs text-pink-300/90 font-mono bg-pink-950/30 p-2.5 rounded-xl border border-pink-500/20 italic">
              Fonetik: {result.phonetic}
            </div>
          )}

          {/* Notes Context */}
          {result.notes && (
            <div className="text-[11px] text-purple-200/80 bg-purple-950/40 p-2.5 rounded-xl border border-purple-800/30 flex items-start gap-2">
              <BookOpen className="w-3.5 h-3.5 text-purple-400 mt-0.5 flex-shrink-0" />
              <span>{result.notes}</span>
            </div>
          )}

          {/* Synonyms Chips */}
          {result.synonyms && result.synonyms.length > 0 && (
            <div className="flex items-center gap-1.5 text-xs pt-1">
              <span className="text-[10px] text-purple-400 font-semibold">Sinonim:</span>
              <div className="flex flex-wrap gap-1">
                {result.synonyms.map((syn, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] bg-purple-900/50 text-purple-200 px-2 py-0.5 rounded-lg border border-purple-700/40"
                  >
                    {syn}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Output Toolbar Action Buttons */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-purple-800/30">
            <button
              onClick={() => handleSpeak(result.translatedText, targetLang)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-900/50 hover:bg-purple-800 text-purple-200 text-xs font-semibold border border-purple-700/40 transition-all active:scale-95"
            >
              <Volume2 className="w-3.5 h-3.5 text-pink-400" />
              <span>Dengarkan</span>
            </button>

            <button
              onClick={handleCopy}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all active:scale-95 ${
                copied
                  ? "bg-emerald-600 text-white border-emerald-400"
                  : "bg-pink-600/30 text-pink-200 hover:bg-pink-600/50 border-pink-500/40"
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Tersalin!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Salin Teks</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
