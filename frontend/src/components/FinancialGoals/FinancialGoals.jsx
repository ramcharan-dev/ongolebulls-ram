import React from "react";
import "bootstrap-icons/font/bootstrap-icons.css";
import './FinancialGoals.css'

const goals = [
    {
        icon: "bi-cash-stack",
        color: "#219653",
        title: "Just Started Earning",
        desc: "Kickstart your wealth journey early",
    },
    {
        icon: "bi-mortarboard",
        color: "#2D9CDB",
        title: "Planning My Child’s Future",
        desc: "Secure tomorrow’s education today",
    },
    {
        icon: "bi-house-door",
        color: "#9B51E0",
        title: "Buying My First Home",
        desc: "Plan your dream home financing",
    },
    {
        icon: "bi-star",
        color: "#F2C94C",
        title: "Achieving My Dreams",
        desc: "Turn aspirations into assets",
    },
    {
        icon: "bi-graph-up-arrow",
        color: "#EB5757",
        title: "Early Investor",
        desc: "Grow steadily with smart strategies",
    },
    {
        icon: "bi-shield-check",
        color: "#27ae60",
        title: "Preparing for Retirement",
        desc: "Build long-term financial security",
    },
];

export default function FinancialGoals() {
    return (
        <section className="goals-section">
            <h2 className="goals-heading">What Are Your Financial Goals?</h2>
            <p className="goals-subtext">
                Everyone has various financial goals which are to be achieved for leading a beautiful and stress-free life.
            </p>
            <div className="goals-grid">
                {goals.map((goal) => (
                    <div className="goal-card" key={goal.title}>
                        <div
                            className="goal-icon"
                            style={{ background: goal.color + "22", color: goal.color }}
                        >
                            <i className={`bi ${goal.icon}`}></i>
                        </div>
                        <div className="goal-title">{goal.title}</div>
                        <div className="goal-desc">{goal.desc}</div>
                    </div>
                ))}
            </div>
        </section>
    );
}
