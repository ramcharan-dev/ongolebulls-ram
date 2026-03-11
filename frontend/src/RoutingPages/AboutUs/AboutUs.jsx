import React from 'react';
import './AboutUs.css';  // ← Change to regular .css
import teamImage from '../../assets/about-us.jpg';
import visionImage from '../../assets/vision-aboutUs.avif';
import missionImage from '../../assets/mission-aboutUs.avif';

function AboutUs() {
    return (
        <div className="page-about-us">  {/* Changed */}
            {/* Hero Section */}
            <section className="page-about-hero">  {/* Changed */}
                <div className="page-hero-overlay">  {/* Changed */}
                    <h1 className="page-hero-title">About Us!</h1>  {/* Changed */}
                    <p className="page-hero-subtitle">Building Your Financial Future with Trust & Expertise</p>  {/* Changed */}
                </div>
            </section>

            {/* Main About Section */}
            <section className="page-about-intro">  {/* Changed */}
                <div className="page-about-container">  {/* Changed */}
                    <div className="page-intro-image">  {/* Changed */}
                        <img src={teamImage} alt="Our Team" />
                    </div>
                    <div className="page-intro-content">  {/* Changed */}
                        <p className="page-intro-text">  {/* Changed */}
                            At OngoleBulls Invest Pvt Ltd, we are passionate about transforming lives through financial empowerment.
                            Our team of seasoned experts works closely with clients to understand their unique financial goals and challenges.
                            From comprehensive wealth management to tailored investment planning, we are dedicated to delivering innovative
                            and effective solutions.
                        </p>
                    </div>
                </div>
            </section>

            {/* Our Values Section */}
            <section className="page-values-section">  {/* Changed */}
                <div className="page-values-container">  {/* Changed */}
                    <h2 className="page-section-title">Our Values</h2>  {/* Changed */}

                    <div className="page-values-grid">  {/* Changed */}
                        <div className="page-value-card">  {/* Changed */}
                            <div className="page-value-icon">  {/* Changed */}
                                <i className="fas fa-shield-alt"></i>
                            </div>
                            <h3>Integrity</h3>
                            <p>We adhere to the highest standards of ethics and remain transparent in all interactions.</p>
                        </div>

                        <div className="page-value-card">  {/* Changed */}
                            <div className="page-value-icon">  {/* Changed */}
                                <i className="fas fa-trophy"></i>
                            </div>
                            <h3>Excellence</h3>
                            <p>We strive for excellence in everything we do, delivering superior results for our clients.</p>
                        </div>

                        <div className="page-value-card">  {/* Changed */}
                            <div className="page-value-icon">  {/* Changed */}
                                <i className="fas fa-lightbulb"></i>
                            </div>
                            <h3>Innovation</h3>
                            <p>We embrace innovation to provide cutting-edge financial solutions for our clients.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Vision & Mission Section */}
            <section className="page-vision-mission-section">  {/* Changed */}
                <div className="page-vision-mission-container">  {/* Changed */}
                    {/* Vision Card */}
                    <div className="page-vm-card page-vision-card">  {/* Changed */}
                        <div className="page-vm-content">  {/* Changed */}
                            <h2>Vision</h2>
                            <div className="page-vm-image">  {/* Changed */}
                                <img src={visionImage} alt="Our Vision" />
                            </div>
                            <p>
                                Our vision is to become a global leader in financial services by consistently
                                exceeding client expectations and empowering individuals with financial
                                independence.
                            </p>
                        </div>
                    </div>

                    {/* Mission Card */}
                    <div className="page-vm-card page-mission-card">  {/* Changed */}
                        <div className="page-vm-content">  {/* Changed */}
                            <h2>Mission</h2>
                            <div className="page-vm-image">  {/* Changed */}
                                <img src={missionImage} alt="Our Mission" />
                            </div>
                            <p>
                                Our mission is to provide personalized, transparent, and cutting-edge financial
                                solutions that create measurable value for our clients.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default AboutUs;
