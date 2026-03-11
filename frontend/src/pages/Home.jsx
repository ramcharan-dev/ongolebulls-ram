import { Link } from 'react-router-dom';
import { useState } from 'react';
import { subscribe } from '../api/subscriberApi';

export default function Home() {
  const [subEmail, setSubEmail] = useState('');
  const [subMsg, setSubMsg]     = useState('');

  const handleSubscribe = async (e) => {
    e.preventDefault();
    try {
      await subscribe(subEmail);
      setSubMsg('Thank you for subscribing!'); setSubEmail('');
    } catch (err) {
      setSubMsg(err.userMessage || 'Subscription failed.');
    }
  };

  return (
    <div>
      {/* Hero */}
      <section style={{ background:'linear-gradient(135deg, #14532d 0%, #16a34a 100%)', color:'#fff', padding:'5rem 1.5rem', textAlign:'center' }}>
        <div style={{ maxWidth:700, margin:'0 auto' }}>
          <h1 style={{ fontSize:'2.75rem', fontWeight:800, marginBottom:'1rem', lineHeight:1.2 }}>
            Smart Investing. Brighter Futures.
          </h1>
          <p style={{ fontSize:'1.1rem', opacity:.9, marginBottom:'2rem', lineHeight:1.7 }}>
            OngoleBulls Invest helps you grow wealth through mutual funds, SIPs, and expert financial guidance — tailored to your goals.
          </p>
          <div style={{ display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap' }}>
            <Link to="/register" className="btn" style={{ background:'#fff', color:'#16a34a', padding:'.75rem 2rem', fontSize:15 }}>
              Get Started Free
            </Link>
            <Link to="/funds" className="btn" style={{ background:'rgba(255,255,255,.15)', color:'#fff', border:'1.5px solid rgba(255,255,255,.5)', padding:'.75rem 2rem', fontSize:15 }}>
              Explore Funds
            </Link>
          </div>
        </div>
      </section>

      {/* Feature grid */}
      <section style={{ padding:'4rem 1.5rem', background:'#fff' }}>
        <div className="container">
          <h2 style={{ textAlign:'center', fontSize:'1.75rem', fontWeight:700, marginBottom:'2.5rem' }}>
            Everything You Need to Invest Smarter
          </h2>
          <div className="grid-3">
            {[
              ['📈','Mutual Funds','Access 100s of curated mutual fund schemes across equity, debt, and hybrid categories.', '/funds'],
              ['🧮','SIP Calculator','Plan your monthly SIP and see projected returns over any investment horizon.', '/calculator'],
              ['📅','Book Consultation','Schedule a 1-on-1 session with our certified financial advisors.', '/appointment'],
              ['📰','Investment Blogs','Stay informed with expert articles on markets, tax, and wealth creation.', '/blogs'],
              ['💼','Careers','Join our growing team and build a career in fintech and wealth management.', '/careers'],
              ['📞','Contact Us','Have questions? Our support team is ready to help you anytime.', '/contact'],
            ].map(([icon, title, desc, link]) => (
              <Link to={link} key={title} style={{ textDecoration:'none', color:'inherit' }}>
                <div className="card" style={{ height:'100%', transition:'box-shadow .15s, transform .15s', cursor:'pointer' }}
                  onMouseEnter={e => { e.currentTarget.style.boxShadow='var(--shadow-md)'; e.currentTarget.style.transform='translateY(-2px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow='var(--shadow)';    e.currentTarget.style.transform='none'; }}>
                  <div style={{ fontSize:36, marginBottom:12 }}>{icon}</div>
                  <h3 style={{ fontWeight:600, marginBottom:8 }}>{title}</h3>
                  <p className="text-muted" style={{ fontSize:14, lineHeight:1.6 }}>{desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section style={{ background:'#f0fdf4', padding:'3rem 1.5rem' }}>
        <div style={{ maxWidth:500, margin:'0 auto', textAlign:'center' }}>
          <h2 style={{ fontWeight:700, marginBottom:'.5rem' }}>Stay Informed</h2>
          <p className="text-muted mb-2">Get market insights and investment tips delivered to your inbox.</p>
          {subMsg ? (
            <div className="alert alert-success" style={{ display:'inline-block' }}>{subMsg}</div>
          ) : (
            <form onSubmit={handleSubscribe} style={{ display:'flex', gap:8 }}>
              <input type="email" required value={subEmail} onChange={e => setSubEmail(e.target.value)}
                placeholder="Enter your email"
                style={{ flex:1, padding:'.6rem 1rem', border:'1.5px solid #e5e7eb', borderRadius:8, fontSize:14 }} />
              <button className="btn btn-primary" type="submit">Subscribe</button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
