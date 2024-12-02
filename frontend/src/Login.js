import React from 'react';
import GoogleLoginButton from './GoogleLoginButton';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Input, Button, Checkbox, Typography, notification, Divider } from 'antd';
import { AuthContext } from './AuthContext';
import { useContext } from 'react';
import { ThemeContext } from './App';
import piggy from './assets/Piggy.png';
import './Login.css';

const { Title } = Typography;

const Login = () => {
    const { theme } = useContext(ThemeContext);  // Access theme from context
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    
    const onFinish = async (values) => {
	const signinData = {
	    username: values.username,
	    password: values.password
	}
        // For simplicity, just log the user data
        console.log('Received values:', signinData);
	try {
	    const response = await fetch('/api/login/', {
		method: 'POST',
		headers: {
		    'Content-Type': 'application/json',
		},
		body: JSON.stringify(signinData),
	    });
	    if (!response.ok) {
		throw new Error('Signin Failed');
	    }
	    const data = await response.json();
	    if (data.token) {
		login(data.token, 'manual')
	    } else if (data.error) {
		throw new Error('Authentication error:', data.error);
	    }
	    notification.success({
		message: 'Login Successful',
		description: `Welcome back, ${values.username}!`,
	    });
	    
            navigate('/');
	} catch(error) {
	    console.error("Error during sign in:", error);
	}

        
    }; 

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
                    name="login_form"
                    onFinish={onFinish}
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
                
                    <Divider>OR</Divider>

                    <Title level={2}>Sign in with Google</Title>

                    <Form.Item>
                        <GoogleLoginButton />
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
};

export default Login;
