import axios from 'axios';
import { BASE_URL } from './constants';

export const fetchFlights = async (origin, destination, departureDate)=>{
    const res = await axios.get(`${BASE_URL}/flights`,{
        params:{origin,destination,departureDate}
    });
    return res.data;
};

export const fetchHotels = async (location,minRating,maxPrice)=>{
    const res = await axios.get(`${BASE_URL}/hotels`,
    {
        params: {location,rating: minRating, price:maxPrice}
    });
    return res.data;
};

export const getUserBookings = async () =>{
    const res= await axios.get(`${BASE_URL}/bookings`);
    return res.data;
};

export const cancelBooking = async (id) => {
    const res = await axios.put(`${BASE_URL}/bookings/${id}/cancel`);
    return res.data;
}