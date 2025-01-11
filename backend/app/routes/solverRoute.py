from flask import Blueprint, jsonify, request
from ..models import Circuit_db
from .. import db
from datetime import datetime, timezone
from solver import Solver
from parser import Parser
from circuit import Circuit
import json

solver_bp = Blueprint('solver', __name__, url_prefix='/solver')


@solver_bp.route('/equation/<int:circuit_id>', methods=['GET'])
def get_equation(circuit_id):
    circuit_db = Circuit_db.query.get_or_404(circuit_id)
    
    #TODO for debug always true
    if not circuit_db.equations:
        # Run the function to generate equations
        component_list, node_list = Parser.parse_netlist(circuit_db.netlist)
        circuit = Circuit(component_list, node_list)
        solver = Solver(circuit)
        circuit_db.equations = json.dumps(solver.equations_to_strings())
        circuit_db.explanations = json.dumps(solver.explanations)
        db.session.commit()  # Save the newly generated equations to the database
    
    # Convert the JSON string back to a list of equations
    equations = json.loads(circuit_db.equations)
    explanations = json.loads(circuit_db.explanations)

    return jsonify({
        "id": circuit_db.id,
        "nom": circuit_db.nom,
        "description": circuit_db.description,
        "image": circuit_db.image,
        "auteur": circuit_db.auteur,
        "date": circuit_db.date.strftime('%Y-%m-%d'),
        "netlist": circuit_db.netlist,
        "equations": equations,
        "explanations": explanations
    })

@solver_bp.route('/solution/<int:circuit_id>', methods=['GET'])
def get_solution(circuit_id):
    circuit_db = Circuit_db.query.get_or_404(circuit_id)
    
    #TODO for debug always true
    if not circuit_db.solutions:
        # Run the function to generate equations
        component_list, node_list = Parser.parse_netlist(circuit_db.netlist)
        circuit = Circuit(component_list, node_list)
        solver = Solver(circuit)
        circuit_db.solutions = json.dumps(solver.solutions_to_strings())
        db.session.commit()  # Save the newly generated equations to the database
    
    # Convert the JSON string back to a list of equations
    solutions = json.loads(circuit_db.solutions)

    return jsonify({
        "id": circuit_db.id,
        "nom": circuit_db.nom,
        "description": circuit_db.description,
        "image": circuit_db.image,
        "auteur": circuit_db.auteur,
        "date": circuit_db.date.strftime('%Y-%m-%d'),
        "netlist": circuit_db.netlist,
        "solution": solutions
    })

@solver_bp.route('/<int:circuit_id>', methods=['DELETE'])
def delete_circuit(circuit_id):
    circuit = Circuit_db.query.get(circuit_id)
    if circuit is None:
        return jsonify({"message": "Circuit introuvable."}), 404
    
    db.session.delete(circuit)
    db.session.commit()

    return jsonify({"message": "Circuit supprimé avec succès."}), 200


@solver_bp.route('/<int:circuit_id>', methods=['PUT'])
def update_circuit(circuit_id):
    circuit = Circuit_db.query.get(circuit_id)
    if circuit is None:
        return jsonify({"message": "Circuit introuvable."}), 404
    
    data = request.json
    if not data:
        return jsonify({"message": "Les données doivent être au format JSON."}), 400

    if 'nom' in data:
        circuit.nom = data.get('nom', circuit.nom)
    if 'description' in data:
        circuit.description = data.get('description', circuit.description)
    if 'auteur' in data:
        circuit.auteur = data.get('auteur', circuit.auteur)
    if 'netlist' in data:
        circuit.netlist = data.get('netlist', circuit.netlist)
    circuit.date = datetime.now(timezone.utc)

    
    db.session.commit()

    return jsonify({
        "message": "Circuit modifié avec succès.",
        "circuit": {
            "id": circuit.id,
            "nom": circuit.nom,
            "description": circuit.description,
            "image": circuit.image,
            "auteur": circuit.auteur,
            "date": circuit.date.strftime('%Y-%m-%d'),
            "netlist": circuit.netlist
        }
    }), 200