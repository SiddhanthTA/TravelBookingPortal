import React, { useState, useEffect } from 'react';
import ApiService from '../utils/ApiService';
import { useNavigate } from 'react-router-dom';
import './ManageFlightsPage.css';

function ManageFlightsPage() {
    const navigate = useNavigate();
    const [flights, setFlights] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchFlights();
    }, []);

    const fetchFlights = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await ApiService.getAllFlights();
            setFlights(data);
        } catch (err) {
            setError('Failed to load flights.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this flight?')) return;
        try {
            await ApiService.deleteFlight(id);
            fetchFlights(); // Refresh list
        } catch (err) {
            setError('Failed to delete flight.');
        }
    };

    const handleEdit = (id) => {
        navigate(`/edit-flight/${id}`);
    };

    const handleCreate = () => {
        navigate('/create-flight');
    };

    return (
        <div className="manage-flights-page">
            <div className="manage-flights-header">
                <h2>Manage Flights</h2>
                <button className="create-flight-btn" onClick={handleCreate}>
                    + Create Flight
                </button>
            </div>

            {error && <div className="error-message">{error}</div>}
            {loading ? (
                <div className="loading">Loading flights...</div>
            ) : (
                <div className="flights-container">
                    {flights.length === 0 ? (
                        <div className="no-flights">No flights available</div>
                    ) : (
                        flights.map((flight) => (
                            <div key={flight.id} className="flight-card">
                                <div className="flight-info">
                                    <h3>{flight.airline} - {flight.flightNumber}</h3>
                                    <p>{flight.origin} → {flight.destination}</p>
                                    <p>Departure: {new Date(flight.departureTime).toLocaleString()}</p>
                                    <p>Arrival: {new Date(flight.arrivalTime).toLocaleString()}</p>
                                    <p>Price: ${flight.price}</p>
                                    <p>Seats: {flight.availableSeats}</p>
                                </div>
                                <div className="flight-actions">
                                    <button className="edit-btn" onClick={() => handleEdit(flight.id)}>Edit</button>
                                    <button className="delete-btn" onClick={() => handleDelete(flight.id)}>Delete</button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}

export default ManageFlightsPage;
