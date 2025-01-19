from flask import Blueprint, jsonify, request
from ..models import Circuit_db
from .. import db
from datetime import datetime, timezone

galerie_bp = Blueprint('galerie', __name__, url_prefix='/galerie')

@galerie_bp.route('/', methods=['GET'])
def get_galerie():
    try:
        circuits = Circuit_db.query.all()
    except Exception as e:
        return jsonify({"error": "Failed to retrieve circuits", "details": str(e)}), 500

    return jsonify([
        {
            "id": circuit.id,
            "nom": circuit.nom,
            "description": circuit.description,
            "image": circuit.image,
            "auteur": circuit.auteur,
            "date": circuit.date.strftime('%Y-%m-%d'),
            "netlist": circuit.netlist
        }
        for circuit in circuits
    ])

# Test at http://127.0.0.1:3000/galerie/
""" with body : {
    "id": 1,
    "nom": "circuit",
    "description": "Circuit test disponible ici https://lpsa.swarthmore.edu/Systems/Electrical/mna/MNA6.html",
    "image": "Capacitor",
    "auteur": "Basile",
    "date": "11/01",
    "netlist": "Vin 3 0 R2 3 2 1000 R1 1 0 1000 C1 1 0 1E-6 C2 2 1 10E-6 L1 1 0 0.001",
    "json": " "
    }"""
@galerie_bp.route('/', methods=['POST'])
def add_circuit():
    data = request.json

    if not data:
        return jsonify({"message": "Les données doivent être au format JSON."}), 400

    if 'nom' not in data or 'description' not in data or 'auteur' not in data or 'netlist' not in data:
        return jsonify({"message": "Données manquantes."}), 400

    try:
        new_circuit = Circuit_db(
            nom=data['nom'],
            description=data['description'],
            image=f"{data['nom']}.png",
            auteur=data['auteur'],
            date=datetime.now(timezone.utc),
            netlist=data['netlist'],
            json=data['json']
        )
        db.session.add(new_circuit)
        db.session.commit()
    except Exception as e:
        return jsonify({"error": "Failed to add circuit", "details": str(e)}), 500
    
    return jsonify({
        "message": "Circuit ajouté avec succès.",
        "circuit": {
            "id": new_circuit.id,
            "nom": new_circuit.nom,
            "description": new_circuit.description,
            "image": new_circuit.image,
            "auteur": new_circuit.auteur,
            "date": new_circuit.date.strftime('%Y-%m-%d'),
            "netlist": new_circuit.netlist
        }
    }), 201

"""Exemple de json a envoyer pour ajouter un circuit :

{
    "id": 1,
    "nom": "circuit",
    "description": "Circuit test disponible ici https://lpsa.swarthmore.edu/Systems/Electrical/mna/MNA6.html",
    "image": "Capacitor",
    "auteur": "Basile",
    "date": "11/01",
    "netlist": "Vin 3 0 R2 3 2 1000 R1 1 0 1000 C1 1 0 1E-6 C2 2 1 10E-6 L1 1 0 0.001"
}

"""

@galerie_bp.route('/<int:circuit_id>', methods=['DELETE'])
def delete_circuit(circuit_id):
    circuit = Circuit_db.query.get(circuit_id)
    if circuit is None:
        return jsonify({"message": "Circuit introuvable."}), 404
    
    try:
        db.session.delete(circuit)
        db.session.commit()
    except Exception as e:
        return jsonify({"error": "Failed to delete circuit", "details": str(e)}), 500

    return jsonify({"message": "Circuit supprimé avec succès."}), 200

@galerie_bp.route('/<int:circuit_id>', methods=['PUT'])
def update_circuit(circuit_id):
    circuit = Circuit_db.query.get(circuit_id)
    if circuit is None:
        return jsonify({"message": "Circuit introuvable."}), 404
    
    data = request.json
    if not data:
        return jsonify({"message": "Les données doivent être au format JSON."}), 400

    try:
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
    except Exception as e:
        return jsonify({"error": "Failed to update circuit", "details": str(e)}), 500

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