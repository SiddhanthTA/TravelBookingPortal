import React from 'react';
import './FlightPage.css';

const flightImages = [
    "https://images.unsplash.com/photo-1569629743817-70d8db6c323b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGZsaWdodHxlbnwwfHwwfHx8MA%3D%3D",
    "https://media.istockphoto.com/id/184347141/photo/white-mid-sized-passenger-jet-airplane.webp?a=1&b=1&s=612x612&w=0&k=20&c=lSuqpTBzdw7HL61wBbf4H1cKFVBRl741wntvEv4XzWc=",
    "https://images.unsplash.com/photo-1583202075376-837d5ff1bf0f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzR8fGZsaWdodHxlbnwwfHwwfHx8MA%3D%3D",
    "https://images.unsplash.com/photo-1724811600537-1105b092e9be?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTh8fGZsaWdodHxlbnwwfHwwfHx8MA%3D%3D",
    "https://images.unsplash.com/photo-1610642372677-bcddb69f3531?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NzB8fGZsaWdodHxlbnwwfHwwfHx8MA%3D%3D"
];

function FlightList({ flights, onBook, bookingId, error }) {
    if (flights.length === 0) {
        return <div className="no-results">No flights found</div>;
    }

    return (
        <div className="flight-list">
            {error && <p data-testid="book-error" style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
            {flights.map((flight, index) => (
                <div className="flight-card" key={flight.id}>
                    <img
                        src={flightImages[index % flightImages.length]}
                        alt={`${flight.airline} airplane`}
                        className="flight-card-image"
                    />
                    <div className="flight-card-details">
                        <h3>{flight.airline}</h3>
                        <p><strong>Flight:</strong> {flight.flightNumber}</p>
                        <p>
                            <strong>From:</strong> {flight.origin} → <strong>To:</strong> {flight.destination}
                        </p>
                        <p><strong>Departure:</strong> {new Date(flight.departureTime).toLocaleString()}</p>
                        <p><strong>Price:</strong> ₹{flight.price}</p>
                        <button
                            data-testid={`book-flight-${flight.id}`}
                            onClick={() => onBook(flight.id)}
                            disabled={flight.availableSeats === 0 || bookingId === flight.id}
                            className="btn-primary"
                        >
                            {flight.availableSeats === 0
                                ? 'Sold Out'
                                : bookingId === flight.id
                                    ? 'Booking...'
                                    : 'Book Now'}
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default FlightList;
