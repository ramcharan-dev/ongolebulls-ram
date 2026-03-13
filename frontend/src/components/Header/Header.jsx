import React, { useState } from "react";
import logo from "../../assets/logo4.png";
import { Link } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import "./Header.css";

const SunIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="5"/>
        <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
        <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
    </svg>
);

const MoonIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
);

function Header() {
    const { isDark, toggleTheme } = useTheme();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [openDropdown, setOpenDropdown] = useState(null);

    const toggleDropdown = (dropdown) => {
        setOpenDropdown(openDropdown === dropdown ? null : dropdown);
    };

    const closeSidebar = () => {
        setSidebarOpen(false);
        setOpenDropdown(null);
    };

    return (
        <>
            <nav className="navbar-custom">
                <div className="navbar-container">

                    {/* Logo */}
                    <Link to="/" className="logo-link">
                        <img src={logo} alt="OngoleBulls" className="logo-img" />
                    </Link>

                    {/* Desktop Menu */}
                    <div className="desktop-menu">
                        <ul className="nav-links">

                            <li className="nav-item">
                                <Link to="/" className="nav-link">Home</Link>
                            </li>

                            {/* Services */}
                            <li className="nav-item dropdown">
                                <Link to="/services" className="nav-link">
                                    Services <span className="icon-down">▾</span>
                                </Link>
                                <ul className="dropdown-menu">
                                    <li><a href="#">Wealth Management</a></li>
                                    <li><a href="#">Investment Management</a></li>
                                    <li><Link to="/MutualFund">Mutual Fund</Link></li>
                                    <li><Link to="/PmsPage">PMS</Link></li>
                                    <li><a href="#">HNI & Family Office Services</a></li>
                                    <li><a href="#">Stock Market & Bond Investments</a></li>
                                    <li><a href="#">Tax Optimization & Estate Planning</a></li>
                                </ul>
                            </li>

                            <li className="nav-item dropdown">
                                <a href="#" className="nav-link">
                                    Investments <span className="icon-down">▾</span>
                                </a>
                                <ul className="dropdown-menu">
                                    <li>
                                        <Link to="/MutualFund">Mutual Funds</Link>
                                    </li>
                                    <li>
                                        <Link to="/elss">ELSS (Tax Saving Funds)</Link>
                                    </li>
                                    <li>
                                        <Link to="/pms">PMS</Link>
                                    </li>
                                </ul>
                            </li>

                            <li className="nav-item dropdown">
                                <a href="#" className="nav-link">
                                    Tools <span className="icon-down">▾</span>
                                </a>
                                <ul className="dropdown-menu">
                                    <li>
                                        <Link to="/tools/mutual-fund-calculator">Mutual Fund Calculator</Link>
                                    </li>
                                </ul>
                            </li>

                            {/* About */}
                            <li className="nav-item">
                                <Link to="/Aboutus" className="nav-link">About Us</Link>
                            </li>

                            {/* Resources */}
                            <li className="nav-item dropdown">
                                <a href="#" className="nav-link">
                                    Resources <span className="icon-down">▾</span>
                                </a>
                                <ul className="dropdown-menu">
                                    <li>
                                        <Link to="/blogs">Blog</Link>
                                    </li>
                                </ul>
                            </li>

                            <li className="nav-item">
                                <Link to="/contactForm" className="nav-link">Contact Us!</Link>
                            </li>

                            {/* Careers removed as per requirement */}

                        </ul>

                        <button
                            className="theme-toggle-btn"
                            onClick={toggleTheme}
                            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
                            aria-label="Toggle theme"
                        >
                            {isDark ? <SunIcon /> : <MoonIcon />}
                        </button>

                        <Link to="/login" className="btn-login">Login</Link>
                    </div>

                    {/* Mobile Hamburger */}
                    <button className="hamburger-btn" onClick={() => setSidebarOpen(true)}>
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>

                </div>
            </nav>

            {/* Mobile Sidebar */}
            <div className={`mobile-sidebar ${sidebarOpen ? "active" : ""}`}>
                <div className="sidebar-top">
                    <Link to="/" className="sidebar-logo" onClick={closeSidebar}>
                        <img src={logo} alt="OngoleBulls" />
                    </Link>
                    <button className="close-btn" onClick={closeSidebar}>✕</button>
                </div>

                <ul className="mobile-menu">

                    <li>
                        <Link to="/" onClick={closeSidebar}>Home</Link>
                    </li>

                    {/* Services Mobile */}
                    <li className="mobile-dropdown">
                        <button onClick={() => toggleDropdown('services')} className="dropdown-btn">
                            Services
                            <span className={`arrow-icon ${openDropdown === 'services' ? 'rotate' : ''}`}>▾</span>
                        </button>
                        <ul className={`dropdown-list ${openDropdown === 'services' ? 'show' : ''}`}>
                            <li><a href="#" onClick={closeSidebar}>Wealth Management</a></li>
                            <li><a href="#" onClick={closeSidebar}>Investment Management</a></li>
                            <li><Link to="/MutualFund" onClick={closeSidebar}>Mutual Fund</Link></li>
                            <li><Link to="/PmsPage" onClick={closeSidebar}>PMS</Link></li>
                        </ul>
                    </li>

                    <li className="mobile-dropdown">
                        <button onClick={() => toggleDropdown('investments')} className="dropdown-btn">
                            Investments
                            <span className={`arrow-icon ${openDropdown === 'investments' ? 'rotate' : ''}`}>▾</span>
                        </button>
                        <ul className={`dropdown-list ${openDropdown === 'investments' ? 'show' : ''}`}>
                            <li>
                                <Link to="/MutualFund" onClick={closeSidebar}>
                                    Mutual Funds
                                </Link>
                            </li>
                            <li>
                                <Link to="/elss" onClick={closeSidebar}>
                                    ELSS (Tax Saving Funds)
                                </Link>
                            </li>
                            <li>
                                <Link to="/pms" onClick={closeSidebar}>
                                    PMS
                                </Link>
                            </li>
                        </ul>
                    </li>

                    <li className="mobile-dropdown">
                        <button onClick={() => toggleDropdown('tools')} className="dropdown-btn">
                            Tools
                            <span className={`arrow-icon ${openDropdown === 'tools' ? 'rotate' : ''}`}>▾</span>
                        </button>
                        <ul className={`dropdown-list ${openDropdown === 'tools' ? 'show' : ''}`}>
                            <li>
                                <Link to="/tools/mutual-fund-calculator" onClick={closeSidebar}>
                                    Mutual Fund Calculator
                                </Link>
                            </li>
                        </ul>
                    </li>

                    <li>
                        <Link to="/Aboutus" onClick={closeSidebar}>About Us</Link>
                    </li>

                    <li>
                        <Link to="/contactForm" onClick={closeSidebar}>Contact Us!</Link>
                    </li>

                    <li>
                        <button
                            className="dropdown-btn"
                            onClick={toggleTheme}
                            style={{ gap: '10px' }}
                        >
                            {isDark ? "Light Mode" : "Dark Mode"}
                            <span style={{ display: 'flex', alignItems: 'center', width: '20px', height: '20px' }}>
                                {isDark ? <SunIcon /> : <MoonIcon />}
                            </span>
                        </button>
                    </li>

                    <li className="login-item">
                        <Link to="/login" className="btn-login-mobile" onClick={closeSidebar}>Login</Link>
                    </li>

                </ul>
            </div>

            {/* Overlay */}
            {sidebarOpen && <div className="overlay" onClick={closeSidebar}></div>}
        </>
    );
}

export default Header;
