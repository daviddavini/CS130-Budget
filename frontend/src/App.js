import React, { useState, useEffect } from 'react';
import { ConfigProvider, Button, theme as antdTheme } from 'antd';
import './App.css';
import Navbar from './Navbar';
import Views from './Routes';

// ThemeContext to manage the current theme state globally
export const ThemeContext = React.createContext(null);

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
                    <Button
                        type="primary"
                        onClick={toggleTheme}
                        className="theme-button"
                    >
                        Switch to {theme === "dark" ? 'Light' : 'Dark'} Mode
                    </Button> 
                </div>
            </ConfigProvider>
        </ThemeContext.Provider>
    );
};

export default App;