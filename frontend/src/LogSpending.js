import React, { useState } from 'react';
import './LogSpending.css';

const LogSpending = () => {
    const [isManual, setIsManual] = useState(false);
    const [formData, setFormData] = useState({
	description: '',
	amount: '',
	category: '',
	date: '',
    });
    const [receipt, setReceipt] = useState(null);
    const [loading, setLoading] = useState(false); // Loading state
    const [error, setError] = useState(null); // Error state

    const handleInputChange = (e) => {
	const { name, value } = e.target;
	console.log(`Selected ${name}: ${value}`); // Log selected category
	setFormData({ ...formData, [name]: value });
	console.log(formData);
    };

    const handleFileUpload = (e) => {
	const file = e.target.files[0];
	setReceipt(file);
    };

    const handleManualInputClick = () => {
	setIsManual(true);
	setError(null); // Reset error when switching to manual input
    };

    const handleUploadReceiptClick = () => {
	setIsManual(false);
	setError(null); // Reset error when switching to upload receipt
    };

    const handleSubmit = async (e) => {
	const token = localStorage.getItem('token');
	setLoading(true); // Set loading to true
	setError(null); // Reset any previous errors  
	e.preventDefault();
	if (isManual) {
	    const amount = formData.amount;
	    const category = formData.category;
	    console.log(category);
	    const date = formData.date;
	    try {
		if (token === null) {
		    throw new Error("You have not logged in yet!");
		}
		const response = await fetch(`http://localhost:8000/api/manual-input/?amount=${amount}&category=${category}&date=${date}`, {
		    method: 'GET',
		    headers: {
			'Authorization': `Token ${token}`,
		    }
		});
		if (!response.ok) {
		    const errorData = await response.json(); // Get error data from response
		    throw new Error(errorData.error || 'An unknown error occurred');
		}

		const data = await response.json();
		console.log('Manual Entry:', formData);
		console.log('Response: ', data);

		setError(null); // Set error message
	    } catch (error) {
		console.error('Error during manual entry:', error);
		setError(error.message); // Set error message
	    }
	} else if (receipt) {
	    const form = new FormData();
	    form.append('image', receipt); // Use 'image' as the key

	    try {
		if (token === null) {
		    throw new Error("You have not logged in yet!");
		}
		const response = await fetch('http://localhost:8000/api/scan/', {
		    method: 'POST',
		    headers: {
			'Authorization': `Token ${token}`
		    },
		    body: form,
		});
		if (!response.ok) {
		    const errorData = await response.json(); // Get error data from response
		    throw new Error(errorData.error || 'An unknown error occurred');
		}
		const result = await response.json();
		console.log('OCR Result:', result);
		setError(null);
	    } catch (error) {
		console.error('Error during receipt handling:', error);
		setError(error.message); // Set error message
	    }
	    console.log('Uploaded Receipt:', receipt.name);
	}
	setFormData({ description: '', amount: '', category: '', date: '' });
	setReceipt(null);
	setLoading(false);
    };

    return (
	<div className="log-spending">
	    <h1>Log Spending</h1>
	    <div className="options">
		<button onClick={handleManualInputClick} className={isManual ? 'active' : ''}>
		    Input Manually
		</button>
		<button onClick={handleUploadReceiptClick} className={!isManual ? 'active' : ''}>
		    Upload Receipt
		</button>
	    </div>
	    <form onSubmit={handleSubmit}>
		{loading && <p>Loading...</p>} {/* Loading indicator */}
		{error && <p className="error">{error}</p>} {/* Error message */}
		{isManual ? (
		    <div className="manual-input">
			<label>
			    Description:
			    <input
				type="text"
				name="description"
				value={formData.description}
				onChange={handleInputChange}
				required
			    />
			</label>
			<label>
			    Amount:
			    <input
				type="number"
				name="amount"
				value={formData.amount}
				onChange={handleInputChange}
				required
			    />
			</label>
			<label>
			    Category:
			    <input
				type="text"
				name="category"
				value={formData.category}
				onChange={handleInputChange}
				required
			    />
			</label>
			<label>
			    Date:
			    <input
				type="date"
				name="date"
				value={formData.date}
				onChange={handleInputChange}
				required
			    />
			</label>
		    </div>
		) : (
		    <div className="upload-receipt">
			<label>
			    Upload Receipt:
			    <input type="file" accept="image/*" onChange={handleFileUpload} required />
			</label>
			{receipt && <p>Uploaded: {receipt.name}</p>}
		    </div>
		)}
		<button type="submit" className="submit-button" disabled={loading}>
		    Submit
		</button>

	    </form>
	</div>
    );
};

export default LogSpending;
