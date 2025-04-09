'use client';

import React, { useState } from 'react';
import Link from 'next/link';

const flightStatuses = [
  'Scheduled',
  'Approved',
  'Boarding',
  'Ready for Takeoff',
  'Departed',
  'In Air',
  'Landing',
  'Landed',
  'Arrived at Gate',
  'Completed',
];

// Initial static flight data
const initialTrackedFlights = [
  {
    id: 'FL001',
    src: 'JFK',
    dest: 'LAX',
    datetime: '2025-05-01T12:00:00',
    currentStatus: 'In Air',
  },
  {
    id: 'FL002',
    src: 'ORD',
    dest: 'SFO',
    datetime: '2025-05-02T15:30:00',
    currentStatus: 'Boarding',
  }
];

const getStatusIndex = (status) => flightStatuses.indexOf(status);

const TrackFlightPage = () => {
  const [flights, setFlights] = useState(initialTrackedFlights);

  const handleCancel = (flightId) => {
    const confirmCancel = confirm(`Are you sure you want to cancel Flight ${flightId}?`);
    if (confirmCancel) {
      setFlights(prev => prev.filter(flight => flight.id !== flightId));
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 pt-24">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-green-800 text-white px-6 py-4 shadow-md flex justify-between items-center">
        <h1 className="text-xl font-bold">Passenger</h1>
        <div className="space-x-20">
          <Link href="/passenger/dashboard" className="hover:underline">Dashboard</Link>
          <Link href="/passenger/book-flights" className="hover:underline">Book Flight</Link>
          <Link href="/passenger/track-flight" className="underline font-semibold">Track Flight</Link>
          <Link href="/passenger/track-baggage" className="hover:underline">Track baggage</Link>
          <Link href="/passenger/register-baggage" className="hover:underline">Register Baggage</Link>
        </div>
      </nav>

      {/* Content */}
      <div className="max-w-5xl mx-auto p-6">
        <h2 className="text-2xl font-semibold mb-6">Track Your Flights</h2>

        {flights.length === 0 && (
          <p className="text-gray-600">You are not tracking any flights currently.</p>
        )}

        {flights.map(flight => {
          const currentIndex = getStatusIndex(flight.currentStatus);

          return (
            <div key={flight.id} className="bg-white rounded-xl shadow p-6 mb-10">
              <h3 className="text-lg font-semibold mb-2">
                Flight {flight.id} - {flight.src} ➜ {flight.dest}
              </h3>
              <p className="text-gray-600 mb-4">
                Date & Time: {new Date(flight.datetime).toLocaleString()}
              </p>

              <div className="overflow-x-auto mb-6">
                <ol className="flex space-x-6 min-w-max">
                  {flightStatuses.map((status, index) => (
                    <li key={status} className="flex flex-col items-center">
                      <div
                        className={`w-4 h-4 rounded-full mb-1 ${
                          index < currentIndex
                            ? 'bg-green-500'
                            : index === currentIndex
                            ? 'bg-yellow-400'
                            : 'bg-gray-300'
                        }`}
                      ></div>
                      <p
                        className={`text-xs text-center ${
                          index === currentIndex
                            ? 'font-bold text-yellow-700'
                            : index < currentIndex
                            ? 'text-green-700'
                            : 'text-gray-500'
                        }`}
                        style={{ width: '80px' }}
                      >
                        {status}
                      </p>
                    </li>
                  ))}
                </ol>
              </div>

              <button
                onClick={() => handleCancel(flight.id)}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
              >
                Cancel Flight
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TrackFlightPage;
