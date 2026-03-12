import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";

import "./HomeSection.css";
import logo from "../../assets/Ongolebulls_Hero_Section_Image.png";
import { FloatingOrb, TextReveal } from "../../utils/animations";

/* ─── Spring configs ──────────────────────────────────────────────── */
const snappy = { type: "spring", stiffness: 120, damping: 18 };
const bouncy = { type: "spring", stiffness: 150, damping: 15, mass: 0.8 };

const fadeUp = (delay = 0) => ({
    hidden:  { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { ...snappy, delay } },
});

const scaleIn = (delay = 0) => ({
    hidden:  { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { ...bouncy, delay } },
});

const slideFromLeft = (delay = 0) => ({
    hidden:  { opacity: 0, x: -60 },
    visible: { opacity: 1, x: 0, transition: { ...snappy, delay } },
});

const slideFromRight = (delay = 0) => ({
    hidden:  { opacity: 0, x: 60 },
    visible: { opacity: 1, x: 0, transition: { ...snappy, delay } },
});

const stagger = {
    hidden:  {},
    visible: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};

export default function HomeSection() {
    const sectionRef = useRef(null);
    const navigate = useNavigate();

    /* ─── Scroll-linked effects ────────────────────────────────── */
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start start", "end start"],
    });
    // Hero content fades + pulls up as you scroll past
    const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
    const heroY       = useTransform(scrollYProgress, [0, 0.6], ["0%", "-8%"]);
    // Parallax background drifts slower
    const bgY         = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
    // Hero image floats with slight counter-movement
    const imgY        = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);
    const imgScale    = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);

    const handleClick   = () => navigate("/AppointmentForm");
    const handleContact = () => navigate("/ContactForm");

    return (
        <section className="home-section" ref={sectionRef}>
            {/* ── Parallax gradient background ──────────────────────── */}
            <motion.div className="hero-parallax-bg" style={{ y: bgY }} />

            {/* ── Floating orbs for depth ───────────────────────────── */}
            <div className="hero-orbs">
                <FloatingOrb color="rgba(212, 74, 28, 0.15)" size="400px" top="-10%" left="-5%"  delay={0}   duration={22} />
                <FloatingOrb color="rgba(255, 205, 37, 0.12)" size="350px" top="30%"  left="70%" delay={3}   duration={18} />
                <FloatingOrb color="rgba(212, 74, 28, 0.08)" size="250px" top="60%"  left="30%" delay={6}   duration={25} />
            </div>

            {/* ── Main hero content — fades on scroll ──────────────── */}
            <motion.div style={{ opacity: heroOpacity, y: heroY, position: "relative", zIndex: 2 }}>
                <motion.div
                    className="home-container"
                    initial="hidden"
                    animate="visible"
                    variants={stagger}
                >
                    <div className="home-left">
                        {/* Welcome badge with slide-in */}
                        <motion.div className="welcome-badge" variants={slideFromLeft(0)}>
                            <span className="welcome-dot" />
                            Welcome to Ongolebulls
                        </motion.div>

                        {/* Word-by-word headline */}
                        <TextReveal
                            text="Smarter Wealth. Bigger Future."
                            className="main-heading"
                            delay={0.2}
                        />

                        <motion.p className="sub-text" variants={fadeUp(0.45)}>
                            Personalized strategies for Mutual Funds, PMS, and Investment
                            Banking designed for growth and security.
                        </motion.p>

                        <motion.div className="btn-group" variants={fadeUp(0.55)}>
                            <button
                                type="button"
                                onClick={handleContact}
                                className="primary-btn"
                            >
                                <span>Get Your Wealth Strategy Now</span>
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{marginLeft: 8}}>
                                    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </button>

                            <button
                                type="button"
                                onClick={handleClick}
                                className="secondary-btn"
                            >
                                Book an Appointment
                            </button>
                        </motion.div>
                    </div>

                    {/* Hero image with float + scroll parallax */}
                    <motion.div
                        className="home-right"
                        variants={slideFromRight(0.2)}
                    >
                        <motion.img
                            src={logo}
                            alt="Bull Illustration"
                            className="hero-img"
                            style={{ y: imgY, scale: imgScale }}
                            animate={{ y: [0, -10, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        />
                    </motion.div>
                </motion.div>
            </motion.div>

            {/* ── Badges — staggered scale-in ──────────────────────── */}
            <motion.div
                className="badges-wrapper"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={stagger}
                style={{ position: "relative", zIndex: 2 }}
            >
                <div className="badges">
                    {[
                        { icon: "bi-shield-check", text: "Trusted by 5,000+ Investors" },
                        { icon: "bi-unlock",       text: "AMFI & APMI Registered" },
                        { icon: "bi-bar-chart-line", text: "95% Client Retention" },
                    ].map((badge, i) => (
                        <motion.div
                            key={i}
                            className="my-badge"
                            variants={scaleIn(i * 0.08)}
                            whileHover={{ y: -6, boxShadow: "0 12px 30px rgba(0,0,0,0.12)" }}
                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        >
                            <i className={`bi ${badge.icon}`}></i> {badge.text}
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            {/* ── Feature cards — alternating slide reveals ─────────── */}
            <motion.div
                className="features-container"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                variants={stagger}
                style={{ position: "relative", zIndex: 2 }}
            >
                {[
                    { icon: "bi-graph-up",      title: "Tailored Wealth Solutions",  desc: "Smart investing plans for HNIs, professionals & business owners." },
                    { icon: "bi-unlock",         title: "Path to Financial Freedom",  desc: "Create wealth that works for your future — secure and sustainable." },
                    { icon: "bi-arrow-repeat",   title: "360° Financial Planning",    desc: "From SIPs to IPOs — we guide every step of your journey." },
                ].map((card, i) => (
                    <motion.div
                        key={i}
                        className="feature-card"
                        variants={i === 1 ? fadeUp(0.05) : i === 0 ? slideFromLeft(0) : slideFromRight(0)}
                        whileHover={{
                            y: -12,
                            scale: 1.02,
                            boxShadow: "0 20px 50px rgba(0,0,0,0.12)",
                        }}
                        transition={{ type: "spring", stiffness: 250, damping: 20 }}
                    >
                        <div className="feature-icon"><i className={`bi ${card.icon}`}></i></div>
                        <h3>{card.title}</h3>
                        <p>{card.desc}</p>
                    </motion.div>
                ))}
            </motion.div>
        </section>
    );
}
