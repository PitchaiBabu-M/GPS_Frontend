import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Import BrowserRouter

import Login from './Components/Login';
import MapHome from './Components/MapHome';
import PlaybackContainer from './Components/playback';
import GeofenceContainer from './Components/Geofence';

function App() {
  return (
    <Router>         
        <Routes>
         <Route exact path="/" element={<Login />} />
          <Route path="/dashboard" element={<MapHome />} />
          <Route path="/playback" element={<PlaybackContainer />} />
          <Route path="/geofence" element={<GeofenceContainer />} />

        </Routes>
    </Router>
  );
}

export default App;
