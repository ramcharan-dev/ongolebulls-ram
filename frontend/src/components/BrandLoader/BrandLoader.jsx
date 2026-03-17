import logo from '../../assets/logo4.png';
import './BrandLoader.css';

export default function BrandLoader({
  title = 'Loading experience',
  subtitle = 'Preparing your dashboard-quality experience.',
  compact = false,
}) {
  return (
    <div className={`brand-loader ${compact ? 'brand-loader-compact' : ''}`} role="status" aria-live="polite">
      <div className="brand-loader-card">
        <div className="brand-loader-visual">
          <div className="brand-loader-orbit" />
          <div className="brand-loader-core">
            <img src={logo} alt="OngoleBulls" className="brand-loader-logo" />
          </div>
        </div>

        <div className="brand-loader-copy">
          <p className="brand-loader-kicker">OngoleBulls Invest</p>
          <h2>{title}</h2>
          <p>{subtitle}</p>
        </div>

        <div className="brand-loader-bars" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
      </div>
    </div>
  );
}
