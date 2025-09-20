import os
from flask import Flask
from meteomate_api.core.config import Config
from meteomate_api.api.v1.radar import bp as radar_bp
from meteomate_api.api.v1.reports import bp as reports_bp
from meteomate_api.api.v1.trajectories import bp as traj_bp


APP_ENV = os.getenv("APP_ENV", "development")


def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)
    
    app.register_blueprint(radar_bp, url_prefix='/api/v1')
    app.register_blueprint(reports_bp, url_prefix='/api/v1')
    app.register_blueprint(traj_bp, url_prefix='/api/v1')

    return app