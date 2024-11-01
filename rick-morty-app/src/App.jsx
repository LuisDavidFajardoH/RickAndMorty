import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Episodes from './pages/Episodes/Episodes';
import Characters from './pages/Characters/Characters';
import Locations from './pages/Locations/Locations';

import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/episodios" element={<Episodes />} />     
        <Route path="/personajes" element={<Characters />} />
        <Route path="/locaciones" element={<Locations />} />
      </Routes>
    </Router>
  );
}

export default App;
