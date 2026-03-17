import React from "react";
import { Link } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./DataSecuritySection3.css";
import securityImage from "../../assets/datasecurity-new.png";

const securityFeatures =     [
    {
        id: 1,
        icon: "bi-lock-fill",
        title: "Strong SHA2 & 256-bit Encryption",
        description: "Military-grade encryption protocols"
    },
    {
        id: 2,
        icon: "bi-building",
        title: "Bank Level Security",
        description: "Industry-standard security measures"
    },
    {
        id: 3,
        icon: "bi-key-fill",
        title: "Data & Password Encryption",
        description: "End-to-end data protection"
    },
    {
        id: 4,
        icon: "bi-shield-lock-fill",
        title: "Employee Level Security",
        description: "Strict access controls and monitoring"
    }
];

export default function DataSecuritySection() {
    return (
        <section className="data-security-section">
            <div className="security-container">
                <div className="security-content">
                    {/* Left Content */}
                    <div className="security-left">
                        <h2 className="security-heading">
                            Data <span className="highlight-text">Security</span>
                        </h2>
                        <p className="security-description">
                            Your data is safe & secure. OngoleBulls Invest is built to ensure the
                            confidentiality, integrity, and protection of your personal data during
                            storage and transmission.
                        </p>
                        <Link to="/data-security" className="security-cta-btn">
                            Read More
                        </Link>
                    </div>

                    {/* Right Image */}
                    <div className="security-right">
                        <div className="security-image-wrapper">
                            <img
                                src={securityImage}
                                alt="Data Security"
                                className="security-image"
                            />
                        </div>
                    </div>
                </div>

                {/* Security Features Grid */}
                <div className="security-features-grid">
                    {securityFeatures.map((feature) => (
                        <div className="security-feature-card" key={feature.id}>
                            <div className="feature-icon-wrapper">
                                <i className={`bi ${feature.icon}`}></i>
                            </div>
                            <h3 className="feature-title">{feature.title}</h3>
                            <p className="feature-description">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
