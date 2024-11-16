import LocationSearch from './LocationSearch';
import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './Navbar';
import Home from './Home';

const App = () => {
    return (
        <div className="app">
            <Router>
                <Navbar />
                <div className="content">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/shops" element={<LocationSearch />} />
                    </Routes>
                </div>
            </Router>
        </div>
    );
};

export default App;
