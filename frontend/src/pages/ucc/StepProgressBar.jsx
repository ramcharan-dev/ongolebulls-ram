export default function StepProgressBar({ steps, currentStep, onStepClick, conditionalSteps = {} }) {
  return (
    <div className="w-full overflow-x-auto pb-2">
      <div className="flex items-center min-w-max gap-0">
        {steps.map((label, i) => {
          const isActive = i === currentStep;
          const isCompleted = i < currentStep;
          const isConditional = conditionalSteps[i] !== undefined;
          const isSkippable = isConditional && !conditionalSteps[i];

          return (
            <div key={i} className="flex items-center">
              {/* Step circle + label */}
              <button
                onClick={() => onStepClick(i)}
                disabled={i > currentStep}
                className={`flex flex-col items-center gap-1 min-w-[56px] transition-all ${
                  i > currentStep ? 'cursor-not-allowed' : 'cursor-pointer'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all border-2 ${
                    isActive
                      ? 'bg-emerald-600 border-emerald-600 text-white scale-110 shadow-md'
                      : isCompleted
                      ? 'bg-emerald-500 border-emerald-500 text-white'
                      : isSkippable
                      ? 'bg-gray-100 border-gray-300 text-gray-400'
                      : 'bg-white border-gray-300 text-gray-500'
                  }`}
                >
                  {isCompleted ? (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    i + 1
                  )}
                </div>
                <span
                  className={`text-[10px] leading-tight text-center max-w-[60px] ${
                    isActive ? 'text-emerald-700 font-semibold' : isCompleted ? 'text-emerald-600' : 'text-gray-400'
                  }`}
                >
                  {label}
                </span>
              </button>

              {/* Connector line */}
              {i < steps.length - 1 && (
                <div
                  className={`h-0.5 w-4 sm:w-6 mt-[-16px] ${
                    i < currentStep ? 'bg-emerald-500' : 'bg-gray-300'
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
