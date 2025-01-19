from flask import Blueprint, jsonify, request
from ..models import Circuit_db
from .. import db
from datetime import datetime, timezone
from solver import Solver
from parser123 import Parser
from circuit import Circuit
from simulator import Simulator
import json

solver_bp = Blueprint('solver', __name__, url_prefix='/solver')

# GET request at http://127.0.0.1:3000/solver/equation/1 
@solver_bp.route('/equation/<int:circuit_id>', methods=['GET'])
def get_equation(circuit_id):
    circuit_db = Circuit_db.query.get_or_404(circuit_id)
    
    try :
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
    except ValueError as e:
        return jsonify({"error : ": str(e)}), 400

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
    
    try :
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
    except ValueError as e:
        return jsonify({"error : ": str(e)}), 400

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
    try :
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
    except ValueError as e:
        return jsonify({"error : ": str(e)}), 400
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
        try :
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
        except ValueError as e:
                return jsonify({"error : ": str(e)}), 400
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
#TODO Retrun error message
# GET request at http://127.0.0.1:3000/solver/bode/1?i=3&o=1
@solver_bp.route('/bode/<int:circuit_id>', methods=['GET'])
def get_bode_response(circuit_id):
    circuit_db = Circuit_db.query.get_or_404(circuit_id)
    # Access query parameters
    inputNode = request.args.get('i')
    outputNode = request.args.get('o')
    #TODO for debug always true
    if not circuit_db.transfer_function or True:
        try :
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
        except ValueError as e:
            return jsonify({"erreor : ": str(e)}), 400
            

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

## PUT requests used to both update and get solver data

# ------------------------------------------------------------------------------
# Case 1: No numeric resolution, no input/output nodes -> only equations, explanations, solutions
# ------------------------------------------------------------------------------
# Test at http://127.0.0.1:3000/solver/config/basic/1 with body
"""
{
  "id": 1,
  "nom": "circuit",
  "description": "Circuit test disponible ici https://lpsa.swarthmore.edu/Systems/Electrical/mna/MNA6.html",
  "image": "Capacitor",
  "auteur": "Basile",
  "date": "11/01",
  "netlist": "Vin 3 0 \n R2 3 2 1000 \n R1 1 0 1000 \n C1 1 0 1E-6 \n C2 2 1 10E-6 \n L1 1 0 0.001",
  "json": "[{\"id\":\"Vin\",\"type\":\"VoltageSource\",\"name\":\"Vin\",\"valeur\":\"Symbolic\"},{\"id\":\"R2\",\"type\":\"Resistance\",\"name\":\"R2\",\"valeur\":1000},{\"id\":\"R1\",\"type\":\"Resistance\",\"name\":\"R1\",\"valeur\":1000},{\"id\":\"C1\",\"type\":\"Condensateur\",\"name\":\"C1\",\"valeur\":1e-6},{\"id\":\"C2\",\"type\":\"Condensateur\",\"name\":\"C2\",\"valeur\":1e-5},{\"id\":\"L1\",\"type\":\"Bobine\",\"name\":\"L1\",\"valeur\":0.001},{\"id\":\"node0\",\"type\":\"noeud\",\"name\":\"node0\"},{\"id\":\"node1\",\"type\":\"noeud\",\"name\":\"node1\"},{\"id\":\"link_node3\",\"type\":\"link\",\"source\":{\"id\":\"Vin\"},\"target\":{\"id\":\"R2\"}},{\"id\":\"link_node2\",\"type\":\"link\",\"source\":{\"id\":\"R2\"},\"target\":{\"id\":\"C2\"}},{\"id\":\"link_Vin_node0\",\"type\":\"link\",\"source\":{\"id\":\"Vin\"},\"target\":{\"id\":\"node0\"}},{\"id\":\"link_R1_node1\",\"type\":\"link\",\"source\":{\"id\":\"R1\"},\"target\":{\"id\":\"node1\"}},{\"id\":\"link_R1_node0\",\"type\":\"link\",\"source\":{\"id\":\"R1\"},\"target\":{\"id\":\"node0\"}},{\"id\":\"link_C1_node1\",\"type\":\"link\",\"source\":{\"id\":\"C1\"},\"target\":{\"id\":\"node1\"}},{\"id\":\"link_C1_node0\",\"type\":\"link\",\"source\":{\"id\":\"C1\"},\"target\":{\"id\":\"node0\"}},{\"id\":\"link_L1_node1\",\"type\":\"link\",\"source\":{\"id\":\"L1\"},\"target\":{\"id\":\"node1\"}},{\"id\":\"link_L1_node0\",\"type\":\"link\",\"source\":{\"id\":\"L1\"},\"target\":{\"id\":\"node0\"}},{\"id\":\"link_C2_node1\",\"type\":\"link\",\"source\":{\"id\":\"C2\"},\"target\":{\"id\":\"node1\"}}]"
}
"""
@solver_bp.route('/config/basic/<int:circuit_id>', methods=['PUT'])
def update_circuit_basic(circuit_id):
    data = request.json or {}
    circuit = Circuit_db.query.get(circuit_id)
    if circuit is None:
        return jsonify({"message": "Circuit introuvable."}), 404
    
    data = request.json
    if not data:
        return jsonify({"message": "Les données doivent être au format JSON."}), 400

    # Update circuit fields
    try:
        if 'nom' in data:
            circuit.nom = data.get('nom', circuit.nom)
        if 'description' in data:
            circuit.description = data.get('description', circuit.description)
        if 'auteur' in data:
            circuit.auteur = data.get('auteur', circuit.auteur)
        if ('netlist' in data) and (not 'json' in data):
            circuit.netlist = data.get('netlist', circuit.netlist)
        if 'image' in data:
            circuit.image = data.get('image', circuit.image)
        if 'json' in data:
            circuit.json = data.get('json', circuit.json)
            netlist = Parser.json_to_netlist(circuit.json)
            circuit.netlist = netlist
        circuit.date = datetime.now(timezone.utc)
        db.session.commit()
    except Exception as e:
        return jsonify({"error": "Failed to update circuit", "details": str(e)}), 500

    circuit_db = Circuit_db.query.get_or_404(circuit_id)
    # Parse the netlist and build the circuit
    component_list, node_list = Parser.parse_netlist(circuit_db.netlist)
    circuit = Circuit(component_list, node_list)
    solver = Solver(circuit)

    # Store equations, explanations, and solutions in DB
    circuit_db.equations = json.dumps(solver.equations_to_strings())
    circuit_db.explanations = json.dumps(solver.explanations)
    circuit_db.solutions = json.dumps(solver.solutions_to_strings())
    # Clear any old TF, Bode, Step
    circuit_db.transfer_function = None
    circuit_db.bode_data = None
    circuit_db.step_data = None

    db.session.commit()

    return jsonify({
        "message": "Circuit updated (basic).",
        "id": circuit_db.id,
        "nom": circuit_db.nom,
        "description": circuit_db.description,
        "image": circuit_db.image,
        "auteur": circuit_db.auteur,
        "date": circuit_db.date.strftime('%Y-%m-%d'),
        "netlist": circuit_db.netlist,
        "equations": json.loads(circuit_db.equations),
        "explanations": json.loads(circuit_db.explanations),
        "solutions": json.loads(circuit_db.solutions)
    }), 200

# ------------------------------------------------------------------------------
# Case 2: Input/output specified, but still no numeric values -> return equations, explanations, solutions, plus TF
# ------------------------------------------------------------------------------
# Test at http://127.0.0.1:3000/solver/config/io/1?i=3&o=1 with body
"""
{
  "id": 1,
  "nom": "circuit",
  "description": "Circuit test disponible ici https://lpsa.swarthmore.edu/Systems/Electrical/mna/MNA6.html",
  "image": "Capacitor",
  "auteur": "Basile",
  "date": "11/01",
  "netlist": "Vin 3 0 \n R2 3 2 1000 \n R1 1 0 1000 \n C1 1 0 1E-6 \n C2 2 1 10E-6 \n L1 1 0 0.001",
  "json": "[{\"id\":\"Vin\",\"type\":\"VoltageSource\",\"name\":\"Vin\",\"valeur\":\"Symbolic\"},{\"id\":\"R2\",\"type\":\"Resistance\",\"name\":\"R2\",\"valeur\":1000},{\"id\":\"R1\",\"type\":\"Resistance\",\"name\":\"R1\",\"valeur\":1000},{\"id\":\"C1\",\"type\":\"Condensateur\",\"name\":\"C1\",\"valeur\":1e-6},{\"id\":\"C2\",\"type\":\"Condensateur\",\"name\":\"C2\",\"valeur\":1e-5},{\"id\":\"L1\",\"type\":\"Bobine\",\"name\":\"L1\",\"valeur\":0.001},{\"id\":\"0\",\"type\":\"noeud\",\"name\":\"0\"},{\"id\":\"1\",\"type\":\"noeud\",\"name\":\"1\"},{\"id\":\"link_3\",\"type\":\"link\",\"source\":{\"id\":\"Vin\"},\"target\":{\"id\":\"R2\"}},{\"id\":\"link_2\",\"type\":\"link\",\"source\":{\"id\":\"R2\"},\"target\":{\"id\":\"C2\"}},{\"id\":\"link_Vin_0\",\"type\":\"link\",\"source\":{\"id\":\"Vin\"},\"target\":{\"id\":\"0\"}},{\"id\":\"link_R1_1\",\"type\":\"link\",\"source\":{\"id\":\"R1\"},\"target\":{\"id\":\"1\"}},{\"id\":\"link_R1_0\",\"type\":\"link\",\"source\":{\"id\":\"R1\"},\"target\":{\"id\":\"0\"}},{\"id\":\"link_C1_1\",\"type\":\"link\",\"source\":{\"id\":\"C1\"},\"target\":{\"id\":\"1\"}},{\"id\":\"link_C1_0\",\"type\":\"link\",\"source\":{\"id\":\"C1\"},\"target\":{\"id\":\"0\"}},{\"id\":\"link_L1_1\",\"type\":\"link\",\"source\":{\"id\":\"L1\"},\"target\":{\"id\":\"1\"}},{\"id\":\"link_L1_0\",\"type\":\"link\",\"source\":{\"id\":\"L1\"},\"target\":{\"id\":\"0\"}},{\"id\":\"link_C2_1\",\"type\":\"link\",\"source\":{\"id\":\"C2\"},\"target\":{\"id\":\"1\"}}]"
}
"""
@solver_bp.route('/config/io/<int:circuit_id>', methods=['PUT'])
def update_circuit_io(circuit_id):
    data = request.json or {}
    circuit = Circuit_db.query.get(circuit_id)
    if circuit is None:
        return jsonify({"message": "Circuit introuvable."}), 404
    
    data = request.json
    if not data:
        return jsonify({"message": "Les données doivent être au format JSON."}), 400

    # Update circuit fields
    try:
        if 'nom' in data:
            circuit.nom = data.get('nom', circuit.nom)
        if 'description' in data:
            circuit.description = data.get('description', circuit.description)
        if 'auteur' in data:
            circuit.auteur = data.get('auteur', circuit.auteur)
        if ('netlist' in data) and (not 'json' in data):
            circuit.netlist = data.get('netlist', circuit.netlist)
        if 'image' in data:
            circuit.image = data.get('image', circuit.image)
        if 'json' in data:
            circuit.json = data.get('json', circuit.json)
            netlist = Parser.json_to_netlist(circuit.json)
            circuit.netlist = netlist
        circuit.date = datetime.now(timezone.utc)
        db.session.commit()
    except Exception as e:
        return jsonify({"error": "Failed to update circuit", "details": str(e)}), 500

    circuit_db = Circuit_db.query.get_or_404(circuit_id)

    # Retrieve input/output from request (e.g. i=3, o=1)
    inputNode = request.args.get('i')
    outputNode = request.args.get('o')

    # Parse the netlist and build the circuit
    component_list, node_list = Parser.parse_netlist(circuit_db.netlist)
    circuit = Circuit(component_list, node_list)
    solver = Solver(circuit)

    # Store equations, explanations, solutions
    circuit_db.equations = json.dumps(solver.equations_to_strings())
    circuit_db.explanations = json.dumps(solver.explanations)
    circuit_db.solutions = json.dumps(solver.solutions_to_strings())

    # Compute and store symbolic Transfer Function
    if inputNode and outputNode:
        tf_str = solver.transferFunction_to_string(inputNode, outputNode)
        circuit_db.transfer_function = tf_str
    else:
        circuit_db.transfer_function = None

    # Clear old Bode/Step
    circuit_db.bode_data = None
    circuit_db.step_data = None

    db.session.commit()
    return jsonify({
        "message": "Circuit updated (basic).",
        "id": circuit_db.id,
        "nom": circuit_db.nom,
        "description": circuit_db.description,
        "image": circuit_db.image,
        "auteur": circuit_db.auteur,
        "date": circuit_db.date.strftime('%Y-%m-%d'),
        "netlist": circuit_db.netlist,
        "equations": json.loads(circuit_db.equations),
        "explanations": json.loads(circuit_db.explanations),
        "solutions": json.loads(circuit_db.solutions),
        "transfer_function": circuit_db.transfer_function
    }), 200


# ------------------------------------------------------------------------------
# Case 3: Both numeric and input/output nodes -> return everything: eq, expl, sol, TF, Bode, Step
# ------------------------------------------------------------------------------
@solver_bp.route('/config/io-numeric/<int:circuit_id>', methods=['PUT'])
def update_circuit_io_numeric(circuit_id):
    circuit = Circuit_db.query.get_or_404(circuit_id)
    data = request.json or {}
    inputNode = request.args.get('i')
    outputNode = request.args.get('o')

    if circuit is None:
        return jsonify({"message": "Circuit introuvable."}), 404
    
    data = request.json
    if not data:
        return jsonify({"message": "Les données doivent être au format JSON."}), 400

    # Update circuit fields
    try:
        if 'nom' in data:
            circuit.nom = data.get('nom', circuit.nom)
        if 'description' in data:
            circuit.description = data.get('description', circuit.description)
        if 'auteur' in data:
            circuit.auteur = data.get('auteur', circuit.auteur)
        if ('netlist' in data) and (not 'json' in data):
            circuit.netlist = data.get('netlist', circuit.netlist)
        if 'image' in data:
            circuit.image = data.get('image', circuit.image)
        if 'json' in data:
            circuit.json = data.get('json', circuit.json)
            netlist = Parser.json_to_netlist(circuit.json)
            circuit.netlist = netlist
        circuit.date = datetime.now(timezone.utc)
        db.session.commit()
    except Exception as e:
        return jsonify({"error": "Failed to update circuit", "details": str(e)}), 500
    
    circuit_db = Circuit_db.query.get_or_404(circuit_id)

    # Parse netlist, build circuit
    component_list, node_list = Parser.parse_netlist(circuit_db.netlist)
    circuit = Circuit(component_list, node_list)
    solver = Solver(circuit)

    # Equations, explanations, solutions
    circuit_db.equations = json.dumps(solver.equations_to_strings())
    circuit_db.explanations = json.dumps(solver.explanations)
    circuit_db.solutions = json.dumps(solver.solutions_to_strings())

    # Transfer Function (symbolic)
    if inputNode and outputNode:
        circuit_db.transfer_function = solver.transferFunction_to_string(inputNode, outputNode)
        # Numeric TF and Bode, Step responses
        num, denom = solver.getNumericalTransferFunction(inputNode, outputNode)
        simulator = Simulator(circuit, num, denom)
        
        # Save Bode data
        freq, mag, phase = simulator.getFrequencyResponse()
        bode_data = {
            "freq": freq.tolist(),
            "mag": mag.tolist(),
            "phase": phase.tolist()
        }
        circuit_db.bode_data = json.dumps(bode_data)

        # Save Step data
        t, x, y = simulator.getStepResponse()
        step_data = {
            "time": t.tolist(),
            "input": x.tolist(),
            "output": y.tolist()
        }
        circuit_db.step_data = json.dumps(step_data)
    else:
        # No input/output specified -> no numeric TF, Bode, Step
        circuit_db.transfer_function = None
        circuit_db.bode_data = None
        circuit_db.step_data = None

    db.session.commit()

    return jsonify({
        "message": "Circuit updated (basic).",
        "id": circuit_db.id,
        "nom": circuit_db.nom,
        "description": circuit_db.description,
        "image": circuit_db.image,
        "auteur": circuit_db.auteur,
        "date": circuit_db.date.strftime('%Y-%m-%d'),
        "netlist": circuit_db.netlist,
        "equations": json.loads(circuit_db.equations),
        "explanations": json.loads(circuit_db.explanations),
        "solutions": json.loads(circuit_db.solutions),
        "transfer_function": circuit_db.transfer_function,
        "bode_data": json.loads(circuit_db.bode_data) if circuit_db.bode_data else None,
        "step_data": json.loads(circuit_db.step_data) if circuit_db.step_data else None
    }), 200
