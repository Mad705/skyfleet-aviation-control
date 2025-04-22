'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ResourceManagerCrew() {
  const [crew, setCrew] = useState([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedAction, setSelectedAction] = useState({ type: '', id: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  // Fetch crew data from the backend API
  useEffect(() => {
    const fetchCrewData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/crew/all');
        if (!response.ok) {
          throw new Error('Failed to fetch crew data');
        }
        const data = await response.json();
        // Convert object to array if needed
        const crewArray = Array.isArray(data) ? data : Object.values(data);
        setCrew(crewArray);
      } catch (err) {
        console.error('Error fetching crew details:', err);
        setError(err.message);
        // Fallback mock data for development
        if (process.env.NODE_ENV === 'development') {
          setCrew([
            {
              id: "CR001",
              name: "John Doe",
              country: "USA",
              role: "Pilot",
              availability: "Standby",
              crewRole: "Captain",
              flight_id: ""
            },
            {
              id: "CR002",
              name: "Jane Smith",
              country: "UK",
              role: "Flight Attendant",
              availability: "Off-Duty",
              crewRole: "Senior Attendant",
              flight_id: ""
            }
          ]);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchCrewData();
  }, []);

  const handleActionClick = (actionType, id) => {
    setSelectedAction({ type: actionType, id });
    setShowConfirmation(true);
  };

  const confirmAction = async () => {
    try {
      let newAvailability;
      const { type, id } = selectedAction;

      switch (type) {
        case 'toggle':
          newAvailability = crew.find(m => m.id === id).availability === "standby" 
            ? "off-duty" 
            : "standby";
          break;
        case 'finish':
          newAvailability = "standby";
          break;
        case 'assign':
          newAvailability = "assigned";
          break;
        default:
          return;
      }

      // Update backend
      

     

      // Update local state
      setCrew(prevCrew =>
        prevCrew.map(member =>
          member.id === id ? { ...member, availability: newAvailability } : member
        )
      );

      setShowConfirmation(false);
    } catch (err) {
      console.error('Error updating crew status:', err);
      setError(err.message);
      setShowConfirmation(false);
    }
  };

  const cancelAction = () => {
    setShowConfirmation(false);
    setSelectedAction({ type: '', id: '' });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl">Loading crew data...</div>
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
            <h3 className="text-lg font-semibold mb-4">Confirm Action</h3>
            <p className="mb-4">
              {selectedAction.type === 'toggle' 
                ? 'Are you sure you want to change this crew member\'s availability?'
                : selectedAction.type === 'finish'
                ? 'Mark this duty as finished?'
                : 'Confirm assignment of this crew member?'}
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={cancelAction}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={confirmAction}
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
        <h2 className="text-2xl font-semibold mb-4">Crew Availability</h2>
        {crew.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600">No crew data available</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {crew.map((member) => (
              <div
                key={member.id}
                className={`p-4 rounded-lg shadow border-l-4 ${
                  member.availability === "assigned"
                    ? "bg-gray-200 border-gray-500"
                    : member.availability === "standby"
                    ? "bg-blue-50 border-blue-500"
                    : "bg-white border-gray-300"
                }`}
              >
                <h3 className="text-lg font-semibold">{member.name}</h3>
                <p className="text-sm text-gray-600">ID: {member.id}</p>
                <p className="text-sm text-gray-600">Country: {member.country}</p>
                <p className="text-sm text-gray-600">Role: {member.role}</p>
                <p className="text-sm text-gray-600">Crew Role: {member.crewRole}</p>
                <p className="text-sm font-medium">
                  Status: 
                  <span className={
                    member.availability === "assigned" 
                      ? "text-gray-700 ml-1" 
                      : member.availability === "Standby"
                      ? "text-blue-600 ml-1"
                      : "text-green-600 ml-1"
                  }>
                    {member.availability}
                  </span>
                </p>

                {member.availability === "assigned" ? (
                  <div className="mt-4 text-sm text-gray-500">
                    Currently assigned - no actions available
                  </div>
                ) : (
                  <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      onClick={() => handleActionClick('toggle', member.id)}
                      className={`px-4 py-2 rounded text-white ${
                        member.availability === "standby"
                          ? "bg-blue-500 hover:bg-blue-600"
                          : "bg-green-500 hover:bg-green-600"
                      }`}
                    >
                      {member.availability === "standby" ? "Set to off-duty" : "Set to standby"}
                    </button>
                   
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}