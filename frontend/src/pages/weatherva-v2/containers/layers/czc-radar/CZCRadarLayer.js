import React, { useEffect } from 'react'

import { useSelector } from 'react-redux'

import { addFeatureCollectionToMap } from '../../../helpers/map-helpers';

export default function CZCRadarLayer(props) {

    const { map, layer, data } = props;
    const selectedTimestamp = useSelector((state) => state.filters.selectedTimestamp);
    const radarCZCFlag = useSelector((state) => state.filters.radarCZCFlag);

    const setVisibility = (layerId, isVisible) => {
        const visibility = isVisible ? 'visible' : 'none';
        map.current.setLayoutProperty(layerId, 'visibility', visibility);

    }

    useEffect(() => {
        if (!map.current || !selectedTimestamp) return;
        if (!map.current.getSource(layer)) return;
        if (data[selectedTimestamp]) {
            map.current.getSource(layer).setData(data[selectedTimestamp]);
        }
    }, [selectedTimestamp])

    useEffect(() => {
        if (!map.current || !map.current.getSource(layer)) return;
        setVisibility(layer, radarCZCFlag);

    }, [radarCZCFlag, map.current]);

    useEffect(() => {
        if (!map.current || !data || Object.keys(data).length === 0) return;
        addFeatureCollectionToMap(map, data[selectedTimestamp], layer);
    }, [data]);


    return null;
}

