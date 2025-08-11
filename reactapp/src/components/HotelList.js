import React from 'react';
import './HotelPage.css';

const hotelImages = [
    "https://images.unsplash.com/photo-1566073771259-6a8506099945",
    "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGhvdGVsfGVufDB8fDB8fHww",
    "https://images.unsplash.com/photo-1507679799987-c73779587ccf",
    "https://images.unsplash.com/photo-1560347876-aeef00ee58a1",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c"
];

const HotelList = ({ hotels, bookingNights, onNightsChange, onBook, bookingLoading }) => {
    if (!hotels.length) {
        return <p className="no-results">No hotels found for selection.</p>;
    }

    return (
        <div className="hotel-list">
            {hotels.map((hotel, index) => (
                <div className="hotel-card" key={hotel.id}>
                    <img
                        src={hotelImages[index % hotelImages.length]}
                        alt={hotel.name}
                        className="hotel-image"
                    />
                    <div className="hotel-info">
                        <h3>{hotel.name}</h3>
                        <p><strong>📍 Location:</strong> {hotel.location}</p>
                        <p><strong>⭐ Rating:</strong> {hotel.rating}</p>
                        <p><strong>💰 Price/Night:</strong> ₹{hotel.pricePerNight}</p>
                        <p><strong>🏠 Available Rooms:</strong> {hotel.availableRooms}</p>

                        <div className="booking-controls">
                            <input
                                type="number"
                                min="1"
                                placeholder="Nights"
                                value={bookingNights[hotel.id] || ''}
                                onChange={e => onNightsChange(hotel.id, e.target.value)}
                            />
                            <button
                                onClick={() => onBook(hotel.id)}
                                disabled={bookingLoading}
                            >
                                {bookingLoading ? 'Booking...' : 'Book Now'}
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default HotelList;
