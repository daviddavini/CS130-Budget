import React from 'react';
import { PieChart, Pie, Cell, Legend } from 'recharts';
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


const ExpensePieChart = ({ data }) => {
    const chartData = Object.entries(data).map(([name, value]) => ({ name, value }));
    return (
	<>
	    <h3> Expense Distribution </h3>
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
	</>
    );
};

export default ExpensePieChart;
