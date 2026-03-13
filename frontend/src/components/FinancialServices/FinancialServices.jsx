import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./FinancialServices.css";

// Import images
import wealthManagementImg from "../../assets/wealth-management.jpg";
import investmentPlanningImg from "../../assets/investment-planning.jpg";
import mutualFundImg from "../../assets/mutual-fund.jpg";
import pmsImg from "../../assets/pms-portifolio-management.jpeg";
import hniServicesImg from "../../assets/hni-familyservices.jpg";
import stocksImg from "../../assets/stocks.jpg";
import taxPlanningImg from "../../assets/tax&estate-planning.webp";

const services = [
    {
        id: 1,
        image: wealthManagementImg,
        title: "Wealth Management",
        description: "Personalized strategies for long-term growth, disciplined asset allocation, and active risk management.",
        link: "/wealth-management"
    },
    {
        id: 2,
        image: investmentPlanningImg,
        title: "Investment Planning",
        description: "Active and passive portfolios built to your risk profile to maximize returns while minimizing drawdowns.",
        link: "/investment-management"
    },
    {
        id: 3,
        image: mutualFundImg,
        title: "Mutual Fund Investment",
        description: "Diversify with curated funds, optimize for taxes and horizon, and track seamlessly in your dashboard.",
        link: "/mutual-fund"
    },
    {
        id: 4,
        image: pmsImg,
        title: "PMS (Portfolio Management)",
        description: "Bespoke, professionally managed portfolios with direct securities ownership for discerning investors.",
        link: "/pms"
    },
    {
        id: 5,
        image: hniServicesImg,
        title: "HNI & Family Office",
        description: "Estate planning, tax optimization, and succession strategies to protect and grow multi-gen wealth.",
        link: "/hni-services"
    },
    {
        id: 6,
        image: stocksImg,
        title: "Stocks & Bonds",
        description: "Research-backed equity, IPO, and fixed-income ideas for diversification and reliable cashflows.",
        link: "/stock-markets-bonds"
    },
    {
        id: 7,
        image: taxPlanningImg,
        title: "Tax & Estate Planning",
        description: "Minimize liabilities and structure legacy transfers with compliant, efficient frameworks.",
        link: "/tax-optimization-planning"
    }
];

export default function FinancialServicesSection() {
    const getCardsPerPage = () => {
        if (typeof window === "undefined") return 3;
        if (window.innerWidth >= 1100) return 3;
        if (window.innerWidth >= 768) return 2;
        return 1;
    };

    const [currentPage, setCurrentPage] = useState(0);
    const [cardsPerPage, setCardsPerPage] = useState(getCardsPerPage);

    useEffect(() => {
        const handleResize = () => setCardsPerPage(getCardsPerPage());
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const pages = useMemo(() => {
        const chunked = [];
        for (let i = 0; i < services.length; i += cardsPerPage) {
            chunked.push(services.slice(i, i + cardsPerPage));
        }
        return chunked;
    }, [cardsPerPage]);

    const totalPages = pages.length;

    useEffect(() => {
        if (currentPage >= totalPages) {
            setCurrentPage(Math.max(totalPages - 1, 0));
        }
    }, [currentPage, totalPages]);

    const nextSlide = () => {
        setCurrentPage((prev) => (prev + 1) % totalPages);
    };

    const prevSlide = () => {
        setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
    };

    return (
        <section className="services-section" id="services">
            <div className="services-container">
                <div className="services-header">
                    <h2 className="services-title">Our Financial Services</h2>
                    <p className="services-subtitle">Goal-based, research-driven, and regulation-first advisory</p>
                </div>

                <div className="services-slider-shell">
                    <div className="services-viewport">
                        <div
                            className="services-track"
                            style={{ transform: `translateX(-${currentPage * 100}%)` }}
                        >
                            {pages.map((page, pageIndex) => (
                                <div className="services-slide-page" key={`page-${pageIndex}`}>
                                    {page.map((service) => (
                                        <article className="service-card" key={service.id}>
                                            <div className="service-card-inner">
                                                <div className="service-media">
                                                    <img
                                                        src={service.image}
                                                        alt={service.title}
                                                        loading="lazy"
                                                        className="service-img"
                                                    />
                                                </div>
                                                <div className="service-body">
                                                    <h5 className="service-heading">{service.title}</h5>
                                                    <p className="service-text">{service.description}</p>
                                                    <div className="service-actions">
                                                        <Link to={service.link} className="service-link">
                                                            Read more <i className="bi bi-arrow-right"></i>
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                        </article>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="carousel-navigation">
                        <button
                            className="nav-button prev-button"
                            onClick={prevSlide}
                            aria-label="Previous services"
                            disabled={totalPages <= 1}
                        >
                            <i className="bi bi-chevron-left"></i>
                        </button>

                        <div className="carousel-pagination">
                            <span className="pagination-current">{currentPage + 1}</span>
                            <span className="pagination-divider">/</span>
                            <span className="pagination-total">{totalPages}</span>
                        </div>

                        <div className="page-dots" aria-label="Services pagination">
                            {pages.map((_, idx) => (
                                <button
                                    key={`dot-${idx}`}
                                    className={`page-dot ${idx === currentPage ? "active" : ""}`}
                                    onClick={() => setCurrentPage(idx)}
                                    aria-label={`Go to page ${idx + 1}`}
                                />
                            ))}
                        </div>

                        <button
                            className="nav-button next-button"
                            onClick={nextSlide}
                            aria-label="Next services"
                            disabled={totalPages <= 1}
                        >
                            <i className="bi bi-chevron-right"></i>
                        </button>
                    </div>

                    <div className="carousel-progress-bar">
                        <div
                            className="progress-fill"
                            style={{ width: `${((currentPage + 1) / totalPages) * 100}%` }}
                        ></div>
                    </div>
                </div>
            </div>
        </section>
    );
}
