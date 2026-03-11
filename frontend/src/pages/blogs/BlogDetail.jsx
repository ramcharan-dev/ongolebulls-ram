import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getAllBlogs, getBlogById } from '../../api/blogApi';
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

export default function BlogDetail() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    Promise.all([getBlogById(id), getAllBlogs()])
      .then(([detailRes, allRes]) => {
        const current = detailRes.data;
        setBlog(current || null);
        const all = Array.isArray(allRes.data) ? allRes.data : [];
        const items = all
          .filter((entry) => String(entry.id) !== String(id))
          .slice(0, 3)
          .map((entry) => ({
            ...entry,
            imageUrl: resolveBlogImage(entry.image),
            readMinutes: estimateReadMinutes(entry.fullContent || entry.shortDescription),
          }));
        setRelated(items);
      })
      .catch((e) => setError(e.userMessage || 'Article not found.'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <LoadingSpinner />;
  if (error || !blog) {
    return (
      <div className="blogs-detail-page">
        <div className="blogs-page-inner blogs-container">
          <div className="blogs-empty">
            <p>{error || 'Article not found.'}</p>
            <Link to="/blogs" className="blogs-detail-back">Back to Blogs</Link>
          </div>
        </div>
      </div>
    );
  }

  const imageUrl = resolveBlogImage(blog.image);
  const readMinutes = estimateReadMinutes(blog.fullContent || blog.shortDescription);

  return (
    <div className="blogs-detail-page">
      <div className="blogs-page-inner blogs-container">
        <header className="blogs-detail-hero">
          <div className="blogs-hero-badge">Feature Story</div>
          <Link to="/blogs" className="blogs-detail-back">← Back to all articles</Link>
          <h1 className="blogs-detail-title">{blog.title}</h1>
          <div className="blogs-card-meta blogs-detail-meta">
            <span>{formatDate(blog.createdAt)}</span>
            <span>By {blog.author || 'Ongolebulls Invest'}</span>
            <span>{readMinutes} min read</span>
          </div>
        </header>

        <article className="blogs-detail-article">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={blog.title}
              className="blogs-detail-image"
              onError={(event) => {
                event.currentTarget.style.display = 'none';
              }}
            />
          ) : null}

          <div className="blogs-detail-layout">
            <aside className="blogs-detail-aside">
              <h3>At a glance</h3>
              <p><strong>Author:</strong> {blog.author || 'Ongolebulls Invest'}</p>
              <p><strong>Published:</strong> {formatDate(blog.createdAt)}</p>
              <p><strong>Read Time:</strong> {readMinutes} min</p>
              <Link to="/blogs" className="blogs-readmore">Browse More Articles</Link>
            </aside>

            <div>
              {blog.shortDescription ? (
                <p className="blogs-detail-intro">{blog.shortDescription}</p>
              ) : null}

              <div
                className="blogs-detail-content"
                dangerouslySetInnerHTML={{ __html: blog.fullContent || '' }}
              />
            </div>
          </div>
        </article>

        {related.length ? (
          <section className="blogs-related-section">
            <div className="blogs-grid-header">
              <span>Related Reads</span>
              <span className="blogs-grid-count">Recommended for you</span>
            </div>
            <div className="blogs-grid">
              {related.map((item) => (
                <Link key={item.id} to={`/blogs/${item.id}`} className="blogs-card-link">
                  <article className="blogs-card">
                    <div className="blogs-card-media-wrapper">
                      {item.imageUrl ? (
                        <img className="blogs-card-media" src={item.imageUrl} alt={item.title} />
                      ) : (
                        <div className="blogs-card-media blogs-card-media-fallback" />
                      )}
                      <div className="blogs-card-readpill">{item.readMinutes} min read</div>
                    </div>
                    <div className="blogs-card-body">
                      <div className="blogs-card-meta">
                        <span>{formatDate(item.createdAt)}</span>
                        <span>{item.author || 'Ongolebulls Invest'}</span>
                      </div>
                      <h3 className="blogs-card-title">{item.title}</h3>
                      <p className="blogs-card-excerpt">{truncate(item.shortDescription, 95)}</p>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </div>
  );
}
