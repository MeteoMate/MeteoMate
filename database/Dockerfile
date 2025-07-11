FROM postgis/postgis:latest

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
    gdal-bin \
    && rm -rf /var/lib/apt/lists/*

COPY ./data/* /tmp/