import React, { useState } from 'react';
import './HotelPage.css';

function HotelSearch({ onSearch, loading }) {
    const today = new Date().toISOString().slice(0, 10);
    const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
    const dayAfter = new Date(Date.now() + 172800000).toISOString().slice(0, 10);
    const [location, setLocation] = useState('');
    const [minRating, setMinRating] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [checkInDate, setCheckInDate] = useState(tomorrow);
    const [checkOutDate, setCheckOutDate] = useState(dayAfter);
    const [rooms, setRooms] = useState(1);
    const [guests, setGuests] = useState(1);
    const [errors, setErrors] = useState({});

    const handleSearch = (event) => {
        event.preventDefault();
        const nextErrors = {};
        if (!location.trim()) nextErrors.location = 'Enter a destination';
        if (!checkInDate || !checkOutDate || checkOutDate <= checkInDate) nextErrors.dates = 'Check-out must be after check-in';
        if (checkInDate < today) nextErrors.dates = 'Check-in cannot be in the past';
        if (Number(rooms) < 1 || Number(rooms) > 10) nextErrors.rooms = 'Choose 1 to 10 rooms';
        if (Number(guests) < 1 || Number(guests) > 20) nextErrors.guests = 'Choose 1 to 20 guests';
        if (maxPrice && Number(maxPrice) < 0) nextErrors.price = 'Price cannot be negative';
        setErrors(nextErrors);
        if (!Object.keys(nextErrors).length) {
            onSearch(location.trim(), minRating ? Number(minRating) : null, maxPrice ? Number(maxPrice) : null, {
                checkInDate, checkOutDate, rooms: Number(rooms), guests: Number(guests)
            });
        }
    };

    return (
        <form className="hotel-search" onSubmit={handleSearch}>
            <div className="search-group"><label htmlFor="location-input">Destination</label><input id="location-input" data-testid="location-input" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="City or destination" />{errors.location && <p className="error-message">{errors.location}</p>}</div>
            <div className="search-group"><label htmlFor="check-in">Check-in</label><input id="check-in" type="date" min={today} value={checkInDate} onChange={(e) => setCheckInDate(e.target.value)} /></div>
            <div className="search-group"><label htmlFor="check-out">Check-out</label><input id="check-out" type="date" min={checkInDate || today} value={checkOutDate} onChange={(e) => setCheckOutDate(e.target.value)} />{errors.dates && <p className="error-message">{errors.dates}</p>}</div>
            <div className="search-group"><label htmlFor="rooms-input">Rooms</label><input id="rooms-input" type="number" min="1" max="10" value={rooms} onChange={(e) => setRooms(e.target.value)} />{errors.rooms && <p className="error-message">{errors.rooms}</p>}</div>
            <div className="search-group"><label htmlFor="guests-input">Guests</label><input id="guests-input" type="number" min="1" max="20" value={guests} onChange={(e) => setGuests(e.target.value)} />{errors.guests && <p className="error-message">{errors.guests}</p>}</div>
            <div className="search-group"><label htmlFor="min-rating-input">Minimum rating</label><select id="min-rating-input" data-testid="min-rating-input" value={minRating} onChange={(e) => setMinRating(e.target.value)}><option value="">Any rating</option>{[3,4,5].map((rating) => <option key={rating} value={rating}>{rating}+ stars</option>)}</select></div>
            <div className="search-group"><label htmlFor="max-price-input">Max price / night (₹)</label><input id="max-price-input" type="number" min="0" data-testid="max-price-input" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />{errors.price && <p className="error-message">{errors.price}</p>}</div>
            <button data-testid="search-hotel-btn" className="search-btn" type="submit" disabled={loading}>{loading ? 'Searching…' : 'Search stays'}</button>
        </form>
    );
}

export default HotelSearch;
