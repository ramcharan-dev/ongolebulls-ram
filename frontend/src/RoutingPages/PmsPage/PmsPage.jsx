import React, { useState } from "react";
import {
    BsBullseye,
    BsBarChartLine,
    BsBriefcaseFill,
    BsEyeFill,
    BsCheckCircleFill,
    BsSliders2,
    BsPersonGear,
    BsShieldCheck,
    BsGraphUpArrow
} from "react-icons/bs";
import "./PMS.css";



const features = [
    {
        icon: <BsBullseye />,
        title: "Tailored Investment Strategy",
        bullets: [
            "Customized portfolio based on your risk profile",
            "Aligned with personal financial objectives",
            "Adapts to changing market conditions",
        ],
    },
    {
        icon: <BsBarChartLine />,
        title: "Active or Passive Management",
        bullets: [
            "Actively managed for higher alpha generation",
            "Passive strategies tracking market indices",
            "Flexible approach based on your preference",
        ],
    },
    {
        icon: <BsBriefcaseFill />,
        title: "High Minimum Investment",
        bullets: [
            "Minimum investment typically ₹50 lakh",
            "Designed for High-Net-Worth Individuals",
            "Exclusive access to premium opportunities",
        ],
    },
    {
        icon: <BsEyeFill />,
        title: "Transparency & Monitoring",
        bullets: [
            "Regular performance updates & reports",
            "Detailed account statements on demand",
            "Full visibility into portfolio holdings",
        ],
    },
];

const types = [
    {
        name: "Discretionary PMS",
        recommended: true,
        bullets: [
            "Full decision-making authority",
            "Active portfolio rebalancing",
            "Quick market response",
            "Minimal client involvement"
        ]
    },
    {
        name: "Non-Discretionary PMS",
        recommended: false,
        bullets: [
            "Client-driven decisions",
            "Professional execution",
            "Strategic guidance",
            "Full control retained"
        ]
    },
    {
        name: "Advisory PMS",
        recommended: false,
        bullets: [
            "Professional recommendations",
            "Market insights",
            "Research support",
            "Independent execution"
        ]
    }
];

const benefits = [
    {
        icon: <BsSliders2 />,
        title: "Customization",
        bullets: [
            "Personalized to your unique risk appetite",
            "Strategies aligned with individual goals",
            "Flexible asset allocation framework",
        ],
    },
    {
        icon: <BsPersonGear />,
        title: "Professional Management",
        bullets: [
            "Experienced portfolio managers at the helm",
            "Active rebalancing & market monitoring",
            "Minimal day-to-day involvement needed",
        ],
    },
    {
        icon: <BsShieldCheck />,
        title: "Risk Management & Diversification",
        bullets: [
            "Balanced risk-return optimization",
            "Diversified across sectors & instruments",
            "Downside protection strategies in place",
        ],
    },
    {
        icon: <BsGraphUpArrow />,
        title: "Potential for Higher Returns",
        bullets: [
            "Aims to outperform benchmark indices",
            "Focus on alpha generation over time",
            "Goal-oriented wealth accumulation",
        ],
    },
];

const stats = [
    { value: "₹50L+", label: "AUM" },
    { value: "15+", label: "Years" },
    { value: "1000+", label: "Clients" }
];

const faq = [
    {
        question: "What is Portfolio Management Services (PMS)?",
        answer:
            "PMS is a personalized investment service where professional portfolio managers manage your investments to meet specific financial goals, offering tailored strategies, active management, and individual ownership of securities."
    },
    {
        question: "Who can invest in PMS?",
        answer:
            "Typically HNIs or accredited investors who meet the minimum investment thresholds and suitability criteria."
    },
    {
        question: "Is there a lock-in period for PMS investments?",
        answer:
            "Lock-in depends on the strategy; many discretionary PMS mandates do not have fixed lock-ins but may have exit terms. Check the specific mandate documentation."
    }
];


function FAQAccordion({ items }) {
    const [openIndex, setOpenIndex] = useState(0);
    return (
        <div className="pms-faq-accordion">
            {items.map((item, idx) => (
                <div className="pms-accordion-item" key={item.question}>
                    <button
                        className={`pms-accordion-btn${openIndex === idx ? " open" : ""}`}
                        onClick={() => setOpenIndex(openIndex === idx ? -1 : idx)}
                        aria-expanded={openIndex === idx}
                    >
                        {item.question}
                    </button>
                    <div
                        className={`pms-accordion-body${openIndex === idx ? " open" : ""}`}
                        style={{
                            maxHeight: openIndex === idx ? "300px" : "0"
                        }}
                    >
                        <div className="pms-accordion-content">{item.answer}</div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default function PMSLanding() {
    return (
        <div className="pms-scope">
            <header className="pms-hero">
                <div className="pms-hero-top-badge">
                    📈 &nbsp;SEBI Registered Portfolio Manager
                </div>
                <div className="pms-hero-content container">
                    <h1 className="pms-hero-title">
                        Portfolio Management<br />
                        Services <span className="pms-gold">(PMS)</span>
                    </h1>
                    <p className="pms-hero-sub">
                        Personalized investment solutions where professional managers handle your investment portfolio to align
                        with your financial goals, risk appetite, and investment horizon. Unlike mutual funds, PMS involves
                        direct ownership of individual securities.
                    </p>
                    <div className="pms-hero-cta">
                        <a
                            className="pms-btn pms-btn-gold"
                            href="mailto:hello@ongolebulls.in?subject=Consultation%20Request%20-%20PMS"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Schedule Consultation &rarr;
                        </a>
                    </div>
                </div>
                <div className="pms-hero-bottom-stats">
                    {stats.map((stat) => (
                        <div className="pms-stat" key={stat.label}>
                            <span className="pms-stat-value">{stat.value}</span>
                            <span className="pms-stat-label">{stat.label}</span>
                        </div>
                    ))}
                </div>
            </header>

            <main>
                {/* Key Features */}
                <section className="pms-section pms-features text-center">
                    <div className="container">
                        <h2 className="pms-section-title">
                            Key Features of <span className="pms-gold">PMS</span>
                        </h2>
                        <p className="pms-section-sub">
                            Comprehensive portfolio management solutions tailored to your investment needs
                        </p>
                        <div className="pms-card-row">
                            {features.map((f) => (
                                <div className="pms-card pms-card-feature" key={f.title}>
                                    <div className="pms-card-icon-wrap">
                                        <div className="pms-card-icon">{f.icon}</div>
                                    </div>
                                    <h4>{f.title}</h4>
                                    <ul className="pms-bullet-list">
                                        {f.bullets.map((b) => (
                                            <li key={b}>{b}</li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Types of PMS */}
                <section className="pms-section pms-types text-center">
                    <div className="container">
                        <h2 className="pms-section-title">
                            Types of <span className="pms-gold">PMS</span>
                        </h2>
                        <p className="pms-section-sub">
                            Discretionary, non-discretionary, and advisory - depending on the level of control and decision-making authority
                        </p>
                        <div className="pms-card-row">
                            {types.map((type) => (
                                <div className={type.recommended ? "pms-card pms-card-highlight" : "pms-card"} key={type.name}>
                                    {type.recommended && <div className="pms-ribbon">Recommended</div>}
                                    <h3>{type.name}</h3>
                                    <ul className="pms-ticklist">
                                        {type.bullets.map((bullet) => (
                                            <li key={bullet}>
                                                <BsCheckCircleFill className="pms-gold" /> {bullet}
                                            </li>
                                        ))}
                                    </ul>
                                    <a className="pms-btn pms-btn-outline-gold pms-btn-sm" href="#">
                                        Learn More
                                    </a>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Benefits */}
                <section className="pms-section pms-benefits text-center">
                    <div className="container">
                        <h2 className="pms-section-title">
                            Benefits of <span className="pms-gold">PMS</span>
                        </h2>
                        <p className="pms-section-sub">
                            An exclusive, customizable, and actively managed investment solution suited for high-net-worth investors
                        </p>
                        <div className="pms-card-row">
                            {benefits.map((b) => (
                                <div className="pms-card pms-card-feature" key={b.title}>
                                    <div className="pms-card-icon-wrap">
                                        <div className="pms-card-icon">{b.icon}</div>
                                    </div>
                                    <h4>{b.title}</h4>
                                    <ul className="pms-bullet-list">
                                        {b.bullets.map((bullet) => (
                                            <li key={bullet}>{bullet}</li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* FAQ */}
                <section className="pms-section pms-faq">
                    <div className="container pms-narrow">
                        <h2 className="pms-section-title text-center">
                            Frequently Asked <span className="pms-gold">Questions</span>
                        </h2>
                        <p className="pms-section-sub text-center">
                            Find answers to common questions about our Portfolio Management Services
                        </p>
                        <FAQAccordion items={faq} />
                    </div>
                </section>
            </main>
        </div>
    );
}
