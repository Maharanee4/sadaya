import { NavLink } from 'react-router-dom';
import { Home, BookOpen, GraduationCap, Recycle, ScanLine } from 'lucide-react';
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
                to="/checklist"
                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
                <div className="icon-container">
                    <Recycle size={22} />
                </div>
                <span>BALI PILAH</span>
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
