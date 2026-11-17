import React, { useEffect, useMemo, useState } from 'react';
import ApiService from '../utils/ApiService';
import './ManageBookingsPage.css';

const ManageBookingsPage = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [cancellingId, setCancellingId] = useState(null);
    const [filter, setFilter] = useState('ALL');

    const fetchBookings = async () => {
        setLoading(true);
        setError('');
        try { setBookings(await ApiService.getAllBookings()); }
        catch (err) { setError('Failed to load bookings.'); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchBookings(); }, []);

    const stats = useMemo(() => ({
        total: bookings.length,
        confirmed: bookings.filter((b) => b.status === 'CONFIRMED').length,
        pending: bookings.filter((b) => b.status === 'PENDING_PAYMENT').length,
        cancelled: bookings.filter((b) => b.status === 'CANCELLED').length,
        revenue: bookings.filter((b) => b.status === 'CONFIRMED' && b.paymentStatus === 'SUCCESS').reduce((sum, b) => sum + Number(b.totalPrice || 0), 0)
    }), [bookings]);

    const visibleBookings = useMemo(() => bookings.filter((b) => filter === 'ALL' || b.status === filter), [bookings, filter]);

    const handleCancel = async (id) => {
        if (!window.confirm('Cancel this booking? The demo records a refund-pending status; it does not issue a real refund.')) return;
        setCancellingId(id);
        try {
            await ApiService.cancelBooking(id);
            await fetchBookings();
        } catch (err) { setError(err.response?.data?.message || 'Failed to cancel booking.'); }
        finally { setCancellingId(null); }
    };

    return (
        <main className="manage-bookings-page product-admin-page">
            <div className="admin-page-heading"><div><span className="travel-eyebrow">OPERATIONS OVERVIEW</span><h1 className="manage-bookings-title">Booking management</h1><p>Monitor reservations and simulated payment activity.</p></div><button className="admin-refresh-button" onClick={fetchBookings} disabled={loading}>Refresh</button></div>
            {error && <p className="error-text">{error}</p>}
            <section className="admin-metrics">
                <div><span>Total bookings</span><strong>{stats.total}</strong></div>
                <div><span>Confirmed</span><strong>{stats.confirmed}</strong></div>
                <div><span>Awaiting payment</span><strong>{stats.pending}</strong></div>
                <div><span>Cancelled</span><strong>{stats.cancelled}</strong></div>
                <div className="admin-revenue"><span>Simulated revenue</span><strong>₹{stats.revenue.toLocaleString('en-IN')}</strong></div>
            </section>
            <div className="admin-booking-toolbar"><h2>Reservations</h2><label>Filter status <select value={filter} onChange={(e) => setFilter(e.target.value)}><option value="ALL">All bookings</option><option value="CONFIRMED">Confirmed</option><option value="PENDING_PAYMENT">Pending payment</option><option value="CANCELLED">Cancelled</option></select></label></div>
            {loading ? <p className="loading-text">Loading bookings…</p> : visibleBookings.length === 0 ? <p className="no-bookings">No bookings match this filter.</p> : (
                <div className="admin-booking-list">
                    {visibleBookings.map((booking) => (
                        <article key={booking.id} className="admin-booking-row">
                            <div className="admin-booking-main">
                                <div><strong>{booking.bookingReference}</strong><span className={`status ${(booking.status || '').toLowerCase()}`}>{booking.status}</span></div>
                                <p>{booking.bookingType === 'FLIGHT' ? `${booking.flight?.airline || 'Flight'} · ${booking.flight?.origin || ''} → ${booking.flight?.destination || ''}` : `${booking.hotel?.name || 'Hotel booking'} · ${booking.hotel?.location || ''}`}</p>
                                <small>Account user #{booking.userId} · {booking.bookingFor || '—'} · {booking.bookingDate ? new Date(booking.bookingDate).toLocaleString() : '—'}</small>
                            </div>
                            <div className="admin-booking-meta"><strong>₹{Number(booking.totalPrice).toLocaleString('en-IN')}</strong><span>Payment: {booking.paymentStatus || '—'}</span><span>{booking.bookingType === 'FLIGHT' ? `${booking.passengerCount || 1} passenger(s)` : `${booking.rooms || 1} room(s), ${booking.guestCount || 0} guest(s)`}</span></div>
                            <button className="btn-cancel" onClick={() => handleCancel(booking.id)} disabled={['CANCELLED', 'PAYMENT_FAILED'].includes(booking.status) || cancellingId === booking.id}>{cancellingId === booking.id ? 'Cancelling…' : 'Cancel'}</button>
                        </article>
                    ))}
                </div>
            )}
            <p className="admin-demo-note">Revenue is calculated from confirmed demo bookings only. No real payment or refund is processed.</p>
        </main>
    );
};

export default ManageBookingsPage;
