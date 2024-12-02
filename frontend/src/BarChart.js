import React, { useState, useContext } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell } from 'recharts';
import { ThemeContext } from './App';
import './Visualization.css';


const COLORS = [
    'rgba(255, 87, 51, 0.8)',   // #FF5733
    'rgba(51, 255, 87, 0.8)',   // #33FF57
    'rgba(255, 51, 161, 0.8)',   // #FF33A1
    'rgba(255, 195, 0, 0.8)',    // #FFC300
    'rgba(51, 87, 255, 0.8)',    // #3357FF
    'rgba(170, 199, 134, 0.8)',   // #AAC786
    'rgba(144, 12, 63, 0.8)',    // #900C3F
    'rgba(88, 24, 69, 0.8)',     // #581845
    'rgba(255, 165, 0, 0.8)',    // #FFA500
    'rgba(75, 192, 192, 0.8)',   // #4BC0C0
    'rgba(153, 102, 255, 0.8)',   // #9966FF
    'rgba(255, 99, 132, 0.8)',   // #FF6384
    'rgba(54, 162, 235, 0.8)',   // #36A2EB
    'rgba(255, 206, 86, 0.8)',   // #FFCE56
    'rgba(128, 77, 255, 0.8)'    // #804DFF
];


const ExpenseBarChart = ({ data }) => {
    const { theme } = useContext(ThemeContext);
    const chartData = Object.entries(data).map(([name, value]) => ({ name, value }));
    const axisLabelColor = theme === "dark" ? '#ddd' : '#222';
    return (
	<div>
	    <h3> Expense Breakdown </h3>
            <BarChart width={600} height={300} data={chartData}>
		<CartesianGrid strokeDasharray="3 3" />
		<XAxis dataKey="name" tick={{ fill: axisLabelColor }} />
		<YAxis tick={{ fill: axisLabelColor }} />
		<Tooltip />
		<Legend className='axis-label' />
		<Bar dataKey="value" fill="#8884d8">
                    {chartData.map((entry, index) => (
			<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
		</Bar>
            </BarChart>
	</div>
    );
};

export default ExpenseBarChart;
