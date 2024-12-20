from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/galerie', methods=['GET'])
def get_galerie():
    """Retourne la liste des circuits dans la base de données."""
    # On créer artificiellement une liste de circuits avec les attributs suivants:
    # - id: identifiant unique du circuit
    # - nom: nom du circuit
    # - description: description du circuit
    # - image: nom du fichier image du circuit
    # - auteur: nom de l'auteur du circuit
    # - date: date de création du circuit
    # - netlist: netlist du circuit (le plus important, cela décrit le circuit)

    circuits = [
        {
            "id": 1,
            "nom": "Circuit 1",
            "description": "Ceci est le circuit 1",
            "image": "image1.jpg",
            "auteur": "Auteur 1",
            "date": "2024-12-01",
            "netlist": "netlist1"
        },
        {
            "id": 2,
            "nom": "Circuit 2",
            "description": "Ceci est le circuit 2",
            "image": "image2.jpg",
            "auteur": "Auteur 2",
            "date": "2024-12-02",
            "netlist": "netlist2"
        },
        {
            "id": 3,
            "nom": "Circuit 3",
            "description": "Ceci est le circuit 3",
            "image": "image3.jpg",
            "auteur": "Auteur 3",
            "date": "2024-12-03",
            "netlist": "netlist3"
        }
    ]

    return jsonify(circuits)



@app.route('/api/data', methods=['GET'])
def get_data():
    """Retourne un exemple de données."""
    return jsonify({"message": "Hello depuis l'API", "status": "success"})

@app.route('/api/echo', methods=['POST'])
def echo_data():
    """Retourne les données envoyées dans la requête."""
    data = request.json
    return jsonify({"received": data, "status": "success"})

@app.route('/api/add', methods=['POST'])
def add_numbers():
    """Additionne deux nombres."""
    data = request.json
    try:
        num1 = data.get("num1")
        num2 = data.get("num2")
        result = num1 + num2
        return jsonify({"result": result, "status": "success"})
    except Exception as e:
        return jsonify({"error": str(e), "status": "failure"}), 400

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3000)
