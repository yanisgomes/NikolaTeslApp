from flask import Flask, jsonify, request

app = Flask(__name__)

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
