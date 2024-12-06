import React, { useEffect, useState } from 'react';
import ExpensePieChart from './PieChart';
import ExpenseBarChart from './BarChart';
import ExpenseLineChart from './LineChart';
import GoalComparisonChart from './GoalComparisonChart';

/**
 * Home component serves as the dashboard displaying the current month's expense summary.
 * It fetches expense data, goal summaries, and date-specific expenses from the backend
 * and visualizes them using various chart components.
 *
 * @component
 * @example
 * return <Home />;
 *
 * @returns {JSX.Element} The Home dashboard with expense summaries and visualizations.
 */
const Home = () => {
    const [currentExpense, setCurrentExpense] = useState(null);
    const [dateExpenses, setDateExpenses] = useState(null);
    const [goals, setGoals] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchExpenses();
    }, []);

    /**
     * Fetches the current month's expense data, goal summaries, and date-specific expenses
     * from the backend API. It handles authentication by retrieving the token from local storage
     * and updates the component's state accordingly.
     *
     * @async
     * @function
     * @returns {Promise<void>} Resolves when the data fetching is complete.
     * @throws Will throw an error if the user is not logged in or if the fetch request fails.
     */
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
            setGoals(data.goal_summary);
            setDateExpenses(data.date_summary);
            console.log(goals);
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
                     {goals && <GoalComparisonChart expenses={currentExpense} goals={goals} />}
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
