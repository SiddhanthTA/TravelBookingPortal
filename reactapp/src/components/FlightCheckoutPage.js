import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { createFlightCheckout, getFlightById, getUserById } from '../utils/ApiService';
import './CheckoutFlow.css';

const blankPassenger = () => ({ fullName: '', dateOfBirth: '', gender: '', email: '', phoneNumber: '', address: '', passengerType: 'ADULT' });

export default function FlightCheckoutPage() {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const count = Math.max(1, Number(location.state?.passengerCount || 1));
    const userId = localStorage.getItem('userId');
    const [flight, setFlight] = useState(null);
    const [profile, setProfile] = useState(null);
    const [bookingFor, setBookingFor] = useState('ME');
    const [passengers, setPassengers] = useState(Array.from({ length: count }, blankPassenger));
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        Promise.all([getFlightById(id), getUserById(userId)])
            .then(([flightData, profileData]) => {
                setFlight(flightData);
                setProfile(profileData);
                setPassengers((current) => current.map((p, index) => index === 0 ? {
                    ...p, fullName: profileData.name || '', dateOfBirth: profileData.dateOfBirth || '',
                    gender: profileData.gender || '', email: profileData.email || '', phoneNumber: profileData.phoneNumber || '', address: [profileData.addressLine1, profileData.addressLine2, profileData.city, profileData.state, profileData.postalCode, profileData.country].filter(Boolean).join(', ')
                } : p));
            })
            .catch(() => setError('Unable to load the flight or your profile. Please return to search.'))
            .finally(() => setLoading(false));
    }, [id, userId]);

    const chooseBookingFor = (value) => {
        setBookingFor(value);
        setPassengers((current) => current.map((p, index) => {
            if (value === 'ME' && index === 0 && profile) {
                return { ...blankPassenger(), fullName: profile.name || '', dateOfBirth: profile.dateOfBirth || '', gender: profile.gender || '', email: profile.email || '', phoneNumber: profile.phoneNumber || '', address: [profile.addressLine1, profile.addressLine2, profile.city, profile.state, profile.postalCode, profile.country].filter(Boolean).join(', ') };
            }
            return blankPassenger();
        }));
    };

    const updatePassenger = (index, key, value) => setPassengers((current) => current.map((p, i) => i === index ? { ...p, [key]: value } : p));
    const addPassenger = () => setPassengers((current) => current.length >= 9 ? current : [...current, blankPassenger()]);
    const removePassenger = (index) => setPassengers((current) => current.length <= 1 ? current : current.filter((_, i) => i !== index));

    const submit = async (event) => {
        event.preventDefault();
        setError('');
        if (passengers.some((p) => !p.fullName.trim())) {
            setError('Enter the full name for every passenger.');
            return;
        }
        setSubmitting(true);
        try {
            const booking = await createFlightCheckout({
                userId: Number(userId), flightId: Number(id), bookingFor,
                contactEmail: profile?.email, contactPhone: profile?.phoneNumber, passengers
            });
            navigate(`/payment/${booking.id}`, { state: { booking } });
        } catch (err) {
            setError(err.response?.data?.message || 'Could not create this booking. Check seat availability and try again.');
        } finally { setSubmitting(false); }
    };

    if (loading) return <main className="checkout-page"><p>Loading flight details…</p></main>;
    if (!flight) return <main className="checkout-page"><p className="checkout-error">{error || 'Flight not found.'}</p></main>;

    return (
        <main className="checkout-page">
            <div className="checkout-heading"><span>FLIGHT BOOKING</span><h1>Passenger details</h1><p>Review your flight and tell us who is traveling.</p></div>
            <section className="checkout-summary"><div><strong>{flight.origin} → {flight.destination}</strong><span>{flight.airline} · {flight.flightNumber}</span><span>{new Date(flight.departureTime).toLocaleString()}</span></div><strong>₹{Number(flight.price).toLocaleString('en-IN')} / passenger</strong></section>
            <form onSubmit={submit}>
                <section className="checkout-panel">
                    <h2>Who are you booking for?</h2>
                    <div className="booking-for-options">
                        <label className={bookingFor === 'ME' ? 'booking-for-option selected' : 'booking-for-option'}><input type="radio" name="bookingFor" checked={bookingFor === 'ME'} onChange={() => chooseBookingFor('ME')} /><span><strong>Booking for me</strong><small>Prefill the first passenger from your profile.</small></span></label>
                        <label className={bookingFor === 'OTHERS' ? 'booking-for-option selected' : 'booking-for-option'}><input type="radio" name="bookingFor" checked={bookingFor === 'OTHERS'} onChange={() => chooseBookingFor('OTHERS')} /><span><strong>Booking for others</strong><small>Start with empty passenger details.</small></span></label>
                    </div>
                </section>
                {passengers.map((passenger, index) => (
                    <section className="checkout-panel" key={index}>
                        <div className="checkout-panel-title"><h2>Passenger {index + 1}</h2>{passengers.length > 1 && <button type="button" className="checkout-text-button" onClick={() => removePassenger(index)}>Remove</button>}</div>
                        {index === 0 && bookingFor === 'ME' && <p className="prefill-note">Details were filled from your profile. You can edit them for this booking.</p>}
                        <div className="checkout-grid">
                            <label>Full name<input required value={passenger.fullName} onChange={(e) => updatePassenger(index, 'fullName', e.target.value)} /></label>
                            <label>Date of birth<input type="date" value={passenger.dateOfBirth} onChange={(e) => updatePassenger(index, 'dateOfBirth', e.target.value)} /></label>
                            <label>Gender<select value={passenger.gender} onChange={(e) => updatePassenger(index, 'gender', e.target.value)}><option value="">Select</option><option>Female</option><option>Male</option><option>Non-binary</option><option>Prefer not to say</option></select></label>
                            <label>Passenger type<select value={passenger.passengerType} onChange={(e) => updatePassenger(index, 'passengerType', e.target.value)}><option value="ADULT">Adult</option><option value="CHILD">Child</option><option value="INFANT">Infant</option></select></label>
                            <label>Email<input type="email" value={passenger.email} onChange={(e) => updatePassenger(index, 'email', e.target.value)} /></label>
                            <label>Phone number<input type="tel" value={passenger.phoneNumber} onChange={(e) => updatePassenger(index, 'phoneNumber', e.target.value)} /></label>\n                            <label className="checkout-wide">Address<textarea rows="2" value={passenger.address} onChange={(e) => updatePassenger(index, 'address', e.target.value)} /></label>
                        </div>
                    </section>
                ))}
                <button type="button" className="checkout-add-button" onClick={addPassenger} disabled={passengers.length >= 9}>+ Add another passenger</button>
                <div className="checkout-total"><span>{passengers.length} passenger(s)</span><strong>₹{(Number(flight.price) * passengers.length).toLocaleString('en-IN')}</strong></div>
                {error && <p className="checkout-error">{error}</p>}
                <div className="checkout-actions"><button type="button" className="checkout-secondary" onClick={() => navigate('/flights')}>Back to flights</button><button type="submit" className="checkout-primary" disabled={submitting}>{submitting ? 'Preparing checkout…' : 'Continue to payment'}</button></div>
            </form>
        </main>
    );
}
