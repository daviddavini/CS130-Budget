import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './Home';
import LocationSearch from './LocationSearch';
import LogSpending from './LogSpending';
import Login from './Login';

const Views = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shops" element={<LocationSearch />} />
            <Route path="/log" element={<LogSpending />} />
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<Login />} />
        </Routes>
    );
};

export default Views;
