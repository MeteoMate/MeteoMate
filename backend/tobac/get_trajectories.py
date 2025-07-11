import json
from datetime import datetime

def get_trajectories_from_file(timestr):
    with open('tobac/trajectories.json', 'r') as json_file:
        data = json.load(json_file)
        response = data.get(timestr, None)
        if response == None:
            return '''{
                "type": "FeatureCollection",
                "features": []}'''
        else:
            return response
        
def get_trajectories_between_dates(target_startdate_str, target_enddate_str):
    
    target_startdate = datetime.strptime(target_startdate_str, "%Y-%m-%d %H:%M:%S")
    target_enddate = datetime.strptime(target_enddate_str, "%Y-%m-%d %H:%M:%S")

    with open('tobac/trajectories.json', 'r') as json_file:
        data = json.load(json_file)
        
    matched_data = {"type": "FeatureCollection", "features": []}

    for date_str, features in data.items():
        current_date = datetime.strptime(date_str, "%Y-%m-%d %H:%M:%S")
        
        if current_date <= target_enddate and current_date >= target_startdate:
            for feature in features['features']:
                feature_with_date = feature.copy()
                feature_with_date['properties']['date'] = date_str
                matched_data['features'].append(feature_with_date)
                
    return matched_data