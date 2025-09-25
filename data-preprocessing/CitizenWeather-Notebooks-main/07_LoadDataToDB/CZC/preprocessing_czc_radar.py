import json
import os
from datetime import datetime, timezone

geojson_dir = './data/czc'

# Path to your timestamp JSON file
timestamp_file = './data//timestamp_czc_radar_utc.json'

output_dir = './data/czc_timestamp'


def utc_to_milliseconds(utc_time):
    try:
        dt = datetime.strptime(utc_time, "%Y-%m-%dT%H:%M:%S.%fZ")
    except ValueError:
        dt = datetime.strptime(utc_time, "%Y-%m-%dT%H:%M:%SZ")
    dt = dt.replace(tzinfo=timezone.utc)
    milliseconds = int(dt.timestamp() * 1000)
    return milliseconds

# Load the timestamp data
with open(timestamp_file, 'r') as file:
    timestamps = json.load(file)

# Process each GeoJSON file
for filename in os.listdir(geojson_dir):
    if filename.endswith('.json'):
        file_id = filename.split('.')[0] + ".801"

        # Find the corresponding timestamp
        timestamp_entry = next((item for item in timestamps if item["id"] == file_id), None)
        
        if timestamp_entry:
            timestamp_milliseconds = utc_to_milliseconds(timestamp_entry["startDate"])

            # Load the GeoJSON file directly without uncompressing
            with open(os.path.join(geojson_dir, filename), 'r') as file:
                topojson_data = json.load(file)

            # Add the timestamp to the properties of the MultiPolygon
            for key in topojson_data['objects']:
                geometry_collection = topojson_data['objects'][key]
                if geometry_collection['type'] == 'GeometryCollection':
                    for geometry in geometry_collection['geometries']:
                        if 'properties' not in geometry:
                            geometry['properties'] = {}
                        geometry['properties']['timestamp'] = timestamp_milliseconds
                        # Rename 'id' to 'threshold', if 'id' exists
                        if 'ID' in geometry['properties']:
                            geometry['properties']['threshold'] = geometry['properties'].pop('ID')

            # Save the modified TopoJSON to a new file
            modified_filename = os.path.join(output_dir, f"modified_{filename}")
            with open(modified_filename, 'w') as file:
                json.dump(topojson_data, file)
