const LoadingSpinner = ({ message = 'Loading…' }) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '2rem', gap: '1rem' }}>
    <div style={{
      width: 40, height: 40,
      border: '4px solid #e5e7eb',
      borderTop: '4px solid #16a34a',
      borderRadius: '50%',
      animation: 'spin 0.8s linear infinite',
    }} />
    <p style={{ color: '#6b7280', fontSize: 14 }}>{message}</p>
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>
);

export default LoadingSpinner;
