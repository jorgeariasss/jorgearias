import { Check } from 'lucide-react'

interface StepIndicatorProps {
  currentStep: number
  steps: string[]
}

export function StepIndicator({ currentStep, steps }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-center gap-0 w-full max-w-lg mx-auto">
      {steps.map((label, index) => {
        const stepNum = index + 1
        const isCompleted = currentStep > stepNum
        const isCurrent = currentStep === stepNum

        return (
          <div key={label} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-2">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-500 ${
                  isCompleted
                    ? 'bg-primary text-white'
                    : isCurrent
                    ? 'bg-primary text-white shadow-[0_0_20px_rgba(168,85,247,0.5)]'
                    : 'bg-surface border border-border text-text-muted'
                }`}
              >
                {isCompleted ? <Check className="w-5 h-5" /> : stepNum}
              </div>
              <span
                className={`text-xs font-medium whitespace-nowrap ${
                  isCurrent ? 'text-primary' : isCompleted ? 'text-text-secondary' : 'text-text-muted'
                }`}
              >
                {label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div className="flex-1 h-px mx-3 bg-border relative overflow-hidden self-start mt-5">
                <div
                  className="absolute inset-y-0 left-0 bg-primary transition-all duration-700 ease-out"
                  style={{ width: isCompleted ? '100%' : '0%' }}
                />
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
