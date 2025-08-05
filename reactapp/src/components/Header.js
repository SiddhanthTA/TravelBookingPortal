import React from 'react';
import {Link} from 'react-router-dom';
// import './App.css';

const Header = () =>
{
    return (
        <header className="header">
            <h1 className="logo">Travel Booking Portal</h1>
            <nav>
                <Link to="/">Home</Link>
                <Link to="/flights">Flights</Link>
                <Link to="/hotels">Hotels</Link>
                <Link to="/bookings">Bookings</Link>
            </nav>
            </header>
    );
};

export default Header;