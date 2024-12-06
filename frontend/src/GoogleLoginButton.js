import React, { useContext } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { ThemeContext } from './App'; 
import { AuthContext } from './AuthContext';
import { useNavigate } from 'react-router-dom';
import './GoogleLoginButton.css';
import './Login.css'; 

/**
 * GoogleLoginButton component handles user authentication via Google OAuth.
 * On successful login, it retrieves a token from the backend and navigates the user to the home page.
 *
 * @component
 * @example
 * return <GoogleLoginButton />;
 *
 * @returns {JSX.Element} A button that initiates Google login flow.
 */
function GoogleLoginButton() {
  const { theme } = useContext(ThemeContext); 
  const { login } = useContext(AuthContext);

  const navigate = useNavigate();

  /**
   * Handles the successful login response from Google.
   * Sends the credential to the backend for further verification and token retrieval.
   *
   * @param {Object} credentialResponse - The response object returned from Google OAuth on success.
   * @param {string} credentialResponse.credential - The user's OAuth credential token.
   */
  const handleSuccess = (credentialResponse) => {
    console.log('Login Success:', credentialResponse);
    login(credentialResponse.credential, 'google');
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

  /**
   * Handles the failed login attempt from Google OAuth.
   */
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
