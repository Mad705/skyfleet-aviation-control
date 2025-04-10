'use client';

import Link from 'next/link';

// Sample static flight data
const flightsData = [
  {
    id: 'FL001',
    src: 'JFK',
    dest: 'LAX',
    datetime: '2025-05-01T12:00:00',
    aircraft: 'Boeing 747',
    status: 'On Time',
  },
  {
    id: 'FL002',
    src: 'ORD',
    dest: 'SFO',
    datetime: '2025-05-02T15:30:00',
    aircraft: 'Airbus A320',
    status: 'Delayed',
  },
  {
    id: 'FL003',
    src: 'ATL',
    dest: 'MIA',
    datetime: '2025-05-03T10:00:00',
    aircraft: 'Boeing 777',
    status: 'On Time',
  },
];

export default function PassengerManagerDashboard() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-green-800 text-white px-6 py-4 shadow-md flex justify-between items-center">
        <h1 className="text-xl font-bold">Passenger</h1>
        <div className="space-x-20">
          <Link href="/passenger/dashboard" className="hover:underline">Dashboard</Link>
          <Link href="/passenger/track-flight" className="hover:underline">Track Flight</Link>
          <Link href="/passenger/track-baggage" className="hover:underline">Track baggage</Link>
          <Link href="/passenger/register-baggage" className="hover:underline">Register Baggage</Link>
        </div>
      </nav>

      {/* Main Dashboard Section */}
      <main className="p-6">
        <h2 className="text-2xl font-semibold mb-4">Passenger Dashboard</h2>
        {flightsData.map((flight) => (
          <div key={flight.id} className="bg-white p-4 rounded-lg shadow mb-6">
            <h3 className="text-lg font-semibold">Flight {flight.id}</h3>
            <p><strong>From:</strong> {flight.src} <strong>To:</strong> {flight.dest}</p>
            <p><strong>Aircraft:</strong> {flight.aircraft}</p>
            <p><strong>Date & Time:</strong> {new Date(flight.datetime).toLocaleString()}</p>
            <p><strong>Status:</strong> {flight.status}</p>

            <Link
              href={`/passenger/seat-matrix/${flight.id}`}
              className="mt-4 inline-block px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
            >
              Book This Flight
            </Link>
          </div>
        ))}
      </main>
    </div>
  );
}
