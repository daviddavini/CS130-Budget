import React, { useEffect, useState } from 'react';
import './Visualization.css';
import ExpensePieChart from './PieChart' ;
import ExpenseBarChart from './BarChart' ;

const Visualization = ({ startDate, endDate }) => {
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
	startDate: '',
	endDate: '',
    });
    const [loaded, setLoaded] = useState(false);
    const [expense, setExpense] = useState(null);

    const handleInputChange = (e) => {
	const { name, value } = e.target;
	setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
	setLoading(true);
	setError(null);
	e.preventDefault();
	const startDate = formData.startDate;
	const endDate = formData.endDate;
        try {
            const response = await fetch(`/api/visualize/?start=${startDate}&end=${endDate}`, {
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
        } catch (error) {
            setError(error.message);
	    setLoaded(false);
	    setExpense(null);
        } finally {
            setLoading(false);
	    setFormData({ startDate: "", endDate: "" });
        }
    };
    

    return (
        <div className="visualize">
            <h2>Transaction Summary</h2>
            <form onSubmit={handleSubmit}>
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
		{loaded &&
		 <>
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
		     <ExpensePieChart data={expense}/>
		     <ExpenseBarChart data={expense}/>
		 </>
		}
		
	    </form>
        </div>
    );
};

export default Visualization;
