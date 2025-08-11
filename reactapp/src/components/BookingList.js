import React, { useEffect, useState } from 'react';
import ApiService from '../utils/ApiService';
import './BookingPage.css';

const BookingList = ({ setError }) => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            const data = await ApiService.getUserBookings();
            setBookings(data);
        } catch (error) {
            setError && setError('Error fetching bookings');
            console.error('Error fetching bookings:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = async (id) => {
        try {
            setError && setError(null);
            const updatedBooking = await ApiService.cancelBooking(id);
            setBookings((prev) =>
                prev.map((b) => (b.id === id ? updatedBooking : b))
            );
        } catch (error) {
            setError && setError('Error cancelling booking');
            console.error('Error cancelling booking:', error);
        }
    };

    if (loading) return <div className="loading">Loading your bookings...</div>;

    if (!bookings || bookings.length === 0) {
        return <div className="no-bookings">No bookings found.</div>;
    }

    return (
        <div className="booking-list">
            {bookings.map((booking) => (
                <div className="booking-card" key={booking.id}>
                    <p><strong>Reference:</strong> {booking.bookingReference}</p>
                    {booking.bookingType === 'HOTEL' && <p><strong>Hotel ID:</strong> {booking.hotelId}</p>}
                    {booking.bookingType === 'FLIGHT' && <p><strong>Flight ID:</strong> {booking.flightId}</p>}
                    <p><strong>Status:</strong> <span className={`status ${booking.status.toLowerCase()}`}>{booking.status}</span></p>
                    <button
                        className="btn-cancel"
                        data-testid={`cancel-btn-${booking.id}`}
                        onClick={() => handleCancel(booking.id)}
                        disabled={booking.status !== 'CONFIRMED'}
                    >
                        Cancel
                    </button>
                </div>
            ))}
        </div>
    );
};

export default BookingList;
