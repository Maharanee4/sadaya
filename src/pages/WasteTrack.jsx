import { useMemo, useState } from 'react';
import { ArrowLeft, BarChart3, RotateCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './WasteFeatures.css';

const actions = [
  { id: 'sort', title: 'Pisahkan sampah hari ini', detail: 'Cek label dan pisahkan organik, nonorganik, serta residu.' },
  { id: 'reuse', title: 'Gunakan barang pakai ulang', detail: 'Misalnya botol minum, kotak makan, atau tas belanja.' },
  { id: 'food', title: 'Kurangi sisa makanan', detail: 'Ambil makanan secukupnya dan simpan sisa dengan baik bila aman.' },
];
const key = 'bali_track_daily_v1';
const today = () => { const date = new Date(); return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`; };
const read = () => { try { const stored = JSON.parse(localStorage.getItem(key) || '{}'); return stored.date === today() ? stored.done || {} : {}; } catch { return {}; } };

export default function WasteTrack() {
  const navigate = useNavigate();
  const [done, setDone] = useState(read);
  const count = useMemo(() => Object.values(done).filter(Boolean).length, [done]);
  const toggle = (id) => { const next = { ...done, [id]: !done[id] }; setDone(next); localStorage.setItem(key, JSON.stringify({ date: today(), done: next })); };
  const reset = () => { setDone({}); localStorage.setItem(key, JSON.stringify({ date: today(), done: {} })); };
  return <main className="waste-page animate-fade-in">
    <header className="waste-page-header"><button className="icon-btn-rounded" onClick={() => navigate('/home')} aria-label="Kembali ke beranda"><ArrowLeft size={20}/></button><h2 className="waste-page-title">BALI TRACK</h2><span/></header>
    <section className="waste-hero"><span className="waste-eyebrow"><BarChart3 size={14}/> CATAT KEBIASAAN BAIK</span><h1>Aksi kecil hari ini</h1><p>Tandai kebiasaan yang sudah kamu lakukan. Ini checklist pribadi, bukan pengukuran berat sampah atau verifikasi kegiatan.</p></section>
    <section className="waste-panel"><h2>Progres hari ini · {count}/{actions.length}</h2><div className="waste-progress-track" role="progressbar" aria-label="Progres aksi hari ini" aria-valuenow={count} aria-valuemin={0} aria-valuemax={actions.length}><span style={{width:`${(count/actions.length)*100}%`}}/></div>
      {actions.map((action) => <label className="waste-task" key={action.id}><input type="checkbox" checked={Boolean(done[action.id])} onChange={() => toggle(action.id)}/><span><strong>{action.title}</strong><small>{action.detail}</small></span></label>)}
      <button type="button" className="waste-action" style={{marginTop:14}} onClick={reset}><RotateCcw size={15} style={{verticalAlign:'middle',marginRight:6}}/>Reset checklist</button>
    </section>
    <p className="waste-muted">Checklist tersimpan hanya di browser/perangkat ini. Riwayat harian tidak dikirim ke server.</p>
  </main>;
}
