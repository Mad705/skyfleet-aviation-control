'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function FlightManagerDashboard() {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFlights = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/dashboard/flights');
        if (!response.ok) {
          throw new Error('Failed to fetch flights');
        }
        const data = await response.json();
        setFlights(data.flights || []);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching flights:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFlights();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p>Loading flights...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  const formatFlightDateTime = (datetime) => {
    try {
      const formattedDate = new Intl.DateTimeFormat('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      }).format(new Date(datetime));
      return formattedDate;
    } catch (e) {
      console.error('Error formatting date:', e);
      return datetime; // Return original if formatting fails
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-blue-900 text-white px-6 py-4 shadow-md flex justify-between items-center">
        <h1 className="text-xl font-bold">Flight Manager</h1>
        <div className="space-x-20">
          <Link href="/flight-manager/dashboard" className="hover:underline">
            Dashboard
          </Link>
          <Link href="/flight-manager/create-flight" className="hover:underline">
            Create Flight
          </Link>
          <Link href="/flight-manager/update-status" className="hover:underline">
            Update Status
          </Link>
          <Link href="/flight-manager/seat-matrix" className="hover:underline">
            Seat Matrix
          </Link>
        </div>
      </nav>

      {/* Main Dashboard Section */}
      <main className="p-6">
        <h2 className="text-2xl font-semibold mb-4">Flight Dashboard</h2>
        
        {flights.length === 0 ? (
          <p className="text-gray-600">No flights available</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {flights.map((flight) => (
              <div
                key={flight.id}
                className="bg-white p-4 rounded-lg shadow-md border border-gray-200"
              >
                <h3 className="text-lg font-bold text-blue-800">{flight.id}</h3>
                <p>
                  <strong>From:</strong> {flight.src} → <strong>To:</strong> {flight.dest}
                </p>
                <p>
                  <strong>Date & Time:</strong> {formatFlightDateTime(flight.datetime)}
                </p>
                <p>
                  <strong>Aircraft:</strong> {flight.aircraft?.name} ({flight.aircraft?.model}) - {flight.aircraft?.capacity} seats
                </p>
                <p>
                  <strong>Gate:</strong> {flight.gate} | <strong>Runway:</strong> {flight.runway}
                </p>
                <p>
                  <strong>Status:</strong>{' '}
                  <span
                    className={`font-semibold ${
                      flight.status === 'Delayed' || flight.status === 'Cancelled'
                        ? 'text-red-600'
                        : flight.status === 'Boarding' || flight.status === 'Scheduled'
                        ? 'text-yellow-600'
                        : 'text-green-600'
                    }`}
                  >
                    {flight.status}
                  </span>
                </p>
                
                {flight.crew && (
                  <>
                    <p className="mt-2">
                      <strong>Pilot:</strong> {flight.crew.pilot || 'Not assigned'}, <strong>Copilot:</strong> {flight.crew.copilot || 'Not assigned'}
                    </p>
                    <p>
                      <strong>Attendants:</strong>{' '}
                      {Array.isArray(flight.crew.attendants) 
                        ? flight.crew.attendants.join(', ') 
                        : 'Not assigned'}
                    </p>
                    <p>
                      <strong>Ground Staff:</strong>{' '}
                      {Array.isArray(flight.crew.groundStaff) 
                        ? flight.crew.groundStaff.join(', ') 
                        : 'Not assigned'}
                    </p>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}