import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';

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

// PrivateRoute to protect pages
const PrivateRoute = ({ children }) => {
    const userEmail = localStorage.getItem('userEmail');
    return userEmail ? children : <Navigate to="/login" replace />;
};

// Home page component with promotional sections
// Home page component with promotional sections
const HomePage = () => {
    const navigate = useNavigate();

    return (
        <main className="home-container">
            <section className="welcome-section">
                <h2>Welcome to Travel Booking Portal</h2>
                <p>Your one stop destination to search and book flights, hotels and manage your bookings!</p>
            </section>

            <section className="promo-section flight-promo">
                <div className="promo-content">
                    <img
                        src="https://images.pexels.com/photos/1004584/pexels-photo-1004584.jpeg"
                        alt="Flight"
                        className="promo-image"
                    />
                    <div className="promo-text">
                        <h3>Book Flights to Your Dream Destination</h3>
                        <p>Explore thousands of flight options at great prices.</p>
                        <button className="btn-primary" onClick={() => navigate('/flights')}>
                            Explore Flights
                        </button>
                    </div>
                </div>
            </section>

            <section className="promo-section hotel-promo">
                <div className="promo-content">
                    <img
                        src="https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg"
                        alt="Hotel"
                        className="promo-image"
                    />
                    <div className="promo-text">
                        <h3>Find Hotels That Feel Like Home</h3>
                        <p>Comfortable stays, handpicked for your convenience.</p>
                        <button className="btn-primary" onClick={() => navigate('/hotels')}>
                            Search Hotels
                        </button>
                    </div>
                </div>
            </section>

            <section className="promo-section booking-promo">
                <div className="promo-content">
                    <img
                        src="https://images.pexels.com/photos/1051075/pexels-photo-1051075.jpeg"
                        alt="Bookings"
                        className="promo-image"
                    />
                    <div className="promo-text">
                        <h3>Manage Your Bookings</h3>
                        <p>View and update your bookings easily anytime.</p>
                        <button className="btn-primary" onClick={() => navigate('/bookings')}>
                            My Bookings
                        </button>
                    </div>
                </div>
            </section>
        </main>
    );
};


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
