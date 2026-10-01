import { useState } from 'react';
import { ArrowLeft, BookOpen, Check, ChevronRight, GraduationCap, HeartHandshake, RotateCcw, ShieldCheck, Sparkles, Trophy, UsersRound, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './SadayaCerdas.css';

const QUIZZES = {
  marriage: {
    title: 'Dampak Perkawinan Dini',
    shortTitle: 'Perkawinan dini',
    intro: 'Pahami kaitannya dengan pendidikan, kesehatan, kesejahteraan, dan kesempatan merencanakan masa depan. Dampak dapat berbeda pada tiap orang; setiap remaja berhak dihormati dan mendapat dukungan.',
    icon: GraduationCap,
    source: { label: 'UNICEF · Child marriage', url: 'https://www.unicef.org/protection/child-marriage' },
    questions: [
      { question: 'Apa yang ditunjukkan bukti tentang perkawinan sebelum usia 18 tahun?', options: ['Dapat membuat remaja lebih sulit tetap bersekolah dan membatasi kesempatan masa depan', 'Selalu meningkatkan kesempatan kerja dan pendidikan', 'Tidak berhubungan dengan kesejahteraan'], answer: 0, explanation: 'UNICEF menyebut anak yang menikah sebelum 18 tahun lebih kecil kemungkinannya untuk tetap bersekolah dan dapat mengalami dampak ekonomi serta kesehatan yang lebih buruk. Ini adalah peningkatan risiko, bukan kepastian bahwa semua orang akan mengalami hal yang sama.' },
      { question: 'Jika perkawinan dini diikuti kehamilan pada usia remaja, apa yang perlu diketahui?', options: ['Tidak ada perbedaan risiko kesehatan menurut usia', 'Ibu remaja menghadapi risiko lebih tinggi atas beberapa komplikasi, dan bayi lebih berisiko lahir prematur atau berat lahir rendah', 'Risiko hanya berkaitan dengan nilai sekolah'], answer: 1, explanation: 'WHO melaporkan risiko lebih tinggi untuk beberapa komplikasi pada ibu usia 10–19 tahun serta risiko kelahiran prematur dan berat lahir rendah pada bayi. Kehamilan dan perkawinan adalah hal berbeda; informasi ini membahas risiko kesehatan kehamilan remaja.' },
      { question: 'Bagaimana perkawinan dini dapat memengaruhi hubungan sosial dan kesejahteraan?', options: ['Tidak mungkin memengaruhi hubungan dengan keluarga atau teman', 'Dalam sebagian keadaan, dapat membuat remaja terisolasi dari keluarga dan teman serta membebani kesehatan mental', 'Selalu membuat semua masalah selesai'], answer: 1, explanation: 'UNICEF mencatat bahwa perkawinan anak dapat menjauhkan remaja dari keluarga dan teman, yang dapat berdampak pada kesejahteraan mental. Dukungan keluarga, teman tepercaya, sekolah, dan layanan perlindungan penting.' },
      { question: 'Apakah dampak perkawinan anak hanya dirasakan anak perempuan?', options: ['Ya, anak laki-laki tidak terdampak', 'Tidak. Anak laki-laki juga dapat terdampak, meskipun anak perempuan terkena jauh lebih sering dan tidak proporsional', 'Tidak ada anak yang terdampak'], answer: 1, explanation: 'UNICEF menjelaskan bahwa perkawinan anak berdampak pada anak perempuan dan laki-laki, tetapi anak perempuan jauh lebih sering terdampak.' },
      { question: 'Apa yang dapat dilakukan jika seseorang merasa ditekan untuk menikah sebelum siap?', options: ['Mencari dukungan orang dewasa tepercaya, guru, atau layanan perlindungan sambil membicarakan pilihan dengan aman', 'Menghadapi tekanan sendirian', 'Menganggap tekanan sebagai bukti bahwa ia harus langsung setuju'], answer: 0, explanation: 'Meminta dukungan dapat membantu remaja memahami pilihan dan keselamatannya. Berbicara dengan orang tepercaya atau layanan yang kompeten bukan berarti menghakimi keluarga.' },
      { question: 'Mengapa putus sekolah setelah menikah pada usia muda dapat berdampak jangka panjang?', options: ['Karena pendidikan tidak ada kaitannya dengan kesempatan kerja', 'Kesempatan belajar dan mendapat pekerjaan dapat menyempit sehingga kemandirian ekonomi dan pilihan hidup ikut terpengaruh', 'Karena semua remaja yang menikah pasti berhenti sekolah'], answer: 1, explanation: 'Pendidikan, keterampilan, dan peluang kerja saling berkaitan. Tanggung jawab dan kondisi keluarga dapat membuat sekolah lebih sulit dilanjutkan. Ini risiko yang dapat dipengaruhi dukungan dan keadaan, bukan kepastian untuk setiap orang.' },
      { question: 'Kesiapan berkeluarga yang menyeluruh paling tepat mencakup apa?', options: ['Rasa sayang dan pesta saja', 'Persetujuan tanpa paksaan, kematangan emosi, kesehatan, komunikasi, pembagian tanggung jawab, dan rencana masa depan', 'Keputusan yang dibuat teman atau keluarga tanpa melibatkan pasangan'], answer: 1, explanation: 'Keputusan besar perlu mempertimbangkan kesehatan, keselamatan, kemampuan menyelesaikan konflik, pendidikan, ekonomi, dan dukungan. Kedua pihak perlu dapat menyampaikan pilihan tanpa takut.' },
    ],
  },
  sexualHealth: {
    title: 'Risiko Seks Bebas & Kesehatan Reproduksi',
    shortTitle: 'Kesehatan reproduksi',
    intro: 'Kenali risiko kesehatan dan cara menjaga batasan diri. Kuis ini membahas informasi kesehatan secara edukatif, tidak menghakimi, dan tanpa konten eksplisit.',
    icon: HeartHandshake,
    source: { label: 'WHO · Infeksi menular seksual', url: 'https://www.who.int/en/news-room/fact-sheets/detail/sexually-transmitted-infections-%28stis%29' },
    questions: [
      { question: 'Apa risiko kesehatan yang mungkin muncul dari hubungan seksual tanpa perlindungan?', options: ['Kehamilan yang tidak direncanakan dan infeksi menular seksual (IMS)', 'Hanya rasa malu, tanpa risiko kesehatan', 'Tidak ada risiko jika kedua orang terlihat sehat'], answer: 0, explanation: 'Hubungan seksual tanpa perlindungan dapat menimbulkan risiko kehamilan yang tidak direncanakan dan penularan IMS, termasuk HIV. Informasi ini bukan untuk mempermalukan siapa pun; orang yang membutuhkan bantuan kesehatan tetap berhak memperoleh layanan.' },
      { question: 'Dapatkah seseorang mengetahui bahwa orang lain tidak memiliki IMS hanya dari penampilannya?', options: ['Ya, orang yang tampak sehat pasti bebas IMS', 'Tidak. Banyak IMS dapat tidak menimbulkan gejala sehingga pemeriksaan dan informasi kesehatan yang tepat penting', 'Ya, cukup dengan bertanya sekali'], answer: 1, explanation: 'WHO menyebut banyak IMS tidak bergejala. Penampilan atau dugaan saja tidak dapat memastikan status IMS; tenaga kesehatan dapat memberi informasi dan pemeriksaan yang sesuai.' },
      { question: 'Menurut WHO, metode kontrasepsi apa yang juga membantu mengurangi penularan IMS?', options: ['Kondom, bila digunakan dengan benar dan konsisten; perlindungannya tidak menghilangkan semua risiko', 'Pil kontrasepsi saja', 'Semua metode kontrasepsi mencegah IMS dengan cara yang sama'], answer: 0, explanation: 'WHO menjelaskan bahwa kondom adalah metode kontrasepsi yang juga membantu mencegah penularan IMS, termasuk HIV, sekaligus mencegah kehamilan. Tidak ada alasan untuk menganggap perlindungannya menghapus seluruh risiko.' },
      { question: 'Teman terus mendesakmu melakukan sesuatu yang membuatmu tidak nyaman. Apa respons yang sehat?', options: ['Kamu berhak menolak, menetapkan batasan, menjauh bila perlu, dan meminta bantuan orang tepercaya', 'Kamu harus setuju agar tidak kehilangan teman', 'Kamu perlu merahasiakan rasa tidak nyaman itu'], answer: 0, explanation: 'Batasan diri harus dihormati. Kamu boleh mengatakan tidak, pergi ke tempat aman, dan berbicara dengan orang dewasa tepercaya atau tenaga profesional bila merasa tertekan atau tidak aman.' },
      { question: 'Jika belum siap menghadapi risiko hubungan seksual, pilihan apa yang dapat membantu menjaga kesehatan?', options: ['Menunda aktivitas seksual dan mencari informasi akurat serta dukungan tepercaya', 'Mengikuti tekanan teman agar dianggap dewasa', 'Mengandalkan rumor dari media sosial'], answer: 0, explanation: 'WHO menjelaskan bahwa pendidikan kesehatan seksual yang sesuai usia mendukung pilihan berdasarkan informasi, batasan, dan perilaku yang lebih aman. Menunda aktivitas seksual adalah pilihan yang dapat diambil tanpa perlu merasa malu.' },
      { question: 'Di mana remaja sebaiknya mencari jawaban tentang kesehatan reproduksi?', options: ['Tenaga kesehatan, materi resmi, atau orang dewasa tepercaya', 'Unggahan anonim yang tidak mencantumkan sumber', 'Menyimpan semua pertanyaan sendiri'], answer: 0, explanation: 'Informasi yang akurat membantu mengambil keputusan. Tenaga kesehatan dan sumber resmi dapat menjelaskan risiko, pencegahan, pemeriksaan, dan layanan yang sesuai dengan kebutuhan.' },
      { question: 'Apa yang tepat dilakukan jika ada aktivitas seksual tanpa perlindungan atau kekhawatiran terpapar IMS?', options: ['Menunggu gejala, karena semua IMS pasti terlihat', 'Menghubungi tenaga kesehatan untuk membahas pemeriksaan dan tindak lanjut, meskipun belum ada gejala', 'Mencoba obat atau ramuan dari unggahan media sosial'], answer: 1, explanation: 'Banyak IMS dapat tidak bergejala. Tenaga kesehatan dapat memberi saran pemeriksaan dan tindak lanjut berdasarkan situasi; hindari mendiagnosis atau mengobati diri dengan sumber tidak jelas.' },
      { question: 'Mengapa mengirim atau meneruskan foto intim seseorang tanpa izin berbahaya?', options: ['Karena dapat melanggar privasi, memicu perundungan, dan membahayakan keselamatan serta kesejahteraan orang tersebut', 'Karena semua foto pribadi otomatis boleh disebarkan oleh teman', 'Karena dampaknya hanya berlangsung satu hari'], answer: 0, explanation: 'Persetujuan untuk menyimpan atau membagikan gambar tidak boleh diasumsikan. Jangan meneruskan gambar; dukung orang yang terdampak dan cari bantuan orang dewasa tepercaya.' },
    ],
  },
  livingTogether: {
    title: 'Living Together: Dampak & Kesiapan',
    shortTitle: 'living together',
    intro: 'Pahami tantangan hidup bersama pasangan dengan melihat kesiapan, relasi kuasa, kondisi ekonomi, dukungan sosial, dan keselamatan. Living together sendiri tidak otomatis menyebabkan kehamilan atau IMS; risiko kesehatan berkaitan dengan aktivitas seksual dan perlindungannya.',
    icon: UsersRound,
    source: { label: 'UNFPA Asia-Pasifik · Early union', url: 'https://asiapacific.unfpa.org/en/news/addressing-patterns-child-marriage-early-union-and-teen-pregnancy-southeast-asia-matter' },
    questions: [
      { question: 'Mana pernyataan yang paling tepat tentang living together?', options: ['Semua pasangan yang tinggal bersama pasti mengalami dampak yang sama', 'Pengalaman berbeda-beda; penting menilai persetujuan, kesiapan, kuasa, sumber daya, dukungan, dan keselamatan', 'Risikonya hanya ditentukan oleh pendapat orang lain'], answer: 1, explanation: 'Tidak tepat memberi satu label kepada semua orang. Kondisi, usia, pilihan, pembagian tanggung jawab, dan dukungan lingkungan membentuk pengalaman tiap pasangan.' },
      { question: 'Apakah tinggal serumah itu sendiri menyebabkan kehamilan atau IMS?', options: ['Ya, karena tinggal serumah otomatis menyebabkan keduanya', 'Tidak. Risiko kehamilan dan IMS berkaitan dengan aktivitas seksual dan penggunaan perlindungan; tinggal bersama dapat memiliki tantangan lain', 'Tidak ada risiko kesehatan dalam situasi apa pun'], answer: 1, explanation: 'Bedakan tempat tinggal dari aktivitas seksual. Kehamilan dan IMS memiliki jalur penularan/risiko kesehatan tertentu. Informasi harus akurat agar tidak menstigma pasangan yang tinggal bersama.' },
      { question: 'Bagaimana ketergantungan pada pasangan untuk uang atau tempat tinggal dapat memengaruhi keselamatan?', options: ['Selalu membuat seseorang lebih bebas meninggalkan hubungan', 'Dapat membuat seseorang lebih sulit menolak kontrol atau meninggalkan hubungan yang tidak aman', 'Tidak pernah berpengaruh pada pilihan seseorang'], answer: 1, explanation: 'Ketergantungan sumber daya dapat membatasi pilihan. Memiliki jaringan dukungan, akses dokumen penting, dan rencana tempat aman dapat membantu seseorang meminta pertolongan.' },
      { question: 'Hal apa yang sebaiknya dibicarakan sebelum membuat keputusan tinggal bersama?', options: ['Biaya, tugas rumah, privasi, batas diri, pendidikan/pekerjaan, keselamatan, dan rencana jika berpisah', 'Hanya warna dekorasi rumah', 'Tidak perlu membicarakan tanggung jawab jika saling menyayangi'], answer: 0, explanation: 'Pembicaraan yang jelas membantu mengungkap harapan dan kemungkinan konflik. Rencana keluar yang aman juga penting; hubungan sehat menghormati pilihan dan batas diri.' },
      { question: 'Apa dampak yang mungkin terjadi pada pendidikan dan pergaulan?', options: ['Tidak mungkin ada perubahan karena tempat tinggal tidak memengaruhi rutinitas', 'Jarak, biaya, pekerjaan domestik, konflik atau stigma dapat mengganggu belajar dan hubungan sosial pada sebagian situasi', 'Semua orang pasti kehilangan teman dan berhenti sekolah'], answer: 1, explanation: 'Perubahan rutinitas dapat memengaruhi sekolah, kerja, pertemanan, dan hubungan keluarga. Dampaknya tidak pasti dan dukungan yang aman dapat membantu menjaga keterhubungan.' },
      { question: 'Jika seseorang mengalami kontrol, ancaman, atau kekerasan dari pasangan, langkah yang paling aman adalah?', options: ['Menyalahkan diri dan merahasiakannya', 'Mencari tempat aman dan menghubungi orang dewasa tepercaya atau layanan perlindungan', 'Menyebarkan identitas dan percakapan pribadi ke publik'], answer: 1, explanation: 'Kekerasan bukan salah korban. Utamakan keselamatan, jangan membuka data pribadi ke publik, dan minta bantuan dari orang atau layanan yang dapat dipercaya.' },
      { question: 'Bagaimana keluarga dan nilai budaya sebaiknya dilibatkan dalam diskusi?', options: ['Dengan dialog yang aman, menjaga martabat dan privasi, serta menghindari ancaman atau mempermalukan', 'Dengan menyebarkan cerita pribadi agar semua orang memberi hukuman', 'Dengan menganggap semua pandangan keluarga selalu sama'], answer: 0, explanation: 'Keluarga dan komunitas dapat menjadi sumber dukungan. Dialog yang menghormati budaya sekaligus keselamatan remaja membantu mencari jalan yang sesuai tanpa stigma.' },
    ],
  },
};

export default function SadayaCerdas() {
  const navigate = useNavigate();
  const [activeQuiz, setActiveQuiz] = useState('marriage');
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
    <header className="cerdas-header"><button className="icon-btn-rounded" onClick={() => navigate('/home')} aria-label="Kembali ke beranda"><ArrowLeft size={20}/></button><div className="cerdas-brand"><span><BookOpen size={19}/></span><strong>SADAYA CERDAS</strong></div><span className="cerdas-header-spacer"/></header>
    <section className="cerdas-hero"><span className="cerdas-eyebrow"><Sparkles size={15}/> BELAJAR DENGAN TENANG, PILIH DENGAN SADAR</span><h1>Kenali dampak.<br/><span>Rancang masa depanmu.</span></h1><p>Kuis edukatif tentang living together, pernikahan dini, dan kesehatan reproduksi. Pahami risikonya tanpa menghakimi dan tanpa konten eksplisit.</p><div className="cerdas-safe-note"><ShieldCheck size={17}/> Jawabanmu tidak disimpan dan skor hanya untuk refleksi pribadi.</div></section>
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
