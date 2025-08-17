import React, { useState, useEffect } from 'react';
import ApiService from '../utils/ApiService';
import { useNavigate, useParams } from 'react-router-dom';
import './CreateEditFlight.css';

function EditFlightPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [flightData, setFlightData] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchFlight = async () => {
            try {
                const data = await ApiService.getAllFlights();
                const flight = data.find(f => f.id === parseInt(id));
                setFlightData(flight);
            } catch (err) {
                setError('Failed to load flight.');
            }
        };
        fetchFlight();
    }, [id]);

    const handleChange = (e) => {
        setFlightData({ ...flightData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await ApiService.updateFlight(id, flightData);
            navigate('/manage-flights');
        } catch (err) {
            setError('Failed to update flight.');
        }
    };

    if (!flightData) return <div>Loading...</div>;

    return (
        <div className="create-edit-flight-page">
            <h2>Edit Flight</h2>
            {error && <div className="error-message">{error}</div>}
            <form onSubmit={handleSubmit} className="create-edit-flight-form">
                <input type="text" name="flightNumber" value={flightData.flightNumber} onChange={handleChange} required />
                <input type="text" name="airline" value={flightData.airline} onChange={handleChange} required />
                <input type="text" name="origin" value={flightData.origin} onChange={handleChange} required />
                <input type="text" name="destination" value={flightData.destination} onChange={handleChange} required />
                <input type="datetime-local" name="departureTime" value={flightData.departureTime} onChange={handleChange} required />
                <input type="datetime-local" name="arrivalTime" value={flightData.arrivalTime} onChange={handleChange} required />
                <input type="number" name="price" value={flightData.price} onChange={handleChange} required />
                <input type="number" name="availableSeats" value={flightData.availableSeats} onChange={handleChange} required />
                <button type="submit">Update Flight</button>
            </form>
        </div>
    );
}

export default EditFlightPage;
