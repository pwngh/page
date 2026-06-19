import { cn } from '../../shared/utils.js';

/**
 * Render a multi-step progress indicator with optional click navigation.
 *
 * In linear mode (default) only completed steps and the next step are clickable.
 *
 * @param {StepperProps} props
 * @returns {React.JSX.Element}
 */
export function Stepper({
  steps,
  activeStep,
  onChange,
  linear = true,
  orientation = 'horizontal',
  disabled = false,
  className,
  ...props
}) {
  const containerClasses = cn(
    'flex',
    orientation === 'vertical' ? 'flex-col space-y-4' : 'space-x-4',
    className
  );

  const getStepStatus = (index) => {
    if (index === activeStep) return 'current';
    if (index < activeStep) return 'complete';
    return 'upcoming';
  };

  const isStepClickable = (index) => {
    if (disabled) return false;
    if (!linear) return true;
    return index <= activeStep + 1;
  };

  const renderStepIcon = (step, index, status) => {
    if (step.icon) return step.icon;

    if (status === 'complete') {
      return (
        <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
        </svg>
      );
    }

    return (
      <span className={cn(
        'w-6 h-6',
        'flex items-center justify-center',
        'rounded-full',
        'text-sm font-medium',
        status === 'current' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
      )}>
        {index + 1}
      </span>
    );
  };

  const renderConnector = (index) => {
    if (index === steps.length - 1) return null;

    return (
      <div
        className={cn(
          'flex-1',
          orientation === 'vertical' ? 'w-px h-full ml-3' : 'h-px w-full mt-3',
          index < activeStep ? 'bg-blue-600' : 'bg-gray-200'
        )}
      />
    );
  };

  return (
    <div
      className={containerClasses}
      role="navigation"
      aria-label="Progress"
      {...props}
    >
      {steps.map((step, index) => {
        const status = getStepStatus(index);
        const clickable = isStepClickable(index);

        return (
          <div
            key={index}
            className={cn(
              'flex',
              orientation === 'vertical' ? 'items-start' : 'items-center',
              { 'flex-1': orientation === 'horizontal' }
            )}
          >
            <div className="relative flex items-center">
              <button
                type="button"
                onClick={() => clickable && onChange(index)}
                className={cn(
                  'flex items-center',
                  clickable && !disabled ? 'cursor-pointer' : 'cursor-default'
                )}
                disabled={!clickable || disabled}
                aria-current={status === 'current' ? 'step' : undefined}
              >
                {renderStepIcon(step, index, status)}
                <span className={cn(
                  'ml-3',
                  'text-sm font-medium',
                  status === 'current' ? 'text-gray-900' : 'text-gray-500'
                )}>
                  {step.label}
                  {step.optional && (
                    <span className="block text-xs text-gray-400">Optional</span>
                  )}
                </span>
              </button>
              {step.description && (
                <p className="mt-1 ml-9 text-sm text-gray-500">
                  {step.description}
                </p>
              )}
            </div>
            {renderConnector(index)}
          </div>
        );
      })}
    </div>
  );
}
