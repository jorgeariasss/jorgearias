import React from 'react'
import { Check } from 'lucide-react'
import { cn } from '../lib/cn'

interface Step {
  label: string
  number: number
}

interface StepIndicatorProps {
  steps: Step[]
  currentStep: number
}

export function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-center gap-4 mb-8">
      {steps.map((step, index) => (
        <React.Fragment key={step.number}>
          <div className="flex flex-col items-center">
            <div
              className={cn(
                'w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all',
                currentStep > step.number
                  ? 'bg-success text-background'
                  : currentStep === step.number
                    ? 'bg-primary text-background ring-2 ring-primary-glow'
                    : 'bg-surface border border-border text-text-secondary'
              )}
            >
              {currentStep > step.number ? (
                <Check size={20} />
              ) : (
                <span>{step.number}</span>
              )}
            </div>
            <span className="text-xs text-text-secondary mt-2">{step.label}</span>
          </div>

          {index < steps.length - 1 && (
            <div
              className={cn(
                'w-12 h-1 rounded-full transition-all',
                currentStep > step.number ? 'bg-success' : 'bg-surface'
              )}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  )
}
