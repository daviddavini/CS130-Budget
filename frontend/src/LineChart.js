import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import './Visualization.css';


const COLORS = ['#FF5733', '#33FF57', '#FF33A1', '#FFC300', '#3357FF', '#AAC786', '#900C3F', '#581845', '#FF5733', '#C70039','#FFC300', '#28B463', '#3498DB', '#8E44AD'];


const ExpenseLineChart = ({ data }) => {
    const cumulative = {};
	    
    const sortedDates = Object.keys(data).sort();

    const processedDateSummary = [];

    sortedDates.forEach(date => {
    const categories = data[date];
    const entry = { date };

    // Initialize cumulative totals for any new categories
    for (const category in categories) {
        if (!cumulative[category]) {
            cumulative[category] = 0; // Initialize if not present
        }
        
        // Add current day's spending to cumulative total
        cumulative[category] += categories[category];
        cumulative[category] = Math.round(cumulative[category] * 100) / 100; // Round to 2 decimal places

        // Set the cumulative total in the entry
        entry[category] = cumulative[category];
    }

    // Ensure all categories are represented in the entry
    for (const category in cumulative) {
        if (!(category in entry)) {
            entry[category] = cumulative[category]; // Include zero if no spending today
        }
    }

    processedDateSummary.push(entry);
});
    return (
	<div>
	    <h3> Expense Progression Overview </h3>
            <LineChart width={600} height={300} data={processedDateSummary}>
		<CartesianGrid strokeDasharray="3 3" />
		<XAxis dataKey="date" tick={{ fill: '#4EA0FF' }}/>
		<YAxis tick={{ fill: '#4EA0FF' }}/>
		<Tooltip />
		<Legend />
		<Line type="monotone" dataKey="Housing" stroke={COLORS[0]} activeDot={{ r: 8 }} />
		<Line type="monotone" dataKey="Transportation" stroke={COLORS[1]} />
		<Line type="monotone" dataKey="Food" stroke={COLORS[2]} />
		<Line type="monotone" dataKey="Utilities" stroke={COLORS[3]} />
		<Line type="monotone" dataKey="Medical" stroke={COLORS[4]} />
		<Line type="monotone" dataKey="Insurance" stroke={COLORS[5]} />
		<Line type="monotone" dataKey="Education" stroke={COLORS[6]} />
		<Line type="monotone" dataKey="Entertainment" stroke={COLORS[7]} />
		<Line type="monotone" dataKey="Clothing" stroke={COLORS[8]} />
		<Line type="monotone" dataKey="Personal Care" stroke={COLORS[9]} />
		<Line type="monotone" dataKey="Pet" stroke={COLORS[10]} />
		<Line type="monotone" dataKey="Travel" stroke={COLORS[11]} />
		<Line type="monotone" dataKey="Gifting" stroke={COLORS[12]} />
		<Line type="monotone" dataKey="Misc" stroke={COLORS[13]} />
            </LineChart>
	</div>
    );
};

export default ExpenseLineChart;
