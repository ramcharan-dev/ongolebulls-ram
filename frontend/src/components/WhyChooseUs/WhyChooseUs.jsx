import React from 'react';
import {useNavigate} from 'react-router-dom'
import './WhyChooseUs.css';

const WhyChooseUs = () => {

    const navigate = useNavigate();

    const reasons = [
        {
            id: 1,
            icon: 'bi-award',
            title: 'Expertise & Experience',
            description: 'With years of experience in wealth management, investment planning, and financial advisory services, we offer expert solutions tailored to your unique needs.'
        },
        {
            id: 2,
            icon: 'bi-people',
            title: 'Personalized Solutions',
            description: 'We understand that no two clients are the same. Our services are customized to match your financial goals, risk tolerance, and long-term objectives.'
        },
        {
            id: 3,
            icon: 'bi-shield-check',
            title: 'Transparency & Integrity',
            description: 'We believe in honest, clear communication with no hidden fees. Our transparent approach ensures you always know where your money is going and how it\'s growing.'
        },
        {
            id: 4,
            icon: 'bi-phone',
            title: 'Cutting-Edge Technology',
            description: 'Our digital investment platforms and tools provide real-time tracking, giving you easy access to your investments anytime, anywhere.'
        },
        {
            id: 5,
            icon: 'bi-graph-up-arrow',
            title: 'Focus on Long-Term Success',
            description: 'We are committed to helping you build sustainable wealth, focusing on both short-term returns and long-term growth strategies.'
        },
        {
            id: 6,
            icon: 'bi-briefcase',
            title: 'Comprehensive Services',
            description: 'From tax optimization and estate planning to SIPs and HNI services, we provide a full spectrum of services to meet your every financial need.'
        }
    ];

    const handleClick = () => {
        navigate('/AppointmentForm/' );
    }

    return (
        <section className="why-choose-us-section">
            <div className="why-choose-us-container">
                {/* Header */}
                <div className="why-choose-us-header">
                    <h2 className="why-choose-us-title">Why Choose Us</h2>
                    <p className="why-choose-us-subtitle">
                        Discover what makes us the trusted partner for thousands of clients in their wealth-building journey
                    </p>
                </div>

                {/* Reasons Grid */}
                <div className="reasons-grid">
                    {reasons.map((reason) => (
                        <div key={reason.id} className="reason-item">
                            <div className="reason-icon-wrapper">
                                <i className={`bi ${reason.icon} reason-icon`}></i>
                            </div>
                            <div className="reason-content">
                                <h3 className="reason-title">{reason.title}</h3>
                                <p className="reason-description">{reason.description}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* CTA Section */}
                <div className="cta-box">
                    <h3 className="cta-title">Ready to Start Your Wealth Journey?</h3>
                    <p className="cta-subtitle">
                        Join thousands of satisfied clients who trust us with their financial future. Let's build your prosperity together.
                    </p>
                    <button className="cta-button" onClick={handleClick} >Book a Free Consultation Today</button>
                </div>
            </div>
        </section>
    );
};

export default WhyChooseUs;
