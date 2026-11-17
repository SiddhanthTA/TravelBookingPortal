import React, { useState } from 'react';

function FlightSearch({ onSearch, loading }) {
    const [origin, setOrigin] = useState('');
    const [destination, setDestination] = useState('');
    const [date, setDate] = useState('');
    const [passengers, setPassengers] = useState(1);
    const [errors, setErrors] = useState({});

    const validate = () => {
        const errs = {};
        if (!origin.trim()) errs.origin = 'Enter your departure city';
        if (!destination.trim()) errs.destination = 'Enter your destination';
        if (origin.trim() && destination.trim() && origin.trim().toLowerCase() === destination.trim().toLowerCase()) {
            errs.same = 'Origin and destination must differ';
        }
        if (!date) errs.date = 'Choose a departure date';
        else if (new Date(date + 'T00:00:00') < new Date(new Date().toDateString())) errs.past = 'Departure date cannot be in the past';
        if (passengers < 1 || passengers > 9) errs.passengers = 'Choose between 1 and 9 passengers';
        return errs;
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length) {
            setErrors(validationErrors);
            return;
        }
        setErrors({});
        onSearch(origin.trim(), destination.trim(), date, Number(passengers));
    };

    return (
        <form className="flight-search-form" onSubmit={handleSubmit}>
            <div className="field-group">
                <label htmlFor="origin">From</label>
                <input id="origin" data-testid="origin-input" value={origin} onChange={(e) => setOrigin(e.target.value)} placeholder="Departure city" />
                {errors.origin && <p className="error-text">{errors.origin}</p>}
            </div>
            <div className="field-group">
                <label htmlFor="destination">To</label>
                <input id="destination" data-testid="destination-input" value={destination} onChange={(e) => setDestination(e.target.value)} placeholder="Destination city" />
                {errors.destination && <p className="error-text">{errors.destination}</p>}
                {errors.same && <p className="error-text">{errors.same}</p>}
            </div>
            <div className="field-group">
                <label htmlFor="departureDate">Departure</label>
                <input id="departureDate" data-testid="date-input" type="date" min={new Date().toISOString().slice(0, 10)} value={date} onChange={(e) => setDate(e.target.value)} />
                {errors.date && <p className="error-text">{errors.date}</p>}
                {errors.past && <p className="error-text">{errors.past}</p>}
            </div>
            <div className="field-group">
                <label htmlFor="passengers">Travelers</label>
                <select id="passengers" value={passengers} onChange={(e) => setPassengers(e.target.value)}>
                    {Array.from({ length: 9 }, (_, index) => index + 1).map((count) => <option key={count} value={count}>{count} {count === 1 ? 'Passenger' : 'Passengers'}</option>)}
                </select>
                {errors.passengers && <p className="error-text">{errors.passengers}</p>}
            </div>
            <button className="search-btn" data-testid="search-button" type="submit" disabled={loading}>{loading ? 'Searching…' : 'Search flights'}</button>
        </form>
    );
}

export default FlightSearch;
