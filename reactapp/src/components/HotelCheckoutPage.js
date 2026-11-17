import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { createHotelCheckout, getHotelById, getUserById } from '../utils/ApiService';
import './CheckoutFlow.css';

const blankGuest = () => ({ fullName: '', gender: '', email: '', phoneNumber: '', address: '', roomNumber: 1 });

export default function HotelCheckoutPage() {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const criteria = location.state || {};
    const userId = localStorage.getItem('userId');
    const initialGuests = Math.max(1, Number(criteria.guests || 1));
    const [hotel, setHotel] = useState(null);
    const [profile, setProfile] = useState(null);
    const [bookingFor, setBookingFor] = useState('ME');
    const [guests, setGuests] = useState(Array.from({ length: initialGuests }, blankGuest));
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!criteria.checkInDate || !criteria.checkOutDate) {
            setError('Please search for a hotel with check-in and check-out dates first.');
            setLoading(false);
            return;
        }
        Promise.all([getHotelById(id), getUserById(userId)])
            .then(([hotelData, profileData]) => {
                setHotel(hotelData);
                setProfile(profileData);
                setGuests((current) => current.map((g, index) => index === 0 ? {
                    ...g, fullName: profileData.name || '', gender: profileData.gender || '',
                    email: profileData.email || '', phoneNumber: profileData.phoneNumber || '',
                    address: [profileData.addressLine1, profileData.addressLine2, profileData.city, profileData.state, profileData.postalCode, profileData.country].filter(Boolean).join(', ')
                } : g));
            })
            .catch(() => setError('Unable to load the hotel or your profile.'))
            .finally(() => setLoading(false));
    }, [id, userId, criteria.checkInDate, criteria.checkOutDate]);

    const chooseBookingFor = (value) => {
        setBookingFor(value);
        setGuests((current) => current.map((g, index) => {
            if (value === 'ME' && index === 0 && profile) {
                return { ...blankGuest(), fullName: profile.name || '', gender: profile.gender || '', email: profile.email || '', phoneNumber: profile.phoneNumber || '', address: [profile.addressLine1, profile.addressLine2, profile.city, profile.state, profile.postalCode, profile.country].filter(Boolean).join(', ') };
            }
            return blankGuest();
        }));
    };
    const updateGuest = (index, key, value) => setGuests((current) => current.map((g, i) => i === index ? { ...g, [key]: value } : g));
    const addGuest = () => setGuests((current) => current.length >= 20 ? current : [...current, blankGuest()]);
    const removeGuest = (index) => setGuests((current) => current.length <= 1 ? current : current.filter((_, i) => i !== index));

    const submit = async (event) => {
        event.preventDefault();
        setError('');
        if (guests.some((g) => !g.fullName.trim())) { setError('Enter the full name for every guest.'); return; }
        setSubmitting(true);
        try {
            const booking = await createHotelCheckout({
                userId: Number(userId), hotelId: Number(id), bookingFor,
                checkInDate: criteria.checkInDate, checkOutDate: criteria.checkOutDate,
                rooms: Number(criteria.rooms || 1), guests
            });
            navigate(`/payment/${booking.id}`, { state: { booking } });
        } catch (err) {
            setError(err.response?.data?.message || 'Could not create this booking. Please review your details.');
        } finally { setSubmitting(false); }
    };

    if (loading) return <main className="checkout-page"><p>Loading hotel details…</p></main>;
    if (!hotel) return <main className="checkout-page"><p className="checkout-error">{error || 'Hotel not found.'}</p><button className="checkout-secondary" onClick={() => navigate('/hotels')}>Back to hotels</button></main>;

    const nights = Math.max(1, Math.round((new Date(criteria.checkOutDate) - new Date(criteria.checkInDate)) / 86400000));
    const total = Number(hotel.pricePerNight) * nights * Number(criteria.rooms || 1);

    return (
        <main className="checkout-page">
            <div className="checkout-heading"><span>HOTEL BOOKING</span><h1>Guest details</h1><p>Confirm your stay and add everyone who will be checking in.</p></div>
            <section className="checkout-summary"><div><strong>{hotel.name} · {hotel.location}</strong><span>{criteria.checkInDate} → {criteria.checkOutDate}</span><span>{nights} night(s) · {criteria.rooms || 1} room(s) · {guests.length} guest(s)</span></div><strong>₹{total.toLocaleString('en-IN')}</strong></section>
            <form onSubmit={submit}>
                <section className="checkout-panel">
                    <h2>Who are you booking for?</h2>
                    <div className="booking-for-options">
                        <label className={bookingFor === 'ME' ? 'booking-for-option selected' : 'booking-for-option'}><input type="radio" name="bookingFor" checked={bookingFor === 'ME'} onChange={() => chooseBookingFor('ME')} /><span><strong>Booking for me</strong><small>Prefill the first guest from your profile.</small></span></label>
                        <label className={bookingFor === 'OTHERS' ? 'booking-for-option selected' : 'booking-for-option'}><input type="radio" name="bookingFor" checked={bookingFor === 'OTHERS'} onChange={() => chooseBookingFor('OTHERS')} /><span><strong>Booking for others</strong><small>Start with empty guest details.</small></span></label>
                    </div>
                </section>
                {guests.map((guest, index) => (
                    <section className="checkout-panel" key={index}>
                        <div className="checkout-panel-title"><h2>Guest {index + 1}</h2>{guests.length > 1 && <button type="button" className="checkout-text-button" onClick={() => removeGuest(index)}>Remove</button>}</div>
                        {index === 0 && bookingFor === 'ME' && <p className="prefill-note">Details were filled from your profile. You can edit them for this stay.</p>}
                        <div className="checkout-grid">
                            <label>Full name<input required value={guest.fullName} onChange={(e) => updateGuest(index, 'fullName', e.target.value)} /></label>
                            <label>Gender<select value={guest.gender} onChange={(e) => updateGuest(index, 'gender', e.target.value)}><option value="">Select</option><option>Female</option><option>Male</option><option>Non-binary</option><option>Prefer not to say</option></select></label>
                            <label>Email<input type="email" value={guest.email} onChange={(e) => updateGuest(index, 'email', e.target.value)} /></label>
                            <label>Phone number<input type="tel" value={guest.phoneNumber} onChange={(e) => updateGuest(index, 'phoneNumber', e.target.value)} /></label>
                            <label className="checkout-wide">Present address<textarea rows="2" value={guest.address} onChange={(e) => updateGuest(index, 'address', e.target.value)} /></label>
                            <label>Room number<select value={guest.roomNumber} onChange={(e) => updateGuest(index, 'roomNumber', Number(e.target.value))}>{Array.from({ length: Number(criteria.rooms || 1) }, (_, i) => i + 1).map((room) => <option key={room} value={room}>Room {room}</option>)}</select></label>
                        </div>
                    </section>
                ))}
                <button type="button" className="checkout-add-button" onClick={addGuest} disabled={guests.length >= 20}>+ Add another guest</button>
                <div className="checkout-total"><span>{nights} night(s) · {criteria.rooms || 1} room(s)</span><strong>₹{total.toLocaleString('en-IN')}</strong></div>
                {error && <p className="checkout-error">{error}</p>}
                <div className="checkout-actions"><button type="button" className="checkout-secondary" onClick={() => navigate('/hotels')}>Back to hotels</button><button type="submit" className="checkout-primary" disabled={submitting}>{submitting ? 'Preparing checkout…' : 'Continue to payment'}</button></div>
            </form>
        </main>
    );
}
