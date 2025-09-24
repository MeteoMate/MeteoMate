import React from 'react'
import './legend.scss';
import Report from './images/legend-report.png'
import Trajectory from './images//legend-trajectory.png'
import Radar1 from './images//legend-radar-threshold1.png'
import Radar2 from './images//legend-radar-threshold2.png'
import Radar3 from './images//legend-radar-threshold3.png'

export default function Legend() {
    return (
        <div className="legend">

            <div><img src={Report} /> <span>Citizen reports with coresponding icons</span></div>
            <div><img src={Trajectory} /> <span>Trajectories, 5 minute time step between two dots</span></div>
            <div><img src={Radar1} />  <span>Maximum reflectivity, values above 15dbZ</span></div>
            <div><img src={Radar2} /> <span>Maximum reflectivity, values above 35dbZ</span></div>
            <div><img src={Radar3} />  <span>Maximum reflectivity, values above 50dbZ</span></div>

        </div>
    )
}
