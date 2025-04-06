'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const dummyAircrafts = [
  { id: 'AC101', name: 'Airbus A320', model: 'A320-200', capacity: 180 },
  { id: 'AC202', name: 'Boeing 737', model: '737-800', capacity: 160 },
  { id: 'AC303', name: 'Embraer E190', model: 'E190', capacity: 100 },
];

export default function CreateFlightPage() {
  const [src, setSrc] = useState('BLR');
  const [dest, setDest] = useState('');
  const [datetime, setDatetime] = useState('');
  const [selectedAircraft, setSelectedAircraft] = useState('');
  const [pricing, setPricing] = useState({
    economy: '',
    premium: '',
    business: '',
    first: '',
  });

  const router = useRouter();

  const selectedAircraftDetails = dummyAircrafts.find(
    (aircraft) => aircraft.id === selectedAircraft
  );

  const generateFlightId = () => {
    if (!src || !dest || !datetime || !selectedAircraftDetails?.name) return '';
    return `${src}-${dest}-${datetime}-${selectedAircraftDetails.name.replace(/\s+/g, '')}`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const flightData = {
      id: generateFlightId(),
      src,
      dest,
      datetime,
      aircraft: selectedAircraftDetails,
      pricing,
    };

    console.log('Submitting Flight:', flightData);

    // Simulate backend API call delay
    setTimeout(() => {
      // Redirect to dashboard
      router.push('/flight-manager/dashboard');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar (same as FlightManagerDashboard) */}
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
        <h1 className='flex items-center justify-center  text-lg font-medium'>SRC : Bengaluru(BLR)</h1>
        <div className="grid grid-cols-2 gap-4 mb-6 ">
            
        <h2 className="font-semibold mb-2">Destination </h2>
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
  <h2 className="font-semibold mb-2">Date and Time  </h2>
  <input
  type="datetime-local"
  className="border rounded-xl p-2 col-span-2"
  min={new Date().toISOString().slice(0, 16)}
  value={datetime}
  onChange={(e) => setDatetime(e.target.value)}
  required
/>

<h2 className="font-semibold mb-2">Aircraft  </h2>
          <select
            value={selectedAircraft}
            onChange={(e) => setSelectedAircraft(e.target.value)}
            className="border rounded-xl p-2 col-span-2"
            required
          >
            <option value="">Select Aircraft</option>
            {dummyAircrafts.map((ac) => (
              <option key={ac.id} value={ac.id}>
                {ac.name} ({ac.model} )
              </option>
            ))}
          </select>
        </div>

        {selectedAircraftDetails && (
          <div className="mb-6 p-4 bg-blue-50 border rounded-xl">
            <h2 className="font-semibold mb-2">Aircraft Details</h2>
            <p><strong>ID:</strong> {selectedAircraftDetails.id}</p>
            <p><strong>Name:</strong> {selectedAircraftDetails.name}</p>
            <p><strong>Model:</strong> {selectedAircraftDetails.model}</p>
            <p><strong>Capacity:</strong> {selectedAircraftDetails.capacity}</p>
          </div>
        )}

        <h2 className="font-semibold mb-2">Seat Pricing</h2>
        <div className="grid grid-cols-2 gap-4 mb-6 ">
          <input
            type="number"
            placeholder="Economy Price"
            value={pricing.economy}
            onChange={(e) => setPricing({ ...pricing, economy: e.target.value })}
            className="border rounded-xl p-2"
            required
          />
          <input
            type="number"
            placeholder="Premium Economy Price"
            value={pricing.premium}
            onChange={(e) => setPricing({ ...pricing, premium: e.target.value })}
            className="border rounded-xl p-2"
            required
          />
          <input
            type="number"
            placeholder="Business Class Price"
            value={pricing.business}
            onChange={(e) => setPricing({ ...pricing, business: e.target.value })}
            className="border rounded-xl p-2"
            required
          />
          <input
            type="number"
            placeholder="First Class Price"
            value={pricing.first}
            onChange={(e) => setPricing({ ...pricing, first: e.target.value })}
            className="border rounded-xl p-2"
            required
          />
        </div>

        <div className="text-gray-700 mb-4">
          <strong>Flight ID:</strong> {generateFlightId() || 'Enter all fields to generate'}
        </div>

        <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
          Schedule Flight
        </button>
      </form>
    </div>
  );
}
