"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function ResourceManagerAssignGateRunway() {
  const [flights, setFlights] = useState([]);
  const [crew, setCrew] = useState([]);
  const [gates, setGates] = useState([]);
  const [assignments, setAssignments] = useState({});
  const [statuses, setStatuses] = useState({});
  const [assignedCrew, setAssignedCrew] = useState([]);

  // Fetch data from JSON files
  useEffect(() => {
    fetch("/aircraftDetails.json")
  .then((response) => response.json())
  .then((data) => {
    // Use the correct property 'aircrafts' and filter based on 'status'
    setFlights(data.aircrafts.filter((aircraft) => aircraft.status === "Available"));
  })
  .catch((error) => console.error("Error fetching aircraft details:", error));

    fetch("/crewDetails.json")
      .then((response) => response.json())
      .then((data) => setCrew(data.crew.filter((member) => member.availability === "Standby")))
      .catch((error) => console.error("Error fetching crew details:", error));

    fetch("/flightDetails.json")
      .then((response) => response.json())
      .then((data) => {
        const availableGates = Object.keys(data.gates)
          .filter((gate) => parseInt(gate.replace("G", "")) <= 20 && !data.gates[gate].flightId)
          .map((gate) => gate);
        setGates(availableGates);
      })
      .catch((error) => console.error("Error fetching gate details:", error));
  }, []);

  // Handle dropdown changes for gate, runway, and crew
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
    const currentFlightAssignment = assignments[flightId] || {};
    const currentCrew = currentFlightAssignment.crew || {
      pilot: "",
      copilot: "",
      attendants: ["", ""],
      groundStaff: ["", ""],
    };

    // Remove old value from assignedCrew
    let oldValue = "";
    if (role === "attendants" || role === "groundStaff") {
      oldValue = currentCrew[role][index] || "";
    } else {
      oldValue = currentCrew[role] || "";
    }

    const newCrew = { ...currentCrew };
    if (role === "attendants" || role === "groundStaff") {
      newCrew[role] = [...currentCrew[role]];
      newCrew[role][index] = value;
    } else {
      newCrew[role] = value;
    }

    // Update assignments and assignedCrew
    setAssignments((prev) => ({
      ...prev,
      [flightId]: {
        ...currentFlightAssignment,
        crew: newCrew,
      },
    }));

    setAssignedCrew((prev) => {
      const updated = [...prev];
      if (oldValue) updated.splice(updated.indexOf(oldValue), 1);
      if (value) updated.push(value);
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
      setStatuses((prev) => ({ ...prev, [flightId]: "Approved" }));
      alert(` Assignment for flight ${flightId} submitted successfully!`);
    } else {
      alert(` Please fill all required fields for flight ${flightId}.`);
    }
  };

  // Filter available crew members for dropdowns
  const getAvailableCrew = (role, flightId, currentValue) => {
    return crew
      .filter((member) => member.role === role && (!assignedCrew.includes(member.name) || member.name === currentValue))
      .map((member) => member.name);
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
        <h2 className="text-3xl font-bold mb-6 text-rose-900"> Scheduled Flights - Assignments</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {flights.map((flight) => {
            const data = assignments[flight.id] || {};
            const crew = data.crew || {
              pilot: "",
              copilot: "",
              attendants: ["", ""],
              groundStaff: ["", ""],
            };
            const isApproved = statuses[flight.id] === "Approved";

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

                <p><strong> From:</strong> {flight.src}</p>
                <p><strong> To:</strong> {flight.dest}</p>
                <p><strong> Time:</strong> {flight.datetime}</p>
                <p><strong> Aircraft:</strong> {flight.name} ({flight.model})</p>
                <p><strong> Capacity:</strong> {flight.capacity}</p>

                <div className="mt-4 space-y-2">
                  {/* Gate Select */}
                  {/* <div>
                    <label className="mr-2 font-medium">Gate:</label>
                    <select
                      disabled={isApproved}
                      value={data.gate || ""}
                      onChange={(e) => handleChange(flight.id, "gate", e.target.value)}
                      className={`border rounded px-2 py-1 w-full ${isApproved ? "bg-gray-100" : ""}`}
                    >
                      <option value="">Select</option>
                      {gates.map((gate) => (
                        <option key={gate}>{gate}</option>
                      ))}
                    </select>
                  </div> */}

                  {/* Runway Select */}
                  {/* <div>
                    <label className="mr-2 font-medium">Runway:</label>
                    <select
                      disabled={isApproved}
                      value={data.runway || ""}
                      onChange={(e) => handleChange(flight.id, "runway", e.target.value)}
                      className={`border rounded px-2 py-1 w-full ${isApproved ? "bg-gray-100" : ""}`}
                    >
                      <option value="">Select</option>
                      {["R1", "R2", "R3"].map((runway) => (
                        <option key={runway}>{runway}</option>
                      ))}
                    </select>
                  </div> */}

                  <h4 className="mt-3 font-semibold text-rose-700"> Crew Assignment</h4>

                  {/* Pilot Selection */}
                  <div>
                    <label className="mr-2 font-medium">Pilot:</label>
                    <select
                      disabled={isApproved}
                      value={crew.pilot || ""}
                      onChange={(e) => handleCrewChange(flight.id, "pilot", e.target.value)}
                      className={`border rounded px-2 py-1 w-full ${isApproved ? "bg-gray-100" : ""}`}
                    >
                      <option value="">Select Pilot</option>
                      {getAvailableCrew("Pilot", flight.id, crew.pilot).map((p) => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  </div>

                  {/* Co-Pilot Selection */}
                  <div>
                    <label className="mr-2 font-medium">Co-Pilot:</label>
                    <select
                      disabled={isApproved}
                      value={crew.copilot || ""}
                      onChange={(e) => handleCrewChange(flight.id, "copilot", e.target.value)}
                      className={`border rounded px-2 py-1 w-full ${isApproved ? "bg-gray-100" : ""}`}
                    >
                      <option value="">Select Co-Pilot</option>
                      {getAvailableCrew("Co-Pilot", flight.id, crew.copilot).map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  {/* Attendants Selection */}
                  <div>
                    <label className="font-medium">Attendants:</label>
                    {[...Array(flight.capacity < 150 ? 1 : 2)].map((_, i) => (
                      <div key={i} className="mt-1">
                        <select
                          disabled={isApproved}
                          value={crew.attendants[i] || ""}
                          onChange={(e) => handleCrewChange(flight.id, "attendants", e.target.value, i)}
                          className={`w-full border px-2 py-1 rounded mb-1 ${isApproved ? "bg-gray-100" : ""}`}
                        >
                          <option value="">{`Select Attendant ${i + 1}`}</option>
                          {getAvailableCrew("Flight Attendant", flight.id, crew.attendants[i]).map((a) => (
                            <option key={a} value={a}>{a}</option>
                          ))}
                        </select>
                      </div>
                    ))}
                  </div>

                  {/* Ground Staff Selection */}
                  <div>
                    <label className="font-medium">Ground Staff:</label>
                    {[...Array(flight.capacity < 200 ? 1 : 2)].map((_, i) => (
                      <div key={i} className="mt-1">
                        <select
                          disabled={isApproved}
                          value={crew.groundStaff[i] || ""}
                          onChange={(e) => handleCrewChange(flight.id, "groundStaff", e.target.value, i)}
                          className={`w-full border px-2 py-1 rounded mb-1 ${isApproved ? "bg-gray-100" : ""}`}
                        >
                          <option value="">{`Select Ground Staff ${i + 1}`}</option>
                          {getAvailableCrew("Ground Staff", flight.id, crew.groundStaff[i]).map((g) => (
                            <option key={g} value={g}>{g}</option>
                          ))}
                        </select>
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
                    {isApproved ? " Crew Locked" : " Submit"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}