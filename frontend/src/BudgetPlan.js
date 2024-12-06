import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Input, Button, Checkbox, Typography, notification, InputNumber } from 'antd';
import { useState, useContext } from 'react';
import { ThemeContext } from './App';

const { Title } = Typography;

/**
 * BudgetPlan component provides a form for setting the monthly income.
 * Once income is set, it notifies the user and navigates them to the confirmation page.
 *
 * @component
 * @example
 * return <BudgetPlan />;
 *
 * @returns {JSX.Element} A form component allowing the user to input their monthly income and proceed with their budget plan.
 */
const BudgetPlan = () => {
    const { theme } = useContext(ThemeContext);
    const [form] = Form.useForm();
    const [income, setIncome] = useState(0);
    const navigate = useNavigate();

    /**
     * Updates the income state based on the user's input.
     *
     * @param {number} value - The new income value provided by the user.
     */
    const handleIncomeChange = (value) => {
        setIncome(value);
    };

    /**
     * Handles the form submission by logging the budget plan values,
     * displaying a success notification, storing the income in local storage, and navigating to the confirmation page.
     *
     * @param {Object} values - The form values including the user's income.
     */
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
                    rules={[
                        { required: true, message: 'Income cannot be empty.' },
                        { type: 'number', message: 'Income must be a number.' },
                    ]}
                >
                    <InputNumber
                        value={income} 
                        onChange={handleIncomeChange}
                        min={0}
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
