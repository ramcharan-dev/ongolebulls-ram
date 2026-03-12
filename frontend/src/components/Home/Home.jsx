import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import HomeSection from "./HomeSection.jsx";
import FinancialGoals from "../FinancialGoals/FinancialGoals.jsx";
import HelpSection from "../HelpSection/HelpSection.jsx";
import KeyQuestions from "../KeyQuestions/KeytQuestions.jsx";
import AboutUsSection from "../AboutUsSection/AboutUsSection.jsx";
import FinancialServices from "../FinancialServices/FinancialServices.jsx";
import CorePrinciples from "../CorePrinciples/CorePrinciples.jsx";
import DataSecuritySection from "../DataSecurity/DataSecuritySection.jsx";
import WhyChooseUs from "../WhyChooseUs/WhyChooseUs.jsx";
import { ScrollReveal, RevealItem, FloatingOrb } from "../../utils/animations.jsx";

/*
 * Each section gets a DIFFERENT reveal direction so the page feels dynamic,
 * not repetitive. The pattern alternates: fadeUp → slideLeft → slideRight →
 * scaleUp → blur → fadeUp → slideRight → slideLeft
 */
const sectionConfigs = [
    { Component: FinancialGoals,     variant: "fadeUp" },
    { Component: HelpSection,        variant: "slideLeft" },
    { Component: KeyQuestions,        variant: "slideRight" },
    { Component: AboutUsSection,     variant: "scaleUp" },
    { Component: FinancialServices,  variant: "blur" },
    { Component: CorePrinciples,     variant: "fadeUp" },
    { Component: DataSecuritySection, variant: "slideRight" },
    { Component: WhyChooseUs,        variant: "slideLeft" },
];

/* Variant definitions matching the animation utility */
const variants = {
    fadeUp:     { hidden: { opacity: 0, y: 60 },           visible: { opacity: 1, y: 0 } },
    slideLeft:  { hidden: { opacity: 0, x: -80 },          visible: { opacity: 1, x: 0 } },
    slideRight: { hidden: { opacity: 0, x: 80 },           visible: { opacity: 1, x: 0 } },
    scaleUp:    { hidden: { opacity: 0, scale: 0.88 },     visible: { opacity: 1, scale: 1 } },
    blur:       { hidden: { opacity: 0, filter: "blur(10px)", y: 30 }, visible: { opacity: 1, filter: "blur(0px)", y: 0 } },
};

const spring = { type: "spring", stiffness: 100, damping: 20 };

function Home() {
    const pageRef = useRef(null);

    // Scroll progress for the global depth layer
    const { scrollYProgress } = useScroll();
    const orbY1 = useTransform(scrollYProgress, [0, 1], ["0vh",  "-25vh"]);
    const orbY2 = useTransform(scrollYProgress, [0, 1], ["0vh",  "-40vh"]);
    const orbY3 = useTransform(scrollYProgress, [0, 1], ["0vh",  "-15vh"]);

    // Scroll progress bar at the very top
    const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);

    return (
        <div className="home-page" ref={pageRef} style={{ position: "relative" }}>
            {/* ── Scroll progress bar ────────────────────────── */}
            <motion.div
                style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 3,
                    background: "linear-gradient(90deg, #d44a1c, #ffcd25)",
                    transformOrigin: "left",
                    scaleX,
                    zIndex: 9999,
                }}
            />

            {/* ── Global floating depth orbs ─────────────────── */}
            <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
                <motion.div style={{
                    position: "absolute", width: "500px", height: "500px",
                    top: "10%", left: "-8%", borderRadius: "50%",
                    background: "radial-gradient(circle, rgba(212,74,28,0.06) 0%, transparent 70%)",
                    filter: "blur(60px)", y: orbY1,
                }} />
                <motion.div style={{
                    position: "absolute", width: "400px", height: "400px",
                    top: "45%", right: "-5%", borderRadius: "50%",
                    background: "radial-gradient(circle, rgba(255,205,37,0.07) 0%, transparent 70%)",
                    filter: "blur(50px)", y: orbY2,
                }} />
                <motion.div style={{
                    position: "absolute", width: "350px", height: "350px",
                    top: "75%", left: "25%", borderRadius: "50%",
                    background: "radial-gradient(circle, rgba(212,74,28,0.04) 0%, transparent 70%)",
                    filter: "blur(70px)", y: orbY3,
                }} />
            </div>

            {/* ── Page content ─────────────────────────────────── */}
            <div style={{ position: "relative", zIndex: 1 }}>
                <HomeSection />

                {sectionConfigs.map(({ Component, variant }, i) => (
                    <motion.div
                        key={i}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.1 }}
                        variants={variants[variant]}
                        transition={{ ...spring, delay: 0.05 }}
                    >
                        <Component />
                    </motion.div>
                ))}
            </div>
        </div>
    );
}

export default Home;
