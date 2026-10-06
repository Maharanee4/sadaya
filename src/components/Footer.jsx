import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="desktop-footer">
            <div className="footer-content">
                <div className="footer-section">
                    <h3>BALI</h3>
                    <p>Panduan edukatif seputar living together, pernikahan dini, seks bebas, dan kesehatan reproduksi untuk generasi muda.</p>
                </div>
                <div className="footer-section">
                    <h4>Tautan Cepat</h4>
                    <ul>
                        <li><Link to="/home">Beranda</Link></li>
                        <li><Link to="/education">BALI EDU</Link></li>
                        <li><Link to="/chat">TEMAN BALI</Link></li>
                        <li><Link to="/yowana">BALI YOWANA</Link></li>
                        <li><Link to="/progress">BALI CERDAS</Link></li>
                        <li><Link to="/game">BALI BERDAYA</Link></li>
                    </ul>
                </div>
                <div className="footer-section">
                    <h4>Bantuan & Info</h4>
                    <ul>
                        <li><Link to="/education">BALI EDU</Link></li>
                        <li><Link to="/yowana">BALI YOWANA</Link></li>
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
