import React, { useState } from "react";
import {
  Download,
  Clipboard,
  X,
  Play,
  Music,
  Heart,
  MessageCircle,
  Eye,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
  ArrowLeft,
  Image as ImageIcon,
  Instagram,
} from "lucide-react";
import { InstagramResult } from "../types";
import { safeFetchJson } from "../utils/safeApi";

interface InstagramDownloaderViewProps {
  onBack: () => void;
}

// Builds a same-origin proxy URL so IG CDN media can be fetched/downloaded without CORS errors
const proxyUrl = (mediaUrl: string, filename?: string, forceDownload?: boolean) => {
  const params = new URLSearchParams({ url: mediaUrl });
  if (filename) params.set("filename", filename);
  if (forceDownload) params.set("dl", "1");
  return `/api/instagram/media?${params.toString()}`;
};

export const InstagramDownloaderView: React.FC<InstagramDownloaderViewProps> = ({ onBack }) => {
  const [url, setUrl] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<InstagramResult | null>(null);
  const [downloadSuccessMsg, setDownloadSuccessMsg] = useState<string | null>(null);
  const [mp3Loading, setMp3Loading] = useState<boolean>(false);
  const [mp3Progress, setMp3Progress] = useState<string>("");

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
      setError("Masukkan link post/reel Instagram terlebih dahulu.");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);
    setDownloadSuccessMsg(null);

    try {
      const backendRes = await safeFetchJson("/api/instagram/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      });

      if (!backendRes.ok || !backendRes.data || !backendRes.data.success) {
        throw new Error(
          backendRes.error ||
            backendRes.data?.error ||
            "Gagal mengambil media Instagram. Pastikan post publik & link valid."
        );
      }

      setResult(backendRes.data as InstagramResult);
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan saat memproses link Instagram.");
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num: number | null) => {
    if (num === null || num === undefined) return "-";
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num.toString();
  };

  const triggerDirectDownload = (fileUrl: string, filename: string) => {
    try {
      const a = document.createElement("a");
      a.href = fileUrl;
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

  // Extracts audio from IG video in-browser and encodes to real MP3 using lamejs
  const handleDownloadMp3 = async (videoUrl: string, baseName: string) => {
    if (mp3Loading) return;
    setMp3Loading(true);
    setError(null);
    setMp3Progress("Mengunduh video dari Instagram...");

    try {
      const resp = await fetch(proxyUrl(videoUrl));
      if (!resp.ok) throw new Error("Gagal mengunduh video untuk diekstrak audionya.");
      const arrayBuffer = await resp.arrayBuffer();

      setMp3Progress("Mengekstrak audio dari video...");
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const audioCtx = new AudioCtx();
      const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer.slice(0));
      audioCtx.close();

      setMp3Progress("Meng-encode ke MP3 (128kbps)...");
      // Dynamic import keeps the encoder out of the initial bundle
      const lamejs = await import("@breezystack/lamejs");

      const channels = Math.min(2, audioBuffer.numberOfChannels);
      const sampleRate = audioBuffer.sampleRate;
      const encoder = new lamejs.Mp3Encoder(channels, sampleRate, 128);

      const floatTo16 = (input: Float32Array) => {
        const out = new Int16Array(input.length);
        for (let i = 0; i < input.length; i++) {
          const s = Math.max(-1, Math.min(1, input[i]));
          out[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
        }
        return out;
      };

      const left = floatTo16(audioBuffer.getChannelData(0));
      const right = channels > 1 ? floatTo16(audioBuffer.getChannelData(1)) : null;

      const blockSize = 1152;
      const mp3Chunks: Uint8Array[] = [];
      for (let i = 0; i < left.length; i += blockSize) {
        const leftChunk = left.subarray(i, i + blockSize);
        const rightChunk = right ? right.subarray(i, i + blockSize) : undefined;
        const encoded = right
          ? encoder.encodeBuffer(leftChunk, rightChunk)
          : encoder.encodeBuffer(leftChunk);
        if (encoded.length > 0) mp3Chunks.push(new Uint8Array(encoded));
      }
      const final = encoder.flush();
      if (final.length > 0) mp3Chunks.push(new Uint8Array(final));

      const blob = new Blob(mp3Chunks as BlobPart[], { type: "audio/mpeg" });
      const blobUrl = URL.createObjectURL(blob);
      triggerDirectDownload(blobUrl, `${baseName}.mp3`);
      setTimeout(() => URL.revokeObjectURL(blobUrl), 10000);
    } catch (err: any) {
      console.error("MP3 extraction error:", err);
      setError(
        err.message ||
          "Gagal mengekstrak audio MP3. Coba unduh video MP4-nya saja."
      );
    } finally {
      setMp3Loading(false);
      setMp3Progress("");
    }
  };

  const videos = result?.items.filter((i) => i.type === "video") || [];
  const images = result?.items.filter((i) => i.type === "image") || [];
  const mainVideo = videos[0] || null;

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
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-amber-500 via-pink-600 to-purple-600 flex items-center justify-center text-white">
            <Instagram className="w-4 h-4" />
          </div>
          <h2 className="text-sm font-bold text-white tracking-wide">Instagram Downloader</h2>
        </div>
      </div>

      {/* Intro Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-purple-900/50 via-pink-900/30 to-amber-900/20 p-4 border border-purple-500/30 text-xs">
        <div className="flex items-center gap-2 font-semibold text-pink-300 mb-1">
          <Sparkles className="w-4 h-4 text-pink-400 animate-spin" />
          <span>Download Video Reels, Foto & Audio MP3 Instagram</span>
        </div>
        <p className="text-purple-200/80 text-[11px] leading-relaxed">
          Tempel link post, reel, atau video Instagram (misal: instagram.com/reel/... atau
          instagram.com/p/...) untuk mengunduh video MP4, foto, dan audio MP3 secara gratis.
          Hanya post publik yang bisa diunduh.
        </p>
      </div>

      {/* Input Form */}
      <form onSubmit={handleDownload} className="space-y-3">
        <div className="relative flex items-center">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Tempel link post / reel Instagram di sini..."
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
          className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-amber-500 via-pink-600 to-purple-600 hover:from-amber-400 hover:via-pink-500 hover:to-purple-500 text-white font-bold text-xs tracking-wider uppercase shadow-lg shadow-pink-600/30 border border-pink-400/50 transition-all active:scale-98 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-white" />
              <span>Memproses Link Instagram...</span>
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
              Contoh link valid:{" "}
              <span className="font-mono underline">https://www.instagram.com/reel/Cxxxxxx/</span>
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

      {/* MP3 Extraction Progress */}
      {mp3Loading && (
        <div className="p-3 rounded-xl bg-indigo-950/80 border border-indigo-500/40 text-indigo-200 text-xs flex items-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
          <span>{mp3Progress}</span>
        </div>
      )}

      {/* Results Container */}
      {result && (
        <div className="space-y-4 rounded-3xl bg-[#140b2b] border border-purple-500/30 p-4 sm:p-5 shadow-2xl">
          {/* Author Info & Caption */}
          <div className="flex items-start gap-3">
            {result.author.avatar ? (
              <img
                src={proxyUrl(result.author.avatar)}
                alt={result.author.username}
                className="w-12 h-12 rounded-full border-2 border-pink-500/60 object-cover"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-amber-500 via-pink-600 to-purple-600 border-2 border-pink-500/60 flex items-center justify-center text-white font-bold text-sm">
                {result.author.username.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-white text-sm truncate">
                {result.author.full_name || result.author.username}
              </h3>
              <p className="text-xs text-purple-300/80 font-mono">@{result.author.username}</p>
              <p className="text-xs text-purple-200 mt-1 line-clamp-2 leading-snug">
                {result.caption}
              </p>
            </div>
          </div>

          {/* Statistics Bar */}
          <div className="grid grid-cols-3 gap-1.5 py-2 px-3 rounded-2xl bg-purple-950/40 border border-purple-800/30 text-[11px] text-purple-300">
            <div className="flex items-center gap-1 justify-center">
              <Heart className="w-3.5 h-3.5 text-pink-400" />
              <span>{formatNumber(result.stats.like_count)}</span>
            </div>
            <div className="flex items-center gap-1 justify-center">
              <MessageCircle className="w-3.5 h-3.5 text-purple-400" />
              <span>{formatNumber(result.stats.comment_count)}</span>
            </div>
            <div className="flex items-center gap-1 justify-center">
              <Eye className="w-3.5 h-3.5 text-emerald-400" />
              <span>{formatNumber(result.stats.video_view_count)}</span>
            </div>
          </div>

          {/* Media Player / Preview */}
          {mainVideo ? (
            <div className="relative rounded-2xl overflow-hidden border border-purple-500/30 bg-black/60 max-h-80 flex items-center justify-center">
              <video
                controls
                poster={result.thumbnail ? proxyUrl(result.thumbnail) : undefined}
                className="w-full max-h-80 object-contain rounded-2xl"
                src={proxyUrl(mainVideo.url)}
              >
                Browser Anda tidak mendukung preview video HTML5.
              </video>
            </div>
          ) : images.length > 0 ? (
            <div className="relative rounded-2xl overflow-hidden border border-purple-500/30 bg-black/60 max-h-80 flex items-center justify-center">
              <img
                src={proxyUrl(images[0].url)}
                alt="Preview post Instagram"
                className="w-full max-h-80 object-contain rounded-2xl"
              />
            </div>
          ) : null}

          {/* Carousel Photo Gallery */}
          {images.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-pink-300 flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4" />
                <span>Foto Instagram ({images.length} gambar)</span>
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-60 overflow-y-auto p-1">
                {images.map((img, idx) => (
                  <div
                    key={idx}
                    className="relative group rounded-xl overflow-hidden border border-purple-600/30"
                  >
                    <img
                      src={proxyUrl(img.url)}
                      alt={`Foto ${idx + 1}`}
                      className="w-full h-28 object-cover"
                    />
                    <button
                      onClick={() =>
                        triggerDirectDownload(
                          proxyUrl(img.url, `instagram-photo-${result.shortcode}-${idx + 1}.jpg`, true),
                          `instagram-photo-${idx + 1}.jpg`
                        )
                      }
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
            {/* MP4 Videos */}
            {videos.map((vid, idx) => (
              <button
                key={idx}
                onClick={() =>
                  triggerDirectDownload(
                    proxyUrl(
                      vid.url,
                      `instagram-video-${result.shortcode}${videos.length > 1 ? `-${idx + 1}` : ""}.mp4`,
                      true
                    ),
                    `instagram-video-${idx + 1}.mp4`
                  )
                }
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs flex items-center justify-between shadow-lg shadow-emerald-950/40 border border-emerald-400/40 transition-all active:scale-98"
              >
                <div className="flex items-center gap-2">
                  <Play className="w-4 h-4" />
                  <span>
                    Unduh Video MP4{videos.length > 1 ? ` (${idx + 1}/${videos.length})` : ""}
                  </span>
                </div>
                <span className="text-[10px] bg-emerald-950/60 px-2 py-0.5 rounded-lg border border-emerald-400/30">
                  HD
                </span>
              </button>
            ))}

            {/* MP3 Audio Extraction */}
            {mainVideo && (
              <button
                onClick={() =>
                  handleDownloadMp3(mainVideo.url, `instagram-audio-${result.shortcode}`)
                }
                disabled={mp3Loading}
                className="w-full py-3 px-4 rounded-xl bg-purple-900/60 hover:bg-purple-800/80 text-purple-100 font-bold text-xs flex items-center justify-between border border-purple-500/40 transition-all active:scale-98 disabled:opacity-50"
              >
                <div className="flex items-center gap-2">
                  {mp3Loading ? (
                    <Loader2 className="w-4 h-4 animate-spin text-pink-400" />
                  ) : (
                    <Music className="w-4 h-4 text-pink-400" />
                  )}
                  <span>{mp3Loading ? "Memproses MP3..." : "Unduh Audio MP3"}</span>
                </div>
                <span className="text-[10px] text-purple-300/80">128kbps</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
