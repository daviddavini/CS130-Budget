import React, { useContext } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { ThemeContext } from './App'; 
import { useNavigate } from 'react-router-dom';
import './GoogleLoginButton.css';
import './Login.css'; 
function GoogleLoginButton() {
  const { theme } = useContext(ThemeContext); 
  const navigate = useNavigate();
  const handleSuccess = (credentialResponse) => {
    console.log('Login Success:', credentialResponse);

    fetch('/api/google-auth/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: credentialResponse.credential }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Google-Auth Response Error');
        }
        return res.json();
      })
      .then((data) => {
        console.log('Backend response:', data);
        if (data.token) {
          localStorage.setItem('token', data.token);
          console.log('Navigating to home page');
          navigate('/');
        } else if (data.error) {
          console.error('Authentication error:', data.error);
        }
      })
      .catch((error) => console.error('Error:', error));
  };

  const handleFailure = () => {
    console.error('Login Failed');
  };

  return (
    <div className={`google-login-container ${theme}`}>
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={handleFailure}
        size="large"
        theme={theme === 'dark' ? 'filled_black' : 'outline'}
      />
    </div>
  );
}

export default GoogleLoginButton;
