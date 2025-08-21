// import React, { useEffect, useState } from 'react';
// import ApiService from '../utils/ApiService';
// import './BookingPage.css';

// const BookingList = ({ setError }) => {
//     const [bookings, setBookings] = useState([]);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         fetchBookings();
//     }, []);

//     const fetchBookings = async () => {
//         try {
//             const data = await ApiService.getUserBookings();
//             setBookings(data);
//         } catch (error) {
//             setError && setError('Error fetching bookings');
//             console.error('Error fetching bookings:', error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleCancel = async (id) => {
//         try {
//             setError && setError(null);
//             const updatedBooking = await ApiService.cancelBooking(id);
//             setBookings((prev) =>
//                 prev.map((b) => (b.id === id ? updatedBooking : b))
//             );
//         } catch (error) {
//             setError && setError('Error cancelling booking');
//             console.error('Error cancelling booking:', error);
//         }
//     };

//     if (loading) return <div className="loading">Loading your bookings...</div>;

//     if (!bookings || bookings.length === 0) {
//         return <div className="no-bookings">No bookings found.</div>;
//     }

//     return (
//         <div className="booking-list">
//             {bookings.map((booking) => (
//                 <div className="booking-card" key={booking.id}>
//                     <p><strong>Reference:</strong> {booking.bookingReference}</p>
//                     {booking.bookingType === 'HOTEL' && <p><strong>Hotel #{booking.hotelId}</strong></p>}
//                     {booking.bookingType === 'FLIGHT' && <p><strong>Flight #{booking.flightId}</strong></p>}
//                     <p><strong>Status:</strong> <span className={`status ${booking.status.toLowerCase()}`}>{booking.status}</span></p>
//                     <button
//                         className="btn-cancel"
//                         data-testid={`cancel-btn-${booking.id}`}
//                         onClick={() => handleCancel(booking.id)}
//                         disabled={booking.status !== 'CONFIRMED'}
//                     >
//                         Cancel
//                     </button>
//                 </div>
//             ))}
//         </div>
//     );
// };

// export default BookingList;



import React, { useEffect, useState } from 'react';
import ApiService from '../utils/ApiService';
import './BookingPage.css';

const BookingList = ({ setError }) => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedBooking, setExpandedBooking] = useState(null); // modal open

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            const data = await ApiService.getUserBookings();
            setBookings(data);
        } catch (error) {
            setError && setError('Error fetching bookings');
            console.error('Error fetching bookings:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = async (id) => {
        try {
            setError && setError(null);
            const updatedBooking = await ApiService.cancelBooking(id);
            setBookings((prev) =>
                prev.map((b) => (b.id === id ? updatedBooking : b))
            );
        } catch (error) {
            setError && setError('Error cancelling booking');
            console.error('Error cancelling booking:', error);
        }
    };

    if (loading) return <div className="loading">Loading your bookings...</div>;

    if (!bookings || bookings.length === 0) {
        return <div className="no-bookings">No bookings found.</div>;
    }

    return (
        <div className="booking-list">
            {bookings.map((booking) => (
                <div className="booking-card" key={booking.id}>
                    <p><strong>Reference:</strong> {booking.bookingReference}</p>
                    {booking.bookingType === 'HOTEL' && <p><strong>Hotel #{booking.hotelId}</strong></p>}
                    {booking.bookingType === 'FLIGHT' && <p><strong>Flight #{booking.flightId}</strong></p>}

                    <p>
                        <strong>Status:</strong>{' '}
                        <span className={`status ${booking.status.toLowerCase()}`}>
                            {booking.status}
                        </span>
                    </p>

                    <button
                        className="btn-cancel"
                        data-testid={`cancel-btn-${booking.id}`}
                        onClick={() => handleCancel(booking.id)}
                        disabled={booking.status !== 'CONFIRMED'}
                    >
                        Cancel
                    </button>

                    <button
                        className="more-details-btn"
                        onClick={() => setExpandedBooking(booking)}
                    >
                        More Details
                    </button>
                </div>
            ))}

            {/* Modal for details */}
            {expandedBooking && (
                <div className="details-modal-overlay">
                    <div className="details-modal">
                        <h3>Booking Details</h3>

                        {expandedBooking.bookingType === 'HOTEL' && expandedBooking.hotel && (
                            <>
                                <p><strong>Hotel Name:</strong> {expandedBooking.hotel.name}</p>
                                <p><strong>Location:</strong> {expandedBooking.hotel.location}</p>
                                <p><strong>Address:</strong> {expandedBooking.hotel.address}</p>
                                <p><strong>Nights:</strong> {expandedBooking.nights}</p>
                                <p><strong>Total Price:</strong> ₹{expandedBooking.totalPrice}</p>
                            </>
                        )}

                        {expandedBooking.bookingType === 'FLIGHT' && expandedBooking.flight && (
                            <>
                                <p><strong>Airline:</strong> {expandedBooking.flight.airline}</p>
                                <p><strong>Flight No:</strong> {expandedBooking.flight.flightNumber}</p>
                                <p><strong>From:</strong> {expandedBooking.flight.from} → <strong>To:</strong> {expandedBooking.flight.to}</p>
                                <p><strong>Departure:</strong> {new Date(expandedBooking.flight.departureTime).toLocaleString()}</p>
                                <p><strong>Total Price:</strong> ₹{expandedBooking.totalPrice}</p>
                            </>
                        )}

                        <button
                            className="close-modal-btn"
                            onClick={() => setExpandedBooking(null)}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BookingList;
