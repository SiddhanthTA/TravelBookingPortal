import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import FlightSearch from '../components/FlightSearch';

describe('FlightSearch', () => {
  it('renders origin, optional destination and optional date fields without passenger count', () => {
    render(<FlightSearch onSearch={jest.fn()} loading={false} />);
    expect(screen.getByLabelText(/From/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/To \(optional\)/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Departure date \(optional\)/i)).toBeInTheDocument();
    expect(screen.queryByLabelText(/Travelers/i)).not.toBeInTheDocument();
  });

  it('requires a valid origin and does not search when origin is blank', () => {
    const onSearch = jest.fn();
    render(<FlightSearch onSearch={onSearch} loading={false} />);
    fireEvent.click(screen.getByTestId('search-button'));
    expect(screen.getByText(/Choose a departure city/i)).toBeInTheDocument();
    expect(onSearch).not.toHaveBeenCalled();
  });

  it('searches all flights from origin when destination and date are omitted', () => {
    const onSearch = jest.fn();
    render(<FlightSearch onSearch={onSearch} loading={false} />);
    fireEvent.change(screen.getByTestId('origin-input'), { target: { value: 'Delhi' } });
    fireEvent.click(screen.getByTestId('search-button'));
    expect(onSearch).toHaveBeenCalledWith('Delhi', '', '');
  });

  it('rejects a destination that is the same as the origin', () => {
    const onSearch = jest.fn();
    render(<FlightSearch onSearch={onSearch} loading={false} />);
    fireEvent.change(screen.getByTestId('origin-input'), { target: { value: 'Delhi' } });
    fireEvent.change(screen.getByTestId('destination-input'), { target: { value: 'Delhi' } });
    fireEvent.click(screen.getByTestId('search-button'));
    expect(screen.getByText(/must be different/i)).toBeInTheDocument();
    expect(onSearch).not.toHaveBeenCalled();
  });

  it('rejects invalid city text instead of accepting misspellings', () => {
    const onSearch = jest.fn();
    render(<FlightSearch onSearch={onSearch} loading={false} />);
    fireEvent.change(screen.getByTestId('origin-input'), { target: { value: 'Delhii' } });
    fireEvent.click(screen.getByTestId('search-button'));
    expect(screen.getByText(/Choose a departure city/i)).toBeInTheDocument();
    expect(onSearch).not.toHaveBeenCalled();
  });

  it('passes the selected route and optional date to search', () => {
    const onSearch = jest.fn();
    render(<FlightSearch onSearch={onSearch} loading={false} />);
    fireEvent.change(screen.getByTestId('origin-input'), { target: { value: 'Delhi' } });
    fireEvent.change(screen.getByTestId('destination-input'), { target: { value: 'Mumbai' } });
    fireEvent.change(screen.getByTestId('date-input'), { target: { value: '2050-01-26' } });
    fireEvent.click(screen.getByTestId('search-button'));
    expect(onSearch).toHaveBeenCalledWith('Delhi', 'Mumbai', '2050-01-26');
  });
});
