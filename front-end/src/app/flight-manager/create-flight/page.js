'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateFlightPage() {
  const [src, setSrc] = useState('BLR');
  const [dest, setDest] = useState('');
  const [datetime, setDatetime] = useState('');
  const [selectedAircraft, setSelectedAircraft] = useState('');
  const [basePrice, setBasePrice] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [availableAircrafts, setAvailableAircrafts] = useState([]);
  const [loadingAircrafts, setLoadingAircrafts] = useState(true);

  const router = useRouter();

  useEffect(() => {
    const fetchAvailableAircrafts = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/aircrafts/available');
        if (!response.ok) throw new Error('Failed to fetch aircrafts');
        const data = await response.json();
        setAvailableAircrafts(Array.isArray(data) ? data : Object.values(data));
      } catch (error) {
        console.error('Error fetching aircrafts:', error);
      } finally {
        setLoadingAircrafts(false);
      }
    };

    fetchAvailableAircrafts();
  }, []);

  const selectedAircraftDetails = availableAircrafts.find(
    (aircraft) => aircraft.id === selectedAircraft
  );

  const generateFlightId = () => {
    if (!src || !dest || !datetime || !selectedAircraftDetails?.model) return '';
    const datePart = datetime.replace(/[:T-]/g, '');
    return `${src}-${dest}-${datePart}-${selectedAircraftDetails.model}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const flightData = {
      id: generateFlightId(),
      src,
      dest,
      datetime,
      ac: selectedAircraft,
      gate: "NULL",
      runway: "NULL",
      status: "Scheduled",
      basePrice: basePrice.toString()
    };

    try {
      const response = await fetch('http://localhost:5000/api/flights/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(flightData),
      });

      if (!response.ok) {
        throw new Error('Failed to create flight');
      }

      setSubmitSuccess(true);
      setTimeout(() => {
        router.push('/flight-manager/dashboard');
      }, 1500);
    } catch (error) {
      console.error('Error creating flight:', error);
      alert('Failed to create flight. Please try again.');
    } finally {
      setIsSubmitting(false);
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

      {/* Create Flight Form */}
      <form onSubmit={handleSubmit} className="p-6 max-w-7xl mx-auto bg-white shadow-md rounded-xl mt-6">
        <h1 className="text-2xl font-bold mb-4">Schedule a New Flight</h1>
        <h1 className='flex items-center justify-center text-lg font-medium'>SRC : Bengaluru(BLR)</h1>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <h2 className="font-semibold mb-2">Destination</h2>
          <select
            value={dest}
            onChange={(e) => setDest(e.target.value)}
            className="border rounded-xl p-2 col-span-2"
            required
          >
            <option value="">Select Destination</option>
            <option value="DEL">Delhi (DEL)</option>
            <option value="MUM">Mumbai (MUM)</option>
            <option value="HYD">Hyderabad (HYD)</option>
            <option value="CHN">Chennai (CHN)</option>
            <option value="KOL">Kolkata (KOL)</option>
          </select>
          
          <h2 className="font-semibold mb-2">Date and Time</h2>
          <input
            type="datetime-local"
            className="border rounded-xl p-2 col-span-2"
            min={new Date().toISOString().slice(0, 16)}
            value={datetime}
            onChange={(e) => setDatetime(e.target.value)}
            required
          />

          <h2 className="font-semibold mb-2">Aircraft</h2>
          {loadingAircrafts ? (
            <select className="border rounded-xl p-2 col-span-2" disabled>
              <option>Loading aircrafts...</option>
            </select>
          ) : (
            <select
              value={selectedAircraft}
              onChange={(e) => setSelectedAircraft(e.target.value)}
              className="border rounded-xl p-2 col-span-2"
              required
            >
              <option value="">Select Aircraft</option>
              {availableAircrafts.map((ac) => (
                <option key={ac.id} value={ac.id}>
                  {ac.name} ({ac.model}) - {ac.capacity} seats
                </option>
              ))}
            </select>
          )}

          <h2 className="font-semibold mb-2">Base Price</h2>
          <input
            type="number"
            className="border rounded-xl p-2 col-span-2"
            value={basePrice}
            onChange={(e) => setBasePrice(e.target.value)}
            placeholder="Enter base price"
            required
            min="0"
          />
        </div>

        {selectedAircraftDetails && (
          <div className="mb-6 p-4 bg-blue-50 border rounded-xl">
            <h2 className="font-semibold mb-2">Aircraft Details</h2>
            <p><strong>ID:</strong> {selectedAircraftDetails.id}</p>
            <p><strong>Name:</strong> {selectedAircraftDetails.name}</p>
            <p><strong>Model:</strong> {selectedAircraftDetails.model}</p>
            <p><strong>Capacity:</strong> {selectedAircraftDetails.capacity}</p>
            {selectedAircraftDetails.availability && (
              <p><strong>Status:</strong> {selectedAircraftDetails.availability}</p>
            )}
          </div>
        )}

        <div className="text-gray-700 mb-4">
          <strong>Flight ID:</strong> {generateFlightId() || 'Enter all fields to generate'}
        </div>

        {submitSuccess && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
            Flight created successfully! Redirecting...
          </div>
        )}

        <button 
          type="submit" 
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Creating...' : 'Schedule Flight'}
        </button>
      </form>
    </div>
  );
}