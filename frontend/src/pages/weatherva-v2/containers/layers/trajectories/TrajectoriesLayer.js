import React, { useEffect } from 'react'
import { addTrajectoriesToMap } from '../../../helpers/map-helpers';
import { useSelector } from "react-redux";

export default function TrajectoriesLayer(props) {
    const { data, map, layer } = props;
    const trajectoriesflag = useSelector((state) => state.filters.trajectoriesflag);
    const selectedTimestamp = useSelector((state) => state.filters.selectedTimestamp);

    const timeStampToString = (timestamp) => {

        const date = new Date(timestamp);


        const year = date.getUTCFullYear();
        const month = (date.getUTCMonth() + 1).toString().padStart(2, '0'); // Months are 0-indexed in JS, add 1 for human-readable format
        const day = date.getUTCDate().toString().padStart(2, '0');
        const hours = date.getUTCHours().toString().padStart(2, '0');
        const minutes = date.getUTCMinutes().toString().padStart(2, '0');
        const seconds = date.getUTCSeconds().toString().padStart(2, '0');

        const formattedDateUTC = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
        console.log(formattedDateUTC);
        return formattedDateUTC;
    }


    const setVisibility = (layerId, isVisible) => {
        const visibility = isVisible ? 'visible' : 'none';
        map.current.setLayoutProperty(layerId, 'visibility', visibility);
        map.current.setLayoutProperty(layerId + '-points', 'visibility', visibility);

    }

    const filterByTimestamp = (timestamp) => {
        if (!map.current || !timestamp || !map.current.getLayer(layer)) return;
        let filters = [
            'all',
            ['==', ['get', 'date'], timeStampToString(timestamp)],
        ];
        map.current.setFilter(layer, filters);
        map.current.setFilter(layer + '-points', filters);
    }

    useEffect(() => {
        filterByTimestamp(selectedTimestamp);
    }, [selectedTimestamp, trajectoriesflag])

    useEffect(() => {
        if (!map.current) return;
        if (!map.current.getSource(layer)) return;
        setVisibility(layer, trajectoriesflag);

    }, [trajectoriesflag, map.current]);

    useEffect(() => {
        if (!map.current || !data) return;
        if (data?.features?.length > 0) {
            addTrajectoriesToMap(map, data, layer);
            filterByTimestamp(selectedTimestamp);
        }
    }, [data]);

    return null;
}
