import React from 'react';
import { Link } from 'react-router-dom';
import { Form, Input, Button, Checkbox, Typography, notification } from 'antd';
import { useState, useContext } from 'react';
import { ThemeContext } from './App';

const { Title } = Typography;

const BudgetPlan = () => {
    const { theme } = useContext(ThemeContext);
    const [form] = Form.useForm();
    const [income, setIncome] = useState(0);
    const [expenses, setExpenses] = useState(0);
    const [savings, setSavings] = useState(0);

    const handleIncomeChange = (e) => {
        setIncome(e.target.value);
    };

    const handleExpensesChange = (e) => {
        setExpenses(e.target.value);
    };

    const handleSavingsChange = (e) => {   
        setSavings(e.target.value);
    };

    return (
        <div>
            <h1>Let's Make Your Plan</h1>
            <Form
                layout="horizontal"
            >
                <Form.Item
                    label="Monthly Income:"
                    name="income"
                    rules={[{ required: true, message: 'Income cannot be empty.' }
                    ]}
                >
                    
                    <Input 
                        value={income} 
                        onChange={handleIncomeChange}
                    />

                </Form.Item>

                <Form.Item
                    label="Estimated Monthly Expenses:"
                    name="expenses"
                    rules={[{ required: true, message: 'Expenses cannot be empty.' }]}
                >
                    <Input 
                        value={expenses} 
                        onChange={handleExpensesChange}
                    />
                </Form.Item>

                <Form.Item
                    label="Desired Monthly Savings:"
                    name="savings"
                    rules={[{ required: true, message: 'Savings cannot be empty.' }]}
                >
                    <Input 
                        value={savings} 
                        onChange={handleSavingsChange}
                    />
                </Form.Item>

                <Form.Item>
                    <Link to = "/confirmplan">
                    <Button type="primary" htmlType="submit">
                        Make My Plan
                    </Button>
                    </Link>
                </Form.Item>
            </Form>
        </div>


    );

};

export default BudgetPlan;