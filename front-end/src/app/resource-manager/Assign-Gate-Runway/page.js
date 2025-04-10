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

const availableGates = ["A1", "A2", "B1", "C3"];
const availableRunways = ["R1", "R2", "R3"];
const availableCrew = {
  pilots: ["Capt. Raj", "Capt. Meera"],
  copilots: ["Co. Aryan", "Co. Priya"],
  attendants: ["Amit", "Neha", "Sara", "John"],
  groundStaff: ["Rahul", "Divya", "Manoj", "Sneha"],
};

export default function ResourceManagerAssignGateRunway() {
  const [assignments, setAssignments] = useState({});
  const [statuses, setStatuses] = useState({});

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
      const crew = prev[flightId]?.crew || {
        pilot: "",
        copilot: "",
        attendants: ["", ""],
        groundStaff: ["", ""],
      };

      if (role === "attendants" || role === "groundStaff") {
        crew[role][index] = value;
      } else {
        crew[role] = value;
      }

      return {
        ...prev,
        [flightId]: {
          ...prev[flightId],
          crew,
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
      alert("✅ Assignment for flight ${flightId} submitted successfully!");
    } else {
      alert("⚠️ Please fill all required fields for flight ${flightId}.");
    }
  };

  return (
    <div className="min-h-screen bg-yellow-50">
      <nav className="bg-rose-800 text-white px-6 py-4 shadow-md flex justify-between items-center">
        <h1 className="text-xl font-bold">🛠️ Resource Manager</h1>
        <div className="space-x-10">
          <Link href="/resource-manager/dashboard" className="hover:underline">
            Dashboard
          </Link>
          <Link href="/resource-manager/crew-availability" className="hover:underline">
            Crew Availability
          </Link>
          <Link href="/resource-manager/Aircraft-maintenance" className="hover:underline">
            Aircraft Maintenance
          </Link>
          <Link href="/resource-manager/Assign-Gate-Runway" className="underline font-semibold">
            Assign Gate 🛫
          </Link>
        </div>
      </nav>

      <div className="p-10">
        <h2 className="text-3xl font-bold mb-6 text-rose-900">✈️ Scheduled Flights - Assignments</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dummyFlights.map((flight) => {
            const isApproved = statuses[flight.id] === "Approved";

            return (
              <div
                key={flight.id}
                className={`bg-white p-5 rounded-2xl shadow-md border hover:shadow-xl transition ${
                  isApproved ? "opacity-70" : ""
                }`}
              >
                <h3 className="text-xl font-semibold text-rose-800 mb-2">{flight.id}</h3>
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
                      onChange={(e) => handleChange(flight.id, "gate", e.target.value)}
                      className="border rounded px-2 py-1"
                    >
                      <option value="">Select</option>
                      {availableGates.map((gate) => (
                        <option key={gate}>{gate}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="mr-2 font-medium">Runway:</label>
                    <select
                      disabled={isApproved}
                      onChange={(e) => handleChange(flight.id, "runway", e.target.value)}
                      className="border rounded px-2 py-1"
                    >
                      <option value="">Select</option>
                      {availableRunways.map((runway) => (
                        <option key={runway}>{runway}</option>
                      ))}
                    </select>
                  </div>

                  <h4 className="mt-3 font-semibold text-rose-700">👨‍✈️ Crew Assignment</h4>

                  {/* Pilot Dropdown */}
                  <select
                    disabled={isApproved}
                    onChange={(e) => handleCrewChange(flight.id, "pilot", e.target.value)}
                    className="w-full border px-2 py-1 rounded"
                  >
                    <option value="">Select Pilot</option>
                    {availableCrew.pilots.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>

                  {/* Copilot Dropdown */}
                  <select
                    disabled={isApproved}
                    onChange={(e) => handleCrewChange(flight.id, "copilot", e.target.value)}
                    className="w-full border px-2 py-1 rounded"
                  >
                    <option value="">Select Copilot</option>
                    {availableCrew.copilots.map((c) => (
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
                      onChange={(e) => handleCrewChange(flight.id, "attendants", e.target.value, i)}
                      className="w-full border px-2 py-1 rounded"
                    >
                      <option value="">Select Attendant {i + 1}</option>
                      {availableCrew.attendants.map((a) => (
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
                      onChange={(e) => handleCrewChange(flight.id, "groundStaff", e.target.value, i)}
                      className="w-full border px-2 py-1 rounded"
                    >
                      <option value="">Select Ground Staff {i + 1}</option>
                      {availableCrew.groundStaff.map((g) => (
                        <option key={g} value={g}>
                          {g}
                        </option>
                      ))}
                    </select>
                  ))}

                  <button
                    disabled={isApproved}
                    onClick={() => handleSubmit(flight.id)}
                    className={`mt-4 ${
                      isApproved ? "bg-gray-400 cursor-not-allowed" : "bg-green-700 hover:bg-green-800"
                    } text-white px-4 py-2 rounded w-full`}
                  >
                    {isApproved ? "✔️ Submitted" : "✅ Submit Assignment"}
                  </button>
                </div>

                {statuses[flight.id] && (
                  <div
                    className={`mt-4 font-semibold ${
                      isApproved ? "text-green-700" : "text-red-600"
                    }`}
                  >
                    Status: {statuses[flight.id]}
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