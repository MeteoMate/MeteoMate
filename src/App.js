import React from "react";
import './App.css';
import { BrowserRouter as Router, Navigate, Route, Routes } from "react-router-dom";
import Selection from "./components/selection/Selection";
import Comparison from "./components/comparison/Comparison";
import Dashboard from "./pages/dashboard/Dashboard";

import "./static/style/styles.css";
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import RadarData from "./pages/weatherva-v2/RadarData";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconUrl: markerIcon,
    iconRetinaUrl: markerIcon2x,
    shadowUrl: markerShadow,
})

export default function App() {
    return (
        <Router>
            <Routes>
                <Route path="/selection" element={<Selection />} />
                <Route path="/comparison" element={<Comparison />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/radar-data" element={<RadarData />} />

                <Route path="/" element={<Navigate replace to="dashboard" />} />
            </Routes>
        </Router>
    );
}
