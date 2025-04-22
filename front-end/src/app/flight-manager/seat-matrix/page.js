'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function SeatMatrixPage() {
  const [flights, setFlights] = useState([]);
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSeatMatrixData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/flights/seat-matrix');
        if (!response.ok) {
          throw new Error('Failed to fetch seat matrix data');
        }
        const data = await response.json();
        setFlights(data || []);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching seat matrix:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSeatMatrixData();
  }, []);

  const handleSelectFlight = (flightId) => {
    const flight = flights.find(f => f.id === flightId);
    setSelectedFlight(flight || null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p>Loading seat matrix data...</p>
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

      <main className="p-6">
        <h2 className="text-2xl font-semibold mb-4">Seat Matrix Viewer</h2>

        {/* Flight Selector */}
        <div className="mb-6">
          <label className="mr-4 text-lg font-medium">Select Flight:</label>
          <select
            onChange={(e) => handleSelectFlight(e.target.value)}
            className="border px-3 py-1 rounded shadow-sm"
          >
            <option value="">-- Choose --</option>
            {flights.map((flight) => (
              <option key={flight.id} value={flight.id}>{flight.id}</option>
            ))}
          </select>
        </div>

        {/* Seat Matrix Display */}
        {selectedFlight && (
          <>
            <div className="bg-white rounded-xl shadow-md p-4 mb-6 border border-gray-200">
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4 text-sm text-gray-700">
                <div>
                  <p className="text-gray-500 font-medium">Flight ID</p>
                  <p className="text-blue-900 font-semibold">{selectedFlight.id}</p>
                </div>
                <div>
                  <p className="text-gray-500 font-medium">Status</p>
                  <p className="font-semibold text-green-700">{selectedFlight.status}</p>
                </div>
                <div>
                  <p className="text-gray-500 font-medium">Aircraft</p>
                  <p className="font-semibold">{selectedFlight.aircraft.name} ({selectedFlight.aircraft.model})</p>
                </div>
                <div>
                  <p className="text-gray-500 font-medium">Timings</p>
                  <p className="font-semibold">{selectedFlight.datetime}</p>
                </div>
                <div className="pt-2 text-sm text-gray-700 flex justify-between">
                  <p className="font-medium">
                    Route: <span className="text-blue-800 font-semibold">{selectedFlight.src} ➝ {selectedFlight.dest}</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              {selectedFlight.seatMatrix.map((row, rowIdx) => (
                <div key={rowIdx} className="flex justify-center gap-6">
                  {/* Left side: seats 0–2 */}
                  <div className="flex gap-2">
                    {row.slice(0, 3).map((seat) => (
                      <div key={seat.seatNumber} className="bg-blue-200 p-2 border rounded-4xl w-25 h-20 shadow-xl text-sm w-20 text-center">
                        <div className="font-semibold">{seat.seatNumber}</div>
                        <div className="text-xs font-medium text-blue-800">
                          ₹{seat.price}
                        </div>
                        <div className="text-xs text-gray-600 truncate">
                          {seat.passenger ? (
                            <>
                              <div>{seat.passenger.id}</div>
                              {seat.passenger.name && (
                                <div className="font-medium">{seat.passenger.name}</div>
                              )}
                            </>
                          ) : 'Empty'}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Aisle */}
                  <div className="w-4" />

                  {/* Right side: seats 3–5 */}
                  <div className="flex gap-2">
                    {row.slice(3, 6).map((seat) => (
                      <div key={seat.seatNumber} className="bg-blue-200 p-2 border rounded-4xl w-25 h-20 shadow-xl text-sm w-20 text-center">
                        <div className="font-semibold">{seat.seatNumber}</div>
                        <div className="text-xs font-medium text-blue-800">
                          ₹{seat.price}
                        </div>
                        <div className="text-xs text-gray-600 truncate">
                          {seat.passenger ? (
                            <>
                              <div>{seat.passenger.id}</div>
                              {seat.passenger.name && (
                                <div className="font-medium">{seat.passenger.name}</div>
                              )}
                            </>
                          ) : 'Empty'}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}