import React, { useState, useEffect } from 'react';
import HotelSearch from './HotelSearch';
import HotelList from './HotelList';
import ApiService from '../utils/ApiService';

const HotelPage = () => {
    const [hotels, setHotels] = useState([]);
    const [loading, setLoading] = useState(false);
    const [bookingNights, setBookingNights] = useState({});
    const [bookingLoading, setBookingLoading] = useState(false);
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
        setBookingLoading(true);
        try {
            await ApiService.bookHotel(userId, hotelId, Number(nights));
            alert('Hotel booked successfully!');
            fetchAllHotels();
            setBookingNights(prev => ({ ...prev, [hotelId]: '' })); // reset input after booking
        } catch (err) {
            setError('Booking failed');
        } finally {
            setBookingLoading(false);
        }
    };

    return (
        <div>
            <h2>Search Hotels</h2>
            <HotelSearch onSearch={handleSearch} loading={loading} />
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {loading ? (
                <p>Loading hotels...</p>
            ) : (
                <HotelList
                    hotels={hotels}
                    bookingNights={bookingNights}
                    onNightsChange={handleNightsChange}
                    onBook={handleBookHotel}
                    bookingLoading={bookingLoading}
                />
            )}
        </div>
    );
};

export default HotelPage;
