import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getServices } from '../../api/serviceApi';
import './Services.css';

// Local mapping from backend slug to a visual category label and image key.
// Text (title/subtitle) still always comes from backend.
const SERVICE_VISUAL_PRESETS = {
  'wealth-management': { label: 'Wealth Management', imageKey: 'wealth' },
  'investment-management': { label: 'Investment Planning', imageKey: 'investment' },
  'mutual-fund': { label: 'Mutual Funds', imageKey: 'mutual' },
  pms: { label: 'PMS', imageKey: 'pms' },
  'hni-services': { label: 'HNI & Family Office', imageKey: 'hni' },
  'stock-markets-bonds': { label: 'Stocks & Bonds', imageKey: 'stocks' },
  'tax-optimization-planning': { label: 'Tax & Estate Planning', imageKey: 'tax' },
};

// Map a service slug to a background image class.
// If a bannerImage exists in backend, cards will use it directly.
const getImageClassForSlug = (slug) => {
  const key = SERVICE_VISUAL_PRESETS[slug]?.imageKey;
  if (!key) return 'services-card-bg-generic';
  return `services-card-bg-${key}`;
};

export default function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getServices();
        const data = Array.isArray(response.data) ? response.data : [];
        setServices(data.filter((item) => item.isActive !== false));
      } catch (err) {
        setError('Unable to load services. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading) {
    return (
      <section className="services-page-loading">
        <p>Loading services…</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="services-page-error">
        <h1>Unable to load services</h1>
        <p>{error}</p>
      </section>
    );
  }

  if (!services.length) {
    return (
      <section className="services-page-empty">
        <h1>Services coming soon</h1>
        <p>
          Our team is configuring the services catalogue in the admin portal. Please check back
          shortly.
        </p>
      </section>
    );
  }

  return (
    <section className="services-page">
      <div className="services-page-inner">
        <div className="services-page-hero">
          <div>
            <p className="services-page-kicker">Ongolebulls services</p>
            <h1 className="services-page-title">
              Goal-first financial services,
              <br />
              built and managed for you.
            </h1>
            <p className="services-page-subtitle">
              Explore bespoke investment, wealth, and tax strategies tailored to your goals.
            </p>

            <div className="services-page-pills">
              <span className="services-page-pill">Mutual Funds &amp; SIPs</span>
              <span className="services-page-pill">PMS &amp; Direct Equity</span>
              <span className="services-page-pill">HNIs &amp; Family Offices</span>
              <span className="services-page-pill">Tax &amp; Estate Design</span>
            </div>
          </div>
        </div>

        <div className="services-page-grid-wrapper">
          <div className="services-page-grid-header">
            <span>Service catalogue</span>
          </div>

          <div className="services-page-grid">
            {services.map((service) => {
              const imageClass = getImageClassForSlug(service.slug || '');
              const rawBanner = (service.bannerImage || '').trim();
              let banner = '';
              if (rawBanner) {
                if (/^https?:\/\//i.test(rawBanner)) {
                  banner = rawBanner;
                } else if (rawBanner.startsWith('/assets/')) {
                  banner = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'}${rawBanner}`;
                } else {
                  banner = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'}/assets/${rawBanner}`;
                }
              }
              const visualLabel =
                SERVICE_VISUAL_PRESETS[service.slug || '']?.label || 'Premium service';

              if (!service.slug) {
                return null;
              }

              return (
                <Link
                  key={service.id}
                  to={`/services/${service.slug}`}
                  className="services-page-card-link-wrapper"
                >
                  <article className="services-page-card">
                    {banner ? (
                      <div
                        className="services-page-card-media"
                        style={{
                          backgroundImage: `url(${banner})`,
                        }}
                      />
                    ) : (
                      <div className={`services-page-card-media ${imageClass}`} />
                    )}
                    <div className="services-page-card-body">
                      <p className="services-page-card-kicker">{visualLabel}</p>
                      <h2 className="services-page-card-title">
                        {service.title || 'Untitled service'}
                      </h2>
                      {service.subtitle ? (
                        <p className="services-page-card-subtitle">{service.subtitle}</p>
                      ) : null}

                      <div className="services-page-card-footer">
                        <span className="services-page-card-pill">View details</span>
                        <span className="services-page-card-link">
                          <span aria-hidden="true">↗</span>
                        </span>
                      </div>
                    </div>
                  </article>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
