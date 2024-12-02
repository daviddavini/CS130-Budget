import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './Home';
import LocationSearch from './LocationSearch';
import LogSpending from './LogSpending';
import Login from './Login';
import Signup from './Signup';
import BudgetPlan from './BudgetPlan';
import ConfirmBudgetPlan from './ConfirmBudgetPlan';
import Visualization from './Visualization';


const PrivateRoute = ({ element: Component }) => {
    const isAuthenticated = localStorage.getItem('token') !== null;
    return isAuthenticated ? Component : <Navigate to="/login" />;
};

const Views = () => {
    return (
        <Routes>
            <Route path="/" element={<PrivateRoute element={<Home />} />} />
            <Route path="/shops" element={<LocationSearch />} />
            <Route path="/log" element={<PrivateRoute element={<LogSpending />} />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/budgetplan" element={<PrivateRoute element={<BudgetPlan />} />} />
            <Route path="/confirmplan" element={<PrivateRoute element={<ConfirmBudgetPlan />} />} />
            <Route path="/visualize" element={<PrivateRoute element={<Visualization />} />} />
            <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
    );
};

export default Views;
