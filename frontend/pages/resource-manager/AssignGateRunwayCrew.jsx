import { useState } from "react";

export default function AssignGateRunwayCrew() {
  const [form, setForm] = useState({
    flightId: "",
    gateId: "",
    runwayId: "",
    crewId: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("http://localhost:5000/api/assignments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    alert(data.message);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Assign Gate, Runway & Crew</h2>
      <form onSubmit={handleSubmit}>
        <label>Flight ID:</label><br />
        <input name="flightId" onChange={handleChange} /><br />
        <label>Gate ID:</label><br />
        <input name="gateId" onChange={handleChange} /><br />
        <label>Runway ID:</label><br />
        <input name="runwayId" onChange={handleChange} /><br />
        <label>Crew ID:</label><br />
        <input name="crewId" onChange={handleChange} /><br />
        <button type="submit">Assign</button>
      </form>
    </div>
  );
}