import React, { useState } from "react";
import BookingList from "./BookingList";
import './BookingPage.css';

const BookingPage = () => {
    const [error, setError] = useState(null);

    return (
        <div className="booking-page">
            <h2 className="booking-page-title">Your Bookings</h2>
            {error && <p className="error-text">{error}</p>}
            <BookingList setError={setError} />
        </div>
    );
};

export default BookingPage;
