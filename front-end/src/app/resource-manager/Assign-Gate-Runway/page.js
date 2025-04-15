"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function ResourceManagerAssignGateRunway() {
  const [assignments, setAssignments] = useState({});
  const [statuses, setStatuses] = useState({});
  const [crew, setCrew] = useState([]);
  const [flightDetails, setFlightDetails] = useState({ gates: {}, runways: {} });
  const [selectedCrew, setSelectedCrew] = useState({});

  // Fetch crew and flight details from JSON files
  useEffect(() => {
    fetch("/crewDetails.json")
      .then((response) => response.json())
      .then((data) => setCrew(data.crew))
      .catch((error) => console.error("Error fetching crew details:", error));

    fetch("/flightDetails.json")
      .then((response) => response.json())
      .then((data) => setFlightDetails(data))
      .catch((error) => console.error("Error fetching flight details:", error));
  }, []);

  const handleChange = (flightId, section, value) => {
    setAssignments((prev) => ({
      ...prev,
      [flightId]: {
        ...prev[flightId],
        [section]: value,
      },
    }));
  };

  const handleCrewChange = (flightId, role, value, index = null) => {
    setAssignments((prev) => {
      const crewAssignment = prev[flightId]?.crew || {
        pilot: "",
        copilot: "",
        attendants: ["", ""],
        groundStaff: ["", ""],
      };

      if (role === "attendants" || role === "groundStaff") {
        crewAssignment[role][index] = value;
      } else {
        crewAssignment[role] = value;
      }

      // Update selected crew to prevent duplicate selection
      setSelectedCrew((prevSelected) => ({
        ...prevSelected,
        [flightId]: {
          ...prevSelected[flightId],
          [role]: value,
        },
      }));

      return {
        ...prev,
        [flightId]: {
          ...prev[flightId],
          crew: crewAssignment,
        },
      };
    });
  };

  const handleSubmit = (flightId) => {
    const data = assignments[flightId];
    const isComplete =
      data?.gate &&
      data?.runway &&
      data?.crew?.pilot &&
      data?.crew?.copilot &&
      data?.crew?.attendants?.length >= 2 &&
      data?.crew?.groundStaff?.length >= 2 &&
      data?.crew?.attendants.every(Boolean) &&
      data?.crew?.groundStaff.every(Boolean);

    if (isComplete) {
      setStatuses((prev) => ({ ...prev, [flightId]: "Approved" }));
      alert(`✅ Assignment for flight ${flightId} submitted successfully!`);
    } else {
      alert(`⚠️ Please fill all required fields for flight ${flightId}.`);
    }
  };

  const getAvailableCrew = (role, flightId) => {
    const selectedForOtherFlights = Object.entries(selectedCrew)
      .filter(([key]) => key !== flightId) // Exclude the current flight
      .flatMap(([, crew]) => Object.values(crew));

    return crew
      .filter((member) => member.role === role && !selectedForOtherFlights.includes(member.name))
      .map((member) => member.name);
  };

  const getAvailableGates = () => {
    return Object.entries(flightDetails.gates)
      .filter(([, details]) => details.status === "Available")
      .map(([gateNumber]) => gateNumber);
  };

  const getAvailableRunways = () => {
    return Object.entries(flightDetails.runways)
      .filter(([, details]) => details.status === "Available")
      .map(([runwayNumber]) => runwayNumber);
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(flightDetails.flights || {}).map(([flightId, flight]) => {
            const isApproved = statuses[flightId] === "Approved";

            return (
              <div
                key={flightId}
                className={`bg-white p-5 rounded-2xl shadow-md border hover:shadow-xl transition ${
                  isApproved ? "opacity-70" : ""
                }`}
              >
                <h3 className="text-xl font-semibold text-rose-800 mb-2">{flightId}</h3>
                <p>
                  <strong>📍 From:</strong> {flight.src}
                </p>
                <p>
                  <strong>📍 To:</strong> {flight.dest}
                </p>
                <p>
                  <strong>🕒 Time:</strong> {flight.datetime}
                </p>
                <p>
                  <strong>🛩️ Aircraft:</strong> {flight.aircraft.name} ({flight.aircraft.model})
                </p>
                <p>
                  <strong>👥 Capacity:</strong> {flight.aircraft.capacity}
                </p>

                <div className="mt-4 space-y-2">
                  <div>
                    <label className="mr-2 font-medium">Gate:</label>
                    <select
                      disabled={isApproved}
                      onChange={(e) => handleChange(flightId, "gate", e.target.value)}
                      className="border rounded px-2 py-1"
                    >
                      <option value="">Select</option>
                      {getAvailableGates().map((gate) => (
                        <option key={gate}>{gate}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="mr-2 font-medium">Runway:</label>
                    <select
                      disabled={isApproved}
                      onChange={(e) => handleChange(flightId, "runway", e.target.value)}
                      className="border rounded px-2 py-1"
                    >
                      <option value="">Select</option>
                      {getAvailableRunways().map((runway) => (
                        <option key={runway}>{runway}</option>
                      ))}
                    </select>
                  </div>

                  <h4 className="mt-3 font-semibold text-rose-700">👨‍✈️ Crew Assignment</h4>

                  {/* Pilot Dropdown */}
                  <select
                    disabled={isApproved}
                    onChange={(e) => handleCrewChange(flightId, "pilot", e.target.value)}
                    className="w-full border px-2 py-1 rounded"
                  >
                    <option value="">Select Pilot</option>
                    {getAvailableCrew("Pilot", flightId).map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>

                  {/* Copilot Dropdown */}
                  <select
                    disabled={isApproved}
                    onChange={(e) => handleCrewChange(flightId, "copilot", e.target.value)}
                    className="w-full border px-2 py-1 rounded"
                  >
                    <option value="">Select Copilot</option>
                    {getAvailableCrew("Co-Pilot", flightId).map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>

                  {/* Attendants */}
                  {[0, 1].map((i) => (
                    <select
                      key={i}
                      disabled={isApproved}
                      onChange={(e) => handleCrewChange(flightId, "attendants", e.target.value, i)}
                      className="w-full border px-2 py-1 rounded"
                    >
                      <option value="">Select Attendant {i + 1}</option>
                      {getAvailableCrew("Flight Attendant", flightId).map((a) => (
                        <option key={a} value={a}>
                          {a}
                        </option>
                      ))}
                    </select>
                  ))}

                  {/* Ground Staff */}
                  {[0, 1].map((i) => (
                    <select
                      key={i}
                      disabled={isApproved}
                      onChange={(e) => handleCrewChange(flightId, "groundStaff", e.target.value, i)}
                      className="w-full border px-2 py-1 rounded"
                    >
                      <option value="">Select Ground Staff {i + 1}</option>
                      {getAvailableCrew("Ground Staff", flightId).map((g) => (
                        <option key={g} value={g}>
                          {g}
                        </option>
                      ))}
                    </select>
                  ))}

                  <button
                    disabled={isApproved}
                    onClick={() => handleSubmit(flightId)}
                    className={`mt-4 ${
                      isApproved ? "bg-gray-400 cursor-not-allowed" : "bg-green-700 hover:bg-green-800"
                    } text-white px-4 py-2 rounded w-full`}
                  >
                    {isApproved ? "✔️ Submitted" : "✅ Submit Assignment"}
                  </button>
                </div>

                {statuses[flightId] && (
                  <div
                    className={`mt-4 font-semibold ${
                      isApproved ? "text-green-700" : "text-red-600"
                    }`}
                  >
                    Status: {statuses[flightId]}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}