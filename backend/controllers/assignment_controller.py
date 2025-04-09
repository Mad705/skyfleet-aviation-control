from models.Flight import Flight
from models.Gate import Gate
from models.Runway import Runway
from models.Crew import Crew

# In-memory mock data
gates = [Gate("G1"), Gate("G2")]
runways = [Runway("R1"), Runway("R2")]
crews = [Crew("C1"), Crew("C2")]
flights = [Flight("F1"), Flight("F2")]

def assign_flight_resources(flight_id, gate_id, runway_id, crew_id):
    flight = next((f for f in flights if f.flight_id == flight_id), None)
    gate = next((g for g in gates if g.gate_id == gate_id and g.available), None)
    runway = next((r for r in runways if r.runway_id == runway_id and r.available), None)
    crew = next((c for c in crews if c.crew_id == crew_id and c.available), None)

    if not all([flight, gate, runway, crew]):
        return {"success": False, "message": "Invalid or unavailable resources"}

    flight.assign_gate(gate)
    flight.assign_runway(runway)
    flight.assign_crew(crew)

    gate.available = False
    runway.available = False
    crew.available = False

    return {"success": True, "message": f"Resources assigned to flight {flight_id}"}