'use client';

import Link from 'next/link';

export default function PassengerManagerDashboard() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-green-800 text-white px-6 py-4 shadow-md flex justify-between items-center">
        <h1 className="text-xl font-bold">Passenger</h1>
        <div className="space-x-20">
          <Link href="/resource-manager/dashboard" className="hover:underline">
            Dashboard
          </Link>
          <Link href="/resource-manager/create-flight" className="hover:underline">
            Book Flight
          </Link>
          <Link href="/resource-manager/update-status" className="hover:underline">
            Track baggage
          </Link>
          <Link href="/resource-manager/seat-matrix" className="hover:underline">
            Track Flight
          </Link>
        </div>
      </nav>

      {/* Main Dashboard Section */}
      <main className="p-6">
        <h2 className="text-2xl font-semibold mb-4">Passenger Dashboard</h2>
        <div className="bg-white p-4 rounded-lg shadow">
          {/* Placeholder flight list */}
          <p>List of flights will be shown here.</p>
        </div>
      </main>
    </div>
  );
}

