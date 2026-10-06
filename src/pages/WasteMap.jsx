import { useState } from 'react';
import { ArrowLeft, ExternalLink, MapPin, ShieldAlert } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './WasteFeatures.css';

const regions = ['Jembrana', 'Tabanan', 'Badung', 'Gianyar', 'Klungkung', 'Bangli', 'Karangasem', 'Buleleng', 'Denpasar'];

export default function WasteMap() {
  const navigate = useNavigate();
  const [region, setRegion] = useState('Gianyar');
  return <main className="waste-page animate-fade-in">
    <header className="waste-page-header"><button className="icon-btn-rounded" onClick={() => navigate('/home')} aria-label="Kembali ke beranda"><ArrowLeft size={20}/></button><h2 className="waste-page-title">BALI MAP</h2><span/></header>
    <section className="waste-hero"><span className="waste-eyebrow"><MapPin size={14}/> FASILITAS PENGELOLAAN</span><h1>Temukan panduan fasilitas resmi</h1><p>Pilih wilayahmu, lalu gunakan portal pemerintah untuk mencari bank sampah, TPS 3R, rumah kompos, dan fasilitas pengelolaan sampah lainnya.</p></section>
    <section className="waste-panel"><h2>Pilih kabupaten/kota</h2><p className="waste-muted">Wilayah pilihan: <strong>{region}</strong></p><div className="waste-region-grid">{regions.map((item) => <button type="button" className="waste-region" aria-pressed={region === item} key={item} onClick={() => setRegion(item)}>{item}</button>)}</div><p className="waste-muted">Pilihan ini hanya membantu menyiapkan pencarian. Peta dan data fasilitas tidak ditampilkan langsung di BALI; cek data terbaru dan filter wilayah di portal resmi.</p>
      <div className="waste-source-links"><a href="https://sipsn.menlhk.go.id/" target="_blank" rel="noreferrer">SIPSN · Data fasilitas pengelolaan sampah <ExternalLink size={15}/></a><a href="https://simba.menlhk.go.id/" target="_blank" rel="noreferrer">SIMBA · Direktori bank sampah <ExternalLink size={15}/></a></div>
    </section>
    <p className="waste-warning"><ShieldAlert size={18}/>Halaman ini tidak meminta lokasi perangkat atau menampilkan titik fasilitas secara langsung. Periksa alamat, jam layanan, dan penerimaan jenis sampah ke pengelola sebelum berkunjung.</p>
  </main>;
}
