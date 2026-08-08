import express from "express";
import path from "path";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Enable CORS for online client access
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

// Initialize Gemini AI client for translation enrichment
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey && apiKey !== "MY_GEMINI_API_KEY") {
      aiClient = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });
    }
  }
  return aiClient;
}

// ----------------------------------------------------
// API 1: TikTok Downloader Endpoint (Third-Party Integration)
// ----------------------------------------------------
app.post(["/api/tiktok/download", "/tiktok/download"], async (req, res) => {
  try {
    const { url } = req.body;
    if (!url || typeof url !== "string") {
      return res.status(400).json({ error: "URL TikTok wajib diisi." });
    }

    const trimmedUrl = url.trim();
    if (!trimmedUrl.includes("tiktok.com")) {
      return res.status(400).json({
        error: "URL tidak valid. Masukkan link video TikTok yang sah (contoh: https://vt.tiktok.com/...)",
      });
    }

    // Call TikWM Third-Party API
    const tikwmResponse = await fetch(`https://www.tikwm.com/api/?url=${encodeURIComponent(trimmedUrl)}&hd=1`, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "application/json",
      },
    });

    const data = await tikwmResponse.json();

    if (data && data.code === 0 && data.data) {
      const d = data.data;
      const responseData = {
        success: true,
        id: d.id,
        title: d.title || "Video TikTok tanpa judul",
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
      return res.json(responseData);
    }

    // Secondary Third-Party Fallback (Tiklydown API)
    try {
      const tiklyResponse = await fetch(`https://api.tiklydown.eu.org/api/download?url=${encodeURIComponent(trimmedUrl)}`);
      const tiklyData = await tiklyResponse.json();
      if (tiklyData && (tiklyData.video || tiklyData.url)) {
        return res.json({
          success: true,
          id: tiklyData.id || "tiktok_video",
          title: tiklyData.title || "TikTok Video",
          cover: tiklyData.thumbnail || tiklyData.cover,
          play: tiklyData.video?.noWatermark || tiklyData.url,
          music: tiklyData.music?.play_url || tiklyData.audio,
          author: {
            nickname: tiklyData.author?.name || "TikTok User",
            unique_id: tiklyData.author?.unique_id || "user",
            avatar: tiklyData.author?.avatar,
          },
          stats: {
            digg_count: tiklyData.stats?.likeCount || 0,
            comment_count: tiklyData.stats?.commentCount || 0,
            share_count: tiklyData.stats?.shareCount || 0,
            play_count: tiklyData.stats?.playCount || 0,
          },
          images: tiklyData.images || [],
        });
      }
    } catch (fallbackErr) {
      console.warn("Tiklydown fallback failed:", fallbackErr);
    }

    return res.status(422).json({
      error: data?.msg || "Gagal mengunduh video TikTok. Pastikan video tidak diprivat dan link benar.",
    });
  } catch (err: any) {
    console.error("Error downloading TikTok:", err);
    res.status(500).json({ error: "Terjadi kesalahan server saat memproses TikTok video." });
  }
});

// ----------------------------------------------------
// API 1b: Instagram Downloader Endpoint (GraphQL + Embed Fallback)
// ----------------------------------------------------
const IG_USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36";

function extractInstagramShortcode(rawUrl: string): string | null {
  try {
    const u = new URL(rawUrl);
    if (!u.hostname.includes("instagram.com")) return null;
    const match = u.pathname.match(/\/(?:p|reel|reels|tv)\/([A-Za-z0-9_-]+)/);
    return match ? match[1] : null;
  } catch {
    return null;
  }
}

async function fetchInstagramGraphql(shortcode: string): Promise<any | null> {
  try {
    const body = new URLSearchParams({
      av: "0",
      __d: "www",
      __user: "0",
      __a: "1",
      __req: "3",
      dpr: "1",
      lsd: "AVqbxe3J_YA",
      variables: JSON.stringify({
        shortcode,
        fetch_tagged_user_count: null,
        hoisted_comment_id: null,
        hoisted_reply_id: null,
      }),
      server_timestamps: "true",
      doc_id: "8845758582119845",
    }).toString();

    const resp = await fetch("https://www.instagram.com/graphql/query", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": IG_USER_AGENT,
        "X-IG-App-ID": "936619743392459",
        "X-FB-LSD": "AVqbxe3J_YA",
        "X-ASBD-ID": "129477",
        "Sec-Fetch-Site": "same-origin",
        Origin: "https://www.instagram.com",
        Referer: `https://www.instagram.com/p/${shortcode}/`,
      },
      body,
    });

    if (!resp.ok) return null;
    const json = await resp.json();
    return json?.data?.xdt_shortcode_media || null;
  } catch (err) {
    console.warn("Instagram GraphQL failed:", err);
    return null;
  }
}

async function fetchInstagramEmbed(shortcode: string): Promise<any | null> {
  try {
    const resp = await fetch(`https://www.instagram.com/p/${shortcode}/embed/captioned/`, {
      headers: {
        "User-Agent": IG_USER_AGENT,
        "Accept-Language": "en-US,en;q=0.9",
      },
    });
    if (!resp.ok) return null;
    const html = await resp.text();

    const unescapeJson = (s: string) =>
      s.replace(/\\u0026/g, "&").replace(/\\\//g, "/").replace(/\\"/g, '"').replace(/&amp;/g, "&");

    const videoMatch = html.match(/"video_url":"([^"]+)"/);
    const displayMatch = html.match(/"display_url":"([^"]+)"/);
    const usernameMatch = html.match(/"username":"([^"]+)"/) || html.match(/class="UsernameText"[^>]*>([^<]+)</);
    const captionMatch = html.match(/class="Caption"[^>]*>[\s\S]*?<\/a>([\s\S]*?)<div/);

    // Fallback: embed image tag
    const imgTagMatch = html.match(/class="EmbeddedMediaImage"[^>]*src="([^"]+)"/);

    const videoUrl = videoMatch ? unescapeJson(videoMatch[1]) : null;
    const displayUrl = displayMatch
      ? unescapeJson(displayMatch[1])
      : imgTagMatch
        ? unescapeJson(imgTagMatch[1])
        : null;

    if (!videoUrl && !displayUrl) return null;

    return {
      is_video: !!videoUrl,
      video_url: videoUrl,
      display_url: displayUrl,
      owner: { username: usernameMatch ? usernameMatch[1] : "instagram_user", full_name: null },
      edge_media_to_caption: {
        edges: captionMatch
          ? [{ node: { text: captionMatch[1].replace(/<[^>]+>/g, "").trim() } }]
          : [],
      },
    };
  } catch (err) {
    console.warn("Instagram embed fallback failed:", err);
    return null;
  }
}

app.post(["/api/instagram/download", "/instagram/download"], async (req, res) => {
  try {
    const { url } = req.body;
    if (!url || typeof url !== "string") {
      return res.status(400).json({ error: "URL Instagram wajib diisi." });
    }

    const trimmedUrl = url.trim();
    const shortcode = extractInstagramShortcode(trimmedUrl);
    if (!shortcode) {
      return res.status(400).json({
        error:
          "URL tidak valid. Masukkan link post/reel Instagram yang sah (contoh: https://www.instagram.com/reel/Cxxxx/)",
      });
    }

    // Strategy 1: Instagram Internal GraphQL API
    let media = await fetchInstagramGraphql(shortcode);

    // Strategy 2: Embed page scraping fallback
    if (!media) {
      media = await fetchInstagramEmbed(shortcode);
    }

    if (!media) {
      return res.status(422).json({
        error:
          "Gagal mengambil media Instagram. Pastikan akun/post tidak diprivat dan link benar, lalu coba lagi.",
      });
    }

    // Normalize carousel (sidecar) children
    const items: { type: "video" | "image"; url: string; thumbnail?: string }[] = [];
    const children = media.edge_sidecar_to_children?.edges;
    if (Array.isArray(children) && children.length > 0) {
      for (const edge of children) {
        const node = edge?.node;
        if (!node) continue;
        if (node.is_video && node.video_url) {
          items.push({ type: "video", url: node.video_url, thumbnail: node.display_url });
        } else if (node.display_url) {
          items.push({ type: "image", url: node.display_url });
        }
      }
    } else if (media.is_video && media.video_url) {
      items.push({ type: "video", url: media.video_url, thumbnail: media.display_url });
    } else if (media.display_url) {
      items.push({ type: "image", url: media.display_url });
    }

    if (items.length === 0) {
      return res.status(422).json({
        error: "Media tidak ditemukan pada post ini. Coba link post/reel lain.",
      });
    }

    const caption =
      media.edge_media_to_caption?.edges?.[0]?.node?.text || "Post Instagram tanpa caption";

    return res.json({
      success: true,
      id: media.id || shortcode,
      shortcode,
      caption,
      thumbnail: media.display_url || items[0]?.thumbnail || (items[0]?.type === "image" ? items[0].url : null),
      is_video: items.some((i) => i.type === "video"),
      items,
      author: {
        username: media.owner?.username || "instagram_user",
        full_name: media.owner?.full_name || null,
        avatar: media.owner?.profile_pic_url || null,
      },
      stats: {
        like_count: media.edge_media_preview_like?.count ?? null,
        comment_count: media.edge_media_to_parent_comment?.count ?? media.edge_media_to_comment?.count ?? null,
        video_view_count: media.video_view_count ?? null,
      },
    });
  } catch (err: any) {
    console.error("Error downloading Instagram:", err);
    res.status(500).json({ error: "Terjadi kesalahan server saat memproses media Instagram." });
  }
});

// Instagram media proxy: bypasses CORS so files can be downloaded / processed to MP3 in-browser
app.get(["/api/instagram/media", "/instagram/media"], async (req, res) => {
  try {
    const mediaUrl = req.query.url as string;
    const filename = (req.query.filename as string) || "instagram-media";
    const forceDownload = req.query.dl === "1";

    if (!mediaUrl) {
      return res.status(400).json({ error: "Parameter url wajib diisi." });
    }

    let parsed: URL;
    try {
      parsed = new URL(mediaUrl);
    } catch {
      return res.status(400).json({ error: "URL media tidak valid." });
    }

    // Only allow Instagram/Facebook CDN hosts to prevent open-proxy abuse
    const allowedHost =
      /(\.cdninstagram\.com|\.fbcdn\.net)$/i.test(parsed.hostname) ||
      /^scontent[\w.-]*\.(cdninstagram\.com|fbcdn\.net)$/i.test(parsed.hostname);
    if (!allowedHost) {
      return res.status(403).json({ error: "Host media tidak diizinkan." });
    }

    const upstream = await fetch(mediaUrl, {
      headers: {
        "User-Agent": IG_USER_AGENT,
        Referer: "https://www.instagram.com/",
      },
    });

    if (!upstream.ok || !upstream.body) {
      return res.status(502).json({ error: `Gagal mengambil media dari CDN Instagram (HTTP ${upstream.status}).` });
    }

    const contentType = upstream.headers.get("content-type") || "application/octet-stream";
    const contentLength = upstream.headers.get("content-length");
    res.setHeader("Content-Type", contentType);
    if (contentLength) res.setHeader("Content-Length", contentLength);
    if (forceDownload) {
      res.setHeader("Content-Disposition", `attachment; filename="${filename.replace(/[^\w.\- ]/g, "_")}"`);
    }
    res.setHeader("Cache-Control", "no-store");

    const { Readable } = await import("stream");
    Readable.fromWeb(upstream.body as any).pipe(res);
  } catch (err: any) {
    console.error("Error proxying Instagram media:", err);
    if (!res.headersSent) {
      res.status(500).json({ error: "Terjadi kesalahan server saat mengunduh media." });
    }
  }
});

// ----------------------------------------------------
// API 2: Language Translation Endpoint (Gemini + MyMemory Third-Party API)
// ----------------------------------------------------
app.post(["/api/translate", "/translate"], async (req, res) => {
  try {
    const { text, sourceLang = "auto", targetLang = "id", style = "general" } = req.body;
    if (!text || typeof text !== "string" || !text.trim()) {
      return res.status(400).json({ error: "Teks yang ingin diterjemahkan wajib diisi." });
    }

    const ai = getGeminiClient();

    // Strategy 1: High Quality AI Translation via Gemini
    if (ai) {
      try {
        const prompt = `Anda adalah penerjemah bahasa profesional tingkat tinggi.
Terjemahkan teks berikut dari bahasa '${sourceLang}' ke bahasa '${targetLang}'.
Gaya/Tone terjemahan: ${style} (pilihan: formal, casual/santai, slang/gaul, general).

Teks Asli:
"${text.trim()}"

Berikan respon dalam format JSON murni:
{
  "translatedText": "hasil terjemahan dalam bahasa target",
  "detectedSourceLang": "kode/nama bahasa asal yang terdeteksi jika sourceLang auto, atau sourceLang",
  "phonetic": "transliterasi fonetik/cara baca jika bahasa asal/target memiliki karakter khusus (cth: Arab, Jepang, Mandarin, Korea), atau null",
  "notes": "catatan singkat penjelasan konteks/artian menarik jika ada, atau null",
  "synonyms": ["sinonim 1", "sinonim 2"] (opsional, max 3)
}`;

        let rawText: string | undefined = undefined;
        try {
          const geminiRes = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
              responseMimeType: "application/json",
            },
          });
          rawText = geminiRes.text?.trim();
        } catch (m1Err) {
          console.warn("gemini-2.5-flash failed, trying gemini-1.5-flash:", m1Err);
          const geminiRes = await ai.models.generateContent({
            model: "gemini-1.5-flash",
            contents: prompt,
            config: {
              responseMimeType: "application/json",
            },
          });
          rawText = geminiRes.text?.trim();
        }
        if (rawText) {
          const parsed = JSON.parse(rawText);
          return res.json({
            success: true,
            translatedText: parsed.translatedText,
            detectedSourceLang: parsed.detectedSourceLang || sourceLang,
            phonetic: parsed.phonetic || null,
            notes: parsed.notes || null,
            synonyms: parsed.synonyms || [],
            engine: "Gemini AI (High-Accuracy)",
          });
        }
      } catch (geminiErr) {
        console.warn("Gemini translation error, falling back to MyMemory API:", geminiErr);
      }
    }

    // Strategy 2: Google Translate GTX API (Universal Fallback for All Languages)
    const sl = sourceLang === "auto" ? "auto" : (sourceLang === "jv" ? "jw" : sourceLang);
    const tl = targetLang === "jv" ? "jw" : targetLang;
    const gtxUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sl}&tl=${tl}&dt=t&q=${encodeURIComponent(text.trim())}`;

    const gtxRes = await fetch(gtxUrl);
    const gtxData = await gtxRes.json();

    if (gtxData && Array.isArray(gtxData) && gtxData[0]) {
      let translatedText = "";
      if (Array.isArray(gtxData[0])) {
        for (const chunk of gtxData[0]) {
          if (Array.isArray(chunk) && chunk[0]) {
            translatedText += chunk[0];
          }
        }
      }
      if (translatedText) {
        return res.json({
          success: true,
          translatedText,
          detectedSourceLang: gtxData[2] || sourceLang,
          phonetic: null,
          notes: null,
          synonyms: [],
          engine: "Google Translate (Universal)",
        });
      }
    }

    return res.status(500).json({ error: "Gagal menerjemahkan teks." });
  } catch (err: any) {
    console.error("Error translating text:", err);
    res.status(500).json({ error: "Terjadi kesalahan server saat menerjemahkan." });
  }
});

// ----------------------------------------------------
// API 3: Prayer Times Endpoint (Aladhan Third-Party API)
// ----------------------------------------------------
app.get(["/api/prayer-times", "/prayer-times"], async (req, res) => {
  try {
    const city = (req.query.city as string) || "Jakarta";
    const country = (req.query.country as string) || "Indonesia";

    const response = await fetch(`https://api.aladhan.com/v1/timingsByCity?city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}&method=11`);
    const data = await response.json();

    if (data && data.code === 200 && data.data) {
      const timings = data.data.timings;
      const date = data.data.date;
      return res.json({
        success: true,
        city,
        country,
        date: {
          readable: date.readable,
          hijri: `${date.hijri.day} ${date.hijri.month.ar} / ${date.hijri.month.en} ${date.hijri.year} AH`,
          gregorian: `${date.gregorian.weekday.en}, ${date.gregorian.day} ${date.gregorian.month.en} ${date.gregorian.year}`,
        },
        timings: {
          Subuh: timings.Fajr,
          Syuruq: timings.Sunrise,
          Dzuhur: timings.Dhuhr,
          Ashar: timings.Asr,
          Maghrib: timings.Maghrib,
          Isya: timings.Isha,
          Imsak: timings.Imsak,
        },
      });
    }

    // Default fallback timings for Jakarta
    res.json({
      success: true,
      city: "Jakarta",
      country: "Indonesia",
      timings: {
        Subuh: "04:42",
        Syuruq: "05:58",
        Dzuhur: "11:58",
        Ashar: "15:19",
        Maghrib: "17:55",
        Isya: "19:06",
        Imsak: "04:32",
      },
    });
  } catch (err) {
    res.json({
      success: true,
      city: "Jakarta",
      country: "Indonesia",
      timings: {
        Subuh: "04:42",
        Syuruq: "05:58",
        Dzuhur: "11:58",
        Ashar: "15:19",
        Maghrib: "17:55",
        Isya: "19:06",
        Imsak: "04:32",
      },
    });
  }
});

// ----------------------------------------------------
// API 4: Al-Qur'an Endpoints (EQuran API Integration)
// ----------------------------------------------------
app.get(["/api/quran/surat", "/quran/surat"], async (req, res) => {
  try {
    const equranRes = await fetch("https://equran.id/api/v2/surat");
    const equranData = await equranRes.json();

    if (equranData && equranData.code === 200 && equranData.data) {
      // Ensure audioFull has high quality fallback for Mishary Alafasy
      const cleanedData = equranData.data.map((s: any) => ({
        ...s,
        audioFull: {
          ...s.audioFull,
          "05": s.audioFull?.["05"] || `https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/${s.nomor}.mp3`,
        },
      }));
      return res.json({
        success: true,
        data: cleanedData,
      });
    }

    // Fallback to Quran Gading API
    const gadingRes = await fetch("https://api.quran.gading.dev/surah");
    const gadingData = await gadingRes.json();
    if (gadingData && gadingData.data) {
      const formatted = gadingData.data.map((s: any) => ({
        nomor: s.number,
        nama: s.name.short,
        namaLatin: s.name.transliteration.id,
        jumlahAyat: s.numberOfVerses,
        tempatTurun: s.revelation.id,
        arti: s.name.translation.id,
        audioFull: {
          "05": `https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/${s.number}.mp3`,
          "03": `https://cdn.islamic.network/quran/audio-surah/128/ar.abdurrahmaanas-sudais/${s.number}.mp3`,
          "01": s.audio?.primary || `https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/${s.number}.mp3`,
        },
      }));
      return res.json({
        success: true,
        data: formatted,
      });
    }

    return res.status(500).json({ error: "Gagal memuat daftar surat." });
  } catch (err) {
    console.error("Error fetching Quran surahs:", err);
    res.status(500).json({ error: "Terjadi kesalahan server saat memuat Quran." });
  }
});

app.get(["/api/quran/surat/:id", "/quran/surat/:id"], async (req, res) => {
  try {
    const { id } = req.params;
    const equranRes = await fetch(`https://equran.id/api/v2/surat/${id}`);
    const equranData = await equranRes.json();

    if (equranData && equranData.code === 200 && equranData.data) {
      const d = equranData.data;
      // Add high quality CDN fallback to audioFull and audio per verse
      if (d.audioFull) {
        d.audioFull["05"] = d.audioFull["05"] || `https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/${d.nomor}.mp3`;
      }
      return res.json({
        success: true,
        data: d,
      });
    }

    // Fallback to Quran Gading API
    const gadingRes = await fetch(`https://api.quran.gading.dev/surah/${id}`);
    const gadingData = await gadingRes.json();
    if (gadingData && gadingData.data) {
      const d = gadingData.data;
      const formatted = {
        nomor: d.number,
        nama: d.name.short,
        namaLatin: d.name.transliteration.id,
        jumlahAyat: d.numberOfVerses,
        tempatTurun: d.revelation.id,
        arti: d.name.translation.id,
        deskripsi: d.tafsir?.id,
        audioFull: {
          "05": `https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/${d.number}.mp3`,
          "03": `https://cdn.islamic.network/quran/audio-surah/128/ar.abdurrahmaanas-sudais/${d.number}.mp3`,
          "01": d.audio?.primary || `https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/${d.number}.mp3`,
        },
        ayat: d.verses.map((v: any) => ({
          nomorAyat: v.number.inSurah,
          teksArab: v.text.arab,
          teksLatin: v.text.transliteration?.en || "",
          teksIndonesia: v.translation.id,
          audio: {
            "05": `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${v.number.inQuran}.mp3`,
            "01": v.audio?.primary || `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${v.number.inQuran}.mp3`,
          },
        })),
      };
      return res.json({
        success: true,
        data: formatted,
      });
    }

    return res.status(500).json({ error: "Gagal memuat detail surat." });
  } catch (err) {
    console.error("Error fetching Surah detail:", err);
    res.status(500).json({ error: "Terjadi kesalahan server saat memuat detail surat." });
  }
});

// ----------------------------------------------------
// API 5: Realtime Weather Endpoint (Open-Meteo API)
// ----------------------------------------------------
const CITY_COORDS: { [key: string]: { lat: number; lon: number } } = {
  Jakarta: { lat: -6.2088, lon: 106.8456 },
  Surabaya: { lat: -7.2575, lon: 112.7521 },
  Bandung: { lat: -6.9175, lon: 107.6191 },
  Medan: { lat: 3.5952, lon: 98.6722 },
  Yogyakarta: { lat: -7.7956, lon: 110.3695 },
  Semarang: { lat: -6.9667, lon: 110.4167 },
  Makassar: { lat: -5.1477, lon: 119.4327 },
  Palembang: { lat: -2.9761, lon: 104.7754 },
  Denpasar: { lat: -8.6705, lon: 115.2126 },
};

function getWeatherCondition(code: number): { condition: string; icon: string } {
  if (code === 0) return { condition: "Cerah", icon: "☀️" };
  if (code >= 1 && code <= 3) return { condition: "Cerah Berawan", icon: "⛅" };
  if (code >= 45 && code <= 48) return { condition: "Berkarabut / Kabut", icon: "🌫️" };
  if (code >= 51 && code <= 67) return { condition: "Hujan Ringan", icon: "🌧️" };
  if (code >= 80 && code <= 82) return { condition: "Hujan Lebat", icon: "🌧️" };
  if (code >= 95) return { condition: "Hujan Badai", icon: "⛈️" };
  return { condition: "Berawan", icon: "☁️" };
}

app.get(["/api/weather", "/weather"], async (req, res) => {
  try {
    const city = (req.query.city as string) || "Jakarta";
    const coords = CITY_COORDS[city] || CITY_COORDS["Jakarta"];

    const weatherRes = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=Asia%2FJakarta`
    );
    const data = await weatherRes.json();

    if (data && data.current) {
      const current = data.current;
      const { condition, icon } = getWeatherCondition(current.weather_code);
      
      const daysOfWeek = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
      const forecast = (data.daily?.time || []).slice(0, 5).map((dateStr: string, idx: number) => {
        const d = new Date(dateStr);
        const dayName = daysOfWeek[d.getDay()];
        const code = data.daily.weather_code[idx];
        const cond = getWeatherCondition(code);
        return {
          day: dayName,
          tempMin: Math.round(data.daily.temperature_2m_min[idx]),
          tempMax: Math.round(data.daily.temperature_2m_max[idx]),
          condition: cond.condition,
          icon: cond.icon,
        };
      });

      return res.json({
        success: true,
        city,
        temperature: Math.round(current.temperature_2m),
        condition,
        icon,
        humidity: current.relative_humidity_2m,
        windSpeed: Math.round(current.wind_speed_10m),
        uvIndex: 6,
        forecast,
      });
    }

    // Fallback if weather API is unreachable
    res.json({
      success: true,
      city,
      temperature: 30,
      condition: "Cerah Berawan",
      icon: "⛅",
      humidity: 78,
      windSpeed: 12,
      uvIndex: 6,
      forecast: [
        { day: "Hari Ini", tempMin: 24, tempMax: 32, condition: "Cerah Berawan", icon: "⛅" },
        { day: "Besok", tempMin: 25, tempMax: 31, condition: "Hujan Ringan", icon: "🌧️" },
        { day: "Lusa", tempMin: 24, tempMax: 33, condition: "Cerah", icon: "☀️" },
      ],
    });
  } catch (err) {
    res.json({
      success: true,
      city: (req.query.city as string) || "Jakarta",
      temperature: 30,
      condition: "Cerah Berawan",
      icon: "⛅",
      humidity: 78,
      windSpeed: 12,
      uvIndex: 6,
      forecast: [
        { day: "Hari Ini", tempMin: 24, tempMax: 32, condition: "Cerah Berawan", icon: "⛅" },
        { day: "Besok", tempMin: 25, tempMax: 31, condition: "Hujan Ringan", icon: "🌧️" },
      ],
    });
  }
});

// Health check endpoint
app.get(["/api/health", "/health", "/api"], (req, res) => {
  res.json({ success: true, message: "JAVA TOOLS API Server Active", status: "ok" });
});

// 404 Fallback for unmatched API routes
app.use((req, res, next) => {
  if (req.path.startsWith("/api")) {
    return res.status(404).json({ success: false, error: `Endpoint ${req.method} ${req.path} tidak ditemukan` });
  }
  next();
});

// Global Error Handler for Express
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error("Server error handler:", err);
  res.status(500).json({ success: false, error: err?.message || "Terjadi kesalahan internal pada server" });
});

// Vite middleware for development vs static serve for production

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

if (!process.env.VERCEL) {
  startServer();
}

export default app;

