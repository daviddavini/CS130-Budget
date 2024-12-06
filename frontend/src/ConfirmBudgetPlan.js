import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Input, Button, Checkbox, Typography, notification, Row, Col, Slider, InputNumber } from 'antd';
import { useState, useContext } from 'react';
import { ThemeContext } from './App';

import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    Chart,
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
ChartJS.register(ArcElement, Tooltip, Legend);

const { Title } = Typography;

/**
 * ConfirmBudgetPlan component allows users to confirm or adjust their budget allocations across various categories.
 * It presents a Doughnut chart to visualize allocations and provides sliders and input fields to adjust them.
 *
 * On submission, it attempts to save the budget plan via a backend API call.
 *
 * @component
 * @example
 * return <ConfirmBudgetPlan />;
 *
 * @returns {JSX.Element} A form and chart interface for finalizing a user's budget plan.
 */
const ConfirmBudgetPlan = () => {
    const income = localStorage.getItem('income'); // Placeholder for income, retrieved from local storage
    const theme = useContext(ThemeContext);
    const [form] = Form.useForm();
    const navigate = useNavigate();

    const [categoryLimits, setCategoryLimit] = useState({
        savings: income * 0.2,
        housing: income * 0.3,
        transportation: 0,
        food: income * 0.1,
        utilities: 0,
        medical: 0,
        insurance: 0,
        education: 0,
        entertainment: 0,
        clothing: 0,
        personal: 0,
        pet: 0,
        travel: 0,
        gifting: 0,
        miscellaneous: 0,
    });

    const remainingBudget = income - Object.values(categoryLimits).reduce((sum, value) => sum + value, 0);

    const data = {
        labels: Object.keys(categoryLimits),
        datasets: [
            {
                label: 'Budget Plan',
                data: Object.values(categoryLimits),
                backgroundColor: [
                    'rgb(33, 13, 38)',
                    'rgb(99, 38, 115)',
                    'rgb(128, 79, 179)',
                    'rgb(200, 150, 250)',
                    'rgb(255, 99, 132)',
                    'rgb(54, 162, 235)',
                    'rgb(255, 206, 86)',
                    'rgb(75, 192, 192)',
                    'rgb(153, 102, 255)',
                    'rgb(255, 159, 64)',
                    'rgb(255, 99, 132)',
                    'rgb(54, 162, 235)',
                    'rgb(255, 206, 86)',
                    'rgb(75, 192, 192)',
                    'rgb(153, 102, 255)',
                ],
                hoverOffset: 4,
                circumference: 360,
                rotation: 0
            },
        ],
    };

    const options = {
        plugins: {
            legend: {
                position: 'left',
                labels : {
                    color: '#00AFCF',
                },
            },
        },
    };

    /**
     * Updates the specified category limit based on user input from the sliders or input fields.
     * Ensures that the category does not exceed the remaining available budget.
     *
     * @param {string} category - The category to update.
     * @param {number} newValue - The new budget value for the specified category.
     */
    const handleSliderChange = (category, newValue) => {
        setCategoryLimit(prevLimits => {
            const otherCategoriesTotal = Object.entries(prevLimits)
                .filter(([key]) => key !== category)
                .reduce((sum, [_, value]) => sum + value, 0);

            const maxAllowedValue = income - otherCategoriesTotal;
            const adjustedValue = Math.min(newValue, maxAllowedValue);

            return {
                ...prevLimits,
                [category]: adjustedValue
            };
        });
    };

    /**
     * Handles form submission by packaging the category limits into a budget plan,
     * calling the backend API to save them, and on success, navigating to the home page.
     * If the user is not logged in or the backend responds with an error, it logs the error.
     *
     * @async
     * @function
     * @param {Object} values - The current form values.
     */
    const onFinish = async (values) => {
        console.log('Budget Plan:', values);
        const budgetPlan = Object.entries(categoryLimits).map(([category, amount]) => [category, amount]);
        try {
            if (localStorage.getItem('token') === null) {
                throw new Error("You have not logged in yet!")
            }
            const response = await fetch('/api/set/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(budgetPlan)
            });
            if (!response.ok) {
                throw new Error("Error in backend");
            }
            const data = await response.json();

            notification.success({
                message: 'Budget Plan Confirmed',
                description: `Happy Saving!`,
            });
            navigate('/');
        } catch (error) {
            console.error("Error saving budget plan: ", error);
        }
    };

    return (
        <div style={{ theme }}>
            <Title level={2}>Confirm Budget Plan</Title>
            <Form
                form={form}
                layout="vertical"
                style={{ maxWidth: 600, margin: 'auto' }}
                onFinish={onFinish}
                initialValues={{
                    savings: 0,
                    housing: 0,
                    transportation: 0,
                    food: 0,
                    utilities: 0,
                    medical: 0,
                    insurance: 0,
                    education: 0,
                    entertainment: 0,
                    clothing: 0,
                    personal: 0,
                    pet: 0,
                    travel: 0,
                    gifting: 0,
                    miscellaneous: 0,
                }}
            >
                <Doughnut data={data} options={options} />
                <div> Remaining Budget: ${remainingBudget.toFixed(2)} </div>
                <Form.Item label="Current Budget Plan">
                    <Row gutter={[16, 16]}>
                        <Col span={12}>
                            <Form.Item label="Savings" name="savings">
                                <Row>
                                    <Col span={16}>
                                        <Slider
                                            min={0}
                                            max={remainingBudget + categoryLimits.savings}
                                            value={categoryLimits.savings}
                                            onChange={(value) => handleSliderChange('savings', value)}
                                        />
                                    </Col>
                                    <Col span={6} offset={2}>
                                        <InputNumber
                                            min={0}
                                            max={remainingBudget + categoryLimits.savings}
                                            value={categoryLimits.savings}
                                            onChange={(value) => handleSliderChange('savings', value)}
                                            style={{ width: '100%' }}
                                        />
                                    </Col>
                                </Row>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Housing" name="housing">
                                <Row>
                                    <Col span={16}>
                                        <Slider
                                            min={0}
                                            max={remainingBudget + categoryLimits.housing}
                                            value={categoryLimits.housing}
                                            onChange={(value) => handleSliderChange('housing', value)}
                                        />
                                    </Col>
                                    <Col span={6} offset={2}>
                                        <InputNumber
                                            min={0}
                                            max={remainingBudget + categoryLimits.housing}
                                            value={categoryLimits.housing}
                                            onChange={(value) => handleSliderChange('housing', value)}
                                            style={{ width: '100%' }}
                                        />
                                    </Col>
                                </Row>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Transportation" name="transportation">
                                <Row>
                                    <Col span={16}>
                                        <Slider
                                            min={0}
                                            max={remainingBudget + categoryLimits.transportation}
                                            value={categoryLimits.transportation}
                                            onChange={(value) => handleSliderChange('transportation', value)}
                                        />
                                    </Col>
                                    <Col span={6} offset={2}>
                                        <InputNumber
                                            min={0}
                                            max={remainingBudget + categoryLimits.transportation}
                                            value={categoryLimits.transportation}
                                            onChange={(value) => handleSliderChange('transportation', value)}
                                            style={{ width: '100%' }}
                                        />
                                    </Col>
                                </Row>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Food" name="food">
                                <Row>
                                    <Col span={16}>
                                        <Slider
                                            min={0}
                                            max={remainingBudget + categoryLimits.food}
                                            value={categoryLimits.food}
                                            onChange={(value) => handleSliderChange('food', value)}
                                        />
                                    </Col>
                                    <Col span={6} offset={2}>
                                        <InputNumber
                                            min={0}
                                            max={remainingBudget + categoryLimits.food}
                                            value={categoryLimits.food}
                                            onChange={(value) => handleSliderChange('food', value)}
                                            style={{ width: '100%' }}
                                        />
                                    </Col>
                                </Row>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Utilities" name="utilities">
                                <Row>
                                    <Col span={16}>
                                        <Slider
                                            min={0}
                                            max={remainingBudget + categoryLimits.utilities}
                                            value={categoryLimits.utilities}
                                            onChange={(value) => handleSliderChange('utilities', value)}
                                        />
                                    </Col>
                                    <Col span={6} offset={2}>
                                        <InputNumber
                                            min={0}
                                            max={remainingBudget + categoryLimits.utilities}
                                            value={categoryLimits.utilities}
                                            onChange={(value) => handleSliderChange('utilities', value)}
                                            style={{ width: '100%' }}
                                        />
                                    </Col>
                                </Row>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Medical" name="medical">
                                <Row>
                                    <Col span={16}>
                                        <Slider
                                            min={0}
                                            max={remainingBudget + categoryLimits.medical}
                                            value={categoryLimits.medical}
                                            onChange={(value) => handleSliderChange('medical', value)}
                                        />
                                    </Col>
                                    <Col span={6} offset={2}>
                                        <InputNumber
                                            min={0}
                                            max={remainingBudget + categoryLimits.medical}
                                            value={categoryLimits.medical}
                                            onChange={(value) => handleSliderChange('medical', value)}
                                            style={{ width: '100%' }}
                                        />
                                    </Col>
                                </Row>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Insurance" name="insurance">
                                <Row>
                                    <Col span={16}>
                                        <Slider
                                            min={0}
                                            max={remainingBudget + categoryLimits.insurance}
                                            value={categoryLimits.insurance}
                                            onChange={(value) => handleSliderChange('insurance', value)}
                                        />
                                    </Col>
                                    <Col span={6} offset={2}>
                                        <InputNumber
                                            min={0}
                                            max={remainingBudget + categoryLimits.insurance}
                                            value={categoryLimits.insurance}
                                            onChange={(value) => handleSliderChange('insurance', value)}
                                            style={{ width: '100%' }}
                                        />
                                    </Col>
                                </Row>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Education" name="education">
                                <Row>
                                    <Col span={16}>
                                        <Slider
                                            min={0}
                                            max={remainingBudget + categoryLimits.education}
                                            value={categoryLimits.education}
                                            onChange={(value) => handleSliderChange('education', value)}
                                        />
                                    </Col>
                                    <Col span={6} offset={2}>
                                        <InputNumber
                                            min={0}
                                            max={remainingBudget + categoryLimits.education}
                                            value={categoryLimits.education}
                                            onChange={(value) => handleSliderChange('education', value)}
                                            style={{ width: '100%' }}
                                        />
                                    </Col>
                                </Row>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Entertainment" name="entertainment">
                                <Row>
                                    <Col span={16}>
                                        <Slider
                                            min={0}
                                            max={remainingBudget + categoryLimits.entertainment}
                                            value={categoryLimits.entertainment}
                                            onChange={(value) => handleSliderChange('entertainment', value)}
                                        />
                                    </Col>
                                    <Col span={6} offset={2}>
                                        <InputNumber
                                            min={0}
                                            max={remainingBudget + categoryLimits.entertainment}
                                            value={categoryLimits.entertainment}
                                            onChange={(value) => handleSliderChange('entertainment', value)}
                                            style={{ width: '100%' }}
                                        />
                                    </Col>
                                </Row>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Clothing" name="clothing">
                                <Row>
                                    <Col span={16}>
                                        <Slider
                                            min={0}
                                            max={remainingBudget + categoryLimits.clothing}
                                            value={categoryLimits.clothing}
                                            onChange={(value) => handleSliderChange('clothing', value)}
                                        />
                                    </Col>
                                    <Col span={6} offset={2}>
                                        <InputNumber
                                            min={0}
                                            max={remainingBudget + categoryLimits.clothing}
                                            value={categoryLimits.clothing}
                                            onChange={(value) => handleSliderChange('clothing', value)}
                                            style={{ width: '100%' }}
                                        />
                                    </Col>
                                </Row>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Personal" name="personal">
                                <Row>
                                    <Col span={16}>
                                        <Slider
                                            min={0}
                                            max={remainingBudget + categoryLimits.personal}
                                            value={categoryLimits.personal}
                                            onChange={(value) => handleSliderChange('personal', value)}
                                        />
                                    </Col>
                                    <Col span={6} offset={2}>
                                        <InputNumber
                                            min={0}
                                            max={remainingBudget + categoryLimits.personal}
                                            value={categoryLimits.personal}
                                            onChange={(value) => handleSliderChange('personal', value)}
                                            style={{ width: '100%' }}
                                        />
                                    </Col>
                                </Row>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Pet" name="pet">
                                <Row>
                                    <Col span={16}>
                                        <Slider
                                            min={0}
                                            max={remainingBudget + categoryLimits.pet}
                                            value={categoryLimits.pet}
                                            onChange={(value) => handleSliderChange('pet', value)}
                                        />
                                    </Col>
                                    <Col span={6} offset={2}>
                                        <InputNumber
                                            min={0}
                                            max={remainingBudget + categoryLimits.pet}
                                            value={categoryLimits.pet}
                                            onChange={(value) => handleSliderChange('pet', value)}
                                            style={{ width: '100%' }}
                                        />
                                    </Col>
                                </Row>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Travel" name="travel">
                                <Row>
                                    <Col span={16}>
                                        <Slider
                                            min={0}
                                            max={remainingBudget + categoryLimits.travel}
                                            value={categoryLimits.travel}
                                            onChange={(value) => handleSliderChange('travel', value)}
                                        />
                                    </Col>
                                    <Col span={6} offset={2}>
                                        <InputNumber
                                            min={0}
                                            max={remainingBudget + categoryLimits.travel}
                                            value={categoryLimits.travel}
                                            onChange={(value) => handleSliderChange('travel', value)}
                                            style={{ width: '100%' }}
                                        />
                                    </Col>
                                </Row>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Gifting" name="gifting">
                                <Row>
                                    <Col span={16}>
                                        <Slider
                                            min={0}
                                            max={remainingBudget + categoryLimits.gifting}
                                            value={categoryLimits.gifting}
                                            onChange={(value) => handleSliderChange('gifting', value)}
                                        />
                                    </Col>
                                    <Col span={6} offset={2}>
                                        <InputNumber
                                            min={0}
                                            max={remainingBudget + categoryLimits.gifting}
                                            value={categoryLimits.gifting}
                                            onChange={(value) => handleSliderChange('gifting', value)}
                                            style={{ width: '100%' }}
                                        />
                                    </Col>
                                </Row>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Miscellaneous" name="miscellaneous">
                                <Row>
                                    <Col span={16}>
                                        <Slider
                                            min={0}
                                            max={remainingBudget + categoryLimits.miscellaneous}
                                            value={categoryLimits.miscellaneous}
                                            onChange={(value) => handleSliderChange('miscellaneous', value)}
                                        />
                                    </Col>
                                    <Col span={6} offset={2}>
                                        <InputNumber
                                            min={0}
                                            max={remainingBudget + categoryLimits.miscellaneous}
                                            value={categoryLimits.miscellaneous}
                                            onChange={(value) => handleSliderChange('miscellaneous', value)}
                                            style={{ width: '100%' }}
                                        />
                                    </Col>
                                </Row>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Confirm Budget Plan
                    </Button>
                </Form.Item>
            </Form>

            <Link to="/budgetplan" style={{ color: theme.primaryColor }}>
                <Button type="link" htmlType="button">
                    Back to Budget Plans
                </Button>
            </Link>
        </div>
    );
};

export default ConfirmBudgetPlan;
