import React, { useEffect } from 'react'

import { useSelector } from 'react-redux'

import { addBZCFeatureCollectionToMap } from '../../../helpers/map-helpers';

export default function BZCRadarlayer(props) {

    const { map, layer, data } = props;
    const selectedTimestamp = useSelector((state) => state.filters.selectedTimestamp);
    const radarBZCFlag = useSelector((state) => state.filters.radarBZCFlag);

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
        setVisibility(layer, radarBZCFlag);

    }, [radarBZCFlag, map.current]);

    useEffect(() => {
        if (!map.current || !data || Object.keys(data).length === 0) return;
        addBZCFeatureCollectionToMap(map, data[selectedTimestamp], layer);
    }, [data, radarBZCFlag]);


    return null;
}

