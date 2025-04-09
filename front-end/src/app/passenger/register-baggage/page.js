'use client';

import React, { useState } from 'react';
import Link from 'next/link';

const bookedFlights = [
  {
    id: 'FL001',
    src: 'JFK',
    dest: 'LAX',
    datetime: '2025-05-01T12:00:00',
    aircraft: 'Boeing 747',
    baggageList: ['BAG001', 'BAG002'],
  },
  {
    id: 'FL002',
    src: 'ORD',
    dest: 'SFO',
    datetime: '2025-05-02T15:30:00',
    aircraft: 'Airbus A320',
    baggageList: [],
  }
];

export default function RegisterBaggagePage() {
  const [flights, setFlights] = useState(bookedFlights);
  const [newBaggage, setNewBaggage] = useState({});

  const handleBaggageChange = (flightId, value) => {
    setNewBaggage(prev => ({ ...prev, [flightId]: value }));
  };

  const handleRegister = (flightId) => {
    const baggageId = newBaggage[flightId]?.trim();
    if (!baggageId) return;

    setFlights(prevFlights =>
      prevFlights.map(flight =>
        flight.id === flightId
          ? { ...flight, baggageList: [...flight.baggageList, baggageId] }
          : flight
      )
    );

    setNewBaggage(prev => ({ ...prev, [flightId]: '' }));
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
      <Link href="/passenger/track-baggage" className="hover:underline">Track baggage</Link>
      <Link href="/passenger/register-baggage" className="hover:underline">Register Baggage</Link>
    </div>
    </nav>

      <div className="pt-32 px-6">
        <h2 className="text-2xl font-bold mb-6">Register Baggage</h2>
        {flights.map(flight => (
          <div
            key={flight.id}
            className="bg-white p-4 rounded-lg shadow mb-6"
          >
            <h3 className="text-lg font-semibold mb-2">Flight {flight.id} ({flight.src} → {flight.dest})</h3>
            <p className="text-sm text-gray-600 mb-2">
              Aircraft: {flight.aircraft} | Departure: {new Date(flight.datetime).toISOString().replace('T', ' ').slice(0, 16)}

            </p>
            

            <div className="flex items-center gap-2 mt-2">
              <input
                type="text"
                placeholder="Enter weight (kg)"
                value={newBaggage[flight.id] || ''}
                onChange={e => handleBaggageChange(flight.id, e.target.value)}
                className="border border-gray-300 rounded px-3 py-1 text-sm w-60"
              />
              <button
                onClick={() => handleRegister(flight.id)}
                className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700 text-sm"
              >
                Register Baggage
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
