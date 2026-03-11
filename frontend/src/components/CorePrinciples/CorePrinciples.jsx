import React from 'react';
import './CorePrinciples.css';

const CorePrinciples = () => {
    const principles = [
        {
            id: 1,
            icon: 'bi-person-fill',
            title: 'Personalization',
            description: 'Solutions tailored to individual needs',
            color: '#4A90E2'
        },
        {
            id: 2,
            icon: 'bi-lightbulb-fill',
            title: 'Innovation',
            description: 'Leveraging cutting-edge technology',
            color: '#F5A623'
        },
        {
            id: 3,
            icon: 'bi-eye-fill',
            title: 'Transparency',
            description: 'Clear communication without hidden fees',
            color: '#27AE60'
        },
        {
            id: 4,
            icon: 'bi-leaf-fill',
            title: 'Sustainability',
            description: 'Focus on responsible and long-term growth',
            color: '#2ECC71'
        }
    ];

    return (
        <section className="core-principles-section">
            <div className="core-principles-container">
                <div className="core-principles-header">
                    <h2 className="core-principles-title">Core Principles</h2>
                    <p className="core-principles-subtitle">
                        Our foundational values that guide every decision and strategy we create for our clients.
                    </p>
                </div>

                <div className="principles-grid">
                    {principles.map((principle) => (
                        <div key={principle.id} className="principle-card">
                            <div
                                className="principle-icon-wrapper"
                                style={{ backgroundColor: principle.color }}
                            >
                                <i className={`bi ${principle.icon} principle-icon`}></i>
                            </div>
                            <h3 className="principle-title">{principle.title}</h3>
                            <p className="principle-description">{principle.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default CorePrinciples;
