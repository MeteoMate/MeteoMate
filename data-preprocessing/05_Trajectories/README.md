# Trajectories

This Jupyter notebook generates GeoJSON trajectories from the trajectories output from the Tobac algorithm. It basically generates a JSON file as output which contains a GeoJSON MultiLine feature fore every time step, which then can be displayed in the CitizenWeatherVA app.

## Output from Tobac algorithm

In order to reproduce the steps in this Jupyter notebook, you first need to have the Track.h5 output file from the [Tobac algorithm](../04_TobacNotebook). Save it in this directory.

## Generate GeoJSON trajectories

 Run all the cells in [trajectories.ipynb](trajectories.ipynb), this will first produce and [output.geojson](output.geojson) file, this contains a GeoJSON FeatureCollection with all features recognized by the Tobac algorithm. Each feature has a property cell and a property timestamp. We use these properties to generate GeoJSON MultiLine features, which then represent the trajectories. At the these MultilineFeatures are saved to a JSON output file which then links time steps to FeatuerCollections that contain all the trajectories for a certain time step.