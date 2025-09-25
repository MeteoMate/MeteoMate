import json
import os
from datetime import datetime, timezone

geojson_dir = './data/bzc'

# Path to your timestamp JSON file
timestamp_file = './data/timestamp_bzc_radar_utc.json'

output_dir = './data/bzc_timestamp'


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
    if filename.endswith('.geojson'):
        file_id = filename.split('.')[0] + '.845'


        # Find the corresponding timestamp
        timestamp_entry = next((item for item in timestamps if item["id"] == file_id), None)
        print(file_id)

        if timestamp_entry:
            timestamp_milliseconds = utc_to_milliseconds(timestamp_entry["startDate"])

            # Load the GeoJSON file
            with open(os.path.join(geojson_dir, filename), 'r') as file:
                geojson_data = json.load(file)

            # Add the timestamp to the properties of each feature
            for feature in geojson_data['features']:
                if 'properties' not in feature:
                    feature['properties'] = {}
                feature['properties']['timestamp'] = timestamp_milliseconds
                # Rename 'id' to 'threshold', if 'id' exists
                if 'id' in feature['properties']:
                    feature['properties']['threshold'] = feature['properties'].pop('id')

            # Save the modified GeoJSON to a new file
            modified_filename = os.path.join(output_dir, f"modified_{filename}")
            with open(modified_filename, 'w') as file:
                json.dump(geojson_data, file)
