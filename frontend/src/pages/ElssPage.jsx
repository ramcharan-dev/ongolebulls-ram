import { useEffect } from 'react';
import ElssHero from '../components/elss/ElssHero';
import ElssBenefits from '../components/elss/ElssBenefits';
import ElssFundsTable from '../components/elss/ElssFundsTable';
import ElssSipCalculator from '../components/elss/ElssSipCalculator';
import ElssComparison from '../components/elss/ElssComparison';
import ElssSteps from '../components/elss/ElssSteps';
import ElssFaq from '../components/elss/ElssFaq';
import '../components/elss/elss.css';

export default function ElssPage() {
  useEffect(() => {
    document.title = 'ELSS Tax Saving Mutual Funds | OngoleBulls';

    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }

    metaDescription.setAttribute(
      'content',
      'Explore ELSS tax saving mutual funds, compare options, and use our SIP calculator to plan wealth creation with Section 80C benefits.'
    );
  }, []);

  return (
    <div className="elss-page">
      <section className="elss-section elss-section-hero">
        <div className="elss-container">
          <ElssHero />
        </div>
      </section>

      <section className="elss-section elss-section-alt">
        <div className="elss-container">
          <ElssBenefits />
        </div>
      </section>

      <section className="elss-section">
        <div className="elss-container">
          <ElssFundsTable />
        </div>
      </section>

      <section className="elss-section elss-section-alt">
        <div className="elss-container">
          <ElssSipCalculator />
        </div>
      </section>

      <section className="elss-section">
        <div className="elss-container">
          <ElssComparison />
        </div>
      </section>

      <section className="elss-section elss-section-alt">
        <div className="elss-container">
          <ElssSteps />
        </div>
      </section>

      <section className="elss-section">
        <div className="elss-container">
          <ElssFaq />
        </div>
      </section>
    </div>
  );
}
