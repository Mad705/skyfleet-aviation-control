'use client';

import { useState } from 'react';
import Link from 'next/link';

const dummyFlights = [
  {
    id: 'BLR-MUM-20250408T1345-B737Max',
    src: 'BLR',
    dest: 'MUM',
    datetime: '2025-04-08T13:45',
    aircraft: { name: 'Boeing 737 Max', model: 'B737' },
    status: 'Approved',
    seatMatrix: [
      [ // Row A
        { seatNumber: 'A1', passenger: null },
        { seatNumber: 'A2', passenger: { id: 'PAX-1106' } },
        { seatNumber: 'A3', passenger: null },
        { seatNumber: 'A4', passenger: { id: 'PAX-5678' } },
        { seatNumber: 'A5', passenger: null },
        { seatNumber: 'A6', passenger: { id: 'PAX-1234' } },
      ],
      [ // Row B
        { seatNumber: 'B1', passenger: { id: 'PAX-9999' } },
        { seatNumber: 'B2', passenger: null },
        { seatNumber: 'B3', passenger: { id: 'PAX-3333' } },
        { seatNumber: 'B4', passenger: null },
        { seatNumber: 'B5', passenger: { id: 'PAX-4444' } },
        { seatNumber: 'B6', passenger: null },
      ],
      [ // Row C
        { seatNumber: 'C1', passenger: null },
        { seatNumber: 'C2', passenger: null },
        { seatNumber: 'C3', passenger: null },
        { seatNumber: 'C4', passenger: { id: 'PAX-2222' } },
        { seatNumber: 'C5', passenger: null },
        { seatNumber: 'C6', passenger: null },
      ],
      [ // Row C
        { seatNumber: 'D1', passenger: null },
        { seatNumber: 'D2', passenger: null },
        { seatNumber: 'D3', passenger: null },
        { seatNumber: 'D4', passenger: { id: 'PAX-2222' } },
        { seatNumber: 'D5', passenger: null },
        { seatNumber: 'D6', passenger: null },
      ],
      [ // Row C
        { seatNumber: 'E1', passenger: null },
        { seatNumber: 'E2', passenger: null },
        { seatNumber: 'E3', passenger: null },
        { seatNumber: 'E4', passenger: { id: 'PAX-2222' } },
        { seatNumber: 'E5', passenger: null },
        { seatNumber: 'E6', passenger: null },
      ],
      [ // Row C
        { seatNumber: 'F1', passenger: null },
        { seatNumber: 'F2', passenger: null },
        { seatNumber: 'F3', passenger: null },
        { seatNumber: 'F4', passenger: { id: 'PAX-2222' } },
        { seatNumber: 'F5', passenger: null },
        { seatNumber: 'F6', passenger: null },
      ],
    ]
  }
];

export default function SeatMatrixPage() {
  const [selectedFlight, setSelectedFlight] = useState(null);

  const handleSelectFlight = (flightId) => {
    const flight = dummyFlights.find(f => f.id === flightId);
    setSelectedFlight(flight || null);
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
            {dummyFlights.map((flight) => (
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
    <div className=" pt-2 text-sm text-gray-700 flex justify-between">
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
                      <div key={seat.seatNumber} className="bg-blue-200 p-2 border rounded-4xl w-25 h-16 shadow-xl text-sm w-20 text-center">
                        <div className="font-semibold">{seat.seatNumber}</div>
                        <div className="text-xs text-gray-600">
                          {seat.passenger ? seat.passenger.id : 'Empty'}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Aisle */}
                  <div className="w-4" />

                  {/* Right side: seats 3–5 */}
                  <div className="flex gap-2">
                    {row.slice(3, 6).map((seat) => (
                      <div key={seat.seatNumber} className="bg-blue-200 p-2 border rounded-4xl w-25 h-16 shadow-xl text-sm w-20 text-center">
                        <div className="font-semibold">{seat.seatNumber}</div>
                        <div className="text-xs text-gray-600">
                          {seat.passenger ? seat.passenger.id : 'Empty'}
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
