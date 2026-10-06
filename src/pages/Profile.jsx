import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, LogOut, Settings, Award, CalendarDays, Moon, Palette, UserRound, Pencil, Save, X } from 'lucide-react';
import BaliAvatar from '../components/BaliAvatar';
import { trackEvent } from '../lib/analytics';
import './Profile.css';

const THEMES = [
    { id: 'default', name: 'Mint', color: '#2a9d8f' },
    { id: 'ocean', name: 'Ocean', color: '#0284c7' },
    { id: 'sunset', name: 'Sunset', color: '#f97316' },
    { id: 'lavender', name: 'Lavender', color: '#8b5cf6' }
];

const AVATARS = ['Jembrana', 'Tabanan', 'Badung', 'Gianyar', 'Klungkung', 'Bangli', 'Karangasem', 'Buleleng', 'Denpasar'];

const Profile = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [userData, setUserData] = useState(null);
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    const [editingName, setEditingName] = useState(false);
    const [nameDraft, setNameDraft] = useState('');
    const [nameError, setNameError] = useState('');

    const [settings, setSettings] = useState({
        darkMode: false,
    });
    
    const [activeTheme, setActiveTheme] = useState('default');
    const [activeAvatar, setActiveAvatar] = useState('Gianyar');

    useEffect(() => {
        const storedUser = localStorage.getItem('moodify_currentUser');
        if (!storedUser) {
            navigate('/home');
            return;
        }

        setUsername(storedUser);
        setDisplayName(storedUser);
        setNameDraft(storedUser);
        const userKey = `moodify_data_${storedUser}`;
        const savedData = localStorage.getItem(userKey);
        
        if (savedData) {
            const parsed = JSON.parse(savedData);
            setUserData(parsed);
            const savedDisplayName = typeof parsed.displayName === 'string' ? parsed.displayName.trim() : '';
            if (savedDisplayName) {
                setDisplayName(savedDisplayName);
                setNameDraft(savedDisplayName);
            }
            if (parsed.theme) setActiveTheme(parsed.theme);
            setActiveAvatar(AVATARS.includes(parsed.avatar) ? parsed.avatar : 'Gianyar');
            setSettings(prev => ({
                ...prev,
                darkMode: Boolean(parsed.darkMode),
            }));
            document.documentElement.setAttribute('data-color-mode', parsed.darkMode ? 'dark' : 'light');
        }
    }, [navigate]);

    useEffect(() => {
        if (showLogoutConfirm) {
            window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
        }
    }, [showLogoutConfirm]);

    const savePreferences = (themeStr, avatarStr, darkModeVal = settings.darkMode) => {
        if (!username) return;
        const userKey = `moodify_data_${username}`;
        const savedData = localStorage.getItem(userKey);
        if (savedData) {
            const parsed = JSON.parse(savedData);
            parsed.theme = themeStr;
            parsed.avatar = avatarStr;
            parsed.darkMode = darkModeVal;
            localStorage.setItem(userKey, JSON.stringify(parsed));
        }
        
        document.documentElement.setAttribute('data-theme', themeStr);
        document.documentElement.setAttribute('data-color-mode', darkModeVal ? 'dark' : 'light');
    };

    const handleThemeChange = (themeId) => {
        setActiveTheme(themeId);
        savePreferences(themeId, activeAvatar);
        trackEvent('theme_changed', { theme: themeId }).catch(() => {});
    };

    const handleAvatarChange = (avatar) => {
        setActiveAvatar(avatar);
        savePreferences(activeTheme, avatar);
    };

    const handleDarkModeToggle = () => {
        const nextDarkMode = !settings.darkMode;
        setSettings(prev => ({ ...prev, darkMode: nextDarkMode }));
        savePreferences(activeTheme, activeAvatar, nextDarkMode);
        trackEvent('dark_mode_toggled', { enabled: nextDarkMode }).catch(() => {});
    };

    const handleDisplayNameSave = (event) => {
        event.preventDefault();
        const nextName = nameDraft.trim();
        if (nextName.length < 2 || nextName.length > 30) {
            setNameError('Nama harus terdiri dari 2–30 karakter.');
            return;
        }
        if (/[<>\\]/.test(nextName)) {
            setNameError('Nama tidak boleh berisi karakter <, >, atau garis miring terbalik.');
            return;
        }

        const userKey = `moodify_data_${username}`;
        const savedData = localStorage.getItem(userKey);
        const nextData = { ...(savedData ? JSON.parse(savedData) : userData || {}), displayName: nextName };
        localStorage.setItem(userKey, JSON.stringify(nextData));
        setUserData(nextData);
        setDisplayName(nextName);
        setNameDraft(nextName);
        setNameError('');
        setEditingName(false);
    };

    const handleLogout = async () => {
        localStorage.removeItem('moodify_currentUser');
        trackEvent('logout', { username }).catch(() => {});
        navigate('/home');
    };

    if (!userData) return null;

    const joinedDate = new Date(userData.joinedAt || Date.now());
    const daysJoined = Math.max(1, Math.ceil((new Date() - joinedDate) / (1000 * 60 * 60 * 24)));

    return (
        <div className="profile-container animate-fade-in">
            {/* Header */}
            <header className="profile-header">
                <button className="icon-btn-rounded" onClick={() => navigate('/home')}>
                    <ArrowLeft size={20} />
                </button>
                <div className="feature-heading"><UserRound className="feature-heading-icon" /><h2>Profil & Pengaturan</h2></div>
                <div style={{ width: 40 }} />
            </header>

            <main className="profile-content">
                {/* User Info Card */}
                <div className="glass-card user-info-card" style={{ flexDirection: 'column', textAlign: 'center' }}>
                    <div className="avatar-lg" aria-label={`Avatar ${activeAvatar}`}>
                        <BaliAvatar region={activeAvatar} size={58} />
                    </div>
                    <div className="user-details">
                        <h3 className="profile-name">{displayName || username}</h3>
                        <p className="profile-joined">Bergabung sejak {joinedDate.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}</p>
                    </div>
                    {!editingName ? (
                        <button type="button" className="profile-edit-name" onClick={() => { setNameDraft(displayName || username); setNameError(''); setEditingName(true); }}>
                            <Pencil size={15} /> Ubah nama
                        </button>
                    ) : (
                        <form className="profile-name-form" onSubmit={handleDisplayNameSave}>
                            <label htmlFor="profile-display-name">Nama pengguna</label>
                            <input id="profile-display-name" value={nameDraft} maxLength={30} autoFocus onChange={(event) => { setNameDraft(event.target.value); setNameError(''); }} aria-describedby={nameError ? 'profile-name-error' : 'profile-name-hint'} />
                            <small id="profile-name-hint">2–30 karakter. Nama ini tampil di profil dan beranda.</small>
                            {nameError && <small id="profile-name-error" className="profile-name-error" role="alert">{nameError}</small>}
                            <div className="profile-name-actions">
                                <button type="button" className="profile-name-cancel" onClick={() => { setNameDraft(displayName || username); setEditingName(false); setNameError(''); }}><X size={15} /> Batal</button>
                                <button type="submit" className="profile-name-save"><Save size={15} /> Simpan</button>
                            </div>
                        </form>
                    )}
                </div>

                {/* Stats Grid */}
                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-icon-wrapper bg-green-soft">
                            <CalendarDays size={20} className="icon-green" />
                        </div>
                        <div className="stat-value">{daysJoined} Hari</div>
                        <div className="stat-label">Bersama BALI</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon-wrapper bg-orange-soft">
                            <Award size={20} className="icon-orange" />
                        </div>
                        <div className="stat-value">{userData.streak || 0} Hari</div>
                        <div className="stat-label">Streak Laporan</div>
                    </div>
                </div>

                <div className="settings-section">
                    <h3 className="section-title">
                        <Palette size={18} />
                        Personalisasi
                    </h3>
                    
                    <div className="glass-card settings-card" style={{ padding: '20px' }}>
                        <div style={{ marginBottom: '20px' }}>
                            <h4 style={{ fontSize: '14px', marginBottom: '12px', color: 'var(--text-main)' }}>Pilih Tema Warna</h4>
                            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                                {THEMES.map(theme => (
                                    <button 
                                        key={theme.id}
                                        onClick={() => handleThemeChange(theme.id)}
                                        style={{
                                            width: '40px', height: '40px', borderRadius: '50%',
                                            backgroundColor: theme.color,
                                            border: activeTheme === theme.id ? '3px solid var(--text-main)' : '2px solid transparent',
                                            cursor: 'pointer', transition: 'all 0.2s',
                                            boxShadow: activeTheme === theme.id ? '0 0 0 2px white inset' : 'none'
                                        }}
                                        title={theme.name}
                                    />
                                ))}
                            </div>
                        </div>

                        <div className="setting-divider" style={{ margin: '0 0 20px 0' }}></div>

                        <div>
                            <h4 style={{ fontSize: '14px', marginBottom: '12px', color: 'var(--text-main)' }}>Pilih Avatar</h4>
                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                {AVATARS.map(region => (
                                    <button
                                        key={region}
                                        onClick={() => handleAvatarChange(region)}
                                        aria-pressed={activeAvatar === region}
                                        aria-label={`Avatar ${region}`}
                                        title={region}
                                        style={{
                                            width: '58px', height: '58px', padding: '4px', borderRadius: '50%',
                                            display: 'flex', justifyContent: 'center', alignItems: 'center',
                                            backgroundColor: activeAvatar === region ? 'var(--primary-surface)' : 'rgba(148, 163, 184, 0.2)',
                                            border: activeAvatar === region ? '2px solid var(--primary)' : '2px solid transparent',
                                            cursor: 'pointer', transition: 'all 0.2s'
                                        }}
                                    >
                                        <BaliAvatar region={region} size={46} />
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="settings-section">
                    <h3 className="section-title">
                        <Settings size={18} />
                        Pengaturan Aplikasi
                    </h3>
                    
                    <div className="glass-card settings-card">
                        <div className="setting-item">
                            <div className="setting-info">
                                <div className="setting-icon bg-purple-soft"><Moon size={18} className="icon-purple"/></div>
                                <div>
                                    <h4>Dark Mode</h4>
                                    <p>Ubah tampilan menjadi mode gelap</p>
                                </div>
                            </div>
                            <label className="toggle-switch">
                                <input type="checkbox" checked={settings.darkMode} onChange={handleDarkModeToggle} />
                                <span className="slider round"></span>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Logout Button */}
                <button 
                    className="btn-logout hover-lift" 
                    onClick={() => setShowLogoutConfirm(true)}
                >
                    <LogOut size={18} />
                    Keluar Akun
                </button>

                {/* Overlay Detail Modal for Logout Confirm */}
                {showLogoutConfirm && (
                    <div className="modal-overlay" onClick={() => setShowLogoutConfirm(false)}>
                        <div className="modal-content glass-card" onClick={e => e.stopPropagation()}>
                            <h3 style={{ marginBottom: '16px', color: 'var(--text-main)' }}>Keluar Akun?</h3>
                            <p style={{ marginBottom: '24px', color: 'var(--text-muted)', fontSize: '14px', lineHeight: '1.5' }}>
                                Apakah kamu yakin ingin keluar dari {username}? Data dan progres BALI-mu tetap tersimpan di perangkat ini.
                            </p>
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <button className="btn-secondary" style={{ flex: 1 }} onClick={() => setShowLogoutConfirm(false)}>Batal</button>
                                <button className="btn-danger" style={{ flex: 1 }} onClick={handleLogout}>Ya, Keluar</button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default Profile;
