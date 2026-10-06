import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, GraduationCap, HeartPulse, Lightbulb, ShieldCheck, Trophy, UsersRound } from 'lucide-react';
import './Education.css';

const topics = [
    {
        icon: <Lightbulb size={23} />, color: 'gold', category: 'Perencanaan masa depan',
        title: 'Mimpimu layak direncanakan',
        summary: 'Mulai dari hal yang kamu sukai, lalu susun langkah kecil untuk mencapainya.',
        body: 'Coba tuliskan tujuan yang ingin kamu capai dalam satu, tiga, dan lima tahun. Cari tahu keterampilan atau pendidikan yang dibutuhkan, pecah tujuan besar menjadi langkah sederhana, dan bicarakan rencanamu dengan orang dewasa yang kamu percaya. Rencana boleh berubah seiring kamu belajar.'
    },
    {
        icon: <HeartPulse size={23} />, color: 'pink', category: 'Kesehatan reproduksi',
        title: 'Kenali dan jaga kesehatan reproduksi',
        summary: 'Memahami perubahan tubuh dan batasan diri adalah bagian dari merawat kesehatan.',
        body: 'Masa remaja membawa perubahan fisik dan emosi yang berbeda pada setiap orang. Cari informasi dari tenaga kesehatan atau sumber tepercaya, jaga kebersihan organ reproduksi, dan ingat bahwa setiap orang berhak atas privasi serta batasan tubuhnya. Kamu boleh bertanya tanpa merasa malu.'
    },
    {
        icon: <UsersRound size={23} />, color: 'violet', category: 'Kesiapan keluarga',
        title: 'Keluarga membutuhkan kesiapan',
        summary: 'Membangun keluarga melibatkan tanggung jawab, komunikasi, kesehatan, dan dukungan.',
        body: 'Kesiapan berkeluarga bukan hanya soal usia atau perasaan. Dibutuhkan kematangan emosi, kemampuan berkomunikasi dan menyelesaikan masalah, pemahaman kesehatan, serta kesiapan menjalankan tanggung jawab bersama. Tidak perlu terburu-buru mengambil keputusan besar.'
    },
    {
        icon: <ShieldCheck size={23} />, color: 'orange', category: 'Dampak perkawinan usia muda',
        title: 'Pernikahan dini: pahami kesiapan dan dampaknya',
        summary: 'Lihat dampak pada kesehatan, pendidikan, emosi, relasi, dan pilihan masa depan secara utuh.',
        sections: [
            { heading: 'Apa yang dimaksud dan mengapa perlu dipahami?', text: 'Istilah pernikahan dini sering dipakai untuk perkawinan yang berlangsung ketika seseorang masih terlalu muda atau belum siap menjalani tanggung jawabnya. Usia saja tidak menceritakan seluruh keadaan, tetapi masa remaja adalah masa berkembang: pendidikan, kesehatan, identitas, dan kemampuan mengambil keputusan masih perlu didukung. Karena itu, keputusan besar perlu bebas dari paksaan dan dipertimbangkan dengan matang.' },
            { heading: 'Dampak yang mungkin terjadi', text: 'Kehamilan pada usia remaja berkaitan dengan risiko kesehatan yang lebih tinggi bagi ibu dan bayi. Tanggung jawab rumah tangga dan pengasuhan juga dapat menyulitkan seseorang melanjutkan sekolah, menjaga pertemanan, mengembangkan keterampilan, atau memperoleh penghasilan. Perubahan besar yang datang tanpa dukungan dapat menimbulkan stres dan rasa terisolasi. Dampak ini tidak otomatis terjadi pada setiap orang; dukungan keluarga, layanan kesehatan, pendidikan, dan perlindungan sangat berarti.' },
            { heading: 'Dampak dapat saling berkaitan', text: 'Berhenti atau sering absen sekolah dapat mengurangi kesempatan belajar dan bekerja; ketergantungan ekonomi kemudian dapat membuat pilihan seseorang makin terbatas. Beban pengasuhan yang tidak dibagi adil, konflik, stigma, atau kekerasan juga bisa memperberat tekanan. Ini adalah jalur risiko yang dipengaruhi banyak faktor, bukan nasib yang pasti. Dukungan untuk tetap belajar, layanan kesehatan yang tepat, pengasuhan bersama, dan lingkungan tanpa stigma membantu melindungi kesejahteraan.' },
            { heading: 'Kesiapan bukan sekadar pesta atau rasa sayang', text: 'Kesiapan mencakup kematangan emosi, kemampuan menyelesaikan konflik tanpa kekerasan, pembagian tanggung jawab yang adil, kesehatan, rencana pendidikan dan ekonomi, serta dukungan yang aman. Tanyakan: apakah keputusan ini benar-benar pilihan sendiri? Apakah kedua pihak dapat berkata tidak tanpa takut? Apakah ada rencana ketika menghadapi masalah?' },
            { heading: 'Jika ada tekanan', text: 'Kamu berhak meminta waktu, bertanya, dan mencari pendamping. Bicarakan dengan orang dewasa tepercaya, guru atau konselor, tenaga kesehatan, atau layanan perlindungan. Jangan menyalahkan atau mempermalukan seseorang yang sudah menikah atau sedang menghadapi kehamilan; fokus pada keselamatan, kesehatan, pendidikan, dan dukungan yang tersedia.' },
        ],
        sources: [{ label: 'WHO — Kehamilan remaja', url: 'https://www.who.int/news-room/fact-sheets/detail/adolescent-pregnancy' }, { label: 'UNICEF — Perkawinan anak', url: 'https://www.unicef.org/protection/child-marriage' }]
    },
    {
        icon: <HeartPulse size={23} />, color: 'pink', category: 'Hubungan dan kesehatan reproduksi',
        title: 'Seks bebas: pahami risiko, persetujuan, dan perlindungan',
        summary: 'Bahas aktivitas seksual berisiko tanpa stigma, termasuk kehamilan, IMS, tekanan, dan pilihan mencari bantuan.',
        sections: [
            { heading: 'Apa maksudnya dalam materi ini?', text: 'Istilah “seks bebas” sering digunakan secara menghakimi dan artinya bisa berbeda-beda. Di sini, kita membahas aktivitas seksual yang terjadi tanpa kesiapan, informasi, persetujuan yang bebas, atau perlindungan yang memadai. Tujuannya bukan memberi label kepada orang, melainkan memahami kesehatan, batas diri, tanggung jawab, dan cara mencegah bahaya.' },
            { heading: 'Risiko kesehatan dan kesejahteraan', text: 'Aktivitas seksual dapat menyebabkan kehamilan yang tidak direncanakan dan infeksi menular seksual (IMS), termasuk HIV. Sebagian IMS tidak menunjukkan gejala, sehingga merasa sehat bukan bukti pasti bebas infeksi. Kehamilan remaja dapat membawa risiko kesehatan dan dampak sosial. Tekanan, rasa takut, penyesalan, atau penyebaran foto intim tanpa izin juga dapat berdampak pada kesejahteraan dan keselamatan.' },
            { heading: 'Persetujuan dan batas diri', text: 'Persetujuan harus diberikan secara sadar, sukarela, spesifik, dan dapat ditarik kapan saja. Diam, takut, terpaksa, sedang tidak sadar, atau pernah setuju sebelumnya bukan persetujuan untuk saat ini. Tekanan pasangan atau teman, ancaman, imbalan, dan perbedaan kuasa perlu dianggap serius. Kamu berhak berkata “tidak”, berhenti, dan mencari pertolongan.' },
            { heading: 'Membuat pilihan yang lebih aman', text: 'Menunda aktivitas seksual adalah pilihan yang sepenuhnya sah. Jika memiliki pertanyaan atau sudah mengalami situasi berisiko, cari informasi dari tenaga kesehatan yang kompeten dan tanyakan layanan yang sesuai untuk remaja. Kondom yang digunakan dengan benar dan konsisten membantu mengurangi risiko banyak IMS dan kehamilan, tetapi tidak menghilangkan semua risiko. Jangan mengandalkan mitos, pesan berantai, atau saran teman sebagai pengganti layanan kesehatan.' },
            { heading: 'Mengenali informasi keliru', text: 'Penampilan sehat tidak bisa memastikan seseorang bebas IMS; banyak IMS tidak menimbulkan gejala. Mencuci tubuh, buang air kecil, atau memakai ramuan setelah aktivitas seksual juga tidak mencegah kehamilan atau IMS. Berbagai metode kontrasepsi dapat mencegah kehamilan, tetapi kondom adalah metode yang juga membantu mencegah IMS. Tenaga kesehatan dapat menjelaskan pemeriksaan dan pilihan yang sesuai.' },
            { heading: 'Jika ada kekhawatiran kehamilan atau IMS', text: 'Jangan mencoba mendiagnosis sendiri atau mengonsumsi obat dari sumber yang tidak jelas. Bicaralah secepatnya dengan tenaga kesehatan agar mendapat informasi tentang pemeriksaan, waktu tindak lanjut, dan pilihan penanganan yang tepat untuk situasimu. Kamu layak dilayani dengan hormat dan dijaga kerahasiaannya sesuai aturan layanan.' },
            { heading: 'Bila sesuatu terjadi tanpa persetujuan', text: 'Itu bukan salah korban. Utamakan keselamatan, cari orang dewasa tepercaya, tenaga kesehatan, atau layanan perlindungan. Jangan menyebarkan gambar atau cerita pribadi korban. Jika ada bahaya langsung, pergi ke tempat aman dan hubungi layanan darurat setempat.' },
        ],
        sources: [{ label: 'WHO — Infeksi menular seksual', url: 'https://www.who.int/news-room/fact-sheets/detail/sexually-transmitted-infections-(stis)' }, { label: 'WHO — Pendidikan seksualitas komprehensif', url: 'https://www.who.int/news-room/fact-sheets/detail/comprehensive-sexuality-education' }]
    },
    {
        icon: <UsersRound size={23} />, color: 'violet', category: 'Relasi dan kehidupan bersama',
        title: 'Living together: pahami konteks, tanggung jawab, dan risikonya',
        summary: 'Mengenal hidup bersama pasangan, dinamika relasi, keselamatan, keluarga, budaya, dan masa depan tanpa menghakimi.',
        sections: [
            { heading: 'Apa itu living together?', text: 'Living together atau kohabitasi biasanya berarti pasangan tinggal serumah tanpa ikatan perkawinan. Pengalaman setiap pasangan berbeda dan istilah ini tidak boleh dijadikan alasan untuk menghakimi seseorang. Memahaminya berarti melihat situasi nyata: usia dan kesiapan, persetujuan, alasan tinggal bersama, relasi kuasa, kondisi ekonomi, norma keluarga dan adat, serta pilihan yang tersedia.' },
            { heading: 'Bedakan bentuk tinggal bersama dan sumber risikonya', text: 'Risiko kehamilan atau IMS berasal dari aktivitas seksual tertentu dan kurangnya perlindungan, bukan semata-mata karena dua orang tinggal serumah. Sebaliknya, tinggal bersama dapat menimbulkan tantangan praktis seperti biaya dan pekerjaan rumah, privasi, batas pribadi, keselamatan, konflik, tempat tinggal alternatif, dan akses dukungan. Ketergantungan ekonomi atau tempat tinggal dapat membuat seseorang sulit keluar dari hubungan yang tidak aman. Pengalaman dan dampak tiap orang tidak sama.' },
            { heading: 'Dampak pada rencana dan kesejahteraan', text: 'Perubahan tempat tinggal dapat memengaruhi jarak ke sekolah atau pekerjaan, waktu belajar, pergaulan, pembagian kerja domestik, dan hubungan dengan keluarga. Jika pasangan tidak memiliki sumber daya atau dukungan yang cukup, tekanan finansial dan konflik dapat meningkat. Stigma atau pertentangan dengan keluarga/adat juga dapat membuat seseorang menarik diri. Dampak ini dipengaruhi keadaan dan respons lingkungan; dialog aman dan dukungan yang tidak mempermalukan dapat mengurangi isolasi.' },
            { heading: 'Kesiapan, komunikasi, dan perlindungan', text: 'Sebelum mengambil keputusan besar, bicarakan harapan, pembagian tanggung jawab, rencana pendidikan atau pekerjaan, uang, batasan, cara menyelesaikan konflik, dan langkah jika hubungan berakhir. Pastikan tidak ada paksaan dan masing-masing punya akses ke teman, keluarga, dokumen, serta bantuan. Bila ada kekerasan, kontrol, ancaman, atau ketakutan, cari bantuan dari orang tepercaya atau layanan perlindungan.' },
            { heading: 'Nilai keluarga dan budaya Bali', text: 'Di Bali, keputusan mengenai relasi dapat terkait erat dengan keluarga, adat, banjar, dan tanggung jawab sosial. Nilai kebersamaan dan saling menghormati dapat menjadi sumber dukungan. Ajak keluarga atau tokoh yang dipercaya berdialog tanpa mempermalukan pihak tertentu. Hormati keragaman pengalaman, jaga privasi, dan utamakan keselamatan serta martabat setiap orang.' },
            { heading: 'Gunakan pertanyaan refleksi', text: 'Apakah keputusan ini benar-benar saya inginkan? Apakah saya bebas mengubah pikiran? Siapa yang dapat saya hubungi jika merasa tidak aman? Apakah keputusan ini mendukung tujuan belajar, kerja, kesehatan, dan masa depan saya? Tidak perlu terburu-buru menjawab; mencari informasi dan dukungan adalah langkah yang bijak.' },
        ],
        sources: [{ label: 'UNFPA Asia-Pasifik — Perkawinan, penyatuan, dan kehamilan remaja', url: 'https://asiapacific.unfpa.org/en/news/mothers-too-young-understanding-patterns-child-marriage-early-union-and-teen-pregnancy' }]
    },
    {
        icon: <BookOpen size={23} />, color: 'blue', category: 'Hak pendidikan',
        title: 'Pendidikan adalah hakmu',
        summary: 'Setiap remaja berhak belajar, berkembang, dan merencanakan cita-citanya.',
        body: 'Pendidikan membantu kamu memperoleh pengetahuan, keterampilan, dan lebih banyak pilihan untuk masa depan. Kamu berhak mendapatkan kesempatan belajar dan dukungan untuk tetap bersekolah. Jika menghadapi hambatan, ceritakan kepada guru, konselor, keluarga, atau layanan perlindungan anak yang kamu percaya.'
    }
];

const questions = [
    { question: 'Apa langkah awal yang baik untuk merencanakan masa depan?', options: ['Menuliskan tujuan dan langkah kecil', 'Mengikuti semua pilihan teman', 'Menunggu sampai semuanya pasti'], answer: 0, explanation: 'Tujuan yang jelas dan langkah kecil membuat rencana lebih mudah dimulai dan disesuaikan.' },
    { question: 'Kepada siapa kamu dapat bertanya tentang kesehatan reproduksi?', options: ['Sumber apa pun tanpa memeriksa kebenarannya', 'Tenaga kesehatan atau sumber tepercaya', 'Tidak boleh bertanya kepada siapa pun'], answer: 1, explanation: 'Tenaga kesehatan dan sumber tepercaya dapat memberi informasi yang tepat dan aman.' },
    { question: 'Manakah yang termasuk kesiapan berkeluarga?', options: ['Hanya memiliki pesta yang direncanakan', 'Kematangan emosi dan tanggung jawab bersama', 'Mengambil keputusan karena tekanan orang lain'], answer: 1, explanation: 'Keluarga membutuhkan kesiapan emosi, komunikasi, kesehatan, dan tanggung jawab.' },
    { question: 'Apa salah satu dampak perkawinan usia muda yang perlu dipertimbangkan?', options: ['Selalu membuat sekolah lebih mudah', 'Dapat menghambat kelanjutan pendidikan', 'Tidak memiliki dampak apa pun'], answer: 1, explanation: 'Tanggung jawab baru dapat membatasi kesempatan untuk melanjutkan sekolah dan mengembangkan diri.' },
    { question: 'Apa yang dapat dilakukan jika ada hambatan untuk tetap bersekolah?', options: ['Menceritakannya kepada guru atau orang dewasa tepercaya', 'Menghadapinya sendirian', 'Berhenti mencari bantuan'], answer: 0, explanation: 'Guru, konselor, keluarga, dan layanan perlindungan dapat membantu mencari dukungan.' },
    { question: 'Persetujuan dalam hubungan harus seperti apa?', options: ['Bebas, sadar, dan dapat ditarik kapan saja', 'Dianggap ada jika seseorang diam', 'Berlaku selamanya setelah pernah diberikan'], answer: 0, explanation: 'Setiap orang berhak mengubah pikiran dan menetapkan batasnya.' },
    { question: 'Apa langkah yang bijak saat mendapat tekanan untuk melakukan sesuatu yang tidak diinginkan?', options: ['Mengikuti agar tidak ditinggalkan', 'Menyatakan batas, menjauh jika perlu, dan mencari bantuan tepercaya', 'Menyimpan semuanya sendiri'], answer: 1, explanation: 'Keselamatanmu penting; orang dewasa tepercaya atau layanan kesehatan dapat membantu.' },
    { question: 'Manakah pernyataan yang tepat tentang living together?', options: ['Semua pengalaman dan risikonya sama', 'Perlu memahami konteks, kesiapan, persetujuan, keselamatan, dan tanggung jawab', 'Tidak perlu membicarakan masa depan'], answer: 1, explanation: 'Konteks tiap orang berbeda; keputusan penting perlu dipikirkan tanpa paksaan dan dengan dukungan.' },
    { question: 'Kepada siapa mencari bantuan bila ada kekerasan atau paksaan?', options: ['Orang dewasa tepercaya, tenaga kesehatan, atau layanan perlindungan', 'Akun anonim yang meminta data pribadi', 'Tidak perlu memberi tahu siapa pun'], answer: 0, explanation: 'Cari bantuan aman dari pihak tepercaya dan jangan membagikan data sensitif ke pihak tak dikenal.' }
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
                    <span className="edu-banner-kicker">RUANG BELAJAR REMAJA</span>
                    <h3>Kenali pilihanmu, rancang masa depanmu.</h3>
                    <p>Pelajari kesehatan, keluarga, pendidikan, dan masa depan melalui materi singkat yang ramah remaja.</p>
                </section>

                <nav className="education-tabs" aria-label="Pilihan BALI EDU">
                    <button className={activeTab === 'edukasi' ? 'active' : ''} onClick={() => setActiveTab('edukasi')}><BookOpen size={18} /> Edukasi</button>
                    <button className={activeTab === 'kuis' ? 'active' : ''} onClick={() => setActiveTab('kuis')}><Trophy size={18} /> Kuis</button>
                </nav>

                {activeTab === 'edukasi' ? (
                    <section className="education-section" aria-label="Materi dan artikel edukasi">
                        <div className="education-section-heading">
                            <div><span className="section-eyebrow">MATERI & ARTIKEL SINGKAT</span><h3>Belajar sesuai kebutuhanmu</h3></div>
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
                        <p className="education-note">Informasi ini bersifat edukatif. Untuk pertanyaan pribadi tentang kesehatan atau keselamatan, hubungi tenaga profesional atau orang dewasa tepercaya.</p>
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
