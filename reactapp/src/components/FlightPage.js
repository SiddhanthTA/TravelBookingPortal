import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FlightSearch from './FlightSearch';
import FlightList from './FlightList';
import ApiService from '../utils/ApiService';
import './FlightPage.css';

function FlightPage() {
    const navigate = useNavigate();
    const [flights, setFlights] = useState([]);
    const [loading, setLoading] = useState(false);
    const [passengerCount, setPassengerCount] = useState(1);
    const [error, setError] = useState(null);

    useEffect(() => { fetchAllFlights(); }, []);

    const fetchAllFlights = async () => {
        setLoading(true);
        setError(null);
        try {
            setFlights(await ApiService.getAllFlights());
        } catch (err) {
            setError('Failed to fetch flights. Check that the backend is running.');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async (origin, destination, departureDate, count) => {
        setLoading(true);
        setError(null);
        setPassengerCount(count);
        try {
            const data = await ApiService.fetchFlights(origin, destination, departureDate);
            setFlights(data.filter((flight) => flight.availableSeats >= count));
        } catch (err) {
            setError('Failed to search flights.');
        } finally {
            setLoading(false);
        }
    };

    const handleBook = (flightId) => {
        navigate(`/flight-checkout/${flightId}`, { state: { passengerCount } });
    };

    return (
        <div className="flight-page">
            <div className="flight-page-header">
                <div><span className="travel-eyebrow">FIND YOUR NEXT JOURNEY</span><h2 className="flight-page-title">Flights</h2><p>Compare available flights and choose the one that works for you.</p></div>
                {localStorage.getItem('userRole') === 'ADMIN' && <button className="manage-flights-btn" onClick={() => navigate('/manage-flights')}>Manage flights</button>}
            </div>
            <div className="flight-search-section"><FlightSearch onSearch={handleSearch} loading={loading} /></div>
            {error && <div className="error-message">{error}</div>}
            {loading ? <div className="loading">Loading flights…</div> : <FlightList flights={flights} onBook={handleBook} passengerCount={passengerCount} error={error} />}
        </div>
    );
}

export default FlightPage;
