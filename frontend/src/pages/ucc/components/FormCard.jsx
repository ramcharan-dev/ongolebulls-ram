export default function FormCard({ title, description, children, badge }) {
  return (
    <section className="ucc-form-card">
      <header className="ucc-form-head">
        <div className="ucc-form-head-row">
          <h2>{title}</h2>
          {badge ? <span className="ucc-step-badge">{badge}</span> : null}
        </div>
        {description ? <p>{description}</p> : null}
      </header>

      <div className="ucc-form-body">{children}</div>
    </section>
  );
}
