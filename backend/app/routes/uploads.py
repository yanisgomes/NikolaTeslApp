from flask import Blueprint, send_from_directory, current_app
import os
from flask_cors import cross_origin

uploads_bp = Blueprint('uploads', __name__, url_prefix='/uploads')

@uploads_bp.route('/<filename>', methods=['GET'])
@cross_origin()
def serve_image(filename):
    upload_folder = current_app.config['UPLOAD_FOLDER']
    return send_from_directory(upload_folder, filename)
