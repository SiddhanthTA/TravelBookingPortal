import React from 'react';
import './FlightPage.css';

const flightImages = [
    "https://images.unsplash.com/photo-1569629743817-70d8db6c323b?w=500&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1583202075376-837d5ff1bf0f?w=500&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1724811600537-1105b092e9be?w=500&auto=format&fit=crop&q=60"
];

function FlightList({ flights, onBook, passengerCount = 1, error }) {
    if (!flights.length) return <div className="no-results">No flights found. Try another date or route.</div>;

    return (
        <div className="flight-list">
            {error && <p data-testid="book-error" className="flight-inline-error">{error}</p>}
            {flights.map((flight, index) => (
                <article className="flight-card" key={flight.id}>
                    <img src={flightImages[index % flightImages.length]} alt={`${flight.airline} aircraft`} className="flight-card-image" />
                    <div className="flight-card-details">
                        <div className="flight-airline-line"><h3>{flight.airline}</h3><span>{flight.flightNumber}</span></div>
                        <div className="flight-route"><div><strong>{flight.origin}</strong><small>Departure</small></div><span className="flight-route-line">→</span><div><strong>{flight.destination}</strong><small>Arrival</small></div></div>
                        <p><strong>Departure:</strong> {new Date(flight.departureTime).toLocaleString()}</p>
                        <p><strong>Seats available:</strong> {flight.availableSeats}</p>
                        <div className="flight-book-line"><strong className="flight-price">₹{Number(flight.price).toLocaleString('en-IN')} <small>/ person</small></strong><button type="button" data-testid={`book-flight-${flight.id}`} onClick={() => onBook(flight.id)} disabled={flight.availableSeats < passengerCount} className="btn-primary">{flight.availableSeats < passengerCount ? 'Not enough seats' : 'Select flight'}</button></div>
                    </div>
                </article>
            ))}
        </div>
    );
}

export default FlightList;
