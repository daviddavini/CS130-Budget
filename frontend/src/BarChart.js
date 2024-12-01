import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell } from 'recharts';
import './Visualization.css';


const COLORS = ['#FF5733', '#33FF57', '#FF33A1', '#FFC300', '#3357FF', '#AAC786', '#900C3F', '#581845', '#FF5733', '#C70039','#FFC300', '#28B463', '#3498DB', '#8E44AD'];

const ExpenseBarChart = ({ data }) => {
    const chartData = Object.entries(data).map(([name, value]) => ({ name, value }));
    return (
        <BarChart width={600} height={300} data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" tick={{ fill: '#4EA0FF' }} />
            <YAxis tick={{ fill: '#4EA0FF' }} />
            <Tooltip />
            <Legend className='axis-label' />
            <Bar dataKey="value" fill="#8884d8">
                {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
            </Bar>
        </BarChart>
    );
};

export default ExpenseBarChart;
