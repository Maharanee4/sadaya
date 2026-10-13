import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  AlertTriangle,
  ArrowLeft,
  BookOpenCheck,
  Camera,
  Check,
  Info,
  Leaf,
  RotateCcw,
  ScanLine,
  ShieldAlert,
  Sparkles,
  SwitchCamera,
  Upload,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { analyzeWasteImage } from '../lib/wasteApi';
import { recognizeWasteInBrowser } from '../lib/browserWasteRecognition';
import { WASTE_CATEGORIES, WASTE_GUIDE } from '../data/wasteGuide';
import './WasteFeatures.css';
import './WasteScan.css';

const MAX_IMAGE_SIZE = 12 * 1024 * 1024;

const getCategory = (id) => WASTE_CATEGORIES.find((category) => category.id === id) || WASTE_CATEGORIES[2];

function WasteScan() {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const inputRef = useRef(null);
  const streamRef = useRef(null);
  const [facingMode, setFacingMode] = useState('environment');
  const [cameraState, setCameraState] = useState('loading');
  const [cameraError, setCameraError] = useState('');
  const [photo, setPhoto] = useState('');
  const [hasFlash, setHasFlash] = useState(false);
  const [scanStep, setScanStep] = useState('');
  const [progress, setProgress] = useState(0);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('semua');
  const [selectedWasteId, setSelectedWasteId] = useState('');
  const [scannedWaste, setScannedWaste] = useState(null);
  const [historyNotice, setHistoryNotice] = useState('');

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  }, []);

  const startCamera = useCallback(async () => {
    stopCamera();
    setHasFlash(false);
    setCameraError('');
    setCameraState('loading');
    try {
      if (!window.isSecureContext) {
        throw new Error('Kamera membutuhkan HTTPS. Buka situs melalui alamat aman, lalu izinkan akses kamera.');
      }
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error('Browser ini belum mendukung akses kamera. Kamu tetap bisa mengunggah foto atau memilih katalog.');
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: facingMode }, width: { ideal: 1280 }, height: { ideal: 960 } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setCameraState('ready');
    } catch (error) {
      stopCamera();
      const message = error.name === 'NotAllowedError'
        ? 'Izin kamera ditolak. Aktifkan izin kamera pada pengaturan browser, atau pilih foto dari galeri.'
        : error.message || 'Kamera tidak dapat dibuka. Pilih foto dari galeri atau gunakan katalog.';
      setCameraError(message);
      setCameraState('error');
    }
  }, [facingMode, stopCamera]);

  useEffect(() => {
    startCamera();
    return stopCamera;
  }, [startCamera, stopCamera]);

  const setPhotoFromImage = (image) => {
    const canvas = canvasRef.current || document.createElement('canvas');
    const sourceWidth = image.videoWidth || image.naturalWidth;
    const sourceHeight = image.videoHeight || image.naturalHeight;
    if (!sourceWidth || !sourceHeight) {
      setCameraError('Foto tidak dapat dibaca. Pilih gambar JPEG, PNG, atau WebP lain.');
      setCameraState('error');
      return;
    }
    const scale = Math.min(1, 1280 / Math.max(sourceWidth, sourceHeight));
    canvas.width = Math.max(1, Math.round(sourceWidth * scale));
    canvas.height = Math.max(1, Math.round(sourceHeight * scale));
    const context = canvas.getContext('2d');
    if (!context) {
      setCameraError('Browser tidak dapat memproses foto ini. Pilih foto lain.');
      setCameraState('error');
      return;
    }
    context.fillStyle = '#fff';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    setPhoto(canvas.toDataURL('image/jpeg', 0.82));
    setCameraError('');
    stopCamera();
    setCameraState('preview');
  };

  const capturePhoto = () => {
    if (videoRef.current?.videoWidth) setPhotoFromImage(videoRef.current);
  };

  const handleUpload = (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setCameraError('Gunakan foto berformat JPEG, PNG, atau WebP.');
      setCameraState('error');
      return;
    }
    if (file.size > MAX_IMAGE_SIZE) {
      setCameraError('Ukuran foto maksimal 12 MB. Pilih foto yang lebih kecil.');
      setCameraState('error');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const image = new Image();
      image.onload = () => setPhotoFromImage(image);
      image.onerror = () => {
        setCameraError('Foto tidak dapat dibaca. Pilih gambar lain.');
        setCameraState('error');
      };
      image.src = String(reader.result);
    };
    reader.onerror = () => {
      setCameraError('Foto gagal dibaca. Pilih file gambar lain.');
      setCameraState('error');
    };
    reader.readAsDataURL(file);
  };

  const toggleFlash = async () => {
    const track = streamRef.current?.getVideoTracks?.()[0];
    if (!track?.applyConstraints) {
      setCameraError('Lampu flash tidak tersedia pada kamera ini.');
      return;
    }
    try {
      const next = !hasFlash;
      await track.applyConstraints({ advanced: [{ torch: next }] });
      setHasFlash(next);
    } catch {
      setCameraError('Lampu flash tidak tersedia pada kamera ini.');
    }
  };

  const saveScanToHistory = (item, source) => {
    const username = localStorage.getItem('moodify_currentUser');
    const record = {
      date: new Date().toISOString(),
      type: 'waste_scan',
      wasteId: item.id,
      name: item.name,
      category: item.category,
      source,
    };
    try {
      if (username) {
        const key = `moodify_data_${username}`;
        const data = JSON.parse(localStorage.getItem(key) || '{}');
        data.scanHistory = Array.isArray(data.scanHistory) ? data.scanHistory : [];
        data.scanHistory.push(record);
        localStorage.setItem(key, JSON.stringify(data));
      } else {
        const key = 'sadaya_wasteScanHistory';
        const history = JSON.parse(localStorage.getItem(key) || '[]');
        const records = Array.isArray(history) ? history : [];
        records.push(record);
        localStorage.setItem(key, JSON.stringify(records));
      }
      return 'Hasil scan tersimpan di riwayat pada perangkat ini.';
    } catch (error) {
      console.error('Riwayat scan sampah tidak dapat disimpan:', error);
      return 'Hasil berhasil ditampilkan, tetapi riwayat tidak dapat disimpan di perangkat ini.';
    }
  };

  const showResult = (item, source, confidence = null) => {
    setScannedWaste({ ...item, source, confidence });
    setHistoryNotice(saveScanToHistory(item, source));
    setProgress(100);
    setCameraError('');
    setCameraState('result');
  };

  const startAnalysis = async () => {
    if (!photo) return;
    setCameraState('scanning');
    setCameraError('');
    setProgress(8);
    setScanStep('Menyiapkan foto...');
    const steps = ['Mengenali benda pada foto...', 'Mencocokkan kategori sampah...', 'Menyiapkan panduan aman...'];
    let stepIndex = 0;
    const timer = window.setInterval(() => {
      stepIndex = Math.min(stepIndex + 1, steps.length - 1);
      setScanStep(steps[stepIndex]);
      setProgress((value) => Math.min(value + 18, 88));
    }, 900);

    try {
      const selectedItem = WASTE_GUIDE.find((item) => item.id === selectedWasteId);
      if (selectedItem) {
        showResult(selectedItem, 'Katalog manual');
        return;
      }

      let apiError = null;
      if (!window.location.hostname.endsWith('github.io') || import.meta.env.VITE_API_BASE_URL) {
        try {
          const response = await analyzeWasteImage(photo);
          const item = WASTE_GUIDE.find((candidate) => candidate.id === response.itemId);
          if (item) {
            showResult(item, 'Identifikasi AI', response.confidence);
            return;
          }
          if (response.itemId === null) {
            throw new Error('Benda belum dikenali dengan yakin.');
          }
          throw new Error('Server scan mengembalikan hasil yang tidak valid.');
        } catch (error) {
          apiError = error;
          console.warn('Waste scan API unavailable; trying local recognition:', error.message);
        }
      }

      setScanStep('Memeriksa foto langsung di perangkat...');
      const localResult = await recognizeWasteInBrowser(photo, setScanStep);
      const item = WASTE_GUIDE.find((candidate) => candidate.id === localResult?.wasteId);
      if (item) {
        showResult(item, 'Prediksi visual di perangkat', localResult.confidence);
        return;
      }
      if (apiError) {
        throw new Error(`Scan otomatis belum berhasil (${apiError.message}). Model di perangkat juga belum menemukan benda yang cukup jelas. Pilih nama benda dari katalog atau coba foto dengan objek yang lebih dekat dan terang.`);
      }
      throw new Error('Benda belum dikenali dengan cukup yakin. Coba foto yang lebih dekat dan terang, atau pilih nama benda dari katalog.');
    } catch (error) {
      console.error('Waste scan failed:', error);
      setCameraError(error.name === 'AbortError'
        ? 'Scan otomatis terlalu lama. Coba lagi atau pilih nama benda dari katalog.'
        : error.message || 'Scan gagal. Coba lagi atau pilih nama benda dari katalog.');
      setCameraState('preview');
    } finally {
      window.clearInterval(timer);
    }
  };

  const useManualSelection = () => {
    const item = WASTE_GUIDE.find((candidate) => candidate.id === selectedWasteId);
    if (item) showResult(item, 'Katalog manual');
  };

  const resetScanner = () => {
    setPhoto('');
    setScannedWaste(null);
    setSelectedWasteId('');
    setSearch('');
    setCategoryFilter('semua');
    setCameraError('');
    setHistoryNotice('');
    setProgress(0);
    startCamera();
  };

  const normalizedSearch = search.trim().toLocaleLowerCase('id');
  const visibleItems = useMemo(() => WASTE_GUIDE.filter((item) => {
    const matchesCategory = categoryFilter === 'semua' || item.category === categoryFilter;
    const searchableText = [item.name, ...item.aliases].join(' ').toLocaleLowerCase('id');
    return matchesCategory && searchableText.includes(normalizedSearch);
  }), [categoryFilter, normalizedSearch]);

  const category = scannedWaste ? getCategory(scannedWaste.category) : null;

  return (
    <main className="waste-page waste-scan-page animate-fade-in">
      <header className="waste-page-header">
        <button className="icon-btn-rounded" onClick={() => navigate('/home')} aria-label="Kembali ke beranda">
          <ArrowLeft size={20} />
        </button>
        <h2 className="waste-page-title">BALI SCAN</h2>
        <span />
      </header>

      <section className="waste-scan-hero">
        <div className="waste-scan-hero-copy">
          <span className="waste-scan-eyebrow"><ScanLine size={15} /> KENALI · PILAH · JAGA BUMI</span>
          <h1>Setiap sampah punya cerita.</h1>
          <p>Pindai benda untuk mengenali jenisnya, memahami risikonya, dan tahu cara memilah dengan lebih bijak.</p>
          <div className="waste-category-legend" aria-label="Kategori sampah">
            {WASTE_CATEGORIES.map((item) => (
              <span className={`waste-category-pill ${item.tone}`} key={item.id}>{item.name}</span>
            ))}
          </div>
        </div>
        <span className="waste-scan-hero-art" aria-hidden="true">🌱</span>
      </section>

      <section className="waste-scan-layout">
        <div className="waste-scan-main">
          <div className="waste-camera-card">
            {(cameraState === 'loading' || cameraState === 'ready') && (
              <div className="waste-camera-live">
                <video ref={videoRef} className="waste-camera-video" playsInline muted aria-label="Tampilan kamera" />
                <div className="waste-camera-guide" aria-hidden="true"><span /></div>
                <div className="waste-camera-topbar">
                  <span className="waste-camera-status"><i /> {cameraState === 'ready' ? 'KAMERA SIAP' : 'MENYIAPKAN KAMERA'}</span>
                  <div>
                    <button type="button" className={`waste-camera-icon ${hasFlash ? 'active' : ''}`} onClick={toggleFlash} aria-label="Nyalakan atau matikan flash">⚡</button>
                    <button type="button" className="waste-camera-icon" onClick={() => setFacingMode((mode) => mode === 'environment' ? 'user' : 'environment')} aria-label="Ganti kamera">
                      <SwitchCamera size={19} />
                    </button>
                  </div>
                </div>
                <span className="waste-camera-hint">Posisikan satu benda di dalam bingkai</span>
                <div className="waste-camera-controls">
                  <button type="button" className="waste-gallery-button" onClick={() => inputRef.current?.click()} aria-label="Pilih foto dari galeri">
                    <Upload size={21} />
                  </button>
                  <button type="button" className="waste-shutter" onClick={capturePhoto} disabled={cameraState !== 'ready'} aria-label="Ambil foto">
                    <span />
                  </button>
                  <span className="waste-camera-spacer" aria-hidden="true" />
                </div>
              </div>
            )}

            {cameraState === 'error' && (
              <div className="waste-camera-message">
                <Camera size={38} />
                <h3>Kamera belum tersedia</h3>
                <p>{cameraError}</p>
                <div className="waste-scan-actions">
                  <button type="button" className="waste-primary-button" onClick={startCamera}><Camera size={17} /> Coba lagi</button>
                  <button type="button" className="waste-secondary-button" onClick={() => inputRef.current?.click()}><Upload size={17} /> Pilih foto</button>
                </div>
              </div>
            )}

            {cameraState === 'preview' && (
              <div className="waste-photo-preview">
                <img src={photo} alt="Foto sampah yang akan dipindai" />
                <span className="waste-photo-label"><Check size={14} /> Foto siap dipindai</span>
                {cameraError && <p className="waste-scan-error" role="alert">{cameraError}</p>}
                <div className="waste-scan-actions">
                  <button type="button" className="waste-secondary-button" onClick={resetScanner}><RotateCcw size={16} /> Foto ulang</button>
                  <button type="button" className="waste-primary-button" onClick={startAnalysis}><Sparkles size={16} /> Kenali sampah</button>
                </div>
              </div>
            )}

            {cameraState === 'scanning' && (
              <div className="waste-scanning-state" aria-live="polite">
                <div className="waste-scan-orbit"><Leaf size={42} /></div>
                <h3>Mengenali benda...</h3>
                <p>{scanStep}</p>
                <div className="waste-scan-progress"><span style={{ width: `${progress}%` }} /></div>
                <span className="waste-progress-label">{progress}%</span>
              </div>
            )}

            {cameraState === 'result' && scannedWaste && (
              <div className="waste-scan-result">
                <div className={`waste-result-symbol ${category.tone}`} aria-hidden="true">{scannedWaste.emoji}</div>
                <span className={`waste-category-pill ${category.tone}`}>{category.name}</span>
                <h2>{scannedWaste.name}</h2>
                <p className="waste-result-description">{scannedWaste.description}</p>
                <div className="waste-confidence">
                  <span>{scannedWaste.source}</span>
                  {scannedWaste.confidence !== null && <span>Keyakinan model {Math.round(scannedWaste.confidence * 100)}%</span>}
                </div>
                <div className="waste-result-insights">
                  <article className="waste-insight-card">
                    <ShieldAlert size={20} />
                    <div><h3>Perhatikan bahayanya</h3><p>{scannedWaste.hazard}</p></div>
                  </article>
                  <article className="waste-insight-card education">
                    <BookOpenCheck size={20} />
                    <div><h3>Langkah kecil berdampak</h3><p>{scannedWaste.education}</p></div>
                  </article>
                </div>
                {scannedWaste.category === 'b3' && (
                  <p className="waste-b3-alert"><AlertTriangle size={17} /> Jangan dibuka, dibakar, atau dicampur dengan sampah rumah tangga. Minta bantuan orang dewasa/pengelola.</p>
                )}
                <p className="waste-history-notice"><Check size={15} /> {historyNotice}</p>
                <p className="waste-ai-disclaimer"><Info size={15} /> Hasil visual dapat keliru. Periksa kembali bahan dan ikuti aturan pengelolaan di daerahmu.</p>
                <button type="button" className="waste-primary-button waste-rescan-button" onClick={resetScanner}><RotateCcw size={17} /> Pindai benda lain</button>
              </div>
            )}
          </div>

          <p className="waste-camera-footnote"><ShieldAlert size={16} /> Foto diproses untuk mengenali sampah. Jangan memegang limbah berbahaya demi memotretnya.</p>
        </div>

        <aside className="waste-catalog-card">
          <div className="waste-catalog-heading">
            <span className="waste-catalog-icon"><Leaf size={19} /></span>
            <div><h2>Butuh bantuan?</h2><p>Pilih benda secara manual bila scan belum tersedia atau hasilnya kurang yakin.</p></div>
          </div>
          <label className="waste-catalog-label" htmlFor="waste-scan-search">Cari benda</label>
          <input
            id="waste-scan-search"
            className="waste-search"
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Contoh: baterai, kulit buah..."
            autoComplete="off"
          />
          <div className="waste-filter-list" aria-label="Filter kategori">
            <button type="button" className={categoryFilter === 'semua' ? 'active' : ''} onClick={() => setCategoryFilter('semua')}>Semua</button>
            {WASTE_CATEGORIES.map((item) => (
              <button type="button" key={item.id} className={categoryFilter === item.id ? 'active' : ''} onClick={() => setCategoryFilter(item.id)}>{item.name}</button>
            ))}
          </div>
          <div className="waste-catalog-list">
            {visibleItems.map((item) => {
              const itemCategory = getCategory(item.category);
              return (
                <button
                  type="button"
                  className={`waste-catalog-item ${selectedWasteId === item.id ? 'selected' : ''}`}
                  key={item.id}
                  onClick={() => setSelectedWasteId(item.id)}
                  aria-pressed={selectedWasteId === item.id}
                >
                  <span className="waste-item-emoji" aria-hidden="true">{item.emoji}</span>
                  <span className="waste-item-copy"><strong>{item.name}</strong><small className={`waste-category-text ${itemCategory.tone}`}>{itemCategory.name}</small></span>
                  {selectedWasteId === item.id && <Check size={16} />}
                </button>
              );
            })}
            {visibleItems.length === 0 && <p className="waste-catalog-empty">Benda belum ada di katalog. Coba kata lain atau tanyakan pada pengelola setempat.</p>}
          </div>
          <button type="button" className="waste-manual-button" onClick={useManualSelection} disabled={!selectedWasteId}>
            <Check size={16} /> Tampilkan panduan benda ini
          </button>
          <p className="waste-catalog-note"><Info size={14} /> Kategori bisa berbeda menurut kondisi benda dan fasilitas lokal. Sampah B3 harus dipisahkan untuk penanganan khusus.</p>
        </aside>
      </section>

      <section className="waste-education-note">
        <div><BookOpenCheck size={21} /><h2>Ingat 3 langkah baik</h2></div>
        <p><strong>Pilah</strong> sesuai jenisnya, <strong>bersihkan</strong> material daur ulang bila aman, lalu <strong>salurkan</strong> ke fasilitas yang tepat. Kurangi sampah dari sumbernya bila memungkinkan.</p>
        <button type="button" onClick={() => navigate('/education')}>Jelajahi BALI EDU <span aria-hidden="true">→</span></button>
      </section>

      <canvas ref={canvasRef} className="waste-hidden-canvas" aria-hidden="true" />
      <input ref={inputRef} className="waste-hidden-input" type="file" accept="image/jpeg,image/png,image/webp" onChange={handleUpload} />
    </main>
  );
}

export default WasteScan;
