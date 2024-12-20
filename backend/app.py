from flask import Flask, jsonify, request, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from datetime import datetime
import os

app = Flask(__name__)
CORS(app)

# Configuration de la base de données SQLite
BASE_DIR = os.path.abspath(os.path.dirname(__file__))
DB_DIR = os.path.join(BASE_DIR, 'data')
os.makedirs(DB_DIR, exist_ok=True)
app.config['SQLALCHEMY_DATABASE_URI'] = f"sqlite:///{os.path.join(DB_DIR, 'circuits.db')}"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['UPLOAD_FOLDER'] = os.path.join(DB_DIR, 'uploads')


db = SQLAlchemy(app)

# Modèle de données pour la table 'circuits'
class Circuit(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nom = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=False)
    image = db.Column(db.String(255))
    auteur = db.Column(db.String(255), nullable=False)
    date = db.Column(db.Date, nullable=False, default=datetime.utcnow)
    netlist = db.Column(db.Text, nullable=False)

def create_tables():
    db.create_all()

# Endpoint pour récupérer les circuits
@app.route('/galerie', methods=['GET'])
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

# Endpoint pour ajouter un nouveau circuit
@app.route('/galerie', methods=['POST'])
def add_circuit():
    data = request.json
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


@app.route('/uploads/<filename>', methods=['GET'])
def serve_image(filename):
    return send_from_directory(os.path.join(BASE_DIR, 'data/uploads'), filename)

# Endpoint pour supprimer un circuit
@app.route('/galerie/<int:circuit_id>', methods=['DELETE'])
def delete_circuit(circuit_id):
    circuit = Circuit.query.get(circuit_id)
    if circuit is None:
        return jsonify({"message": "Circuit introuvable."}), 404
    db.session.delete(circuit)
    db.session.commit()
    return jsonify({"message": "Circuit supprimé avec succès."}), 200


# Endpoint pour modifier un circuit
@app.route('/galerie/<int:circuit_id>', methods=['PUT'])
def update_circuit(circuit_id):
    circuit = Circuit.query.get(circuit_id)
    if circuit is None:
        return jsonify({"message": "Circuit introuvable."}), 404
    
    data = request.json
    circuit.nom = data.get('nom', circuit.nom)  # Update only if provided
    circuit.description = data.get('description', circuit.description)
    circuit.image = data.get('image', circuit.image)
    circuit.auteur = data.get('auteur', circuit.auteur)
    circuit.date = datetime.strptime(data['date'], '%Y-%m-%d')
    circuit.netlist = data.get('netlist', circuit.netlist)
    
    db.session.commit()
    return jsonify({"message": "Circuit modifié avec succès."}), 200



if __name__ == '__main__':
    with app.app_context():
        create_tables()
    app.run(host='0.0.0.0', port=3000)


