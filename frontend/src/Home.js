import React, { useEffect, useState } from 'react';
import ExpensePieChart from './PieChart';
import ExpenseBarChart from './BarChart';
import ExpenseLineChart from './LineChart';

const Home = () => {
    const [currentExpense, setCurrentExpense] = useState(null);
    const [dateExpenses, setDateExpenses] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
	fetchExpenses();
    }, []);

    const fetchExpenses = async () => {
	setError(null);
	try {
	    if (localStorage.getItem('token') === null) {
		throw new Error('You have not logged in yet!');
	    }
	    const currentDate = new Date();
	    const currentMonthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
	    console.log(currentMonthStart, currentDate);
	    const response = await fetch(`/api/visualize/?start=${currentMonthStart.toISOString().split('T')[0]}&end=${currentDate.toISOString().split('T')[0]}`, {
		method: 'GET',
                headers: {
                    Authorization: `Token ${localStorage.getItem('token')}`,
                },
            });

	    if (!response.ok) {
		throw new Error('Failed to fetch expenses');
	    }
	    const data = await response.json();
	    setCurrentExpense(data.summary);
	    
	    setDateExpenses(data.date_summary);
	} catch (error) {
	    setError(error.message);
	}
    };

    if (error) return <p className="error">{error}</p>;
    
    return (
	<div className="home-page">
	    <h1>Current Month Summary</h1>
	    {currentExpense && Object.keys(currentExpense).length > 0 ?
	     (
		 <>
		     <ExpenseLineChart data={dateExpenses} />
		     <ExpensePieChart data={currentExpense} />
		     <ExpenseBarChart data={currentExpense} />
		 </>
	     ) : (
		 <p>No expenses for the current month.</p>
	     )}
	</div>
    );
};

export default Home;
