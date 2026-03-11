import { useEffect, useRef } from 'react';

function StepMark({ index, done, current }) {
  if (done) {
    return (
      <span className="ucc-step-mark is-done" aria-hidden="true">
        <svg viewBox="0 0 20 20" fill="none">
          <path d="M4.5 10.5L8 14l7.5-8" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    );
  }

  return <span className={`ucc-step-mark ${current ? 'is-current' : ''}`}>{index + 1}</span>;
}

export default function UccStepper({ steps, currentStep, onStepClick, conditionalSteps = {} }) {
  const progress = Math.round(((currentStep + 1) / steps.length) * 100);
  const scrollerRef = useRef(null);

  useEffect(() => {
    const container = scrollerRef.current;
    if (!container) return;

    const active = container.querySelector('.ucc-step-item.is-current');
    if (!active) return;

    active.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  }, [currentStep]);

  return (
    <section className="ucc-stepper" aria-label="Registration progress">
      <div className="ucc-stepper-meta">
        <p>Onboarding progress</p>
        <p>{progress}% complete</p>
      </div>

      <div className="ucc-stepper-track" aria-hidden="true">
        <span style={{ width: `${progress}%` }} />
      </div>

      <div className="ucc-stepper-scroll" ref={scrollerRef}>
        <ol className="ucc-stepper-list">
          {steps.map((label, index) => {
            const done = index < currentStep;
            const current = index === currentStep;
            const locked = index > currentStep;
            const optional = conditionalSteps[index] !== undefined && !conditionalSteps[index];

            return (
              <li key={label} className="ucc-step-item-wrap">
                <button
                  type="button"
                  disabled={locked}
                  onClick={() => onStepClick(index)}
                  className={`ucc-step-item ${current ? 'is-current' : ''}`}
                  aria-current={current ? 'step' : undefined}
                >
                  <StepMark index={index} done={done} current={current} />
                  <span className="ucc-step-label">{label}</span>
                  <span className="ucc-step-helper">{optional ? 'Optional' : ' '}</span>
                </button>
                {index < steps.length - 1 ? <span className={`ucc-step-link ${done ? 'is-done' : ''}`} aria-hidden="true" /> : null}
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
