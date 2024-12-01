import React, { useState, useEffect } from 'react';
import { ConfigProvider, Button, theme as antdTheme } from 'antd';
import './App.css';
import Navbar from './Navbar';
import Views from './Routes';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from './AuthContext';
import UserProfileIcon from './UserProfileIcon'; 

// ThemeContext to manage the current theme state globally
export const ThemeContext = React.createContext(null);

// NOTE: This is okay to leave in version control because it's not a secret
const CLIENT_ID = "615160098054-au18806m6vc79vc41p4ns0u1824iiplq.apps.googleusercontent.com";

const App = () => {
    const [theme, setTheme] = useState("dark");

    // Toggle between light and dark theme
    const toggleTheme = () => {
        setTheme(curr => (curr === "light" ? "dark" : "light"));
    };

    // Apply theme to the entire page 
    // (can use document.documentElement.className as well, but this is smoother)
    useEffect(() => {
        document.body.className = theme;
    }, [theme]);

    return (
        <GoogleOAuthProvider clientId={CLIENT_ID}>
            <AuthProvider>
            <ThemeContext.Provider value={{ theme, toggleTheme }}>
                <ConfigProvider
                    theme={{
                        algorithm: theme === "dark" ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
                    }}
                >
                    <div className={`app ${theme}`}>
                        <Navbar />
                        <div className="content">
                            <Views />
                        </div>

                    {/* Dark/light theme button */}
                    <div className="top-right-container">
                    <Button
                        type="primary"
                        onClick={toggleTheme}
                        className="theme-button"
                    >
                        Switch to {theme === "dark" ? 'Light' : 'Dark'} Mode
                    </Button> 
                    {/* Profile icon */}
                    <UserProfileIcon />
                    </div>
                </div>
                </ConfigProvider>
            </ThemeContext.Provider>
            </AuthProvider>
        </GoogleOAuthProvider>
    );
};

export default App;