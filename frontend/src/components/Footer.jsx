import { Link, useLocation } from 'react-router-dom';

export default function Footer() {
  const location = useLocation();
  if (location.pathname.startsWith('/admin')) return null;

  return (
    <footer style={{
      background: '#14532d', color: '#fff',
      padding: '2.5rem 1.5rem 1.5rem',
      marginTop: '4rem',
    }}>
      <div className="container">
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(160px, 1fr))', gap:'2rem', marginBottom:'2rem' }}>
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:'.75rem' }}>
              <div style={{ width:28, height:28, background:'#16a34a', borderRadius:6, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:800, fontSize:12 }}>OB</div>
              <span style={{ fontWeight:700, fontSize:16 }}>OngoleBulls</span>
            </div>
            <p style={{ fontSize:13, opacity:.75, lineHeight:1.6 }}>
              Smart investment solutions for every financial goal.
            </p>
          </div>

          <div>
            <p style={{ fontWeight:700, marginBottom:'.75rem', fontSize:13, opacity:.6, textTransform:'uppercase', letterSpacing:'.05em' }}>Invest</p>
            {[['/funds','Mutual Funds'],['/calculator','SIP Calculator'],['/appointment','Book Consultation']].map(([to, label]) => (
              <Link key={to} to={to} style={{ display:'block', fontSize:14, color:'rgba(255,255,255,.8)', textDecoration:'none', marginBottom:4 }}>
                {label}
              </Link>
            ))}
          </div>

          <div>
            <p style={{ fontWeight:700, marginBottom:'.75rem', fontSize:13, opacity:.6, textTransform:'uppercase', letterSpacing:'.05em' }}>Company</p>
            {[['/blogs','Blogs'],['/careers','Careers'],['/contact','Contact']].map(([to, label]) => (
              <Link key={to} to={to} style={{ display:'block', fontSize:14, color:'rgba(255,255,255,.8)', textDecoration:'none', marginBottom:4 }}>
                {label}
              </Link>
            ))}
          </div>

          <div>
            <p style={{ fontWeight:700, marginBottom:'.75rem', fontSize:13, opacity:.6, textTransform:'uppercase', letterSpacing:'.05em' }}>Contact</p>
            <p style={{ fontSize:13, opacity:.75 }}>info@ongolebullsinvest.com</p>
            <p style={{ fontSize:13, opacity:.75, marginTop:4 }}>Ongole, Andhra Pradesh</p>
            <p style={{ fontSize:13, opacity:.75, marginTop:4 }}>www.ongolebullsinvest.com</p>
          </div>
        </div>

        <div style={{ borderTop:'1px solid rgba(255,255,255,.15)', paddingTop:'1.25rem', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:8 }}>
          <p style={{ fontSize:13, opacity:.6 }}>
            © {new Date().getFullYear()} OngoleBulls Invest. All rights reserved.
          </p>
          <p style={{ fontSize:12, opacity:.5 }}>
            Investments are subject to market risks. Please read all scheme-related documents carefully.
          </p>
        </div>
      </div>
    </footer>
  );
}
