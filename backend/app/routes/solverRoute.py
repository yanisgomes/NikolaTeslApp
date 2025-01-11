from flask import Blueprint, jsonify, request
from ..models import Circuit_db
from .. import db
from datetime import datetime, timezone
from solver import Solver
from parser import Parser
from circuit import Circuit
from simulator import Simulator
import json

solver_bp = Blueprint('solver', __name__, url_prefix='/solver')

# GET request at http://127.0.0.1:3000/solver/equation/1 
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

# GET request at http://127.0.0.1:3000/solver/solution/1 
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

# GET request at http://127.0.0.1:3000/solver/tf/1?i=3&o=1
@solver_bp.route('/tf/<int:circuit_id>', methods=['GET'])
def get_transfer_function(circuit_id):
    circuit_db = Circuit_db.query.get_or_404(circuit_id)
    # Access query parameters
    inputNode = request.args.get('i')
    outputNode = request.args.get('o')
    #TODO for debug always true
    if not circuit_db.transfer_function or True:
        # Run the function to generate equations
        component_list, node_list = Parser.parse_netlist(circuit_db.netlist)
        circuit = Circuit(component_list, node_list)
        solver = Solver(circuit)
        analytictf = solver.transferFunction_to_string(inputNode, outputNode)

        circuit_db.transfer_function = json.dumps(analytictf)
        db.session.commit()  # Save the newly generated equations to the database
    
    # Convert the JSON string back to a list of equations
    analytictf = json.loads(circuit_db.transfer_function)

    return jsonify({
        "id": circuit_db.id,
        "nom": circuit_db.nom,
        "description": circuit_db.description,
        "image": circuit_db.image,
        "auteur": circuit_db.auteur,
        "date": circuit_db.date.strftime('%Y-%m-%d'),
        "netlist": circuit_db.netlist,
        "transfer function": analytictf
    })

# GET request at http://127.0.0.1:3000/solver/step/1?i=3&o=1
@solver_bp.route('/step/<int:circuit_id>', methods=['GET'])
def get_step_response(circuit_id):
    circuit_db = Circuit_db.query.get_or_404(circuit_id)
    # Access query parameters
    inputNode = request.args.get('i')
    outputNode = request.args.get('o')
    #TODO for debug always true
    if not circuit_db.transfer_function or True:
        # Run the function to generate equations
        component_list, node_list = Parser.parse_netlist(circuit_db.netlist)
        circuit = Circuit(component_list, node_list)
        solver = Solver(circuit)
        analytictf = solver.transferFunction_to_string(inputNode, outputNode)
        num, denom = solver.getNumericalTransferFunction(inputNode, outputNode)
        simu = Simulator(circuit, num, denom)

        # Calculer reponse indicielle
        t, x, y = simu.getStepResponse()

        # Combine the lists into a dictionary
        step_data = {
            "time_list": t.tolist(),  # Convert numpy array to list
            "step_list": x.tolist(),  # Convert numpy array to list
            "step_response": y.tolist()  # Convert numpy array to list
        }

        # Enregistrer les valeurs dans la base de données
        circuit_db.step_data = json.dumps(step_data)
        db.session.commit()  # Save the newly generated equations to the database
    
    # Convert the JSON string back to a dictionary
    step_data = json.loads(circuit_db.step_data)

    return jsonify({
        "id": circuit_db.id,
        "nom": circuit_db.nom,
        "description": circuit_db.description,
        "image": circuit_db.image,
        "auteur": circuit_db.auteur,
        "date": circuit_db.date.strftime('%Y-%m-%d'),
        "netlist": circuit_db.netlist,
        "step response": {
            "time_list": step_data["time_list"],
            "step_list": step_data["step_list"],
            "step_response": step_data["step_response"]
        }
    })

# GET request at http://127.0.0.1:3000/solver/bode/1?i=3&o=1
@solver_bp.route('/bode/<int:circuit_id>', methods=['GET'])
def get_bode_response(circuit_id):
    circuit_db = Circuit_db.query.get_or_404(circuit_id)
    # Access query parameters
    inputNode = request.args.get('i')
    outputNode = request.args.get('o')
    #TODO for debug always true
    if not circuit_db.transfer_function or True:
        # Run the function to generate equations
        component_list, node_list = Parser.parse_netlist(circuit_db.netlist)
        circuit = Circuit(component_list, node_list)
        solver = Solver(circuit)
        analytictf = solver.transferFunction_to_string(inputNode, outputNode)
        num, denom = solver.getNumericalTransferFunction(inputNode, outputNode)
        simu = Simulator(circuit, num, denom)

        # Calculer reponse fréquentielle
        w, mag, phase = simu.getFrequencyResponse()

        # Combine the lists into a dictionary
        bode_data = {
            "frequency_list": w.tolist(),  # Convert numpy array to list
            "magnitude_list": mag.tolist(),  # Convert numpy array to list
            "phase_list": phase.tolist()  # Convert numpy array to list
        }

        # Enregistrer les valeurs dans la base de données
        circuit_db.bode_data = json.dumps(bode_data)
        db.session.commit()

    # Convert the JSON string back to a dictionary
    bode_data = json.loads(circuit_db.bode_data)

    return jsonify({
        "id": circuit_db.id,
        "nom": circuit_db.nom,
        "description": circuit_db.description,
        "image": circuit_db.image,
        "auteur": circuit_db.auteur,
        "date": circuit_db.date.strftime('%Y-%m-%d'),
        "netlist": circuit_db.netlist,
        "bode response": {
            "frequency_list": bode_data["frequency_list"],
            "magnitude_list": bode_data["magnitude_list"],
            "phase_list": bode_data["phase_list"]
        }
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