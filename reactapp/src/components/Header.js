import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Header.css';

const Header = () => {
    const location = useLocation();

    return (
        <header className="header">
            <div className="logo">
                Travel Booking Application
            </div>
            <nav className="nav-links">
                <Link to="/" className={location.pathname === '/' ? 'active' : ''}>Home</Link>
                <Link to="/flights" className={location.pathname === '/flights' ? 'active' : ''}>Flights</Link>
                <Link to="/hotels" className={location.pathname === '/hotels' ? 'active' : ''}>Hotels</Link>
                <Link to="/bookings" className={location.pathname === '/bookings' ? 'active' : ''}>Bookings</Link>
            </nav>
        </header>
    );
};

export default Header;
