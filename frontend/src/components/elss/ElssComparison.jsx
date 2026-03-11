const COMPARISON = [
  { investment: 'ELSS', lockIn: '3 Years', returns: 'Market Linked', taxBenefit: 'Up to Rs 1.5L under 80C' },
  { investment: 'PPF', lockIn: '15 Years', returns: 'Government Fixed', taxBenefit: 'Up to Rs 1.5L under 80C' },
  { investment: 'Tax Saving FD', lockIn: '5 Years', returns: 'Bank Fixed', taxBenefit: 'Up to Rs 1.5L under 80C' },
  { investment: 'NSC', lockIn: '5 Years', returns: 'Government Fixed', taxBenefit: 'Up to Rs 1.5L under 80C' },
];

export default function ElssComparison() {
  return (
    <section aria-labelledby="elss-comparison-title">
      <div className="elss-section-head">
        <p className="elss-kicker">Decision Support</p>
        <h2 id="elss-comparison-title">ELSS vs Other Tax Saving Options</h2>
      </div>

      <div className="elss-table-wrap">
        <table className="elss-table">
          <thead>
            <tr>
              <th>Investment</th>
              <th>Lock-in</th>
              <th>Returns</th>
              <th>Tax Benefit</th>
            </tr>
          </thead>
          <tbody>
            {COMPARISON.map((row) => (
              <tr key={row.investment}>
                <td>
                  <strong>{row.investment}</strong>
                </td>
                <td>{row.lockIn}</td>
                <td>{row.returns}</td>
                <td>{row.taxBenefit}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
