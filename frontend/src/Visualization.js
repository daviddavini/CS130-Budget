import React, { useEffect, useState } from 'react';
import './Visualization.css';
import ExpensePieChart from './PieChart' ;
import ExpenseBarChart from './BarChart' ;
import ExpenseLineChart from './LineChart' ;

const Visualization = ({ startDate, endDate }) => {
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
	startDate: '',
	endDate: '',
    });
    const [loaded, setLoaded] = useState(false);
    const [expense, setExpense] = useState(null);
    const [dateExpenses, setDateExpenses] = useState(null);
    const [selected, setSelected] = useState({
	table: true,
	pieChart: true,
	barChart: true,
	lineChart: true
    });

    const handleInputChange = (e) => {
	const { name, value } = e.target;
	setFormData({ ...formData, [name]: value });
    };

    const handleCheckboxChange = (e) => {
	setSelected({
	    ...selected,
	    [e.target.name]: e.target.checked
	});
    };

    const handleSubmit = async (e) => {
	setLoading(true);
	setError(null);
	e.preventDefault();
	console.log("Hello");
	const startDate = new Date(formData.startDate);
	startDate.setHours(0, 0, 0, 0);
	startDate.setDate(startDate.getDate() + 1);
	const endDate = new Date(formData.endDate);
	endDate.setHours(16, 0, 0, 0);
	const nextDate = new Date(endDate);
	nextDate.setDate(endDate.getDate() + 2);
	console.log(startDate, nextDate);
        try {
	    if (localStorage.getItem('token') === null) {
		throw new Error("You have not logged in yet!");
	    }
            const response = await fetch(`/api/visualize/?start=${startDate.toISOString().split('T')[0]}&end=${nextDate.toISOString().split('T')[0]}`, {
		method: 'GET',
                headers: {
                    Authorization: `Token ${localStorage.getItem('token')}`,
                },
            });
	    if (!response.ok) {
		const errorData = await response.json();
		throw new Error(errorData.error || 'An unknown error occurred');
	    }
	    const result = await response.json();
	    console.log('visualization result: ', result);
	    if (Object.keys(result.summary).length === 0) {
		throw new Error("No expenses in this period of time");
	    }
	    setError(null);
	    setLoaded(true);
	    setExpense(result.summary);
	    setDateExpenses(result.date_summary);
        } catch (error) {
            setError(error.message);
	    setLoaded(false);
	    setExpense(null);
	    setDateExpenses(null);
        } finally {
            setLoading(false);
	    setFormData({ startDate: "", endDate: "" });
        }
    };
    

    return (
        <div className="visualize">
            <h2>Expense Summary</h2>
            <form onSubmit={handleSubmit} className='form'>
		{loading && <p>Loading...</p>} {/* Loading indicator */}
		{error && <p className="error">{error}</p>} {/* Error message */}
		<div className="date-input">
		    <label>
			Date:
			<input
			    type="date"
			    name="startDate"
			    value={formData.startDate}
			    onChange={handleInputChange}
			    required
			/>
		    </label>
		    <label>
			Date:
			<input
			    type="date"
			    name="endDate"
			    value={formData.endDate}
			    onChange={handleInputChange}
			    required
			/>
		    </label>
		</div>

		
		<button type="submit" className="submit-button" disabled={loading}>
		    Submit
		</button>
	    </form>
	    <div className='visual-options'>
		<label>
		    <input
			type="checkbox"
			name="table"
			checked={selected.table}
			onChange={handleCheckboxChange}
		    />
		    Table
		</label>
		<label>
		    <input
			type="checkbox"
			name="pieChart"
			checked={selected.pieChart}
			onChange={handleCheckboxChange}
		    />
		    Pie Chart
		</label>
		<label>
		    <input
			type="checkbox"
			name="barChart"
			checked={selected.barChart}
			onChange={handleCheckboxChange}
		    />
		    Bar Chart
		</label>
		<label>
		    <input
			type="checkbox"
			name="lineChart"
			checked={selected.lineChart}
			onChange={handleCheckboxChange}
		    />
		    Line Chart
		</label>
	    </div>
	    {loaded &&
	     <>
		 {selected.table &&
		  <table className="table-summary">
		      <thead>
			  <tr>
			      <th>Category</th>
			      <th>Amount</th>
			  </tr>
		      </thead>
		      <tbody>
			  {Object.entries(expense).map(([category, amount]) => (
			      <tr key={category}>
				  <td>{category}</td>
				  <td>${amount.toFixed(2)}</td>
			      </tr>
			  ))}
		      </tbody>
		  </table>
		 }
		 {selected.pieChart && <ExpensePieChart data={expense}/>}
		 {selected.barChart && <ExpenseBarChart data={expense}/>}
		 {selected.lineChart && <ExpenseLineChart data={dateExpenses}/>}
	     </>
	    }
	    
	    
        </div>
    );
};

export default Visualization;
