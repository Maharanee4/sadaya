const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

export const analyzeWasteImage = async (imageB64) => {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 30000);

  try {
    const response = await fetch(`${API_BASE}/api/waste/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image_b64: imageB64 }),
      signal: controller.signal,
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok || data?.ok === false) {
      throw new Error(data?.error || `Analisis gagal (HTTP ${response.status}).`);
    }
    if (data?.itemId !== null && typeof data?.itemId !== 'string') {
      throw new Error('Scan otomatis belum tersedia di situs ini. Pilih benda dari katalog untuk melihat panduan.');
    }
    return data;
  } finally {
    window.clearTimeout(timeout);
  }
};
