import React, { useState, useEffect } from 'react';
import FlightSearch from './FlightSearch';
import FlightList from './FlightList';
import ApiService from '../utils/ApiService';
import './FlightPage.css'; // Scoped CSS for this page only

function FlightPage() {
    const [flights, setFlights] = useState([]);
    const [loading, setLoading] = useState(false);
    const [bookingId, setBookingId] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchAllFlights();
    }, []);

    const fetchAllFlights = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await ApiService.getAllFlights();
            setFlights(data);
        } catch (err) {
            setError('Failed to fetch flights');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async (origin, destination, departureDate) => {
        setLoading(true);
        setError(null);
        try {
            const data = await ApiService.fetchFlights(origin, destination, departureDate);
            setFlights(data);
        } catch (err) {
            setError('Failed to search flights');
        } finally {
            setLoading(false);
        }
    };

    const handleBook = async (flightId) => {
        setError(null);
        setBookingId(flightId);
        try {
            const userId = localStorage.getItem('userId');
            if (!userId) {
                setError('User not logged in');
                setBookingId(null);
                return;
            }
            await ApiService.bookFlight(userId, flightId);
            fetchAllFlights();
        } catch (err) {
            setError('Failed to book flight');
            setBookingId(null);
        }
    };

    return (
        <div className="flight-page">
            <h2 className="flight-page-title">✈ Flight Search & Booking</h2>
            <div className="flight-search-section">
                <FlightSearch onSearch={handleSearch} loading={loading} />
            </div>

            {error && <div className="error-message">{error}</div>}

            {
                loading ? (
                    <div className="loading">Loading flights...</div>
                ) : (
                    <FlightList
                        flights={flights}
                        onBook={handleBook}
                        bookingId={bookingId}
                        error={error}
                    />
                )
            }
        </div>
    );
}

export default FlightPage;
