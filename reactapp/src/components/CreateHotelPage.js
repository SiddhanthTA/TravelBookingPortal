// CreateHotelPage.js
import React, { useState } from 'react';
import ApiService from '../utils/ApiService';
import { useNavigate } from 'react-router-dom';
import './CreateEditHotel.css';

function CreateHotelPage() {
    const navigate = useNavigate();
    const [hotelData, setHotelData] = useState({
        name: '',
        location: '',
        address: '',
        rating: '',
        pricePerNight: '',
        availableRooms: ''
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setHotelData({ ...hotelData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await ApiService.createHotel(hotelData);
            navigate('/manage-hotels');
        } catch (err) {
            setError('Failed to create hotel. Check all fields.');
        }
    };

    return (
        <div className="create-edit-hotel-page">
            <h2>Create New Hotel</h2>
            {error && <div className="error-message">{error}</div>}
            <form onSubmit={handleSubmit} className="create-edit-hotel-form">
                <input type="text" name="name" placeholder="Hotel Name" onChange={handleChange} required />
                <input type="text" name="location" placeholder="Location" onChange={handleChange} required />
                <input type="text" name="address" placeholder="Address" onChange={handleChange} required />
                <input type="number" name="rating" placeholder="Rating" onChange={handleChange} required />
                <input type="number" name="pricePerNight" placeholder="Price Per Night" onChange={handleChange} required />
                <input type="number" name="availableRooms" placeholder="Available Rooms" onChange={handleChange} required />
                <button type="submit">Create Hotel</button>
            </form>
        </div>
    );
}

export default CreateHotelPage;
