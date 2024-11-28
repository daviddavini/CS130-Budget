import React from 'react';
import { Link } from 'react-router-dom';
import { Form, Input, Button, Typography, notification } from 'antd';
import { useContext } from 'react';
import { ThemeContext } from './App'; // Assuming ThemeContext is already set up
import piggy from './assets/Piggy.png';
import './Login.css';

const { Title } = Typography;

const Signup = () => {
    const { theme } = useContext(ThemeContext);

   /*  const onFinish = (values) => {
        console.log('Sign-Up Data:', values);
        notification.success({
            message: 'Account Created',
            description: `Welcome, ${values.username}! Your account has been successfully created.`,
        });
    }; */

    return (
        <div className={`signup-block ${theme}`} style={{ padding: '20px', maxWidth: '400px', margin: 'auto' }}>
            <img
                src={piggy}
                alt=""
                className="signup-piggy"
            />
            <Title level={2} style={{ textAlign: 'center' }}>Welcome to Clever Cash!</Title>
            <Form
                //name="signup_form"
                //onFinish={onFinish}
                layout="vertical"
            >
                <Form.Item
                    label="Enter your email or create a username:"
                    name="username"
                    rules={[{ required: true, message: 'Email/Username cannot be empty.' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Create password:"
                    name="password"
                    rules={[{ required: true, message: 'Password cannot be empty.' }]}
                >
                    <Input.Password />
                </Form.Item>
                <Form.Item
                    label="Confirm password:"
                    name="confirm"
                    dependencies={['password']}
                    hasFeedback
                    rules={[
                        { required: true, message: 'Passwords don\'t match or field is empty.' },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('password') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('The two passwords do not match.'));
                            },
                        }),
                    ]}
                >
                    <Input.Password />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" block>
                        Start Saving!
                    </Button>
                    <Link to="/login">
                        <Button type="default" htmlType='button' style={{marginTop: '15px'}}>
                            ← Back
                        </Button>
                    </Link>
                </Form.Item>
            </Form>
        </div>
    );
};

export default Signup;
