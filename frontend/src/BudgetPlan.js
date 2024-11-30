import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Input, Button, Checkbox, Typography, notification, InputNumber } from 'antd';
import { useState, useContext } from 'react';
import { ThemeContext } from './App';

const { Title } = Typography;

const BudgetPlan = () => {
    const { theme } = useContext(ThemeContext);
    const [form] = Form.useForm();
    const [income, setIncome] = useState(0);
    const [expenses, setExpenses] = useState(0);
    const [savings, setSavings] = useState(0);
    const navigate = useNavigate();

    const handleIncomeChange = (value) => {
        setIncome(value);
    };

    const handleExpensesChange = (value) => {
        setExpenses(value);
    };

    const handleSavingsChange = (value) => {   
        setSavings(value);
    };

    const onFinish = (values) => {
        console.log('Budget Plan:', values);
        notification.success({
            message: 'Budget Plan Created',
            description: `Alter your plan as needed. Click 'Confirm Budget Plan' to proceed.`,
        });
        navigate('/confirmplan');
    }

    return (
        <div>
            <h1>Let's Make Your Plan</h1>
            <Form
                layout="horizontal"
                onFinish = {onFinish}
            >
                <Form.Item
                    label="Monthly Income:"
                    name="income"
                    rules={[{ required: true, message: 'Income cannot be empty.' },
                        { type: 'number', message: 'Income must be a number.' },
                    ]}
                >
                    
                    <InputNumber
                        value={income} 
                        onChange={handleIncomeChange}
                        min = {0}
                    />

                </Form.Item>

                <Form.Item
                    label="Estimated Monthly Expenses:"
                    name="expenses"
                    rules={[{ required: true, message: 'Expenses cannot be empty.'},
                        { type: 'number', message: 'Expenses must be a number.' },
                    ]}
                >
                    <InputNumber
                        value={expenses} 
                        onChange={handleExpensesChange}
                        min = {0}
                        max = {income}
                    />
                </Form.Item>

                <Form.Item
                    label="Desired Monthly Savings:"
                    name="savings"
                    rules={[{ required: true, message: 'Savings cannot be empty.' },
                        { type: 'number', message: 'Savings must be a number.' }, 
                    ]}
                >
                    <InputNumber 
                        value={savings} 
                        onChange={handleSavingsChange}
                        min = {0}
                        max = {income - expenses}
                    />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Make My Plan
                    </Button>
                </Form.Item>
            </Form>
        </div>


    );

};

export default BudgetPlan;