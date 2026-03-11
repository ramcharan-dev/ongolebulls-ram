import React, { useState } from "react";
import "./MutualFund2.css";
import {
    BsShieldCheck,
    BsPeople,
    BsRocket,
    BsBook,
    BsGraphUpArrow, // Closest alternative for graph icon
    BsWallet2,
    BsPersonWorkspace,
    BsBarChartLine,
    BsCashCoin,
    BsSafe2,
    BsCheckCircle,
    BsPersonHeart,
    BsSpeedometer2,
    BsBriefcase,
    BsCalendar3,
    BsCashStack,
    BsChevronLeft,
    BsChevronRight,
    BsLock,
    BsStars,
    BsChatDots,
    BsStarFill,
    BsStarHalf
} from "react-icons/bs";

const STEP_ITEMS = [
    { icon: <BsWallet2 />, title: "Investors Pool Funds", desc: "Multiple investors contribute capital into a common fund." },
    { icon: <BsPersonWorkspace />, title: "Fund Manager Invests", desc: "Qualified managers buy securities per the scheme objective." },
    { icon: <BsBarChartLine />, title: "Portfolio Grows", desc: "Returns accrue via appreciation, dividends, or interest." },
    { icon: <BsCashCoin />, title: "Returns Distributed", desc: "Investors benefit through NAV growth or payouts." },
];

const INVEST_CARDS = [
    {
        title: "Equity Funds",
        list: ["Invest in equities and equity related instruments", "For long‑term capital growth"]
    },
    {
        title: "Debt Funds",
        list: ["Invest in fixed‑income securities", "Includes government/corporate bonds", "Includes treasury bills & money market instruments"]
    },
    {
        title: "Hybrid Funds",
        list: ["Invest in a combination of debt and equity", "Offers benefit of asset allocation and diversification"]
    },
    {
        title: "Solution‑Oriented",
        list: ["Tailored for goals like child’s education", "Lock‑in period encourages disciplined investing"]
    },
    {
        title: "ELSS Funds",
        list: ["Tax‑saving under Section 80C", "3‑year lock‑in period"]
    },
    {
        title: "International Funds",
        list: ["Global market exposure", "Currency diversification"]
    },
];

const WHY_ITEMS = [
    { icon: <BsShieldCheck />, title: "AMFI Registered", desc: "Licensed and regulated advisory services." },
    { icon: <BsSafe2 />, title: "Secure & Transparent", desc: "Bank‑grade security and clear transaction visibility." },
    { icon: <BsCheckCircle />, title: "Expert Fund Selection", desc: "Curated schemes mapped to your goals." },
    { icon: <BsPersonHeart />, title: "Dedicated Support", desc: "Personal relationship manager for guidance." },
    { icon: <BsSpeedometer2 />, title: "Real‑time Tracking", desc: "24×7 performance and allocation insights." },
    { icon: <BsBriefcase />, title: "Expert Advisory", desc: "Experienced advisors for goal‑based planning." }
];

const STATS = [
    { icon: <BsShieldCheck />, label: "AMFI", sub: "Registered" },
    { icon: <BsPeople />, label: "AMFI", sub: "Member" },
    { icon: <BsLock />, label: "SSL", sub: "Secure" },
    { icon: <BsStars />, label: "10K+", sub: "Happy Investors" }
];

const SIP_DETAILS = [
    "Start small from ₹500/month",
    "Rupee‑cost averaging across cycles",
    "Disciplined, consistent wealth building",
    "Power of compounding over time"
];
const LUMP_DETAILS = [
    "Immediate deployment and compounding",
    "Market timing advantage when valuations are attractive",
    "Ideal for bonuses, inheritance, or business proceeds",
    "Potentially higher early returns in bull markets"
];

function HeroSection() {
    return (
        <section className="mf-hero">
            <div className="container">
                <div className="mf-hero-content">
                    <div>
                        <div className="mf-badges">
                            <span className="mf-badge"><BsShieldCheck /> AMFI Registered</span>
                            <span className="mf-badge"><BsPeople /> AMFI Member</span>
                        </div>
                        <h1>Start Your Investment Journey with Mutual Funds</h1>
                        <p className="subtitle">Discover how professional fund management can grow your wealth with OngoleBulls Invest.</p>
                        <div className="mf-hero-actions">
                            <a className="btn mf-primary"><BsRocket /> Start Investing</a>
                            <a className="btn mf-outline"><BsBook /> Learn More</a>
                        </div>
                    </div>
                    <div className="mf-hero-dashboard">
                        <span className="mf-icon-pill"><BsGraphUpArrow /></span>
                        <div>
                            <h5>Real-time Tracking</h5>
                            <p>Monitor performance 24/7, track SIPs, and view allocation in your investor dashboard.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

function SectionNav() {
    return (
        <nav className="mf-nav">
            <a href="#mf-learn">What is MF</a>
            <a href="#mf-types">Ways to invest</a>
            <a href="#mf-why">Why Invest</a>
            <a href="#mf-compare">SIP vs Lump Sum</a>
            <a href="#mf-cta">Get Started</a>
        </nav>
    );
}

function WhatIsMFSection() {
    return (
        <section id="mf-learn" className="mf-section">
            <div className="container">
                <h2>What is a Mutual Fund?</h2>
                <p>A mutual fund pools investor money and invests in diversified assets managed by professionals to target returns while managing risk.</p>
                <div className="mf-steps">
                    {STEP_ITEMS.map((item, idx) => (
                        <div className="mf-step-card" key={idx}>
                            <span className="mf-num">{idx + 1}</span>
                            <span className="mf-step-icon">{item.icon}</span>
                            <div className="mf-step-title">{item.title}</div>
                            <p>{item.desc}</p>
                        </div>
                    ))}
                </div>
                <div className="mf-tip">
                    <span><BsBook /></span>
                    <div>
                        <b>Did You Know?</b>
                        <div>Over ₹40 trillion is invested in Indian mutual funds, highlighting strong investor trust.</div>
                    </div>
                </div>
            </div>
        </section>
    );
}

function InvestCards() {
    const [page, setPage] = useState(1);
    const perPage = 3;
    const totalPages = Math.ceil(INVEST_CARDS.length / perPage);
    const start = (page - 1) * perPage;
    const displayCards = INVEST_CARDS.slice(start, start + perPage);

    return (
        <section id="mf-types" className="mf-section">
            <div className="container">
                <h2>Ways to Invest</h2>
                <p>Choose fund types based on goals, risk appetite, and investment horizon.</p>
                <div className="mf-invest-grid">
                    {displayCards.map((card, idx) => (
                        <div key={card.title + idx} className="mf-card">
                            <div className="mf-card-head"><h3>{card.title}</h3></div>
                            <div className="mf-card-body">
                                <ul>
                                    {card.list.map(li => <li key={li}>{li}</li>)}
                                </ul>
                                <a className="mf-card-cta">INVEST</a>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="mf-pagination">
                    <button disabled={page === 1} onClick={() => setPage(page - 1)}><BsChevronLeft /></button>
                    <span>{page} / {totalPages}</span>
                    <button disabled={page === totalPages} onClick={() => setPage(page + 1)}><BsChevronRight /></button>
                </div>
            </div>
        </section>
    );
}

function WhyInvestSection() {
    return (
        <section id="mf-why" className="mf-section">
            <div className="container">
                <h2>Why Invest with OngoleBulls Invest?</h2>
                <p>Transparent processes, research‑driven fund selection, and regulated advisory help build long‑term trust.</p>
                <div className="mf-feature-row">
                    {WHY_ITEMS.map((item, idx) => (
                        <div className="mf-feature-card" key={idx}>
                            <span className="mf-icon-pill">{item.icon}</span>
                            <div>
                                <div className="mf-feature-title">{item.title}</div>
                                <p>{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="mf-stats-row">
                    {STATS.map((stat, idx) => (
                        <div className="mf-stat-card" key={idx}>
                            <span>{stat.icon}</span>
                            <div className="mf-stat-label">{stat.label}</div>
                            <div className="mf-stat-sub">{stat.sub}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function CompareSection() {
    return (
        <section id="mf-compare" className="mf-section">
            <div className="container">
                <h2>SIP vs Lump Sum Investments</h2>
                <p>Pick the strategy that fits your cash flows and market view; many investors blend both for balance.</p>
                <div className="mf-compare-row">
                    <div className="mf-compare-card">
                        <div className="mf-compare-head">
                            <span className="mf-icon-pill"><BsCalendar3 /></span>
                            <div>
                                <b>SIP Investment</b>
                                <div className="mf-compare-sub">Systematic Plan — invest regularly</div>
                            </div>
                        </div>
                        <ul>
                            {SIP_DETAILS.map(ct => <li key={ct}>✔ {ct}</li>)}
                        </ul>
                        <div className="mf-compare-example">
                            <b>Example</b>
                            <div>₹5,000/month for 20 years at 12% annual returns ≈ ₹50 lakhs (Invested: ₹12 lakhs).</div>
                        </div>
                    </div>
                    <div className="mf-compare-card mf-alt">
                        <div className="mf-compare-head">
                            <span className="mf-icon-pill"><BsCashStack /></span>
                            <div>
                                <b>Lump Sum Investment</b>
                                <div className="mf-compare-sub">One‑time larger investment</div>
                            </div>
                        </div>
                        <ul>
                            {LUMP_DETAILS.map(ct => <li key={ct}>✔ {ct}</li>)}
                        </ul>
                        <div className="mf-compare-example mf-alt">
                            <b>Example</b>
                            <div>₹10 lakhs for 10 years at 12% annual returns ≈ ₹31 lakhs (Gain: ₹21 lakhs).</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

function CTASection() {
    return (
        <section id="mf-cta" className="mf-section">
            <div className="container">
                <div className="mf-cta-card">
                    <h3>Ready to Begin Your Investment Journey?</h3>
                    <p>Start small, stay consistent, and let your wealth grow. Our advisors guide you every step of the way.</p>
                    <div className="mf-cta-actions">
                        <a className="btn mf-warning"><BsWallet2 /> Start Investing Now</a>
                        <a className="btn mf-outline" href="https://wa.me/9281111730" target="_blank" rel="noopener noreferrer"><BsChatDots /> Talk to an Advisor</a>
                    </div>
                    <div className="mf-rating">
                        <BsStarFill /><BsStarFill /><BsStarFill /><BsStarFill /><BsStarHalf />
                        <span>4.8/5 by 10,000+ investors</span>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default function MutualFund() {
    return (
        <div className="mf-root">
            <HeroSection />
            <SectionNav />
            <WhatIsMFSection />
            <InvestCards />
            <WhyInvestSection />
            <CompareSection />
            <CTASection />
        </div>
    );
}
