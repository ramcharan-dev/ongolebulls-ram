import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BadgeCheck,
  Eye,
  LockKeyhole,
  ServerCog,
  ShieldCheck,
} from 'lucide-react';
import securityImage from '../assets/datasecurity-new.png';
import './data-security-page.css';

const SECURITY_PILLARS = [
  {
    icon: ShieldCheck,
    title: 'Confidentiality First',
    description:
      'Sensitive client information is handled with care, restricted visibility, and clear controls around who can access it.',
  },
  {
    icon: LockKeyhole,
    title: 'Encrypted by Design',
    description:
      'Critical data paths are protected during storage and transmission to reduce exposure and strengthen trust.',
  },
  {
    icon: ServerCog,
    title: 'Secure Infrastructure',
    description:
      'Our systems are structured to support resilient hosting, controlled environments, and operational discipline.',
  },
  {
    icon: Eye,
    title: 'Continuous Monitoring',
    description:
      'We keep a close watch on access patterns, unusual activity, and process hygiene so issues can be caught early.',
  },
];

const SECURITY_COMMITMENTS = [
  'Strict internal access controls for sensitive systems and information.',
  'Protection measures designed to support safe document handling and account workflows.',
  'Operational checks that help reduce unauthorized access and accidental exposure.',
  'Security-minded processes across employee access, storage, and communication touchpoints.',
];

export default function DataSecurityPage() {
  return (
    <div className="security-detail-page">
      <section className="security-detail-hero">
        <div className="security-detail-shell">
          <div className="security-detail-copy">
            <span className="security-detail-eyebrow">Trust and Protection</span>
            <h1>We treat data security as a core part of the client experience.</h1>
            <p>
              Protecting personal and financial information is not an afterthought for us. We build our
              digital experience around secure handling, controlled access, and responsible data practices
              so clients can use the platform with confidence.
            </p>

            <div className="security-detail-highlights">
              <div className="security-detail-chip">
                <BadgeCheck size={16} />
                Encryption-aware workflows
              </div>
              <div className="security-detail-chip">
                <BadgeCheck size={16} />
                Access-managed operations
              </div>
              <div className="security-detail-chip">
                <BadgeCheck size={16} />
                Privacy-conscious handling
              </div>
            </div>

            <div className="security-detail-actions">
              <Link to="/contactForm" className="security-detail-btn security-detail-btn-primary">
                Talk to Us <ArrowRight size={16} />
              </Link>
              <Link to="/services" className="security-detail-btn security-detail-btn-secondary">
                Explore Services
              </Link>
            </div>
          </div>

          <div className="security-detail-visual">
            <div className="security-detail-image-card">
              <img src={securityImage} alt="Security infrastructure illustration" />
            </div>

            <div className="security-detail-side-note">
              <h3>What this means for clients</h3>
              <ul>
                <li>Safer sharing of essential account and profile information</li>
                <li>Structured controls around access to sensitive data</li>
                <li>Better confidence when using forms, documents, and service journeys</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="security-detail-section">
        <div className="security-detail-shell">
          <div className="security-detail-section-head">
            <span>Our Security Focus</span>
            <h2>How we think about protecting your information</h2>
            <p>
              We focus on practical, relevant controls that support confidentiality, integrity, and safer
              day-to-day operations across the platform.
            </p>
          </div>

          <div className="security-detail-grid">
            {SECURITY_PILLARS.map(({ icon: Icon, title, description }) => (
              <article className="security-detail-card" key={title}>
                <div className="security-detail-icon">
                  <Icon size={22} />
                </div>
                <h3>{title}</h3>
                <p>{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="security-detail-section security-detail-section-alt">
        <div className="security-detail-shell security-detail-two-col">
          <div className="security-detail-panel">
            <span className="security-detail-panel-label">Operational Commitment</span>
            <h2>We care deeply about how client data is collected, stored, and used.</h2>
            <p>
              Our goal is simple: only use the information needed to support legitimate investment,
              onboarding, service, and compliance journeys, and treat that information with discipline.
            </p>
          </div>

          <div className="security-detail-checklist">
            {SECURITY_COMMITMENTS.map((item) => (
              <div className="security-detail-check" key={item}>
                <BadgeCheck size={18} />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="security-detail-section">
        <div className="security-detail-shell">
          <div className="security-detail-cta">
            <div>
              <span>Need clarification?</span>
              <h2>We’re happy to explain our security-oriented processes in more detail.</h2>
            </div>
            <Link to="/contactForm" className="security-detail-btn security-detail-btn-primary">
              Contact Us <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
