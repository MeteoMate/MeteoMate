import React, { useEffect } from 'react'
import { RADAR_TILES_SERVER } from '../../../helpers/constants'

export default function RasterRadarLayer(pops) {

    const { map, radarLayers, selectedTimestamp } = pops;

    function showRadarLayer(layerId) {
        radarLayers.forEach((layer) => {
            const visibility = layer.id === layerId ? 'visible' : 'none';
            map.current.setLayoutProperty(layer.id, 'visibility', visibility);
        });

    }

    useEffect(() => {
        if (!map.current) return;

        const itemWithStartDate = radarLayers.find(layer => layer.startDate === selectedTimestamp);

        if (itemWithStartDate) {
            showRadarLayer(itemWithStartDate.id);
        }

    }, [selectedTimestamp]);

    useEffect(() => {
        if (!map?.current) return;

        map.current.on('load', function () {
            radarLayers.forEach((layer, index) => {
                map.current.addSource(layer.id, {
                    type: 'raster',
                    tiles: [`${RADAR_TILES_SERVER}/${layer.id}_tiles/{z}/{x}/{y}.png`],
                    tileSize: 256
                });

                map.current.addLayer({
                    'id': layer.id,
                    'type': 'raster',
                    'source': layer.id,
                    'layout': {
                        'visibility': 'none'
                    }
                });
            });

        });

        map.current.dragRotate.disable();
        map.current.touchZoomRotate.disableRotation();

    }, []);

    return null;
}
