import { NavLink } from 'react-router-dom';
import { Home, MessageSquare, BookOpen, GraduationCap, UsersRound } from 'lucide-react';
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
                to="/chat"
                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
                <div className="icon-container">
                    <MessageSquare size={22} />
                </div>
                <span>TEMAN BALI</span>
            </NavLink>

            <NavLink
                to="/yowana"
                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
                <div className="icon-container">
                    <UsersRound size={22} />
                </div>
                <span>BALI YOWANA</span>
            </NavLink>

            <NavLink
                to="/progress"
                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
                <div className="icon-container">
                    <BookOpen size={22} />
                </div>
                <span>BALI CERDAS</span>
            </NavLink>
        </nav>
    );
};

export default BottomNav;
