# MeteoMate

MeteoMate extends the [CitizenWeatherVA](https://github.com/dhaess/WeaVA) web app originally built by [Dominique Hässig](https://github.com/dhaess) for exploring citizen weather reports from MeteoSchweiz. The extension, MeteoMate, adds radar data to validate and contextualize reports, visualize storm tracks, and support side-by-side spatiotemporal analysis.

**Components**
- **Citizen reports explorer** -- by [Dominique Hässig](https://github.com/dhaess): filter by event category/intensity, view clustered bubble/pie maps, and analyze counts over time.
- **Radar comparison** -- by [Alexey Buyakofu](https://github.com/Asysay), [Andreas Huwiler](https://github.com/anhuwi), and [Dario Küffer](https://github.com/dariokueffer): overlay radar data with reports and derive storm trajectories. Note: radar data is currently available for one documented event.

---

## Prerequisites

* [Docker and Docker Compose](https://docs.docker.com/compose/install/)
* `unzip` (for preparing sample data)
* A POSIX shell (bash/zsh)

---

## Development

### 1) Clone the repository

```bash
git clone git@github.com:MeteoMate/MeteoMate.git && cd MeteoMate
```

### 2) Prepare data archives

```bash
# Drop the post-processed data in the 'meteomate_postgis/data' folder, for example: 
# <<<DO NOT CHANGE>>> THE NAME OF THE FOLDER OR THE PLACE TO STORAGE THE DATA
unzip -o backend/meteomate_postgis/data/radar_dump.zip -d backend/meteomate_postgis/data/ && \
unzip -o backend/meteomate_postgis/data/data.geojson.zip -d backend/meteomate_postgis/data/
```

### 3) Start the stack (in detached mode)

```bash
docker compose -f docker-compose-dev.yaml up -d
```

### 4) Verify services are healthy

```bash
# Summarize container state
# With this command you can check at any moment is the Docker Compose is running
# CHECK THAT BOTH STATUS are (healthy)             
# meteomate_api                 (healthy)  
# meteomate_postgis             (healthy)   
docker compose -f docker-compose-dev.yaml ps

# (Optional) follow logs
docker compose -f docker-compose-dev.yaml logs -f
```

### 5) Import data into the database

The following commands run inside the PostGIS container and rely on DB credentials from `.env`.

**Export `.env` to your shell (bash/zsh):**

```bash
set -a
source .env
set +a
```

**Load GeoJSON and radar SQL dumps:**

The following data dumping illustrates how to CREATE the data TABLE "reports" from the "data.geojson" and LOAD the data values

```bash
# Import GeoJSON into the DB (requires GDAL/ogr2ogr in the PostGIS image)
docker compose -f docker-compose-dev.yaml exec "$POSTGRES_HOST" \
  ogr2ogr -f "PostgreSQL" \
  PG:"dbname=$POSTGRES_DB user=$POSTGRES_USER password=$POSTGRES_PASSWORD host=127.0.0.1 port=$POSTGRES_PORT" \
  /tmp/data.geojson -nln reports -nlt PROMOTE_TO_MULTI && \

# The following data dumping illustrates how to CREATE the data TABLE "czc_radar" and "bzc_radar" from the sql radar data dumps and LOAD the radar data values
# Import radar dumps via psql
docker compose -f docker-compose-dev.yaml exec "$POSTGRES_HOST" \
  psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -h 127.0.0.1 -p "$POSTGRES_PORT" -f /tmp/bzc_radar_dump.sql && \
docker compose -f docker-compose-dev.yaml exec "$POSTGRES_HOST" \
  psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -h 127.0.0.1 -p "$POSTGRES_PORT" -f /tmp/czc_radar_dump.sql
```

### 6) Open the app

By default in development: [http://localhost:80](http://localhost:80). Note that the dev URL is constructed from `SERVER_NAME_DEV` and `NGINX_PORT_DEV` in `.env`.

### 7) Stop the stack

```bash
docker compose -f docker-compose-dev.yaml down
```

---

## Production

Use the production Compose file and set production values in `.env`.

```bash
# Set APP_ENV=production in `.env`
# Ensure SERVER_NAME_PROD/NGINX_PORT_PROD are correct
# Finally, run:
docker compose -f docker-compose-prod.yaml up -d
```