import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="desktop-footer">
            <div className="footer-content">
                <div className="footer-section">
                    <h3>BALI</h3>
                    <p>Ruang belajar untuk mengenali jenis sampah dan membangun kebiasaan memilah sampah dengan benar.</p>
                </div>
                <div className="footer-section">
                    <h4>Tautan Cepat</h4>
                    <ul>
                        <li><Link to="/home">Beranda</Link></li>
                        <li><Link to="/scan">BALI SCAN</Link></li>
                        <li><Link to="/education">BALI EDU</Link></li>
                        <li><Link to="/checklist">BALI PILAH</Link></li>
                        <li><Link to="/tracking">BALI TRACK</Link></li>
                        <li><Link to="/quiz">BALI QUIZ</Link></li>
                        <li><Link to="/map">BALI MAP</Link></li>
                    </ul>
                </div>
                <div className="footer-section">
                    <h4>Bantuan & Info</h4>
                    <ul>
                        <li><Link to="/education">BALI EDU</Link></li>
                        <li><Link to="/education">Panduan memilah</Link></li>
                        <li><Link to="/privacy">Kebijakan Privasi</Link></li>
                        <li><Link to="/profile">Profil & Pengaturan</Link></li>
                    </ul>
                </div>
            </div>
            <div className="footer-bottom">
                <p>&copy; {new Date().getFullYear()} BALI. Semua hak dilindungi.</p>
            </div>
        </footer>
    );
};

export default Footer;
