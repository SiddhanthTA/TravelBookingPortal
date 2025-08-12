import React, { useState } from 'react';
import './HotelPage.css';

function HotelSearch({ onSearch, loading }) {
    const [location, setLocation] = useState('');
    const [minRating, setMinRating] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [errors, setErrors] = useState({});

    const validate = () => {
        const errs = {};
        if (!location) errs.location = 'Select location';
        if (maxPrice && parseFloat(maxPrice) < 0)
            errs.price = 'Price should be positive';
        return errs;
    };

    const handleSearch = () => {
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
        } else {
            setErrors({});
            onSearch(location, parseInt(minRating || 0), parseFloat(maxPrice || 0));
        }
    };

    return (
        <div className="hotel-search">
            <div className="search-group">
                <label htmlFor="location-input">Location</label>
                <input
                    id="location-input"
                    data-testid="location-input"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                />
                {errors.location && <p className="error-message">{errors.location}</p>}
            </div>

            <div className="search-group">
                <label htmlFor="min-rating-input">Minimum Rating</label>
                <input
                    id="min-rating-input"
                    type="number"
                    data-testid="min-rating-input"
                    value={minRating}
                    onChange={(e) => setMinRating(e.target.value)}
                />
            </div>

            <div className="search-group">
                <label htmlFor="max-price-input">Maximum Price per Night</label>
                <input
                    id="max-price-input"
                    type="number"
                    data-testid="max-price-input"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                />
                {errors.price && <p className="error-message">{errors.price}</p>}
            </div>

            <button
                data-testid="search-hotel-btn"
                className="search-btn"
                onClick={handleSearch}
                disabled={loading}
            >
                {loading ? 'Searching...' : '🔍 Search'}
            </button>
        </div>
    );
}

export default HotelSearch;
