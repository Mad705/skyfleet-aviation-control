class Flight:
    def __init__(self, flight_id):
        self.flight_id = flight_id
        self.gate = None
        self.runway = None
        self.crew = None

    def assign_gate(self, gate):
        self.gate = gate

    def assign_runway(self, runway):
        self.runway = runway

    def assign_crew(self, crew):
        self.crew = crew