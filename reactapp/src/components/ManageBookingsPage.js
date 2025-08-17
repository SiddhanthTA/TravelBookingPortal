import React, { useEffect, useState } from 'react';
import ApiService from '../utils/ApiService';
import './ManageBookingsPage.css';

const ManageBookingsPage = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [cancellingId, setCancellingId] = useState(null);

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await ApiService.getAllBookings(); // make sure you have this API
            setBookings(data);
        } catch (err) {
            setError('Failed to load bookings.');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = async (id) => {
        if (!window.confirm('Are you sure you want to cancel this booking?')) return;
        setCancellingId(id);
        try {
            await ApiService.cancelBooking(id);
            fetchBookings();
        } catch (err) {
            setError('Failed to cancel booking.');
        } finally {
            setCancellingId(null);
        }
    };

    return (
        <div className="manage-bookings-page">
            <h2 className="manage-bookings-title">🔥 Manage Bookings</h2>
            {error && <p className="error-text">{error}</p>}
            {loading ? (
                <p className="loading-text">Loading bookings...</p>
            ) : bookings.length === 0 ? (
                <p className="no-bookings">No bookings available</p>
            ) : (
                <div className="bookings-container">
                    {bookings.map((booking) => (
                        <div key={booking.id} className="booking-card">
                            <div className="booking-info">
                                <p><strong>Reference:</strong> {booking.bookingReference}</p>
                                <p><strong>Type:</strong> {booking.bookingType}</p>
                                {booking.flight && (
                                    <p><strong>Flight:</strong> {booking.flight.airline} - {booking.flight.flightNumber}</p>
                                )}
                                {booking.hotel && (
                                    <p><strong>Hotel:</strong> {booking.hotel.name}</p>
                                )}
                                <p><strong>Status:</strong>
                                    <span className={`status ${booking.status.toLowerCase()}`}>
                                        {booking.status}
                                    </span>
                                </p>
                                <p><strong>Total Price:</strong> ${booking.totalPrice}</p>
                            </div>
                            <div className="booking-actions">
                                <button
                                    className="btn-cancel"
                                    onClick={() => handleCancel(booking.id)}
                                    disabled={booking.status === 'CANCELLED' || cancellingId === booking.id}
                                >
                                    {cancellingId === booking.id ? 'Cancelling...' : 'Cancel'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ManageBookingsPage;
