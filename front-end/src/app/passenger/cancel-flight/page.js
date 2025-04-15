'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

const initialBookedFlights = [
  {
    id: 'FL001',
    src: 'JFK',
    dest: 'LAX',
    datetime: '2025-05-01T12:00:00',
    seatNumber: '1A',
    status: 'Booked',
    stage: 'Booked',
  },
  {
    id: 'FL002',
    src: 'ORD',
    dest: 'SFO',
    datetime: '2025-05-02T15:30:00',
    seatNumber: '2A',
    status: 'Booked',
    stage: 'Boarding',
  }
];

const CancelFlightPage = () => {
  const [flights, setFlights] = useState(initialBookedFlights);
  const [isClient, setIsClient] = useState(false); // Track if it's client-side

  useEffect(() => {
    setIsClient(true); // Ensure rendering only happens on client
  }, []);

  const handleCancel = (flightId) => {
    const flight = flights.find(f => f.id === flightId);
    if (!flight || flight.stage === 'Boarding' || flight.stage === 'Departed') {
      alert('This flight cannot be canceled at this stage.');
      return;
    }

    const confirmCancel = window.confirm('Are you sure you want to cancel this flight?');
    if (!confirmCancel) return;

    setFlights(prev => prev.filter(flight => flight.id !== flightId));
  };

  return (
    <div className="min-h-screen bg-gray-100 pt-24">
      <nav className="fixed top-0 left-0 w-full z-50 bg-green-800 text-white px-6 py-4 shadow-md flex justify-between items-center">
        <h1 className="text-xl font-bold">Passenger</h1>
        <div className="space-x-20">
          <Link href="/passenger/dashboard" className="hover:underline">Dashboard</Link>
          <Link href="/passenger/cancel-flight" className="hover:underline">Cancel Flight</Link>
          <Link href="/passenger/track-flight" className="hover:underline">Track Flight</Link>
          <Link href="/passenger/track-baggage" className="hover:underline">Track Baggage</Link>
          <Link href="/passenger/register-baggage" className="hover:underline">Register Baggage</Link>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto p-6">
        <h2 className="text-2xl font-semibold mb-6">Your Booked Flights</h2>

        {flights.length === 0 ? (
          <p className="text-gray-600">You have no booked flights.</p>
        ) : (
          <ul className="space-y-6">
            {flights.map(flight => (
              <li key={flight.id} className="bg-white p-6 rounded-xl shadow flex justify-between items-start">
                <div>
                  <p className="font-semibold">Flight ID: {flight.id}</p>
                  <p>From: {flight.src} → To: {flight.dest}</p>
                  <p>
                    Date & Time:{' '}
                    {isClient
                      ? new Date(flight.datetime).toLocaleString()
                      : 'Loading...'}
                  </p>
                  <p>Seat: {flight.seatNumber}</p>
                  <p>Stage: <span className="font-semibold">{flight.stage}</span></p>
                </div>

                <button
                  onClick={() => handleCancel(flight.id)}
                  className={`px-4 py-2 rounded-lg mt-2 text-white ${
                    flight.stage === 'Boarding' || flight.stage === 'Departed'
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-red-600 hover:bg-red-700'
                  }`}
                  disabled={flight.stage === 'Boarding' || flight.stage === 'Departed'}
                >
                  Cancel Flight
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default CancelFlightPage;
