"use client";
import { useState } from "react";
import Link from "next/link";

const dummyFlights = [
  {
    id: "BLR-DEL-20250407T0930-A320Neo",
    src: "BLR",
    dest: "DEL",
    datetime: "2025-04-07T09:30",
    aircraft: {
      id: "AC001",
      name: "Airbus A320Neo",
      model: "A320",
      capacity: 180,
    },
  },
  {
    id: "HYD-DXB-20250408T1515-B737Max",
    src: "HYD",
    dest: "DXB",
    datetime: "2025-04-08T15:15",
    aircraft: {
      id: "AC002",
      name: "Boeing 737 Max",
      model: "B737",
      capacity: 160,
    },
  },
  {
    id: "BOM-LHR-20250408T1845-B787Dreamliner",
    src: "BOM",
    dest: "LHR",
    datetime: "2025-04-08T18:45",
    aircraft: {
      id: "AC003",
      name: "Boeing 787 Dreamliner",
      model: "B787",
      capacity: 240,
    },
  },
];

// Added more crew members to ensure enough for all flights
const availableGates = ["A1", "A2", "B1", "C3"];
const availableRunways = ["R1", "R2", "R3"];
const availableCrew = {
  pilots: ["Capt. Raj", "Capt. Meera", "Capt. Singh", "Capt. Aditya", "Capt. Vikram"],
  copilots: ["Co. Aryan", "Co. Priya", "Co. Ravi", "Co. Deepak", "Co. Anjali"],
  attendants: ["Amit", "Neha", "Sara", "John", "Pooja", "Rohan", "Tina", "David", "Meena", "Varun"],
  groundStaff: ["Rahul", "Divya", "Manoj", "Sneha", "Vivek", "Ananya", "Karan", "Leela", "Suresh", "Preeti"],
};

export default function ResourceManagerAssignGateRunway() {
  const [assignments, setAssignments] = useState({});
  const [statuses, setStatuses] = useState({});
  const [assignedCrew, setAssignedCrew] = useState({
    pilots: [],
    copilots: [],
    attendants: [],
    groundStaff: []
  });

  const handleChange = (flightId, section, value) => {
    setAssignments((prev) => ({
      ...prev,
      [flightId]: {
        ...prev[flightId],
        [section]: value,
        crew: {
          pilot: "",
          copilot: "",
          attendants: ["", ""],
          groundStaff: ["", ""],
          ...(prev[flightId]?.crew || {}),
        },
      },
    }));
  };

  const handleCrewChange = (flightId, role, value, index = null) => {
    // Get current assignments for this flight
    const currentFlightAssignment = assignments[flightId] || {};
    const currentCrew = currentFlightAssignment.crew || {
      pilot: "",
      copilot: "",
      attendants: ["", ""],
      groundStaff: ["", ""],
    };
    
    // Find the old value that needs to be removed from assignedCrew
    let oldValue = "";
    if (role === "attendants" || role === "groundStaff") {
      oldValue = currentCrew[role][index] || "";
    } else if (role === "pilot") {
      oldValue = currentCrew.pilot || "";
    } else if (role === "copilot") {
      oldValue = currentCrew.copilot || "";
    }
    
    // Create new crew object with updated value
    const newCrew = {...currentCrew};
    if (role === "attendants" || role === "groundStaff") {
      newCrew[role] = [...currentCrew[role]];
      newCrew[role][index] = value;
    } else if (role === "pilot") {
      newCrew.pilot = value;
    } else if (role === "copilot") {
      newCrew.copilot = value;
    }
    
    // Update assignments state
    setAssignments(prev => ({
      ...prev,
      [flightId]: {
        ...currentFlightAssignment,
        crew: newCrew
      }
    }));
    
    // Update assignedCrew state - remove old value and add new value
    setAssignedCrew(prev => {
      const updated = {...prev};
      
      // Determine which crew category to update
      let crewCategory;
      if (role === "pilot") crewCategory = "pilots";
      else if (role === "copilot") crewCategory = "copilots";
      else crewCategory = role;
      
      // Remove old value if it exists
      if (oldValue) {
        updated[crewCategory] = updated[crewCategory].filter(item => item !== oldValue);
      }
      
      // Add new value if not empty
      if (value) {
        updated[crewCategory] = [...updated[crewCategory], value];
      }
      
      return updated;
    });
  };

  const handleSubmit = (flightId) => {
    const data = assignments[flightId];
    const isComplete =
      data?.gate &&
      data?.runway &&
      data?.crew?.pilot &&
      data?.crew?.copilot &&
      data?.crew?.attendants?.every(Boolean) &&
      data?.crew?.groundStaff?.every(Boolean);

    if (isComplete) {
      // Update status to approved
      setStatuses((prev) => ({ ...prev, [flightId]: "Approved" }));
      
      // Lock in the crew assignment by keeping their assignments in the assignedCrew state
      // No need to modify assignedCrew as we're already tracking them
      
      alert(`✅ Assignment for flight ${flightId} submitted successfully!`);
    } else {
      alert(`⚠️ Please fill all required fields for flight ${flightId}.`);
    }
  };

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
        <h2 className="text-3xl font-bold mb-6 text-rose-900">✈️ Scheduled Flights - Assignments</h2>
        
        {/* Show currently assigned crew members */}
        <div className="mb-8 bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-xl font-bold text-rose-800 mb-4">👨‍✈️ Currently Assigned Crew</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <h4 className="font-semibold mb-2">Pilots</h4>
              <ul className="list-disc pl-5">
                {assignedCrew.pilots.length > 0 ? (
                  assignedCrew.pilots.map((pilot, index) => (
                    <li key={index} className="text-sm">{pilot}</li>
                  ))
                ) : (
                  <li className="text-sm text-gray-500">No pilots assigned yet</li>
                )}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Co-pilots</h4>
              <ul className="list-disc pl-5">
                {assignedCrew.copilots.length > 0 ? (
                  assignedCrew.copilots.map((copilot, index) => (
                    <li key={index} className="text-sm">{copilot}</li>
                  ))
                ) : (
                  <li className="text-sm text-gray-500">No co-pilots assigned yet</li>
                )}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Attendants</h4>
              <ul className="list-disc pl-5">
                {assignedCrew.attendants.length > 0 ? (
                  assignedCrew.attendants.map((attendant, index) => (
                    <li key={index} className="text-sm">{attendant}</li>
                  ))
                ) : (
                  <li className="text-sm text-gray-500">No attendants assigned yet</li>
                )}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Ground Staff</h4>
              <ul className="list-disc pl-5">
                {assignedCrew.groundStaff.length > 0 ? (
                  assignedCrew.groundStaff.map((staff, index) => (
                    <li key={index} className="text-sm">{staff}</li>
                  ))
                ) : (
                  <li className="text-sm text-gray-500">No ground staff assigned yet</li>
                )}
              </ul>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dummyFlights.map((flight) => {
            const data = assignments[flight.id] || {};
            const crew = data.crew || {
              pilot: "",
              copilot: "",
              attendants: ["", ""],
              groundStaff: ["", ""],
            };
            const isApproved = statuses[flight.id] === "Approved";

            // Get available crew members (those not already assigned to other flights)
            const availablePilots = availableCrew.pilots.filter(
              p => !assignedCrew.pilots.includes(p) || crew.pilot === p
            );
            const availableCopilots = availableCrew.copilots.filter(
              c => !assignedCrew.copilots.includes(c) || crew.copilot === c
            );
            const availableAttendants = availableCrew.attendants.filter(
              a => !assignedCrew.attendants.includes(a) || crew.attendants.includes(a)
            );
            const availableGroundStaff = availableCrew.groundStaff.filter(
              g => !assignedCrew.groundStaff.includes(g) || crew.groundStaff.includes(g)
            );

            return (
              <div
                key={flight.id}
                className={`bg-white p-5 rounded-2xl shadow-md border hover:shadow-xl transition ${
                  isApproved ? "border-green-500 border-2" : ""
                }`}
              >
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-semibold text-rose-800 mb-2">{flight.id}</h3>
                  {isApproved && (
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-bold">
                      ✓ Locked
                    </span>
                  )}
                </div>
                
                <p><strong>📍 From:</strong> {flight.src}</p>
                <p><strong>📍 To:</strong> {flight.dest}</p>
                <p><strong>🕒 Time:</strong> {flight.datetime}</p>
                <p><strong>🛩️ Aircraft:</strong> {flight.aircraft.name} ({flight.aircraft.model})</p>
                <p><strong>👥 Capacity:</strong> {flight.aircraft.capacity}</p>

                <div className="mt-4 space-y-2">
                  {/* Gate Select */}
                  <div>
                    <label className="mr-2 font-medium">Gate:</label>
                    <select
                      disabled={isApproved}
                      value={data.gate || ""}
                      onChange={(e) => handleChange(flight.id, "gate", e.target.value)}
                      className={`border rounded px-2 py-1 w-full ${isApproved ? "bg-gray-100" : ""}`}
                    >
                      <option value="">Select</option>
                      {availableGates.map((gate) => (
                        <option key={gate}>{gate}</option>
                      ))}
                    </select>
                  </div>

                  {/* Runway Select */}
                  <div>
                    <label className="mr-2 font-medium">Runway:</label>
                    <select
                      disabled={isApproved}
                      value={data.runway || ""}
                      onChange={(e) => handleChange(flight.id, "runway", e.target.value)}
                      className={`border rounded px-2 py-1 w-full ${isApproved ? "bg-gray-100" : ""}`}
                    >
                      <option value="">Select</option>
                      {availableRunways.map((runway) => (
                        <option key={runway}>{runway}</option>
                      ))}
                    </select>
                  </div>

                  <h4 className="mt-3 font-semibold text-rose-700">👨‍✈️ Crew Assignment</h4>

                  {/* Pilot selection - FIXED HERE */}
                  <div>
                    <label className="mr-2 font-medium">Pilot:</label>
                    <select
                      disabled={isApproved}
                      value={crew.pilot || ""}
                      onChange={(e) => handleCrewChange(flight.id, "pilot", e.target.value)}
                      className={`border rounded px-2 py-1 w-full ${isApproved ? "bg-gray-100" : ""}`}
                    >
                      <option value="">Select Pilot</option>
                      {availablePilots.map((p) => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                    {crew.pilot && (
                      <p className="text-sm text-green-700 mt-1">
                        ✓ {crew.pilot} assigned
                      </p>
                    )}
                  </div>

                  {/* Co-pilot selection - FIXED HERE */}
                  <div>
                    <label className="mr-2 font-medium">Co-pilot:</label>
                    <select
                      disabled={isApproved}
                      value={crew.copilot || ""}
                      onChange={(e) => handleCrewChange(flight.id, "copilot", e.target.value)}
                      className={`border rounded px-2 py-1 w-full ${isApproved ? "bg-gray-100" : ""}`}
                    >
                      <option value="">Select Co-pilot</option>
                      {availableCopilots.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                    {crew.copilot && (
                      <p className="text-sm text-green-700 mt-1">
                        ✓ {crew.copilot} assigned
                      </p>
                    )}
                  </div>

                  {/* Attendants selection */}
                  <div>
                    <label className="font-medium">Attendants:</label>
                    {[0, 1].map((i) => (
                      <div key={i} className="mt-1">
                        <select
                          disabled={isApproved}
                          value={crew.attendants[i] || ""}
                          onChange={(e) => handleCrewChange(flight.id, "attendants", e.target.value, i)}
                          className={`w-full border px-2 py-1 rounded mb-1 ${isApproved ? "bg-gray-100" : ""}`}
                        >
                          <option value="">{`Select Attendant ${i + 1}`}</option>
                          {availableAttendants.map((a) => (
                            <option key={a} value={a}>{a}</option>
                          ))}
                        </select>
                        {crew.attendants[i] && (
                          <p className="text-xs text-green-700">
                            ✓ {crew.attendants[i]} assigned
                          </p>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Ground Staff selection */}
                  <div>
                    <label className="font-medium">Ground Staff:</label>
                    {[0, 1].map((i) => (
                      <div key={i} className="mt-1">
                        <select
                          disabled={isApproved}
                          value={crew.groundStaff[i] || ""}
                          onChange={(e) => handleCrewChange(flight.id, "groundStaff", e.target.value, i)}
                          className={`w-full border px-2 py-1 rounded mb-1 ${isApproved ? "bg-gray-100" : ""}`}
                        >
                          <option value="">{`Select Ground Staff ${i + 1}`}</option>
                          {availableGroundStaff.map((g) => (
                            <option key={g} value={g}>{g}</option>
                          ))}
                        </select>
                        {crew.groundStaff[i] && (
                          <p className="text-xs text-green-700">
                            ✓ {crew.groundStaff[i]} assigned
                          </p>
                        )}
                      </div>
                    ))}
                  </div>

                  <button
                    disabled={isApproved}
                    onClick={() => handleSubmit(flight.id)}
                    className={`mt-4 ${
                      isApproved 
                        ? "bg-gray-400 cursor-not-allowed" 
                        : "bg-green-700 hover:bg-green-800"
                    } text-white px-4 py-2 rounded w-full font-bold`}
                  >
                    {isApproved ? "✔️ Crew Locked" : "✅ Submit & Lock Assignment"}
                  </button>

                  {statuses[flight.id] && (
                    <div className={`mt-4 font-semibold ${isApproved ? "text-green-700" : "text-red-600"}`}>
                      Status: {statuses[flight.id]}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}