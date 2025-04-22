'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function ResourceManagerDashboard() {
  const [gates, setGates] = useState([]);
  const [runways, setRunways] = useState([]);
  const [flightDetails, setFlightDetails] = useState({ gates: {}, runways: {} });

  useEffect(() => {
    fetch('http://localhost:5000/api/gr')
      .then((response) => response.json())
      .then((data) => {
        // Process gates
        const gatesData = Object.keys(data.gates).map((gateNumber, index) => ({
          id: index + 1,
          gateNumber,
          status: data.gates[gateNumber] ? 'Occupied' : 'Available',
        }));
        setGates(gatesData);

        // Process runways
        const runwaysData = Object.keys(data.runways).map((runwayNumber, index) => ({
          id: index + 1,
          runwayNumber,
          status: data.runways[runwayNumber] ? 'Occupied' : 'Available',
        }));
        setRunways(runwaysData);

        // Store flight details for occupied gates and runways
        setFlightDetails({
          gates: data.gates,
          runways: data.runways,
        });
      })
      .catch((error) => console.error('Error fetching gates and runways:', error));
  }, []);

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
                className="bg-white p-4 rounded-lg shadow-md border border-gray-200 mb-4"
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
                {gate.status === 'Occupied' &&
                  flightDetails.gates[gate.gateNumber] && (
                    <div className="mt-2 text-sm text-gray-600">
                      <p>
                        <strong>Flight ID:</strong> {flightDetails.gates[gate.gateNumber].id}
                      </p>
                      <p>
                        <strong>Source:</strong> {flightDetails.gates[gate.gateNumber].src}
                      </p>
                      <p>
                        <strong>Destination:</strong> {flightDetails.gates[gate.gateNumber].dest}
                      </p>
                      <p>
                        <strong>Time:</strong>{' '}
                        {new Date(flightDetails.gates[gate.gateNumber].datetime).toLocaleString()}
                      </p>
                      <p>
                        <strong>Status:</strong> {flightDetails.gates[gate.gateNumber].status}
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
                className="bg-white p-4 rounded-lg shadow-md border border-gray-200 mb-4"
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
                {runway.status === 'Occupied' &&
                  flightDetails.runways[runway.runwayNumber] && (
                    <div className="mt-2 text-sm text-gray-600">
                      <p>
                        <strong>Flight ID:</strong> {flightDetails.runways[runway.runwayNumber].id}
                      </p>
                      <p>
                        <strong>Source:</strong> {flightDetails.runways[runway.runwayNumber].src}
                      </p>
                      <p>
                        <strong>Destination:</strong> {flightDetails.runways[runway.runwayNumber].dest}
                      </p>
                      <p>
                        <strong>Time:</strong>{' '}
                        {new Date(flightDetails.runways[runway.runwayNumber].datetime).toLocaleString()}
                      </p>
                      <p>
                        <strong>Status:</strong> {flightDetails.runways[runway.runwayNumber].status}
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