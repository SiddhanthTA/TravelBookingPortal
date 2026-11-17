import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaPlane, FaHotel, FaUser, FaHome, FaBook, FaUsers, FaSignOutAlt } from 'react-icons/fa';
import { getUserById } from '../utils/ApiService';
import { BASE_URL } from '../utils/constants';
import './Header.css';

const Header = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const userId = localStorage.getItem('userId');

    useEffect(() => {
        if (!userId) { setProfile(null); return; }
        const loadProfile = () => getUserById(userId).then(setProfile).catch(() => setProfile(null));
        loadProfile();
        window.addEventListener('profile-updated', loadProfile);
        return () => window.removeEventListener('profile-updated', loadProfile);
    }, [userId, location.pathname]);

    const handleLogout = (e) => {
        e.preventDefault();
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userId');
        navigate('/login');
    };
    const isLoggedIn = !!localStorage.getItem('userEmail');
    const isAdmin = localStorage.getItem('userRole') === 'ADMIN';
    const avatar = profile?.profileImageUrl ? (profile.profileImageUrl.startsWith('http') ? profile.profileImageUrl : `${BASE_URL}${profile.profileImageUrl.startsWith('/') ? '' : '/'}${profile.profileImageUrl}`) : '';

    return (
        <header className="header">
            <div className="logo"><Link to="/">Travel Booking Portal</Link></div>
            <nav className="nav-links">
                <Link to="/" className={location.pathname === '/' ? 'active' : ''}><FaHome className="icon" /> Home</Link>
                <Link to="/profile" className={location.pathname === '/profile' ? 'active' : ''}><FaUser className="icon" /> Profile</Link>
                <Link to="/flights" className={location.pathname === '/flights' ? 'active' : ''}><FaPlane className="icon" /> Flights</Link>
                <Link to="/hotels" className={location.pathname === '/hotels' ? 'active' : ''}><FaHotel className="icon" /> Hotels</Link>
                <Link to="/bookings" className={location.pathname === '/bookings' ? 'active' : ''}><FaBook className="icon" /> Bookings</Link>
                {isAdmin && <Link to="/users" className={location.pathname === '/users' ? 'active' : ''}><FaUsers className="icon" /> Users</Link>}
                {isLoggedIn && <div className="header-account"><Link to="/profile" className="header-account-link" title="Open profile">{avatar ? <img src={avatar} alt="" className="header-avatar" /> : <span className="header-avatar header-avatar-fallback">{(profile?.name || localStorage.getItem('userEmail') || 'U').charAt(0).toUpperCase()}</span>}<span className="header-account-name">{profile?.name || 'My account'}</span></Link><Link to="/login" onClick={handleLogout} className="header-logout"><FaSignOutAlt className="icon" /> Logout</Link></div>}
            </nav>
        </header>
    );
};
export default Header;
