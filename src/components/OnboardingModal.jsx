import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Check, ChevronRight, Phone, Calendar, Loader2, Copy, Star, Play } from 'lucide-react';
import { useConnectGoogleCalendarMutation } from '../slices/apiSlice/integrationsApiSlice';
import {
  useGetOnboardingStatusQuery,
  useSaveOnboardingBusinessMutation,
  useCreateOnboardingSubscriptionMutation,
  useGetAssignedPhoneNumberQuery,
  useSaveOnboardingAssistantMutation,
  useInitiateOnboardingTestCallMutation,
  useCompleteOnboardingMutation,
} from '../slices/apiSlice/onboardingApiSlice';
import { PLANS, COUNTRIES } from '../constants/plans';

// Industry options
const INDUSTRIES = [
  { value: 'hair_salon', label: 'Hair Salon' },
  { value: 'beauty_salon', label: 'Beauty Salon' },
  { value: 'spa', label: 'Spa & Wellness' },
  { value: 'clinic', label: 'Medical Clinic' },
  { value: 'dental', label: 'Dental Office' },
  { value: 'hotel', label: 'Hotel' },
  { value: 'restaurant', label: 'Restaurant' },
  { value: 'plumber', label: 'Plumbing Services' },
  { value: 'electrician', label: 'Electrical Services' },
  { value: 'hvac', label: 'HVAC Services' },
  { value: 'real_estate', label: 'Real Estate' },
  { value: 'law_firm', label: 'Law Firm' },
  { value: 'accounting', label: 'Accounting Firm' },
  { value: 'other', label: 'Other' },
];

// Voice options
const VOICE_OPTIONS = [
  { value: 'jennifer-playht', label: 'Jennifer (Female - US)', provider: 'vapi' },
  { value: 'melissa-playht', label: 'Melissa (Female - US)', provider: 'vapi' },
  { value: 'emma-british', label: 'Emma (Female - British)', provider: 'vapi' },
  { value: 'will-playht', label: 'Will (Male - US)', provider: 'vapi' },
  { value: 'chris-playht', label: 'Chris (Male - US)', provider: 'vapi' },
  { value: 'james-british', label: 'James (Male - British)', provider: 'vapi' },
  { value: 'nova', label: 'Nova (Female)', provider: 'openai' },
  { value: 'shimmer', label: 'Shimmer (Female)', provider: 'openai' },
  { value: 'echo', label: 'Echo (Male)', provider: 'openai' },
  { value: 'alloy', label: 'Alloy (Neutral)', provider: 'openai' },
];

const TOTAL_STEPS = 7;

export default function OnboardingModal({ onComplete }) {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState({});

  // Step 1: Business Info
  const [businessName, setBusinessName] = useState('');
  const [industry, setIndustry] = useState('');
  const [country, setCountry] = useState('US');
  const [businessId, setBusinessId] = useState(null);

  // Step 2: Plan Selection
  const [selectedPlan, setSelectedPlan] = useState('pro');
  const [billingPeriod, setBillingPeriod] = useState('monthly');

  // Step 4: Assistant Setup
  const [assistantName, setAssistantName] = useState('Sarah');
  const [selectedVoice, setSelectedVoice] = useState('jennifer-playht');
  const [greetingMessage, setGreetingMessage] = useState('');
  const [services, setServices] = useState('');
  const [workingHours, setWorkingHours] = useState('Mon-Fri: 9am-5pm');

  // Step 6: Test Call
  const [testPhoneNumber, setTestPhoneNumber] = useState('');
  const [isTestingCall, setIsTestingCall] = useState(false);
  const [callInProgress, setCallInProgress] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  // Fetch onboarding status from backend
  const {
    data: onboardingStatus,
    isLoading: isLoadingStatus,
    refetch: refetchStatus
  } = useGetOnboardingStatusQuery();

  // Fetch assigned phone number (for Step 3)
  const {
    data: assignedPhone,
    refetch: refetchPhone
  } = useGetAssignedPhoneNumberQuery(undefined, {
    skip: currentStep < 3,
  });

  // API Mutations
  const [saveBusiness, { isLoading: isSavingBusiness }] = useSaveOnboardingBusinessMutation();
  const [createSubscription, { isLoading: isCreatingSubscription }] = useCreateOnboardingSubscriptionMutation();
  const [saveAssistant, { isLoading: isSavingAssistant }] = useSaveOnboardingAssistantMutation();
  const [connectGoogleCalendar, { isLoading: isConnectingCalendar }] = useConnectGoogleCalendarMutation();
  const [initiateTestCall] = useInitiateOnboardingTestCallMutation();
  const [completeOnboarding, { isLoading: isCompletingOnboarding }] = useCompleteOnboardingMutation();

  // Handle Stripe Checkout success callback
  useEffect(() => {
    const checkoutSuccess = searchParams.get('checkout');
    const googleParam = searchParams.get('google');
    const errorParam = searchParams.get('error');

    if (checkoutSuccess === 'success') {
      // User returned from Stripe Checkout - move to Step 3
      toast.success('Payment setup complete!');
      searchParams.delete('checkout');
      setSearchParams(searchParams, { replace: true });
      setCurrentStep(3);
      refetchStatus();
      refetchPhone();
    } else if (googleParam === 'success') {
      toast.success('Google Calendar connected!');
      searchParams.delete('google');
      setSearchParams(searchParams, { replace: true });
      refetchStatus();
    } else if (errorParam) {
      toast.error(`Error: ${errorParam}`);
      searchParams.delete('error');
      setSearchParams(searchParams, { replace: true });
    }
  }, [searchParams, setSearchParams, refetchStatus, refetchPhone]);

  // Set current step based on onboarding status
  useEffect(() => {
    if (onboardingStatus) {
      const nextStep = onboardingStatus.nextStep || 1;
      setCurrentStep(nextStep);

      // Pre-fill business name and ID if available
      if (onboardingStatus.businessName) {
        setBusinessName(onboardingStatus.businessName);
      }
      if (onboardingStatus.businessId) {
        setBusinessId(onboardingStatus.businessId);
      }
    }
  }, [onboardingStatus]);

  // Update greeting when business name or assistant name changes
  useEffect(() => {
    if (businessName && assistantName) {
      setGreetingMessage(`Thanks for calling ${businessName}! I'm ${assistantName}, your virtual assistant. How can I help you today?`);
    }
  }, [businessName, assistantName]);

  // Validation
  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!businessName.trim()) newErrors.businessName = 'Business name is required';
      if (!country) newErrors.country = 'Country is required';
    }

    if (step === 4) {
      if (!assistantName.trim()) newErrors.assistantName = 'Assistant name is required';
      if (!greetingMessage.trim()) newErrors.greetingMessage = 'Greeting message is required';
    }

    if (step === 6) {
      if (!testPhoneNumber.trim()) newErrors.testPhoneNumber = 'Phone number is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Step 1: Save Business Info
  const handleSaveBusiness = async () => {
    if (!validateStep(1)) return;

    try {
      const response = await saveBusiness({
        businessName: businessName.trim(),
        industry: industry || undefined,
        country,
      }).unwrap();

      // Store the businessId from the response
      const newBusinessId = response?.id || response?.business?.id || response?.businessId;
      if (newBusinessId) {
        setBusinessId(newBusinessId);
      }

      toast.success('Business info saved!');
      const result = await refetchStatus();
      if (result.data) {
        // Also update businessId from status if available
        if (result.data.businessId) {
          setBusinessId(result.data.businessId);
        }
        setCurrentStep(result.data.nextStep || 2);
      } else {
        setCurrentStep(2);
      }
    } catch (err) {
      toast.error(err?.data?.error?.message || err?.data?.message || 'Failed to save business info');
    }
  };

  // Step 2: Create Subscription (redirect to Stripe Checkout)
  const handleStartTrial = async () => {
    // Get businessId from state or onboardingStatus
    const currentBusinessId = businessId || onboardingStatus?.businessId;
    if (!currentBusinessId) {
      toast.error('Business not found. Please go back and create a business first.');
      return;
    }

    try {
      const result = await createSubscription({
        businessId: currentBusinessId,
        plan: selectedPlan,
        billingPeriod,
      }).unwrap();

      // Backend returns Stripe Checkout URL
      if (result?.url || result?.checkoutUrl) {
        window.location.href = result.url || result.checkoutUrl;
      } else {
        toast.error('Failed to create checkout session');
      }
    } catch (err) {
      toast.error(err?.data?.error?.message || err?.data?.message || 'Failed to start trial');
    }
  };

  // Step 4: Save Assistant Config
  const handleSaveAssistant = async () => {
    if (!validateStep(4)) return;

    // Get businessId from state or onboardingStatus
    const currentBusinessId = businessId || onboardingStatus?.businessId;
    if (!currentBusinessId) {
      toast.error('Business not found. Please go back and create a business first.');
      return;
    }

    try {
      const voice = VOICE_OPTIONS.find(v => v.value === selectedVoice);
      await saveAssistant({
        businessId: currentBusinessId,
        name: assistantName.trim(),
        voiceId: selectedVoice,
        voiceProvider: voice?.provider || 'vapi',
        greeting: greetingMessage.trim(),
        services: services.trim(),
        workingHours: workingHours.trim(),
      }).unwrap();

      toast.success('Assistant configured!');
      const result = await refetchStatus();
      setCurrentStep(result.data?.nextStep || 5);
    } catch (err) {
      toast.error(err?.data?.error?.message || err?.data?.message || 'Failed to save assistant');
    }
  };

  // Step 5: Connect Calendar
  const handleConnectCalendar = async () => {
    const currentBusinessId = businessId || onboardingStatus?.businessId;
    if (!currentBusinessId) {
      toast.error('Business not found');
      return;
    }

    try {
      const result = await connectGoogleCalendar({ businessId: currentBusinessId, source: 'onboarding' }).unwrap();
      const authUrl = result?.data?.authUrl || result?.authUrl;
      if (authUrl) window.location.href = authUrl;
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to connect calendar');
    }
  };

  // Step 6: Test Call
  const handleTestCall = async () => {
    if (!validateStep(6)) return;

    // Get businessId from state or onboardingStatus
    const currentBusinessId = businessId || onboardingStatus?.businessId;
    if (!currentBusinessId) {
      toast.error('Business not found');
      return;
    }

    setIsTestingCall(true);
    setCallInProgress(true);

    try {
      await initiateTestCall({
        businessId: currentBusinessId,
        phoneNumber: testPhoneNumber.trim(),
      }).unwrap();
      toast.success('Calling you now!');

      // Simulate call duration then show feedback
      setTimeout(() => {
        setCallInProgress(false);
        setShowFeedback(true);
      }, 10000);
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to initiate call');
      setIsTestingCall(false);
      setCallInProgress(false);
    }
  };

  const handleFeedback = (feedback) => {
    if (feedback === 'perfect') {
      setCurrentStep(7);
    } else {
      // Go back to assistant setup
      setCurrentStep(4);
      setShowFeedback(false);
      setIsTestingCall(false);
    }
  };

  // Step 7: Complete Onboarding
  const handleFinish = async () => {
    try {
      await completeOnboarding().unwrap();
      toast.success('Welcome to Callnfy!');
    } catch (err) {
      console.error('Failed to complete onboarding:', err);
      toast.error('Could not save progress, but you can continue');
    } finally {
      if (onComplete) {
        onComplete();
      }
    }
  };

  // Copy phone number to clipboard
  const handleCopyNumber = () => {
    const number = assignedPhone?.phoneNumber || assignedPhone?.number;
    if (number) {
      navigator.clipboard.writeText(number);
      toast.success('Phone number copied!');
    }
  };

  // Format phone number for forwarding code
  const getForwardingCode = () => {
    const number = assignedPhone?.phoneNumber || assignedPhone?.number || '';
    const cleanNumber = number.replace(/\s/g, '').replace(/-/g, '');
    return `*21${cleanNumber}#`;
  };

  const isLoading = isSavingBusiness || isCreatingSubscription || isSavingAssistant || isConnectingCalendar || isCompletingOnboarding;

  // Loading state
  if (isLoadingStatus) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-[#1a1a1d] rounded-lg border border-[#303030] p-6">
          <Loader2 className="w-6 h-6 text-gray-400 animate-spin mx-auto" />
        </div>
      </div>
    );
  }

  const { hasBusiness, hasSubscription, hasPhoneNumber, hasAssistant, hasCalendarConnected } = onboardingStatus || {};
  const phoneNumber = assignedPhone?.phoneNumber || assignedPhone?.number;
  const planInfo = PLANS[selectedPlan];
  const yearlyDiscount = planInfo ? Math.round((planInfo.monthlyPrice * 12 - planInfo.yearlyPrice) / planInfo.monthlyPrice) : 2;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#1a1a1d] rounded-lg border border-[#303030] w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Step Indicator */}
        <div className="p-4 border-b border-[#303030]">
          <div className="flex items-center justify-center gap-2">
            {Array.from({ length: TOTAL_STEPS }, (_, i) => i + 1).map((step, idx) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                    currentStep > step
                      ? 'bg-white text-black'
                      : currentStep === step
                      ? 'bg-white text-black'
                      : 'bg-white/10 text-white/40'
                  }`}
                >
                  {currentStep > step ? <Check className="w-4 h-4" /> : step}
                </div>
                {idx < TOTAL_STEPS - 1 && (
                  <div className={`w-6 h-0.5 mx-1 ${currentStep > step ? 'bg-white' : 'bg-white/10'}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Step 1: Business Info */}
          {currentStep === 1 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-lg font-semibold text-white">Tell us about your business</h2>
                <p className="text-sm text-white/40 mt-1">This helps us personalize your experience</p>
              </div>

              {hasBusiness ? (
                <div className="bg-[#111114] border border-[#303030] rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-500" />
                    <div>
                      <p className="text-white font-medium">Business already set up</p>
                      <p className="text-white/40 text-sm">You can proceed to the next step</p>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <div>
                    <label className="block text-sm text-white/60 mb-1.5">
                      Business Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      placeholder="e.g., Dave's Plumbing"
                      className={`w-full bg-[#111114] border ${errors.businessName ? 'border-red-500' : 'border-[#303030]'} rounded-lg px-3 py-2.5 text-white placeholder:text-white/30 focus:border-white/40 focus:outline-none`}
                      disabled={isLoading}
                      autoFocus
                    />
                    {errors.businessName && <p className="text-red-400 text-xs mt-1">{errors.businessName}</p>}
                  </div>

                  <div>
                    <label className="block text-sm text-white/60 mb-1.5">Industry</label>
                    <select
                      value={industry}
                      onChange={(e) => setIndustry(e.target.value)}
                      className="w-full bg-[#111114] border border-[#303030] rounded-lg px-3 py-2.5 text-white focus:border-white/40 focus:outline-none"
                      disabled={isLoading}
                    >
                      <option value="">Select industry</option>
                      {INDUSTRIES.map((ind) => (
                        <option key={ind.value} value={ind.value}>{ind.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm text-white/60 mb-1.5">
                      Country <span className="text-red-400">*</span>
                    </label>
                    <select
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className={`w-full bg-[#111114] border ${errors.country ? 'border-red-500' : 'border-[#303030]'} rounded-lg px-3 py-2.5 text-white focus:border-white/40 focus:outline-none`}
                      disabled={isLoading}
                    >
                      {COUNTRIES.map((c) => (
                        <option key={c.code} value={c.code}>{c.flag} {c.name}</option>
                      ))}
                    </select>
                    {errors.country && <p className="text-red-400 text-xs mt-1">{errors.country}</p>}
                  </div>
                </>
              )}

              <div className="pt-3">
                <button
                  onClick={hasBusiness ? () => setCurrentStep(2) : handleSaveBusiness}
                  disabled={isLoading}
                  className="w-full bg-white text-black text-sm font-medium py-2.5 px-3 rounded-lg hover:bg-white/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSavingBusiness ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  {hasBusiness ? 'Continue' : 'Next'}
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Choose Plan & Payment */}
          {currentStep === 2 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-lg font-semibold text-white">Choose your plan</h2>
                <p className="text-sm text-white/40 mt-1">Start with a 7-day free trial</p>
              </div>

              {hasSubscription ? (
                <div className="bg-[#111114] border border-[#303030] rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-500" />
                    <div>
                      <p className="text-white font-medium">Subscription active</p>
                      <p className="text-white/40 text-sm">You can proceed to the next step</p>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  {/* Plan Cards */}
                  <div className="grid grid-cols-2 gap-3">
                    {Object.values(PLANS).map((plan) => (
                      <button
                        key={plan.id}
                        onClick={() => setSelectedPlan(plan.id)}
                        className={`relative text-left p-4 rounded-lg border transition-all ${
                          selectedPlan === plan.id
                            ? 'bg-white/5 border-white'
                            : 'bg-[#111114] border-[#303030] hover:border-white/30'
                        }`}
                      >
                        {plan.recommended && (
                          <div className="absolute -top-2 -right-2 bg-white text-black text-xs font-medium px-2 py-0.5 rounded-full flex items-center gap-1">
                            <Star className="w-3 h-3" fill="currentColor" />
                            Best
                          </div>
                        )}
                        <p className="text-white font-semibold">{plan.name}</p>
                        <p className="text-white/60 text-sm mt-1">
                          ${billingPeriod === 'yearly' ? Math.round(plan.yearlyPrice / 12) : plan.monthlyPrice}/mo
                        </p>
                        <ul className="mt-3 space-y-1.5">
                          {plan.features.map((feature, idx) => (
                            <li key={idx} className="flex items-center gap-2 text-xs text-white/60">
                              <Check className="w-3 h-3 text-green-500" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                        <div className="mt-3 pt-3 border-t border-[#303030]">
                          <div className={`w-full py-1.5 rounded text-center text-xs font-medium ${
                            selectedPlan === plan.id
                              ? 'bg-white text-black'
                              : 'bg-white/10 text-white'
                          }`}>
                            {selectedPlan === plan.id ? 'Selected' : 'Select'}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Billing Period Toggle */}
                  <div className="bg-[#111114] border border-[#303030] rounded-lg p-3">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={billingPeriod === 'yearly'}
                        onChange={(e) => setBillingPeriod(e.target.checked ? 'yearly' : 'monthly')}
                        className="w-4 h-4 rounded border-[#303030] bg-[#1a1a1d] text-white focus:ring-0 focus:ring-offset-0"
                      />
                      <div className="flex-1">
                        <p className="text-white text-sm font-medium">Pay yearly (save {yearlyDiscount} months)</p>
                        <p className="text-white/40 text-xs">
                          {PLANS.starter.name}: ${PLANS.starter.yearlyPrice}/yr | {PLANS.pro.name}: ${PLANS.pro.yearlyPrice}/yr
                        </p>
                      </div>
                    </label>
                  </div>

                  {/* Trial Notice */}
                  <div className="text-center text-white/40 text-xs">
                    <p>You won't be charged until day 8.</p>
                    <p>Cancel anytime during your 7-day trial.</p>
                  </div>
                </>
              )}

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setCurrentStep(1)}
                  disabled={isLoading}
                  className="flex-1 bg-white/10 text-white text-sm border border-white/20 font-medium py-2.5 px-3 rounded-lg hover:bg-white/20 transition-colors disabled:opacity-50"
                >
                  Back
                </button>
                <button
                  onClick={hasSubscription ? () => setCurrentStep(3) : handleStartTrial}
                  disabled={isLoading}
                  className="flex-[2] bg-white text-black text-sm font-medium py-2.5 px-3 rounded-lg hover:bg-white/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isCreatingSubscription ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  {hasSubscription ? 'Continue' : 'Start 7-Day Free Trial'}
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Your AI Number */}
          {currentStep === 3 && (
            <div className="space-y-5">
              <div className="text-center">
                <div className="text-4xl mb-2">&#127881;</div>
                <h2 className="text-lg font-semibold text-white">Your AI Receptionist is Ready!</h2>
                <p className="text-sm text-white/40 mt-1">Your phone number has been assigned</p>
              </div>

              {/* Phone Number Display */}
              <div className="bg-[#111114] border border-[#303030] rounded-lg p-6 text-center">
                <p className="text-white/40 text-sm mb-2">Your phone number:</p>
                <p className="text-2xl font-bold text-white tracking-wide">
                  {phoneNumber || 'Loading...'}
                </p>
              </div>

              {/* Forwarding Instructions */}
              <div className="bg-[#111114] border border-[#303030] rounded-lg p-4 space-y-3">
                <p className="text-white font-medium text-sm">Forward your calls to this number:</p>
                <div className="space-y-2">
                  <div>
                    <p className="text-white/40 text-xs">From your phone, dial:</p>
                    <p className="text-white font-mono text-sm">{getForwardingCode()}</p>
                  </div>
                  <div>
                    <p className="text-white/40 text-xs">To deactivate later:</p>
                    <p className="text-white font-mono text-sm">##21#</p>
                  </div>
                </div>
              </div>

              {/* Copy Button */}
              <button
                onClick={handleCopyNumber}
                className="w-full flex items-center justify-center gap-2 py-2 text-white/60 hover:text-white text-sm transition-colors"
              >
                <Copy className="w-4 h-4" />
                Copy number
              </button>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setCurrentStep(2)}
                  disabled={isLoading}
                  className="flex-1 bg-white/10 text-white text-sm border border-white/20 font-medium py-2.5 px-3 rounded-lg hover:bg-white/20 transition-colors disabled:opacity-50"
                >
                  Back
                </button>
                <button
                  onClick={() => setCurrentStep(4)}
                  className="flex-[2] bg-white text-black text-sm font-medium py-2.5 px-3 rounded-lg hover:bg-white/90 transition-colors flex items-center justify-center gap-2"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Assistant Setup */}
          {currentStep === 4 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-lg font-semibold text-white">Customize your AI Assistant</h2>
                <p className="text-sm text-white/40 mt-1">Configure how your assistant sounds and behaves</p>
              </div>

              {hasAssistant ? (
                <div className="bg-[#111114] border border-[#303030] rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-500" />
                    <div>
                      <p className="text-white font-medium">Assistant already configured</p>
                      <p className="text-white/40 text-sm">You can proceed or update settings</p>
                    </div>
                  </div>
                </div>
              ) : null}

              <div>
                <label className="block text-sm text-white/60 mb-1.5">
                  Assistant Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={assistantName}
                  onChange={(e) => setAssistantName(e.target.value)}
                  placeholder="e.g., Sarah"
                  className={`w-full bg-[#111114] border ${errors.assistantName ? 'border-red-500' : 'border-[#303030]'} rounded-lg px-3 py-2.5 text-white placeholder:text-white/30 focus:border-white/40 focus:outline-none`}
                  disabled={isLoading}
                />
                {errors.assistantName && <p className="text-red-400 text-xs mt-1">{errors.assistantName}</p>}
              </div>

              <div>
                <label className="block text-sm text-white/60 mb-1.5">Voice</label>
                <div className="flex gap-2">
                  <select
                    value={selectedVoice}
                    onChange={(e) => setSelectedVoice(e.target.value)}
                    className="flex-1 bg-[#111114] border border-[#303030] rounded-lg px-3 py-2.5 text-white focus:border-white/40 focus:outline-none"
                    disabled={isLoading}
                  >
                    {VOICE_OPTIONS.map((v) => (
                      <option key={v.value} value={v.value}>{v.label}</option>
                    ))}
                  </select>
                  <button
                    className="bg-[#111114] border border-[#303030] rounded-lg px-3 py-2.5 text-white/60 hover:text-white hover:border-white/40 transition-colors flex items-center gap-2"
                    title="Preview voice"
                  >
                    <Play className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm text-white/60 mb-1.5">
                  Greeting Message <span className="text-red-400">*</span>
                </label>
                <textarea
                  value={greetingMessage}
                  onChange={(e) => setGreetingMessage(e.target.value)}
                  rows={3}
                  className={`w-full bg-[#111114] border ${errors.greetingMessage ? 'border-red-500' : 'border-[#303030]'} rounded-lg px-3 py-2.5 text-white placeholder:text-white/30 focus:border-white/40 focus:outline-none resize-none`}
                  disabled={isLoading}
                />
                {errors.greetingMessage && <p className="text-red-400 text-xs mt-1">{errors.greetingMessage}</p>}
              </div>

              <div>
                <label className="block text-sm text-white/60 mb-1.5">Services (comma separated)</label>
                <input
                  type="text"
                  value={services}
                  onChange={(e) => setServices(e.target.value)}
                  placeholder="e.g., Emergency repairs, Installations, Maintenance"
                  className="w-full bg-[#111114] border border-[#303030] rounded-lg px-3 py-2.5 text-white placeholder:text-white/30 focus:border-white/40 focus:outline-none"
                  disabled={isLoading}
                />
              </div>

              <div>
                <label className="block text-sm text-white/60 mb-1.5">Working Hours</label>
                <input
                  type="text"
                  value={workingHours}
                  onChange={(e) => setWorkingHours(e.target.value)}
                  placeholder="e.g., Mon-Fri: 8am-6pm, Sat: 9am-2pm"
                  className="w-full bg-[#111114] border border-[#303030] rounded-lg px-3 py-2.5 text-white placeholder:text-white/30 focus:border-white/40 focus:outline-none"
                  disabled={isLoading}
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setCurrentStep(3)}
                  disabled={isLoading}
                  className="flex-1 bg-white/10 text-white text-sm border border-white/20 font-medium py-2.5 px-3 rounded-lg hover:bg-white/20 transition-colors disabled:opacity-50"
                >
                  Back
                </button>
                <button
                  onClick={handleSaveAssistant}
                  disabled={isLoading}
                  className="flex-[2] bg-white text-black text-sm font-medium py-2.5 px-3 rounded-lg hover:bg-white/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSavingAssistant ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Step 5: Google Calendar */}
          {currentStep === 5 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-lg font-semibold text-white">Connect Google Calendar</h2>
                <p className="text-sm text-white/40 mt-1">Let your AI automatically book appointments</p>
              </div>

              <div className="bg-[#111114] border border-[#303030] rounded-lg p-6 text-center">
                {hasCalendarConnected ? (
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
                      <Check className="w-5 h-5 text-white" />
                    </div>
                    <div className="text-left">
                      <p className="text-white font-medium">Google Calendar Connected</p>
                      <p className="text-white/40 text-sm">Your calendar is synced</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <Calendar className="w-12 h-12 text-white/40 mx-auto mb-4" />
                    <p className="text-white font-medium mb-1">Connect Google Calendar</p>
                    <p className="text-white/40 text-sm mb-4">Check availability and book appointments automatically</p>
                    <button
                      onClick={handleConnectCalendar}
                      disabled={isConnectingCalendar}
                      className="bg-white text-black text-sm font-medium py-2.5 px-4 rounded-lg hover:bg-white/90 transition-colors disabled:opacity-50 inline-flex items-center gap-2"
                    >
                      {isConnectingCalendar ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                        <svg className="w-4 h-4" viewBox="0 0 24 24">
                          <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                          <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        </svg>
                      )}
                      Connect Google Calendar
                    </button>
                  </>
                )}
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setCurrentStep(4)}
                  disabled={isLoading}
                  className="flex-1 bg-white/10 text-white text-sm border border-white/20 font-medium py-2.5 px-3 rounded-lg hover:bg-white/20 transition-colors disabled:opacity-50"
                >
                  Back
                </button>
                {!hasCalendarConnected && (
                  <button
                    onClick={() => setCurrentStep(6)}
                    className="bg-white/10 text-white/60 text-sm border border-white/20 font-medium py-2.5 px-3 rounded-lg hover:bg-white/20 transition-colors"
                  >
                    Skip for now
                  </button>
                )}
                <button
                  onClick={() => setCurrentStep(6)}
                  className="flex-1 bg-white text-black text-sm font-medium py-2.5 px-3 rounded-lg hover:bg-white/90 transition-colors flex items-center justify-center gap-2"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Step 6: Test Call */}
          {currentStep === 6 && (
            <div className="space-y-5">
              {!isTestingCall ? (
                <>
                  <div className="text-center">
                    <Phone className="w-12 h-12 text-white/40 mx-auto mb-3" />
                    <h2 className="text-lg font-semibold text-white">Test your AI Receptionist</h2>
                    <p className="text-sm text-white/40 mt-1">
                      We'll call you so you can experience your AI receptionist firsthand.
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm text-white/60 mb-1.5">Your phone number</label>
                    <input
                      type="tel"
                      value={testPhoneNumber}
                      onChange={(e) => setTestPhoneNumber(e.target.value)}
                      placeholder="+1 (555) 123-4567"
                      className={`w-full bg-[#111114] border ${errors.testPhoneNumber ? 'border-red-500' : 'border-[#303030]'} rounded-lg px-3 py-2.5 text-white placeholder:text-white/30 focus:border-white/40 focus:outline-none`}
                    />
                    {errors.testPhoneNumber && <p className="text-red-400 text-xs mt-1">{errors.testPhoneNumber}</p>}
                  </div>

                  <button
                    onClick={handleTestCall}
                    disabled={!testPhoneNumber.trim()}
                    className="w-full bg-white text-black text-sm font-medium py-2.5 px-3 rounded-lg hover:bg-white/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <Phone className="w-4 h-4" />
                    Call me now
                  </button>

                  <button
                    onClick={() => setCurrentStep(7)}
                    className="w-full text-white/40 text-sm hover:text-white/60 transition-colors"
                  >
                    Skip test call
                  </button>
                </>
              ) : callInProgress ? (
                <div className="text-center py-8">
                  <div className="relative w-20 h-20 mx-auto mb-4">
                    <div className="absolute inset-0 bg-white/10 rounded-full animate-ping" />
                    <div className="relative w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
                      <Phone className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <h2 className="text-lg font-semibold text-white">Calling you now...</h2>
                  <p className="text-sm text-white/40 mt-2">Answer your phone and talk to your AI receptionist!</p>
                </div>
              ) : showFeedback ? (
                <div className="text-center">
                  <h2 className="text-lg font-semibold text-white mb-2">How was your experience?</h2>
                  <div className="grid grid-cols-2 gap-3 mt-4">
                    <button
                      onClick={() => handleFeedback('perfect')}
                      className="bg-[#111114] border border-[#303030] rounded-lg p-6 hover:border-white/40 transition-colors"
                    >
                      <div className="text-3xl mb-2">&#128525;</div>
                      <p className="text-white font-medium">Perfect!</p>
                    </button>
                    <button
                      onClick={() => handleFeedback('adjust')}
                      className="bg-[#111114] border border-[#303030] rounded-lg p-6 hover:border-white/40 transition-colors"
                    >
                      <div className="text-3xl mb-2">&#128295;</div>
                      <p className="text-white font-medium">Adjust settings</p>
                    </button>
                  </div>
                </div>
              ) : null}

              {!isTestingCall && (
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentStep(5)}
                    className="flex-1 bg-white/10 text-white text-sm border border-white/20 font-medium py-2.5 px-3 rounded-lg hover:bg-white/20 transition-colors"
                  >
                    Back
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Step 7: Complete */}
          {currentStep === 7 && (
            <div className="space-y-5">
              <div className="text-center">
                <div className="text-4xl mb-3">&#127881;</div>
                <h2 className="text-lg font-semibold text-white">You're all set!</h2>
                <p className="text-sm text-white/40 mt-1">Your AI receptionist is ready to answer calls 24/7.</p>
              </div>

              {/* Summary */}
              <div className="bg-[#111114] border border-[#303030] rounded-lg p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-white/40" />
                  <span className="text-white/60 text-sm">Number:</span>
                  <span className="text-white text-sm ml-auto font-medium">{phoneNumber || 'Not assigned'}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Star className="w-4 h-4 text-white/40" />
                  <span className="text-white/60 text-sm">Plan:</span>
                  <span className="text-white text-sm ml-auto font-medium">
                    {PLANS[selectedPlan]?.name || 'Pro'} (7-day trial)
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 flex items-center justify-center text-white/40">&#9200;</div>
                  <span className="text-white/60 text-sm">Minutes:</span>
                  <span className="text-white text-sm ml-auto font-medium">
                    0/{PLANS[selectedPlan]?.minutes || 300} used
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 flex items-center justify-center text-white/40">&#129302;</div>
                  <span className="text-white/60 text-sm">Assistant:</span>
                  <span className="text-white text-sm ml-auto font-medium">{assistantName}</span>
                </div>
              </div>

              {/* Forwarding Reminder */}
              <div className="bg-[#111114] border border-[#303030] rounded-lg p-4">
                <p className="text-white/60 text-sm mb-2">Don't forget to forward your calls!</p>
                <p className="text-white font-mono text-sm">Dial: {getForwardingCode()}</p>
              </div>

              <button
                onClick={handleFinish}
                disabled={isCompletingOnboarding}
                className="w-full bg-white text-black text-sm font-medium py-2.5 px-3 rounded-lg hover:bg-white/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isCompletingOnboarding ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                Go to Dashboard
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
