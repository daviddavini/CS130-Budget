import React, { useState, useContext } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { ThemeContext } from './App';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const GoalComparisonChart = ({ expenses, goals }) => {
    const { theme } = useContext(ThemeContext);
    const standardizeKeys = (obj) => {
	const keyMappings = {
	    'personal': 'personal care',
	    'personal care': 'personal care',
	    'misc': 'miscellaneous'
	};

	return Object.fromEntries(
	    Object.entries(obj).map(([key, value]) => {
		const lowercaseKey = key.toLowerCase();
		const standardKey = keyMappings[lowercaseKey] || lowercaseKey;
		return [standardKey, value];
	    })
	);
    };
    
    expenses = standardizeKeys(expenses);
    goals = standardizeKeys(goals);
    const categories = Object.keys(goals);
    const data = {
	labels: categories,
	datasets: [
	    {
		label: 'Actual Expenses',
		data: categories.map(category => expenses[category] || 0),
		backgroundColor: 'rgba(255, 99, 132, 0.8)',
	    },
	    {
		label: 'Goals',
		data: categories.map(category => goals[category]),
		backgroundColor: 'rgba(53, 162, 235, 0.8)',
	    },
	],
    };

    const options = {
	responsive: true,
	plugins: {
	    legend: {
		position: 'top',
		labels: {
		    color: theme === "dark" ? '#ddd' : '#222',
		},
	    },
	    title: {
		display: true,
		text: 'Expenses vs Goals Comparison',
		color: theme === "dark" ? '#ddd' : '#222',
		font: {
		    size: 18,
		},
	    },
	},
	scales: {
	    x: {
		ticks: {
		    color: theme === "dark" ? '#ddd' : '#222',
		},
		grid: {
		    color: theme === "dark" ? 'rgba(255, 255, 255, 0.2)' : 'rgba(20, 20, 20, 0.2)',
		},
	    },
	    y: {
		ticks: {
		    color: theme === "dark" ? '#ddd' : '#222',
		},
		grid: {
		    color: theme === "dark" ?  'rgba(255, 255, 255, 0.2)' : 'rgba(20, 20, 20, 0.2)',
		},
	    },
	    
	},
    };
    
    const exceededCategories = categories.filter(category => (expenses[category] || 0) > (goals[category] || 0));

    return (
        <div>
            <Bar options={options} data={data} />
            <div style={{ marginTop: '20px' }}>
                {exceededCategories.length > 0 ? (
                    <span style={{ color: '#FA003F' }}>
                        Warning: You have exceeded your budget for the following categories:
			<br></br>
			<strong>{exceededCategories.join(', ')}</strong>
                        
                    </span>
                ) : (
                    <span>No budget exceeded!</span>
                )}
            </div>
        </div>
    );
};

export default GoalComparisonChart;
