import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getServiceBySlug, getSectionsByService } from '../../api/serviceApi';
import '../PmsPage/PMS.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const SECTION_ORDER = ['hero', 'features', 'steps', 'why_choose_us', 'faq', 'cta'];

function FAQAccordion({ items }) {
  const [openIndex, setOpenIndex] = useState(0);

  if (!items.length) return null;

  return (
    <div className="pms-faq-accordion">
      {items.map((item, idx) => (
        <div className="pms-accordion-item" key={item.id || idx}>
          <button
            type="button"
            className={`pms-accordion-btn${openIndex === idx ? ' open' : ''}`}
            onClick={() => setOpenIndex(openIndex === idx ? -1 : idx)}
            aria-expanded={openIndex === idx}
          >
            {item.title || `Question ${idx + 1}`}
          </button>
          <div
            className={`pms-accordion-body${openIndex === idx ? ' open' : ''}`}
            style={{ maxHeight: openIndex === idx ? '320px' : '0' }}
          >
            <div className="pms-accordion-content">
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
          const sectionsRes = await getSectionsByService(svc.id);
          const raw = Array.isArray(sectionsRes.data) ? sectionsRes.data : [];
          const withSortedItems = raw.map((section) => ({
            ...section,
            items: Array.isArray(section.items)
              ? [...section.items].sort(
                  (a, b) => (a.orderIndex || 0) - (b.orderIndex || 0),
                )
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
        setError('Unable to load this service page. It may not exist or is inactive.');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [slug]);

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
      <div className="pms-scope">
        <section className="pms-section text-center">
          <div className="container">
            <p>Loading service…</p>
          </div>
        </section>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="pms-scope">
        <section className="pms-section text-center">
          <div className="container">
            <h2 className="pms-section-title">Service not found</h2>
            <p className="pms-section-sub">
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
    <div className="pms-scope">
      {/* Hero – styled like PMS hero */}
      <header className="pms-hero">
        <div className="pms-hero-top-badge">
          Service
        </div>
        <div className="pms-hero-content container">
          <h1 className="pms-hero-title">{heroTitle}</h1>
          {heroSubtitle ? <p className="pms-hero-sub">{heroSubtitle}</p> : null}
          <div className="pms-hero-cta">
            {/* Simple generic CTA – text can be refined in backend hero section items later */}
            <a
              className="pms-btn pms-btn-gold"
              href="/AppointmentForm"
            >
              Talk to an advisor →
            </a>
          </div>
        </div>
      </header>

      <main>
        {/* Features – cards row like PMS "Key Features" */}
        {structure.features.length ? (
          <section className="pms-section pms-features text-center">
            <div className="container">
              <h2 className="pms-section-title">
                {structure.features[0].title || 'Key Features'}
              </h2>
              {structure.features[0].subtitle ? (
                <p className="pms-section-sub">{structure.features[0].subtitle}</p>
              ) : null}
              <div className="pms-card-row">
                {structure.features[0].items.map((item) => {
                  const iconClass = (item.icon || '').trim();
                  const biClass = iconClass
                    ? iconClass.includes('bi-')
                      ? iconClass
                      : `bi-${iconClass}`
                    : '';

                  return (
                    <div className="pms-card pms-card-small" key={item.id}>
                      {biClass ? (
                        <div className="pms-card-icon">
                          <i className={`bi ${biClass}`} />
                        </div>
                      ) : null}
                      <h4>{item.title || 'Feature'}</h4>
                      <p>{item.description || item.subtitle || ''}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        ) : null}

        {/* Steps / process – styled like PMS "Types"/cards */}
        {structure.steps.length ? (
          <section className="pms-section pms-types text-center">
            <div className="container">
              <h2 className="pms-section-title">
                {structure.steps[0].title || 'How this service works'}
              </h2>
              {structure.steps[0].subtitle ? (
                <p className="pms-section-sub">{structure.steps[0].subtitle}</p>
              ) : null}
              <div className="pms-card-row">
                {structure.steps[0].items.map((item, index) => (
                  <div className="pms-card" key={item.id || index}>
                    <div className="pms-step-badge">
                      Step {index + 1}
                    </div>
                    <h3>{item.title || `Step ${index + 1}`}</h3>
                    <ul className="pms-ticklist">
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
        ) : null}

        {/* Why choose us – benefits style grid */}
        {structure.why.length ? (
          <section className="pms-section pms-benefits text-center">
            <div className="container">
              <h2 className="pms-section-title">
                {structure.why[0].title || 'Why choose this service?'}
              </h2>
              {structure.why[0].subtitle ? (
                <p className="pms-section-sub">{structure.why[0].subtitle}</p>
              ) : null}
              <div className="pms-card-row">
                {structure.why[0].items.map((item) => {
                  const iconClass = (item.icon || '').trim();
                  const biClass = iconClass
                    ? iconClass.includes('bi-')
                      ? iconClass
                      : `bi-${iconClass}`
                    : '';

                  return (
                    <div className="pms-card pms-card-small" key={item.id}>
                      {biClass ? (
                        <div className="pms-card-icon">
                          <i className={`bi ${biClass}`} />
                        </div>
                      ) : null}
                      <h4>{item.title || 'Benefit'}</h4>
                      <p>{item.description || item.subtitle || ''}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        ) : null}

        {/* FAQ – accordion like PMS FAQ */}
        {structure.faq ? (
          <section className="pms-section pms-faq">
            <div className="container pms-narrow">
              <h2 className="pms-section-title text-center">
                {structure.faq.title || 'Frequently Asked Questions'}
              </h2>
              {structure.faq.subtitle ? (
                <p className="pms-section-sub text-center">
                  {structure.faq.subtitle}
                </p>
              ) : null}
              <FAQAccordion items={structure.faq.items || []} />
            </div>
          </section>
        ) : null}

        {/* CTA – closing card, using CTA section if present */}
        {structure.cta ? (
          <section className="pms-section">
            <div className="container">
              <div className="pms-card" style={{ textAlign: 'center' }}>
                <h3 className="pms-section-title">
                  {structure.cta.title || 'Ready to get started?'}
                </h3>
                {structure.cta.subtitle ? (
                  <p className="pms-section-sub">
                    {structure.cta.subtitle}
                  </p>
                ) : null}
                <a
                  className="pms-btn pms-btn-gold"
                  href="/AppointmentForm"
                >
                  Book a consultation →
                </a>
              </div>
            </div>
          </section>
        ) : null}

        {!sections.length ? (
          <section className="pms-section text-center">
            <div className="container">
              <p className="pms-section-sub">
                This service page has not been configured with sections yet in the admin portal.
              </p>
            </div>
          </section>
        ) : null}
      </main>
    </div>
  );
}

