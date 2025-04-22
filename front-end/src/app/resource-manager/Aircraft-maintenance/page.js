'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ResourceManagerAircraftMaintenance() {
  const [aircrafts, setAircrafts] = useState([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedAircraft, setSelectedAircraft] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchAircrafts = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/aircrafts/all');
        if (!response.ok) {
          throw new Error('Failed to fetch aircraft data');
        }
        const data = await response.json();
        const aircraftsArray = Object.values(data);
        setAircrafts(aircraftsArray);
      } catch (err) {
        console.error('Error fetching aircraft details:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAircrafts();
  }, []);

  const handleToggleClick = (id) => {
    setSelectedAircraft(id);
    setShowConfirmation(true);
  };

  const confirmToggle = async () => {
    try {
      const aircraft = aircrafts.find(a => a.id === selectedAircraft);
      if (!aircraft || aircraft.availability === 'assigned') return;

      const newStatus = aircraft.availability === "standby" ? "maintenance" : "standby";

      setAircrafts(prevAircrafts =>
        prevAircrafts.map(a =>
          a.id === selectedAircraft ? { ...a, availability: newStatus } : a
        )
      );

      setShowConfirmation(false);


      setTimeout(() => {
        router.push('/resource-manager/dashboard');
      }, 1000);
    } catch (err) {
      console.error('Error updating aircraft status:', err);
      setError(err.message);
      setShowConfirmation(false);
    }
  };

  const cancelToggle = () => {
    setShowConfirmation(false);
    setSelectedAircraft(null);
  };

  const getDisplayStatus = (status) => {
    switch (status) {
      case 'standby':
        return 'Operational';
      case 'maintenance':
        return 'Under Maintenance';
      case 'assigned':
        return 'Assigned to Flight';
      default:
        return status;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'standby':
        return 'text-green-600';
      case 'maintenance':
        return 'text-yellow-600';
      case 'assigned':
        return 'text-blue-600';
      default:
        return 'text-gray-600';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl">Loading aircraft data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl text-red-500">Error: {error}</div>
      </div>
    );
  }

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

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Confirm Status Change</h3>
            <p className="mb-4">Are you sure you want to change the status of this aircraft?</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={cancelToggle}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={confirmToggle}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Section */}
      <main className="p-6">
        <h2 className="text-2xl font-semibold mb-4">Aircraft Maintenance</h2>
        {aircrafts.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600">No aircraft data available</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {aircrafts.map((aircraft) => (
              <div
                key={aircraft.id}
                className={`p-4 rounded-lg shadow ${
                  aircraft.availability === "maintenance"
                    ? "bg-yellow-50 border-l-4 border-yellow-500"
                    : aircraft.availability === "assigned"
                    ? "bg-blue-50 border-l-4 border-blue-500"
                    : "bg-white border-l-4 border-green-500"
                }`}
              >
                <h3 className="text-lg font-semibold">Aircraft ID: {aircraft.id}</h3>
                <p className="text-sm text-gray-600">Name: {aircraft.name}</p>
                <p className="text-sm text-gray-600">Model: {aircraft.model}</p>
                <p className="text-sm text-gray-600">Capacity: {aircraft.capacity}</p>
                <p className="text-sm font-medium">
                  Availability:{" "}
                  <span className={`${getStatusColor(aircraft.availability)} ml-1`}>
                    {getDisplayStatus(aircraft.availability)}
                  </span>
                </p>
                {(aircraft.availability === "standby" || aircraft.availability === "maintenance") && (
                  <button
                    onClick={() => handleToggleClick(aircraft.id)}
                    className={`mt-4 px-4 py-2 rounded text-white ${
                      aircraft.availability === "standby"
                        ? "bg-blue-500 hover:bg-blue-600"
                        : "bg-green-500 hover:bg-green-600"
                    }`}
                  >
                    {aircraft.availability === "standby"
                      ? "Set to Maintenance"
                      : "Mark as Operational"}
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
