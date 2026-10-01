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

## Deploy GitHub Pages tanpa backend

Scan tetap berjalan tanpa Vercel melalui pengenalan bertahap di browser. Model cepat (sekitar 21,5 MB) mulai disiapkan saat halaman scan dibuka dan mengenali kelas umum termasuk beberapa buah, makanan, serta air kemasan. Jika tidak menemukan kecocokan, model Food-101 (unduhan tambahan sekitar 60 MB pada pemakaian pertama) mencoba mengenali hidangan yang lebih beragam. Koneksi internet diperlukan untuk mengunduh model; setelah tersimpan, foto diproses di perangkat. Hasil merupakan prediksi visual dan perlu dicocokkan dengan nama makanan pada katalog nutrisi SADAYA. Hidangan atau minuman yang belum ada padanan terverifikasinya tetap perlu dipilih manual.

Untuk menerbitkan ke URL GitHub Pages yang sama, buka `Settings -> Pages`, pilih `GitHub Actions` sebagai sumber deploy, lalu push ke branch `main`. Workflow `.github/workflows/pages.yml` akan build dan menerbitkan situs.
