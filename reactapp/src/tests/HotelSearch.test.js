import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import HotelSearch from '../components/HotelSearch';

describe('HotelSearch', () => {
  it('renders hotel discovery filters without stay dates, rooms or guests', () => {
    render(<HotelSearch onSearch={jest.fn()} loading={false} />);
    expect(screen.getByLabelText(/Hotel name or location/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Minimum rating/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Maximum price per night/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Wi-Fi/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Breakfast included/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Swimming pool/i)).toBeInTheDocument();
    expect(screen.queryByLabelText(/Check-in/i)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/Rooms/i)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/Guests/i)).not.toBeInTheDocument();
  });

  it('allows searching without entering a location', () => {
    const onSearch = jest.fn();
    render(<HotelSearch onSearch={onSearch} loading={false} />);
    fireEvent.click(screen.getByTestId('search-hotel-btn'));
    expect(onSearch).toHaveBeenCalledWith('', null, null, {
      wifi: false, breakfast: false, pool: false, gym: false, nearMainAreas: false
    });
  });

  it('rejects a non-positive maximum price', () => {
    render(<HotelSearch onSearch={jest.fn()} loading={false} />);
    fireEvent.change(screen.getByTestId('max-price-input'), { target: { value: '0' } });
    fireEvent.click(screen.getByTestId('search-hotel-btn'));
    expect(screen.getByText(/greater than zero/i)).toBeInTheDocument();
  });

  it('passes hotel search and amenity filters', () => {
    const onSearch = jest.fn();
    render(<HotelSearch onSearch={onSearch} loading={false} defaultLocation="Delhi" />);
    fireEvent.change(screen.getByLabelText(/Minimum rating/i), { target: { value: '4' } });
    fireEvent.change(screen.getByTestId('max-price-input'), { target: { value: '4500' } });
    fireEvent.click(screen.getByLabelText(/Wi-Fi/i));
    fireEvent.click(screen.getByLabelText(/Swimming pool/i));
    fireEvent.click(screen.getByTestId('search-hotel-btn'));
    expect(onSearch).toHaveBeenCalledWith('Delhi', 4, 4500, {
      wifi: true, breakfast: false, pool: true, gym: false, nearMainAreas: false
    });
  });
});
