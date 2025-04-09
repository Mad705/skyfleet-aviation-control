'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function ResourceManagerDashboard() {
  const [gates, setGates] = useState([
    { id: 1, gateNumber: 'G1', status: 'Available' },
    { id: 2, gateNumber: 'G2', status: 'Available' },
    { id: 3, gateNumber: 'G3', status: 'Available' },
    { id: 4, gateNumber: 'G4', status: 'Available' },
    { id: 5, gateNumber: 'G5', status: 'Available' },
  ]);

  const [runways, setRunways] = useState([
    { id: 1, runwayNumber: 'R1', status: 'Available' },
    { id: 2, runwayNumber: 'R2', status: 'Available' },
    { id: 3, runwayNumber: 'R3', status: 'Available' },
    { id: 4, runwayNumber: 'R4', status: 'Available' },
    { id: 5, runwayNumber: 'R5', status: 'Available' },
  ]);

  const [flightDetails, setFlightDetails] = useState({ gates: {}, runways: {} });
  const [selectedBox, setSelectedBox] = useState(null); 

  useEffect(() => {
    fetch('/flightDetails.json')
      .then((response) => response.json())
      .then((data) => {
        setFlightDetails(data);

        setGates((prevGates) =>
          prevGates.map((gate) => ({
            ...gate,
            status: data.gates[gate.gateNumber] ? 'Occupied' : 'Available',
          }))
        );

        setRunways((prevRunways) =>
          prevRunways.map((runway) => ({
            ...runway,
            status: data.runways[runway.runwayNumber] ? 'Occupied' : 'Available',
          }))
        );
      })
      .catch((error) => console.error('Error fetching flight details:', error));
  }, []);

  const toggleDetails = (boxId) => {
    setSelectedBox((prev) => (prev === boxId ? null : boxId)); 
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

      {/* Runways and Gates Section */}
      <section className="p-6">
        <h2 className="text-2xl font-semibold mb-4">Runways and Gates</h2>
        <div className="grid grid-cols-2 gap-8">
          {/* Gates Column */}
          <div>
            <h3 className="text-xl font-bold mb-4">Gates</h3>
            {gates.map((gate) => (
              <div
                key={gate.id}
                className="bg-white p-4 rounded-lg shadow-md border border-gray-200 mb-4 cursor-pointer"
                onClick={() => toggleDetails(`gate-${gate.id}`)}
              >
                <h3 className="text-lg font-bold text-blue-800">Gate {gate.gateNumber}</h3>
                <p>
                  <strong>Status:</strong>{' '}
                  <span
                    className={`font-semibold ${
                      gate.status === 'Occupied'
                        ? 'text-red-600'
                        : gate.status === 'Under Maintenance'
                        ? 'text-yellow-600'
                        : 'text-green-600'
                    }`}
                  >
                    {gate.status}
                  </span>
                </p>
                {selectedBox === `gate-${gate.id}` &&
                  gate.status === 'Occupied' &&
                  flightDetails.gates[gate.gateNumber] && (
                    <div className="mt-2 text-sm text-gray-600">
                      <p>
                        <strong>Flight ID:</strong> {flightDetails.gates[gate.gateNumber].flightId}
                      </p>
                      <p>
                        <strong>Airline:</strong> {flightDetails.gates[gate.gateNumber].airline}
                      </p>
                      <p>
                        <strong>Destination:</strong> {flightDetails.gates[gate.gateNumber].destination}
                      </p>
                      <p>
                        <strong>Departure:</strong>{' '}
                        {new Date(
                          flightDetails.gates[gate.gateNumber].departureTime
                        ).toLocaleString()}
                      </p>
                    </div>
                  )}
              </div>
            ))}
          </div>

          {/* Runways Column */}
          <div>
            <h3 className="text-xl font-bold mb-4">Runways</h3>
            {runways.map((runway) => (
              <div
                key={runway.id}
                className="bg-white p-4 rounded-lg shadow-md border border-gray-200 mb-4 cursor-pointer"
                onClick={() => toggleDetails(`runway-${runway.id}`)}
              >
                <h3 className="text-lg font-bold text-blue-800">Runway {runway.runwayNumber}</h3>
                <p>
                  <strong>Status:</strong>{' '}
                  <span
                    className={`font-semibold ${
                      runway.status === 'Occupied'
                        ? 'text-red-600'
                        : runway.status === 'Under Maintenance'
                        ? 'text-yellow-600'
                        : 'text-green-600'
                    }`}
                  >
                    {runway.status}
                  </span>
                </p>
                {selectedBox === `runway-${runway.id}` &&
                  runway.status === 'Occupied' &&
                  flightDetails.runways[runway.runwayNumber] && (
                    <div className="mt-2 text-sm text-gray-600">
                      <p>
                        <strong>Flight ID:</strong> {flightDetails.runways[runway.runwayNumber].flightId}
                      </p>
                      <p>
                        <strong>Airline:</strong> {flightDetails.runways[runway.runwayNumber].airline}
                      </p>
                      <p>
                        <strong>Destination:</strong>{' '}
                        {flightDetails.runways[runway.runwayNumber].destination}
                      </p>
                      <p>
                        <strong>Departure:</strong>{' '}
                        {new Date(
                          flightDetails.runways[runway.runwayNumber].departureTime
                        ).toLocaleString()}
                      </p>
                    </div>
                  )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}