import React from 'react';
import { PieChart, Pie, Cell, Legend } from 'recharts';
import './Visualization.css';

const COLORS = ['#FF5733', '#33FF57', '#FF33A1', '#FFC300', '#3357FF', '#AAC786', '#900C3F', '#581845', '#FF5733', '#C70039','#FFC300', '#28B463', '#3498DB', '#8E44AD'];

const ExpensePieChart = ({ data }) => {
    const chartData = Object.entries(data).map(([name, value]) => ({ name, value }));
    return (
	<div className="pie-chart">
	    <PieChart width={400} height={400}>
		<Pie
		    data={chartData}
		    cx={200}
		    cy={200}
		    labelLine={false}
		    outerRadius={80}
		    fill="#8884d8"
		    dataKey="value"
		    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
		>
		    {chartData.map((entry, index) => (
			<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
		    ))}
		</Pie>
		<Legend />
	    </PieChart>
	</div>
    );
};

export default ExpensePieChart;
