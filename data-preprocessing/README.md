# CitizenWeather-Notebook

 This repository contains several Jupyter notebooks and scripts that we mainly used for pre-processing the data. The repository contains folders that separate the notebooks and scripts according to their purpose, for example the folder [02_CreateVectorRadar_CZC](02_CreateVectorRadar_CZC) contains all files needed to create GeoJSON files from the CZC radar data. Each folder contains a `README.md` that explains how to run the code and what dependencies need to be installed.

## 1. Create Raster Radar Layer (CZC)
The Jupyter notebook in the folder [01_CreateRasterRadar](01_CreateRasterRadar) generates a raster tile from the radar data. Further details are described in the coresponding [01_CreateRasterRadar/README.md](01_CreateRasterRadar/README.md).

## 2. Create Vector Radar Layer (CZC)
The Jupyter notebook and the node script in the the folder [02_CreateVectorRadar_CZC](02_CreateVectorRadar_CZC) generate GeoJSON files from the radar data. Further details are described in the coresponding [02_CreateVectorRadar_CZC/README.md](02_CreateVectorRadar_CZC/README.md).

## 3. Create Vector Radar Layer (BZC)
The Jupyter notebook and the node script in the the folder [03_CreateVectorRadar_BZC](03_CreateVectorRadar_BZC) generate GeoJSON files from the radar data. Further details are described in the coresponding [03_CreateVectorRadar_BZC/README.md](03_CreateVectorRadar_BZC/README.md).

## 4. Storm Tracking with Tobac
The Jupyter notebook in the the folder [04_TobacNotebook](04_TobacNotebook) applies algorithms from the tobac storm tracking package. Further details are described directly in the Jupyter notebook file [04_TobacNotebook/tobac_CZC.ipynb](04_TobacNotebook/tobac_CZC.ipynb).

## 5. Trajectories
The Jupyter notebook in the the folder [04_Trajectories](04_Trajectories) generates a GeoJSON file from the features extracted in the process of applying tobac storm tracking algorithms. Further details are described in the coresponding [04_Trajectories/README.md](04_Trajectories/README.md).

## 6. Cluster Citizen Reports
The Jupyter notebooks in the the folder [06_ReportClustering](06_ReportClustering) try different sort of clustering of the citizen reports from MeteoSwiss. Further details are described in the coresponding [06_ReportClustering/README.md](06_ReportClustering/README.md).

## 7. Load Data to Database
The Jupyter notebooks and the bash scripts in the the folder [07_LoadDataToDB](07_LoadDataToDB) can be used to load radar data into the PostgreSQL database with PostGIS extension. Further details are described in the coresponding [07_LoadDataToDB/README.md](07_LoadDataToDB/README.md).