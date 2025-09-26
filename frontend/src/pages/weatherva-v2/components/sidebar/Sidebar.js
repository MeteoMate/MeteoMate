import React, { useState, Fragment } from "react";
import TimePicker from "./TimePicker";
import CategorySelector from "./CategorySelector";
import ImageSelect from "./ImageSelect";
import EventSelector from "./EventSelector";
import './sidebar.scss';

import Settings from "../../../../components/shared/components/Settings";
import "../../../../static/style/sidebar.css"

import GeneralCheckbox from "./GeneralCheckbox";
import { getAccumulatedReports, getTrajectoriesUpdated, getCZCRadar, getBZCRadar } from '../../features/FiltersSlice';

// memoizing components
const MemoizedTimePicker = React.memo(TimePicker);
const MemoizedCategorySelector = React.memo(CategorySelector);
const MemoizedImageSelect = React.memo(ImageSelect);
const MemoizedEventSelector = React.memo(EventSelector);
const MemoizedGeneralCheckbox = React.memo(GeneralCheckbox);

const Sidebar = () => {
    const [containerStyle, setContainerStyle] = useState({})
    const [sidebarStyle, setSidebarStyle] = useState({})
    const [showReports, setShowReports] = useState(true);
    const [showRadar, setShowRadar] = useState(true);


    const toggleReports = () => {
        setShowReports(!showReports);
    }

    const toggleRadar = () => {
        setShowRadar(!showRadar);
    }

    const navStatus = () => (document.getElementById("hamburger").classList.contains('hamburger-active')) ? navClose() : navOpen()

    const navClose = () => {
        setContainerStyle({ opacity: "0" })
        setTimeout(function () {
            document.getElementById("hamburger").classList.remove('hamburger-active')
            setSidebarStyle({ width: "63px" })
        }, 300);
    }

    const navOpen = () => {
        document.getElementById("hamburger").classList.add('hamburger-active')
        setSidebarStyle({ width: "320px" })
        setTimeout(() => setContainerStyle({ opacity: "1" }), 500)
    }

    return (
        <div id="SidebarAll" style={sidebarStyle}>
            <aside id="SidebarContainer" style={containerStyle}>
                <div id="TopContainer">
                    <Settings />
                </div>
                <div className="Sidebar scroll-shadows">
                    <div id="filter">
                        <h2>Filter options</h2>
                        <MemoizedTimePicker />
                        {/* <MemoizedEventSelector /> */}

                        <h2 onClick={toggleReports} id="sidebar-clickable-title"> {showReports ? "▼" : "▶"} Reports </h2>
                        {showReports && (
                            <>
                                <MemoizedGeneralCheckbox label="Show accumulated reports" action={(checked) => getAccumulatedReports({ reportsAccumulatedFlag: checked })} />
                                <MemoizedCategorySelector />
                                <MemoizedImageSelect />
                            </>
                        )}
                        <h2 onClick={toggleRadar} id="sidebar-clickable-title"> {showRadar ? "▼" : "▶"} Radar </h2>


                        {showRadar && (
                            <Fragment>
                                <MemoizedGeneralCheckbox
                                    label="Trajectories of CZC data" action={(checked) => getTrajectoriesUpdated({ trajectoriesflag: checked })} />
                                <MemoizedGeneralCheckbox
                                    label="CZC radar data" action={(checked) => getCZCRadar({ radarCZCFlag: checked })} />
                                <MemoizedGeneralCheckbox
                                    label="BCZ radar data" action={(checked) => getBZCRadar({ radarBZCFlag: checked })} />
                            </Fragment>


                        )}

                    </div>
                </div>
            </aside>
            <div id="hamburger" className="hamburger-icon-container hamburger-active position-absolute" onClick={navStatus}>
                <span className="hamburger-icon"></span>
            </div>
        </div>
    )
}

export default Sidebar;