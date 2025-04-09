from flask import Blueprint, request, jsonify
from controllers.assignment_controller import assign_flight_resources

assignments_bp = Blueprint('assignments', __name__)

@assignments_bp.route('/api/assignments', methods=['POST'])
def assign_resources():
    data = request.get_json()
    result = assign_flight_resources(
        data.get('flightId'),
        data.get('gateId'),
        data.get('runwayId'),
        data.get('crewId')
    )
    return jsonify(result)