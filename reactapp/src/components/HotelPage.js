import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HotelSearch from './HotelSearch';
import HotelList from './HotelList';
import ApiService from '../utils/ApiService';
import './HotelPage.css';

const HotelPage = () => {
    const navigate = useNavigate();
    const [hotels, setHotels] = useState([]);
    const [loading, setLoading] = useState(false);
    const [bookingLoadingId, setBookingLoadingId] = useState(null);
    const [searchCriteria, setSearchCriteria] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => { fetchAllHotels(); }, []);

    const fetchAllHotels = async () => {
        setLoading(true);
        setError(null);
        try { setHotels(await ApiService.getAllHotels()); }
        catch (err) { setError('Failed to fetch hotels. Check that the backend is running.'); }
        finally { setLoading(false); }
    };

    const handleSearch = async (location, minRating, maxPrice, criteria) => {
        setLoading(true);
        setError(null);
        setSearchCriteria(criteria);
        try {
            const data = await ApiService.fetchHotels(location, minRating, maxPrice);
            setHotels(data);
        } catch (err) { setError('Failed to search stays.'); }
        finally { setLoading(false); }
    };

    const handleBookHotel = (hotelId) => {
        if (!searchCriteria) {
            setError('Enter your destination and stay dates before choosing a hotel.');
            return;
        }
        setBookingLoadingId(hotelId);
        navigate(`/hotel-checkout/${hotelId}`, { state: searchCriteria });
        setBookingLoadingId(null);
    };

    return (
        <div className="hotel-page-container">
            <div className="hotel-header">
                <div><span className="travel-eyebrow">STAYS FOR EVERY KIND OF TRIP</span><h2 className="hotel-title">Find your stay</h2><p>Choose your destination, dates and guests to explore available hotels.</p></div>
                {localStorage.getItem("userRole") === "ADMIN" && <button className="manage-hotels-btn" onClick={() => navigate('/manage-hotels')}>Manage hotels</button>}
            </div>
            <HotelSearch onSearch={handleSearch} loading={loading} />
            {error && <p className="error-message">{error}</p>}
            {loading ? <p className="loading-text">Loading stays…</p> : <HotelList hotels={hotels} onBook={handleBookHotel} bookingLoadingId={bookingLoadingId} />}
        </div>
    );
};

export default HotelPage;
