'use client';
import Link from 'next/link';
import { useState } from 'react';

// Dummy data for crew
const initialCrew = [
  { id: 1, name: "a", role: "Pilot", status: "Standby" },
  { id: 2, name: "b", role: "Co-Pilot", status: "Off-Duty" },
  { id: 3, name: "c", role: "Flight Attendant", status: "Assigned" },
  { id: 4, name: "d", role: "Engineer", status: "Standby" },
  { id: 5, name: "e", role: "Flight Attendant", status: "Off-Duty" },
];

export default function ResourceManagerCrew() {
  const [crew, setCrew] = useState(initialCrew);

  // Function to toggle status between "Off-Duty" and "Standby"
  const toggleStatus = (id) => {
    setCrew((prevCrew) =>
      prevCrew.map((member) =>
        member.id === id
          ? {
              ...member,
              status: member.status === "Standby" ? "Off-Duty" : "Standby",
            }
          : member
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
        <h2 className="text-2xl font-semibold mb-4">Crew Availability</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {crew.map((member) => (
            <div
              key={member.id}
              className={`p-4 rounded-lg shadow ${
                member.status === "Assigned" ? "bg-gray-300" : "bg-white"
              }`}
            >
              <h3 className="text-lg font-semibold">{member.name}</h3>
              <p className="text-sm text-gray-600">Role: {member.role}</p>
              <p className="text-sm text-gray-600">Status: {member.status}</p>
              {member.status !== "Assigned" && (
                <button
                  onClick={() => toggleStatus(member.id)}
                  className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Toggle to {member.status === "Standby" ? "Off-Duty" : "Standby"}
                </button>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}