# Create GeoJSON for CZC radar data

With this Jupyter notebook we generated GeoJSON files from the CZC radar data we got from MeteoSchweiz. Put the .h5 files into the [input folder](input) and then run the cells in [create_contour_polygon.ipynb](create_contour_polygon.ipynb). Afterwards, run the [mapshaper.js](mapshaper.js) file, in order to run this make npm install in this directory first, aftewards you can run node mapshaper.js and this will generate TopoJSON and GeoJSON files which can then be used for the CitizenWeatherVA.

## Install mapshaper.js

You must have installed `node` and `npm` in order to run the following:

```
npm install
```

## Create GeoJSON files

Go to [create_contour_polygon.ipynb](create_contour_polygon.ipynb) and run all cells, this will create for each file in [input](input) to a GeoJSON file and save it in [output](output). 

## Simplify and outputs as GeoJSON or TopoJSON

Open the [mapshaper.js](mapshaper.js) and change the boolean on line 5, depending on the output file type you want to generate. Run `node mapshaper.js`, this will take all files from [output](output) and simplify and convert it and it will save it in [simplified](simplified).