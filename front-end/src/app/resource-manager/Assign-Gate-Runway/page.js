'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function ResourceManagerAssignGateRunway() {
  const [flights, setFlights] = useState([]);
  const [crew, setCrew] = useState([]);
  const [selectedFlight, setSelectedFlight] = useState('');
  const [assignments, setAssignments] = useState({
    pilot: '',
    copilot: '',
    attendants: [],
    groundStaff: []
  });
  const [assignedCrew, setAssignedCrew] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitStatus, setSubmitStatus] = useState(null);

  // Fetch data from API
  useEffect(() => {
    setIsLoading(true);
    setError(null);

    // Fetch flights
    fetch('http://localhost:5000/api/assign/flights')
      .then(response => {
        console.log('Flights response status:', response.status, response.statusText);
        if (!response.ok) throw new Error(`Failed to fetch flights: ${response.statusText}`);
        return response.json();
      })
      .then(data => {
        console.log('Flights data:', data);
        setFlights(data.flights || []);
      })
      .catch(error => {
        console.error('Error fetching flights:', error);
        setError('Failed to load flights. Please try again.');
      });

    // Fetch crew
    fetch('http://localhost:5000/api/assign/crews')
      .then(response => {
        console.log('Crews response status:', response.status, response.statusText);
        if (!response.ok) throw new Error(`Failed to fetch crew: ${response.statusText}`);
        return response.json();
      })
      .then(data => {
        console.log('Crews data:', data);
        setCrew(data || []);
      })
      .catch(error => {
        console.error('Error fetching crew:', error);
        setError('Failed to load crew. Please try again.');
      })
      .finally(() => setIsLoading(false));
  }, []);

  // Handle flight selection
  const handleFlightChange = (e) => {
    setSelectedFlight(e.target.value);
    setAssignments({ pilot: '', copilot: '', attendants: [], groundStaff: [] });
    setAssignedCrew([]);
    setSubmitStatus(null);
  };

  // Handle single-select crew changes (pilot, copilot)
  const handleCrewChange = (role, value) => {
    const oldValue = assignments[role];
    setAssignments(prev => ({ ...prev, [role]: value }));
    setAssignedCrew(prev => {
      const updated = [...prev];
      if (oldValue) {
        const index = updated.indexOf(oldValue);
        if (index > -1) updated.splice(index, 1);
      }
      if (value) updated.push(value);
      return updated;
    });
    setSubmitStatus(null);
  };

  // Handle multi-select crew changes (attendants, groundStaff)
  const handleMultiSelectChange = (role, selectedOptions) => {
    const selectedValues = Array.from(new Set(
      Array.from(selectedOptions).map(option => option.value)
    )).slice(0, 2);
    const oldValues = assignments[role];
    setAssignments(prev => ({ ...prev, [role]: selectedValues }));
    setAssignedCrew(prev => {
      const updated = [...prev.filter(id => !oldValues.includes(id) || selectedValues.includes(id))];
      selectedValues.forEach(value => {
        if (!updated.includes(value)) updated.push(value);
      });
      return updated;
    });
    setSubmitStatus(null);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus(null);

    if (
      selectedFlight &&
      assignments.pilot &&
      assignments.copilot &&
      assignments.attendants.length === 2 &&
      assignments.groundStaff.length === 2
    ) {
      const output = {
        flightId: selectedFlight,
        pilotId: assignments.pilot,
        copilotId: assignments.copilot,
        attendantIds: assignments.attendants,
        groundStaffIds: assignments.groundStaff
      };
      console.log('Submitting JSON:', JSON.stringify(output, null, 2));

      try {
        const response = await fetch('http://localhost:5000/api/assign/assignments', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(output)
        });

        if (!response.ok) {
          throw new Error(`Failed to submit assignment: ${response.statusText}`);
        }

        setSubmitStatus({ type: 'success', message: 'Assignment submitted successfully!' });
        // Reset form
        setSelectedFlight('');
        setAssignments({ pilot: '', copilot: '', attendants: [], groundStaff: [] });
        setAssignedCrew([]);
      } catch (error) {
        console.error('Error submitting assignment:', error);
        setSubmitStatus({ type: 'error', message: `Failed to submit assignment: ${error.message}` });
      }
    } else {
      alert('Please select a flight, pilot, co-pilot, and exactly two unique attendants and ground staff.');
    }
  };

  // Filter available crew for dropdowns
  const getAvailableCrew = (role, currentValues = []) => {
    return crew
      .filter(member => 
        member.role === role && 
        (!assignedCrew.includes(member.id) || currentValues.includes(member.id))
      )
      .map(member => ({ id: member.id, name: member.name }));
  };

  // Get selected flight details
  const selectedFlightDetails = flights.find(flight => flight.id === selectedFlight);

  return (
    <div className="min-h-screen bg-yellow-50">
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

      <div className="p-10">
        <h2 className="text-3xl font-bold mb-6 text-rose-900">Assign Crew to Flight</h2>

        {isLoading && <p className="text-gray-600">Loading...</p>}
        {error && (
          <div>
            <p className="text-red-600">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="text-rose-800 underline"
            >
              Retry
            </button>
          </div>
        )}

        {!isLoading && !error && (
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-md max-w-2xl">
            {/* Submission Status */}
            {submitStatus && (
              <div className={`mb-4 p-2 rounded ${submitStatus.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {submitStatus.message}
              </div>
            )}

            {/* Flight Selection */}
            <div className="mb-4">
              <label className="block text-rose-800 font-medium mb-1">Select Flight:</label>
              <select
                value={selectedFlight}
                onChange={handleFlightChange}
                className="w-full border rounded px-2 py-1"
              >
                <option value="">Select a flight</option>
                {flights.map(flight => (
                  <option key={flight.id} value={flight.id}>{flight.id}</option>
                ))}
              </select>
            </div>

            {/* Flight Details */}
            {selectedFlightDetails && (
              <div className="mb-4 p-4 bg-gray-100 rounded">
                <p className="text-sm text-gray-600"><strong>ID:</strong> {selectedFlightDetails.id}</p>
                <p className="text-sm text-gray-600"><strong>Source:</strong> {selectedFlightDetails.src}</p>
                <p className="text-sm text-gray-600"><strong>Destination:</strong> {selectedFlightDetails.dest}</p>
                <p className="text-sm text-gray-600"><strong>Time:</strong> {new Date(selectedFlightDetails.datetime).toLocaleString()}</p>
              </div>
            )}

            {/* Pilot Selection */}
            <div className="mb-4">
              <label className="block text-rose-800 font-medium mb-1">Pilot:</label>
              <select
                value={assignments.pilot}
                onChange={(e) => handleCrewChange('pilot', e.target.value)}
                className="w-full border rounded px-2 py-1"
                disabled={!selectedFlight}
              >
                <option value="">Select Pilot</option>
                {getAvailableCrew('pilot', assignments.pilot).map(member => (
                  <option key={member.id} value={member.id}>{member.name}</option>
                ))}
              </select>
            </div>

            {/* Co-Pilot Selection */}
            <div className="mb-4">
              <label className="block text-rose-800 font-medium mb-1">Co-Pilot:</label>
              <select
                value={assignments.copilot}
                onChange={(e) => handleCrewChange('copilot', e.target.value)}
                className="w-full border rounded px-2 py-1"
                disabled={!selectedFlight}
              >
                <option value="">Select Co-Pilot</option>
                {getAvailableCrew('copilot', assignments.copilot).map(member => (
                  <option key={member.id} value={member.id}>{member.name}</option>
                ))}
              </select>
            </div>

            {/* Attendants Multi-Select */}
            <div className="mb-4">
              <label className="block text-rose-800 font-medium mb-1">Attendants (Select 2):</label>
              <select
                multiple
                value={assignments.attendants}
                onChange={(e) => handleMultiSelectChange('attendants', e.target.selectedOptions)}
                className="w-full border rounded px-2 py-1 h-24"
                disabled={!selectedFlight}
              >
                {getAvailableCrew('attendant', assignments.attendants).map(member => (
                  <option key={member.id} value={member.id}>{member.name}</option>
                ))}
              </select>
              <p className="text-sm text-gray-600 mt-1">Hold Ctrl/Cmd to select up to 2 unique attendants.</p>
            </div>

            {/* Ground Staff Multi-Select */}
            <div className="mb-4">
              <label className="block text-rose-800 font-medium mb-1">Ground Staff (Select 2):</label>
              <select
                multiple
                value={assignments.groundStaff}
                onChange={(e) => handleMultiSelectChange('groundStaff', e.target.selectedOptions)}
                className="w-full border rounded px-2 py-1 h-24"
                disabled={!selectedFlight}
              >
                {getAvailableCrew('ground-staff', assignments.groundStaff).map(member => (
                  <option key={member.id} value={member.id}>{member.name}</option>
                ))}
              </select>
              <p className="text-sm text-gray-600 mt-1">Hold Ctrl/Cmd to select up to 2 unique ground staff.</p>
            </div>

            <button
              type="submit"
              className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded w-full font-bold disabled:bg-gray-400 disabled:cursor-not-allowed"
              disabled={!selectedFlight}
            >
              Submit Assignment
            </button>
          </form>
        )}
      </div>
    </div>
  );
}