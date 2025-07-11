from collections import defaultdict
from flask import Flask, jsonify, request, Response
from flask_cors import CORS
import json
import pandas as pd
import psycopg # Psycopg 3
from psycopg.rows import dict_row
from os import environ
import gzip

from tobac.get_trajectories import get_trajectories_between_dates

from dotenv import load_dotenv
import os

load_dotenv()

# connect to db
conn = psycopg.connect(environ.get("DATABASE_URL"), row_factory=dict_row)

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

reports_table = os.getenv('REPORTS_TABLE_NAME', 'reports')
czc_table_name = os.getenv('RADAR_TABLE_NAME', 'radar')
bzc_table_name = os.getenv('BZC_RADAR_TABLE_NAME', 'radar2')



@app.route('/trajectories/', methods=["GET"], strict_slashes=False)
def get_trajectories():
    '''get precalculated tobac trajectories'''
    starttime =  pd.to_datetime(request.args.get('starttime', default="2022-05-04 00:00:00"))
    endtime = pd.to_datetime(request.args.get('endtime', default="2022-05-04 23:55:00"))
    return get_trajectories_between_dates(starttime.strftime("%Y-%m-%d %H:%M:%S"), endtime.strftime("%Y-%m-%d %H:%M:%S"))


@app.route('/radar/', methods=["GET"], strict_slashes=False)
def get_radar():

    starttime =  request.args.get('starttime', default=1633586400000)
    endtime = request.args.get('endtime', default=1654192800000)

    filter_value = {'starttime': starttime , 'endtime': endtime}
    
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
            FROM {czc_table_name}
            WHERE timestamp >= %(starttime)s AND timestamp <= %(endtime)s
            GROUP BY timestamp
        ) as sub;
    '''

    all_features = conn.execute(sql, filter_value).fetchall()
    
    if all_features:
        json_data = json.dumps(all_features[0]['data'])
        compressed_data = gzip.compress(bytes(json_data, 'utf-8'))
        response = Response(compressed_data, mimetype='application/json')
        
        response.headers['Content-Encoding'] = 'gzip'
        
        response.headers['Content-Length'] = str(len(compressed_data))
        
        return response
    else:
        return {}


@app.route('/radar-bzc/', methods=["GET"], strict_slashes=False)
def get_bzc_radar():
        
    starttime =  request.args.get('starttime', default=1633586400000)
    endtime = request.args.get('endtime', default=1654192800000)

    filter_value = {'starttime': starttime , 'endtime': endtime}
    
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
            FROM {bzc_table_name}
            WHERE timestamp >= %(starttime)s AND timestamp <= %(endtime)s
            GROUP BY timestamp
        ) as sub;
    '''

    all_features = conn.execute(sql, filter_value).fetchall()
    
    if all_features:
        json_data = json.dumps(all_features[0]['data'])
        compressed_data = gzip.compress(bytes(json_data, 'utf-8'))
        response = Response(compressed_data, mimetype='application/json')
        
        response.headers['Content-Encoding'] = 'gzip'
        
        response.headers['Content-Length'] = str(len(compressed_data))
        
        return response
    else:
        return {}
    
    
@app.route('/clusterImage/', methods=["GET"], strict_slashes=False)
def get_cluster_image():

    starttime =  request.args.get('starttime', default=1633586400000)
    endtime = request.args.get('endtime', default=1654192800000)

    categories = request.args.getlist('category')

    quality_check_passed = True

    filter_value = {'qualityCheckPassed': quality_check_passed,
                    'starttime': starttime, 'endtime': endtime, 'categories': categories, }

    sql_in = f'''
    SELECT
        cluster_id,
        ARRAY_AGG(meldungId) AS ids
    FROM (
        SELECT *,
            ST_ClusterDBSCAN(wkb_geometry, eps := 0.04, minpoints := 3) OVER () AS cluster_id
        FROM {reports_table}
        WHERE {reports_table}.qualitycheckpassed = %(qualityCheckPassed)s and
        timestamp >= %(starttime)s and timestamp <= %(endtime)s
        AND ({reports_table}.category = ANY(%(categories)s) OR %(categories)s = ARRAY[null])
        AND imageurl IS NOT NULL
    ) AS clustered_reports
    WHERE cluster_id IS NOT NULL
    GROUP BY cluster_id
    ORDER BY cluster_id
    '''

    query = conn.execute(sql_in, filter_value).fetchall()
    clusters = [{'cluster_id': row['cluster_id'], 'ids': row['ids']} for row in query]
    return json.dumps(clusters)


@app.route('/reports/', methods=["GET"], strict_slashes=False)
def get_reports():
    starttime =  request.args.get('starttime', default=1633586400000)
    endtime = request.args.get('endtime', default=1654192800000)
    categories = request.args.getlist('category')
    images = request.args.get('images', default='all')

    if images == 'with':
        image_condition = "AND imageurl IS NOT NULL"
    elif images == 'without':
        image_condition = "AND imageurl IS NULL"
    else:
        image_condition = ""

    quality_check_passed = True
    times_reported_for_weather = 5

    filter_value = {'qualityCheckPassed': quality_check_passed, 'timesReportedForWeather': times_reported_for_weather,
          'starttime': starttime, 'endtime': endtime,'categories': categories, }
    
    sql_in = f''' SELECT 
        meldungId as id,
        ST_AsGeoJSON(wkb_geometry)::json->'coordinates'-> 0 as coordinates,
        category,
        auspraegung,
        timestamp,
        imageurl,
        CASE 
            WHEN timesreportedforimage > 0 OR imageurl IS NULL THEN NULL
            ELSE SPLIT_PART(imageurl, '/', -1)
        END
        as "imageName"
        FROM {reports_table}
        WHERE {reports_table}.qualitycheckpassed = %(qualityCheckPassed)s and
        timesReportedForWeather < %(timesReportedForWeather)s and
        timestamp >= %(starttime)s and timestamp <= %(endtime)s and
        {reports_table}.category = ANY(%(categories)s) {image_condition}'''
        
    # get data from db
    query = conn.execute(sql_in, filter_value).fetchall()
    
    return json.dumps(query)

@app.route('/getData/', methods=["POST"], strict_slashes=False)
def get_data():
    '''get data from postgres database which are specified by filter'''
    filter_data = request.json['$and']
    
    only_without_image = False
    only_with_image = False
    place = None
    auspraegung = None

    # map MangoDB query to SQL query
    for element in filter_data:
        if 'properties.qualityCheckPassed' in element.keys(): 
            quality_check_passed = element['properties.qualityCheckPassed']
            continue
        if 'properties.timesReportedForWeather' in element.keys():
            times_reported_for_weather_lt = element['properties.timesReportedForWeather']['$lt']
            continue
        if 'properties.timestamp' in element.keys():
            timestamp_gt = element['properties.timestamp']['$gt']
            timestamp_lt = element['properties.timestamp']['$lt']
            continue
        if 'properties.category' in element.keys():
            categories = element['properties.category']['$in']
            continue
        if 'properties.auspraegung' in element.keys():
            auspraegung = element['properties.auspraegung']['$in']
            continue
        if 'properties.place' in element.keys():
            place = element['properties.place']['$in']
            continue
        if '$or' in element.keys() and element['$or'][0]['properties.imageUrl'] is None:
            only_without_image = True
            continue
        if 'properties.imageUrl' in element.keys() and element['properties.imageUrl']['$ne'] is None:
            only_with_image = True
    
    
    # create sql call
    filter_value = {'qualityCheckPassed': quality_check_passed, 'timesReportedForWeather': times_reported_for_weather_lt,
          'timestamp_gt': timestamp_gt, 'timestamp_lt': timestamp_lt,'categories': categories, }
    
    sql_in = f''' SELECT 
        meldungId as id,
        ST_AsGeoJSON(wkb_geometry)::json->'coordinates'-> 0 as coordinates,
        category,
        auspraegung,
        timestamp,
        CASE 
            WHEN timesreportedforimage > 0 OR imageurl IS NULL THEN NULL
            ELSE SPLIT_PART(imageurl, '/', -1)
        END
        as "imageName"
        FROM {reports_table}
        WHERE {reports_table}.qualitycheckpassed = %(qualityCheckPassed)s and
        timesReportedForWeather < %(timesReportedForWeather)s and
        timestamp > %(timestamp_gt)s and timestamp < %(timestamp_lt)s and
        {reports_table}.category = ANY(%(categories)s)'''
    
    # add possible filter values if necessary
    if place:
        filter_value['place'] = place
        sql_in = sql_in + ''' and {reports_table}.place = ANY(%(place)s)'''
        
    if auspraegung:
        filter_value['auspraegung'] = auspraegung
        sql_in = sql_in + ''' and {reports_table}.auspraegung = ANY(%(auspraegung)s)'''
    
    if only_without_image:
        sql_in = sql_in + ''' and ({reports_table}.imageurl is Null or {reports_table}.timesreportedforimage > 0)'''
    
    if only_with_image:
        sql_in = sql_in + ''' and {reports_table}.imageurl is not Null and {reports_table}.timesreportedforimage < 1'''
        
    query = conn.execute(sql_in, filter_value).fetchall()
    return json.dumps(query)

if __name__ == "__main__":
    app.run(debug=True)
