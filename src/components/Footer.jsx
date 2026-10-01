import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="desktop-footer">
            <div className="footer-content">
                <div className="footer-section">
                    <h3>SADAYA</h3>
                    <p>Panduan edukatif seputar living together, pernikahan dini, seks bebas, dan kesehatan reproduksi untuk generasi muda.</p>
                </div>
                <div className="footer-section">
                    <h4>Tautan Cepat</h4>
                    <ul>
                        <li><Link to="/home">Beranda</Link></li>
                        <li><Link to="/education">SADAYA EDU</Link></li>
                        <li><Link to="/chat">TEMAN SADAYA</Link></li>
                        <li><Link to="/yowana">SADAYA YOWANA</Link></li>
                        <li><Link to="/progress">SADAYA CERDAS</Link></li>
                        <li><Link to="/game">SADAYA BERDAYA</Link></li>
                    </ul>
                </div>
                <div className="footer-section">
                    <h4>Bantuan & Info</h4>
                    <ul>
                        <li><Link to="/education">SADAYA EDU</Link></li>
                        <li><Link to="/yowana">SADAYA YOWANA</Link></li>
                        <li><Link to="/privacy">Kebijakan Privasi</Link></li>
                        <li><Link to="/profile">Profil & Pengaturan</Link></li>
                    </ul>
                </div>
            </div>
            <div className="footer-bottom">
                <p>&copy; {new Date().getFullYear()} SADAYA. Semua hak dilindungi.</p>
            </div>
        </footer>
    );
};

export default Footer;
