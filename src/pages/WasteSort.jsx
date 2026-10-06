import { useState } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2, RotateCcw, Sprout } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './WasteFeatures.css';

const items = [
  { name: 'Kulit pisang', answer: 'Organik', why: 'Sisa buah umumnya mudah terurai dan dapat dikelola sebagai sampah organik.' },
  { name: 'Botol plastik kosong', answer: 'Nonorganik', why: 'Botol plastik termasuk nonorganik; cek apakah fasilitas sekolah menerimanya untuk didaur ulang.' },
  { name: 'Tisu bekas makanan', answer: 'Residu', why: 'Tisu kotor umumnya tidak diterima untuk daur ulang dan menjadi contoh residu.' },
  { name: 'Baterai bekas', answer: 'Penanganan khusus', why: 'Baterai perlu jalur pengumpulan khusus; jangan campur dengan wadah sampah biasa.' },
  { name: 'Daun kering', answer: 'Organik', why: 'Daun kering dapat dikumpulkan untuk kompos jika sarana pengolahan tersedia.' },
  { name: 'Kaleng minuman kosong', answer: 'Nonorganik', why: 'Kaleng dapat dikumpulkan sebagai bahan nonorganik sesuai ketentuan fasilitas.' },
  { name: 'Lampu rusak', answer: 'Penanganan khusus', why: 'Lampu perlu ditangani dengan aman. Minta arahan guru atau pengelola setempat.' },
  { name: 'Kemasan berlapis yang tidak diterima fasilitas', answer: 'Residu', why: 'Jika fasilitas setempat belum menerima kemasan tersebut, ikuti panduan mereka untuk residu.' },
];
const categories = ['Organik', 'Nonorganik', 'Residu', 'Penanganan khusus'];

export default function WasteSort() {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [score, setScore] = useState(0);
  const item = items[index];
  const choose = (value) => { if (answer) return; setAnswer(value); if (value === item.answer) setScore((current) => current + 1); };
  const next = () => { setIndex((current) => (current + 1) % items.length); setAnswer(''); };
  const restart = () => { setIndex(0); setAnswer(''); setScore(0); };
  return <main className="waste-page animate-fade-in">
    <header className="waste-page-header"><button className="icon-btn-rounded" onClick={() => navigate('/home')} aria-label="Kembali ke beranda"><ArrowLeft size={20}/></button><h2 className="waste-page-title">BALI PILAH</h2><span/></header>
    <section className="waste-hero"><span className="waste-eyebrow"><Sprout size={14}/> LATIHAN PEMILAHAN</span><h1>Masuk wadah mana?</h1><p>Pilih kategori untuk setiap benda. Ada beberapa benda yang perlu jalur penanganan khusus di luar tiga kategori utama.</p></section>
    <section className="waste-panel" aria-live="polite"><div style={{display:'flex',justifyContent:'space-between',gap:12,alignItems:'center'}}><span className="waste-tag">Benda {index + 1} dari {items.length}</span><strong>Skor {score}</strong></div><div className="waste-progress-track"><span style={{width:`${((index + 1) / items.length) * 100}%`}}/></div><h2 style={{fontSize:22,margin:'20px 0 14px'}}>{item.name}</h2><div className="waste-choice-grid">{categories.map((category) => <button type="button" key={category} onClick={() => choose(category)} className={`waste-choice ${answer && category === item.answer ? 'correct' : ''} ${answer === category && answer !== item.answer ? 'incorrect' : ''}`} aria-pressed={answer === category}>{category}</button>)}</div>
      {answer && <div className="waste-answer"><strong>{answer === item.answer ? 'Tepat!' : `Jawaban yang disarankan: ${item.answer}`}</strong><p className="waste-feedback">{item.why}</p></div>}
      <div style={{display:'flex',justifyContent:'space-between',gap:10,marginTop:16}}><button type="button" className="waste-action" onClick={restart}><RotateCcw size={16} style={{verticalAlign:'middle',marginRight:6}}/>Ulangi</button><button type="button" className="waste-action" onClick={next} disabled={!answer} style={{opacity:answer?1:.55}}>{index === items.length - 1 ? 'Mulai lagi' : 'Berikutnya'} <ArrowRight size={16} style={{verticalAlign:'middle',marginLeft:6}}/></button></div>
    </section>
    <p className="waste-warning"><CheckCircle2 size={17}/>Label dan fasilitas berbeda antar sekolah/wilayah. Kalau ragu, ikuti petunjuk lokal atau tanya guru.</p>
  </main>;
}
