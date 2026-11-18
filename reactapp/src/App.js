import React from 'react';
import {BrowserRouter as Router,Routes,Route,Navigate,useLocation} from 'react-router-dom';
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
const PrivateRoute=({children})=>localStorage.getItem('authToken')?children:<Navigate to="/login" replace/>;
const CustomerRoute=({children})=>localStorage.getItem('userRole')==='CUSTOMER'?children:<Navigate to="/" replace/>;
const AdminRoute=({children})=>localStorage.getItem('userRole')==='ADMIN'?children:<Navigate to="/" replace/>;
function AppRoutes(){const location=useLocation(),hideHeader=['/login','/register'].includes(location.pathname);return <><div className="main-content">{!hideHeader&&<Header/>}<Routes>
<Route path="/login" element={<Login/>}/><Route path="/register" element={<Register/>}/>
<Route path="/" element={<PrivateRoute><DashboardPage/></PrivateRoute>}/>
<Route path="/flights" element={<PrivateRoute><FlightPage/></PrivateRoute>}/><Route path="/hotels" element={<PrivateRoute><HotelPage/></PrivateRoute>}/>
<Route path="/bookings" element={<PrivateRoute><CustomerRoute><BookingPage/></CustomerRoute></PrivateRoute>}/>
<Route path="/manage-flights" element={<PrivateRoute><AdminRoute><ManageFlightsPage/></AdminRoute></PrivateRoute>}/>
<Route path="/create-flight" element={<PrivateRoute><AdminRoute><CreateFlightPage/></AdminRoute></PrivateRoute>}/>
<Route path="/edit-flight/:id" element={<PrivateRoute><AdminRoute><EditFlightPage/></AdminRoute></PrivateRoute>}/>
<Route path="/manage-hotels" element={<PrivateRoute><AdminRoute><ManageHotelsPage/></AdminRoute></PrivateRoute>}/>
<Route path="/manage-hotels/create" element={<PrivateRoute><AdminRoute><CreateHotelPage/></AdminRoute></PrivateRoute>}/>
<Route path="/manage-hotels/edit/:id" element={<PrivateRoute><AdminRoute><EditHotelPage/></AdminRoute></PrivateRoute>}/>
<Route path="/manage-bookings" element={<PrivateRoute><AdminRoute><ManageBookingsPage/></AdminRoute></PrivateRoute>}/>
<Route path="/users" element={<PrivateRoute><AdminRoute><UsersPage/></AdminRoute></PrivateRoute>}/>
<Route path="/profile" element={<PrivateRoute><CustomerRoute><ProfilePage/></CustomerRoute></PrivateRoute>}/>
<Route path="/flight-checkout/:id" element={<PrivateRoute><CustomerRoute><FlightCheckoutPage/></CustomerRoute></PrivateRoute>}/>
<Route path="/hotel-checkout/:id" element={<PrivateRoute><CustomerRoute><HotelCheckoutPage/></CustomerRoute></PrivateRoute>}/>
<Route path="/payment/:id" element={<PrivateRoute><CustomerRoute><PaymentPage/></CustomerRoute></PrivateRoute>}/>
<Route path="/booking-confirmation/:id" element={<PrivateRoute><CustomerRoute><BookingConfirmationPage/></CustomerRoute></PrivateRoute>}/>
<Route path="*" element={<Navigate to="/" replace/>}/>
</Routes></div></>}
function App(){return <Router><AppRoutes/></Router>}export default App;
