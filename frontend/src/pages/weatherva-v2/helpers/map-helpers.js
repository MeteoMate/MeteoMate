// eslint-disable-next-line
import maplibregl from "!maplibre-gl"; // ! is important here

import { getIcon } from "../../../components/shared/functions/WeatherIcons";

function convertToGeoJSON(data) {
    return JSON.stringify({
        type: "FeatureCollection",
        features: data.map(entry => ({
            type: "Feature",
            properties: {
                id: entry.id,
                category: entry.category,
                auspraegung: entry.auspraegung,
                timestamp: entry.timestamp,
                imageName: entry.imageName,
                passed: entry.passed ? "true" : "false",
                timeSlotsAhead: entry.timeSlotsAhead,
                imageoriginalurl: entry.imageurl,
                cluster_id: entry.cluster_id,
            },
            geometry: {
                type: "Point",
                coordinates: entry.coordinates,
            },
        })),
    }, null, 2);
}


const addToMap = (map, data, layerId) => {
    if (map.current.getSource(layerId)) {
        map.current.getSource(layerId).setData(data);
    } else {
        map.current.addSource(layerId, {
            type: 'geojson',
            data: data
        });


        map.current.addLayer({
            id: layerId,
            type: 'circle',
            source: layerId,
            paint: {
                'circle-radius': 15,
                'circle-color': '#F5761A'
            }
        });

        const categories = ["HAGEL", "REGEN", "BLITZE", "WIND", "GLAETTE", "SCHNEEFALL", "SCHNEEDECKE", "BEWOELKUNG", "NEBEL", "TORNADO"];

        categories.forEach(category => loadAndAddImage(category, map));

        map.current.addLayer(
            {
                id: layerId + 'Icon',
                type: "symbol",
                source: layerId,
                layout: {
                    "icon-image": [
                        'match',
                        ['get', 'category'],
                        "HAGEL", 'HAGEL-marker',
                        "REGEN", 'REGEN-marker',
                        "BLITZE", 'BLITZE-marker',
                        "WIND", 'WIND-marker',
                        "GLAETTE", 'GLAETTE-marker',
                        "SCHNEEFALL", 'SCHNEEFALL-marker',
                        "SCHNEEDECKE", 'SCHNEEDECKE-marker',
                        "BEWOELKUNG", 'BEWOELKUNG-marker',
                        "NEBEL", 'NEBEL-marker',
                        "TORNADO", 'TORNADO-marker',
                        ""
                    ],
                    "icon-size": 0.03,
                    'icon-overlap': 'always',
                },
            });

    }
};

const addHeatMapPointsToMap = (map, data, layerId) => {
    if (map.current.getSource(layerId)) {
        map.current.getSource(layerId).setData(data);
    } else {
        map.current.addSource(layerId, {
            type: 'geojson',
            data: data
        });


        map.current.addLayer({
            id: layerId,
            type: 'circle',
            source: layerId,
            paint: {
                'circle-radius': 4,
                'circle-color': '#F5761A'
            }
        });
    }
};

async function loadAndAddImage(category, map) {
    try {
        const imageUrl = getIcon(category);
        const image = await new Promise((resolve, reject) => {
            map.current.loadImage(imageUrl, function (error, image) {
                if (error) {
                    reject(error);
                }
                resolve(image);
            });
        });

        map.current.addImage(category + "-marker", image, {
            width: "30px",
            height: "41px",
        });
    } catch (error) {
        console.error(`Failed to load image for category ${category}:`, error);
    }
}


const addFeatureCollectionToMap = (map, data, layer) => {
    if (map.current.getSource(layer)) {
        map.current.getSource(layer).setData(data);
    } else {
        map.current.addSource(layer, {
            'type': 'geojson',
            'data': data
        });


        map.current.addLayer({
            'id': layer,
            'type': 'fill',
            'source': layer,
            'paint': {
                'fill-color': [
                    'match',
                    ['get', 'ID'],
                    1, 'rgb(42, 0, 250)',
                    2, 'rgb(250, 202, 30)',
                    3, 'rgb(247, 12, 0)',
                    'red'
                ],
                'fill-opacity': 0.3
            }
        });

    }
};

const addBZCFeatureCollectionToMap = (map, data, layer) => {
    if (!data) return;

    if (map.current.getSource(layer)) {
        map.current.getSource(layer).setData(data);
    } else {
        map.current.addSource(layer, {
            'type': 'geojson',
            'data': data
        });


        map.current.addLayer({
            'id': layer,
            'type': 'fill',
            'source': layer,
            'paint': {
                'fill-color': [
                    'interpolate',
                    ['linear'],
                    ['get', 'ID'], // Assuming 'ID' is your property to base the gradient on
                    0, 'rgb(255, 200, 0)', // Light orange at the lowest value (e.g., 0)
                    100, 'rgb(255, 128, 0)' // Dark orange at the highest value (e.g., 100)
                ],
                'fill-opacity': 0.8
            }
        });

    }
};



const addHeatMapToMap = (map, data) => {
    // Check if the source already exists
    if (map.current.getSource('heatmap')) {
        // Update the data of the existing source
        map.current.getSource('heatmap').setData(data);
    } else {
        // Add a new source and layer
        map.current.addSource('heatmap', {
            type: 'geojson',
            data: data
        });

        map.current.addLayer({
            id: 'heatmap',
            type: 'heatmap',
            source: 'heatmap',
            paint: {
                // Increase the heatmap color weight weight by zoom level
                // heatmap-intensity is a multiplier on top of heatmap-weight
                'heatmap-intensity': [
                    'interpolate',
                    ['linear'],
                    ['zoom'],
                    0,
                    2,
                    9,
                    3
                ],
                // Color ramp for heatmap.  Domain is 0 (low) to 1 (high).
                // Begin color ramp at 0-stop with a 0-transparancy color
                // to create a blur-like effect.
                'heatmap-color': [
                    'interpolate',
                    ['linear'],
                    ['heatmap-density'],
                    0, 'rgba(255, 235, 204, 0)', // Transparent light orange at the lowest density
                    0.2, 'rgb(254, 217, 166)',  // Very light orange
                    0.4, 'rgb(253, 190, 133)',  // Light orange
                    0.6, 'rgb(253, 141, 60)',   // Medium orange
                    0.8, 'rgb(241, 105, 19)',   // Darker orange
                    1, 'rgb(217, 72, 1)'        // Dark orange at the highest density
                ],

                // Adjust the heatmap radius by zoom level
                'heatmap-radius': [
                    'interpolate',
                    ['linear'],
                    ['zoom'],
                    0,
                    2,
                    9,
                    20
                ],
                'heatmap-opacity': 0.8
            }
        });



    }
};



const addTrajectoriesToMap = (map, data, layer) => {
    if (map.current.getSource(layer)) {
        map.current.getSource(layer).setData(data);
    } else {
        map.current.addSource(layer, {
            type: 'geojson',
            data: data
        });

        map.current.addLayer({
            id: layer,
            type: 'line',
            source: layer,
            paint: {
                'line-color': '#D32F2F',
                'line-width': 2
            }
        });

        map.current.addLayer({
            id: layer + '-points',
            type: 'circle',
            source: 'trajectories',
            paint: {
                "circle-color": "#000000",
                'circle-radius': 3
            }
        });


        const popup = new maplibregl.Popup({
            closeButton: false,
            closeOnClick: false
        });

        // add threshold of trajectory information to the trajectories as a popup
        map.current.on('mouseenter', 'trajectories', (e) => {
            map.current.getCanvas().style.cursor = 'pointer';

            const coordinates = e.features[0].geometry.coordinates;
            const lastCoord = coordinates[coordinates.length - 1];

            const thresholdValue = e.features[0].properties.threshold_value;
            const content = `Threshold of Trajectory: ${thresholdValue} dBZ`;

            while (Math.abs(e.lngLat.lng - lastCoord[0]) > 180) {
                lastCoord[0] += e.lngLat.lng > lastCoord[0] ? 360 : -360;
            }

            popup.setLngLat(lastCoord).setHTML(content).addTo(map.current);

        });

        map.current.on('mouseleave', 'trajectories', () => {
            map.current.getCanvas().style.cursor = '';
            popup.remove();
        });

    }

}


export { convertToGeoJSON, addToMap, addHeatMapPointsToMap, addTrajectoriesToMap, addFeatureCollectionToMap, addHeatMapToMap, addBZCFeatureCollectionToMap };


