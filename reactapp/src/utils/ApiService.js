import axios from 'axios';
import { BASE_URL } from './constants';

const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Attach the signed-in user's JWT to every API request.
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('authToken');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

api.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 401) {
            ['authToken', 'userEmail', 'userRole', 'userId'].forEach(key => localStorage.removeItem(key));
            if (window.location.pathname !== '/login') window.location.assign('/login');
        }
        return Promise.reject(error);
    }
);

export const fetchFlights = async (origin, destination, departureDate) => {
    const res = await api.get('/flights/search', {
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



export const fetchHotels = async (location, minRating, maxPrice, amenities = {}) => {
    const res = await api.get('/hotels/search', {
        params: {
            location: location || undefined,
            rating: minRating || undefined,
            price: maxPrice || undefined,
            wifi: amenities.wifi || undefined,
            breakfast: amenities.breakfast || undefined,
            pool: amenities.pool || undefined,
            gym: amenities.gym || undefined,
            nearMainAreas: amenities.nearMainAreas || undefined
        }
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
    const res = await api.post('/Auth/check', { email, password });
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

export const getAllUsers = async () => {
    const res = await api.get('/Auth/show');
    return res.data;
};

export const deleteUser = async (userId) => {
    const res = await api.delete(`/Auth/delete/${userId}`);
    return res.data;
};

export const getAllBookings = async () => {
    const res = await api.get('/api/bookings');
    return res.data;
};

// Get user by ID
export const uploadProfileImage = async (userId, file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post(`/Auth/${userId}/profile-image`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data.profileImageUrl;
};

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
    getAllUsers,
    deleteUser,
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
    getAllHotels,
    getFlightById,
    getHotelById,
    createFlightCheckout,
    createHotelCheckout,
    simulatePayment,
    getBookingById
};