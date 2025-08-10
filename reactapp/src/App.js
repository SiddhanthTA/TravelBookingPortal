import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';

import Header from './components/Header';
// import HotelSearch from './components/HotelSearch';
// import HotelList from './components/HotelList';
import Login from './components/Login';
import Register from './components/Register';

// import { fetchHotels } from './utils/ApiService';
import FlightPage from './components/FlightPage';
import HotelPage from './components/HotelPage';

// PrivateRoute component to protect routes
const PrivateRoute = ({ children }) => {
    const userEmail = localStorage.getItem('userEmail');
    return userEmail ? children : <Navigate to="/login" />;
};

// This component contains all routing logic and uses useLocation safely
function AppRoutes() {
    const location = useLocation();
    const hideHeader = location.pathname === '/login' || location.pathname === '/register';
    // const [hotels, setHotels] = React.useState([]);

    return (
        <>
            {!hideHeader && <Header />}
            <div className="main-content">
                <Routes>
                    {/* Public routes */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    {/* Protected routes */}
                    <Route
                        path="/"
                        element={
                            <PrivateRoute>
                                <div className="welcome-box">
                                    <h2>Welcome to travel booking portal</h2>
                                    <p>Your one stop destination to search and book flights</p>
                                </div>
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/flights"
                        element={
                            <PrivateRoute>
                                {/* <FlightSearch /> */}
                                <FlightPage/>
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/hotels"
                        element={
                            <PrivateRoute>
                               <HotelPage/>
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/bookings"
                        element={
                            <PrivateRoute>
                                <div className="centered-box">
                                    <h2>Booking management coming soon</h2>
                                </div>
                            </PrivateRoute>
                        }
                    />

                    {/* Redirect unknown paths to login */}
                    <Route path="*" element={<Navigate to="/login" replace />} />
                </Routes>
            </div>
        </>
    );
}

function App() {
    return (
        <Router>
            <AppRoutes />
        </Router>
    );
}

export default App;
