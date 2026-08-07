import React, { useState } from "react";
import {
  Download,
  Clipboard,
  X,
  Play,
  Music,
  Heart,
  MessageCircle,
  Share2,
  Eye,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
  ArrowLeft,
  FileText,
  Image as ImageIcon,
} from "lucide-react";
import { TikTokResult } from "../types";

interface TikTokDownloaderViewProps {
  onBack: () => void;
}

export const TikTokDownloaderView: React.FC<TikTokDownloaderViewProps> = ({ onBack }) => {
  const [url, setUrl] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<TikTokResult | null>(null);
  const [downloadSuccessMsg, setDownloadSuccessMsg] = useState<string | null>(null);

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setUrl(text);
        setError(null);
      }
    } catch (err) {
      setError("Izin clipboard tidak tersedia. Tempel link secara manual.");
    }
  };

  const handleDownload = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!url.trim()) {
      setError("Masukkan link video TikTok terlebih dahulu.");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);
    setDownloadSuccessMsg(null);

    try {
      let data: any = null;
      try {
        const res = await fetch("/api/tiktok/download", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: url.trim() }),
        });
        if (res.ok) {
          data = await res.json();
        }
      } catch (backendErr) {
        console.warn("Backend TikTok API failed, attempting direct client fetch:", backendErr);
      }

      // Client Direct Fallback if backend API failed or returned error
      if (!data || !data.success) {
        const directRes = await fetch(`https://www.tikwm.com/api/?url=${encodeURIComponent(url.trim())}&hd=1`, {
          headers: {
            "Accept": "application/json",
          },
        });
        const directJson = await directRes.json();
        if (directJson && directJson.code === 0 && directJson.data) {
          const d = directJson.data;
          data = {
            success: true,
            id: d.id,
            title: d.title || "Video TikTok",
            cover: d.cover,
            origin_cover: d.origin_cover,
            duration: d.duration,
            play: d.play.startsWith("http") ? d.play : `https://www.tikwm.com${d.play}`,
            wmplay: d.wmplay ? (d.wmplay.startsWith("http") ? d.wmplay : `https://www.tikwm.com${d.wmplay}`) : null,
            hdplay: d.hdplay ? (d.hdplay.startsWith("http") ? d.hdplay : `https://www.tikwm.com${d.hdplay}`) : null,
            music: d.music ? (d.music.startsWith("http") ? d.music : `https://www.tikwm.com${d.music}`) : null,
            music_info: d.music_info ? {
              title: d.music_info.title,
              author: d.music_info.author,
              play: d.music_info.play,
            } : null,
            author: {
              nickname: d.author?.nickname || "Pengguna TikTok",
              unique_id: d.author?.unique_id || "tiktok_user",
              avatar: d.author?.avatar,
            },
            stats: {
              digg_count: d.digg_count || 0,
              comment_count: d.comment_count || 0,
              share_count: d.share_count || 0,
              play_count: d.play_count || 0,
            },
            images: d.images ? d.images.map((img: string) => img.startsWith("http") ? img : `https://www.tikwm.com${img}`) : [],
          };
        }
      }

      if (!data || !data.success) {
        throw new Error(data?.error || "Gagal mengunduh video TikTok. Pastikan link video publik dan valid.");
      }

      setResult(data);
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan saat memproses link TikTok.");
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num: number) => {
    if (!num) return "0";
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num.toString();
  };

  const triggerDirectDownload = (fileUrl: string, filename: string) => {
    try {
      const a = document.createElement("a");
      a.href = fileUrl;
      a.target = "_blank";
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setDownloadSuccessMsg(`Mengunduh: ${filename}`);
      setTimeout(() => setDownloadSuccessMsg(null), 4000);
    } catch (e) {
      window.open(fileUrl, "_blank");
    }
  };

  return (
    <div className="space-y-5">
      {/* Top Header Navigation */}
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
            <Download className="w-4 h-4" />
          </div>
          <h2 className="text-sm font-bold text-white tracking-wide">TikTok Downloader</h2>
        </div>
      </div>

      {/* Intro Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-purple-900/50 via-pink-900/30 to-purple-950/60 p-4 border border-purple-500/30 text-xs">
        <div className="flex items-center gap-2 font-semibold text-pink-300 mb-1">
          <Sparkles className="w-4 h-4 text-pink-400 animate-spin" />
          <span>Download Video, Foto & Musik MP3 Tanpa Watermark</span>
        </div>
        <p className="text-purple-200/80 text-[11px] leading-relaxed">
          Tempel link video TikTok (misal: vt.tiktok.com atau tiktok.com/@user/video/...) untuk mengunduh versi HD tanpa watermark dengan cepat dan gratis.
        </p>
      </div>

      {/* Input Form */}
      <form onSubmit={handleDownload} className="space-y-3">
        <div className="relative flex items-center">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Tempel link video TikTok di sini..."
            className="w-full bg-[#120a27] border border-purple-500/40 focus:border-pink-500 rounded-2xl py-3.5 pl-4 pr-24 text-xs text-purple-100 placeholder-purple-400/50 focus:outline-none focus:ring-2 focus:ring-pink-500/30 transition-all shadow-inner"
          />
          <div className="absolute right-2 flex items-center gap-1">
            {url ? (
              <button
                type="button"
                onClick={() => setUrl("")}
                className="p-1.5 text-purple-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handlePaste}
                className="flex items-center gap-1 bg-purple-800/40 hover:bg-purple-700/60 text-purple-200 px-2.5 py-1.5 rounded-xl border border-purple-500/30 text-[11px] font-semibold transition-all active:scale-95"
              >
                <Clipboard className="w-3.5 h-3.5" />
                <span>Tempel</span>
              </button>
            )}
          </div>
        </div>

        {/* Submit Action Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 hover:from-pink-500 hover:to-indigo-500 text-white font-bold text-xs tracking-wider uppercase shadow-lg shadow-pink-600/30 border border-pink-400/50 transition-all active:scale-98 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-white" />
              <span>Memproses Link TikTok...</span>
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              <span>Unduh Sekarang</span>
            </>
          )}
        </button>
      </form>

      {/* Error Message Display */}
      {error && (
        <div className="p-3.5 rounded-2xl bg-rose-950/60 border border-rose-500/40 text-rose-200 text-xs flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-semibold">{error}</p>
            <p className="text-[10px] text-rose-300/80">
              Contoh link valid: <span className="font-mono underline">https://vt.tiktok.com/ZS123456/</span>
            </p>
          </div>
        </div>
      )}

      {/* Download Success Alert */}
      {downloadSuccessMsg && (
        <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-200 text-xs flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{downloadSuccessMsg}</span>
        </div>
      )}

      {/* Results Container */}
      {result && (
        <div className="space-y-4 rounded-3xl bg-[#140b2b] border border-purple-500/30 p-4 sm:p-5 shadow-2xl">
          {/* Author Info & Title */}
          <div className="flex items-start gap-3">
            {result.author.avatar ? (
              <img
                src={result.author.avatar}
                alt={result.author.nickname}
                className="w-12 h-12 rounded-full border-2 border-pink-500/60 object-cover"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-purple-800 border-2 border-pink-500/60 flex items-center justify-center text-white font-bold text-sm">
                {result.author.nickname.charAt(0)}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-white text-sm truncate">{result.author.nickname}</h3>
              <p className="text-xs text-purple-300/80 font-mono">@{result.author.unique_id}</p>
              <p className="text-xs text-purple-200 mt-1 line-clamp-2 leading-snug">{result.title}</p>
            </div>
          </div>

          {/* Statistics Bar */}
          <div className="grid grid-cols-4 gap-1.5 py-2 px-3 rounded-2xl bg-purple-950/40 border border-purple-800/30 text-[11px] text-purple-300">
            <div className="flex items-center gap-1 justify-center">
              <Heart className="w-3.5 h-3.5 text-pink-400" />
              <span>{formatNumber(result.stats.digg_count)}</span>
            </div>
            <div className="flex items-center gap-1 justify-center">
              <MessageCircle className="w-3.5 h-3.5 text-purple-400" />
              <span>{formatNumber(result.stats.comment_count)}</span>
            </div>
            <div className="flex items-center gap-1 justify-center">
              <Share2 className="w-3.5 h-3.5 text-indigo-400" />
              <span>{formatNumber(result.stats.share_count)}</span>
            </div>
            <div className="flex items-center gap-1 justify-center">
              <Eye className="w-3.5 h-3.5 text-emerald-400" />
              <span>{formatNumber(result.stats.play_count)}</span>
            </div>
          </div>

          {/* Media Player / Cover Preview */}
          <div className="relative rounded-2xl overflow-hidden border border-purple-500/30 bg-black/60 max-h-80 flex items-center justify-center">
            {result.play ? (
              <video
                controls
                poster={result.cover || result.origin_cover}
                className="w-full max-h-80 object-contain rounded-2xl"
                src={result.play}
              >
                Browser Anda tidak mendukung preview video HTML5.
              </video>
            ) : result.cover ? (
              <img
                src={result.cover || result.origin_cover}
                alt="Video Cover"
                className="w-full max-h-80 object-contain rounded-2xl"
              />
            ) : null}
          </div>

          {/* Slideshow Photo Gallery (if applicable) */}
          {result.images && result.images.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-pink-300 flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4" />
                <span>Foto Slide TikTok ({result.images.length} gambar)</span>
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-60 overflow-y-auto p-1">
                {result.images.map((imgUrl, idx) => (
                  <div key={idx} className="relative group rounded-xl overflow-hidden border border-purple-600/30">
                    <img src={imgUrl} alt={`Slide ${idx + 1}`} className="w-full h-28 object-cover" />
                    <button
                      onClick={() => triggerDirectDownload(imgUrl, `tiktok-photo-${idx + 1}.jpg`)}
                      className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-semibold transition-all"
                    >
                      <Download className="w-4 h-4 mr-1" /> Unduh
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Download Buttons Section */}
          <div className="space-y-2 pt-2 border-t border-purple-800/40">
            {/* MP4 No Watermark */}
            {result.play && (
              <button
                onClick={() => triggerDirectDownload(result.play, `tiktok-no-watermark-${result.id}.mp4`)}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs flex items-center justify-between shadow-lg shadow-emerald-950/40 border border-emerald-400/40 transition-all active:scale-98"
              >
                <div className="flex items-center gap-2">
                  <Play className="w-4 h-4" />
                  <span>Unduh Video MP4 (No Watermark)</span>
                </div>
                <span className="text-[10px] bg-emerald-950/60 px-2 py-0.5 rounded-lg border border-emerald-400/30">
                  HD
                </span>
              </button>
            )}

            {/* MP3 Audio */}
            {result.music && (
              <button
                onClick={() => triggerDirectDownload(result.music!, `tiktok-audio-${result.id}.mp3`)}
                className="w-full py-3 px-4 rounded-xl bg-purple-900/60 hover:bg-purple-800/80 text-purple-100 font-bold text-xs flex items-center justify-between border border-purple-500/40 transition-all active:scale-98"
              >
                <div className="flex items-center gap-2">
                  <Music className="w-4 h-4 text-pink-400" />
                  <span>Unduh Audio MP3</span>
                </div>
                <span className="text-[10px] text-purple-300/80">
                  {result.music_info?.title || "Music MP3"}
                </span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
