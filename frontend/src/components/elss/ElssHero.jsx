import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function useAnimatedNumber(target, duration = 900) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let frame;
    const start = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - (1 - progress) ** 3;
      setValue(Math.round(target * eased));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, duration]);

  return value;
}

function HeroStat({ label, value, prefix = '', suffix = '' }) {
  const animated = useAnimatedNumber(value);

  return (
    <div className="elss-hero-stat">
      <span>{label}</span>
      <strong>
        {prefix}
        {animated.toLocaleString('en-IN')}
        {suffix}
      </strong>
    </div>
  );
}

export default function ElssHero() {
  return (
    <div className="elss-hero-grid">
      <div className="elss-hero-content">
        <p className="elss-kicker">Tax Saving Investments</p>
        <h1>ELSS Tax Saving Mutual Funds</h1>
        <p className="elss-subtitle">
          Save up to Rs 46,800 in taxes under Section 80C while investing in equity markets.
        </p>

        <ul className="elss-highlight-list" aria-label="ELSS highlights">
          <li>Tax deduction up to Rs 1.5L</li>
          <li>Shortest lock-in of only 3 years</li>
          <li>Potential market-linked returns</li>
        </ul>

        <div className="elss-hero-actions">
          <Link className="elss-btn elss-btn-primary" to="/tools/sip-calculator">
            Start SIP
          </Link>
          <a className="elss-btn elss-btn-secondary" href="#top-elss-funds">
            Explore ELSS Funds
          </a>
        </div>
      </div>

      <div className="elss-hero-visual" aria-hidden="true">
        <div className="elss-growth-panel">
          <div className="elss-growth-head">
            <p>Projected Tax Efficiency</p>
            <span>Live simulation</span>
          </div>

          <div className="elss-growth-bars">
            <div className="bar-row">
              <span>Tax Benefit</span>
              <div>
                <i style={{ width: '84%' }} />
              </div>
            </div>
            <div className="bar-row">
              <span>Liquidity</span>
              <div>
                <i style={{ width: '68%' }} />
              </div>
            </div>
            <div className="bar-row">
              <span>Growth Potential</span>
              <div>
                <i style={{ width: '92%' }} />
              </div>
            </div>
          </div>

          <div className="elss-hero-stats">
            <HeroStat label="Maximum Tax Saved" value={46800} prefix="Rs " />
            <HeroStat label="80C Eligible Investment" value={150000} prefix="Rs " />
            <HeroStat label="Lock-in Period" value={3} suffix=" Years" />
          </div>
        </div>
      </div>
    </div>
  );
}
