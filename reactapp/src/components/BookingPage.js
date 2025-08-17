import React, { use, useState } from "react";
import BookingList from "./BookingList";
import './BookingPage.css';
import { useNavigate } from "react-router-dom";

const BookingPage = () => {
    const navigate=useNavigate();
    const [error, setError] = useState(null);

    return (
        <div className="booking-page">
            <div className="booking-header">
            <h2 className="booking-page-title">Your Bookings</h2>
            {localStorage.getItem("userRole")==="ADMIN" && (
            <button className="manage-bookings-btn" onClick={()=> navigate('/manage-bookings')}>Manage Bookings</button>)}
            </div>
            {error && <p className="error-text">{error}</p>}
            <BookingList setError={setError} />
        </div>
    );
};

export default BookingPage;
