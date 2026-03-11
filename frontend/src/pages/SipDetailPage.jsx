import { useEffect, useState } from 'react';
import { ArrowRight, Clock3, IndianRupee, ShieldCheck, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import SipCalculator from '../components/calculators/SipCalculator';
import './sip-detail.css';

const BENEFITS = [
  {
    title: 'Disciplined Investing',
    description: 'Automate monthly investing and avoid timing the market.',
    icon: Clock3,
  },
  {
    title: 'Rupee Cost Averaging',
    description: 'Buy more units when markets are low and average your purchase cost.',
    icon: IndianRupee,
  },
  {
    title: 'Long-Term Wealth',
    description: 'Compounding over years can significantly increase your corpus.',
    icon: TrendingUp,
  },
];

const FAQS = [
  {
    q: 'What is SIP?',
    a: 'SIP (Systematic Investment Plan) lets you invest a fixed amount regularly in a mutual fund scheme.',
  },
  {
    q: 'Can I pause or modify my SIP?',
    a: 'Yes. Most platforms allow SIP pause, increase, decrease, or cancellation based on fund house rules.',
  },
  {
    q: 'What is a good SIP amount to start with?',
    a: 'Start with an amount you can continue consistently, even Rs 500 or Rs 1,000 per month.',
  },
  {
    q: 'Is SIP only for equity funds?',
    a: 'No. SIP is available across many mutual fund categories including equity, debt, and hybrid funds.',
  },
];

export default function SipDetailPage() {
  const [openFaq, setOpenFaq] = useState(0);

  useEffect(() => {
    document.title = 'SIP Investment Guide | OngoleBulls';
  }, []);

  return (
    <div className="sip-page">
      <section className="sip-hero">
        <div className="sip-wrap sip-hero-grid">
          <div>
            <p className="sip-kicker">Systematic Investment Plan</p>
            <h1>Invest Monthly. Build Long-Term Wealth.</h1>
            <p className="sip-subtext">
              SIP helps you build investing discipline with flexible monthly contributions and compounding growth.
            </p>
            <div className="sip-cta-row">
              <Link to="/signup" className="sip-btn sip-btn-primary">
                Start SIP <ArrowRight size={16} />
              </Link>
              <a href="#sip-calculator" className="sip-btn sip-btn-secondary">
                Estimate Returns
              </a>
            </div>
            <ul className="sip-points">
              <li>Start from low monthly amounts</li>
              <li>Reduces timing risk with periodic investing</li>
              <li>Best suited for long-term goals</li>
            </ul>
          </div>

          <div className="sip-hero-card" aria-hidden="true">
            <div className="sip-hero-metric">
              <span>Monthly SIP</span>
              <strong>Rs 10,000</strong>
            </div>
            <div className="sip-hero-metric">
              <span>Investment Period</span>
              <strong>15 Years</strong>
            </div>
            <div className="sip-hero-metric">
              <span>Projected Corpus*</span>
              <strong>Rs 50L+</strong>
            </div>
            <p>*Illustrative estimate based on expected returns, not guaranteed.</p>
          </div>
        </div>
      </section>

      <section className="sip-section sip-alt">
        <div className="sip-wrap">
          <div className="sip-head">
            <p className="sip-kicker">Why SIP</p>
            <h2>Why Investors Prefer SIP</h2>
          </div>
          <div className="sip-benefit-grid">
            {BENEFITS.map((item) => {
              const Icon = item.icon;
              return (
                <article className="sip-benefit-card" key={item.title}>
                  <span className="sip-icon">
                    <Icon size={20} />
                  </span>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="sip-section">
        <div className="sip-wrap">
          <div className="sip-head">
            <p className="sip-kicker">Comparison</p>
            <h2>SIP vs Lumpsum</h2>
          </div>
          <div className="sip-table-wrap">
            <table className="sip-table">
              <thead>
                <tr>
                  <th>Factor</th>
                  <th>SIP</th>
                  <th>Lumpsum</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Investment Pattern</td>
                  <td>Fixed periodic contribution</td>
                  <td>One-time large investment</td>
                </tr>
                <tr>
                  <td>Market Timing Risk</td>
                  <td>Lower due to averaging</td>
                  <td>Higher at entry point</td>
                </tr>
                <tr>
                  <td>Cashflow Friendly</td>
                  <td>Yes</td>
                  <td>Depends on liquidity</td>
                </tr>
                <tr>
                  <td>Best For</td>
                  <td>Salary-based long-term investors</td>
                  <td>Investors with idle surplus capital</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="sip-section sip-alt">
        <div className="sip-wrap">
          <div className="sip-head">
            <p className="sip-kicker">Process</p>
            <h2>How SIP Works</h2>
          </div>
          <ol className="sip-steps">
            <li>
              <span>1</span>
              <h3>Choose Fund</h3>
              <p>Select a fund based on goals, horizon, and risk profile.</p>
            </li>
            <li>
              <span>2</span>
              <h3>Set Monthly Amount</h3>
              <p>Decide amount and date for automatic monthly investments.</p>
            </li>
            <li>
              <span>3</span>
              <h3>Track and Stay Invested</h3>
              <p>Continue consistently to benefit from compounding over time.</p>
            </li>
          </ol>
        </div>
      </section>

      <section className="sip-section" id="sip-calculator">
        <div className="sip-wrap">
          <div className="sip-head">
            <p className="sip-kicker">Calculator</p>
            <h2>SIP Return Calculator</h2>
          </div>
          <SipCalculator />
        </div>
      </section>

      <section className="sip-section sip-alt">
        <div className="sip-wrap">
          <div className="sip-head">
            <p className="sip-kicker">FAQs</p>
            <h2>Common SIP Questions</h2>
          </div>
          <div className="sip-faq-list">
            {FAQS.map((item, index) => {
              const isOpen = openFaq === index;
              const panelId = `sip-faq-${index}`;
              return (
                <article key={item.q} className={`sip-faq-item ${isOpen ? 'is-open' : ''}`}>
                  <h3>
                    <button
                      type="button"
                      className="sip-faq-trigger"
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => setOpenFaq((prev) => (prev === index ? -1 : index))}
                    >
                      <span>{item.q}</span>
                      <span>{isOpen ? '−' : '+'}</span>
                    </button>
                  </h3>
                  <div id={panelId} hidden={!isOpen} className="sip-faq-panel">
                    <p>{item.a}</p>
                  </div>
                </article>
              );
            })}
          </div>
          <div className="sip-disclaimer">
            <ShieldCheck size={16} />
            <span>Mutual fund investments are subject to market risks. Read all scheme related documents carefully.</span>
          </div>
        </div>
      </section>
    </div>
  );
}
