import React, { useEffect } from 'react'

import { convertToGeoJSON, addHeatMapToMap, addHeatMapPointsToMap } from '../../../helpers/map-helpers';
import { useSelector } from "react-redux";

export default function AccumulatedReportsLayer(props) {

    const { reports, map, layer } = props;

    const { selectedTimestamp, reportsAccumulatedFlag, timeRange: [starttime, endtime], intensities } = useSelector((state) => state.filters);

    function roundDownToNearestFiveMinutes(timestamp) {
        const millisecondsPerMinute = 1000 * 60;
        const fiveMinutesInMilliseconds = millisecondsPerMinute * 5;

        const roundedTimestamp = Math.floor(timestamp / fiveMinutesInMilliseconds) * fiveMinutesInMilliseconds;

        return roundedTimestamp;
    }


    const filterByTimestamp = (timestamp) => {

        const lowerBound = roundDownToNearestFiveMinutes(timestamp)
        const upperBound = lowerBound + 1000 * 60 * 5;

        let filters = [
            'all',
            ['<=', 'timestamp', upperBound],
        ];

        filters.push(['>=', 'timestamp', starttime]);


        const categoryIntensityFilters = intensities.map(intensity => {
            const intensitySubFilter = ['any', ...intensity.names.map(name => ['==', 'auspraegung', name])];
            return ['all', ['==', 'category', intensity.category], intensitySubFilter];
        });

        const categoriesInIntensities = intensities.map(intensity => intensity.category);
        const excludeSpecifiedCategories = ['!in', 'category', ...categoriesInIntensities];

        // Values are taken when not specified in intensities. if specified, only the correct intensities are considered
        filters.push(['any', excludeSpecifiedCategories, ...categoryIntensityFilters]);
        map.current.setFilter('heatmap', filters);
        map.current.setFilter('heatmap-points', filters);

    }

    useEffect(() => {
        if (!map.current || !selectedTimestamp || !map.current.getLayer(layer)) return;

        filterByTimestamp(selectedTimestamp);


    }, [selectedTimestamp, intensities])


    useEffect(() => {
        if (!map.current || !reports) return;
        const geojsonReports = JSON.parse(convertToGeoJSON(reports));
        addHeatMapToMap(map, geojsonReports);
        addHeatMapPointsToMap(map, geojsonReports, 'heatmap-points');
        filterByTimestamp(selectedTimestamp);
        if (!reportsAccumulatedFlag) {
            map.current.setLayoutProperty('heatmap', 'visibility', 'none');
            map.current.setLayoutProperty('heatmap-points', 'visibility', 'none');

        }
    }, [reports, reportsAccumulatedFlag, selectedTimestamp, intensities]);

    useEffect(() => {
        if (!map.current || !reports) return;

        if (!reportsAccumulatedFlag) {
            map.current.setLayoutProperty('heatmap', 'visibility', 'none');
            map.current.setLayoutProperty('heatmap-points', 'visibility', 'none');
        } else {
            map.current.setLayoutProperty('heatmap', 'visibility', 'visible');
            map.current.setLayoutProperty('heatmap-points', 'visibility', 'visible');
        }

    }, [reportsAccumulatedFlag]);

    return null;
}
