import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import FlightList from '../components/FlightList';

describe('FlightList', () => {
  const flights = [
    { id: 1, airline: 'Indigo', flightNumber: 'F123', origin: 'Delhi', destination: 'Kolkata', departureTime: '2027-10-01T10:00:00', arrivalTime: '2027-10-01T13:00:00', price: 2000, availableSeats: 6 },
    { id: 2, airline: 'Air India', flightNumber: 'F321', origin: 'Bangalore', destination: 'Chennai', departureTime: '2027-11-15T12:00:00', arrivalTime: '2027-11-15T14:45:00', price: 2450, availableSeats: 0 },
  ];
  it('renders flights and disables unavailable flight', () => {
    render(<FlightList flights={flights} onBook={() => {}} passengerCount={1} />);
    expect(screen.getByText(/Indigo/)).toBeInTheDocument();
    expect(screen.getByText(/F123/)).toBeInTheDocument();
    expect(screen.getByText(/Air India/)).toBeInTheDocument();
    expect(screen.getByTestId('book-flight-2')).toBeDisabled();
    expect(screen.getByTestId('book-flight-1')).not.toBeDisabled();
    expect(screen.getByText(/Not enough seats/)).toBeInTheDocument();
  });
  it('shows empty message if no flights found', () => {
    render(<FlightList flights={[]} onBook={() => {}} />);
    expect(screen.getByText(/no flights found/i)).toBeInTheDocument();
  });
  it('disables selection when the requested passenger count exceeds availability', () => {
    render(<FlightList flights={flights} onBook={() => {}} passengerCount={7} />);
    expect(screen.getByTestId('book-flight-1')).toBeDisabled();
  });
  it('calls onBook when a flight is selected', () => {
    const onBook = jest.fn();
    render(<FlightList flights={flights} onBook={onBook} />);
    fireEvent.click(screen.getByTestId('book-flight-1'));
    expect(onBook).toHaveBeenCalledWith(1);
  });
  it('shows supplied error', () => {
    render(<FlightList flights={flights} onBook={() => {}} error="Failed" />);
    expect(screen.getByTestId('book-error')).toBeInTheDocument();
  });
});
