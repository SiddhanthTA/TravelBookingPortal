import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaPlane, FaHotel, FaUser, FaHome, FaBook, FaUsers, FaSignOutAlt } from 'react-icons/fa';
import './Header.css';

const Header = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = (e) => {
        e.preventDefault();
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userRole');
        navigate('/login');
    };

    const isLoggedIn = !!localStorage.getItem('userEmail');
    const isAdmin = localStorage.getItem('userRole') === 'ADMIN';

    return (
        <header className="header">
            <div className="logo">
                <Link to="/">Travel Booking Portal</Link>
            </div>
            <nav className="nav-links">
                <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
                    <FaHome className="icon" /> Home
                </Link>
                <Link to="/profile" className={location.pathname === '/profile' ? 'active' : ''}>
                    <FaUser className="icon" /> Profile
                </Link>
                <Link to="/flights" className={location.pathname === '/flights' ? 'active' : ''}>
                    <FaPlane className="icon" /> Flights
                </Link>
                <Link to="/hotels" className={location.pathname === '/hotels' ? 'active' : ''}>
                    <FaHotel className="icon" /> Hotels
                </Link>
                <Link to="/bookings" className={location.pathname === '/bookings' ? 'active' : ''}>
                    <FaBook className="icon" /> Bookings
                </Link>
                {isAdmin && (
                    <Link to="/users" className={location.pathname === '/users' ? 'active' : ''}>
                        <FaUsers className="icon" /> Users
                    </Link>
                )}

                {isLoggedIn && (
                    <Link to="/login" onClick={handleLogout} className={location.pathname === '/logout' ? 'active' : ''}>
                        <FaSignOutAlt className="icon" /> Logout
                    </Link>
                )}
            </nav>
        </header>
    );
};

export default Header;
