/**
 * Utility for safe JSON fetching.
 * Never throws "Unexpected token" errors when receiving HTML or non-JSON from servers.
 */
export async function safeFetchJson(url: string, options?: RequestInit): Promise<{ ok: boolean; data: any; error?: string }> {
  try {
    const res = await fetch(url, options);
    const contentType = res.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      try {
        const data = await res.json();
        if (res.ok) {
          return { ok: true, data };
        }
        return { ok: false, data, error: data?.error || `Server error (HTTP ${res.status})` };
      } catch (parseErr) {
        console.warn(`JSON parse error for ${url}:`, parseErr);
        return { ok: false, data: null, error: `Format respon server tidak valid (HTTP ${res.status})` };
      }
    } else {
      const text = await res.text();
      console.warn(`Non-JSON response from ${url} [HTTP ${res.status}]:`, text.slice(0, 150));
      return { ok: false, data: null, error: `Respon dari server bukan JSON (HTTP ${res.status})` };
    }
  } catch (err: any) {
    console.warn(`Fetch network error for ${url}:`, err);
    return { ok: false, data: null, error: err?.message || "Kesalahan jaringan" };
  }
}
