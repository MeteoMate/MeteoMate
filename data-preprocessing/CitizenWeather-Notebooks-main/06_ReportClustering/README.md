# Clustering
This folder contains two .ipynb files with functions regarding clustering of citizen reports.

## Weather Bubbles
This folder has two ways of creating weather bubbles.
The function "grid()" cretes a grid over Switzerland with 30 cell in it, and the next function "count_points_in_polygons(json)" uses that function to create two dataframes with a number of points in each cell.
input for "count_points_in_polygons(json)" is a geojson file with point geometries such as citizen report geojson, and the output is a geopandas DataFrame with each grid cell and a number of points in each grid cell. Also, it adds a number of points in each a already made Dataframe "cumulativereports." "cumulativereports" is initialized manually and has a column with each grid cell polygon and a "points" column with every number being 0.

The second way is made by a function "bubblecluster(json,timestart,timeend,grid,makejson = False)" which has an input of a geojson with point geometries, and a grid made with "grid()" function, followed by preferred starting time and ending time. This function cuts away every point that is outside of the grid and selected time using "getdata" function, and returns a geopandas DataFrame containing centroids of grid cells with at least one point, and the number of points in those cells. Also, if "makejson = True," the function will also create a geojson with the same DataFrame.


## weather cluster
This file contains attempts at ST-DBSCAN and density graphs. 

