import React from 'react';

const HotelList = ({ hotels, bookingNights, onNightsChange, onBook, bookingLoading }) => {
    if (!hotels.length) {
        return <p className="no-results">No hotels found for selection.</p>;
    }

    return (
        <div className="list-container">
            {hotels.map(hotel => (
                <div className="card" key={hotel.id}>
                    <h3>{hotel.name}</h3>
                    <p><strong>Location: </strong>{hotel.location}</p>
                    <p><strong>Rating: </strong>{hotel.rating}⭐</p>
                    <p><strong>Price/Night: </strong>₹{hotel.pricePerNight}</p>
                    <p><strong>Available Rooms: </strong>{hotel.availableRooms}</p>

                    {/* Booking input and button inline */}
                    <input
                        type="number"
                        min="1"
                        placeholder="Nights"
                        value={bookingNights[hotel.id] || ''}
                        onChange={e => onNightsChange(hotel.id, e.target.value)}
                        style={{ marginRight: '10px' }}
                    />
                    <button
                        onClick={() => onBook(hotel.id)}
                        disabled={bookingLoading}
                    >
                        Book
                    </button>
                </div>
            ))}
        </div>
    );
};

export default HotelList;
