export default function FormGrid({ children, className = '' }) {
  return <div className={`ucc-form-grid ${className}`.trim()}>{children}</div>;
}
