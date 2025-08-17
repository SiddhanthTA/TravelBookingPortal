// EditHotelPage.js
import React, { useState, useEffect } from 'react';
import ApiService from '../utils/ApiService';
import { useNavigate, useParams } from 'react-router-dom';
import './CreateEditHotel.css';

function EditHotelPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [hotelData, setHotelData] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchHotel = async () => {
            try {
                const data = await ApiService.getAllHotels();
                const hotel = data.find(h => h.id === parseInt(id));
                setHotelData(hotel);
            } catch (err) {
                setError('Failed to load hotel.');
            }
        };
        fetchHotel();
    }, [id]);

    const handleChange = (e) => {
        setHotelData({ ...hotelData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await ApiService.updateHotel(id, hotelData);
            navigate('/manage-hotels');
        } catch (err) {
            setError('Failed to update hotel.');
        }
    };

    if (!hotelData) return <div>Loading...</div>;

    return (
        <div className="create-edit-hotel-page">
            <h2>Edit Hotel</h2>
            {error && <div className="error-message">{error}</div>}
            <form onSubmit={handleSubmit} className="create-edit-hotel-form">
                <input type="text" name="name" value={hotelData.name} onChange={handleChange} required />
                <input type="text" name="location" value={hotelData.location} onChange={handleChange} required />
                <input type="text" name="address" value={hotelData.address} onChange={handleChange} required />
                <input type="number" name="rating" value={hotelData.rating} onChange={handleChange} required />
                <input type="number" name="pricePerNight" value={hotelData.pricePerNight} onChange={handleChange} required />
                <input type="number" name="availableRooms" value={hotelData.availableRooms} onChange={handleChange} required />
                <button type="submit">Update Hotel</button>
            </form>
        </div>
    );
}

export default EditHotelPage;
