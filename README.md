# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Supabase Sync

Untuk sinkron data lintas device (bukan localStorage per browser), lihat panduan di `SUPABASE_SETUP.md`.

## SADAYA YOWANA

Forum tersedia di halaman `/yowana`. Tanpa API/database aktif, halaman memakai topik contoh berlabel dan menyimpan kiriman lokal hanya pada browser yang digunakan. Agar diskusi dibagikan antarperangkat:

1. Konfigurasikan `NEON_DATABASE_URL` pada deployment serverless dan jalankan atau jalankan ulang `SADAYA_YOWANA_SETUP.sql` pada database Neon untuk membuat/memperbarui tabel forum dan jadwal.
2. Atur `SADAYA_YOWANA_MODERATOR_TOKEN` sebagai secret server yang panjang dan acak. Token ini tidak boleh memakai awalan `VITE_` atau disimpan di kode klien.
3. Gunakan build/deployment yang menyajikan route serverless `api/yowana.js` (misalnya Vercel). Mode GitHub Pages saja hanya mendukung data lokal.

Kiriman anonim menampilkan nama samaran saja. Rate limit server memakai hash alamat IP dan tidak menyimpan alamat mentah. Karena aplikasi ini belum menyediakan identitas/role pengurus yang terverifikasi, token server di atas adalah kontrol moderasi sementara untuk pengurus tepercaya; gunakan proteksi akses tambahan di deployment produksi bila diperlukan.

## Deploy Vercel

Untuk checklist deploy lengkap (env + verifikasi), lihat `VERCEL_CHECKLIST.md`.

## BALI SCAN

BALI SCAN menyediakan kamera, unggah foto, katalog identifikasi manual, dan panduan bahaya/edukasi untuk sampah organik, anorganik, residu, dan B3. Di GitHub Pages, pengenalan foto berjalan langsung di browser: model visual diunduh saat scan pertama kali (sekitar 22 MB), lalu foto diproses di perangkat. Untuk identifikasi melalui server pada deployment yang mendukung serverless, deploy route `api/waste/analyze.js` dan atur `GEMINI_API_KEY` sebagai secret server (jangan gunakan awalan `VITE_`). Katalog manual tetap tersedia tanpa backend atau API key. Hasil prediksi visual dapat keliru; periksa kembali benda dan ikuti aturan pengelolaan di daerahmu, terutama untuk sampah B3.

## Deploy GitHub Pages tanpa backend

Kamera, pengenalan visual di perangkat, dan katalog BALI SCAN tersedia tanpa backend. Model visual memerlukan koneksi internet untuk diunduh saat pertama kali; foto setelahnya diproses di perangkat. Pengenalan model terbatas pada benda yang didukung, sehingga gunakan katalog manual jika hasilnya tidak meyakinkan.

Untuk menerbitkan ke URL GitHub Pages yang sama, buka `Settings -> Pages`, pilih `GitHub Actions` sebagai sumber deploy, lalu push ke branch `main`. Workflow `.github/workflows/pages.yml` akan build dan menerbitkan situs.
