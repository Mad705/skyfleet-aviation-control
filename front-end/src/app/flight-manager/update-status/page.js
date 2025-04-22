'use client';

import FlightStatusStepper from '@/components/ui/FlightStatusStepper';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const statusFlow = [
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

export default function UpdateFlightStatusPage() {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

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

  useEffect(() => {
    fetchFlights();
  }, []);

  const updateFlightStatus = async (flightId, newStatus) => {
    try {
      const response = await fetch('http://localhost:5000/api/flights/update-status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          flightId,
          status: newStatus
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update status on server');
      }

      // Update the local state to reflect the change immediately
      setFlights(prevFlights => 
        prevFlights.map(flight => 
          flight.id === flightId 
            ? { ...flight, status: newStatus } 
            : flight
        )
      );

    } catch (error) {
      console.error('Error updating flight status:', error);
      alert(`Failed to update status: ${error.message}`);
    }
  };

  const handleStatusChange = (action, flightId, currentStatus) => {
    let newStatus = currentStatus;
    
    if (action === 'advance') {
      const currentIndex = statusFlow.indexOf(currentStatus);
      newStatus = currentIndex < statusFlow.length - 1 
        ? statusFlow[currentIndex + 1] 
        : currentStatus;
    } else if (action === 'retract') {
      const currentIndex = statusFlow.indexOf(currentStatus);
      newStatus = currentIndex > 0 
        ? statusFlow[currentIndex - 1] 
        : currentStatus;
    } else if (action === 'cancel') {
      newStatus = 'Cancelled';
    }

    updateFlightStatus(flightId, newStatus);
  };

  const confirmAction = (msg, action) => {
    if (confirm(msg)) {
      action();
    }
  };

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

      {/* Main Section */}
      <main className="p-6">
        <h2 className="text-2xl font-semibold mb-4">Update Flight Status</h2>
        
        {flights.length === 0 ? (
          <p className="text-gray-600">No flights available</p>
        ) : (
          <div className="grid gap-6">
            {flights.map((flight) => (
              <div
                key={flight.id}
                className="bg-white p-4 rounded-lg shadow border border-gray-200"
              >
                <h3 className="text-lg font-bold text-blue-800 mb-2">{flight.id}</h3>
                <p className="mb-1">
                  <strong>From:</strong> {flight.src} → <strong>To:</strong> {flight.dest}
                </p>
                <p className="mb-1">
                  <strong>Aircraft:</strong> {flight.aircraft?.name} ({flight.aircraft?.model})
                </p>
                <p className="mb-2">
                  <strong>Current Status:</strong>{' '}
                  <span className={`font-semibold ${
                    flight.status === 'Cancelled'
                      ? 'text-red-600'
                      : flight.status === 'Scheduled'
                      ? 'text-yellow-600'
                      : 'text-green-600'
                  }`}>
                    {flight.status}
                  </span>
                </p>

                <FlightStatusStepper currentStatus={flight.status} />

                {/* Buttons */}
                <div className="flex gap-4 mt-4 flex-wrap">
                  {flight.status === 'Scheduled' && (
                    <button
                      className="bg-red-500 text-white rounded-4xl px-3 py-1 font-medium hover:shadow-inner hover:scale-105 transition"
                      onClick={() =>
                        confirmAction(
                          'Are you sure you want to cancel this flight?',
                          () => handleStatusChange('cancel', flight.id, flight.status)
                        )
                      }
                    >
                      Cancel Flight
                    </button>
                  )}

                  {statusFlow.includes(flight.status) &&
                    !['Completed', 'Cancelled', 'Scheduled'].includes(flight.status) && (
                      <>
                        <button
                          className="border-2 bg-blue-500 rounded-4xl text-white px-3 py-1 font-medium hover:shadow-inner hover:scale-105 transition"
                          onClick={() =>
                            confirmAction(
                              'Confirm advancing this flight to the next operational stage?',
                              () => handleStatusChange('advance', flight.id, flight.status)
                            )
                          }
                        >
                          Advance Status
                        </button>
                        {flight.status !== 'Approved' && (
                          <button
                            className="border-2 bg-gray-500 rounded-4xl text-white px-3 py-1 font-medium hover:shadow-inner hover:scale-105 transition"
                            onClick={() =>
                              confirmAction(
                                'Confirm retracting this flight to the previous stage?',
                                () => handleStatusChange('retract', flight.id, flight.status)
                              )
                            }
                          >
                            Retract Status
                          </button>
                        )}
                      </>
                    )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}