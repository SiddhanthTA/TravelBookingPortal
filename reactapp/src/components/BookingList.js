import React, { useEffect, useState} from 'react';
import { getUserBookings, cancelBooking } from '../utils/ApiService';
function BookingList()
{
    const [bookings,setBookings] = useState([]);

    useEffect(()=> 
    {
        getUserBookings().then((res)=>setBookings(res));
    },[]);

    const handleCancel=async (id) =>
    {
        const updated=await cancelBooking(id);
        setBookings((prev)=>
        prev.map((b)=>(b.id===id? {...b,status: updated.status}: b))
        );
    };

    if(bookings.length===0)
    {
        return <div>no bookings</div>;
    }

    return(
        <div>
        {bookings.map((booking)=>(
            <div key={booking.id}>
                <h3>{booking.bookingReference}</h3>
                <p>
                    {booking.bookingType==='FLIGHT'
                    ? `Flight #${booking.flightId}`
                    : `Hotel #${booking.hotelId}`
                    }
                </p>
                <p>Status: {booking.status}</p>
                <button data-testid={`cancel-btn-${booking.id}`}
                disabled={booking.status!=='CONFIRMED'}
                onClick={()=>handleCancel(booking.id)}>
                    Cancel
                </button>
            </div>
    ))}
    </div>
    );
}
export default BookingList;