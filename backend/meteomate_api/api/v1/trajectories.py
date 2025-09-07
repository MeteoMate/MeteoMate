import json, gzip
from flask import Blueprint, request, jsonify
from meteomate_api.core.db import pool
from meteomate_api.core.config import Config
import pandas as pd
from meteomate_api.services.get_trajectories import get_trajectories_between_dates

bp = Blueprint("trajectories", __name__)

@bp.get("/trajectories")
def get_trajectories():
    '''get precalculated tobac trajectories'''
    starttime =  pd.to_datetime(request.args.get('starttime', default="2022-05-04 00:00:00"))
    endtime = pd.to_datetime(request.args.get('endtime', default="2022-05-04 23:55:00"))
    return get_trajectories_between_dates(starttime.strftime("%Y-%m-%d %H:%M:%S"), endtime.strftime("%Y-%m-%d %H:%M:%S"))