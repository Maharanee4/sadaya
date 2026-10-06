import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, GraduationCap, Lightbulb, Recycle, ShieldCheck, Trophy, UsersRound } from 'lucide-react';
import './Education.css';

const topics = [
    {
        icon: <Recycle size={23} />, color: 'green', category: 'Kenali jenis sampah',
        title: 'Organik, nonorganik, dan residu: apa bedanya?',
        summary: 'Pelajari ciri dasar dan contoh benda yang sering ditemukan di kelas atau rumah.',
        sections: [
            { heading: 'Sampah organik', text: 'Berasal dari sisa makhluk hidup dan umumnya mudah terurai, seperti sisa buah, sayur, makanan, daun, dan ranting kecil. Pisahkan dari kemasan agar bahan organik lebih mudah dikelola, misalnya melalui kompos jika tersedia.' },
            { heading: 'Sampah nonorganik', text: 'Banyak berupa bahan seperti botol plastik, kaleng, kaca, atau kertas yang dapat digunakan kembali atau didaur ulang jika kondisinya sesuai. Kosongkan, bilas bila perlu, dan keringkan kemasan sebelum dikumpulkan. Tidak semua benda nonorganik diterima setiap fasilitas; tanyakan aturan bank sampah atau pengelola setempat.' },
            { heading: 'Sampah residu', text: 'Sisa yang tidak dapat digunakan kembali atau belum diterima untuk didaur ulang oleh fasilitas di sekitar kita. Contohnya bisa berupa tisu kotor atau kemasan campuran yang sulit dipisahkan. Jenis yang diterima dapat berbeda antarwilayah, jadi ikuti panduan sekolah dan layanan sampah setempat.' },
            { heading: 'Bagaimana dengan baterai dan barang elektronik?', text: 'Baterai, lampu, dan barang elektronik rusak perlu penanganan khusus. Jangan otomatis memasukkannya ke wadah organik, nonorganik, atau residu. Simpan dengan aman dan tanyakan kepada guru atau pengelola sampah setempat ke mana benda tersebut harus diserahkan.' },
        ],
        sources: [{ label: 'SIPSN — Sistem Informasi Pengelolaan Sampah Nasional', url: 'https://sipsn.menlhk.go.id/' }, { label: 'SIMBA — Sistem Informasi Manajemen Bank Sampah', url: 'https://simba.menlhk.go.id/' }]
    },
    {
        icon: <ShieldCheck size={23} />, color: 'blue', category: 'Langkah memilah',
        title: 'Empat langkah mudah memilah sampah',
        summary: 'Mulai dari mengenali bahan sampai memastikan sampah masuk ke wadah yang tepat.',
        sections: [
            { heading: '1. Periksa bendanya', text: 'Lihat bahan dan kondisinya. Sisa makanan berbeda dari kemasannya; pisahkan keduanya sebelum membuang.' },
            { heading: '2. Pisahkan sesuai jenis', text: 'Masukkan sisa makanan dan daun ke wadah organik. Kumpulkan kemasan yang bersih dan dapat didaur ulang di wadah nonorganik. Masukkan sisa yang tidak dapat dimanfaatkan ke wadah residu sesuai aturan sekolah.' },
            { heading: '3. Kosongkan dan keringkan', text: 'Tuang sisa minuman, bersihkan kemasan seperlunya, lalu keringkan sebelum disetor sebagai bahan daur ulang. Kemasan yang masih penuh atau sangat kotor dapat mengotori bahan lain.' },
            { heading: '4. Cek petunjuk di lokasi', text: 'Warna dan jenis wadah tidak selalu sama di setiap tempat. Baca label tempat sampah di sekolah dan tanyakan kepada guru jika ragu. Untuk baterai, lampu, elektronik, dan benda berbahaya, gunakan jalur pengumpulan khusus.' },
        ]
    },
    {
        icon: <Lightbulb size={23} />, color: 'gold', category: 'Contoh di sekolah',
        title: 'Latihan memilah dari kegiatan sehari-hari',
        summary: 'Kenali jenis sampah dari bekal, kelas, kantin, dan kegiatan bersama.',
        sections: [
            { heading: 'Setelah makan bekal', text: 'Sisa kulit pisang dan nasi termasuk contoh sampah organik. Bungkus yang dapat didaur ulang dikosongkan dan dipisahkan; cek label wadah sekolah.' },
            { heading: 'Setelah memakai buku atau kertas', text: 'Kertas yang kering dan bersih bisa dikumpulkan untuk digunakan kembali atau disalurkan ke bank sampah, sesuai kebijakan sekolah. Kertas basah atau terkena makanan perlu dipisahkan karena tidak mudah didaur ulang.' },
            { heading: 'Saat mengadakan acara', text: 'Sediakan wadah berlabel yang jelas, kurangi barang sekali pakai, dan tunjuk teman untuk membantu mengingatkan dengan sopan. Setelah acara, periksa apakah isi wadah sudah dipilah dengan benar.' },
            { heading: 'Kalau masih ragu', text: 'Jangan menebak warna tempat sampah. Baca label, minta bantuan guru atau petugas kebersihan, dan ikuti kebiasaan pengelolaan sampah di sekolah.' },
        ]
    },
    {
        icon: <ShieldCheck size={23} />, color: 'blue', category: 'Dampak sampah tercampur',
        title: 'Apa akibatnya jika sampah tidak dipilah?',
        summary: 'Ketahui dampak langsung sampah tercampur bagi kebersihan, kesehatan, dan proses pengolahan.',
        sections: [
            { heading: 'Bahan daur ulang ikut kotor', text: 'Sisa makanan dan cairan yang bercampur dengan kertas atau kemasan dapat membuat bahan yang semula bisa dimanfaatkan menjadi kotor atau sulit diproses. Akibatnya, petugas perlu memilah ulang dan sebagian bahan mungkin berakhir sebagai residu.' },
            { heading: 'Beban pengelolaan bertambah', text: 'Sampah campuran membutuhkan lebih banyak waktu dan tenaga untuk dipilah. Jika pemilahan di sumbernya tidak dilakukan, pengelolaan di sekolah maupun fasilitas setempat menjadi lebih sulit.' },
            { heading: 'Risiko kebersihan dan lingkungan', text: 'Sampah organik yang menumpuk dapat menimbulkan bau dan mengundang hewan pengganggu. Sampah yang tercecer juga dapat menyumbat saluran air atau terbawa ke sungai dan laut.' },
            { heading: 'Sampah khusus bisa membahayakan', text: 'Baterai, lampu, dan barang elektronik yang tercampur dengan sampah biasa dapat berisiko bagi orang yang mengelolanya. Pisahkan dan tanyakan jalur penanganan khusus kepada guru atau petugas.' },
        ],
        sources: [{ label: 'SIPSN — Sistem Informasi Pengelolaan Sampah Nasional', url: 'https://sipsn.menlhk.go.id/' }]
    },
    {
        icon: <UsersRound size={23} />, color: 'violet', category: 'Dampak untuk masa depan',
        title: 'Mengapa kebiasaan memilah penting untuk masa depan?',
        summary: 'Kebiasaan kecil di rumah dan sekolah membantu membangun lingkungan yang lebih bersih dan bertanggung jawab.',
        sections: [
            { heading: 'Mengurangi sampah yang berakhir di tempat pemrosesan', text: 'Saat sisa organik dikelola terpisah dan bahan yang dapat didaur ulang dikumpulkan sesuai aturan, lebih sedikit material yang harus dibuang sebagai campuran. Hasilnya bergantung pada kebiasaan memilah dan fasilitas yang tersedia.' },
            { heading: 'Menjaga lingkungan sekitar', text: 'Mencegah sampah tercecer membantu menjaga halaman, selokan, sungai, dan ruang publik tetap bersih. Ini menjadi bagian dari tanggung jawab bersama agar lingkungan nyaman digunakan generasi berikutnya.' },
            { heading: 'Membiasakan pola hidup bijak', text: 'Memilah membuat kita lebih sadar berapa banyak barang yang dipakai dan dibuang. Kita bisa melanjutkannya dengan mengurangi kemasan sekali pakai, menggunakan kembali barang yang masih layak, dan mengambil makanan secukupnya.' },
            { heading: 'Mulai dari aksi yang realistis', text: 'Pilih satu kebiasaan yang bisa dilakukan konsisten: pisahkan sisa makanan, bawa botol isi ulang, atau siapkan wadah berlabel di kelas. Ajak teman dengan sopan dan ikuti sistem pengelolaan yang benar-benar tersedia di sekitar.' },
        ],
        sources: [{ label: 'SIPSN — Sistem Informasi Pengelolaan Sampah Nasional', url: 'https://sipsn.menlhk.go.id/' }, { label: 'SIMBA — Sistem Informasi Manajemen Bank Sampah', url: 'https://simba.menlhk.go.id/' }]
    },
    {
        icon: <UsersRound size={23} />, color: 'violet', category: 'Kurangi dan gunakan kembali',
        title: 'Kenali 3R: kurangi, gunakan kembali, daur ulang',
        summary: 'Pemilahan membantu, tetapi mengurangi barang sekali pakai juga penting.',
        sections: [
            { heading: 'Reduce — kurangi', text: 'Pilih barang yang tidak menghasilkan banyak kemasan, bawa botol minum dan kotak makan pakai ulang, serta ambil makanan secukupnya.' },
            { heading: 'Reuse — gunakan kembali', text: 'Gunakan kembali barang yang masih aman dan berfungsi, misalnya memakai sisi kosong kertas untuk catatan atau membawa tas belanja sendiri.' },
            { heading: 'Recycle — daur ulang', text: 'Pisahkan bahan yang diterima fasilitas daur ulang dan setorkan dalam keadaan sesuai petunjuk. Pemilahan membantu menjaga bahan tidak tercampur, tetapi daur ulang bergantung pada fasilitas yang tersedia.' },
        ],
        sources: [{ label: 'SIMBA — Sistem Informasi Manajemen Bank Sampah', url: 'https://simba.menlhk.go.id/' }]
    }
];

const questions = [
    { question: 'Kulit pisang yang sudah tidak dimakan biasanya termasuk jenis apa?', options: ['Organik', 'Nonorganik', 'Residu'], answer: 0, explanation: 'Sisa buah berasal dari makhluk hidup dan umumnya mudah terurai, sehingga menjadi contoh sampah organik.' },
    { question: 'Botol plastik kosong dan bersih sebaiknya bagaimana?', options: ['Dicampur dengan sisa makanan', 'Dipisahkan sebagai bahan nonorganik yang mungkin dapat didaur ulang', 'Selalu dianggap residu tanpa memeriksa aturan'], answer: 1, explanation: 'Botol plastik dapat dikumpulkan sebagai nonorganik bila fasilitas setempat menerimanya. Kosongkan dan ikuti petunjuk bank sampah atau sekolah.' },
    { question: 'Apa yang perlu dilakukan pada kemasan sebelum dimasukkan ke wadah daur ulang?', options: ['Kosongkan, bersihkan seperlunya, dan keringkan', 'Biarkan berisi sisa minuman', 'Campur dengan sampah basah'], answer: 0, explanation: 'Sisa cairan dan kotoran bisa mengotori bahan lain. Ikuti petunjuk fasilitas setempat.' },
    { question: 'Tisu yang sudah kotor dan tidak bisa dimanfaatkan lagi biasanya masuk kategori apa?', options: ['Organik', 'Nonorganik yang pasti dapat didaur ulang', 'Residu'], answer: 2, explanation: 'Tisu kotor umumnya tidak diterima untuk daur ulang dan menjadi contoh residu. Aturan lokal dapat berbeda.' },
    { question: 'Kamu menemukan baterai bekas. Apa tindakan yang tepat?', options: ['Masukkan ke wadah khusus sesuai arahan guru atau pengelola', 'Buang bersama sisa makanan', 'Buka baterainya agar terlihat isinya'], answer: 0, explanation: 'Baterai perlu penanganan khusus. Jangan membongkar atau mencampurnya dengan sampah biasa; minta arahan orang dewasa.' },
    { question: 'Apa yang dilakukan jika tidak yakin suatu benda termasuk jenis apa?', options: ['Baca label dan bertanya kepada guru atau petugas kebersihan', 'Memasukkan ke wadah secara acak', 'Membiarkannya di lantai'], answer: 0, explanation: 'Memeriksa label dan meminta bantuan membantu menjaga pemilahan tetap tepat dan aman.' }
];

function Education() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('edukasi');
    const [openArticle, setOpenArticle] = useState(null);
    const [answers, setAnswers] = useState({});

    return (
        <main className="education-container animate-fade-in">
            <header className="page-header education-page-header">
                <button className="icon-btn-rounded" onClick={() => navigate('/home')} aria-label="Kembali ke beranda"><ArrowLeft size={24} /></button>
                <div className="feature-heading"><GraduationCap className="feature-heading-icon" /><h2>BALI EDU</h2></div>
                <div style={{ width: 40 }} />
            </header>

            <div className="education-content">
                <section className="edu-banner">
                    <span className="edu-banner-kicker">RUANG BELAJAR LINGKUNGAN</span>
                    <h3>Kenali jenisnya, pilah dengan benar.</h3>
                    <p>Pelajari perbedaan sampah organik, nonorganik, dan residu lewat materi serta contoh yang dekat dengan kehidupan di sekolah.</p>
                </section>

                <nav className="education-tabs" aria-label="Pilihan BALI EDU">
                    <button className={activeTab === 'edukasi' ? 'active' : ''} onClick={() => setActiveTab('edukasi')}><BookOpen size={18} /> Edukasi</button>
                    <button className={activeTab === 'kuis' ? 'active' : ''} onClick={() => setActiveTab('kuis')}><Trophy size={18} /> Kuis</button>
                </nav>

                {activeTab === 'edukasi' ? (
                    <section className="education-section" aria-label="Materi dan artikel edukasi">
                        <div className="education-section-heading">
                        <div><span className="section-eyebrow">MATERI & ARTIKEL SINGKAT</span><h3>Panduan memilah sampah</h3></div>
                            <span className="topic-count">{topics.length} topik</span>
                        </div>
                        <div className="articles-grid">
                            {topics.map((topic, index) => {
                                const isOpen = openArticle === index;
                                return (
                                    <article key={topic.title} className={`article-card glass-card topic-${topic.color} ${isOpen ? 'is-open' : ''}`}>
                                        <button className="article-toggle" onClick={() => setOpenArticle(isOpen ? null : index)} aria-expanded={isOpen}>
                                            <span className="article-icon-wrap">{topic.icon}</span>
                                            <span className="article-title-group"><span className="topic-category">{topic.category}</span><strong>{topic.title}</strong><span className="article-desc">{topic.summary}</span></span>
                                            <span className="article-chevron" aria-hidden="true">{isOpen ? '−' : '+'}</span>
                                        </button>
                                        {isOpen && <div className="article-detail">
                                            {topic.sections ? topic.sections.map((section) => <section className="article-detail-section" key={section.heading}><h4>{section.heading}</h4><p>{section.text}</p></section>) : <p>{topic.body}</p>}
                                            {topic.sources && <div className="article-sources"><strong>Sumber bacaan tepercaya</strong>{topic.sources.map((source) => <a href={source.url} key={source.url} target="_blank" rel="noreferrer">{source.label} <span aria-hidden="true">↗</span></a>)}</div>}
                                        </div>}
                                    </article>
                                );
                            })}
                        </div>
                        <p className="education-note">Petunjuk pemilahan bisa berbeda menurut fasilitas dan wilayah. Ikuti label tempat sampah di sekolah atau arahan pengelola setempat.</p>
                    </section>
                ) : (
                    <section className="education-section quiz-section" aria-label="Kuis pemahaman">
                        <div className="education-section-heading">
                            <div><span className="section-eyebrow">CEK PEMAHAMANMU</span><h3>Kuis BALI EDU</h3></div>
                            <span className="topic-count">{Object.keys(answers).length}/{questions.length} dijawab</span>
                        </div>
                        <p className="quiz-intro">Pilih jawaban yang menurutmu paling tepat. Kamu bisa mengganti jawaban kapan saja.</p>
                        <div className="quiz-question-list">
                            {questions.map((item, index) => (
                                <article className="quiz-card glass-card" key={item.question}>
                                    <div className="quiz-question-heading"><span className="question-number">{String(index + 1).padStart(2, '0')}</span><h4>{item.question}</h4></div>
                                    <div className="quiz-options">
                                        {item.options.map((option, optionIndex) => {
                                            const selected = answers[index] === optionIndex;
                                            const answered = answers[index] !== undefined;
                                            const stateClass = selected ? (optionIndex === item.answer ? 'correct' : 'wrong') : (answered && optionIndex === item.answer ? 'show-correct' : '');
                                            return <button key={option} className={stateClass} onClick={() => setAnswers((current) => ({ ...current, [index]: optionIndex }))}>{option}</button>;
                                        })}
                                    </div>
                                    {answers[index] !== undefined && <p className={`quiz-feedback ${answers[index] === item.answer ? 'feedback-correct' : 'feedback-wrong'}`}>{answers[index] === item.answer ? 'Tepat!' : 'Belum tepat.'} {item.explanation}</p>}
                                </article>
                            ))}
                        </div>
                        {Object.keys(answers).length === questions.length && <div className="quiz-complete"><Trophy size={20} /> Kuis selesai! Kamu menjawab benar {questions.reduce((total, item, index) => total + (answers[index] === item.answer ? 1 : 0), 0)} dari {questions.length} soal.</div>}
                        <button className="quiz-reset" onClick={() => setAnswers({})}>Ulangi kuis</button>
                    </section>
                )}
            </div>
        </main>
    );
}

export default Education;
