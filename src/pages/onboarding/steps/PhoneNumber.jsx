import { useState } from 'react';
import { Button } from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { Phone, PhoneForwarded, PhoneIncoming } from 'lucide-react';

export function PhoneNumber({ data, onNext, onBack }) {
  const [option, setOption] = useState(data?.phoneOption || '');
  const [phoneNumber, setPhoneNumber] = useState(data?.existingPhone || '');
  const [newNumber, setNewNumber] = useState(data?.newNumber || '');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleOptionSelect = (selectedOption) => {
    setOption(selectedOption);
    setError('');

    // Mock: Generate a new number when "Get new number" is selected
    if (selectedOption === 'new' && !newNumber) {
      const mockNumber = `+1 (555) ${Math.floor(100 + Math.random() * 900)}-${Math.floor(1000 + Math.random() * 9000)}`;
      setNewNumber(mockNumber);
    }
  };

  const handlePhoneChange = (e) => {
    setPhoneNumber(e.target.value);
    if (error) setError('');
  };

  const validate = () => {
    if (!option) {
      return 'Please select an option';
    }

    if (option === 'forward') {
      if (!phoneNumber.trim()) {
        return 'Phone number is required';
      }
      // Basic phone validation
      const phoneRegex = /^[\d\s\-\+\(\)]+$/;
      if (!phoneRegex.test(phoneNumber)) {
        return 'Please enter a valid phone number';
      }
      if (phoneNumber.replace(/\D/g, '').length < 10) {
        return 'Phone number must be at least 10 digits';
      }
    }

    return '';
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    // Mock: Simulate verification/setup
    setTimeout(() => {
      setLoading(false);
      onNext({
        phoneOption: option,
        existingPhone: option === 'forward' ? phoneNumber : null,
        newNumber: option === 'new' ? newNumber : null
      });
    }, 1000);
  };

  return (
    <div className="bg-gray-900 rounded-xl p-8 border border-gray-800">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center">
            <Phone className="w-6 h-6 text-blue-500" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Phone Number</h2>
            <p className="text-gray-400 text-sm mt-1">
              Choose how you want to receive calls
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Options */}
        <div className="space-y-4">
          {/* Get New Number */}
          <label
            className={`
              flex items-start p-5 rounded-lg border-2 cursor-pointer transition-all
              ${
                option === 'new'
                  ? 'border-blue-500 bg-blue-500/10'
                  : 'border-gray-700 bg-gray-800 hover:border-gray-600'
              }
            `}
          >
            <input
              type="radio"
              name="phoneOption"
              value="new"
              checked={option === 'new'}
              onChange={(e) => handleOptionSelect(e.target.value)}
              className="mt-1 w-5 h-5 text-blue-600 focus:ring-blue-500 focus:ring-offset-gray-900"
            />
            <div className="ml-4 flex-1">
              <div className="flex items-center space-x-2">
                <PhoneIncoming className="w-5 h-5 text-blue-500" />
                <div className="text-white font-semibold">Get a New Number</div>
              </div>
              <div className="text-gray-400 text-sm mt-1">
                We'll provide you with a new phone number for your business
              </div>
              {option === 'new' && newNumber && (
                <div className="mt-3 p-3 bg-gray-950 rounded-lg border border-gray-700">
                  <div className="text-xs text-gray-400 mb-1">Your new number:</div>
                  <div className="text-white font-mono text-lg">{newNumber}</div>
                </div>
              )}
            </div>
          </label>

          {/* Forward Existing Number */}
          <label
            className={`
              flex items-start p-5 rounded-lg border-2 cursor-pointer transition-all
              ${
                option === 'forward'
                  ? 'border-blue-500 bg-blue-500/10'
                  : 'border-gray-700 bg-gray-800 hover:border-gray-600'
              }
            `}
          >
            <input
              type="radio"
              name="phoneOption"
              value="forward"
              checked={option === 'forward'}
              onChange={(e) => handleOptionSelect(e.target.value)}
              className="mt-1 w-5 h-5 text-blue-600 focus:ring-blue-500 focus:ring-offset-gray-900"
            />
            <div className="ml-4 flex-1">
              <div className="flex items-center space-x-2">
                <PhoneForwarded className="w-5 h-5 text-blue-500" />
                <div className="text-white font-semibold">Forward Existing Number</div>
              </div>
              <div className="text-gray-400 text-sm mt-1">
                Use your existing business number with call forwarding
              </div>
              {option === 'forward' && (
                <div className="mt-4">
                  <Input
                    label="Your Existing Phone Number"
                    type="tel"
                    value={phoneNumber}
                    onChange={handlePhoneChange}
                    placeholder="+1 (555) 123-4567"
                    required
                  />
                </div>
              )}
            </div>
          </label>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-lg">
            <p className="text-red-500 text-sm">{error}</p>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between pt-6">
          <Button type="button" variant="ghost" onClick={onBack}>
            Back
          </Button>
          <Button type="submit" variant="primary" size="lg" loading={loading}>
            Continue
          </Button>
        </div>
      </form>
    </div>
  );
}
