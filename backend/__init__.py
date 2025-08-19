from flask import Flask
from flask_cors import CORS
from .core.config import Config
from .core.db import pool
from .api.v1.radar import bp as radar_bp
from .api.v1.reports import bp as reports_bp
from .api.v1.trajectories import bp as traj_bp
from flask_compress import Compress


def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

        
    app.config["COMPRESS_MIMETYPES"] = ["application/json", "text/css", "text/html", "application/javascript"]
    app.config["COMPRESS_LEVEL"] = 6
    app.config["COMPRESS_MIN_SIZE"] = 1024

    Compress(app)
    CORS(app)

    app.register_blueprint(radar_bp, url_prefix='/api/v1')
    app.register_blueprint(reports_bp, url_prefix='/api/v1')
    app.register_blueprint(traj_bp, url_prefix='/api/v1')

    return app