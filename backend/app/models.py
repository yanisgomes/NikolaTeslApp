from . import db
from datetime import datetime

class Circuit_db(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nom = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=False)
    image = db.Column(db.String(255))
    auteur = db.Column(db.String(255), nullable=False)
    date = db.Column(db.Date, nullable=False, default=datetime.utcnow)
    netlist = db.Column(db.Text, nullable=False)
    equations = db.Column(db.String(2048), nullable=True) # Store equations as JSON string
    explanations = db.Column(db.String(2048), nullable=True) # Explanations for each equation
    solutions = db.Column(db.String(2048), nullable=True)
    time_data = db.Column(db.String, nullable=True)  # Store time list and response as JSON string
    frequency_response = db.Column(db.String, nullable=True)  # Store as JSON string
    frequency_list = db.Column(db.String, nullable=True)      # Store as JSON string