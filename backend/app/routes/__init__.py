from flask import Blueprint

def init_routes(app):
    from .galerie import galerie_bp
    from .uploads import uploads_bp
    from .solverRoute import solver_bp

    app.register_blueprint(galerie_bp)
    app.register_blueprint(uploads_bp)
    app.register_blueprint(solver_bp)
