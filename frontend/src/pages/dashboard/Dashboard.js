import React from 'react'
import './dashboard.scss';
import { Link } from 'react-router-dom';
import CititzenWeatherVA1 from './images/compressed_0_CitizenWeatherVA-1.jpg';
import CititzenWeatherVA2 from './images/compressed_0_CitizenWeatherVA-1.jpg';

export default function Dashboard() {
    return (
        <div className="dashboard-wrapper">
            <div className="header-bar">
                <h1>MeteoMate</h1>
            </div>

            <div className="dashboard">
                <h2>Welcome to MeteoMate! </h2>

                <p>
                    We present MeteoMate, an open-source geo-visualization platform for the visual analysis of citizen weather reports, facilitating the characterization of relevant weather events as reported by citizens. 
                </p>

                <p>
                    We followed an iterative and participatory design process divided into three main phases. In each phase, we developed prototypes, gathered experts' requirements, designed and ran user experts' studies, and collected domain experts' feedback to improve our solution's features.
                </p>

                <p>
                    The main goal of Phase 1 was to facilitate the characterization of high-impact weather events over time and space, as reported by citizens. We formulated the following research questions: What characteristics of weather events are reported by citizens, and how are they linked through the reports? What patterns or unexpected activities can be detected by visually inspecting weather reports? To explore these research questions, we proposed a visual analysis tool that facilitates exploring and comparing multiple weather conditions reported by citizens and their underlying weather events.
                </p>

                <p>
                    The main goal of Phase 2 was to facilitate the visual comparison of radar data and citizens' reports, explore 'reports' images and extra metadata, and re-engineer the tool to make the software more accessible, modular, and robust. In addition to the research questions of Phase 1, we tackled the following questions: How much visual correlation do citizens' reports and radar observations have over time and space?
                </p>

                <p>
                    Our tool now employs complementary color schemes to differentiate between the two sources of information, while the clutter-free map visualization focuses exclusively on individual glyphs. These design choices ensure a simple and clean visual presentation. Animations are integrated as an interactive feature, enabling users to dynamically explore the spatio-temporal evolution of radar data and reports.
                    The tool includes an option to display accumulated reports over time, offering a qualitative estimation of the spatial coverage of the reports. Additionally, a new feature visualizes similar nearby reports and their associated images based on a subset of selected reports. This feature leverages spatial clustering and category name matching for enhanced usability.
                    The software's implementation has been re-engineered to optimize component loading and significantly boost performance, ensuring a seamless user experience.
                </p>

                <p>
                    As part of Phase 3, we refactored all the architectural layers in order to simplify the deployment of our solution. 
                    The GitHub code is publicly available at <a href="https://github.com/MeteoMate" target="_blank" rel="noopener noreferrer">https://github.com/MeteoMate</a>. 
                    We also added a new data adapter to accommodate other types of citizen weather reports and made available a series of data processing modules to compute trajectories and transform radar data into 2D map layers. 
                    Ongoing efforts include current research on analyzing the impacts and damage on the ground, based on information provided by citizen reports and additional authoritative data sources. We foresee the need to develop new information layers, such as land use maps and demographic information, and to apply AI-based algorithms to extract relevant information from the images. 
                </p>

                <div className="dashboard-links-wrapper grid-container">
                    <div className="dashboard-link-item cell">
                        <Link to="/selection">
                            <img
                                className="preview-image"
                                src={CititzenWeatherVA1}
                                alt="app1"
                            />
                            <div className="dashboard-link-item__content">
                                <h4>Phase 1</h4>
                                <p>
                                    First visualization prototype tool developed by Dominique Hässig as his master thesis.  
                                    It provides several tools to analyse the citizen reports from the MeteoSwiss App. 
                                    See the published paper: <a href="https://doi.org/10.5167/uzh-264117" target="_blank" rel="noopener noreferrer">https://doi.org/10.5167/uzh-264117</a>
                                </p>
                            </div>
                        </Link>
                    </div>

                    <div className="dashboard-link-item cell">
                        <Link to="/radar-data">
                            <img
                                className="preview-image"
                                src={CititzenWeatherVA2}
                                alt="app1"
                            />
                            <div className="dashboard-link-item__content">
                                <h4>Phase 2: MeteoMate Example</h4>
                                <p>
                                    Exemplary use case to compare the citizen reports from MeteoSchweiz with the radar data. 
                                </p>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
