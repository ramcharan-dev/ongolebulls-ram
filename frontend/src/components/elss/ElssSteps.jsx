const STEPS = [
  {
    title: 'Choose an ELSS mutual fund',
    description: 'Select a fund based on objective, consistency, and risk profile.',
  },
  {
    title: 'Invest via SIP or Lumpsum',
    description: 'Start with small SIPs or one-time allocation based on cashflow.',
  },
  {
    title: 'Lock-in period of 3 years',
    description: 'Each ELSS installment has a 3-year lock-in from investment date.',
  },
];

export default function ElssSteps() {
  return (
    <section aria-labelledby="elss-steps-title">
      <div className="elss-section-head">
        <p className="elss-kicker">Onboarding Flow</p>
        <h2 id="elss-steps-title">How ELSS Works</h2>
      </div>

      <ol className="elss-steps" aria-label="How ELSS works in three steps">
        {STEPS.map((step, index) => (
          <li key={step.title} className="elss-step-item">
            <span className="elss-step-index">{index + 1}</span>
            <h3>{step.title}</h3>
            <p>{step.description}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
