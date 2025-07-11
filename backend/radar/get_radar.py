import json
import os
import datetime

def get_radar_from_file(starttime):
    filename = starttime + '.geojson'
    with open('radar/' + filename, 'r') as json_file:
        data = json.load(json_file)
    return data

def get_radar_from_file_gzip(starttime):
    filename = starttime + '.json.gz'  # Assuming the file is already compressed
    filepath = os.path.join('radar/czc', filename)
    
    # Ensure the file exists
    if not os.path.exists(filepath):
        return None  # Or handle the missing file appropriately

    with open(filepath, 'rb') as gzip_file:
        gzip_data = gzip_file.read()
    
    return gzip_data

def get_radar_files_between(starttime, endtime, radar_data='radar/output.json', base_dir='radar/czc'):
    """
    Generate file paths for radar files within the given start and end times.
    """
    if isinstance(starttime, int):
        starttime = datetime.utcfromtimestamp(starttime / 1000)
    if isinstance(endtime, int):
        endtime = datetime.utcfromtimestamp(endtime / 1000)

    for entry in radar_data:
        entry_start_date = datetime.strptime(entry["startDate"], "%Y-%m-%dT%H:%M:%S.%fZ")
        if starttime <= entry_start_date <= endtime:
            # Construct the filename using the 'id' field
            filename = f"{entry['id']}.json.gz"
            filepath = os.path.join(base_dir, filename)
            if os.path.exists(filepath):
                yield filepath

def process_file(filepath):
    """
    Process a single radar file: decompress, load JSON, add timestamp, and return the updated data.
    """
    # Extract timestamp from the filename
    timestamp = os.path.basename(filepath).split('.')[0]
    
    with gzip.open(filepath, 'rt', encoding='utf-8') as gzip_file:
        data = json.load(gzip_file)
    
    # Assuming the data is GeoJSON
    for feature in data['features']:
        feature['properties']['timestamp'] = timestamp
    
    return data

def get_and_process_radar_data(starttime, endtime):
    """
    Get and process radar data files between starttime and endtime.
    """
    processed_data = []
    for filepath in get_radar_files_between(starttime, endtime):
        processed_file_data = process_file(filepath)
        processed_data.append(processed_file_data)
    return processed_data