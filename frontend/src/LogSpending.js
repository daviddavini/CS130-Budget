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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    setReceipt(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isManual) {
      console.log('Manual Entry:', formData);
    } else if (receipt) {
      console.log('Uploaded Receipt:', receipt.name);
    }
    setFormData({ description: '', amount: '', category: '', date: '' });
    setReceipt(null);
  };

  return (
    <div className="log-spending">
      <h1>Log Spending</h1>
      <div className="options">
        <button onClick={() => setIsManual(true)} className={isManual ? 'active' : ''}>
          Input Manually
        </button>
        <button onClick={() => setIsManual(false)} className={!isManual ? 'active' : ''}>
          Upload Receipt
        </button>
      </div>
      <form onSubmit={handleSubmit}>
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
        <button type="submit" className="submit-button">
          Submit
        </button>
      </form>
    </div>
  );
};

export default LogSpending;
