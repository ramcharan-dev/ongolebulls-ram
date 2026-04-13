import logo from '../../assets/logo4.png';
import './Auth.css';

export default function AuthBrandLogo() {
  return (
    <div className="auth-logo-wrap">
      <div className="auth-logo-float">
        <div className="auth-logo-halo" aria-hidden />
        <div className="auth-logo-halo auth-logo-halo--accent" aria-hidden />
        <div className="auth-logo-sparkles" aria-hidden>
          {Array.from({ length: 8 }, (_, i) => (
            <span key={i} className="auth-logo-sparkle" />
          ))}
        </div>
        <div className="auth-logo-inner">
          <img src={logo} alt="OngoleBulls" className="auth-logo" />
          <div className="auth-logo-shimmer" aria-hidden />
        </div>
      </div>
    </div>
  );
}
