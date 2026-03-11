import { Check } from 'lucide-react';

export default function StepIndicator({ steps, current }) {
  return (
    <div className="ap-step-wrap" role="list" aria-label="Form Steps">
      {steps.map((label, index) => {
        const state = index < current ? 'done' : index === current ? 'active' : 'pending';
        return (
          <div key={`${label}-${index}`} className="ap-step-item" role="listitem" aria-current={index === current ? 'step' : undefined}>
            <div className={`ap-step-dot ${state}`}>
              {state === 'done' ? <Check size={14} /> : index + 1}
            </div>
            {index < steps.length - 1 ? (
              <div className={`ap-step-line ${index < current ? 'done' : ''}`} />
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
