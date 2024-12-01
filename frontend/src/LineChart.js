import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import './Visualization.css';


const COLORS = ['#FF5733', '#33FF57', '#FF33A1', '#FFC300', '#3357FF', '#AAC786', '#900C3F', '#581845', '#FF5733', '#C70039','#FFC300', '#28B463', '#3498DB', '#8E44AD'];


const ExpenseLineChart = ({ data }) => {
    return (
        <LineChart width={600} height={300} data={data}>
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
    );
};

export default ExpenseLineChart;
