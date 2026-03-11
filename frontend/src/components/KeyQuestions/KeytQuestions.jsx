import React from "react";
import "bootstrap-icons/font/bootstrap-icons.css";

import "./KeyQuestions.css"

const questions = [
    {
        id: 1,
        icon: "bi-calendar-check",
        color: "#7B3FF2",
        question: "What do I want to achieve with my money in the next 5, 10, or 20 years?"
    },
    {
        id: 2,
        icon: "bi-compass",
        color: "#10B981",
        question: "Am I on track to meet my goals, or do I need expert advice?"
    },
    {
        id: 3,
        icon: "bi-shield-check",
        color: "#EF4444",
        question: "How can I grow my wealth with minimal risk?"
    }
];

function KeyQuestions() {



    return (
        <section className="wealth-journey-section">
            <div className="wealth-journey-container">
                <h2 className="wealth-journey-heading">
                    Ask Yourself: Key Questions for Your Wealth Journey
                </h2>

                <div className="wealth-cards-grid">
                    {questions.map((item) => (
                        <div className="wealth-question-card" key={item.id}>
                            <div
                                className="wealth-icon-circle"
                                style={{ backgroundColor: item.color }}
                            >
                                <i className={`bi ${item.icon}`}></i>
                            </div>
                            <p className="wealth-question-text">{item.question}</p>
                        </div>
                    ))}
                </div>

                <button className="wealth-cta-button"  >
                    Plan My Wealth Goals
                </button>
            </div>
        </section>
    );
}

export default KeyQuestions
