function OnboardingLayout({ children, currentStep = 1, steps: customSteps }) {
  const defaultSteps = [
    { number: 1, label: 'Business Info' },
    { number: 2, label: 'AI Assistant' },
    { number: 3, label: 'Phone Setup' },
    { number: 4, label: 'Calendar' },
    { number: 5, label: 'Complete' },
  ];

  const steps = customSteps || defaultSteps;
  const totalSteps = steps.length;
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="min-h-screen bg-[#111114]">
      {/* Header */}
      <div className="bg-[#1a1a1d] border-b border-zinc-800">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-teal-500 to-emerald-500 bg-clip-text text-transparent">
            Callnfy
          </h1>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-[#1a1a1d] border-b border-zinc-800">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center flex-1">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                      currentStep >= step.number
                        ? 'bg-gradient-to-r from-teal-500 to-emerald-500 text-white'
                        : 'bg-zinc-800 text-gray-400'
                    }`}
                  >
                    {currentStep > step.number ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      step.number
                    )}
                  </div>
                  <span
                    className={`mt-2 text-xs font-medium whitespace-nowrap ${
                      currentStep >= step.number
                        ? 'text-teal-400'
                        : 'text-gray-500'
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className="flex-1 h-1 mx-2 bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        currentStep > step.number
                          ? 'bg-gradient-to-r from-teal-500 to-emerald-500 w-full'
                          : 'w-0'
                      }`}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Overall Progress */}
          <div className="mt-4">
            <div className="flex justify-between text-sm text-gray-400 mb-2">
              <span>Step {currentStep} of {totalSteps}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-teal-500 to-emerald-500 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-[#1a1a1d] rounded-xl border border-zinc-800 p-8">
          {children}
        </div>
      </div>
    </div>
  );
}

export default OnboardingLayout;
