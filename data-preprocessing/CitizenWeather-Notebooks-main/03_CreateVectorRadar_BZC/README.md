# Create GeoJSON from BZC radar data

This Jupyter notebook is used to generate GeoJSON files from the BZC radar data from MeteoSchweiz. Put the .h5 files into `data/BZC` directory and run the cells in [h5_to_geojson.ipynb](h5_to_geojson.ipynb). The code in the last cell will convert the GeoJSON from LV95+ to WGS84 CRS. The files in the data/bzc_transformed can be used to load into the database.

## Install GDAL

In order to run the Jupyter notebook to create the GeoJSON files you must install GDAL. Here you find the command to install it on Ubuntu/Debian:

```
sudo apt-get update
sudo apt-get install gdal-bin
```

And here you find the command to install it on MacOS:

```
brew install gdal
```

## Load the data into PostGIS database

The geojson files in the directory [data/bzc_transformed](data/bzc_transformed) can be loaded into the PostGIS database and afterwards be used with the CitizenWeatherVA.