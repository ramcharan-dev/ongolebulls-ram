import React, { useEffect, useRef } from "react";
import {useNavigate} from "react-router-dom";

import "./HomeSection.css";
import logo from "../../assets/Ongolebulls_Hero_Section_Image.png"


export default function HomeSection() {
    const rootRef = useRef(null);
    const navigate = useNavigate();

    const handleClick = () => {
        navigate("/AppointmentForm");
    }

    const handleContact = () =>{
            navigate("/ContactForm")
       }

    useEffect(() => {
        const el = rootRef.current;
        if (el) el.classList.add("is-visible");
    }, []);

    return (
        <section className="home-section" ref={rootRef}>
            <div className="home-container">
                <div className="home-left">
                    <p className="welcome-text ">Welcome to Ongolebulls</p>

                    <h1 className="main-heading">
                        Smarter Wealth. <br /> Bigger Future.
                    </h1>

                    <p className="sub-text">
                        Personalized strategies for Mutual Funds, PMS, and Investment
                        Banking designed for growth and security.
                    </p>

                    <div className="btn-group">
                        <button
                            type="button"
                            onClick={handleContact}
                            className="primary-btn"
                        >
                            Get Your Wealth Strategy Now
                        </button>

                        <button
                            type="button"
                            onClick={handleClick}
                            className="secondary-btn"
                        >
                            Book an Appointment
                        </button>
                    </div>
                </div>

                <div className="home-right">
                    <img
                        src={logo}
                        alt="Bull Illustration"
                        className="hero-img"
                        loading="lazy"
                    />
                </div>
            </div>


            <div className="badges-wrapper">
                <div className="badges">
                    <div className="my-badge"><i className="bi bi-shield-check"></i> Trusted by 5,000+ Investors</div>
                    <div className="my-badge"><i className="bi bi-unlock"></i> AMFI & APMI Registered</div>
                    <div className="my-badge"><i className="bi bi-bar-chart-line"></i> 95% Client Retention</div>
                </div>
            </div>


            <div className="features-container">
                <div className="feature-card">
                    <div className="feature-icon"><i className="bi bi-graph-up"></i></div>
                    <h3>Tailored Wealth Solutions</h3>
                    <p>Smart investing plans for HNIs, <br/> professionals & business owners.</p>
                </div>

                <div className="feature-card">
                    <div className="feature-icon"><i className="bi bi-unlock"></i></div>
                    <h3>Path to Financial Freedom</h3>
                    <p>Create wealth that works for your future — <br/> secure and sustainable.</p>
                </div>

                <div className="feature-card">
                    <div className="feature-icon"><i className="bi bi-arrow-repeat"></i></div>
                    <h3>360° Financial Planning</h3>
                    <p>From SIPs to IPOs — we guide every step of <br/> your journey.</p>
                </div>

            </div>
        </section>



    );
}



