import { ShieldCheck, LockKeyhole, TrendingUp } from 'lucide-react';

const BENEFITS = [
  {
    title: 'Tax Savings',
    description: 'Save up to Rs 46,800 in taxes under Section 80C.',
    icon: ShieldCheck,
  },
  {
    title: 'Shortest Lock-in',
    description: 'Only 3 year lock-in compared to PPF or tax saving FDs.',
    icon: LockKeyhole,
  },
  {
    title: 'Equity Growth',
    description: 'Opportunity to earn higher returns through equity markets.',
    icon: TrendingUp,
  },
];

export default function ElssBenefits() {
  return (
    <section aria-labelledby="elss-benefits-title">
      <div className="elss-section-head">
        <p className="elss-kicker">Why ELSS</p>
        <h2 id="elss-benefits-title">Benefits Designed for Tax and Growth</h2>
      </div>

      <div className="elss-benefit-grid">
        {BENEFITS.map((item) => {
          const Icon = item.icon;
          return (
            <article className="elss-benefit-card" key={item.title}>
              <span className="elss-benefit-icon">
                <Icon size={22} />
              </span>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
