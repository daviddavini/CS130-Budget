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
	    const currentDate = new Date();
	    const currentMonthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
	    const nextDate = new Date(currentDate);
nextDate.setDate(currentDate.getDate() + 1);
	    const response = await fetch(`/api/visualize/?start=${currentMonthStart.toISOString().split('T')[0]}&end=${nextDate.toISOString().split('T')[0]}`, {
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

	    
	    const cumulative = {};
	    
	    const dateSummary = data.date_summary;
	    console.log(dateSummary);
	    const sortedDates = Object.keys(dateSummary).sort();

	    const processedDateSummary = [];

	    sortedDates.forEach(date => {
		const categories = dateSummary[date];
		const entry = { date };

		// Update cumulative totals for each existing category
		for (const category of Object.keys(cumulative)) {
		    // Initialize if not already present
		    if (!cumulative[category]) {
			cumulative[category] = 0;
		    }
		    
		    // Set current day's spending or zero if not present
		    entry[category] = categories[category] || 0; // Use zero if no spending

		    // Add current day's spending to cumulative total
		    cumulative[category] += entry[category];
		    cumulative[category] = Math.round(cumulative[category] * 100) / 100;
		    
		    // Update entry with cumulative total
		    entry[category] = cumulative[category];
		}

		// add new categories
		for (const category in categories) {
		    if (cumulative[category]) {
			continue;
		    }
		    cumulative[category] = 0;
		    cumulative[category] += categories[category];
		    cumulative[category] = Math.round(cumulative[category] * 100) / 100;

		    entry[category] = cumulative[category];
		}
		processedDateSummary.push(entry);
	    });
	    console.log(processedDateSummary);
	    setDateExpenses(processedDateSummary);
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
