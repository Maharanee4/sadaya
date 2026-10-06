import { useState, useEffect } from 'react';
import { Sparkles, ScanLine, BarChart2, GraduationCap, Recycle, BookOpen, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { createPortal } from 'react-dom';
import sadayaLogo from '../assets/sadaya-logo-terpilah.png';
import BaliAvatar from '../components/BaliAvatar';
import { trackEvent } from '../lib/analytics';
import { ensureNeonUser } from '../lib/neonApi';
import { getSadayaRank, recordWebsiteUsage } from '../lib/websiteUsage';
import './Home.css';

const ONBOARDING_STEPS = [
    {
        title: 'Pilih Tujuan Belajarmu',
        description: 'Pilih hal yang ingin kamu pelajari agar makin mudah mengenali dan memilah sampah.'
    },
    {
        title: 'Selamat Datang di BALI',
        description: 'Ruang belajar bagi siswa untuk memahami jenis sampah dan menjaga lingkungan mulai dari sekolah.'
    },
    {
        title: 'Mulai Langkah BALI',
        description: 'Jelajahi materi, kuis, dan latihan sederhana untuk membedakan sampah organik, nonorganik, dan residu.'
    },
    {
        title: 'BALI MAP',
        description: 'Temukan panduan untuk mencari fasilitas pengelolaan sampah resmi di wilayah Bali.'
    }
];

const ONBOARDING_GOALS = [
    'Mengenali perbedaan jenis sampah',
    'Belajar memilah sampah dengan benar',
    'Mengurangi sampah di rumah dan sekolah'
];

const BADGE_RULES = [
    { key: 'starter', label: 'Pemula Pilah', minXp: 30 },
    { key: 'consistent', label: 'Sahabat Lingkungan', minXp: 120 },
    { key: 'master', label: 'Jago Pilah Sampah', minXp: 300 }
];
const BALI_REGIONS = ['Jembrana', 'Tabanan', 'Badung', 'Gianyar', 'Klungkung', 'Bangli', 'Karangasem', 'Buleleng', 'Denpasar'];

const Home = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [avatar, setAvatar] = useState('Gianyar');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [inputName, setInputName] = useState('');
    const [consentChecked, setConsentChecked] = useState(false);
    const [authError, setAuthError] = useState('');
    const [isAuthLoading] = useState(false);
    
    // Welcome Popup State
    const [showWelcome, setShowWelcome] = useState(false);
    const [showOnboarding, setShowOnboarding] = useState(false);
    const [onboardingStep, setOnboardingStep] = useState(0);
    const [onboardingGoal, setOnboardingGoal] = useState(ONBOARDING_GOALS[0]);
    const [playerStats, setPlayerStats] = useState({ xp: 0, level: 1, badges: [], missionProgress: 0, rank: 'BALI Pemula', usageCount: 0, nextRank: { minUses: 1 } });

    const initializeLocalUser = (name) => {
        if (!name) return;
        const userKey = `moodify_data_${name}`; // keep same storage key for backward compatibility but adapt content
        if (!localStorage.getItem(userKey)) {
            localStorage.setItem(userKey, JSON.stringify({
                hasCheckedIn: false,
                lastMood: null,
                lastSliders: null,
                totalSessions: 0,
                streak: 0,
                history: [],
                chatHistory: [],
                scanHistory: [],
                joinedAt: new Date().toISOString(),
                displayName: name,
                avatar: 'Gianyar',
                theme: 'default',
                darkMode: false,
                profileGoal: ONBOARDING_GOALS[0],
                missions: {
                    dailyCompletedDates: {},
                    weeklyTarget: 5
                },
                gamification: {
                    xp: 0,
                    level: 1,
                    badges: []
                }
            }));
        }
    };

    const finalizeLogin = (name) => {
        localStorage.setItem('moodify_currentUser', name);
        initializeLocalUser(name);
        const updatedUserData = recordWebsiteUsage('/home');
        if (updatedUserData) recalcAndPersistUserProgress(updatedUserData);
        setUsername(name);
        setDisplayName(name);
        setIsLoggedIn(true);
        trackEvent('login_success', { username: name }).catch(() => {});
        const onboardingKey = `ranstal_onboarding_done_${name}`;
        if (!localStorage.getItem(onboardingKey)) {
            setOnboardingStep(0);
            setShowOnboarding(true);
        } else {
            setShowWelcome(true);
            sessionStorage.setItem('moodify_welcomed', 'true');
        }
        ensureNeonUser(name).catch(() => {});
    };

    const recalcAndPersistUserProgress = (userData) => {
        const dailyCompletedDates = userData.missions?.dailyCompletedDates || {};

        const xpFromSessions = (userData.totalSessions || 0) * 15;
        const xpFromScans = (userData.scanHistory?.length || 0) * 20;
        const xpFromTasks = Object.keys(dailyCompletedDates).length * 10;
        const xp = xpFromSessions + xpFromScans + xpFromTasks + (Number(userData.websiteUsageXp) || 0);
        const level = Math.max(1, Math.floor(xp / 60) + 1);
        const badges = BADGE_RULES.filter((b) => xp >= b.minXp).map((b) => b.label);
        const rank = getSadayaRank(Number(userData.websiteUsageCount) || 0);

        userData.missions = {
            ...(userData.missions || {}),
            dailyCompletedDates,
            weeklyTarget: userData.missions?.weeklyTarget || 5
        };
        userData.gamification = { xp, level, badges, rank: rank.label, websiteUsageCount: rank.usageCount };
        const currentUser = localStorage.getItem('moodify_currentUser');
        if (currentUser) localStorage.setItem(`moodify_data_${currentUser}`, JSON.stringify(userData));

        const missionProgress = Math.min(userData.missions.weeklyTarget, Object.keys(dailyCompletedDates).length);
        setPlayerStats({ xp, level, badges, missionProgress, rank: rank.label, usageCount: rank.usageCount, nextRank: rank.next });
        return userData;
    };

    useEffect(() => {
        const storedUser = localStorage.getItem('moodify_currentUser');
        if (storedUser) {
            setUsername(storedUser);
            setDisplayName(storedUser);
            setIsLoggedIn(true);
            
            const userKey = `moodify_data_${storedUser}`;
            const savedData = localStorage.getItem(userKey);
            if (savedData) {
                const userData = JSON.parse(savedData);
                setDisplayName(typeof userData.displayName === 'string' && userData.displayName.trim() ? userData.displayName.trim() : storedUser);
                
                const regionAvatar = BALI_REGIONS.includes(userData.avatar) ? userData.avatar : 'Gianyar';
                setAvatar(regionAvatar);
                if (userData.avatar !== regionAvatar) userData.avatar = regionAvatar;
                if (userData.profileGoal) {
                    setOnboardingGoal(userData.profileGoal);
                }

                const enriched = recalcAndPersistUserProgress(userData);
                localStorage.setItem(userKey, JSON.stringify(enriched));
            }
            
            const onboardingKey = `ranstal_onboarding_done_${storedUser}`;
            if (!localStorage.getItem(onboardingKey)) {
                setOnboardingStep(0);
                setShowOnboarding(true);
            } else if (!sessionStorage.getItem('moodify_welcomed')) {
                setShowWelcome(true);
                sessionStorage.setItem('moodify_welcomed', 'true');
            }
            
        }
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();
        setAuthError('');
        const name = inputName.trim();

        if (!name) {
            setAuthError('Nama panggilan wajib diisi.');
            return;
        }
        if (!consentChecked) {
            setAuthError('Kamu perlu menyetujui kebijakan privasi terlebih dahulu.');
            return;
        }

        finalizeLogin(name);
    };

    const handleNextOnboarding = () => {
        if (onboardingStep < ONBOARDING_STEPS.length - 1) {
            setOnboardingStep(prev => prev + 1);
            return;
        }

        const onboardingKey = `ranstal_onboarding_done_${username}`;
        localStorage.setItem(onboardingKey, 'true');
        if (username) {
            const userKey = `moodify_data_${username}`;
            const raw = localStorage.getItem(userKey);
            if (raw) {
                const userData = JSON.parse(raw);
                userData.profileGoal = onboardingGoal;
                localStorage.setItem(userKey, JSON.stringify(userData));
            }
        }
        setShowOnboarding(false);
        setShowWelcome(true);
        sessionStorage.setItem('moodify_welcomed', 'true');
        trackEvent('onboarding_complete', { username, goal: onboardingGoal }).catch(() => {});
    };

    const handleSkipOnboarding = () => {
        const onboardingKey = `ranstal_onboarding_done_${username}`;
        localStorage.setItem(onboardingKey, 'true');
        setShowOnboarding(false);
        setShowWelcome(true);
        sessionStorage.setItem('moodify_welcomed', 'true');
        trackEvent('onboarding_skipped', { username, goal: onboardingGoal }).catch(() => {});
    };

    if (!isLoggedIn) {
        return (
            <div className="home-container animate-fade-in" style={{ justifyContent: 'center', alignItems: 'center', minHeight: '80vh', paddingBottom: '0' }}>
                <div className="login-card glass-card">
                    <div className="logo-placeholder login-logo-large" style={{ margin: '0 auto 24px auto', width: '84px', height: '84px', fontSize: '32px' }}>
                        <img className="app-logo-img" src={sadayaLogo} alt="Logo BALI dengan gapura Bali dan tiga tempat sampah terpilah" />
                    </div>
                    <h2 className="app-name" style={{ textAlign: 'center', marginBottom: '8px' }}>BALI</h2>
                    <p style={{ textAlign: 'center', color: '#64748b', marginBottom: '24px', fontSize: '14px' }}>
                        Bantu siswa mengenali perbedaan sampah organik, nonorganik, dan residu, lalu belajar memilahnya dengan tepat.
                    </p>

                    <form onSubmit={handleLogin} className="login-form">
                        <label style={{ fontSize: '12px', fontWeight: '600', color: '#123e42', marginBottom: '8px', display: 'block' }}>
                            SIAPA NAMAMU?
                        </label>
                        <input
                            type="text"
                            placeholder="Ketik nama panggilanmu..."
                            value={inputName}
                            onChange={(e) => setInputName(e.target.value)}
                            required
                            autoFocus
                        />
                        <label style={{ display: 'flex', gap: '8px', marginTop: '14px', alignItems: 'flex-start', textAlign: 'left' }}>
                            <input
                                type="checkbox"
                                checked={consentChecked}
                                onChange={(e) => setConsentChecked(e.target.checked)}
                                style={{ marginTop: '3px' }}
                            />
                            <span style={{ fontSize: '12px', color: '#475569' }}>
                                Saya menyetujui Kebijakan Privasi dan penggunaan data sesuai layanan BALI.
                            </span>
                        </label>
                        {authError && (
                            <p style={{ marginTop: '10px', fontSize: '12px', color: '#b91c1c' }}>{authError}</p>
                        )}
                        <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '16px' }} disabled={isAuthLoading}>
                            Mulai Belajar Pilah Sampah
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="home-container animate-fade-in">
            {/* Header */}
            <header className="home-header">
                <div className="logo-container">
                    <img className="app-logo-img header-logo-img" src={sadayaLogo} alt="Logo BALI dengan gapura Bali dan tiga tempat sampah terpilah" />
                    <h2 className="app-name">BALI</h2>
                </div>
                <div className="profile-shortcut">
                    <button className="icon-btn-rounded" style={{ padding: '5px', width: '44px', height: '44px', display: 'flex', justifyContent: 'center', alignItems: 'center' }} onClick={() => navigate('/profile')} title={`Avatar ${avatar}`} aria-label={`Buka profil, avatar ${avatar}`}>
                        <BaliAvatar region={avatar} size={34} />
                    </button>
                    <span className="profile-shortcut-label">Ubah Profil</span>
                </div>
            </header>

            {/* Main Content */}
            <main className="home-content">
                <div className="badge pulse-animation">
                    <Sparkles size={14} className="badge-icon" />
                    <span>Halo, {displayName || username}!</span>
                </div>
                <p className="home-watermark">karya Siswa SMA Negeri 1 Blahbatuh</p>

                <div className="hero-brand" aria-label="BALI">
                    <img src={sadayaLogo} alt="Logo BALI dengan gapura Bali dan tiga tempat sampah terpilah" />
                    <span>BALI</span>
                </div>

                <h1 className="hero-title">
                    Blasman <br />
                    <span className="text-gradient">Aksi Peduli Lingkungan</span>
                </h1>

                <p className="hero-description">
                    BALI membantu siswa memahami perbedaan sampah organik, nonorganik, dan residu, serta berlatih memilah sampah berdasarkan jenisnya.
                </p>

                <div style={{ display: 'flex', width: '100%', maxWidth: '500px', marginBottom: '24px' }}>
                    <button className="btn-secondary" style={{ flex: 1, borderRadius: '16px', padding: '12px 20px', display: 'flex', gap: '8px', alignItems: 'center', justifyContent: 'center' }} onClick={() => navigate('/checklist')}>
                        <Recycle size={18} />
                        Mulai BALI PILAH
                    </button>
                </div>

                {/* Level and streak widget */}
                <div className="glass-card" style={{ width: '100%', maxWidth: '500px', marginBottom: '24px', padding: '18px', borderRadius: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <strong style={{ fontSize: '14px', color: '#0f172a' }}>Pangkat BALI</strong>
                        <span style={{ fontSize: '12px', color: '#475569' }}>XP {playerStats.xp} • Lv {playerStats.level}</span>
                    </div>
                    <p style={{ fontSize: '12px', color: '#315f3d', marginBottom: '5px', textAlign: 'left', fontWeight: '700' }}>
                        {playerStats.rank} <span style={{ color: '#64748b', fontWeight: '500' }}>· {playerStats.usageCount} penggunaan halaman</span>
                    </p>
                    <p style={{ fontSize: '10px', color: '#64748b', marginBottom: '6px', textAlign: 'left' }}>
                        {playerStats.nextRank ? `Pangkat berikutnya: ${playerStats.nextRank.label} · ${Math.max(0, playerStats.nextRank.minUses - playerStats.usageCount)} penggunaan lagi` : 'Pangkat tertinggi tercapai. Terus jelajahi BALI!'}
                    </p>
                    <p style={{ fontSize: '10px', color: '#64748b', marginBottom: '8px', textAlign: 'left' }}>
                        Setiap halaman memberi poin satu kali per hari.
                    </p>
                    <div style={{ height: '6px', width: '100%', background: '#e2e8f0', borderRadius: '999px', overflow: 'hidden', marginBottom: '12px' }} aria-label="Progres pangkat BALI">
                        <div style={{ height: '100%', width: `${playerStats.nextRank ? Math.min(100, (playerStats.usageCount / playerStats.nextRank.minUses) * 100) : 100}%`, background: 'linear-gradient(90deg, #397a3f, #d1ad31)' }} />
                    </div>
                    <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '8px', textAlign: 'left' }}>
                        Target Absen Aktif Harian: {playerStats.missionProgress}/5 hari
                    </p>
                    <div style={{ height: '8px', width: '100%', background: '#e2e8f0', borderRadius: '999px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${Math.min(100, (playerStats.missionProgress / 5) * 100)}%`, background: 'linear-gradient(90deg, #397a3f, #d1ad31)' }} />
                    </div>
                </div>

                {/* Additional Features Quick Navigation */}
                <div className="additional-features-box glass-card" style={{ width: '100%', maxWidth: '500px', marginTop: '24px', padding: '20px', borderRadius: '16px' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px', color: '#1e293b', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                        🌿 Jelajahi Fitur Utama
                    </h3>
                    
                    <div className="waste-feature-grid">
                        {[
                            { title: 'BALI SCAN', detail: 'Cari jenis sebuah benda', path: '/scan', Icon: ScanLine },
                            { title: 'BALI EDU', detail: 'Pelajari dasar pemilahan', path: '/education', Icon: GraduationCap },
                            { title: 'BALI PILAH', detail: 'Latihan memilih wadah', path: '/checklist', Icon: Recycle },
                            { title: 'BALI TRACK', detail: 'Catat aksi pilah harian', path: '/tracking', Icon: BarChart2 },
                            { title: 'BALI QUIZ', detail: 'Uji pemahamanmu', path: '/quiz', Icon: BookOpen },
                            { title: 'BALI MAP', detail: 'Cari panduan fasilitas Bali', path: '/map', Icon: MapPin },
                        ].map(({ title, detail, path, Icon }) => (
                            <button type="button" key={title} className="waste-feature-card" onClick={() => navigate(path)}>
                                <Icon className="waste-feature-icon" size={27} aria-hidden="true" />
                                <span className="waste-feature-title">{title}</span>
                                <span className="waste-feature-detail">{detail}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Onboarding Modal */}
                {showOnboarding && createPortal(
                    <div className="modal-overlay" onClick={handleSkipOnboarding} style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)', zIndex: 10000, display: 'flex', justifyContent: 'center', alignItems: 'flex-start', paddingTop: '8vh' }}>
                        <div className="modal-content glass-card animate-fade-in" onClick={e => e.stopPropagation()} style={{ width: '90%', maxWidth: '420px', padding: '28px 24px', textAlign: 'left', borderRadius: '24px', background: '#ffffff', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                <span style={{ fontSize: '12px', color: '#64748b' }}>Onboarding {onboardingStep + 1}/{ONBOARDING_STEPS.length}</span>
                                <button type="button" className="btn-link" onClick={handleSkipOnboarding}>Lewati</button>
                            </div>
                            <h3 style={{ marginBottom: '8px', color: '#0f172a' }}>{ONBOARDING_STEPS[onboardingStep].title}</h3>
                            <p style={{ fontSize: '14px', color: '#475569', marginBottom: '20px' }}>
                                {ONBOARDING_STEPS[onboardingStep].description}
                            </p>
                            {onboardingStep === 0 && (
                                <div style={{ display: 'grid', gap: '8px', marginBottom: '14px' }}>
                                    {ONBOARDING_GOALS.map((goal) => (
                                        <button
                                            key={goal}
                                            type="button"
                                            onClick={() => setOnboardingGoal(goal)}
                                            style={{
                                                textAlign: 'left',
                                                borderRadius: '10px',
                                                border: goal === onboardingGoal ? '1px solid var(--primary)' : '1px solid #e2e8f0',
                                                background: goal === onboardingGoal ? 'var(--primary-surface)' : '#fff',
                                                color: '#0f172a',
                                                padding: '10px 12px',
                                                fontSize: '13px',
                                                fontWeight: 600
                                            }}
                                        >
                                            {goal}
                                        </button>
                                    ))}
                                </div>
                            )}
                            <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
                                {ONBOARDING_STEPS.map((_, idx) => (
                                    <div key={idx} style={{ height: '6px', flex: 1, borderRadius: '99px', background: idx <= onboardingStep ? 'var(--primary)' : '#e2e8f0' }} />
                                ))}
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px' }}>
                                <button type="button" className="btn-secondary" style={{ flex: 1 }} disabled={onboardingStep === 0} onClick={() => setOnboardingStep((prev) => Math.max(0, prev - 1))}>
                                    Kembali
                                </button>
                                <button type="button" className="btn-primary" style={{ flex: 1 }} onClick={handleNextOnboarding}>
                                    {onboardingStep === ONBOARDING_STEPS.length - 1 ? 'Selesai' : 'Lanjut'}
                                </button>
                            </div>
                        </div>
                    </div>,
                    document.body
                )}

                {/* Welcome Modal Popup */}
                {showWelcome && (
                    <div className="modal-overlay" onClick={() => setShowWelcome(false)} style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)', zIndex: 10000, display: 'flex', justifyContent: 'center', alignItems: 'flex-start', paddingTop: '10vh' }}>
                        <div className="modal-content glass-card animate-fade-in" onClick={e => e.stopPropagation()} style={{ width: '90%', maxWidth: '400px', padding: '32px 24px', textAlign: 'center', borderRadius: '24px', background: '#ffffff', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}>
                            <div className="welcome-logo" style={{ width: '84px', height: '84px', background: '#dcfce7', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0 auto 20px auto' }}>
                                <img className="app-logo-img" src={sadayaLogo} alt="Logo BALI dengan gapura Bali dan tiga tempat sampah terpilah" />
                            </div>
                            <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#0f172a', marginBottom: '8px' }}>Selamat Datang Sahabat</h2>
                            <p style={{ fontSize: '14px', color: '#64748b', lineHeight: '1.6', marginBottom: '24px' }}>
                                Senang melihatmu di BALI. Yuk kenali jenis sampah dan mulai memilahnya dengan benar di sekolah maupun di rumah.
                            </p>
                            <button className="btn-primary hover-lift" onClick={() => setShowWelcome(false)} style={{ width: '100%', padding: '14px', borderRadius: '16px' }}>
                                Mulai Perjalanan Remaja
                            </button>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default Home;
