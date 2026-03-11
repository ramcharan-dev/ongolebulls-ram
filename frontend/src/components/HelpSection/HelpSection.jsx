import React from "react";
import "./HelpSection.css";
import smartWealthImg from "../../assets/plan.png";
import planningImg from "../../assets/manage.png";
import protectingImg from "../../assets/execute.png";

const helpCards = [
    {
        id: 1,
        image: smartWealthImg,
        title: "Smart Wealth Building",
        frontText: "Smart Wealth Building",
        backTitle: "Smart Wealth Building",
        backDescription: "We provide personalized strategies to help you build a diversified portfolio that aligns with your long-term goals " +
            " Whether you're investing in mutual funds, stocks, or real estate, we ensure smart, consistent growth through expert guidance and risk management"
    },
    {
        id: 2,
        image: planningImg,
        title: "Planning for the Future",
        frontText: "Planning for the Future",
        backTitle: "Future-Ready Financial Planning",
        backDescription: "From retirement plans to education funds, our advisors help create a stable future roadmap that minimizes stress and maximizes savings."
    },
    {
        id: 3,
        image: protectingImg,
        title: "Protecting What Matters",
        frontText: "Protecting What Matters",
        backTitle: "Protecting What Matters",
        backDescription: "Secure your family's future with comprehensive insurance and risk management strategies tailored to your needs."
    }
];

export default function HelpSection() {
    return (
        <section className="help-section">
            <h2 className="help-heading">Here's How We Can Help You Achieve Your Goals:</h2>

            <div className="help-cards-container">
                {helpCards.map((card) => (
                    <div
                        className="help-card-wrapper"
                        key={card.id}
                        tabIndex={0}
                    >
                        <div className="help-card">
                            {/* Front Side */}
                            <div className="help-card-front">
                                <img src={card.image} alt={card.title} className="help-card-image" />
                                <h3 className="help-card-title">{card.frontText}</h3>
                            </div>

                            {/* Back Side */}
                            <div className="help-card-back">
                                <h3 className="help-back-title">{card.backTitle}</h3>
                                <p className="help-back-description">{card.backDescription}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
