import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getBookingById, simulatePayment } from '../utils/ApiService';
import './CheckoutFlow.css';

export default function PaymentPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [booking, setBooking] = useState(null);
    const [method, setMethod] = useState('UPI');
    const [loading, setLoading] = useState(true);
    const [paying, setPaying] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        getBookingById(id).then(setBooking).catch(() => setError('Unable to load this booking.')).finally(() => setLoading(false));
    }, [id]);

    const pay = async () => {
        setPaying(true);
        setError('');
        try {
            const confirmed = await simulatePayment(id, method);
            navigate(`/booking-confirmation/${confirmed.id}`, { state: { booking: confirmed } });
        } catch (err) {
            setError(err.response?.data?.message || 'The simulated payment could not be completed. Please try again.');
        } finally { setPaying(false); }
    };

    if (loading) return <main className="checkout-page"><p>Loading checkout…</p></main>;
    if (!booking) return <main className="checkout-page"><p className="checkout-error">{error || 'Booking not found.'}</p></main>;

    return (
        <main className="checkout-page payment-page">
            <div className="checkout-heading"><span>SECURE CHECKOUT DEMO</span><h1>Complete your booking</h1><p>This is a simulated payment. No real money will be charged.</p></div>
            <section className="checkout-panel">
                <div className="payment-amount"><span>Amount to pay</span><strong>₹{Number(booking.totalPrice).toLocaleString('en-IN')}</strong><small>Booking reference: {booking.bookingReference}</small></div>
                <h2>Choose a payment method</h2>
                <div className="payment-methods">
                    {[['UPI', 'UPI', 'Simulated UPI payment'], ['CARD', 'Credit / Debit card', 'Demo card payment'], ['NET_BANKING', 'Net banking', 'Demo net banking payment']].map(([value, title, subtitle]) => (
                        <label className={method === value ? 'payment-method selected' : 'payment-method'} key={value}><input type="radio" name="paymentMethod" value={value} checked={method === value} onChange={() => setMethod(value)} /><span><strong>{title}</strong><small>{subtitle}</small></span></label>
                    ))}
                </div>
                <p className="payment-disclaimer">Demo only: do not enter card numbers, CVV, UPI PINs or bank credentials. Selecting a method and continuing records a simulated successful payment.</p>
                {error && <p className="checkout-error">{error}</p>}
                <div className="checkout-actions"><button className="checkout-secondary" onClick={() => navigate(-1)}>Back</button><button className="checkout-primary" onClick={pay} disabled={paying || booking.status !== 'PENDING_PAYMENT'}>{paying ? 'Processing demo payment…' : booking.status === 'CONFIRMED' ? 'Already paid' : 'Pay now'}</button></div>
            </section>
        </main>
    );
}
