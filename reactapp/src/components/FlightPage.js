import React, { useState, useEffect } from 'react';
import FlightSearch from './FlightSearch';
import FlightList from './FlightList';
import ApiService from '../utils/ApiService';

function FlightPage() {
    const [flights, setFlights] = useState([]);
    const [loading, setLoading] = useState(false);
    const [bookingId, setBookingId] = useState(null);
    const [error, setError] = useState(null);

    // Load all flights initially
    useEffect(() => {
        fetchAllFlights();
    }, []);

    const fetchAllFlights = async () => {
        setLoading(true);
        setError(null);
        console.log("fetchAllFlights called");
        try {
            const data = await ApiService.getAllFlights();
            console.log("Fetched flights",data);
            setFlights(data);
        } catch (err) {
            console.error("Error fetching flights:",err);
            setError('Failed to fetch flights');
        } finally {
            setLoading(false);
        }
    };

    // Called when FlightSearch triggers a search
    const handleSearch = async (origin, destination, departureDate) => {
        setLoading(true);
        setError(null);
        try {
            // Call fetchFlights with search params
            const data = await ApiService.fetchFlights(origin, destination, departureDate);
            setFlights(data);
        } catch (err) {
            setError('Failed to search flights');
        } finally {
            setLoading(false);
        }
    };

    // Book a flight by flightId
    const handleBook = async (flightId) => {
        setError(null);
        setBookingId(flightId);
        try {
            // Get userId from localStorage or auth context (adjust if needed)
            const userId = localStorage.getItem('userId');
            console.log('userId from localstorage',userId);
            if (!userId) {
                setError('User not logged in');
                setBookingId(null);
                return;
            }
            await ApiService.bookFlight(userId, flightId);
            // Optionally, refresh flights or update UI
            fetchAllFlights();
        } catch (err) {
            console.error('Booking failed: ',err.response||err.message||err);
            setError('Failed to book flight');
            setBookingId(null);
        }
    };

    return (
        <div>
            <h2>Flight Search & Booking</h2>
            <FlightSearch onSearch={handleSearch} loading={loading} />
            <FlightList flights={flights} onBook={handleBook} bookingId={bookingId} error={error} />
        </div>
    );
}

export default FlightPage;
