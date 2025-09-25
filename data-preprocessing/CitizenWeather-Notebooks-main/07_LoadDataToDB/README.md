# Load data to database

## Load reports to database

To load the citizen reports from MeteoSchweiz to the database go to the folder [reports](reports) and add the GeoJSON file of the citizen reports to the [data/reports](data/reports) folder. 

### Set your database credentials

Go to [add_reports_to_db.sh](reports/add_reports_to_db.sh) and set your database credentials.

### Make script executable

First you might need to make the script executable by running `chmod +x add_reports_to_db.sh`. 

### Run the script

Afterwards run the bash script `./add_reports_to_db.sh`. First you might need to make the script executable by running `chmod +x add_reports_to_db.sh`. 

## Load CZC radar to database

Load the CZC radar output from [02_CreateVectorRadar_CZC](02_CreateVectorRadar_CZC) into [CZC/data/czc](CZC/data/czc) and run `python3 preprocessing_bzc_radar.py`.

### Set your database credentials

Go to [add_czc_radar_to_db.sh](CZC/add_czc_radar_to_db.sh) and set your database credentials.

### Make script executable

First you might need to make the script executable by running `chmod +x add_czc_radar_to_db.sh`. 

### Run the script

Afterwards run the bash script `./add_czc_radar_to_db.sh`. First you might need to make the script executable by running `chmod +x add_czc_radar_to_db.sh`. 

## Load BZC radar to database

Load the CZC radar output from [02_CreateVectorRadar_BZC](02_CreateVectorRadar_BZC) into [CZC/data/bzc](CZC/data/bzc) and run `python3 preprocessing_bzc_radar.py`.

### Set your database credentials

Go to [add_bzc_radar_to_db.sh](CZC/add_bzc_radar_to_db.sh) and set your database credentials.

### Make script executable

First you might need to make the script executable by running `chmod +x add_bzc_radar_to_db.sh`. 

### Run the script

Afterwards run the bash script `./add_bzc_radar_to_db.sh`. First you might need to make the script executable by running `chmod +x add_bzc_radar_to_db.sh`. 