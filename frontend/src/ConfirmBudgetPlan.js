import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Input, Button, Checkbox, Typography, notification, Row, Col, Slider } from 'antd';
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

const ConfirmBudgetPlan = () => {
    const theme = useContext(ThemeContext);
    const [form] = Form.useForm();
    const navigate = useNavigate();

    const income = 1000; // Placeholder for income, get value from account
    const [savingsLimit, setSavings] = useState(200);
    const [groceryLimit, setGroceries] = useState(200);
    const [housingLimit, setHousing] = useState(200);
    const [miscellaneousLimit, setMiscellaneous] = useState(200);

    const data = {
        labels: ['Savings', 'Groceries', 'Housing', 'Miscellaneous'],
        datasets: [
            {
                label: 'Budget Plan',
                data: [savingsLimit, groceryLimit, housingLimit, miscellaneousLimit],
                backgroundColor: [
                    'rgb(33, 13, 38)',
                    'rgb(99, 38, 115)',
                    'rgb(128, 79, 179)',
                    'rgb(200, 150, 250)',
                ],
                hoverOffset: 4,
                circumference: 180,
                rotation: 270
            },
        ],
    };

    const options = {

    };

    const handleSliderChange = (setter, value) => {
        const total = savingsLimit + groceryLimit + housingLimit + miscellaneousLimit - setter(value);
        if (total <= income) {
            setter(value);
        } else {
            
        }
    };


    const onFinish = (values) => {
        console.log('Budget Plan:', values);
        notification.success({
            message: 'Budget Plan Confirmed',
            description: `Happy Saving!`,
        });
        navigate('/');
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
                    savings: 20,
                    groceries: 20,
                    housing: 20,
                    miscellaneous: 20,
                }}
            >
                
                <Doughnut data={data} options={options} />
                <Form.Item label="Current Budget Plan">
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item label="Savings" name="savings">
                                <Slider min={0} 
                                        max={income} 
                                        value = {savingsLimit}
                                        onChange={(value) => handleSliderChange(setSavings, value)}/>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Groceries" name="groceries">
                                <Slider min={0} 
                                        max={income} 
                                        value = {groceryLimit}
                                        onChange={(value) => handleSliderChange(setGroceries, value)}/>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item label="Housing" name="housing">
                                <Slider min={0} 
                                        max={income} 
                                        value = {housingLimit} 
                                        onChange={(value) => handleSliderChange(setHousing, value)}/>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Miscellaneous" name="miscellaneous">
                                <Slider min={0} 
                                        max={income} 
                                        value = {miscellaneousLimit} 
                                        onChange={(value) => handleSliderChange(setMiscellaneous, value)}/>
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