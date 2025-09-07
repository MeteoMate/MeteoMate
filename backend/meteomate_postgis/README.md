#  PostGIS Docker Container

This guide will walk you through the process of setting up a custom PostGIS Docker container using your provided Dockerfile.

## Prerequisites

- Docker installed on your machine. If not installed, follow the instructions for your operating system at: [Get Docker](https://docs.docker.com/get-docker/)

## Steps

1. **Prepare Your Data Files**

    Place the geojson data file in the `data` directory.

2. **Build the PostGIS Image**

    In the terminal, navigate to the `postgis-docker` directory and build the custom image:

    ```bash
    docker build -t postgis-docker .
    ```

3. **Run the PostGIS Docker Container**

    Run the following command to start the custom PostGIS container:

    ```bash
    docker run -d \
      --name postgis \
      -e POSTGRES_USER=your_username \
      -e POSTGRES_PASSWORD=your_password \
      -e POSTGRES_DB=your_database \
      -e POSTGRES_INITDB_ARGS="--data-checksums" \
      -v postgis_data:/var/lib/postgresql/data \
      -p 5432:5432 \
      postgis-docker
    ```

    Replace `your_username`, `your_password`, and `your_database`.

3. ***Load geojson to PostGIS database***

Load the geojson to the postgis database with the following command. Change the filename data.geojson according to your file.

```
docker exec postgis ogr2ogr -f "PostgreSQL" PG:"dbname=your_database user=your_username password=your_password host=localhost port=5432" /tmp/data.geojson -nln reports -nlt PROMOTE_TO_MULTI
```

4. **Remove the PostGIS Docker Container**
   
   Run the following command to stop and remove the PostGIS container.

```bash
    docker stop postgis
    docker rm postgis
```
