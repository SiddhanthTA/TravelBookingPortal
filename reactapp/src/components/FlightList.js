import React from 'react';

function FlightList({flights, onBook, bookingId,error})
{
    if(flights.length===0)
    {
        return <div>No flights found</div>;
    }

    return(
        <div>
            {error && <p data-testid="book-error">{error}</p>}
            {flights.map((flight)=>
            <div key={flight.id}>
                <h3>{flight.airline}</h3>
                <p>{flight.flightNumber}</p>
                <p>
                    {flight.origin} → {flight.destination}
                </p>
                <button
                data-testid={`book-flight-${flight.id}`}
                onClick={()=> onBook(flight.id)}
                disabled={flight.availableSeats===0||bookingId===flight.id}
                >
                    {flight.availableSeats===0
                    ? 'Sold Out'
                    : bookingId === flight.id
                    ? 'Booked' : 'Book'
                    }
                </button>
            </div>
            )}
            </div>
    );
}
export default FlightList;