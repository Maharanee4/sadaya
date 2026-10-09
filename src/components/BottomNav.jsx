import { NavLink } from 'react-router-dom';
import { Home, BookOpen, GraduationCap, MessageCircle, ScanLine } from 'lucide-react';
import './BottomNav.css';

const BottomNav = () => {
    return (
        <nav className="bottom-nav">
            <NavLink
                to="/home"
                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
                <div className="icon-container">
                    <Home size={22} />
                </div>
                <span>Home</span>
            </NavLink>

            <NavLink
                to="/education"
                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
                <div className="icon-container">
                    <GraduationCap size={22} />
                </div>
                <span>BALI EDU</span>
            </NavLink>

            <NavLink
                to="/scan"
                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
                <div className="icon-container">
                    <ScanLine size={22} />
                </div>
                <span>BALI SCAN</span>
            </NavLink>

            <NavLink
                to="/chat"
                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
                <div className="icon-container">
                    <MessageCircle size={22} />
                </div>
                <span>TEMAN BALI</span>
            </NavLink>

            <NavLink
                to="/quiz"
                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
                <div className="icon-container">
                    <BookOpen size={22} />
                </div>
                <span>BALI QUIZ</span>
            </NavLink>
        </nav>
    );
};

export default BottomNav;
