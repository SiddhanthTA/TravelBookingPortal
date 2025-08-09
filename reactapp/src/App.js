import React from 'react';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Header from './components/Header';
import flightSearch from './components/FlightSearch';
import HotelSearch from './components/HotelSearch';
import HotelList from './components/HotelList';
import './App.css';
import { fetchHotels } from './utils/ApiService';

function App()
{
    const [hotels,setHotels]=React.useState([]);

    return(
        <Router>
            <Header />
            <div className="main-content">
                <Routes>
                    <Route path="/" element={
                        <div className="welcome-box">
                            <h2>Welcome to travel booking portal</h2>
                            <p>Your one stop destination to search and book flights</p>
                            </div>
                    }
                    />
                    <Route path="/flights" element={<flightSearch onSearch={()=>{}} loading={false} />}/>
                    <Route path="hotels"
                    element={
                        <>
                        <HotelSearch onSearch={(location,minRating,maxPrice)=>
                        fetchHotels(location,minRating,maxPrice).then(setHotels)}loading={false}
                        />
                        <HotelList hotels={hotels}/>
                        </> 
                    }
                    />
                    <Route path="/bookings" element={<div className="centered-box"><h2>Booking management coming soon</h2></div>}/>
                    </Routes>
            </div>
        </Router>
    );
}
export default App;