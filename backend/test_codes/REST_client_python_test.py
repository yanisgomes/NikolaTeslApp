# server.py
from flask import Flask, request, jsonify
from flask_cors import CORS  # Pour gérer les requêtes CORS
import json

app = Flask(__name__)
CORS(app)  # Activation de CORS pour toutes les routes

# Exemple de données
data = {
    "circuits": [
        {"id": 1, "name": "RLC"},
        {"id": 2, "name": "LC"}
    ]
}

# Route GET pour récupérer tous les circuits
@app.route('/api/circuits', methods=['POST'])
def get_circuits():
    
    data = request.get_json()
    
    try :
        
        return jsonify(data)
    
    except Exception as e :
        
        return "erreur"

# Route GET pour récupérer un circuit par ID
@app.route('/api/circuits/<int:circuit_id>', methods=['GET'])
def get_circuit(circuit_id):
    circuit = next((circuit for circuit in data['circuits'] if circuit['id'] == circuit_id), None)
    if circuit is None:
        return jsonify({"error": "Circuit non trouvé"}), 404
    return jsonify(circuit)

# Route POST pour créer un nouvel circuit
@app.route('/api/circuits', methods=['POST'])
def create_circuit():
    if not request.json or 'name' not in request.json:
        return jsonify({"error": "Données invalides"}), 400
    
    new_circuit = {
        "id": max(circuit['id'] for circuit in data['circuits']) + 1,
        "name": request.json['name']
    }
    data['circuits'].append(new_circuit)
    return jsonify(new_circuit), 201

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=5000)    app.run(host='0.0.0.0', port=5000)    app.run(host='0.0.0.0', port=5000)    app.run(host='0.0.0.0', port=5000)    app.run(host='0.0.0.0', port=5000)