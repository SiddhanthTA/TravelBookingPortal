import axios from 'axios';
import { BASE_URL } from './constants';

const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const fetchFlights = async (origin, destination, departureDate) => {
    const res = await api.get(`${BASE_URL}/flights/search`, {
        params: { origin, destination, departureDate }
    });
    return res.data;
};

export const getAllFlights = async () => {
    const res = await api.get('/flights');
    return res.data;
}

export const bookFlight = async (userId, flightId) => {
    const res = await api.post(`/Auth/${userId}/bookings/flight`, { flightId });
    return res.data;
}

export const getAllHotels = async () => {
    const res = await api.get('/hotels');
    return res.data;
};



export const fetchHotels = async (location, minRating, maxPrice) => {
    const res = await api.get('/hotels/search',
        {
            params: { location, rating: minRating, price: maxPrice }
        });
    return res.data;
};


export const bookHotel = async (userId, hotelId, nights) => {
    const res = await api.post(`/Auth/${userId}/bookings/hotel`, { hotelId, nights });
    return res.data;
};

export const createHotel = async (hotelData) => {
    const res = await api.post('/hotels', hotelData);
    return res.data;
};

export const updateHotel = async (id, hotelData) => {
    const res = await api.put(`/hotels/${id}`, hotelData);
    return res.data;
};

export const deleteHotel = async (id) => {
    const res = await api.delete(`/hotels/${id}`);
    return res.data;
};




export const cancelBooking = async (bookingId) => {
    const res = await api.put(`/api/bookings/${bookingId}/cancel`);
    return res.data;
}

// Register user
export const registerUser = async (userData) => {
    // userData must include role, name, email, password etc.
    const res = await api.post('/Auth/register', userData);
    return res.data;
};

// Login user
export const loginUser = async (email, password) => {
    // backend expects POST with email & pass as query params
    const res = await api.post('/Auth/check', null, {
        params: { email, pass: password },
    });
    return res.data;
};

// (Optional) Admin registration
export const registerAdmin = async (adminData) => {
    const res = await api.post('/Auth/adminRegistration', adminData);
    return res.data;
};

export const getUserBookings = async () => {
    const userId = localStorage.getItem('userId');
    if (!userId) throw new Error('User not logged in');
    const res = await api.get(`Auth/${userId}/bookings`);
    return res.data;
}


export const createFlight = async (flightData) => {
    const res = await api.post('/flights', flightData);
    return res.data;
};

export const updateFlight = async (id, flightData) => {
    const res = await api.put(`/flights/${id}`, flightData);
    return res.data;
};

export const deleteFlight = async (id) => {
    const res = await api.delete(`/flights/${id}`);
    return res.data;
};

export const getAllBookings = async () => {
    const res = await api.get('/api/bookings');
    return res.data;
};

// Get user by ID
export const getUserById = async (userId) => {
    const res = await api.get(`/Auth/${userId}`);
    return res.data;
};

// Update user by ID
export const updateUser = async (userId, userData) => {
    const res = await api.put(`Auth/update/${userId}`, userData);
    return res.data;
};

// Change password
export const changePassword = async (userId, oldPassword, newPassword) => {
    const res = await api.put(`/Auth/${userId}/change-password`, {
        oldPassword,
        newPassword,
    });
    return res.data;
};



export const getFlightById = async (flightId) => {
    const res = await api.get(`/flights/${flightId}`);
    return res.data;
};

export const getHotelById = async (hotelId) => {
    const res = await api.get(`/hotels/${hotelId}`);
    return res.data;
};

export const createFlightCheckout = async (payload) => {
    const res = await api.post('/api/bookings/flight/checkout', payload);
    return res.data;
};

export const createHotelCheckout = async (payload) => {
    const res = await api.post('/api/bookings/hotel/checkout', payload);
    return res.data;
};

export const simulatePayment = async (bookingId, paymentMethod) => {
    const res = await api.post(`/api/bookings/${bookingId}/pay`, { paymentMethod });
    return res.data;
};

export const getBookingById = async (bookingId) => {
    const res = await api.get(`/api/bookings/${bookingId}`);
    return res.data;
};

export default {
    getUserById,
    updateUser,
    getAllBookings,
    createHotel,
    updateHotel,
    deleteHotel,
    createFlight,
    updateFlight,
    deleteFlight,
    fetchFlights,
    fetchHotels,
    getUserBookings,
    cancelBooking,
    registerUser,
    loginUser,
    registerAdmin,
    getAllFlights,
    bookFlight,
    bookHotel,
    getAllHotels
};