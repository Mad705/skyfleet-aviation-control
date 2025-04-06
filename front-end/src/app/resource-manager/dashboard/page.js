'use client';

import Link from 'next/link';

export default function ResourceManagerDashboard() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-red-800 text-white px-6 py-4 shadow-md flex justify-between items-center">
        <h1 className="text-xl font-bold">Resouce  Manager</h1>
        <div className="space-x-20">
          <Link href="/resource-manager/dashboard" className="hover:underline">
            Dashboard
          </Link>
          <Link href="/resource-manager/create-flight" className="hover:underline">
            Crew availability 
          </Link>
          <Link href="/resource-manager/update-status" className="hover:underline">
            Aircraft maintenance  
          </Link>
          <Link href="/resource-manager/seat-matrix" className="hover:underline">
            Assign Gate and Runway 
          </Link>
        </div>
      </nav>

      {/* Main Dashboard Section */}
      <main className="p-6">
        <h2 className="text-2xl font-semibold mb-4">Resouce Dashboard</h2>
        <div className="bg-white p-4 rounded-lg shadow">
          {/* Placeholder flight list */}
          <p>List of gates and runways will be shown here.</p>
        </div>
      </main>
    </div>
  );
}

