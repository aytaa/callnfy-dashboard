import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, Check } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { BusinessInfo } from './steps/BusinessInfo';
import { WorkingHours } from './steps/WorkingHours';
import { Services } from './steps/Services';
import { AISettings } from './steps/AISettings';
import { PhoneNumber } from './steps/PhoneNumber';
import { TestCall } from './steps/TestCall';

const STEPS = [
  { id: 1, name: 'Business Info', component: BusinessInfo, canSkip: false },
  { id: 2, name: 'Working Hours', component: WorkingHours, canSkip: true },
  { id: 3, name: 'Services', component: Services, canSkip: true },
  { id: 4, name: 'AI Settings', component: AISettings, canSkip: false },
  { id: 5, name: 'Phone Number', component: PhoneNumber, canSkip: false },
  { id: 6, name: 'Test Call', component: TestCall, canSkip: false }
];

export function Onboarding() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [onboardingData, setOnboardingData] = useState(() => {
    // Load from localStorage if exists
    const saved = localStorage.getItem('callnfy_onboarding');
    return saved ? JSON.parse(saved) : {};
  });

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('callnfy_onboarding', JSON.stringify(onboardingData));
  }, [onboardingData]);

  const updateData = (stepData) => {
    setOnboardingData(prev => ({ ...prev, ...stepData }));
  };

  const handleNext = (stepData) => {
    if (stepData) {
      updateData(stepData);
    }

    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleSkip = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    }
  };

  const handleFinish = () => {
    // Mark onboarding as complete
    const userData = JSON.parse(localStorage.getItem('callnfy_user') || '{}');
    userData.onboardingComplete = true;
    localStorage.setItem('callnfy_user', JSON.stringify(userData));

    // Clear onboarding data
    localStorage.removeItem('callnfy_onboarding');

    // Redirect to dashboard
    navigate('/dashboard');
  };

  const CurrentStepComponent = STEPS[currentStep - 1].component;
  const canSkip = STEPS[currentStep - 1].canSkip;

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Phone className="w-6 h-6 text-blue-500" />
            <span className="text-xl font-bold text-white">Callnfy</span>
          </div>
          <span className="text-sm text-gray-400">
            Step {currentStep} of {STEPS.length}
          </span>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="bg-gray-900 border-b border-gray-800 px-6 py-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between">
            {STEPS.map((step, index) => (
              <div key={step.id} className="flex items-center flex-1">
                {/* Step Circle */}
                <div className="flex flex-col items-center">
                  <div
                    className={`
                      w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all
                      ${
                        step.id < currentStep
                          ? 'bg-blue-600 text-white'
                          : step.id === currentStep
                          ? 'bg-blue-600 text-white ring-4 ring-blue-600/30'
                          : 'bg-gray-800 text-gray-500 border-2 border-gray-700'
                      }
                    `}
                  >
                    {step.id < currentStep ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      step.id
                    )}
                  </div>
                  <span
                    className={`
                      mt-2 text-xs font-medium hidden sm:block
                      ${step.id <= currentStep ? 'text-white' : 'text-gray-500'}
                    `}
                  >
                    {step.name}
                  </span>
                </div>

                {/* Connector Line */}
                {index < STEPS.length - 1 && (
                  <div
                    className={`
                      flex-1 h-1 mx-2 rounded transition-all
                      ${step.id < currentStep ? 'bg-blue-600' : 'bg-gray-800'}
                    `}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="px-6 py-8">
        <div className="max-w-2xl mx-auto">
          <CurrentStepComponent
            data={onboardingData}
            onNext={handleNext}
            onBack={handleBack}
            onSkip={canSkip ? handleSkip : null}
            onFinish={handleFinish}
            isFirstStep={currentStep === 1}
            isLastStep={currentStep === STEPS.length}
          />
        </div>
      </main>
    </div>
  );
}
