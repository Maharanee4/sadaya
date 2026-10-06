import { useState } from 'react';
import { ArrowLeft, BookOpen, Check, ChevronRight, HeartHandshake, Recycle, RotateCcw, ShieldCheck, Sparkles, Sprout, Trash2, Trophy, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './SadayaCerdas.css';

const QUIZZES = {
  types: {
    title: 'Kenali Jenis Sampah',
    shortTitle: 'Jenis sampah',
    intro: 'Latihan membedakan organik, nonorganik, dan residu lewat contoh yang dekat dengan kegiatan sehari-hari.',
    icon: Recycle,
    source: { label: 'SIPSN — Sistem Informasi Pengelolaan Sampah Nasional', url: 'https://sipsn.menlhk.go.id/' },
    questions: [
      { question: 'Sisa kulit jeruk dari bekal termasuk jenis apa?', options: ['Organik', 'Nonorganik', 'Residu'], answer: 0, explanation: 'Sisa buah berasal dari makhluk hidup dan umumnya mudah terurai, sehingga menjadi contoh sampah organik.' },
      { question: 'Botol plastik kosong dan kering biasanya dikelompokkan sebagai apa?', options: ['Organik', 'Nonorganik yang mungkin bisa didaur ulang', 'Residu dalam semua keadaan'], answer: 1, explanation: 'Botol plastik adalah bahan nonorganik. Fasilitas setempat menentukan apakah botol diterima untuk didaur ulang.' },
      { question: 'Tisu yang sudah kotor dan tidak dapat digunakan kembali umumnya termasuk apa?', options: ['Organik', 'Nonorganik yang dapat didaur ulang', 'Residu'], answer: 2, explanation: 'Tisu kotor biasanya tidak diterima untuk daur ulang sehingga menjadi contoh residu. Ikuti petunjuk di lokasi.' },
      { question: 'Apa yang perlu dilakukan jika jenis wadah di sekolah berbeda dari rumah?', options: ['Ikuti label dan aturan pengelolaan di sekolah', 'Gunakan warna yang diingat dari tempat lain', 'Campur semuanya agar cepat'], answer: 0, explanation: 'Cara pemilahan dapat berbeda menurut fasilitas. Label setempat menjadi panduan utama.' },
    ],
  },
  sort: {
    title: 'Latihan Memilah',
    shortTitle: 'Latihan memilah',
    intro: 'Pilih tindakan yang tepat saat memilah sampah dan menjaga bahan tetap dapat dikelola.',
    icon: Trash2,
    source: { label: 'SIMBA — Sistem Informasi Manajemen Bank Sampah', url: 'https://simba.menlhk.go.id/' },
    questions: [
      { question: 'Kamu memiliki botol minuman yang akan disetorkan ke bank sampah. Apa langkah yang baik?', options: ['Kosongkan dan keringkan, lalu cek syarat penerimaan', 'Biarkan berisi minuman', 'Campurkan dengan kulit buah'], answer: 0, explanation: 'Bahan yang kosong dan kering lebih mudah ditangani. Periksa ketentuan bank sampah karena tiap tempat dapat menerima jenis berbeda.' },
      { question: 'Kamu menemukan baterai bekas di kelas. Apa tindakan yang aman?', options: ['Pisahkan dan tanyakan jalur pengumpulan khusus kepada guru', 'Masukkan ke wadah organik', 'Bongkar sebelum dibuang'], answer: 0, explanation: 'Baterai perlu penanganan khusus. Jangan membongkar atau mencampurnya dengan sampah biasa; minta arahan guru atau pengelola.' },
      { question: 'Sisa nasi dan bungkus plastik masih menempel satu sama lain. Apa yang sebaiknya dilakukan?', options: ['Pisahkan sisa makanan dari bungkusnya', 'Masukkan keduanya ke wadah daur ulang', 'Buang di lantai dekat tempat sampah'], answer: 0, explanation: 'Memisahkan bahan membantu menghindari pencampuran sampah organik dan kemasan.' },
      { question: 'Jika ragu apakah kemasan dapat didaur ulang, bagaimana cara memastikannya?', options: ['Baca label dan tanyakan ke guru atau pengelola setempat', 'Menganggap semua kemasan pasti diterima', 'Membuangnya ke sembarang wadah'], answer: 0, explanation: 'Fasilitas daur ulang memiliki ketentuan yang berbeda. Periksa arahan setempat sebelum menyetor.' },
    ],
  },
  reduce: {
    title: 'Kurangi Sampah dengan 3R',
    shortTitle: 'Aksi 3R',
    intro: 'Uji pemahamanmu tentang cara mengurangi sampah, menggunakan kembali barang, dan mendukung daur ulang.',
    icon: Sprout,
    source: { label: 'SIPSN — Sistem Informasi Pengelolaan Sampah Nasional', url: 'https://sipsn.menlhk.go.id/' },
    questions: [
      { question: 'Membawa botol minum pakai ulang ke sekolah merupakan contoh apa?', options: ['Reduce: mengurangi sampah kemasan sekali pakai', 'Reuse: memakai sampah kotor', 'Membuang residu'], answer: 0, explanation: 'Botol pakai ulang membantu mengurangi kebutuhan botol sekali pakai.' },
      { question: 'Kertas yang masih memiliki sisi kosong dapat dimanfaatkan lagi untuk catatan. Ini contoh apa?', options: ['Reduce', 'Reuse', 'Residu'], answer: 1, explanation: 'Menggunakan kembali kertas yang masih layak merupakan reuse.' },
      { question: 'Mengapa sampah perlu dipilah sebelum diserahkan ke fasilitas pengelolaan?', options: ['Supaya bahan tidak tercampur dan lebih mudah ditangani sesuai jenisnya', 'Supaya semua sampah berubah menjadi kompos', 'Karena setiap barang pasti didaur ulang'], answer: 0, explanation: 'Pemilahan membantu pengelola menangani bahan secara sesuai, tetapi tidak semua jenis dapat didaur ulang di semua tempat.' },
      { question: 'Apa kebiasaan yang membantu mengurangi sampah saat mengambil makanan di kantin?', options: ['Ambil secukupnya dan habiskan makanan', 'Ambil berlebihan lalu buang sisanya', 'Minta beberapa alat makan sekali pakai padahal tidak perlu'], answer: 0, explanation: 'Mengambil secukupnya dapat mengurangi sisa makanan.' },
    ],
  },
};

export default function SadayaCerdas() {
  const navigate = useNavigate();
  const [activeQuiz, setActiveQuiz] = useState('types');
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answer, setAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [complete, setComplete] = useState(false);
  const quiz = QUIZZES[activeQuiz];
  const current = quiz.questions[questionIndex];
  const QuizIcon = quiz.icon;

  const chooseQuiz = (key) => { setActiveQuiz(key); setQuestionIndex(0); setAnswer(null); setScore(0); setComplete(false); };
  const chooseAnswer = (index) => {
    if (answer !== null) return;
    setAnswer(index);
    if (index === current.answer) setScore((value) => value + 1);
  };
  const nextQuestion = () => {
    if (questionIndex + 1 >= quiz.questions.length) setComplete(true);
    else { setQuestionIndex((value) => value + 1); setAnswer(null); }
  };
  const restart = () => { setQuestionIndex(0); setAnswer(null); setScore(0); setComplete(false); };

  return <main className="cerdas-page animate-fade-in">
    <header className="cerdas-header"><button className="icon-btn-rounded" onClick={() => navigate('/home')} aria-label="Kembali ke beranda"><ArrowLeft size={20}/></button><div className="cerdas-brand"><span><BookOpen size={19}/></span><strong>BALI QUIZ</strong></div><span className="cerdas-header-spacer"/></header>
    <section className="cerdas-hero"><span className="cerdas-eyebrow"><Sparkles size={15}/> BELAJAR MEMILAH DENGAN BALI</span><h1>Kenali jenisnya.<br/><span>Pilah dengan tepat.</span></h1><p>Kuis singkat untuk belajar membedakan sampah organik, nonorganik, dan residu serta mencoba kebiasaan 3R.</p><div className="cerdas-safe-note"><ShieldCheck size={17}/> Skor hanya untuk refleksi belajar dan tidak dikirim ke mana-mana.</div></section>
    <nav className="cerdas-quiz-tabs" aria-label="Pilih topik kuis">
      {Object.entries(QUIZZES).map(([key, item]) => { const Icon = item.icon; return <button key={key} className={activeQuiz === key ? 'active' : ''} onClick={() => chooseQuiz(key)}><Icon size={18}/><span>{item.title}</span></button>; })}
    </nav>
    <section className="cerdas-topic-intro"><div className="cerdas-topic-icon"><QuizIcon size={22}/></div><div><span className="cerdas-eyebrow">KUIS {Object.keys(QUIZZES).indexOf(activeQuiz) + 1} · {quiz.questions.length} SOAL</span><h2>{quiz.title}</h2><p>{quiz.intro}</p></div></section>
    <section className="cerdas-quiz-card" aria-live="polite">
      {!complete ? <>
        <div className="cerdas-progress-row"><span>Soal {questionIndex + 1} dari {quiz.questions.length}</span><span>Skor sementara: {score}</span></div>
        <div className="cerdas-progress-track"><span style={{ width: `${((questionIndex + (answer !== null ? 1 : 0)) / quiz.questions.length) * 100}%` }}/></div>
        <div className="cerdas-question"><span className="cerdas-question-number">{String(questionIndex + 1).padStart(2, '0')}</span><h3>{current.question}</h3></div>
        <div className="cerdas-options">{current.options.map((option, index) => { const selected = answer === index; const right = answer !== null && current.answer === index; const wrong = selected && index !== current.answer; return <button key={option} className={`${selected ? 'selected' : ''} ${right ? 'right' : ''} ${wrong ? 'wrong' : ''}`} onClick={() => chooseAnswer(index)} disabled={answer !== null}><span className="cerdas-option-letter">{String.fromCharCode(65 + index)}</span><span>{option}</span>{right && <Check size={17} />}{wrong && <X size={17} />}</button>; })}</div>
        {answer !== null && <div className={`cerdas-feedback ${answer === current.answer ? 'correct' : 'incorrect'}`}><strong>{answer === current.answer ? 'Tepat!' : 'Yuk, pelajari lagi.'}</strong><p>{current.explanation}</p><a href={quiz.source.url} target="_blank" rel="noreferrer">Sumber: {quiz.source.label} ↗</a></div>}
        {answer !== null && <button className="cerdas-next-button" onClick={nextQuestion}>{questionIndex + 1 === quiz.questions.length ? 'Lihat hasil kuis' : 'Lanjut ke soal berikutnya'} <ChevronRight size={17}/></button>}
      </> : <div className="cerdas-result"><span className="cerdas-result-icon"><Trophy size={30}/></span><span className="cerdas-eyebrow">KUIS SELESAI</span><h3>Kamu sudah menyelesaikan {quiz.shortTitle.toLowerCase()}.</h3><p className="cerdas-score">{score} <span>/ {quiz.questions.length}</span></p><p className="cerdas-result-note">Skor bukan penilaian atas dirimu. Gunakan penjelasan dan sumber tepercaya untuk menambah pemahaman.</p><a href={quiz.source.url} target="_blank" rel="noreferrer">Baca sumber resmi: {quiz.source.label} ↗</a><button className="cerdas-next-button" onClick={restart}><RotateCcw size={16}/> Ulangi kuis</button></div>}
    </section>
    <aside className="cerdas-support"><HeartHandshake size={20}/><div><strong>Kamu berhak mendapat dukungan</strong><p>Jika kamu atau temanmu merasa tertekan, tidak aman, atau membutuhkan jawaban pribadi, bicaralah dengan orang dewasa tepercaya atau tenaga kesehatan. Forum ini bukan layanan konsultasi profesional.</p></div></aside>
  </main>;
}
