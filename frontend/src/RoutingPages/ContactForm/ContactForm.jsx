import React, { useState } from 'react';
import './ContactForm2.css';
import { FaPhone, FaEnvelope, FaBriefcase, FaGlobe, FaFacebookF, FaLinkedinIn, FaTwitter, FaYoutube, FaInstagram } from 'react-icons/fa';
import { submitContact } from '../../api/contactApi';

const ContactForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: ''
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear error for this field when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email';
        }

        if (!formData.phone.trim()) {
            newErrors.phone = 'Phone number is required';
        } else if (!/^[0-9]{10}$/.test(formData.phone.replace(/\s/g, ''))) {
            newErrors.phone = 'Please enter a valid 10-digit phone number';
        }

        if (!formData.message.trim()) {
            newErrors.message = 'Message is required';
        }

        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newErrors = validateForm();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setIsSubmitting(true);

        try {
            await submitContact(formData.name, formData.email, formData.message);

            alert('Thank you! Your message has been sent successfully.');

            setFormData({
                name: '',
                email: '',
                phone: '',
                message: ''
            });
        } catch (error) {
            alert(error.userMessage || 'Something went wrong. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section className="contact-section">
            <div className="contact-header">
                <h1>Contact Us</h1>
                <h2>We're Here to Help!</h2>
                <p>
                    At Ongole Bulls Invest Pvt Ltd, we are committed to providing exceptional support and guidance to help you
                    achieve your financial goals. Whether you have a question, need expert advice, or are ready to start your
                    investment journey, our team is here for you.
                </p>
            </div>

            <div className="contact-content">
                {/* Left Column - Get in Touch */}
                <div className="get-in-touch">
                    <h3>Get in Touch</h3>

                    <ul className="contact-info">
                        <li>
                            <FaPhone />
                            <a href="tel:9281111730">9281111730</a>
                        </li>
                        <li>
                            <FaEnvelope />
                            <a href="mailto:info@ongolebullsinvest.com">info@ongolebullsinvest.com</a>
                        </li>
                        <li>
                            <FaBriefcase />
                            <span>For careers: <a href="mailto:hr@ongolebullsinvest.com">hr@ongolebullsinvest.com</a></span>
                        </li>
                        <li>
                            <FaGlobe />
                            <a href="https://www.ongolebullsinvest.com" target="_blank" rel="noopener noreferrer">
                                www.ongolebullsinvest.com
                            </a>
                        </li>
                    </ul>

                    <div className="business-hours">
                        <h4>Business Hours</h4>
                        <p><strong>Monday to Friday:</strong> 9:00 AM – 6:00 PM</p>
                        <p><strong>Saturday:</strong> 10:00 AM – 2:00 PM</p>
                        <p><strong>Sunday:</strong> Closed</p>
                    </div>

                    <div className="follow-us">
                        <h4>Follow Us</h4>
                        <div className="social-icons">
                            <a href="#" aria-label="Facebook"><FaFacebookF /></a>
                            <a href="#" aria-label="LinkedIn"><FaLinkedinIn /></a>
                            <a href="#" aria-label="Twitter"><FaTwitter /></a>
                            <a href="#" aria-label="YouTube"><FaYoutube /></a>
                            <a href="#" aria-label="Instagram"><FaInstagram /></a>
                        </div>
                    </div>
                </div>

                {/* Right Column - Message Form */}
                <div className="message-form">
                    <h3>Send Us a Message</h3>
                    <form className="contact-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <input
                                type="text"
                                id="name"
                                name="name"
                                placeholder="Your Name"
                                value={formData.name}
                                onChange={handleChange}
                                className={errors.name ? 'error' : ''}
                            />
                            {errors.name && <span className="error-message">{errors.name}</span>}
                        </div>

                        <div className="form-group">
                            <input
                                type="email"
                                id="email"
                                name="email"
                                placeholder="Your Email"
                                value={formData.email}
                                onChange={handleChange}
                                className={errors.email ? 'error' : ''}
                            />
                            {errors.email && <span className="error-message">{errors.email}</span>}
                        </div>

                        <div className="form-group">
                            <input
                                type="tel"
                                id="phone"
                                name="phone"
                                placeholder="Your Phone Number"
                                value={formData.phone}
                                onChange={handleChange}
                                className={errors.phone ? 'error' : ''}
                            />
                            {errors.phone && <span className="error-message">{errors.phone}</span>}
                        </div>

                        <div className="form-group">
                            <textarea
                                id="message"
                                name="message"
                                placeholder="Your Message"
                                value={formData.message}
                                onChange={handleChange}
                                className={errors.message ? 'error' : ''}
                            />
                            {errors.message && <span className="error-message">{errors.message}</span>}
                        </div>

                        <button
                            type="submit"
                            className="submit-btn"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Submitting...' : 'Submit'}
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default ContactForm;
