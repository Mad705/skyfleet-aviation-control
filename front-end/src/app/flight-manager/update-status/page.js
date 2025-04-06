'use client';

import FlightStatusStepper from '@/components/ui/FlightStatusStepper';
import Link from 'next/link';
import { useState } from 'react';

const dummyFlights = [

  {
    id: 'BLR-MUM-20250408T1345-B737Max',
    src: 'BLR',
    dest: 'MUM',
    datetime: '2025-04-08T13:45',
    aircraft: { name: 'Boeing 737 Max', model: 'B737' },
    status: 'Approved',
  },
  {
    id: 'BLR-DEL-20250407T0930-A320Neo',
    src: 'BLR',
    dest: 'DEL',
    datetime: '2025-04-07T09:30',
    aircraft: { name: 'Airbus A320Neo', model: 'A320' },
    status: 'Scheduled',
  },
  {
    id: 'BLR-HYD-20250409T0600-ATR72600',
    src: 'BLR',
    dest: 'HYD',
    datetime: '2025-04-09T06:00',
    aircraft: { name: 'ATR 72-600', model: 'ATR 72' },
    status: 'Boarding',
  }
  
];

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
  const [flights, setFlights] = useState(dummyFlights);

  const advanceStatus = (id) => {
    setFlights((prev) =>
      prev.map((flight) => {
        if (flight.id !== id) return flight;
        const currentIndex = statusFlow.indexOf(flight.status);
        const nextStatus =
          currentIndex < statusFlow.length - 1
            ? statusFlow[currentIndex + 1]
            : flight.status;
        return { ...flight, status: nextStatus };
      })
    );
  };

  const markDelayed = (id) => {
    setFlights((prev) =>
      prev.map((flight) =>
        flight.id === id ? { ...flight, status: 'Delayed' } : flight
      )
    );
  };

  const cancelFlight = (id) => {
    setFlights((prev) =>
      prev.map((flight) =>
        flight.id === id ? { ...flight, status: 'Cancelled' } : flight
      )
    );
  };

  const confirmAction = (msg, action) => {
    if (confirm(msg)) {
      action();
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

      {/* Main Section */}
      <main className="p-6">
        <h2 className="text-2xl font-semibold mb-4">Update Flight Status</h2>
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
                <strong>Aircraft:</strong> {flight.aircraft.name} ({flight.aircraft.model})
              </p>
              <p className="mb-2">
                <strong>Current Status:</strong>{' '}
                <span className="font-semibold text-blue-700">{flight.status}</span>
              </p>

              <FlightStatusStepper currentStatus={flight.status} />

              {/* Buttons */}
              <div className="flex gap-4 mt-4 flex-wrap">
                {flight.status === 'Scheduled' && (
                  <>
                    <button
                      className="border-2 bg-red-700 text-white rounded-4xl px-3 py-1 font-medium hover:shadow-inner hover:scale-105 transition"
                      onClick={() =>
                        confirmAction(
                          'Are you sure you want to mark this flight as Delayed?',
                          () => markDelayed(flight.id)
                        )
                      }
                    >
                      Mark as Delayed
                    </button>
                    <button
                      className="border-2 bg-red-700 text-white rounded-4xl px-3 py-1 font-medium hover:shadow-inner hover:scale-105 transition"
                      onClick={() =>
                        confirmAction(
                          'Are you sure you want to cancel this flight?',
                          () => cancelFlight(flight.id)
                        )
                      }
                    >
                      Cancel Flight
                    </button>
                  </>
                )}

                {statusFlow.includes(flight.status) &&
                  !['Completed', 'Cancelled', 'Delayed', 'Scheduled'].includes(flight.status) && (
                    <button
                      className="border-2  bg-green-700 rounded-4xl text-white px-3 py-1 font-medium hover:shadow-inner hover:scale-105 transition"
                      onClick={() =>
                        confirmAction(
                          'Confirm advancing this flight to the next operational stage?',
                          () => advanceStatus(flight.id)
                        )
                      }
                    >
                      Advance Flight Status
                    </button>
                  )}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
