import React from 'react'
import './dashboard.scss';
import { Link } from 'react-router-dom';
import CititzenWeatherVA1 from './images/compressed_0_CitizenWeatherVA-1.jpg';
import CititzenWeatherVA2 from './images/compressed_0_CitizenWeatherVA-1.jpg';

export default function Dashboard() {
    return (
        <div className="dashboard-wrapper">
            <div className="header-bar">
                <h1>CitizenWeatherVA</h1>
            </div>
            <div className="dashboard">
                <h2>Introduction</h2>
                <p>We started this project at the beginning of 2022 when MeteoSwiss shared with us their collection of citizens' observations on weather conditions reported by users of the MeteoSwiss mobile application. For several years, MeteoSwiss has been collecting citizens' reports of hail events through their mobile application and using these reports for scientific purposes (Barras et al., 2019). Since November 2021, MeteoSwiss has started to collect a more comprehensive list of weather conditions, including lightning, hail, wind, icy conditions, and fog, among others. Users of the mobile application can report weather conditions in their surrounding areas, with the option of including images. Some of these conditions are difficult or even impossible to capture by remote sensing, which makes the utilization of citizens' reports of high value to complement or verify data from remote sensing devices.
                </p><p>
                    We followed an iterative and participatory design process divided into three main phases. In each phase, we developed prototypes, gathered experts' requirements, designed and ran user experts' studies, and collected domain experts' feedback to improve our solution's features.
                </p><p>
                    The main goal of Phase 1 was to facilitate the characterization of high-impact weather events over time and space, as reported by citizens. We formulated the following research questions: What characteristics of weather events are reported by citizens, and how are they linked through the reports? What patterns or unexpected activities can be detected by visually inspecting weather reports? To explore these research questions, we proposed a visual analysis tool that facilitates exploring and comparing multiple weather conditions reported by citizens and their underlying weather events.
                </p><p>
                    The main goal of Phase 2 was to facilitate the visual comparison of radar data and citizens' reports, explore 'reports' images and extra metadata, and re-engineer the tool to make the software more accessible, modular, and robust. In addition to the research questions of Phase 1, we tackled the following questions: How much visual correlation do citizens' reports and radar observations have over time and space?
                </p><p>
                    Our tool now employs complementary color schemes to differentiate between the two sources of information, while the clutter-free map visualization focuses exclusively on individual glyphs. These design choices ensure a simple and clean visual presentation. Animations are integrated as an interactive feature, enabling users to dynamically explore the spatio-temporal evolution of radar data and reports.
                    The tool includes an option to display accumulated reports over time, offering a qualitative estimation of the spatial coverage of the reports. Additionally, a new feature visualizes similar nearby reports and their associated images based on a subset of selected reports. This feature leverages spatial clustering and category name matching for enhanced usability.
                    The software's implementation has been re-engineered to optimize component loading and significantly boost performance, ensuring a seamless user experience.
                </p><p>
                    Ongoing efforts in Phase 3 include further research on analyzing impacts and damage on the ground based on information provided by citizens' reports and additional authoritative data sources.
                </p>
                <div className="dashboard-links-wrapper grid-container">
                    <div className="dashboard-link-item cell">
                        <Link to="/selection">
                            <img className="preview-image" src={CititzenWeatherVA1} alt="app1" />
                            <div className="dashboard-link-item__content">
                                <h4>Phase 1</h4>
                                <p>This part of the CitizenWeatherVA is the core part developed by Dominique Hässig as his master thesis. It provides several tools to analyse the citizen reports from MeteoSchweiz.</p>
                            </div>
                        </Link>

                    </div>
                    <div className="dashboard-link-item cell">
                        <Link to="/radar-data">
                            <img className="preview-image" src={CititzenWeatherVA2} alt="app1" />
                            <div className="dashboard-link-item__content">
                                <h4>Phase 2</h4>
                                <p>This part of the CitizenWeatherVA helps to compare the citizen reports from MeteoSchweiz with the radar data. Currently we only have data for one specific event, although the visual comparison can be done for event 1 only.</p>
                            </div>
                        </Link>
                    </div>

                </div>
            </div>
        </div>
    )
}
