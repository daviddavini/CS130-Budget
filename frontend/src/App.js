import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ConfigProvider, Button, theme as antdTheme } from 'antd';
import './App.css';
import Home from './Home';
import Navbar from './Navbar';
import LocationSearch from './LocationSearch';
import LogSpending from './LogSpending';
import Login from './Login';

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
                    <Router>
                        <Navbar />
                        <div className="content">
                            <Routes>
                                <Route path="/" element={<Home />} />
                                <Route path="/shops" element={<LocationSearch />} />
                                <Route path="/log" element={<LogSpending />} />
                                <Route path="/login" element={<Login />} />
                            </Routes>
                        </div>
                        {/* Button to toggle dark/light theme */}
                        <Button
                            type="primary"
                            onClick={toggleTheme}
                            className="theme-button"
                        >
                            Switch to {theme === "dark" ? 'Light' : 'Dark'} Mode
                        </Button>
                    </Router>
                </div>
            </ConfigProvider>
        </ThemeContext.Provider>
    );
};

export default App;