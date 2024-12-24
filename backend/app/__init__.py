from flask import Flask
from flask_sqlalchemy import SQLAlchemy
import os
from flask_cors import CORS

db = SQLAlchemy()

def create_app():
    app = Flask(__name__)
    CORS(app)

    # Configuration de l'application
    BASE_DIR = os.path.abspath(os.path.dirname(os.path.dirname(__file__)))
    DB_DIR = os.path.join(BASE_DIR, 'data')
    os.makedirs(DB_DIR, exist_ok=True)
    app.config['SQLALCHEMY_DATABASE_URI'] = f"sqlite:///{os.path.join(DB_DIR, 'circuits.db')}"
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['UPLOAD_FOLDER'] = os.path.join(DB_DIR, 'uploads')

    # Initialisation des extensions
    db.init_app(app)

    # Enregistrement des blueprints
    from .routes import init_routes
    init_routes(app)

    with app.app_context():
        db.create_all()

    return app
