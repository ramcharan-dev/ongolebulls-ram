import React, { useState } from "react";
import "./Footer.css";
import logo from "../../assets/logo4.png";
import {
    FaFacebookF,
    FaLinkedinIn,
    FaInstagram,
    FaYoutube,
    FaTwitter,
} from "react-icons/fa";
import { subscribe } from "../../api/subscriberApi";

const Footer = () => {
    const [subEmail, setSubEmail] = useState('');
    const [subMsg, setSubMsg]     = useState('');

    const handleSubscribe = async (e) => {
        e.preventDefault();
        if (!subEmail.trim()) return;
        try {
            await subscribe(subEmail);
            setSubMsg('Subscribed successfully!');
            setSubEmail('');
        } catch (err) {
            setSubMsg(err.userMessage || 'Already subscribed or an error occurred.');
        }
    };

    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-section company">
                    <img
                        src={logo}
                        alt="Ongolebulls Logo"
                        className="footer-logo"
                    />
                    <p>
                        Ongolebulls Pvt. Ltd. Established in 2021, the company operates
                        under CIN U65990TG2021PTC154027 and is led by experienced
                        professionals.
                    </p>
                </div>

                <div className="footer-section links">
                    <h4>Quick Links</h4>
                    <ul>
                        <li>Home</li>
                        <li>About Us</li>
                        <li>Services</li>
                        <li>Contact</li>
                    </ul>
                </div>

                <div className="footer-section contact">
                    <h4>Contact Us</h4>
                    <p>
                        Email:{" "}
                        <a href="mailto:info@ongolebullsinvest.com">
                            info@ongolebullsinvest.com
                        </a>
                    </p>
                    <p>
                        Phone: <a href="tel:+919281111730">+91-9281111730</a>
                    </p>
                    <p>Follow Us:</p>
                    <div className="social-icons">
                        <FaFacebookF />
                        <FaLinkedinIn />
                        <FaInstagram />
                        <FaYoutube />
                        <FaTwitter />
                    </div>
                </div>

                <div className="footer-section subscribe">
                    <h4>Subscribe to Updates</h4>
                    <form className="subscribe-box" onSubmit={handleSubscribe}>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={subEmail}
                            onChange={(e) => { setSubEmail(e.target.value); setSubMsg(''); }}
                            required
                        />
                        <button type="submit">Subscribe</button>
                    </form>
                    {subMsg && (
                        <p style={{ fontSize: '12px', marginTop: '6px', color: subMsg.includes('success') ? '#86efac' : '#fca5a5' }}>
                            {subMsg}
                        </p>
                    )}
                </div>
            </div>

            <div className="footer-bottom">
                <p>
                    © 2025 OngoleBulls Invest Pvt Ltd. All rights reserved.
                </p>
                <div className="footer-links">
                    <a href="#">Privacy Policy</a> | <a href="#">Terms & Conditions</a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
