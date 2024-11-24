import LocationSearch from './LocationSearch';
import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './Navbar';
import Home from './Home';
import LogSpending from './LogSpending';
import Login from './Login';

const App = () => {
    return (
        <div className="app">
            <Router>
                <Navbar />
                <div className="content">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/shops" element={<LocationSearch />} />
                        <Route path="/log" element={<LogSpending />} />
                        <Route path="/login" element={<Login />} />
                    </Routes>
                </div>
            </Router>
        </div>
    );
};

export default App;
