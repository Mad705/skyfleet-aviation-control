'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function ResourceManagerAircraftMaintenance() {
  const [aircrafts, setAircrafts] = useState([]);

  // Fetch aircraft data from a JSON file
  useEffect(() => {
    fetch('/aircraftDetails.json')
      .then((response) => response.json())
      .then((data) => setAircrafts(data.aircrafts))
      .catch((error) => console.error('Error fetching aircraft details:', error));
  }, []);

  // Function to toggle status between "Operational" and "Under Maintenance"
  const toggleStatus = (id) => {
    setAircrafts((prevAircrafts) =>
      prevAircrafts.map((aircraft) =>
        aircraft.id === id
          ? {
              ...aircraft,
              status: aircraft.status === "Operational" ? "Under Maintenance" : "Operational",
            }
          : aircraft
      )
    );
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-red-800 text-white px-6 py-4 shadow-md flex justify-between items-center">
        <h1 className="text-xl font-bold">Resource Manager</h1>
        <div className="space-x-20">
          <Link href="/resource-manager/dashboard" className="hover:underline">
            Dashboard
          </Link>
          <Link href="/resource-manager/crew-availability" className="hover:underline">
            Crew availability
          </Link>
          <Link href="/resource-manager/Aircraft-maintenance" className="hover:underline">
            Aircraft maintenance
          </Link>
          <Link href="/resource-manager/Assign-Gate-Runway" className="hover:underline">
            Assign Gate and Runway
          </Link>
        </div>
      </nav>

      {/* Main Section */}
      <main className="p-6">
        <h2 className="text-2xl font-semibold mb-4">Aircraft Maintenance</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {aircrafts.map((aircraft) => (
            <div
              key={aircraft.id}
              className={`p-4 rounded-lg shadow ${
                aircraft.status === "Maintenance" ? "bg-gray-300" : "bg-white"
              }`}
            >
              <h3 className="text-lg font-semibold">{aircraft.model}</h3>
              <p className="text-sm text-gray-600">Location: {aircraft.location}</p>
              <p className="text-sm text-gray-600">Status: {aircraft.status}</p>
              {aircraft.status !== "Maintenance" && (
                <button
                  onClick={() => toggleStatus(aircraft.id)}
                  className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  {aircraft.status === "Operational" ? "Under Maintenance" : "Operational"}
                </button>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}