import json

def extract_features(input_file_path, output_file_path):
    # Read the GeoJSON file
    with open(input_file_path, 'r') as input_file:
        data = json.load(input_file)
    
    # Check if the GeoJSON contains the required format
    if 'type' in data and data['type'] == 'FeatureCollection' and 'features' in data:
        # Extract the features array
        features = data['features']

        # Write the features array to a new GeoJSON file
        with open(output_file_path, 'w') as output_file:
            json.dump(features, output_file, indent=2)

        print(f"Features extracted and saved to '{output_file_path}'.")
    else:
        print("Invalid GeoJSON format. Make sure it's a FeatureCollection with 'features' array.")

if __name__ == "__main__":
    # Replace these with the appropriate file paths
    input_file_path = "data.json"
    output_file_path = "tmpData.json"

    extract_features(input_file_path, output_file_path)
