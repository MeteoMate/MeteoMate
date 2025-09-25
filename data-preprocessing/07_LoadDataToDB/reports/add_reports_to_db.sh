#!/bin/bash

# PostgreSQL connection string
PG_CONN="dbname=your_database user=your_username password=your_password host=localhost port=5432"

# Path to the GeoJSON file
GEOJSON_FILE="/data/reports.geojson"

# Name of the table in which to store the geometries
TABLE_NAME="reports"

# Import the GeoJSON file into the PostgreSQL database
ogr2ogr -f "PostgreSQL" "PG:$PG_CONN" "$GEOJSON_FILE" -nln "$TABLE_NAME" -nlt PROMOTE_TO_MULTI
