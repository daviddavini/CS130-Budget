import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Input, Button, Typography, notification } from 'antd';
import { useContext } from 'react';
import { AuthContext } from './AuthContext';
import { ThemeContext } from './App';
import piggy from './assets/Piggy.png';
import './Login.css';

const { Title } = Typography;

/**
 * Signup component allows users to create a new account by providing a username and password.
 * It includes form validation, error handling, and user notifications upon success or failure.
 *
 * @component
 * @returns {JSX.Element} The rendered Signup component.
 */
const Signup = () => {
    const { theme } = useContext(ThemeContext); // Access theme from ThemeContext
    const { login } = useContext(AuthContext); // Access login function from AuthContext
    const navigate = useNavigate();

    /**
     * Handles the form submission for account creation.
     *
     * @async
     * @param {Object} values - The form values containing `username` and `password`.
     */
    const onFinish = async (values) => {
        const signupData = {
            username: values.username,
            password: values.password,
        };
        console.log('Sign-Up Data:', signupData);
        try {
            const response = await fetch('/api/signup/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(signupData),
            });
            if (!response.ok) {
                throw new Error('Signup Failed');
            }
            const data = await response.json();
            if (data.token) {
                login(data.token, 'manual');
            } else if (data.error) {
                throw new Error('Authentication error:', data.error);
            }
            notification.success({
                message: 'Account Created',
                description: `Welcome, ${values.username}! Your account has been successfully created.`,
            });
            navigate('/budgetplan');
        } catch (error) {
            console.error("Error during manual sign up:", error);
            notification.warning({
                message: 'Sign up Failed',
                description: `Your username has been already taken`,
            });
        }
    };

    return (
        <div className={`signup-block ${theme}`} style={{ padding: '20px', maxWidth: '400px', margin: 'auto' }}>
            <img
                src={piggy}
                alt=""
                className="signup-piggy"
            />
            <Title level={2} style={{ textAlign: 'center' }}>Welcome to Clever Cash!</Title>
            <Form
                name="signup_form"
                onFinish={onFinish}
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
                        <Button type="default" htmlType='button' style={{ marginTop: '15px' }}>
                            ← Back
                        </Button>
                    </Link>
                </Form.Item>
            </Form>
        </div>
    );
};

export default Signup;
