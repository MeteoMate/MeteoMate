#!/bin/bash

# Directory containing the GeoJSON files
DIRECTORY=./data/czc_timestamp

# Construct the PostgreSQL connection string
PG_CONN="dbname=postgres user=postgres password=mysecretpassword host=localhost port=5432"

# Name of the table to store the geometries
TABLE_NAME="czc_radar"

# Process the first file to create the table
FIRST_FILE=true

# Loop through each .geojson file in the directory
for FILE in $DIRECTORY/*.json; do
    if $FIRST_FILE; then
        # For the first file, create the table
        ogr2ogr -f "PostgreSQL" "PG:$PG_CONN" "$FILE" -nln "$TABLE_NAME" -nlt PROMOTE_TO_MULTI
        FIRST_FILE=false
    else
        # For subsequent files, append to the existing table
        ogr2ogr -f "PostgreSQL" "PG:$PG_CONN" "$FILE" -nln "$TABLE_NAME" -nlt PROMOTE_TO_MULTI -append
    fi
done