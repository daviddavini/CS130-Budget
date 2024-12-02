import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <>
            <nav className={`sidebar ${isOpen ? 'open' : ''}`}>
                <ul>
                    <li><Link to="/" onClick={() => setIsOpen(false)}>Home</Link></li>
                    <li><Link to="/shops" onClick={() => setIsOpen(false)}>Local Businesses</Link></li>
                    <li><Link to="/log" onClick={() => setIsOpen(false)}>Log Your Spendings </Link></li>
		    <li><Link to="/budgetplan" onClick={() => setIsOpen(false)}>Set Your Budget </Link></li>
		    <li><Link to="/visualize" onClick={() => setIsOpen(false)}>View Your Summary </Link></li>
                    <li><Link to="/login" onClick={() => setIsOpen(false)}>Login </Link></li>
                </ul>
            </nav>
            <div className="hamburger-menu" onClick={toggleMenu}>
                ☰
            </div>
        </>
    );
};

export default Navbar;
