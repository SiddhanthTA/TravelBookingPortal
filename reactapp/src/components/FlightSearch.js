import React, { useState } from 'react';

function FlightSearch({ onSearch, loading }) {
    const [origin, setOrigin] = useState('');
    const [destination, setDestination] = useState('');
    const [date, setDate] = useState('');
    const [errors, setErrors] = useState({});

    const validate = () => {
        const errs = {};
        if (!origin) errs.origin = 'Select origin';
        if (!destination) errs.destination = 'Select destination';
        if (origin && destination && origin === destination)
            errs.same = 'Origin and destination must differ';
        if (!date) errs.date = 'Pick a date';
        else if (new Date(date) < new Date(new Date().setHours(0, 0, 0, 0)))
            errs.past = 'Date must not be in past';
        return errs;
    };

    const handleSubmit = () => {
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
        } else {
            setErrors({});
            onSearch(origin, destination, date);
        }
    };

    return (
        <div className="flight-search-form">
            <div className="field-group">
                <label htmlFor="origin">Origin</label>
                <input
                    id="origin"
                    data-testid="origin-input"
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                />
                {errors.origin && <p className="error-text">{errors.origin}</p>}
            </div>

            <div className="field-group">
                <label htmlFor="destination">Destination</label>
                <input
                    id="destination"
                    data-testid="destination-input"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                />
                {errors.destination && <p className="error-text">{errors.destination}</p>}
                {errors.same && <p className="error-text">{errors.same}</p>}
            </div>

            <div className="field-group">
                <label htmlFor="departureDate">Departure Date</label>
                <input
                    id="departureDate"
                    data-testid="date-input"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                />
                {errors.date && <p className="error-text">{errors.date}</p>}
                {errors.past && <p className="error-text">{errors.past}</p>}
            </div>

            <button
                className="search-btn"
                data-testid="search-button"
                onClick={handleSubmit}
                disabled={loading}
            >
                Search
            </button>
        </div>
    );
}

export default FlightSearch;
