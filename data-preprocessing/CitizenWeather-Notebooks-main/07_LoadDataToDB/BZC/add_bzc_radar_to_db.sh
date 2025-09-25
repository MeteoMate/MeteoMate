#!/bin/bash

# Directory containing the GeoJSON files
DIRECTORY=./data/bzc_timestamp

# Construct the PostgreSQL connection string
PG_CONN="dbname=postgres user=postgres password=mysecretpassword host=localhost port=5432"

# Name of the table to store the geometries
TABLE_NAME="bzc_radar"

# Process the first file to create the table
FIRST_FILE=true

# Assuming modified_BZC221240955VL.845.geojson is already processed as first file
# If not, uncomment the following line to process it first.
 ogr2ogr -f "PostgreSQL" "PG:$PG_CONN" "$DIRECTORY/modified_BZC221240955VL.845.geojson" -nln "$TABLE_NAME" -nlt PROMOTE_TO_MULTI

# Loop through each .geojson file in the directory
for FILE in $DIRECTORY/*.geojson; do
    echo "Processing file: $FILE"
    BASENAME=$(basename "$FILE")
    if [ "$BASENAME" = "modified_BZC221240955VL.845.geojson" ]; then
        echo "Skipping file: $FILE"
        continue
    fi
    # For subsequent files, append to the existing table
    ogr2ogr -f "PostgreSQL" "PG:$PG_CONN" "$FILE" -nln "$TABLE_NAME" -nlt PROMOTE_TO_MULTI -append
done
