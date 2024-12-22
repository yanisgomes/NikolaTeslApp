from flask import Blueprint, jsonify, request
from flask_cors import cross_origin
from ..models import Circuit
from .. import db
from datetime import datetime

galerie_bp = Blueprint('galerie', __name__, url_prefix='/galerie')

@galerie_bp.route('/', methods=['GET'])
@cross_origin()
def get_galerie():
    circuits = Circuit.query.all()
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

@galerie_bp.route('/', methods=['POST'])
@cross_origin()
def add_circuit():
    data = request.json

    if not data:
        return jsonify({"message": "Les données doivent être au format JSON."}), 400

    if 'nom' not in data or 'description' not in data or 'auteur' not in data or 'date' not in data or 'netlist' not in data:
        return jsonify({"message": "Données manquantes."}), 400

    new_circuit = Circuit(
        nom=data['nom'],
        description=data['description'],
        image=data.get('image', ''),
        auteur=data['auteur'],
        date=datetime.strptime(data['date'], '%Y-%m-%d'),
        netlist=data['netlist']
    )
    db.session.add(new_circuit)
    db.session.commit()
    return jsonify({"message": "Circuit ajouté avec succès."}), 201

@galerie_bp.route('/<int:circuit_id>', methods=['DELETE'])
@cross_origin()
def delete_circuit(circuit_id):
    circuit = Circuit.query.get(circuit_id)
    if circuit is None:
        return jsonify({"message": "Circuit introuvable."}), 404
    db.session.delete(circuit)
    db.session.commit()
    return jsonify({"message": "Circuit supprimé avec succès."}), 200

@galerie_bp.route('/<int:circuit_id>', methods=['PUT'])
@cross_origin()
def update_circuit(circuit_id):
    circuit = Circuit.query.get(circuit_id)
    if circuit is None:
        return jsonify({"message": "Circuit introuvable."}), 404
    
    data = request.json
    circuit.nom = data.get('nom', circuit.nom)
    circuit.description = data.get('description', circuit.description)
    circuit.image = data.get('image', circuit.image)
    circuit.auteur = data.get('auteur', circuit.auteur)
    circuit.date = datetime.strptime(data['date'], '%Y-%m-%d')
    circuit.netlist = data.get('netlist', circuit.netlist)
    
    db.session.commit()
    return jsonify({"message": "Circuit modifié avec succès."}), 200
