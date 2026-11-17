import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiService from '../utils/ApiService';
import './BookingPage.css';

const BookingList = ({ setError }) => {
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedBooking, setExpandedBooking] = useState(null);

    useEffect(() => { fetchBookings(); }, []);

    const fetchBookings = async () => {
        try {
            const data = await ApiService.getUserBookings();
            setBookings(data);
        } catch (error) {
            setError && setError('Error fetching bookings');
        } finally { setLoading(false); }
    };

    const handleCancel = async (id) => {
        try {
            setError && setError(null);
            const updatedBooking = await ApiService.cancelBooking(id);
            setBookings((previous) => previous.map((booking) => booking.id === id ? updatedBooking : booking));
            if (expandedBooking?.id === id) setExpandedBooking(updatedBooking);
        } catch (error) {
            setError && setError(error.response?.data?.message || 'Unable to cancel this booking.');
        }
    };

    if (loading) return <div className="loading">Loading your bookings…</div>;
    if (!bookings?.length) return <div className="no-bookings">No bookings yet. Your next trip starts here.</div>;

    return (
        <div className="booking-list">
            {bookings.map((booking) => (
                <article className="booking-card" key={booking.id}>
                    <p><strong>Reference:</strong> {booking.bookingReference}</p>
                    <p><strong>{booking.bookingType === 'HOTEL' ? booking.hotel?.name || `Hotel #${booking.hotelId}` : booking.flight?.airline || `Flight #${booking.flightId}`}</strong></p>
                    <p><strong>Status:</strong> <span className={`status ${(booking.status || '').toLowerCase()}`}>{booking.status}</span></p>
                    <p><strong>Payment:</strong> {booking.paymentStatus || '—'}</p>
                    <p><strong>Total:</strong> ₹{Number(booking.totalPrice).toLocaleString('en-IN')}</p>
                    <div className="booking-card-actions">
                        {booking.status === 'PENDING_PAYMENT' && <button className="more-details-btn" onClick={() => navigate(`/payment/${booking.id}`)}>Continue payment</button>}
                        <button className="more-details-btn" onClick={() => setExpandedBooking(booking)}>More details</button>
                        <button className="btn-cancel" data-testid={`cancel-btn-${booking.id}`} onClick={() => handleCancel(booking.id)} disabled={booking.status === 'CANCELLED' || booking.status === 'PAYMENT_FAILED'}>Cancel</button>
                    </div>
                </article>
            ))}

            {expandedBooking && (
                <div className="details-modal-overlay">
                    <div className="details-modal">
                        <h3>Booking details</h3>
                        <p><strong>Reference:</strong> {expandedBooking.bookingReference}</p>
                        <p><strong>Booked for:</strong> {expandedBooking.bookingFor || '—'}</p>
                        <p><strong>Booking date:</strong> {expandedBooking.bookingDate ? new Date(expandedBooking.bookingDate).toLocaleString() : '—'}</p>
                        {expandedBooking.bookingType === 'HOTEL' && (
                            <>
                                <p><strong>Hotel:</strong> {expandedBooking.hotel?.name || `Hotel #${expandedBooking.hotelId}`}</p>
                                <p><strong>Location:</strong> {expandedBooking.hotel?.location || '—'}</p>
                                <p><strong>Stay:</strong> {expandedBooking.checkInDate || '—'} → {expandedBooking.checkOutDate || '—'}</p>
                                <p><strong>Rooms / nights:</strong> {expandedBooking.rooms || 1} / {expandedBooking.nights || '—'}</p>
                                <h4>Guests</h4>
                                {(expandedBooking.guests || []).map((guest) => <p key={guest.id}>{guest.fullName} · Room {guest.roomNumber || 1}</p>)}
                            </>
                        )}
                        {expandedBooking.bookingType === 'FLIGHT' && (
                            <>
                                <p><strong>Airline:</strong> {expandedBooking.flight?.airline || '—'}</p>
                                <p><strong>Flight:</strong> {expandedBooking.flight?.flightNumber || `#${expandedBooking.flightId}`}</p>
                                <p><strong>Route:</strong> {expandedBooking.flight?.origin || '—'} → {expandedBooking.flight?.destination || '—'}</p>
                                <p><strong>Departure:</strong> {expandedBooking.flight?.departureTime ? new Date(expandedBooking.flight.departureTime).toLocaleString() : expandedBooking.departureDate || '—'}</p>
                                <h4>Passengers</h4>
                                {(expandedBooking.passengers || []).map((passenger) => <p key={passenger.id}>{passenger.fullName} · {passenger.passengerType || 'Passenger'}</p>)}
                            </>
                        )}
                        <p><strong>Payment status:</strong> {expandedBooking.paymentStatus || '—'}</p>
                        <p><strong>Total:</strong> ₹{Number(expandedBooking.totalPrice).toLocaleString('en-IN')}</p>
                        <button className="close-modal-btn" onClick={() => setExpandedBooking(null)}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BookingList;
