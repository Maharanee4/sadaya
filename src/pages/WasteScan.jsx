import { useMemo, useState } from 'react';
import { ArrowLeft, ScanLine, Search, ShieldAlert } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './WasteFeatures.css';

const guide = [
  { name: 'Kulit buah dan sayur', type: 'Organik', tone: '', note: 'Pisahkan sisa makanan dari kemasannya. Bisa diolah menjadi kompos jika tersedia.' },
  { name: 'Sisa nasi atau makanan', type: 'Organik', tone: '', note: 'Tiriskan cairan bila memungkinkan dan masukkan ke wadah organik sesuai arahan sekolah.' },
  { name: 'Daun kering', type: 'Organik', tone: '', note: 'Daun dan ranting kecil umumnya dapat dikumpulkan untuk pengomposan.' },
  { name: 'Botol plastik bersih', type: 'Nonorganik', tone: 'blue', note: 'Kosongkan dan keringkan. Pastikan bank sampah atau fasilitas sekolah menerima jenis plastik ini.' },
  { name: 'Kaleng minuman', type: 'Nonorganik', tone: 'blue', note: 'Kosongkan dan setorkan ke tempat daur ulang bila diterima fasilitas setempat.' },
  { name: 'Kertas bersih dan kering', type: 'Nonorganik', tone: 'blue', note: 'Gunakan kembali jika masih ada sisi kosong, atau tanyakan cara setor di sekolah.' },
  { name: 'Botol kaca', type: 'Nonorganik', tone: 'blue', note: 'Tangani dengan hati-hati agar tidak pecah. Ikuti petunjuk pengumpulan setempat.' },
  { name: 'Tisu kotor', type: 'Residu', tone: 'gray', note: 'Tisu yang kotor umumnya tidak dapat didaur ulang; ikuti label wadah di sekolah.' },
  { name: 'Kemasan sachet berlapis', type: 'Cek aturan lokal', tone: 'yellow', note: 'Tidak semua fasilitas menerimanya. Periksa panduan bank sampah atau pengelola setempat sebelum menentukan wadah.' },
  { name: 'Baterai bekas', type: 'Penanganan khusus', tone: 'yellow', note: 'Jangan campur dengan sampah biasa atau dibongkar. Serahkan melalui titik pengumpulan khusus sesuai arahan guru/pengelola.' },
  { name: 'Lampu dan barang elektronik rusak', type: 'Penanganan khusus', tone: 'yellow', note: 'Simpan dengan aman dan tanyakan jalur pengumpulan khusus kepada guru atau pengelola sampah.' },
];

export default function WasteScan() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const matches = useMemo(() => guide.filter((item) => item.name.toLowerCase().includes(search.trim().toLowerCase())), [search]);
  return <main className="waste-page animate-fade-in">
    <header className="waste-page-header"><button className="icon-btn-rounded" onClick={() => navigate('/home')} aria-label="Kembali ke beranda"><ArrowLeft size={20}/></button><h2 className="waste-page-title">BALI SCAN</h2><span/></header>
    <section className="waste-hero"><span className="waste-eyebrow"><ScanLine size={14}/> KENALI SEBELUM MEMILAH</span><h1>Cari jenis sampah</h1><p>Ketik nama benda untuk melihat panduan kategori dan cara menanganinya. Contoh di sini bersifat edukatif; ikuti petunjuk sekolah dan fasilitas setempat.</p></section>
    <section className="waste-panel"><label htmlFor="waste-scan-search"><strong>Cari benda</strong></label><div style={{position:'relative'}}><Search size={18} aria-hidden="true" style={{position:'absolute',left:13,top:22,color:'#678276'}}/><input id="waste-scan-search" className="waste-search" style={{paddingLeft:40}} value={search} onChange={(event) => { setSearch(event.target.value); setSelected(null); }} placeholder="Contoh: kulit buah, botol plastik…" autoComplete="off"/></div>
      <div className="waste-result-list">{(search ? matches : guide.slice(0, 6)).map((item) => <button type="button" key={item.name} onClick={() => setSelected(item)} className={`waste-result-button ${selected?.name === item.name ? 'selected' : ''}`}><span className={`waste-tag ${item.tone}`}>{item.type}</span><span className="waste-result-title">{item.name}</span></button>)}</div>
      {search && matches.length === 0 && <p className="waste-muted">Contoh belum ada di panduan. Coba kata lain atau tanyakan kepada guru/petugas kebersihan.</p>}
      {selected && <div className="waste-answer" aria-live="polite"><span className={`waste-tag ${selected.tone}`}>{selected.type}</span><strong>{selected.name}</strong><p className="waste-muted">{selected.note}</p></div>}
    </section>
    <p className="waste-warning"><ShieldAlert size={18} aria-hidden="true"/>BALI SCAN mencocokkan kata dengan contoh panduan, bukan menganalisis foto atau memastikan jenis material secara otomatis.</p>
    <section className="waste-panel"><h2>Masih bingung?</h2><p className="waste-muted">Baca materi BALI EDU atau tanyakan aturan tempat sampah di sekolahmu.</p><button className="waste-action" onClick={() => navigate('/education')}>Buka BALI EDU</button></section>
  </main>;
}
