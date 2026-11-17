import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchHotels, getBookingById } from '../utils/ApiService';
import './CheckoutFlow.css';

export default function BookingConfirmationPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [booking, setBooking] = useState(null);
    const [error, setError] = useState('');
    const [recommendedHotels, setRecommendedHotels] = useState([]);

    useEffect(() => {
        getBookingById(id).then(async (data) => {
            setBooking(data);
            if (data.bookingType === 'FLIGHT' && data.flight?.destination) {
                try { setRecommendedHotels(await fetchHotels(data.flight.destination, null, null)); } catch (ignored) { setRecommendedHotels([]); }
            }
        }).catch(() => setError('Unable to load booking confirmation.'));
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
                {booking.bookingType === 'FLIGHT' && recommendedHotels.length > 0 && (
                    <div className="confirmation-recommendations">
                        <span className="travel-eyebrow">MAKE IT A COMPLETE TRIP</span>
                        <h3>Stays in {booking.flight?.destination}</h3>
                        <p>Since your flight is headed to {booking.flight?.destination}, here are some hotels you can explore.</p>
                        <div className="recommended-hotel-list">
                            {recommendedHotels.slice(0, 3).map((hotel) => <div className="recommended-hotel" key={hotel.id}><strong>{hotel.name}</strong><span>{hotel.rating} ★ · ₹{Number(hotel.pricePerNight).toLocaleString('en-IN')} / night</span></div>)}
                        </div>
                        <button className="checkout-secondary" onClick={() => navigate('/hotels')}>Explore hotels in {booking.flight?.destination}</button>
                    </div>
                )}
                <div className="checkout-actions"><button className="checkout-secondary" onClick={() => navigate('/')}>Go to dashboard</button><button className="checkout-primary" onClick={() => navigate('/bookings')}>View my bookings</button></div>
            </section>
        </main>
    );
}
