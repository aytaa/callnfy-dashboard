import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Check, ChevronRight, Phone, Calendar, Building2, Bot, Loader2 } from 'lucide-react';
import { useCreateBusinessMutation, useGetBusinessesQuery } from '../slices/apiSlice/businessApiSlice';
import { useCreateAssistantMutation, useGetAssistantQuery } from '../slices/apiSlice/assistantApiSlice';
import { usePurchasePhoneNumberMutation, useGetPhoneNumbersQuery } from '../slices/apiSlice/phoneApiSlice';
import { useConnectGoogleCalendarMutation, useGetIntegrationStatusQuery } from '../slices/apiSlice/integrationsApiSlice';
import { useTestCallMutation } from '../slices/apiSlice/callsApiSlice';
import { useUpdateUserOnboardingMutation } from '../slices/apiSlice/authApiSlice';

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

// Greeting templates by industry
const GREETING_TEMPLATES = {
  hair_salon: "Hello! Thank you for calling {business}. I'm {assistant}, your virtual assistant. How can I help you today?",
  beauty_salon: "Hi there! Welcome to {business}. I'm {assistant}. Are you looking to schedule a treatment?",
  spa: "Welcome to {business}. I'm {assistant}. How may I help you relax today?",
  clinic: "Thank you for calling {business}. I'm {assistant}. How can I assist you today?",
  dental: "Hello! You've reached {business}. I'm {assistant}. Would you like to schedule an appointment?",
  hotel: "Welcome to {business}. I'm {assistant}, your virtual concierge. How may I assist you?",
  restaurant: "Thank you for calling {business}. I'm {assistant}. Would you like to make a reservation?",
  plumber: "Hello! You've reached {business}. I'm {assistant}. Do you need plumbing services?",
  electrician: "Thank you for calling {business}. I'm {assistant}. How can I help you today?",
  hvac: "Hello! This is {business}. I'm {assistant}. Are you calling about heating or cooling services?",
  real_estate: "Welcome to {business}. I'm {assistant}. Are you looking to buy, sell, or rent?",
  law_firm: "Thank you for calling {business}. I'm {assistant}. How may I direct your call?",
  accounting: "Hello! You've reached {business}. I'm {assistant}. How can I assist you?",
  other: "Hello! Thank you for calling {business}. I'm {assistant}. How can I help you today?",
  default: "Hello! Thank you for calling {business}. I'm {assistant}. How can I help you today?",
};

// Voice options
const VOICE_OPTIONS = [
  { value: 'jennifer-playht', label: 'Jennifer (Female)', provider: 'vapi' },
  { value: 'melissa-playht', label: 'Melissa (Female)', provider: 'vapi' },
  { value: 'will-playht', label: 'Will (Male)', provider: 'vapi' },
  { value: 'chris-playht', label: 'Chris (Male)', provider: 'vapi' },
  { value: 'nova', label: 'Nova (Female)', provider: 'openai' },
  { value: 'shimmer', label: 'Shimmer (Female)', provider: 'openai' },
  { value: 'echo', label: 'Echo (Male)', provider: 'openai' },
  { value: 'alloy', label: 'Alloy (Neutral)', provider: 'openai' },
];


// Carriers
const CARRIERS = [
  { value: 'att', label: 'AT&T' },
  { value: 'verizon', label: 'Verizon' },
  { value: 'tmobile', label: 'T-Mobile' },
  { value: 'other', label: 'Other' },
];

const TOTAL_STEPS = 5;

export default function OnboardingModal({ onComplete, initialUserData }) {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [isInitialized, setIsInitialized] = useState(false);

  // Saved IDs
  const [savedBusinessId, setSavedBusinessId] = useState(null);
  const [savedAssistantId, setSavedAssistantId] = useState(null);
  const [savedPhoneNumber, setSavedPhoneNumber] = useState(null);

  // Step 1: Business
  const [businessName, setBusinessName] = useState('');
  const [industry, setIndustry] = useState('');

  // Step 2: Assistant
  const [assistantName, setAssistantName] = useState('Sophie');
  const [selectedVoice, setSelectedVoice] = useState('jennifer-playht');
  const [greetingMessage, setGreetingMessage] = useState('');

  // Step 3: Phone
  const [phoneTab, setPhoneTab] = useState('new');
  const [areaCode, setAreaCode] = useState('');
  const [existingPhone, setExistingPhone] = useState('');
  const [carrier, setCarrier] = useState('');

  // Step 4: Calendar
  const [calendarConnected, setCalendarConnected] = useState(false);

  // Step 5: Test call
  const [testPhoneNumber, setTestPhoneNumber] = useState('');
  const [isTestingCall, setIsTestingCall] = useState(false);

  // API Mutations
  const [createBusiness, { isLoading: isCreatingBusiness }] = useCreateBusinessMutation();
  const [updateUserOnboarding, { isLoading: isUpdatingOnboarding }] = useUpdateUserOnboardingMutation();
  const [createAssistant, { isLoading: isCreatingAssistant }] = useCreateAssistantMutation();
  const [purchasePhoneNumber, { isLoading: isPurchasingNumber }] = usePurchasePhoneNumberMutation();
  const [connectGoogleCalendar, { isLoading: isConnectingCalendar }] = useConnectGoogleCalendarMutation();
  const [testCall] = useTestCallMutation();

  // Queries - NO useGetMeQuery, use initialUserData prop only
  const { data: businesses, isLoading: isLoadingBusinesses } = useGetBusinessesQuery();
  const { data: assistants } = useGetAssistantQuery();
  const { data: phoneNumbers } = useGetPhoneNumbersQuery({ page: 1, limit: 10 });
  const { data: integrationStatus } = useGetIntegrationStatusQuery(savedBusinessId, {
    skip: !savedBusinessId,
  });

  // Initialize from user's progress - use initialUserData prop only
  useEffect(() => {
    // Skip if already initialized or still loading businesses
    if (isInitialized || isLoadingBusinesses) return;
    // Skip if no initial user data from parent
    if (!initialUserData) return;

    const userStep = initialUserData?.onboardingStep || 1;
    setCurrentStep(userStep);

    if (businesses && businesses.length > 0) {
      const business = businesses[0];
      setSavedBusinessId(business.id);
      setBusinessName(business.name || '');
      setIndustry(business.industry || '');
    }

    if (assistants && assistants.length > 0) {
      const assistant = assistants[0];
      setSavedAssistantId(assistant.id);
      setAssistantName(assistant.name || 'Sophie');
    }

    if (phoneNumbers?.phoneNumbers?.length > 0) {
      const phone = phoneNumbers.phoneNumbers[0];
      setSavedPhoneNumber(phone.phoneNumber || phone.number);
    }

    setIsInitialized(true);
  }, [initialUserData, businesses, assistants, phoneNumbers, isLoadingBusinesses, isInitialized]);

  // Update greeting when industry/name changes
  useEffect(() => {
    const template = GREETING_TEMPLATES[industry] || GREETING_TEMPLATES.default;
    const message = template
      .replace('{business}', businessName || 'your business')
      .replace('{assistant}', assistantName || 'Sophie');
    setGreetingMessage(message);
  }, [industry, businessName, assistantName]);

  // Check calendar status
  useEffect(() => {
    if (integrationStatus?.googleCalendar?.connected) {
      setCalendarConnected(true);
    }
  }, [integrationStatus]);

  // Validation
  const validateStep = (step) => {
    const newErrors = {};
    if (step === 1 && !businessName.trim()) {
      newErrors.businessName = 'Business name is required';
    }
    if (step === 2) {
      if (!assistantName.trim()) newErrors.assistantName = 'Name is required';
      if (!greetingMessage.trim()) newErrors.greetingMessage = 'Greeting is required';
    }
    if (step === 3 && phoneTab === 'existing') {
      if (!existingPhone.trim()) newErrors.existingPhone = 'Phone is required';
      if (!carrier) newErrors.carrier = 'Carrier is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Step 1: Save Business
  const handleSaveBusiness = async () => {
    if (!validateStep(1)) return;
    try {
      const result = await createBusiness({
        name: businessName.trim(),
        industry: industry || undefined,
      }).unwrap();
      const id = result?.data?.business?.id || result?.business?.id || result?.id;
      setSavedBusinessId(id);
      toast.success('Business created!');
      setCurrentStep(2);
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to create business');
    }
  };

  // Step 2: Create Assistant
  const handleCreateAssistant = async () => {
    if (!validateStep(2)) return;
    try {
      const voice = VOICE_OPTIONS.find(v => v.value === selectedVoice);
      const result = await createAssistant({
        businessId: savedBusinessId,
        name: assistantName.trim(),
        firstMessage: greetingMessage.trim(),
        voice: { provider: voice?.provider || 'vapi', voiceId: selectedVoice },
        model: { provider: 'openai', model: 'gpt-4o-mini' },
        systemPrompt: `You are ${assistantName}, a helpful AI receptionist for ${businessName}. Be friendly and professional.`,
      }).unwrap();
      setSavedAssistantId(result?.data?.assistant?.id || result?.assistant?.id || result?.id);
      toast.success('Assistant created!');
      setCurrentStep(3);
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to create assistant');
    }
  };

  // Step 3: Phone
  const handleSavePhone = async () => {
    if (phoneTab === 'new') {
      // Validate area code
      if (!areaCode || areaCode.length !== 3) {
        toast.error('Please enter a valid 3-digit area code');
        return;
      }
      try {
        // Direct creation with area code - backend assigns the number
        const result = await purchasePhoneNumber({
          provider: 'vapi',
          areaCode,
          businessId: savedBusinessId,
          assistantId: savedAssistantId,
        }).unwrap();
        // Extract the assigned phone number from response
        const assignedNumber = result?.data?.phoneNumber?.phoneNumber ||
                               result?.phoneNumber?.phoneNumber ||
                               result?.phoneNumber ||
                               result?.number;
        setSavedPhoneNumber(assignedNumber);
        toast.success('Number created!');
      } catch (err) {
        const errorMessage = err?.data?.error?.details || err?.data?.error?.message || err?.data?.message || 'Failed to create number';
        toast.error(errorMessage);
        return;
      }
    } else if (phoneTab === 'existing') {
      if (!validateStep(3)) return;
      setSavedPhoneNumber(existingPhone);
    }
    setCurrentStep(4);
  };

  // Step 4: Calendar
  const handleConnectCalendar = async () => {
    try {
      const result = await connectGoogleCalendar(savedBusinessId).unwrap();
      const authUrl = result?.data?.authUrl || result?.authUrl;
      if (authUrl) window.location.href = authUrl;
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to connect calendar');
    }
  };

  const handleSkipCalendar = async () => {
    try {
      await updateUserOnboarding({ step: 4 }).unwrap();
    } catch {}
    setCurrentStep(5);
  };

  const handleContinueFromCalendar = async () => {
    try {
      await updateUserOnboarding({ step: 4 }).unwrap();
    } catch {}
    setCurrentStep(5);
  };

  // Step 5: Finish
  const handleTestCall = async () => {
    if (!testPhoneNumber.trim()) {
      toast.error('Enter your phone number');
      return;
    }
    setIsTestingCall(true);
    try {
      await testCall({ businessId: savedBusinessId, phoneNumber: testPhoneNumber.trim() }).unwrap();
      toast.success('Test call initiated!');
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to initiate call');
    } finally {
      setIsTestingCall(false);
    }
  };

  const handleFinish = async () => {
    try {
      await updateUserOnboarding({ step: 5, completed: true }).unwrap();
      toast.success('Welcome to Callnfy!');
    } catch (err) {
      // Log error but don't block - user completed onboarding steps
      console.error('Failed to update onboarding status:', err);
      toast.error('Could not save progress, but you can continue');
    } finally {
      // Always close modal - don't leave user stuck
      if (onComplete) {
        onComplete();
      } else {
        console.error('onComplete callback not provided');
      }
    }
  };

  const isLoading = isCreatingBusiness || isCreatingAssistant || isPurchasingNumber || isConnectingCalendar || isUpdatingOnboarding;

  // Loading state - only wait for businesses and initialization
  const showLoading = isLoadingBusinesses || !isInitialized;
  if (showLoading) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-[#1a1a1d] rounded-lg border border-[#303030] p-6">
          <Loader2 className="w-6 h-6 text-gray-400 animate-spin mx-auto" />
        </div>
      </div>
    );
  }

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
                  <div className={`w-8 h-0.5 mx-1 ${currentStep > step ? 'bg-white' : 'bg-white/10'}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Step 1: Business */}
          {currentStep === 1 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-lg font-semibold text-white">Tell us about your business</h2>
                <p className="text-sm text-white/40 mt-1">This helps us personalize your experience</p>
              </div>

              <div>
                <label className="block text-sm text-white/60 mb-1.5">
                  Business Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="e.g., Acme Salon"
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

              <div className="pt-3">
                <button
                  onClick={handleSaveBusiness}
                  disabled={isLoading}
                  className="w-full bg-white text-black text-sm font-medium py-1.5 px-3 rounded-lg hover:bg-white/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isCreatingBusiness ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Assistant */}
          {currentStep === 2 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-lg font-semibold text-white">Set up your AI assistant</h2>
                <p className="text-sm text-white/40 mt-1">Configure how your assistant sounds and behaves</p>
              </div>

              <div>
                <label className="block text-sm text-white/60 mb-1.5">
                  Assistant Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={assistantName}
                  onChange={(e) => setAssistantName(e.target.value)}
                  placeholder="e.g., Sophie"
                  className={`w-full bg-[#111114] border ${errors.assistantName ? 'border-red-500' : 'border-[#303030]'} rounded-lg px-3 py-2.5 text-white placeholder:text-white/30 focus:border-white/40 focus:outline-none`}
                  disabled={isLoading}
                />
                {errors.assistantName && <p className="text-red-400 text-xs mt-1">{errors.assistantName}</p>}
              </div>

              <div>
                <label className="block text-sm text-white/60 mb-1.5">Voice</label>
                <select
                  value={selectedVoice}
                  onChange={(e) => setSelectedVoice(e.target.value)}
                  className="w-full bg-[#111114] border border-[#303030] rounded-lg px-3 py-2.5 text-white focus:border-white/40 focus:outline-none"
                  disabled={isLoading}
                >
                  {VOICE_OPTIONS.map((v) => (
                    <option key={v.value} value={v.value}>{v.label}</option>
                  ))}
                </select>
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

              <div className="flex gap-2 pt-3">
                <button
                  onClick={() => setCurrentStep(1)}
                  disabled={isLoading}
                  className="flex-1 bg-white/10 text-white text-sm border border-white/20 font-medium py-1.5 px-3 rounded-lg hover:bg-white/20 transition-colors disabled:opacity-50"
                >
                  Back
                </button>
                <button
                  onClick={handleCreateAssistant}
                  disabled={isLoading}
                  className="flex-1 bg-white text-black text-sm font-medium py-1.5 px-3 rounded-lg hover:bg-white/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isCreatingAssistant ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Phone */}
          {currentStep === 3 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-lg font-semibold text-white">Get your business number</h2>
                <p className="text-sm text-white/40 mt-1">Choose how you want to receive calls</p>
              </div>

              {/* Tabs */}
              <div className="flex gap-2">
                <button
                  onClick={() => setPhoneTab('new')}
                  className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                    phoneTab === 'new' ? 'bg-white text-black' : 'bg-white/10 text-white/60 hover:bg-white/20'
                  }`}
                >
                  New number
                </button>
                <button
                  onClick={() => setPhoneTab('existing')}
                  className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                    phoneTab === 'existing' ? 'bg-white text-black' : 'bg-white/10 text-white/60 hover:bg-white/20'
                  }`}
                >
                  Use existing
                </button>
              </div>

              {phoneTab === 'new' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-white/60 mb-1.5">Area Code</label>
                    <input
                      type="text"
                      value={areaCode}
                      onChange={(e) => setAreaCode(e.target.value.replace(/\D/g, '').slice(0, 3))}
                      placeholder="e.g. 415, 212, 346"
                      className="w-full bg-[#111114] border border-[#303030] rounded-lg px-3 py-2.5 text-white placeholder:text-white/30 focus:border-white/40 focus:outline-none"
                    />
                  </div>

                  {/* Info Box */}
                  <div className="bg-[#111114] border border-[#303030] rounded-lg p-3">
                    <div className="flex items-start gap-2">
                      <Phone className="w-4 h-4 text-white/40 mt-0.5 flex-shrink-0" />
                      <div className="space-y-1">
                        <p className="text-xs text-white/60">Free US phone numbers</p>
                        <p className="text-xs text-white/40">Up to 10 per account • Instant setup</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {phoneTab === 'existing' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-white/60 mb-1.5">
                      Your Phone Number <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="tel"
                      value={existingPhone}
                      onChange={(e) => setExistingPhone(e.target.value)}
                      placeholder="+1 (555) 123-4567"
                      className={`w-full bg-[#111114] border ${errors.existingPhone ? 'border-red-500' : 'border-[#303030]'} rounded-lg px-3 py-2.5 text-white placeholder:text-white/30 focus:border-white/40 focus:outline-none`}
                    />
                    {errors.existingPhone && <p className="text-red-400 text-xs mt-1">{errors.existingPhone}</p>}
                  </div>

                  <div>
                    <label className="block text-sm text-white/60 mb-1.5">
                      Carrier <span className="text-red-400">*</span>
                    </label>
                    <select
                      value={carrier}
                      onChange={(e) => setCarrier(e.target.value)}
                      className={`w-full bg-[#111114] border ${errors.carrier ? 'border-red-500' : 'border-[#303030]'} rounded-lg px-3 py-2.5 text-white focus:border-white/40 focus:outline-none`}
                    >
                      <option value="">Select carrier</option>
                      {CARRIERS.map((c) => (
                        <option key={c.value} value={c.value}>{c.label}</option>
                      ))}
                    </select>
                    {errors.carrier && <p className="text-red-400 text-xs mt-1">{errors.carrier}</p>}
                  </div>

                  {carrier && (
                    <div className="bg-[#111114] border border-[#303030] rounded-lg p-3">
                      <p className="text-white/60 text-xs font-medium mb-2">Forwarding Instructions:</p>
                      <p className="text-white/40 text-xs">1. Dial *72 → Enter Callnfy number → Wait for tone</p>
                      <p className="text-white/40 text-xs mt-1">To disable: Dial *73</p>
                    </div>
                  )}
                </div>
              )}

              <div className="flex gap-2 pt-3">
                <button
                  onClick={() => setCurrentStep(2)}
                  disabled={isLoading}
                  className="flex-1 bg-white/10 text-white text-sm border border-white/20 font-medium py-1.5 px-3 rounded-lg hover:bg-white/20 transition-colors disabled:opacity-50"
                >
                  Back
                </button>
                <button
                  onClick={() => setCurrentStep(4)}
                  className="bg-white/10 text-white/60 text-sm border border-white/20 font-medium py-1.5 px-3 rounded-lg hover:bg-white/20 transition-colors"
                >
                  Skip
                </button>
                <button
                  onClick={handleSavePhone}
                  disabled={isLoading || (phoneTab === 'new' && (!areaCode || areaCode.length !== 3))}
                  className="flex-1 bg-white text-black text-sm font-medium py-1.5 px-3 rounded-lg hover:bg-white/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isPurchasingNumber ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Calendar */}
          {currentStep === 4 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-lg font-semibold text-white">Connect your calendar</h2>
                <p className="text-sm text-white/40 mt-1">Let your assistant manage appointments</p>
              </div>

              <div className="bg-[#111114] border border-[#303030] rounded-lg p-6 text-center">
                {calendarConnected ? (
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
                    <Calendar className="w-10 h-10 text-white/40 mx-auto mb-3" />
                    <p className="text-white font-medium mb-1">Connect Google Calendar</p>
                    <p className="text-white/40 text-sm mb-4">Check availability and book appointments</p>
                    <button
                      onClick={handleConnectCalendar}
                      disabled={isConnectingCalendar}
                      className="bg-white text-black text-sm font-medium py-1.5 px-3 rounded-lg hover:bg-white/90 transition-colors disabled:opacity-50 inline-flex items-center gap-2"
                    >
                      {isConnectingCalendar ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                        <svg className="w-4 h-4" viewBox="0 0 24 24">
                          <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                          <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        </svg>
                      )}
                      Connect with Google
                    </button>
                  </>
                )}
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  onClick={() => setCurrentStep(3)}
                  disabled={isLoading}
                  className="flex-1 bg-white/10 text-white text-sm border border-white/20 font-medium py-1.5 px-3 rounded-lg hover:bg-white/20 transition-colors disabled:opacity-50"
                >
                  Back
                </button>
                <button
                  onClick={handleSkipCalendar}
                  className="bg-white/10 text-white/60 text-sm border border-white/20 font-medium py-1.5 px-3 rounded-lg hover:bg-white/20 transition-colors"
                >
                  Skip
                </button>
                <button
                  onClick={handleContinueFromCalendar}
                  disabled={isLoading}
                  className="flex-1 bg-white text-black text-sm font-medium py-1.5 px-3 rounded-lg hover:bg-white/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  Continue
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Step 5: Complete */}
          {currentStep === 5 && (
            <div className="space-y-5">
              <div className="text-center">
                <div className="text-4xl mb-3">🎉</div>
                <h2 className="text-lg font-semibold text-white">You're all set!</h2>
                <p className="text-sm text-white/40 mt-1">Your AI receptionist is ready</p>
              </div>

              {/* Summary */}
              <div className="bg-[#111114] border border-[#303030] rounded-lg p-4 space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-white" />
                  <span className="text-white/60">Business:</span>
                  <span className="text-white ml-auto">{businessName || 'Set up'}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-white" />
                  <span className="text-white/60">Assistant:</span>
                  <span className="text-white ml-auto">{assistantName || 'Sophie'}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  {savedPhoneNumber ? <Check className="w-4 h-4 text-white" /> : <div className="w-4 h-4 rounded-full border border-white/20" />}
                  <span className="text-white/60">Phone:</span>
                  <span className="text-white ml-auto">{savedPhoneNumber || 'Skipped'}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  {calendarConnected ? <Check className="w-4 h-4 text-white" /> : <div className="w-4 h-4 rounded-full border border-white/20" />}
                  <span className="text-white/60">Calendar:</span>
                  <span className="text-white ml-auto">{calendarConnected ? 'Connected' : 'Skipped'}</span>
                </div>
              </div>

              {/* Test Call */}
              <div className="bg-[#111114] border border-[#303030] rounded-lg p-4">
                <p className="text-white font-medium text-sm mb-2">Make a test call</p>
                <div className="flex gap-2">
                  <input
                    type="tel"
                    value={testPhoneNumber}
                    onChange={(e) => setTestPhoneNumber(e.target.value)}
                    placeholder="Your phone number"
                    className="flex-1 bg-[#1a1a1d] border border-[#303030] rounded-lg px-3 py-2 text-white text-sm placeholder:text-white/30 focus:border-white/40 focus:outline-none"
                  />
                  <button
                    onClick={handleTestCall}
                    disabled={isTestingCall || !testPhoneNumber.trim()}
                    className="bg-white/10 text-white text-sm border border-white/20 font-medium py-1.5 px-3 rounded-lg hover:bg-white/20 transition-colors disabled:opacity-50"
                  >
                    {isTestingCall ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Call me'}
                  </button>
                </div>
              </div>

              {/* Zapier tip */}
              <div className="text-center">
                <p className="text-white/40 text-xs">
                  Want automations?{' '}
                  <button onClick={() => navigate('/settings/integrations')} className="text-white underline">
                    Set up Zapier
                  </button>
                </p>
              </div>

              <div className="pt-2">
                <button
                  onClick={handleFinish}
                  disabled={isUpdatingOnboarding}
                  className="w-full bg-white text-black text-sm font-medium py-2 px-3 rounded-lg hover:bg-white/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isUpdatingOnboarding ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  Finish
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
