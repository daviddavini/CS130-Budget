import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import piggy from './assets/Piggy.png';
import title from './assets/Clever Cash (5).png';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [subMenuOpen, setSubMenuOpen] = useState({});

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const toggleSubMenu = (menu) => {
        setSubMenuOpen(prevState => ({
            ...prevState,
            [menu]: !prevState[menu]
        }));
    };

    return (
        <>
            <nav className={`sidebar ${isOpen ? 'open' : ''}`}>
                <ul>
                <li><div style={{fontSize: '30px', paddingBottom:'20px'}}>Clever Cash</div></li>
                    <li><Link style={{ textAlign: 'left'}} to="/" onClick={() => setIsOpen(false)}>🏠 Home</Link></li>
                    <li><Link style={{ textAlign: 'left'}} to="/shops" onClick={() => setIsOpen(false)}>📍 Local Businesses</Link></li>
                    <li>
                        <div
                            onClick={() => toggleSubMenu('budgetplan')}
                            style={{
                                fontSize: '18px',
                                cursor: subMenuOpen.budgetplan ? '-moz-grab' : 'pointer',
                                textAlign: 'left',
                                marginLeft: '15px'
                            }}
                        >
                            <span style={{ marginRight: '10px', fontSize: '15px', cursor: subMenuOpen.budgetplan ? '-moz-grab' : 'pointer' }}>
                                {subMenuOpen.budgetplan ? '▼' : '▶'}
                            </span>
                            My Budget
                        </div>
                        {subMenuOpen.budgetplan && (
                            <ul style={{ paddingLeft: '30px' }} className="sub-menu">
                                <li><Link style={{ textAlign: 'left', fontSize: '15px' }} to="/log" onClick={() => setIsOpen(false)}> Log Your Spendings </Link></li>
                                <li><Link style={{ textAlign: 'left', fontSize: '15px' }} to="/budgetplan" onClick={() => setIsOpen(false)}> Set Your Budget </Link></li>
                            </ul>
                        )}
                    </li>
                    <li><Link style={{ textAlign: 'left'}} to="/visualize" onClick={() => setIsOpen(false)}>📊 View Your Summary </Link></li>
                    <li><img
                        style={{ paddingTop: '25px'}}
                        src={piggy}
                        alt=""
                        className="login-piggy"
                    /></li>
                </ul>
            </nav>
            <div className="hamburger-menu" onClick={toggleMenu}>
                ☰
            </div>
        </>
    );
};

export default Navbar;
