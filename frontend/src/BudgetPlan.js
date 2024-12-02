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
    const navigate = useNavigate();

    const handleIncomeChange = (value) => {
        setIncome(value);
    };


    const onFinish = (values) => {
        console.log('Budget Plan:', values);
        notification.success({
            message: 'Income is set!',
            description: `Now alter your budget plan according to your income. Click 'Confirm Budget Plan' to save your plans.`,
        });
	localStorage.setItem('income', income);
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
