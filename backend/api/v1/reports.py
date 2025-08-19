import json, gzip
from flask import Blueprint, request, jsonify
from backend.core.db import pool
from backend.core.config import Config
from psycopg.rows import dict_row
from psycopg import sql

bp = Blueprint("reports", __name__)

@bp.get("/reports")
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

    params = {'qualityCheckPassed': quality_check_passed, 'timesReportedForWeather': times_reported_for_weather,
          'starttime': starttime, 'endtime': endtime,'categories': categories, }
    
    sql = f''' SELECT 
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
        FROM {Config.REPORTS_TABLE_NAME} as reports_table
        WHERE reports_table.qualitycheckpassed = %(qualityCheckPassed)s and
        timesReportedForWeather < %(timesReportedForWeather)s and
        timestamp >= %(starttime)s and timestamp <= %(endtime)s and
        reports_table.category = ANY(%(categories)s) {image_condition}'''

    with pool.connection() as conn, conn.cursor(row_factory=dict_row) as cur:
        cur.execute(sql, params)
        rows = cur.fetchall()

    return jsonify(rows)

@bp.post("/getData")
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
    params = {'qualityCheckPassed': quality_check_passed, 'timesReportedForWeather': times_reported_for_weather_lt,
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
        FROM {Config.REPORTS_TABLE_NAME}
        WHERE {Config.REPORTS_TABLE_NAME}.qualitycheckpassed = %(qualityCheckPassed)s and
        timesReportedForWeather < %(timesReportedForWeather)s and
        timestamp > %(timestamp_gt)s and timestamp < %(timestamp_lt)s and
        {Config.REPORTS_TABLE_NAME}.category = ANY(%(categories)s)'''

    # add possible filter values if necessary
    if place:
        params['place'] = place
        sql_in = sql_in + ''' and {Config.REPORTS_TABLE_NAME}.place = ANY(%(place)s)'''
        
    if auspraegung:
        params['auspraegung'] = auspraegung
        sql_in = sql_in + ''' and {Config.REPORTS_TABLE_NAME}.auspraegung = ANY(%(auspraegung)s)'''

    if only_without_image:
        sql_in = sql_in + ''' and ({Config.REPORTS_TABLE_NAME}.imageurl is Null or {Config.REPORTS_TABLE_NAME}.timesreportedforimage > 0)'''

    if only_with_image:
        sql_in = sql_in + ''' and {Config.REPORTS_TABLE_NAME}.imageurl is not Null and {Config.REPORTS_TABLE_NAME}.timesreportedforimage < 1'''


    with pool.connection() as conn, conn.cursor(row_factory=dict_row) as cur:
        cur.execute(sql_in, params)
        rows = cur.fetchall()

    return jsonify(rows)


@bp.get("/clusterImage")
def get_cluster_image():

    starttime =  request.args.get('starttime', default=1633586400000)
    endtime = request.args.get('endtime', default=1654192800000)

    categories = request.args.getlist('category')

    quality_check_passed = True

    params = {
        'qualityCheckPassed': quality_check_passed,
        'starttime': starttime,
        'endtime': endtime,
        'categories': categories,
    }

    where = [
            "reports_table.qualitycheckpassed = %(qualityCheckPassed)s",
            "timestamp >= %(starttime)s",
            "timestamp <= %(endtime)s",
            "imageurl IS NOT NULL",
        ]
    if categories:
        params["categories"] = categories
        where.append("reports_table.category = ANY(%(categories)s::text[])")

    query = sql.SQL(f"""
        SELECT
            cluster_id,
            ARRAY_AGG(meldungId) AS ids
        FROM (
            SELECT *,
                   ST_ClusterDBSCAN(wkb_geometry, eps := 0.04, minpoints := 3) OVER () AS cluster_id
            FROM {{t}} AS reports_table
            WHERE {" AND ".join(where)}
        ) AS clustered_reports
        WHERE cluster_id IS NOT NULL
        GROUP BY cluster_id
        ORDER BY cluster_id
    """).format(t=sql.Identifier(Config.REPORTS_TABLE_NAME))

    with pool.connection() as conn, conn.cursor(row_factory=dict_row) as cur:
        cur.execute(query, params)
        rows = cur.fetchall()

    clusters = [{"cluster_id": r["cluster_id"], "ids": r["ids"]} for r in rows]
    return jsonify(clusters)