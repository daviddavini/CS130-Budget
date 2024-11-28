import React from 'react';
import GoogleLoginButton from './GoogleLoginButton';
import { Link } from 'react-router-dom';
import { Form, Input, Button, Checkbox, Typography, notification, Divider } from 'antd';
import { useContext } from 'react';
import { ThemeContext } from './App';
import piggy from './assets/Piggy.png';
import './Login.css';

const { Title } = Typography;

const Login = () => {
    const { theme } = useContext(ThemeContext);  // Access theme from context

    /* // Handle form submission
    const onFinish = (values) => {
        // For simplicity, just log the user data
        console.log('Received values:', values);

        // Here you would typically call an API to authenticate the user
        notification.success({
            message: 'Login Successful',
            description: `Welcome back, ${values.username}!`,
        });
    }; */

    return (
        <div className={`login-block ${theme}`} style={{ padding: '50px', maxWidth: '600px', margin: 'auto' }}>
            <img
                src={piggy}
                alt=""
                className="login-piggy"
            />
            <Title level={1} style={{ textAlign: 'center' }}>Clever Cash Login</Title>
            <div>
                <Form
                    //name="login_form"
                    //onFinish={onFinish}
                    layout="vertical"
                    initialValues={{ remember: true }}
                >
                    {/* Email/Username */}
                    <Form.Item
                        label="Email/Username:"
                        name="username"
                        rules={[{ required: true, message: 'Email/Username cannot be empty.' }]}
                    >
                        <Input />
                    </Form.Item>

                    {/* Password */}
                    <Form.Item
                        label="Password:"
                        name="password"
                        rules={[{ required: true, message: 'Password cannot be empty.' }]}
                    >
                        <Input.Password />
                    </Form.Item>

                    {/* Remember credentials */}
                    <Form.Item name="remember" valuePropName="checked">
                        <Checkbox>Remember me</Checkbox>
                    </Form.Item>

                    {/* Login and Signup Buttons */}
                    <Form.Item>
                        <div className='login-and-signup'>
                            <Button type="primary" htmlType="submit" block>
                                Log In
                            </Button>
                            <span>or</span>
                            <Link to="/signup">
                                <Button type="default" htmlType='button'>
                                    Sign Up
                                </Button>
                            </Link>
                        </div>
                    </Form.Item>
                </Form>
                <Divider>OR</Divider>
                <div className="login-option">
                    <Title level={2}>Sign in with Google</Title>
                    <Form.Item>
                        <GoogleLoginButton />
                    </Form.Item>
                </div>
            </div>
        </div>
    );
};

export default Login;
