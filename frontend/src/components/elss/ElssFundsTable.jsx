import { Link } from 'react-router-dom';

const FUNDS = [
  {
    name: 'Axis Long Term Equity Fund',
    oneYear: '18.6%',
    threeYear: '21.3%',
    expenseRatio: '1.52%',
    risk: 'High',
    aum: 'Rs 36,420 Cr',
  },
  {
    name: 'Mirae Asset Tax Saver Fund',
    oneYear: '16.9%',
    threeYear: '19.8%',
    expenseRatio: '1.18%',
    risk: 'Moderate-High',
    aum: 'Rs 14,120 Cr',
  },
  {
    name: 'DSP Tax Saver Fund',
    oneYear: '15.8%',
    threeYear: '18.9%',
    expenseRatio: '1.36%',
    risk: 'Moderate-High',
    aum: 'Rs 11,860 Cr',
  },
  {
    name: 'Canara Robeco Equity Tax Saver',
    oneYear: '14.7%',
    threeYear: '17.4%',
    expenseRatio: '0.92%',
    risk: 'Moderate',
    aum: 'Rs 8,540 Cr',
  },
];

export default function ElssFundsTable() {
  return (
    <section id="top-elss-funds" aria-labelledby="elss-funds-title">
      <div className="elss-section-head">
        <p className="elss-kicker">Fund Discovery</p>
        <h2 id="elss-funds-title">Top ELSS Funds</h2>
      </div>

      <div className="elss-table-wrap">
        <table className="elss-table">
          <thead>
            <tr>
              <th>Fund Name</th>
              <th>1Y Returns</th>
              <th>3Y Returns</th>
              <th>Expense Ratio</th>
              <th>Risk Level</th>
              <th>AUM</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {FUNDS.map((fund) => (
              <tr key={fund.name}>
                <td>
                  <strong>{fund.name}</strong>
                </td>
                <td>{fund.oneYear}</td>
                <td>{fund.threeYear}</td>
                <td>{fund.expenseRatio}</td>
                <td>
                  <span className="elss-risk-badge">{fund.risk}</span>
                </td>
                <td>{fund.aum}</td>
                <td>
                  <div className="elss-action-group">
                    <Link to="/MutualFund" className="elss-link-btn">
                      View Details
                    </Link>
                    <Link to="/signup" className="elss-link-btn is-primary">
                      Invest Now
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="elss-fund-cards" aria-label="Top ELSS funds list">
        {FUNDS.map((fund) => (
          <article className="elss-fund-card" key={fund.name}>
            <h3>{fund.name}</h3>
            <div className="elss-fund-meta">
              <span>1Y: {fund.oneYear}</span>
              <span>3Y: {fund.threeYear}</span>
              <span>Expense: {fund.expenseRatio}</span>
              <span>Risk: {fund.risk}</span>
              <span>AUM: {fund.aum}</span>
            </div>
            <div className="elss-action-group">
              <Link to="/MutualFund" className="elss-link-btn">
                View Details
              </Link>
              <Link to="/signup" className="elss-link-btn is-primary">
                Invest Now
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
