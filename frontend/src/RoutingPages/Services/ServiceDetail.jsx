import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getServiceBySlug, getSectionsByService } from '../../api/serviceApi';
import { getServiceTheme } from '../../config/serviceThemes';
import { useTheme } from '../../context/ThemeContext';
import './ServiceTheme.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const SECTION_ORDER = ['hero', 'features', 'steps', 'why_choose_us', 'faq', 'cta'];

/** Convert a theme object into CSS custom properties on a wrapper element */
function themeToCSS(theme) {
  return {
    '--st-primary': theme.primary,
    '--st-primary-dark': theme.primaryDark,
    '--st-primary-light': theme.primaryLight,
    '--st-primary-alpha': theme.name === 'gold' ? 'rgba(212,175,55,0.08)' : 'rgba(59,130,246,0.08)',
    '--st-hero-bg': theme.heroBg,
    '--st-hero-text': theme.heroText,
    '--st-hero-sub-text': theme.heroSubText,
    '--st-section-bg': theme.sectionBg,
    '--st-section-alt-bg': theme.sectionAltBg,
    '--st-section-title-color': theme.sectionTitleColor,
    '--st-section-sub-color': theme.sectionSubColor,
    '--st-card-bg': theme.cardBg,
    '--st-card-border': theme.cardBorder,
    '--st-card-radius': theme.cardRadius,
    '--st-card-hover-border': theme.cardHoverBorder,
    '--st-card-hover-shadow': theme.cardHoverShadow,
    '--st-btn-gradient': theme.btnGradient,
    '--st-btn-text': theme.btnText,
    '--st-btn-hover-shadow': theme.btnHoverShadow,
    '--st-badge-bg': theme.badgeBg,
    '--st-badge-text': theme.badgeText,
    '--st-accordion-open-bg': theme.accordionOpenBg,
    '--st-accordion-open-color': theme.accordionOpenColor,
    '--st-divider': theme.dividerColor,
    '--st-icon-color': theme.iconColor,
    '--st-link-color': theme.linkColor,
  };
}

function FAQAccordion({ items }) {
  const [openIndex, setOpenIndex] = useState(0);
  if (!items.length) return null;

  return (
    <div className="st-faq-accordion">
      {items.map((item, idx) => (
        <div className="st-accordion-item st-animate" style={{ animationDelay: `${idx * 0.05}s` }} key={item.id || idx}>
          <button
            type="button"
            className={`st-accordion-btn${openIndex === idx ? ' open' : ''}`}
            onClick={() => setOpenIndex(openIndex === idx ? -1 : idx)}
            aria-expanded={openIndex === idx}
          >
            {item.title || `Question ${idx + 1}`}
          </button>
          <div
            className={`st-accordion-body${openIndex === idx ? ' open' : ''}`}
            style={{ maxHeight: openIndex === idx ? '320px' : '0' }}
          >
            <div className="st-accordion-content">
              {item.description || item.subtitle || 'Details coming soon.'}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function ServiceDetail() {
  const { slug } = useParams();
  const { isDark } = useTheme();
  const [service, setService] = useState(null);
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!slug) return;

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const serviceRes = await getServiceBySlug(slug);
        const svc = serviceRes.data;
        setService(svc || null);

        if (svc?.id) {
          // Try dedicated sections endpoint first; fall back to sections embedded in the service response
          let raw = [];
          try {
            const sectionsRes = await getSectionsByService(svc.id);
            raw = Array.isArray(sectionsRes.data) ? sectionsRes.data : [];
          } catch {
            console.warn('[ServiceDetail] sections endpoint failed, using embedded sections');
          }
          if (!raw.length && Array.isArray(svc.sections)) {
            raw = svc.sections;
          }

          const withSortedItems = raw.map((section) => ({
            ...section,
            items: Array.isArray(section.items)
              ? [...section.items].sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0))
              : [],
          }));

          withSortedItems.sort((a, b) => {
            const typeIndexA = SECTION_ORDER.indexOf(a.sectionType);
            const typeIndexB = SECTION_ORDER.indexOf(b.sectionType);
            if (typeIndexA !== typeIndexB) return typeIndexA - typeIndexB;
            return (a.orderIndex || 0) - (b.orderIndex || 0);
          });

          setSections(withSortedItems);
        } else {
          setSections([]);
        }
      } catch (err) {
        console.error('[ServiceDetail] load error:', err);
        setError('Unable to load this service page. It may not exist or is inactive.');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [slug]);

  const theme = useMemo(() => getServiceTheme(service?.theme, isDark), [service?.theme, isDark]);
  const cssVars = useMemo(() => themeToCSS(theme), [theme]);

  const structure = useMemo(() => {
    const byType = (type) => sections.filter((section) => section.sectionType === type);
    return {
      hero: byType('hero')[0] || null,
      features: byType('features'),
      steps: byType('steps'),
      why: byType('why_choose_us'),
      faq: byType('faq')[0] || null,
      cta: byType('cta')[0] || null,
    };
  }, [sections]);

  if (loading) {
    return (
      <div className="service-themed" style={cssVars}>
        <section className="st-section st-text-center">
          <div className="st-container">
            <p style={{ color: 'var(--st-section-sub-color)' }}>Loading service...</p>
          </div>
        </section>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="service-themed" style={cssVars}>
        <section className="st-section st-text-center">
          <div className="st-container">
            <h2 className="st-section-title">Service not found</h2>
            <p className="st-section-sub">
              {error || 'We could not find the requested service page.'}
            </p>
          </div>
        </section>
      </div>
    );
  }

  const heroTitle = structure.hero?.title || service.title;
  const heroSubtitle = structure.hero?.subtitle || service.subtitle;

  return (
    <div className="service-themed" data-service-theme={theme.name} style={cssVars}>
      {/* ── Hero ───────────────────────────────── */}
      <header className="st-hero">
        <div className="st-hero-badge st-animate">Service</div>
        <div className="st-container">
          <h1 className="st-hero-title st-animate st-animate-delay-1">{heroTitle}</h1>
          {heroSubtitle && <p className="st-hero-sub st-animate st-animate-delay-2">{heroSubtitle}</p>}
          <div className="st-hero-cta st-animate st-animate-delay-3">
            <a className="st-btn st-btn-primary" href="/AppointmentForm">
              Talk to an advisor &rarr;
            </a>
          </div>
        </div>
      </header>

      <main>
        {/* ── Features ─────────────────────────── */}
        {structure.features.length > 0 && (
          <section className="st-section st-features st-text-center">
            <div className="st-container">
              <h2 className="st-section-title st-animate">
                {structure.features[0].title || 'Key Features'}
              </h2>
              {structure.features[0].subtitle && (
                <p className="st-section-sub st-animate">{structure.features[0].subtitle}</p>
              )}
              <div className="st-card-row">
                {structure.features[0].items.map((item, idx) => {
                  const iconClass = (item.icon || '').trim();
                  const biClass = iconClass
                    ? iconClass.includes('bi-') ? iconClass : `bi-${iconClass}`
                    : '';

                  const rawDesc = item.description || item.subtitle || '';
                  const bullets = rawDesc
                    .split(/\n|(?:\.\s)/)
                    .map((s) => s.replace(/\.$/, '').trim())
                    .filter(Boolean);

                  return (
                    <div className="st-card st-card-feature st-animate" style={{ animationDelay: `${idx * 0.08}s` }} key={item.id}>
                      {biClass && (
                        <div className="st-card-icon-wrap">
                          <div className="st-card-icon">
                            <i className={`bi ${biClass}`} />
                          </div>
                        </div>
                      )}
                      <h4>{item.title || 'Feature'}</h4>
                      {bullets.length > 1 ? (
                        <ul className="st-bullet-list">
                          {bullets.map((b) => (
                            <li key={b}>{b}</li>
                          ))}
                        </ul>
                      ) : (
                        <p>{rawDesc}</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* ── Steps ────────────────────────────── */}
        {structure.steps.length > 0 && (
          <section className="st-section st-section-alt st-text-center">
            <div className="st-container">
              <h2 className="st-section-title st-animate">
                {structure.steps[0].title || 'How this service works'}
              </h2>
              {structure.steps[0].subtitle && (
                <p className="st-section-sub st-animate">{structure.steps[0].subtitle}</p>
              )}
              <div className="st-card-row">
                {structure.steps[0].items.map((item, index) => (
                  <div className="st-card st-animate" style={{ animationDelay: `${index * 0.08}s` }} key={item.id || index}>
                    <div className="st-step-badge">Step {index + 1}</div>
                    <h3>{item.title || `Step ${index + 1}`}</h3>
                    <ul className="st-ticklist">
                      {(item.description || item.subtitle || '')
                        .split('\n')
                        .filter(Boolean)
                        .map((line) => (
                          <li key={line}>{line}</li>
                        ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── Why choose us ────────────────────── */}
        {structure.why.length > 0 && (
          <section className="st-section st-text-center">
            <div className="st-container">
              <h2 className="st-section-title st-animate">
                {structure.why[0].title || 'Why choose this service?'}
              </h2>
              {structure.why[0].subtitle && (
                <p className="st-section-sub st-animate">{structure.why[0].subtitle}</p>
              )}
              <div className="st-card-row">
                {structure.why[0].items.map((item, idx) => {
                  const iconClass = (item.icon || '').trim();
                  const biClass = iconClass
                    ? iconClass.includes('bi-') ? iconClass : `bi-${iconClass}`
                    : '';

                  const rawDesc = item.description || item.subtitle || '';
                  const bullets = rawDesc
                    .split(/\n|(?:\.\s)/)
                    .map((s) => s.replace(/\.$/, '').trim())
                    .filter(Boolean);

                  return (
                    <div className="st-card st-card-feature st-animate" style={{ animationDelay: `${idx * 0.08}s` }} key={item.id}>
                      {biClass && (
                        <div className="st-card-icon-wrap">
                          <div className="st-card-icon">
                            <i className={`bi ${biClass}`} />
                          </div>
                        </div>
                      )}
                      <h4>{item.title || 'Benefit'}</h4>
                      {bullets.length > 1 ? (
                        <ul className="st-bullet-list">
                          {bullets.map((b) => (
                            <li key={b}>{b}</li>
                          ))}
                        </ul>
                      ) : (
                        <p>{rawDesc}</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* ── FAQ ──────────────────────────────── */}
        {structure.faq && (
          <section className="st-section st-section-alt">
            <div className="st-container st-narrow">
              <h2 className="st-section-title st-text-center st-animate">
                {structure.faq.title || 'Frequently Asked Questions'}
              </h2>
              {structure.faq.subtitle && (
                <p className="st-section-sub st-text-center st-animate">
                  {structure.faq.subtitle}
                </p>
              )}
              <FAQAccordion items={structure.faq.items || []} />
            </div>
          </section>
        )}

        {/* ── CTA ──────────────────────────────── */}
        {structure.cta && (
          <section className="st-section">
            <div className="st-container">
              <div className="st-cta-card st-animate">
                <h3 className="st-section-title">
                  {structure.cta.title || 'Ready to get started?'}
                </h3>
                {structure.cta.subtitle && (
                  <p className="st-section-sub">{structure.cta.subtitle}</p>
                )}
                <a className="st-btn st-btn-primary" href="/AppointmentForm">
                  Book a consultation &rarr;
                </a>
              </div>
            </div>
          </section>
        )}

        {!sections.length && (
          <div className="st-empty">
            This service page has not been configured with sections yet in the admin portal.
          </div>
        )}
      </main>
    </div>
  );
}