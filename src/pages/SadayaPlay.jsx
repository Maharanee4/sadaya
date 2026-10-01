import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, BookOpen, HeartHandshake, RotateCcw, ShieldCheck, Sparkles, UsersRound } from 'lucide-react';
import './SadayaPlay.css';

const CASES = [
  {
    topic: 'Living together',
    icon: UsersRound,
    title: 'Ajakan pindah bersama',
    story: 'Ayu dan Komang masih bersekolah. Teman-teman mereka berkata bahwa tinggal bersama adalah bukti cinta. Ayu merasa belum yakin dan khawatir rencana belajar serta hubungannya dengan keluarga akan berubah.',
    question: 'Apa langkah yang paling membantu Ayu mengambil keputusan dengan sadar?',
    choices: [
      { label: 'Langsung setuju supaya tidak kehilangan pasangan.', feedback: 'Tekanan takut ditinggalkan dapat membuat keputusan terasa tidak bebas. Keputusan tempat tinggal yang besar sebaiknya tidak dibuat untuk membuktikan cinta.', considered: false },
      { label: 'Mempermalukan pasangan dan teman-temannya di media sosial.', feedback: 'Menyebarkan masalah dapat membuka privasi dan memperbesar konflik. Ayu tetap bisa menetapkan batas tanpa mempermalukan siapa pun.', considered: false },
      { label: 'Minta waktu, bicarakan kesiapan, biaya, batas diri, sekolah, dukungan, dan rencana jika keadaan berubah.', feedback: 'Pilihan ini membantu Ayu melihat dampak praktis dan emosional, memastikan tidak ada paksaan, dan menjaga akses ke dukungan. Pengalaman tiap pasangan berbeda; tinggal bersama sendiri tidak otomatis menyebabkan kehamilan atau IMS.', considered: true },
    ],
    source: { label: 'UNFPA Asia-Pasifik: perkawinan dan penyatuan usia muda', url: 'https://asiapacific.unfpa.org/en/news/addressing-patterns-child-marriage-early-union-and-teen-pregnancy-southeast-asia-matter' },
  },
  {
    topic: 'Pernikahan dini',
    icon: BookOpen,
    title: 'Rencana setelah lulus',
    story: 'Made berusia 17 tahun dan keluarganya mengusulkan agar ia segera menikah. Made ingin tetap sekolah dan belum merasa siap, tetapi takut dianggap tidak menghormati keluarga.',
    question: 'Bagaimana Made dapat menyampaikan kebutuhannya sambil mencari dukungan?',
    choices: [
      { label: 'Menyetujui saja karena semua rencana masa depan bisa dipikirkan nanti.', feedback: 'Keputusan besar yang terburu-buru dapat membuat rencana belajar, kesehatan, tanggung jawab, dan dukungan kurang dibicarakan.', considered: false },
      { label: 'Menyampaikan keinginan untuk tetap belajar dengan aman, lalu mengajak orang dewasa tepercaya atau konselor membantu dialog.', feedback: 'Menyusun percakapan dengan pendamping dapat membantu Made menjelaskan tujuan dan mengeksplorasi pilihan tanpa merendahkan keluarganya. Perkawinan usia muda dapat berkaitan dengan risiko kesehatan dan kesempatan pendidikan yang lebih sempit, tetapi dampaknya tidak sama pada setiap orang.', considered: true },
      { label: 'Berhenti bicara kepada siapa pun dan menghadapi keputusan itu sendirian.', feedback: 'Mengisolasi diri bisa membuat dukungan makin sulit dijangkau. Made berhak meminta waktu dan bantuan dari orang yang aman dan dipercaya.', considered: false },
    ],
    source: { label: 'WHO: kehamilan remaja', url: 'https://www.who.int/news-room/fact-sheets/detail/adolescent-pregnancy' },
  },
  {
    topic: 'Seks bebas, persetujuan, dan kesehatan',
    icon: HeartHandshake,
    title: 'Tekanan dalam hubungan',
    story: 'Putu mendapat tekanan dari pasangan dan teman untuk melakukan sesuatu yang belum ia inginkan. Ia juga khawatir soal risiko kehamilan, infeksi menular seksual, dan foto pribadi yang mungkin disebarkan.',
    question: 'Langkah mana yang paling mengutamakan persetujuan, privasi, dan keselamatan Putu?',
    choices: [
      { label: 'Mengikuti tekanan agar tetap diterima oleh pasangan dan teman.', feedback: 'Persetujuan harus diberikan secara bebas dan dapat ditarik kapan saja. Takut kehilangan seseorang bukan alasan untuk mengabaikan batas diri.', considered: false },
      { label: 'Mengirim foto pribadi karena sudah berpacaran.', feedback: 'Hubungan tidak otomatis menjadi izin untuk membuat atau menyebarkan gambar pribadi. Gambar dapat tersebar di luar kendali dan membahayakan privasi.', considered: false },
      { label: 'Menegaskan batas atau pergi ke tempat aman, tidak mengirim gambar, lalu bercerita kepada orang dewasa tepercaya atau tenaga kesehatan.', feedback: 'Putu berhak menolak dan mencari bantuan. Jika khawatir tentang paparan IMS atau kehamilan, tenaga kesehatan dapat menjelaskan pemeriksaan dan tindak lanjut yang sesuai. Banyak IMS tidak selalu menunjukkan gejala.', considered: true },
    ],
    source: { label: 'WHO: infeksi menular seksual', url: 'https://www.who.int/news-room/fact-sheets/detail/sexually-transmitted-infections-%28stis%29' },
  },
];

export default function SadayaPlay() {
  const navigate = useNavigate();
  const [started, setStarted] = useState(false);
  const [caseIndex, setCaseIndex] = useState(0);
  const [choiceIndex, setChoiceIndex] = useState(null);
  const [score, setScore] = useState(0);
  const [complete, setComplete] = useState(false);
  const currentCase = CASES[caseIndex];
  const CaseIcon = currentCase.icon;

  const choose = (index) => {
    if (choiceIndex !== null) return;
    setChoiceIndex(index);
    if (currentCase.choices[index].considered) setScore((current) => current + 1);
  };

  const nextCase = () => {
    if (caseIndex === CASES.length - 1) setComplete(true);
    else {
      setCaseIndex((current) => current + 1);
      setChoiceIndex(null);
    }
  };

  const restart = () => {
    setStarted(false);
    setCaseIndex(0);
    setChoiceIndex(null);
    setScore(0);
    setComplete(false);
  };

  return (
    <main className="sadaya-play-page animate-fade-in">
      <header className="sadaya-play-header">
        <button className="icon-btn-rounded" onClick={() => navigate('/home')} aria-label="Kembali ke beranda"><ArrowLeft size={20} /></button>
        <div className="sadaya-play-brand"><span><Sparkles size={19} /></span><strong>SADAYA BERDAYA</strong></div>
        <span className="sadaya-play-spacer" />
      </header>

      <section className="sadaya-play-hero">
        <span className="sadaya-play-eyebrow"><ShieldCheck size={15} /> GAME EDUKATIF · KASUS FIKTIF</span>
        <h1>Pikirkan pilihanmu.<br /><span>Jaga masa depanmu.</span></h1>
        <p>Latih cara mengenali tekanan, memahami dampak, menetapkan batas, dan mencari dukungan melalui tiga situasi remaja fiktif.</p>
        <div className="sadaya-play-safety"><HeartHandshake size={17} /> Tidak ada jawaban yang menilai dirimu. Skor hanya untuk refleksi dan tidak disimpan.</div>
      </section>

      {!started ? (
        <section className="sadaya-play-start">
          <div className="sadaya-play-topic-chips">{CASES.map(({ topic }) => <span key={topic}>{topic}</span>)}</div>
          <h2>Siap mencoba?</h2>
          <p>Baca kasus, pilih respons yang paling bijak menurutmu, lalu simak alasan dan sumber bacaan. Kamu bisa mengulang permainan kapan saja.</p>
          <button className="sadaya-play-primary" onClick={() => setStarted(true)}>Mulai permainan <ArrowRight size={17} /></button>
        </section>
      ) : complete ? (
        <section className="sadaya-play-result" aria-live="polite">
          <span className="sadaya-play-result-icon"><Sparkles size={28} /></span>
          <span className="sadaya-play-eyebrow">TANTANGAN SELESAI</span>
          <h2>Terima kasih sudah berpikir dengan saksama.</h2>
          <p className="sadaya-play-score">{score}<span> / {CASES.length} pilihan reflektif</span></p>
          <p>Skor bukan penilaian dirimu. Yang penting adalah memahami konteks, keselamatan, persetujuan, dampak, dan dukungan yang tersedia.</p>
          <div className="sadaya-play-result-actions">
            <button className="sadaya-play-primary" onClick={restart}><RotateCcw size={16} /> Main lagi</button>
            <button className="sadaya-play-secondary" onClick={() => navigate('/education')}>Baca SADAYA EDU <BookOpen size={16} /></button>
          </div>
        </section>
      ) : (
        <section className="sadaya-play-case" aria-live="polite">
          <div className="sadaya-play-case-progress"><span>Kasus {caseIndex + 1} dari {CASES.length}</span><span>{currentCase.topic}</span></div>
          <div className="sadaya-play-progress-track"><span style={{ width: `${((caseIndex + (choiceIndex !== null ? 1 : 0)) / CASES.length) * 100}%` }} /></div>
          <div className="sadaya-play-case-title"><span><CaseIcon size={22} /></span><div><small>KASUS FIKTIF</small><h2>{currentCase.title}</h2></div></div>
          <p className="sadaya-play-story">{currentCase.story}</p>
          <h3>{currentCase.question}</h3>
          <div className="sadaya-play-choices">
            {currentCase.choices.map((choice, index) => {
              const selected = choiceIndex === index;
              const recommended = choiceIndex !== null && choice.considered;
              return <button key={choice.label} className={`${selected ? 'selected' : ''} ${recommended ? 'recommended' : ''}`} onClick={() => choose(index)} disabled={choiceIndex !== null}>
                <span className="sadaya-play-choice-letter">{String.fromCharCode(65 + index)}</span><span>{choice.label}</span>
              </button>;
            })}
          </div>
          {choiceIndex !== null && <div className="sadaya-play-feedback"><strong>Yuk, pikirkan dampaknya</strong><p>{currentCase.choices[choiceIndex].feedback}</p><a href={currentCase.source.url} target="_blank" rel="noreferrer">Sumber bacaan: {currentCase.source.label} ↗</a></div>}
          {choiceIndex !== null && <button className="sadaya-play-primary sadaya-play-next" onClick={nextCase}>{caseIndex === CASES.length - 1 ? 'Lihat refleksi akhir' : 'Lanjut ke kasus berikutnya'} <ArrowRight size={16} /></button>}
        </section>
      )}

      <aside className="sadaya-play-support"><HeartHandshake size={19} /><p>Jika situasi ini terasa dekat dengan pengalamanmu, kamu tidak harus menghadapinya sendiri. Utamakan keselamatan dan bicaralah dengan orang dewasa tepercaya atau tenaga kesehatan.</p></aside>
    </main>
  );
}
