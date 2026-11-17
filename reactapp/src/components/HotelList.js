import React from 'react';
import './HotelPage.css';

const hotelImages = [
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=700",
    "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=700",
    "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=700",
    "https://images.unsplash.com/photo-1560347876-aeef00ee58a1?w=700"
];

const HotelList = ({ hotels, onBook, bookingLoadingId }) => {
    if (!hotels.length) return <p className="no-results">No stays match your search. Try a different destination or filters.</p>;
    return (
        <div className="hotel-list">
            {hotels.map((hotel, index) => (
                <article className="hotel-card" key={hotel.id}>
                    <img src={hotelImages[index % hotelImages.length]} alt={hotel.name} className="hotel-image" />
                    <div className="hotel-info">
                        <div className="hotel-card-heading"><h3>{hotel.name}</h3><span>{hotel.rating} ★</span></div>
                        <p><strong>Location:</strong> {hotel.location}</p>
                        <p>{hotel.address}</p>
                        <p><strong>Rooms in inventory:</strong> {hotel.availableRooms}</p>
                        <div className="hotel-card-footer"><strong>₹{Number(hotel.pricePerNight).toLocaleString('en-IN')} <small>/ night</small></strong><button onClick={() => onBook(hotel.id)} disabled={bookingLoadingId === hotel.id}>{bookingLoadingId === hotel.id ? 'Opening…' : 'Choose stay'}</button></div>
                    </div>
                </article>
            ))}
        </div>
    );
};

export default HotelList;
