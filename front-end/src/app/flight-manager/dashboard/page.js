'use client';

import Link from 'next/link';

export default function FlightManagerDashboard() {
  const dummyFlights = [
    {
      id: 'BLR-DEL-20250407T0930-A320Neo',
      src: 'BLR',
      dest: 'DEL',
      datetime: '2025-04-07T09:30',
      aircraft: {
        id: 'AC001',
        name: 'Airbus A320Neo',
        model: 'A320',
        capacity: 180,
      },
      crew: {
        pilot: 'Capt. Anil Mehta',
        copilot: 'First Officer Riya Sharma',
        attendants: ['Aman Gupta', 'Sneha Roy', 'Farhan Qureshi'],
        groundStaff: ['Ravi Nair', 'Divya Kapoor'],
      },
      gate: 'G5',
      runway: 'R3',
      status: 'Scheduled',
    },
    {
      id: 'BLR-MUM-20250408T1345-B737Max',
      src: 'BLR',
      dest: 'MUM',
      datetime: '2025-04-08T13:45',
      aircraft: {
        id: 'AC002',
        name: 'Boeing 737 Max',
        model: 'B737',
        capacity: 190,
      },
      crew: {
        pilot: 'Capt. Vikram Singh',
        copilot: 'First Officer Nisha Patel',
        attendants: ['Kunal Rao', 'Meera Nair', 'Zoya Khan'],
        groundStaff: ['Ankit Jain', 'Pooja Sinha'],
      },
      gate: 'G2',
      runway: 'R1',
      status: 'Boarding',
    },
    {
      id: 'BLR-HYD-20250409T0600-ATR72600',
      src: 'BLR',
      dest: 'HYD',
      datetime: '2025-04-09T06:00',
      aircraft: {
        id: 'AC003',
        name: 'ATR 72-600',
        model: 'ATR 72',
        capacity: 70,
      },
      crew: {
        pilot: 'Capt. Aarav Reddy',
        copilot: 'First Officer Priya Nambiar',
        attendants: ['Siddharth Joshi', 'Ritika Das'],
        groundStaff: ['Manoj Kumar'],
      },
      gate: 'G3',
      runway: 'R2',
      status: 'Delayed',
    },
  ];

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
        <div className="grid grid-cols-2 gap-4">
          {dummyFlights.map((flight) => (
            <div
              key={flight.id}
              className="bg-white p-4 rounded-lg shadow-md border border-gray-200"
            >
              <h3 className="text-lg font-bold text-blue-800">{flight.id}</h3>
              <p>
                <strong>From:</strong> {flight.src} → <strong>To:</strong> {flight.dest}
              </p>
              {(() => {
  const formattedDate = new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(new Date(flight.datetime));

  return (
    <p>
      <strong>Date & Time:</strong> {formattedDate}
    </p>
  );
})()}      <p>
                <strong>Aircraft:</strong> {flight.aircraft.name} ({flight.aircraft.model}) - {flight.aircraft.capacity} seats
              </p>
              <p>
                <strong>Gate:</strong> {flight.gate} | <strong>Runway:</strong> {flight.runway}
              </p>
              <p>
                <strong>Status:</strong>{' '}
                <span
                  className={`font-semibold ${
                    flight.status === 'Delayed'
                      ? 'text-red-600'
                      : flight.status === 'Boarding'
                      ? 'text-yellow-600'
                      : 'text-green-600'
                  }`}
                >
                  {flight.status}
                </span>
              </p>
              <p className="mt-2">
                <strong>Pilot:</strong> {flight.crew.pilot}, <strong>Copilot:</strong> {flight.crew.copilot}
              </p>
              <p>
                <strong>Attendants:</strong> {flight.crew.attendants.join(', ')}
              </p>
              <p>
                <strong>Ground Staff:</strong> {flight.crew.groundStaff.join(', ')}
              </p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
