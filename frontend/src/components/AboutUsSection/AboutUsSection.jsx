import React from "react";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./AboutUsSection.css";
import teamImage from "../../assets/abotus.jpeg";

const features = [
    {
        id: 1,
        icon: "bi-eye",
        iconBg: "#E8F4FF",
        iconColor: "#2563EB",
        title: "Transparency in Wealth Management",
        description: "Clear communication without hidden fees or complex Terms"
    },
    {
        id: 2,
        icon: "bi-sliders",
        iconBg: "#E8F9F3",
        iconColor: "#10B981",
        title: "Tailored Strategies for Every Investor",
        description: "Customized solutions based on your unique financial goals and risk profile"
    },
    {
        id: 3,
        icon: "bi-graph-up",
        iconBg: "#F3E8FF",
        iconColor: "#8B5CF6",
        title: "Specialized Expertise in PMS & Mutual Funds",
        description: "Deep knowledge in portfolio management and mutual fund investments"
    }
];

const stats = [
    {
        id: 1,
        value: "₹250 Cr",
        label: "AUM Goal",
        color: "#DC2626"
    },
    {
        id: 2,
        value: "95%",
        label: "Client Retention",
        color: "#DC2626"
    },
    {
        id: 3,
        value: "SEBI",
        label: "Compliant",
        color: "#DC2626"
    },
    {
        id: 4,
        value: "2021",
        label: "Established",
        color: "#DC2626"
    }
];

export default function AboutUsSection() {
    return (
        <section className="about-section">
            <div className="about-container">
                <h2 className="about-heading">About Us</h2>

                <div className="about-content-wrapper">
                    {/* Left Content */}
                    <div className="about-left">
                        <p className="about-intro">
                            At <span className="company-name">OngoleBulls Invest Pvt Ltd</span>, we are committed to empowering investors with personalized, transparent, and SEBI-compliant wealth strategies. Our mission is to create long-term value while building financial confidence for every client.
                        </p>

                        {/* Features List */}
                        <div className="about-features">
                            {features.map((feature) => (
                                <div className="about-feature-item" key={feature.id}>
                                    <div
                                        className="about-feature-icon"
                                        style={{
                                            backgroundColor: feature.iconBg,
                                            color: feature.iconColor
                                        }}
                                    >
                                        <i className={`bi ${feature.icon}`}></i>
                                    </div>
                                    <div className="about-feature-content">
                                        <h4 className="about-feature-title">{feature.title}</h4>
                                        <p className="about-feature-desc">{feature.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Stats Section */}
                        <div className="about-stats-container">
                            {stats.map((stat) => (
                                <div className="about-stat-item" key={stat.id}>
                                    <div
                                        className="about-stat-value"
                                        style={{ color: stat.color }}
                                    >
                                        {stat.value}
                                    </div>
                                    <div className="about-stat-label">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Image */}
                    <div className="about-right">
                        <img
                            src={teamImage}
                            alt="Team Meeting"
                            className="about-team-image"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
