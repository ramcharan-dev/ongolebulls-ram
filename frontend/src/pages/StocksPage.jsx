import { useEffect, useState } from 'react';
import { Building2, CircleDollarSign, PieChart, ShieldAlert } from 'lucide-react';
import { Link } from 'react-router-dom';
import './investment-guides.css';

const STOCK_BASICS = [
  {
    title: 'Ownership',
    description: 'A stock represents partial ownership in a listed company.',
    icon: Building2,
  },
  {
    title: 'Return Sources',
    description: 'Investors can earn via price appreciation and dividends.',
    icon: CircleDollarSign,
  },
  {
    title: 'Diversification Need',
    description: 'Single stocks can be volatile, so portfolio spread is important.',
    icon: PieChart,
  },
  {
    title: 'Risk Awareness',
    description: 'Stock prices can move sharply with earnings, news, and sentiment.',
    icon: ShieldAlert,
  },
];

const STOCK_FAQS = [
  {
    q: 'What exactly is a stock?',
    a: 'A stock is a unit of ownership in a company. If the company grows, stock value may rise; if performance weakens, it may fall.',
  },
  {
    q: 'How do investors make money from stocks?',
    a: 'Through capital gains when prices rise and through dividends if the company distributes profits.',
  },
  {
    q: 'Are stocks suitable for beginners?',
    a: 'They can be, but beginners should start with research, diversification, and risk limits instead of concentrated bets.',
  },
  {
    q: 'Stocks or ETFs: which is simpler?',
    a: 'ETFs are generally simpler for broad exposure, while stocks require deeper company-level analysis.',
  },
];

export default function StocksPage() {
  const [openFaq, setOpenFaq] = useState(0);

  useEffect(() => {
    document.title = 'Stocks Guide | OngoleBulls';
  }, []);

  return (
    <div className="ig-page">
      <section className="ig-hero">
        <div className="ig-wrap ig-hero-grid">
          <div>
            <p className="ig-kicker">Investment Guide</p>
            <h1>Stocks Explained: What They Are and How They Work</h1>
            <p className="ig-subtext">
              Stocks are direct ownership in companies. They can create long-term wealth, but they also carry market and business risk.
            </p>
            <div className="ig-cta-row">
              <Link to="/signup" className="ig-btn ig-btn-primary">
                Start Investing
              </Link>
              <Link to="/etfs" className="ig-btn ig-btn-secondary">
                Learn ETFs Next
              </Link>
            </div>
          </div>

          <div className="ig-hero-card">
            <h3>Stocks in one line</h3>
            <p>Buy a share in a business. Your returns depend on company performance and market valuation.</p>
            <div className="ig-pill-row">
              <span>High Growth Potential</span>
              <span>Higher Volatility</span>
              <span>Needs Research</span>
            </div>
          </div>
        </div>
      </section>

      <section className="ig-section ig-alt">
        <div className="ig-wrap">
          <div className="ig-head">
            <p className="ig-kicker">What Is What</p>
            <h2>Core Stock Concepts</h2>
          </div>
          <div className="ig-card-grid">
            {STOCK_BASICS.map((item) => {
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
            <h2>Stocks vs ETFs (Quick View)</h2>
          </div>
          <div className="ig-table-wrap">
            <table className="ig-table">
              <thead>
                <tr>
                  <th>Factor</th>
                  <th>Stocks</th>
                  <th>ETFs</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Exposure</td>
                  <td>Single company</td>
                  <td>Basket of multiple securities</td>
                </tr>
                <tr>
                  <td>Risk concentration</td>
                  <td>Higher</td>
                  <td>Lower due to diversification</td>
                </tr>
                <tr>
                  <td>Research effort</td>
                  <td>Higher</td>
                  <td>Moderate</td>
                </tr>
                <tr>
                  <td>Cost structure</td>
                  <td>Brokerage and taxes</td>
                  <td>Brokerage plus ETF expense ratio</td>
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
            <h2>Stocks FAQs</h2>
          </div>
          <div className="ig-faq-list">
            {STOCK_FAQS.map((item, index) => {
              const isOpen = openFaq === index;
              const panelId = `stocks-faq-${index}`;
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
