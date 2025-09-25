# Create Raster Tiles

This was an early approach to bring the radar data to the map. First we created raster tiles for each time step of the radar data, aftewards we run a simple webserver with simple_http_server.py to serve these tiles to a client.

## Create Raster Tiles

Run the cells in the file  [generate_tiles_from_h5.ipynb](generate_tiles_from_h5.ipynb) to create the directories with the xyz tiles.


## Run simple Raster Tile Server

To serve the created raster tiles you can start a simple web server by running the following command:

```python3 simple_http_server.py```

Afterwards you can reach the tile server under the following resource: `http://localhost:3000` To access the coresponding tiles, you need to add the path of the directory to the URL, for example `http://localhost:3000/CZC/CZC221241345VL.801_tiles/{z}/{x}/{y}.png`