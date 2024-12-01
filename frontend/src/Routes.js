import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './Home';
import LocationSearch from './LocationSearch';
import LogSpending from './LogSpending';
import Login from './Login';
import Signup from './Signup';
import BudgetPlan from './BudgetPlan';
import ConfirmBudgetPlan from './ConfirmBudgetPlan';
import Visualization from './Visualization';

const Views = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shops" element={<LocationSearch />} />
            <Route path="/log" element={<LogSpending />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/budgetplan" element={<BudgetPlan />} />
            <Route path="/confirmplan" element={<ConfirmBudgetPlan />} />
            <Route path="*" element={<Login />} />
	    <Route path="/visualize" element={<Visualization />} />
        </Routes>
    );
};

export default Views;
