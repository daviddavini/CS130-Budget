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

/**
 * PrivateRoute is a higher-order component that wraps a route and checks if the user is authenticated.
 * If the user is not authenticated, it redirects them to the login page.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {JSX.Element} props.element - The component to render if the user is authenticated.
 * @returns {JSX.Element} The rendered PrivateRoute component or a redirect to the login page.
 */
const PrivateRoute = ({ element: Component }) => {
    const isAuthenticated = localStorage.getItem('token') !== null;
    return isAuthenticated ? Component : <Navigate to="/login" />;
};

/**
 * Views component defines the routing structure for the application.
 * It includes private routes for authenticated users and public routes for everyone.
 *
 * @component
 * @returns {JSX.Element} The rendered Views component with defined routes.
 */
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
