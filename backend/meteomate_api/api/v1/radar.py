import json
# import gzip
from flask import Blueprint, request, Response
from meteomate_api.core.db import pool
from meteomate_api.core.config import Config
from psycopg.rows import dict_row

bp = Blueprint("radar", __name__)

@bp.get("/radar-czc")
def get_czc_radar():

    starttime =  request.args.get('starttime', default=1633586400000)
    endtime = request.args.get('endtime', default=1654192800000)

    params = {'starttime': starttime , 'endtime': endtime}
    
    sql = f'''
        SELECT json_object_agg(timestamp, feature_collection) AS data
        FROM (
            SELECT timestamp, 
                json_build_object(
                    'type', 'FeatureCollection',
                    'features', 
                    json_agg(
                        json_build_object(
                            'type', 'Feature',
                            'properties', json_build_object(
                                'ID', threshold
                            ),
                            'geometry', ST_AsGeoJSON(wkb_geometry)::json
                        )
                    )
                ) as feature_collection
            FROM {Config.CZC_RADAR_TABLE_NAME}
            WHERE timestamp >= %(starttime)s AND timestamp <= %(endtime)s
            GROUP BY timestamp
        ) as sub;
    '''

    with pool.connection() as conn, conn.cursor(row_factory=dict_row) as cur:
        cur.execute(sql, params)
        row = cur.fetchone()

    if not row or row["data"] is None:
        return Response(status=204)
    
    json_data = json.dumps(row["data"])
    resp = Response(json_data, mimetype="application/json")
    # compressed = gzip.compress(json_data.encode("utf-8"))
    # resp = Response(compressed, mimetype="application/json")
    # resp.headers["Content-Encoding"] = "gzip"
    # resp.headers["Content-Length"] = str(len(compressed))
    resp.headers["Content-Length"] = str(len(json_data))
    return resp

@bp.get("/radar-bzc")
def get_bzc_radar():       
    starttime =  request.args.get('starttime', default=1633586400000)
    endtime = request.args.get('endtime', default=1654192800000)

    params = {'starttime': starttime , 'endtime': endtime}
    
    sql = f'''
        SELECT json_object_agg(timestamp, feature_collection) AS data
        FROM (
            SELECT timestamp, 
                json_build_object(
                    'type', 'FeatureCollection',
                    'features', 
                    json_agg(
                        json_build_object(
                            'type', 'Feature',
                            'properties', json_build_object(
                                'ID', DN
                            ),
                            'geometry', ST_AsGeoJSON(wkb_geometry)::json
                        )
                    )
                ) as feature_collection
            FROM {Config.BZC_RADAR_TABLE_NAME}
            WHERE timestamp >= %(starttime)s AND timestamp <= %(endtime)s
            GROUP BY timestamp
        ) as sub;
    '''

    with pool.connection() as conn, conn.cursor(row_factory=dict_row) as cur:
        cur.execute(sql, params)
        row = cur.fetchone()

    if not row or row["data"] is None:
        return Response(status=204)
    
    json_data = json.dumps(row["data"])
    resp = Response(json_data, mimetype="application/json")
    # compressed = gzip.compress(json_data.encode("utf-8"))
    # resp = Response(compressed, mimetype="application/json")
    # resp.headers["Content-Encoding"] = "gzip"
    # resp.headers["Content-Length"] = str(len(compressed))
    resp.headers["Content-Length"] = str(len(json_data))
    return resp