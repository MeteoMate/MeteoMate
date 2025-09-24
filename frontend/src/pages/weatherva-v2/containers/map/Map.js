import React, { useRef, useEffect, Fragment } from "react";

import { useSelector } from "react-redux";

// eslint-disable-next-line
import maplibregl from "!maplibre-gl"; // ! is important here
import maplibreglWorker from "maplibre-gl/dist/maplibre-gl-csp-worker";
import "./map.scss";
import 'maplibre-gl/src/css/maplibre-gl.css';
import Legend from "../legend/Legend.js";

import ReportsLayer from '../layers/reports/ReportsLayer.js'
import TrajectoriesLayer from "../layers/trajectories/TrajectoriesLayer.js";

import ReportSidebar from "../report-sidebar/ReportSidebar.js";
import AccumulatedReportsLayer from "../layers/accumulated-reports/AccumulatedReportsLayer.js";
import BZCRadarlayer from "../layers/czc-radar/BZCRadarLayer.js";
import CZCRadarLayer from "../layers/czc-radar/CZCRadarLayer.js";

maplibregl.workerClass = maplibreglWorker;

export default function MapLibreMap(props) {


    const mapContainer = useRef(null);
    const map = useRef(null);

    const zoom = 10;
    const lat = 46.97564153438015;
    const lng = 8.433071117939605;

    const trajectories = useSelector((state) => state.data.trajectories);
    const reports = useSelector((state) => state.data.reports);
    const radar = useSelector((state) => state.data.radar)
    const bzc = useSelector((state) => state.data.bzc)

    useEffect(() => {
        if (map.current) return;


        map.current = new maplibregl.Map({
            container: mapContainer.current,
            style: {
                'version': 8,
                'sources': {
                    'raster-tiles': {
                        'type': 'raster',
                        'tiles': ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"]
                    }
                },
                'layers': [
                    {
                        'id': 'simple-tiles',
                        'type': 'raster',
                        'source': 'raster-tiles',
                        'minzoom': 0,
                        'maxzoom': 22
                    }
                ]
            },
            center: [lng, lat],
            zoom: zoom,
        });

        map.current.dragRotate.disable();
        map.current.touchZoomRotate.disableRotation();

    }, []);


    return (
        <div className="map-wrap" id="map-wrap">
            <div ref={mapContainer} className="map" />
            {map.current ?
                <Fragment>

                    <CZCRadarLayer
                        map={map}
                        layer='czc-radar'
                        data={radar}
                    />

                    <BZCRadarlayer
                        map={map}
                        layer='bzc-radar'
                        data={bzc} />

                    <TrajectoriesLayer
                        data={trajectories}
                        map={map}
                        layer={'trajectories'}
                    />

                    <ReportsLayer
                        map={map}
                        reports={reports}
                        layer={'reports'}
                    />
                    <AccumulatedReportsLayer
                        map={map}
                        reports={reports}
                        layer={'accumulated-reports'} />

                    <Legend />

                </Fragment>

                : null}
            <ReportSidebar map={map} />


        </div>
    );
}