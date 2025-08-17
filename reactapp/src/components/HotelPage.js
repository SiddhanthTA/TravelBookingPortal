import React, { useState, useEffect } from 'react';
import HotelSearch from './HotelSearch';
import HotelList from './HotelList';
import ApiService from '../utils/ApiService';
import './HotelPage.css';
import { useNavigate } from 'react-router-dom';

const HotelPage = () => {
    const navigate=useNavigate();
    const  [hotels, setHotels] = useState([]);
    const [loading, setLoading] = useState(false);
    const [bookingNights, setBookingNights] = useState({});
    const [bookingLoadingId, setBookingLoadingId] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchAllHotels();
    }, []);

    const fetchAllHotels = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await ApiService.getAllHotels();
            setHotels(data);
        } catch (err) {
            setError('Failed to fetch hotels');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async (location, minRating, maxPrice) => {
        setLoading(true);
        setError(null);
        try {
            const data = await ApiService.fetchHotels(location, minRating, maxPrice);
            setHotels(data);
        } catch (err) {
            setError('Failed to search hotels');
        } finally {
            setLoading(false);
        }
    };

    const handleNightsChange = (hotelId, nights) => {
        setBookingNights(prev => ({ ...prev, [hotelId]: nights }));
    };

    const handleBookHotel = async (hotelId) => {
        setError(null);
        const nights = bookingNights[hotelId];
        if (!nights || nights <= 0) {
            setError('Please enter a valid number of nights');
            return;
        }
        const userId = localStorage.getItem('userId');
        if (!userId) {
            setError('You need to log in to book a hotel');
            return;
        }
        setBookingLoadingId(hotelId);
        try {
            await ApiService.bookHotel(userId, hotelId, Number(nights));
            alert('Hotel booked successfully!');
            fetchAllHotels();
            setBookingNights(prev => ({ ...prev, [hotelId]: '' }));
        } catch (err) {
            setError('Booking failed');
        } finally {
            setBookingLoadingId(null);
        }
    };

    return (
        <div className="hotel-page-container">
            <div className="hotel-header">
            <h2 className="hotel-title">🏨 Find Your Perfect Stay</h2>
            {localStorage.getItem("userRole")==="ADMIN" &&
            (<button className="manage-hotels-btn" onClick={()=>navigate('/manage-hotels')}>Manage Hotels</button>)}
            </div>
            <HotelSearch onSearch={handleSearch} loading={loading} />
            {error && <p className="error-message">{error}</p>}
            {loading ? (
                <p className="loading-text">Loading hotels...</p>
            ) : (
                <HotelList
                    hotels={hotels}
                    bookingNights={bookingNights}
                    onNightsChange={handleNightsChange}
                    onBook={handleBookHotel}
                    bookingLoadingId={bookingLoadingId}
                />
            )}
        </div>
    );
};

export default HotelPage;
