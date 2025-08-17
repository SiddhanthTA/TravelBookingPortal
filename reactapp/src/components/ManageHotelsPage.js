import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiService from '../utils/ApiService';
import './ManageHotelsPage.css';

function ManageHotelsPage() {
    const navigate = useNavigate();
    const [hotels, setHotels] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchHotels();
    }, []);

    const fetchHotels = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await ApiService.getAllHotels();
            setHotels(data);
        } catch (err) {
            setError('Failed to load hotels.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this hotel?')) return;
        try {
            await ApiService.deleteHotel(id);
            fetchHotels();
        } catch (err) {
            setError('Failed to delete hotel.');
        }
    };

    const handleEdit = (id) => {
        navigate(`/manage-hotels/edit/${id}`);
    };

    const handleCreate = () => {
        navigate('/manage-hotels/create');
    };

    return (
        <div className="manage-hotels-page">
            <div className="manage-hotels-header">
                <h2>Manage Hotels</h2>
                <button className="create-hotel-btn" onClick={handleCreate}>
                    + Create Hotel
                </button>
            </div>

            {error && <div className="error-message">{error}</div>}
            {loading ? (
                <div className="loading">Loading hotels...</div>
            ) : (
                <div className="hotels-container">
                    {hotels.length === 0 ? (
                        <div className="no-hotels">No hotels available</div>
                    ) : (
                        hotels.map((hotel) => (
                            <div key={hotel.id} className="pikachu-hotel-card">
                                <div className="hotel-info">
                                    <h3>{hotel.name}</h3>
                                    <p>{hotel.location}</p>
                                    <p>Address: {hotel.address}</p>
                                    <p>Rating: {hotel.rating}</p>
                                    <p>Price/Night: ${hotel.pricePerNight}</p>
                                    <p>Available Rooms: {hotel.availableRooms}</p>
                                </div>
                                <div className="hotel-actions">
                                    <button className="edit-btn" onClick={() => handleEdit(hotel.id)}>Edit</button>
                                    <button className="delete-btn" onClick={() => handleDelete(hotel.id)}>Delete</button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}

export default ManageHotelsPage;
