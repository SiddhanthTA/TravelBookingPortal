import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getBookingById } from '../utils/ApiService';
import './CheckoutFlow.css';

export default function BookingConfirmationPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [booking, setBooking] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        getBookingById(id).then(setBooking).catch(() => setError('Unable to load booking confirmation.'));
    }, [id]);

    if (!booking) return <main className="checkout-page"><p>{error || 'Loading confirmation…'}</p></main>;

    return (
        <main className="checkout-page confirmation-page">
            <section className="confirmation-card">
                <div className="confirmation-check">✓</div>
                <span className="travel-eyebrow">BOOKING CONFIRMED</span>
                <h1>Your trip is all set.</h1>
                <p>Your simulated payment was successful and your reservation is confirmed.</p>
                <div className="confirmation-reference"><span>BOOKING REFERENCE</span><strong>{booking.bookingReference}</strong></div>
                <div className="confirmation-details">
                    <div><span>Type</span><strong>{booking.bookingType}</strong></div>
                    <div><span>Status</span><strong>{booking.status}</strong></div>
                    <div><span>Payment</span><strong>{booking.paymentStatus}</strong></div>
                    <div><span>Total paid</span><strong>₹{Number(booking.totalPrice).toLocaleString('en-IN')}</strong></div>
                </div>
                {booking.bookingType === 'FLIGHT' && <div className="confirmation-people"><h3>Passengers</h3>{(booking.passengers || []).map((p) => <p key={p.id}>{p.fullName} · {p.passengerType || 'Passenger'}</p>)}</div>}
                {booking.bookingType === 'HOTEL' && <div className="confirmation-people"><h3>Guests</h3>{(booking.guests || []).map((g) => <p key={g.id}>{g.fullName} · Room {g.roomNumber || 1}</p>)}</div>}
                <div className="checkout-actions"><button className="checkout-secondary" onClick={() => navigate('/')}>Go to dashboard</button><button className="checkout-primary" onClick={() => navigate('/bookings')}>View my bookings</button></div>
            </section>
        </main>
    );
}
