import React, { useState } from "react";
import BookingList from "./BookingList";

const BookingPage =()=>{
    const [error,setError]=useState(null);

    return(
        <div>
            <h2>
                Your Bookings
            </h2>
            {error && <p style={{color:'red'}}>{error}</p>}
            <BookingList/>
        </div>
    );
};
export default BookingPage;