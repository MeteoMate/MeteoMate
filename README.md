# CitizenWeatherVA

# TLDR

## Frontend

````
yarn install
yarn start
````

## Backend

`````
cd backend
python3 -m venv venv
. venv/bin/activate
`````

`````
python3 -m pip install Flask
python3 -m pip install python-dotenv
python3 -m pip install -U flask-cors
python3 -m pip install pandas
python3 -m pip install psycopg
pip install "psycopg[binary]"
pip install pandas
pip install h5py
pip install cftime
pip install tables
`````

`````
yarn start-api
`````


## Database

add data.geojson to `database/data`

`````
cd database
`````

`````
docker build -t postgis-docker .
`````

`````
docker run -d \
    --name postgis \
    -e POSTGRES_USER=your_username \
    -e POSTGRES_PASSWORD=your_password \
    -e POSTGRES_DB=your_database \
    -e POSTGRES_INITDB_ARGS="--data-checksums" \
    -v postgis_data:/var/lib/postgresql/data \
    -p 5432:5432 \
    postgis-docker
`````

```
docker exec postgis ogr2ogr -f "PostgreSQL" PG:"dbname=your_database user=your_username password=your_password host=localhost port=5432" /tmp/data.geojson -nln reports -nlt PROMOTE_TO_MULTI
```
`````

psql -U your_username -d your_database -h localhost -p 5432 -f data/bzc_radar_dump.sql
psql -U your_username -d your_database -h localhost -p 5432 -f data/czc_radar_dump.sql
`````



# Intro

In her master thesis, Dominique Hässig developed a web application that allows to view these citizen reports and to perform small-scale analysis over time periods. It is possible to choose between different categories of weather events and their intensities. It is also possible to look at a weather event and see how many reports there are from different categories. The reports are clustered with a bubble map in pie charts, and the number of reports from different categories can be analyzed over time. However, the application lacks radar data to compare the reported weather events for analysis and visualization. This project aims to improve the existing application by implementing a feature that enables the comparison of reports from citizens with radar data. With this comparison, it should be able to view at specific weather events and access additional information from the reports. Additionally, the radar data will be used to calculate the trajectories of storms, which can then be compared with the information from the reports. Finally, both the radar data and the reports will be visualized in an appealing manner.

The CitizenWeatherVA consists of two parts, the first part was developed by [Dominique Hässig](https://github.com/dhaess?tab=repositories) in her [master thesis](https://github.com/dhaess/WeaVA) and the second part is an extension, developed by [Alexey Buyakofu](https://github.com/Asysay), [Andreas Huwiler](https://github.com/anhuwi) and [Dario Küffer](https://github.com/dariokueffer) as a master project:

- Citizen Reports visualization: 
This part of the CitizenWeatherVA is the core part developed by Dominique Hässig as his master thesis. It provides several tools to analyse the citizen reports from MeteoSchweiz.
- Compare citizen reports to radar data: This part of the CitizenWeatherVA helps to compare the citizen reports from MeteoSchweiz with the radar data. Currently we only have data for one specific event, although the visual comparison can be done for event 1 only.

The main part of the implementation of the master project is in the [src/pages](src/pages) directory.

## Installation
1. First, we need to install the yarn package manager
`sudo npm install --global yarn`
2. Then,  install all thw components
`yarn install`
3. The backend runs in the api folder
`cd api`

4. Create the environment and install packages

[https://flask.palletsprojects.com/en/2.2.x/installation/](https://flask.palletsprojects.com/en/2.2.x/installation/)

```
# mac /linux
python3 -m venv venv
# windows
py -3 -m venv venv

# mac /linux
. venv/bin/activate
# windows
venv\Scripts\activate

```

```
# mac /linux
python3 -m pip install Flask
python3 -m pip install python-dotenv
python3 -m pip install -U flask-cors
python3 -m pip install pandas
python3 -m pip install psycopg
pip install "psycopg[binary]"
pip install pandas
pip install h5py
pip install cftime
pip install tables

# windows
py -3 -m pip install Flask
py -3 -m pip install python-dotenv
py -3 -m pip install -U flask-cors
pip install "psycopg[binary]"
pip install pandas
pip install h5py
py -3 -m pip install tables
```

5. Set database credentials
   
see PostGIS-docker repository for instruction

set up .env file with DATABASE_URL
DATABASE_URL=postgresql://[user]:[password]@[host]:[port]/[Database]

## Run Application

 `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.


Start the back end with:


mac/linux: `yarn start-api`


windows: `yarn start-api-windows`

Runs the back end  in the development mode on [http://localhost:5000](http://localhost:5000).

## Deployment

First build the project with

`````
yarn build
`````

and then use connect to vpn and use rsynv to sync the build folder

`````
rsync -avz build/ deployer@weatherva.ifi.uzh.ch:html/
`````