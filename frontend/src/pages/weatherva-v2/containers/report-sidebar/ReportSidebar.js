import { useState, useCallback, useEffect } from 'react'
import PhotoAlbum from "react-photo-album";

import './report-sidebar.scss';

import { useSelector } from 'react-redux';

import { API_URL } from '../../../../helpers/constants';


export default function ReportSidebar(props) {
    const { map } = props;

    const [currentCluster, setCurrentCluster] = useState(null);
    const [similarReports, setSimilarReports] = useState(null);

    const [selectedReport, setSelectedReport] = useState(null);
    const [starttime, endtime] = useSelector((state) => state.filters.timeRange);
    const categories = useSelector((state) => state.filters.categories)
    const reports = useSelector((state) => state.data.reports);

    const fetchClusterData = useCallback(async () => {

        const queryParams = new URLSearchParams();

        if (categories) {
            categories.forEach(category => queryParams.append('category', category));
        }

        if (starttime) {
            queryParams.set('starttime', starttime);
        }

        if (endtime) {
            queryParams.set('endtime', endtime);
        }

        const response = await fetch(`${API_URL}/api/v1/clusterImage?${queryParams}`);
        const data = await response.json();
        return data;
    });


    useEffect(() => {
        const handleClick = async (e) => {
            const cluster = await fetchClusterData();
            console.log(cluster);


            let width = 20;
            let height = 20;

            let clickedFeatures = map.current.queryRenderedFeatures([
                [e.point.x - width / 2, e.point.y - height / 2],
                [e.point.x + width / 2, e.point.y + height / 2]
            ], { layers: ['reports', 'heatmap-points'] });

            if (clickedFeatures.length > 0) {
                const tmpCLickedFeature = clickedFeatures[0];
                const currrenCluster = cluster.find((element) => element.ids.includes(tmpCLickedFeature?.properties?.id));
                console.log(currrenCluster)
                setCurrentCluster(currrenCluster === undefined ? null : currrenCluster);


                setSelectedReport(tmpCLickedFeature.properties);
            } else {
                setSelectedReport(null);
                setCurrentCluster(null);

            }
        };

        if (map.current) {
            map.current.on('click', handleClick);
        }

        return () => {
            if (map.current) {
                map.current.off('click', handleClick);
            }
        };
    }, [fetchClusterData]);

    function loadImageAndGetDimensions(url) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve({ width: img.width, height: img.height });
            img.onerror = reject;
            img.src = url;
        });
    }

    useEffect(() => {
        async function fetchAndSetImageDimensions() {
            try {
                if (reports == null) return;
                const filteredReports = reports.filter((report) => currentCluster?.ids.includes(report.id));
                const imagePromises = filteredReports.map((report) =>
                    loadImageAndGetDimensions(report.imageurl)
                        .then(dimensions => ({
                            src: report.imageurl,
                            ...dimensions,
                        }))
                );
                const imagesWithDimensions = await Promise.all(imagePromises);

                setSimilarReports(imagesWithDimensions);
            } catch (error) {
                console.error("Failed to load images", error);
                setSimilarReports(null);
            }
        }

        fetchAndSetImageDimensions();
    }, [currentCluster, reports]);

    return (<div id="pop-up" className={`${selectedReport !== null ? 'active' : null}`}>
        <div className="pop-up">
            <div className="details">



                <h2>Report details</h2>
                <div>
                    Category: {selectedReport?.category}
                </div>
                <div>
                    ID: {selectedReport?.id}
                </div>
                <div>
                    Expression: {selectedReport?.auspraegung}
                </div>
            </div>
            <div>{selectedReport?.imageoriginalurl ?
                <img src={selectedReport?.imageoriginalurl} alt={selectedReport?.imageoriginalurl} />
                : null}
            </div>
            <div className="details">

                <h3>Images from similar Reports ({similarReports?.length})</h3>

                {similarReports?.length > 0 && similarReports !== null ?

                    <PhotoAlbum layout="masonry" photos={similarReports} />


                    : null}
            </div>
        </div>

    </div>);
}