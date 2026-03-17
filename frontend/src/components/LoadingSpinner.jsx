const LoadingSpinner = ({ message = 'Loading…' }) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '2rem', gap: '1rem' }}>
    <div style={{
      width: 40, height: 40,
      border: '4px solid var(--border)',
      borderTop: '4px solid var(--green-primary)',
      borderRadius: '50%',
      animation: 'spin 0.8s linear infinite',
    }} />
    <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>{message}</p>
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>
);

export default LoadingSpinner;
