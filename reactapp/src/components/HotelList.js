import React from 'react';

const HotelList=({hotels})=>{
    if(!hotels.length)
    {
        return <p className="no-results">No hotels found for selection.</p>;
    }

    return (
        <div className="list-container">
            {hotels.map((hotel)=>(
                <div className="card" key={hotel.id}>
                    <h3>{hotel.name}</h3>
                    <p><strong>Location: </strong>{hotel.location}</p>
                    <p><strong>Rating: </strong>{hotel.rating}⭐</p>
                    <p><strong>Price/Night: </strong>₹{hotel.pricePerNight}</p>
                    <p><strong>Available Rooms: </strong>{hotel.availableRooms}</p>
                </div>      
            ))}
            </div>
    );
};
export default HotelList;