import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getAllBlogs } from '../../api/blogApi';
import { formatDate, truncate } from '../../utils/formatters';
import LoadingSpinner from '../../components/LoadingSpinner';
import './Blogs.css';

const estimateReadMinutes = (text) => {
  if (!text) return 1;
  const words = String(text).split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
};

const resolveBlogImage = (image) => {
  const raw = String(image || '').trim();
  if (!raw) return '';
  const base = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
  if (raw.startsWith('http')) return raw;
  if (raw.startsWith('/assets/')) return `${base}${raw}`;
  return `${base}/assets/${raw}`;
};

export default function BlogList() {
  const [blogs, setBlogs]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');

  const load = async () => {
    setLoading(true); setError('');
    try {
      const res = await getAllBlogs();
      setBlogs(res.data || []);
    } catch (e) { setError(e.userMessage || 'Failed to load blogs.'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const enriched = useMemo(
    () =>
      blogs.map((blog) => {
        const image = resolveBlogImage(blog.image);
        const readMinutes = estimateReadMinutes(blog.fullContent || blog.shortDescription);
        return { ...blog, image, readMinutes };
      }),
    [blogs],
  );
  const featured = enriched[0] || null;
  const list = enriched.slice(1);

  return (
    <section className="blogs-page blogs-list-page">
      <div className="blogs-page-inner blogs-container">
        <header className="blogs-hero">
          <div className="blogs-hero-badge">Editorial Journal</div>
          <h1 className="blogs-hero-title">Market Intelligence, Insights, and Strategy</h1>
          <p className="blogs-hero-subtitle">
            A curated library of expert perspectives covering markets, wealth planning, portfolio strategy,
            and investor behavior.
          </p>
        </header>

        {loading ? <LoadingSpinner /> : null}
        {!loading && error ? <div className="blogs-error"><p>{error}</p></div> : null}

        {!loading && !error ? (
          <>
            {featured ? (
              <Link to={`/blogs/${featured.id}`} className="blogs-featured-link">
                <article className="blogs-featured-card">
                  <div className="blogs-featured-media">
                    {featured.image ? (
                      <img src={featured.image} alt={featured.title} />
                    ) : (
                      <div className="blogs-featured-placeholder" />
                    )}
                  </div>
                  <div className="blogs-featured-overlay">
                    <div className="blogs-card-meta">
                      <span>{formatDate(featured.createdAt)}</span>
                      <span>{featured.author || 'Ongolebulls Invest'}</span>
                      <span>{featured.readMinutes} min read</span>
                    </div>
                    <h2 className="blogs-featured-title">{featured.title}</h2>
                    <p className="blogs-featured-excerpt">{truncate(featured.shortDescription, 170)}</p>
                    <span className="blogs-readmore">Read Full Story</span>
                  </div>
                </article>
              </Link>
            ) : null}

            <div className="blogs-grid-wrapper">
              <div className="blogs-grid-header">
                <span>Latest Articles</span>
                <span className="blogs-grid-count">
                  <strong>{enriched.length}</strong> {enriched.length === 1 ? 'Article' : 'Articles'}
                </span>
              </div>

              <div className="blogs-grid">
                {enriched.length === 0 ? (
                  <div className="blogs-empty"><p>No articles yet. Check back soon.</p></div>
                ) : null}

                {(list.length ? list : featured ? [featured] : []).map((blog) => (
                  <Link key={blog.id} to={`/blogs/${blog.id}`} className="blogs-card-link">
                    <article className="blogs-card">
                      <div className="blogs-card-media-wrapper">
                        {blog.image ? (
                          <img className="blogs-card-media" src={blog.image} alt={blog.title} />
                        ) : (
                          <div className="blogs-card-media blogs-card-media-fallback" />
                        )}
                        <div className="blogs-card-readpill">{blog.readMinutes} min read</div>
                      </div>

                      <div className="blogs-card-body">
                        <div className="blogs-card-meta">
                          <span>{formatDate(blog.createdAt)}</span>
                          <span>{blog.author || 'Ongolebulls Invest'}</span>
                        </div>
                        <h3 className="blogs-card-title">{blog.title}</h3>
                        <p className="blogs-card-excerpt">{truncate(blog.shortDescription, 120)}</p>
                        <div className="blogs-card-footer">
                          <span className="blogs-card-pill">{blog.author || 'Ongolebulls Invest'}</span>
                          <span className="blogs-card-button">Read Article</span>
                        </div>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            </div>
          </>
        ) : null}
      </div>
    </section>
  );
}
