import React, { useState, useContext, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { ThemeContext } from './App';
import { notification } from 'antd';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

/**
 * GoalComparisonChart component compares the user's actual expenses against their set budget goals.
 * It displays a bar chart using Chart.js, where each category is represented by two bars:
 * one for actual expenses and one for the goal amount.
 *
 * If the user exceeds the budget in any category, a warning notification is displayed.
 *
 * @component
 * @example
 * const expenses = { food: 300, housing: 1200, transportation: 200 };
 * const goals = { food: 250, housing: 1000, transportation: 300 };
 * return <GoalComparisonChart expenses={expenses} goals={goals} />;
 *
 * @param {Object} props - The component props.
 * @param {Object} props.expenses - An object where keys represent expense categories and values represent actual amounts spent.
 * @param {Object} props.goals - An object where keys represent expense categories and values represent budget goal amounts.
 * @returns {JSX.Element} A bar chart comparing actual expenses to budget goals, along with a warning message if budgets are exceeded.
 */
const GoalComparisonChart = ({ expenses, goals }) => {
    const { theme } = useContext(ThemeContext);
    const [notificationOn, setNotificationOn] = useState(false);
    
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
    
    if (exceededCategories.length > 0 && !notificationOn) {
        notification.warning({
            message: 'Warning',
            description: `You have exceeded your budget for the following categories: ${exceededCategories.join(', ')}`,
        });
        setNotificationOn(true); 
    }

    return (
        <div>
            <Bar options={options} data={data} />
            <div style={{ marginTop: '20px' }}>
                {exceededCategories.length > 0 ? (
                    <span style={{ color: '#FA003F' }}>
                        Warning: You have exceeded your budget for the following categories:
                        <br />
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
