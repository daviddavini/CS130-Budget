import React, { useState, useEffect } from 'react';
import { Dropdown, Menu, Button, Input, DatePicker, Form, Spin, Alert, notification } from 'antd';
import './LogSpending.css';
import moment from 'moment';

/**
 * LogSpending component provides a user interface for logging spending either manually
 * or by uploading a receipt. It supports form validation, error handling, and notifications.
 *
 * @component
 * @returns {JSX.Element} The rendered LogSpending component.
 */
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

    /**
     * Handles changes in input fields for the manual entry form.
     *
     * @param {Object} e - The change event.
     */
    const handleInputChange = (e) => {
        const { name, value } = e.target;
	console.log(`Selected ${name}: ${value}`); // Log selected category
        setFormData({ ...formData, [name]: value });
	console.log(formData);
    };

    /**
     * Handles the selection of a category from the dropdown menu.
     *
     * @param {Object} e - The click event.
     */
    const handleMenuClick = (e) => {
        setFormData({ ...formData, category: e.key });
    };

    /**
     * Handles changes in the date picker for the manual entry form.
     *
     * @param {moment.Moment} date - The selected date as a Moment.js object.
     * @param {string} dateString - The selected date as a string.
     */
    const handleDateChange = (date, dateString) => {
        setFormData({ ...formData, date: dateString });
    };

    /**
     * Handles the upload of a receipt file.
     *
     * @param {Object} e - The change event.
     */
    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        setReceipt(file);
    };

    /**
     * Switches the interface to manual input mode.
     */
    const handleManualInputClick = () => {
        setIsManual(true);
        setError(null); // Reset error when switching to manual input
    };

    /**
     * Switches the interface to receipt upload mode.
     */
    const handleUploadReceiptClick = () => {
        setReceipt(null);
        setIsManual(false);
        setError(null); // Reset error when switching to upload receipt
    };

    /**
     * Handles form submission for logging spending.
     *
     * @async
     * @param {Object} e - The submit event.
     */
    const handleSubmit = async (e) => {
        const token = localStorage.getItem('token');
    setLoading(true); // Set loading to true
    setError(null); // Reset any previous errors  
    //e.preventDefault();
        if (isManual) {
      const amount = formData.amount;
      const category = formData.category;
      const date = formData.date;
            try {
        if (token === null) {
          throw new Error("You have not logged in yet!");
        }
                const response = await fetch(`/api/manual-input/?amount=${amount}&category=${category}&date=${date}`, {
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
	notification.success({
	    message: 'Spending logged successfully',
	    description: ``,
        });
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
                const response = await fetch('api/scan/', {
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
	notification.success({
	    message: 'Receipt logged successfully',
	    description: "",
        });
            } catch (error) {
        console.error('Error during receipt handling:', error);
        setError(error.message); // Set error message
            }
      console.log('Uploaded Receipt:', receipt.name);
      setFormData({ description: '', amount: '', category: '', date: '' });
        }

        setReceipt(null);
        setLoading(false);
    };

    useEffect(() => {
        console.log('Current Form Data:', formData);
    }, [formData]);

    const menu = (
        <Menu onClick={handleMenuClick}>
            <Menu.Item key="Savings">Savings</Menu.Item>
            <Menu.Item key="Housing">Housing</Menu.Item>
            <Menu.Item key="Transportation">Transportation</Menu.Item>
            <Menu.Item key="Food">Food</Menu.Item>
            <Menu.Item key="Utilities">Utilities</Menu.Item>
            <Menu.Item key="Medical">Medical</Menu.Item>
            <Menu.Item key="Insurance">Insurance</Menu.Item>
            <Menu.Item key="Education">Education</Menu.Item>
            <Menu.Item key="Entertainment">Entertainment</Menu.Item>
            <Menu.Item key="Clothing">Clothing</Menu.Item>
            <Menu.Item key="Personal Care">Personal Care</Menu.Item>
            <Menu.Item key="Pet">Pet</Menu.Item>
            <Menu.Item key="Travel">Travel</Menu.Item>
            <Menu.Item key="Gifting">Gifting</Menu.Item>
            <Menu.Item key="Misc">Miscellaneous</Menu.Item>
        </Menu>
    );

    return (
        <div className="log-spending">
            <h1>Log Spending</h1>
            <div className="options">
                <Button onClick={handleManualInputClick} type={isManual ? 'primary' : 'default'}>
                    Input Manually
                </Button>
                <Button onClick={handleUploadReceiptClick} type={!isManual ? 'primary' : 'default'}>
                    Upload Receipt
                </Button>
            </div>
            <Form
                onFinish={handleSubmit}
                layout="vertical"
                style={{ maxWidth: '450px', margin: 'auto', minWidth: '400px' }}>

        {loading && <Spin />} {/* Loading indicator */}
        {error && <Alert message={error} type="error" />} {/* Error message */}
                {isManual ? (
                    <div className="manual-input">
                        <Form.Item label="Description">
                            <Input
                                type="text"
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Item>
                        <Form.Item label="Amount">
                            <Input
                                type="number"
                                name="amount"
                                value={formData.amount}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Item>
                        <Form.Item label="Category">
                            <Dropdown overlay={menu}>
                                <Button style={{ width: '100%' }}>
                                    {formData.category || 'Select a category'}
                                </Button>
                            </Dropdown>
                        </Form.Item>
                        <Form.Item label="Date">
                            <DatePicker
                                name="date"
                                style={{ width: '100%' }}
                                value={formData.date ? moment(formData.date) : null}
                                onChange={handleDateChange}
                                required
                            />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit">Submit</Button>
                        </Form.Item>
                    </div>
                ) : (
                    <div className="upload-receipt">
                        <Form.Item label="Upload Receipt">
                            <Input
                                type="file"
                                onChange={handleFileUpload}
                                key={isManual ? 'manual' : 'upload'}
                                accept="image/*"
                            />
                        </Form.Item>
                        <Button type="primary" htmlType="submit">Submit</Button>
                    </div>
                )}
            </Form>
        </div>
    );
};

export default LogSpending;
