'use client';

import React, { useState } from 'react';
import Link from 'next/link';

const flightsData = [
  {
    id: 'FL001',
    src: 'JFK',
    dest: 'LAX',
    datetime: '2025-05-01T12:00:00',
    aircraft: 'Boeing 747',
    seatMatrix: [
      { seatNumber: '1A', passenger: 'John Doe' },
      { seatNumber: '1B', passenger: null },
      { seatNumber: '1C', passenger: 'Jane Smith' },
      { seatNumber: '1D', passenger: null },
      { seatNumber: '1E', passenger: null },
      { seatNumber: '1F', passenger: null }
    ]
  },
  {
    id: 'FL002',
    src: 'ORD',
    dest: 'SFO',
    datetime: '2025-05-02T15:30:00',
    aircraft: 'Airbus A320',
    seatMatrix: [
      { seatNumber: '2A', passenger: 'Alice Johnson' },
      { seatNumber: '2B', passenger: null },
      { seatNumber: '2C', passenger: null },
      { seatNumber: '2D', passenger: null },
      { seatNumber: '2E', passenger: null },
      { seatNumber: '2F', passenger: 'Bob Ross' }
    ]
  },
  {
    id: 'FL003',
    src: 'DEL',
    dest: 'DXB',
    datetime: '2025-05-04T10:00:00',
    aircraft: 'Boeing 777',
    seatMatrix: [
      { seatNumber: '3A', passenger: null },
      { seatNumber: '3B', passenger: null },
      { seatNumber: '3C', passenger: 'Tony Stark' },
      { seatNumber: '3D', passenger: null },
      { seatNumber: '3E', passenger: 'Bruce Wayne' },
      { seatNumber: '3F', passenger: null }
    ]
  }
];

export default function BookFlightsPage() {
  const [selectedFlightId, setSelectedFlightId] = useState(null);
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  const handleConfirmBooking = () => {
    setBookingConfirmed(true);
  };

  const renderSeatLayout = (seatMatrix) => {
    const rows = {};
    seatMatrix.forEach((seat) => {
      const rowNumber = seat.seatNumber.slice(0, -1);
      const column = seat.seatNumber.slice(-1);
      if (!rows[rowNumber]) rows[rowNumber] = {};
      rows[rowNumber][column] = seat.passenger;
    });

    const seatCols = ['A', 'B', 'C', 'D', 'E', 'F'];

    return (
      <div className="mt-4 space-y-2">
        {Object.keys(rows).map((rowNum) => (
          <div key={rowNum} className="flex justify-center space-x-4">
            {seatCols.map((col) => {
              const seatKey = `${rowNum}${col}`;
              const occupied = rows[rowNum][col];
              const isSelected = selectedSeat === seatKey;

              return (
                <button
                  key={seatKey}
                  onClick={() => {
                    if (!occupied) {
                      setSelectedSeat(seatKey);
                      setBookingConfirmed(false);
                    }
                  }}
                  className={`w-10 h-10 rounded font-semibold text-sm flex items-center justify-center ${
                    occupied
                      ? 'bg-red-500 text-white cursor-not-allowed'
                      : isSelected
                      ? 'bg-blue-600 text-white'
                      : 'bg-green-500 text-white'
                  }`}
                  disabled={!!occupied}
                >
                  {seatKey}
                </button>
              );
            })}
          </div>
        ))}
        <p className="mt-4 text-sm text-gray-500 text-center">
          🟥 Occupied &nbsp;&nbsp;&nbsp; 🟩 Available &nbsp;&nbsp;&nbsp; 🟦 Selected
        </p>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-green-800 text-white px-6 py-4 shadow-md flex justify-between items-center">
        <h1 className="text-xl font-bold">Passenger</h1>
        <div className="space-x-20">
          <Link href="/passenger/dashboard" className="hover:underline">Dashboard</Link>
          <Link href="/passenger/book-flights" className="hover:underline">Book Flight</Link>
          <Link href="/passenger/track-flight" className="hover:underline">Track Flight</Link>
          <Link href="/passenger/track-baggage" className="hover:underline">Track Baggage</Link>
          <Link href="/passenger/register-baggage" className="hover:underline">Register Baggage</Link>
        </div>
      </nav>

      {/* Content */}
      <div className="pt-20 px-6">
        <h1 className="text-2xl font-semibold mb-4">Available Flights</h1>
        {flightsData.map((flight) => (
          <div
            key={flight.id}
            className="bg-white shadow p-4 mb-6 rounded border border-gray-300"
          >
            <h2 className="text-xl font-bold mb-2">Flight {flight.id}</h2>
            <p><strong>From:</strong> {flight.src} <strong>To:</strong> {flight.dest}</p>
            <p><strong>Date & Time:</strong> {new Date(flight.datetime).toLocaleString()}</p>
            <p><strong>Aircraft:</strong> {flight.aircraft}</p>

            <button
              onClick={() => {
                setSelectedFlightId(flight.id);
                setSelectedSeat(null);
                setBookingConfirmed(false);
              }}
              className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
            >
              Book This Flight
            </button>

            {selectedFlightId === flight.id && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-2">Seat Layout</h3>
                {renderSeatLayout(flight.seatMatrix)}

                {selectedSeat && !bookingConfirmed && (
                  <div className="mt-6 text-center">
                    <p className="mb-2">Selected Seat: <strong>{selectedSeat}</strong></p>
                    <button
                      onClick={handleConfirmBooking}
                      className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                    >
                      Confirm Booking
                    </button>
                  </div>
                )}

                {bookingConfirmed && (
                  <p className="mt-4 text-green-700 font-semibold text-center">
                    ✅ Booking confirmed for seat <strong>{selectedSeat}</strong>!
                  </p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
