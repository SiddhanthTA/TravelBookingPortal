import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserBookings, getUserById } from '../utils/ApiService';
import './DashboardPage.css';

export default function DashboardPage() {
    const navigate = useNavigate();
    const userId = localStorage.getItem('userId');
    const [profile, setProfile] = useState(null);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            userId ? getUserById(userId) : Promise.resolve(null),
            userId ? getUserBookings() : Promise.resolve([])
        ]).then(([user, reservations]) => {
            setProfile(user);
            setBookings(reservations || []);
        }).catch(() => {
            setBookings([]);
        }).finally(() => setLoading(false));
    }, [userId]);

    const upcoming = useMemo(() => bookings
        .filter((booking) => booking.status === 'CONFIRMED')
        .map((booking) => ({ ...booking, tripDate: booking.departureDate || booking.checkInDate || booking.flight?.departureTime }))
        .filter((booking) => booking.tripDate && new Date(booking.tripDate) >= new Date(new Date().toDateString()))
        .sort((a, b) => new Date(a.tripDate) - new Date(b.tripDate)), [bookings]);

    const recent = useMemo(() => [...bookings].sort((a, b) => new Date(b.bookingDate) - new Date(a.bookingDate)).slice(0, 4), [bookings]);
    const confirmedCount = bookings.filter((booking) => booking.status === 'CONFIRMED').length;
    const completionFields = ['name', 'email', 'phoneNumber', 'dateOfBirth', 'gender', 'addressLine1', 'city', 'country'];
    const completion = profile ? Math.round(completionFields.filter((field) => Boolean(profile[field])).length / completionFields.length * 100) : 0;

    return (
        <main className="dashboard-page">
            <section className="dashboard-welcome">
                <div><span className="travel-eyebrow">YOUR TRAVEL SPACE</span><h1>Welcome back{profile?.name ? `, ${profile.name.split(' ')[0]}` : ''}.</h1><p>Your next journey is just a few steps away.</p></div>
                <div className="dashboard-quick-actions"><button onClick={() => navigate('/flights')}>Find flights</button><button onClick={() => navigate('/hotels')}>Find hotels</button></div>
            </section>

            <section className="dashboard-stats">
                <div><span>Total reservations</span><strong>{bookings.length}</strong></div>
                <div><span>Confirmed trips</span><strong>{confirmedCount}</strong></div>
                <div><span>Upcoming journeys</span><strong>{upcoming.length}</strong></div>
                <div><span>Profile completion</span><strong>{completion}%</strong></div>
            </section>

            <div className="dashboard-content-grid">
                <section className="dashboard-panel dashboard-upcoming">
                    <div className="dashboard-panel-heading"><div><span className="travel-eyebrow">WHAT'S NEXT</span><h2>Upcoming journeys</h2></div><button onClick={() => navigate('/bookings')}>All bookings</button></div>
                    {loading ? <p className="dashboard-muted">Loading your journeys…</p> : upcoming.length ? upcoming.slice(0, 3).map((booking) => (
                        <article className="dashboard-trip" key={booking.id}>
                            <div className="dashboard-trip-icon">{booking.bookingType === 'FLIGHT' ? '✈' : '⌂'}</div>
                            <div><strong>{booking.bookingType === 'FLIGHT' ? `${booking.flight?.origin || 'Departure'} → ${booking.flight?.destination || 'Destination'}` : booking.hotel?.name || 'Hotel stay'}</strong><span>{booking.bookingType === 'FLIGHT' ? new Date(booking.tripDate).toLocaleString() : `${booking.checkInDate} → ${booking.checkOutDate}`}</span><small>{booking.bookingReference}</small></div>
                            <span className="dashboard-status">{booking.status}</span>
                        </article>
                    )) : <div className="dashboard-empty"><strong>No upcoming journeys yet</strong><p>Once you confirm a flight or hotel, it will appear here.</p><button onClick={() => navigate('/flights')}>Explore flights</button></div>}
                </section>

                <section className="dashboard-panel dashboard-profile-panel">
                    <span className="travel-eyebrow">YOUR PROFILE</span><h2>Make every booking easier</h2>
                    <p>Keep your personal details and address up to date to prefill passenger and guest forms.</p>
                    <div className="dashboard-progress"><span style={{ width: `${completion}%` }} /></div>
                    <strong>{completion}% complete</strong>
                    <button onClick={() => navigate('/profile')}>Update profile</button>
                </section>
            </div>

            <section className="dashboard-panel dashboard-recent">
                <div className="dashboard-panel-heading"><div><span className="travel-eyebrow">YOUR ACTIVITY</span><h2>Recent bookings</h2></div><button onClick={() => navigate('/bookings')}>View history</button></div>
                {loading ? <p className="dashboard-muted">Loading bookings…</p> : recent.length ? (
                    <div className="dashboard-recent-list">{recent.map((booking) => <div key={booking.id} className="dashboard-recent-row"><div><strong>{booking.bookingReference}</strong><span>{booking.bookingType} · {booking.bookingType === 'FLIGHT' ? booking.flight?.destination || 'Flight' : booking.hotel?.location || 'Hotel'}</span></div><span className={`dashboard-status ${(booking.status || '').toLowerCase()}`}>{booking.status}</span><strong>₹{Number(booking.totalPrice).toLocaleString('en-IN')}</strong></div>)}</div>
                ) : <p className="dashboard-muted">Your confirmed and pending bookings will appear here.</p>}
            </section>
        </main>
    );
}
