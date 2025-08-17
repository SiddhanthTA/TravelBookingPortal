import React, { useState } from 'react';
import ApiService from '../utils/ApiService';
import { useNavigate } from 'react-router-dom';
import './CreateEditFlight.css'; // shared CSS for create/edit

function CreateFlightPage() {
    const navigate = useNavigate();
    const [flightData, setFlightData] = useState({
        flightNumber: '',
        airline: '',
        origin: '',
        destination: '',
        departureTime: '',
        arrivalTime: '',
        price: '',
        availableSeats: ''
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFlightData({ ...flightData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await ApiService.createFlight(flightData);
            navigate('/manage-flights');
        } catch (err) {
            setError('Failed to create flight. Check all fields.');
        }
    };

    return (
        <div className="create-edit-flight-page">
            <h2>Create New Flight</h2>
            {error && <div className="error-message">{error}</div>}
            <form onSubmit={handleSubmit} className="create-edit-flight-form">
                <input type="text" name="flightNumber" placeholder="Flight Number" onChange={handleChange} required />
                <input type="text" name="airline" placeholder="Airline" onChange={handleChange} required />
                <input type="text" name="origin" placeholder="Origin" onChange={handleChange} required />
                <input type="text" name="destination" placeholder="Destination" onChange={handleChange} required />
                <input type="datetime-local" name="departureTime" onChange={handleChange} required />
                <input type="datetime-local" name="arrivalTime" onChange={handleChange} required />
                <input type="number" name="price" placeholder="Price" onChange={handleChange} required />
                <input type="number" name="availableSeats" placeholder="Available Seats" onChange={handleChange} required />
                <button type="submit">Create Flight</button>
            </form>
        </div>
    );
}

export default CreateFlightPage;
