import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';

import './App.css';
import Header from './components/Header';
import Login from './components/Login';
import Register from './components/Register';
import FlightPage from './components/FlightPage';
import HotelPage from './components/HotelPage';
import BookingPage from './components/BookingPage';
import ManageFlightsPage from './components/ManageFlightsPage';
import CreateFlightPage from './components/CreateFlightPage';
import EditFlightPage from './components/EditFlightPage';
import ManageHotelsPage from './components/ManageHotelsPage';
import CreateHotelPage from './components/CreateHotelPage';
import EditHotelPage from './components/EditHotelPage';
import ManageBookingsPage from './components/ManageBookingsPage';
import UsersPage from './components/UsersPage';
import ProfilePage from './components/ProfilePage';
import FlightCheckoutPage from './components/FlightCheckoutPage';
import HotelCheckoutPage from './components/HotelCheckoutPage';
import PaymentPage from './components/PaymentPage';
import BookingConfirmationPage from './components/BookingConfirmationPage';
import DashboardPage from './components/DashboardPage';

// PrivateRoute to protect pages
const PrivateRoute = ({ children }) => {
    const userEmail = localStorage.getItem('userEmail');
    return userEmail ? children : <Navigate to="/login" replace />;
};

const HomePage = () => <DashboardPage />;

// Routes component that controls header display and routing
function AppRoutes() {
    const location = useLocation();
    const hideHeader = location.pathname === '/login' || location.pathname === '/register';

    return (
        <>
            <div className="main-content">
                {!hideHeader && <Header />}
                <Routes>
                    {/* Public */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    {/* Protected */}
                    <Route path="/" element={<PrivateRoute><HomePage /></PrivateRoute>} />
                    <Route path="/flights" element={<PrivateRoute><FlightPage /></PrivateRoute>} />
                    <Route path="/hotels" element={<PrivateRoute><HotelPage /></PrivateRoute>} />
                    <Route path="/bookings" element={<PrivateRoute><BookingPage /></PrivateRoute>} />
                    <Route path="/manage-flights" element={<PrivateRoute><ManageFlightsPage/></PrivateRoute>}/>
                    <Route path="/create-flight" element={<PrivateRoute><CreateFlightPage/></PrivateRoute>}/>
                    <Route path="/edit-flight/:id" element={<PrivateRoute><EditFlightPage/></PrivateRoute>}/>
                    <Route path="/manage-hotels" element={<PrivateRoute><ManageHotelsPage /></PrivateRoute>} />
                    <Route path="/manage-hotels/create" element={<PrivateRoute><CreateHotelPage /></PrivateRoute>} />
                    <Route path="/manage-hotels/edit/:id" element={<PrivateRoute><EditHotelPage /></PrivateRoute>} />
                     <Route path="/manage-bookings" element={<PrivateRoute><ManageBookingsPage/></PrivateRoute>} />
                     <Route path="/users" element={<PrivateRoute><UsersPage/></PrivateRoute>}/>
                     <Route path="/profile" element={<PrivateRoute><ProfilePage/></PrivateRoute>}/>
                    <Route path="/flight-checkout/:id" element={<PrivateRoute><FlightCheckoutPage /></PrivateRoute>} />
                    <Route path="/hotel-checkout/:id" element={<PrivateRoute><HotelCheckoutPage /></PrivateRoute>} />
                    <Route path="/payment/:id" element={<PrivateRoute><PaymentPage /></PrivateRoute>} />
                    <Route path="/booking-confirmation/:id" element={<PrivateRoute><BookingConfirmationPage /></PrivateRoute>} />

                    {/* Catch all */}
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
