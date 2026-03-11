import { useEffect, useState } from 'react';
import { BarChart3, Compass, Layers, Wallet } from 'lucide-react';
import { Link } from 'react-router-dom';
import './investment-guides.css';

const ETF_BASICS = [
  {
    title: 'Basket Investing',
    description: 'An ETF tracks an index or theme and gives diversified exposure in one trade.',
    icon: Layers,
  },
  {
    title: 'Exchange Traded',
    description: 'ETFs are bought and sold on stock exchanges during market hours.',
    icon: BarChart3,
  },
  {
    title: 'Cost Efficient',
    description: 'Most ETFs have lower expense ratios than active funds.',
    icon: Wallet,
  },
  {
    title: 'Transparent',
    description: 'Holdings are generally disclosed regularly, helping investors track exposure.',
    icon: Compass,
  },
];

const ETF_FAQS = [
  {
    q: 'What is an ETF?',
    a: 'ETF stands for Exchange Traded Fund. It pools money and invests in a basket such as an index, sector, debt, or commodity.',
  },
  {
    q: 'How is ETF different from mutual funds?',
    a: 'ETFs trade live like stocks on exchanges, while most mutual funds transact at end-of-day NAV.',
  },
  {
    q: 'Are ETFs safer than stocks?',
    a: 'ETFs can reduce single-company risk through diversification, but they still carry market risk.',
  },
  {
    q: 'Who should use ETFs?',
    a: 'Investors seeking diversified, low-cost, rule-based market exposure often prefer ETFs.',
  },
];

export default function EtfsPage() {
  const [openFaq, setOpenFaq] = useState(0);

  useEffect(() => {
    document.title = 'ETFs Guide | OngoleBulls';
  }, []);

  return (
    <div className="ig-page">
      <section className="ig-hero">
        <div className="ig-wrap ig-hero-grid">
          <div>
            <p className="ig-kicker">Investment Guide</p>
            <h1>ETFs Explained: Diversified Investing in One Trade</h1>
            <p className="ig-subtext">
              ETFs are exchange-traded baskets that can track indices, sectors, debt, or commodities with transparent and typically low-cost exposure.
            </p>
            <div className="ig-cta-row">
              <Link to="/signup" className="ig-btn ig-btn-primary">
                Explore ETF Investing
              </Link>
              <Link to="/stocks" className="ig-btn ig-btn-secondary">
                Compare With Stocks
              </Link>
            </div>
          </div>

          <div className="ig-hero-card">
            <h3>ETFs in one line</h3>
            <p>Buy one instrument and get exposure to an entire basket based on index or theme.</p>
            <div className="ig-pill-row">
              <span>Diversified</span>
              <span>Lower Cost</span>
              <span>Market Linked</span>
            </div>
          </div>
        </div>
      </section>

      <section className="ig-section ig-alt">
        <div className="ig-wrap">
          <div className="ig-head">
            <p className="ig-kicker">What Is What</p>
            <h2>Core ETF Concepts</h2>
          </div>
          <div className="ig-card-grid">
            {ETF_BASICS.map((item) => {
              const Icon = item.icon;
              return (
                <article key={item.title} className="ig-info-card">
                  <span className="ig-icon"><Icon size={20} /></span>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="ig-section">
        <div className="ig-wrap">
          <div className="ig-head">
            <p className="ig-kicker">Comparison</p>
            <h2>ETF vs Traditional Mutual Fund</h2>
          </div>
          <div className="ig-table-wrap">
            <table className="ig-table">
              <thead>
                <tr>
                  <th>Factor</th>
                  <th>ETF</th>
                  <th>Mutual Fund</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Trading style</td>
                  <td>Exchange traded live</td>
                  <td>NAV-based end-of-day</td>
                </tr>
                <tr>
                  <td>Expense ratio</td>
                  <td>Usually lower (index ETFs)</td>
                  <td>Can be higher (active funds)</td>
                </tr>
                <tr>
                  <td>Portfolio transparency</td>
                  <td>Generally high</td>
                  <td>Periodic disclosure</td>
                </tr>
                <tr>
                  <td>Demat requirement</td>
                  <td>Typically needed</td>
                  <td>Not always required</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="ig-section ig-alt">
        <div className="ig-wrap">
          <div className="ig-head">
            <p className="ig-kicker">FAQ</p>
            <h2>ETF FAQs</h2>
          </div>
          <div className="ig-faq-list">
            {ETF_FAQS.map((item, index) => {
              const isOpen = openFaq === index;
              const panelId = `etf-faq-${index}`;
              return (
                <article className="ig-faq-item" key={item.q}>
                  <h3>
                    <button
                      type="button"
                      className="ig-faq-trigger"
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => setOpenFaq((prev) => (prev === index ? -1 : index))}
                    >
                      <span>{item.q}</span>
                      <span>{isOpen ? '−' : '+'}</span>
                    </button>
                  </h3>
                  <div id={panelId} hidden={!isOpen} className="ig-faq-panel">
                    <p>{item.a}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
