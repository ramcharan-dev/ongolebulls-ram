import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
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
import { getSettings } from "../../api/settingsApi";

const Footer = () => {
    const [subEmail, setSubEmail] = useState('');
    const [subMsg, setSubMsg]     = useState('');
    const [settingsData, setSettingsData] = useState(null);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const response = await getSettings();
                if (response.data && response.data.length > 0) {
                    setSettingsData(response.data[0]);
                }
            } catch (err) {
                console.error("Failed to fetch settings for footer", err);
            }
        };
        fetchSettings();
    }, []);

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
                        src={settingsData?.logoUrl || logo}
                        alt="Ongolebulls Logo"
                        className="footer-logo"
                    />
                    <p>
                        {settingsData?.footerDescription || 
                        "Ongolebulls Pvt. Ltd. Established in 2021, the company operates under CIN U65990TG2021PTC154027 and is led by experienced professionals."}
                    </p>
                </div>

                <div className="footer-section links">
                    <h4>Quick Links</h4>
                    <ul>
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/Aboutus">About Us</Link></li>
                        <li><Link to="/services">Services</Link></li>
                        <li><Link to="/contactForm">Contact</Link></li>
                    </ul>
                </div>

                <div className="footer-section contact">
                    <h4>Contact Us</h4>
                    <p>
                        Email:{" "}
                        <a href={`mailto:${settingsData?.contactEmail || "info@ongolebullsinvest.com"}`}>
                            {settingsData?.contactEmail || "info@ongolebullsinvest.com"}
                        </a>
                    </p>
                    <p>
                        Phone: <a href={`tel:${settingsData?.contactPhone || "+919281111730"}`}>
                            {settingsData?.contactPhone || "+91-9281111730"}
                        </a>
                    </p>
                    <p>Follow Us:</p>
                    <div className="social-icons">
                        {(!settingsData || settingsData.facebookUrl) && (
                            <a href={settingsData?.facebookUrl || "#"} target="_blank" rel="noopener noreferrer">
                                <FaFacebookF />
                            </a>
                        )}
                        {(!settingsData || settingsData.linkedInUrl) && (
                            <a href={settingsData?.linkedInUrl || "#"} target="_blank" rel="noopener noreferrer">
                                <FaLinkedinIn />
                            </a>
                        )}
                        {(!settingsData || settingsData.instagramUrl) && (
                            <a href={settingsData?.instagramUrl || "#"} target="_blank" rel="noopener noreferrer">
                                <FaInstagram />
                            </a>
                        )}
                        {(!settingsData || settingsData.youtubeUrl) && (
                            <a href={settingsData?.youtubeUrl || "#"} target="_blank" rel="noopener noreferrer">
                                <FaYoutube />
                            </a>
                        )}
                        {(!settingsData || settingsData.twitterUrl) && (
                            <a href={settingsData?.twitterUrl || "#"} target="_blank" rel="noopener noreferrer">
                                <FaTwitter />
                            </a>
                        )}
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
                    © {new Date().getFullYear()} {settingsData?.siteName || "OngoleBulls Invest Pvt Ltd"}. All rights reserved.
                </p>
                <div className="footer-links">
                    <Link to="/privacy">Privacy Policy</Link> | <Link to="/terms">Terms & Conditions</Link>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
