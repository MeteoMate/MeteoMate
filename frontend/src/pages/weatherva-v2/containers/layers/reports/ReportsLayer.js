import React, { useEffect } from 'react'

import { convertToGeoJSON, addToMap, addHeatMapToMap } from '../../../helpers/map-helpers';
import { useSelector } from "react-redux";

export default function ReportsLayer(props) {

    const { reports, map, layer } = props;

    const { selectedTimestamp, reportsAccumulatedFlag, timeRange: [starttime, endtime], intensities } = useSelector((state) => state.filters);

    function roundUpToNearestFiveMinutes(timestamp) {
        const millisecondsPerMinute = 1000 * 60;
        const fiveMinutesInMilliseconds = millisecondsPerMinute * 5;

        const roundedTimestamp = Math.ceil(timestamp / fiveMinutesInMilliseconds) * fiveMinutesInMilliseconds;

        return roundedTimestamp;
    }


    const filterByTimestamp = (timestamp) => {


        const upperBound = roundUpToNearestFiveMinutes(timestamp)
        const lowerBound = upperBound - 1000 * 60 * 5;

        let filters = [
            'all',
            ['<=', 'timestamp', upperBound],
        ];


        filters.push(['>=', 'timestamp', lowerBound]);

        const categoryIntensityFilters = intensities.map(intensity => {
            const intensitySubFilter = ['any', ...intensity.names.map(name => ['==', 'auspraegung', name])];
            return ['all', ['==', 'category', intensity.category], intensitySubFilter];
        });

        const categoriesInIntensities = intensities.map(intensity => intensity.category);
        const excludeSpecifiedCategories = ['!in', 'category', ...categoriesInIntensities];

        // Values are taken when not specified in intensities. if specified, only the correct intensities are considered
        filters.push(['any', excludeSpecifiedCategories, ...categoryIntensityFilters]);

        map.current.setFilter(layer, filters);
        map.current.setFilter(layer + 'Icon', filters);
    }

    useEffect(() => {
        if (!map.current || !selectedTimestamp || !map.current.getLayer(layer)) return;

        filterByTimestamp(selectedTimestamp);
        map.current.moveLayer(layer);
        map.current.moveLayer(layer + 'Icon');

    }, [selectedTimestamp, intensities])

    useEffect(() => {
        if (!map.current || !reports) return;
        const geojsonReports = JSON.parse(convertToGeoJSON(reports));

        addToMap(map, geojsonReports, layer);

        filterByTimestamp(selectedTimestamp);
    }, [reports]);

    useEffect(() => {
        if (!map.current || !reports) return;

        if (reportsAccumulatedFlag) {
            map.current.setLayoutProperty(layer, 'visibility', 'none');
            map.current.setLayoutProperty(layer + 'Icon', 'visibility', 'none');
        } else {
            map.current.setLayoutProperty(layer, 'visibility', 'visible');
            map.current.setLayoutProperty(layer + 'Icon', 'visibility', 'visible');
        }

    }, [reportsAccumulatedFlag]);

    return null;
}
