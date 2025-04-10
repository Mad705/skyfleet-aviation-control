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
    baggageList: [],
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

  const handleBaggageChange = (flightId, field, value) => {
    setNewBaggage(prev => ({
      ...prev,
      [flightId]: {
        ...prev[flightId],
        [field]: value,
      }
    }));
  };

  const handleRegister = (flightId) => {
    const baggage = newBaggage[flightId];
    if (!baggage?.weight || !baggage?.height || !baggage?.width) {
      alert("Please fill in all baggage dimensions (weight, height, width).");
      return;
    }

    const baggageId = `BAG${Math.floor(Math.random() * 10000)}`;
    const newBaggageEntry = {
      id: baggageId,
      owner: 'You', // can be customized
      flight: flightId,
      status: 'Registered',
      ...baggage,
    };

    setFlights(prevFlights =>
      prevFlights.map(flight =>
        flight.id === flightId
          ? { ...flight, baggageList: [...flight.baggageList, newBaggageEntry] }
          : flight
      )
    );

    setNewBaggage(prev => ({ ...prev, [flightId]: { weight: '', height: '', width: '' } }));
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-green-800 text-white px-6 py-4 shadow-md flex justify-between items-center">
        <h1 className="text-xl font-bold">Passenger</h1>
        <div className="space-x-20">
          <Link href="/passenger/dashboard" className="hover:underline">Dashboard</Link>
          <Link href="/passenger/track-flight" className="hover:underline">Track Flight</Link>
          <Link href="/passenger/track-baggage" className="hover:underline">Track baggage</Link>
          <Link href="/passenger/register-baggage" className="underline font-semibold">Register Baggage</Link>
        </div>
      </nav>

      <div className="pt-32 px-6">
        <h2 className="text-2xl font-bold mb-6">Register Baggage</h2>
        {flights.map(flight => (
          <div key={flight.id} className="bg-white p-6 rounded-lg shadow mb-6">
            <h3 className="text-lg font-semibold mb-2">Flight {flight.id} ({flight.src} → {flight.dest})</h3>
            <p className="text-sm text-gray-600 mb-4">
              Aircraft: {flight.aircraft} | Departure: {new Date(flight.datetime).toISOString().replace('T', ' ').slice(0, 16)}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <input
                type="number"
                placeholder="Weight (kg)"
                value={newBaggage[flight.id]?.weight || ''}
                onChange={e => handleBaggageChange(flight.id, 'weight', e.target.value)}
                className="border border-gray-300 rounded px-3 py-2 text-sm"
              />
              <input
                type="number"
                placeholder="Height (cm)"
                value={newBaggage[flight.id]?.height || ''}
                onChange={e => handleBaggageChange(flight.id, 'height', e.target.value)}
                className="border border-gray-300 rounded px-3 py-2 text-sm"
              />
              <input
                type="number"
                placeholder="Width (cm)"
                value={newBaggage[flight.id]?.width || ''}
                onChange={e => handleBaggageChange(flight.id, 'width', e.target.value)}
                className="border border-gray-300 rounded px-3 py-2 text-sm"
              />
            </div>

            <button
              onClick={() => handleRegister(flight.id)}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-sm"
            >
              Register Baggage
            </button>

            {flight.baggageList.length > 0 && (
              <div className="mt-4">
                <h4 className="font-semibold mb-2">Registered Baggage:</h4>
                <ul className="text-sm text-gray-700 list-disc ml-5">
                  {flight.baggageList.map((baggage, idx) => (
                    <li key={idx}>
                      {baggage.id} – {baggage.weight}kg, {baggage.height}cm (H) × {baggage.width}cm (W)
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
