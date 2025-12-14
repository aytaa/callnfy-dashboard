import { useState, useEffect } from 'react';
import { Button } from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Building2 } from 'lucide-react';

const INDUSTRIES = [
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'retail', label: 'Retail' },
  { value: 'hospitality', label: 'Hospitality' },
  { value: 'professional-services', label: 'Professional Services' },
  { value: 'real-estate', label: 'Real Estate' },
  { value: 'automotive', label: 'Automotive' },
  { value: 'education', label: 'Education' },
  { value: 'finance', label: 'Finance' },
  { value: 'technology', label: 'Technology' },
  { value: 'other', label: 'Other' }
];

const COUNTRIES = [
  { value: 'us', label: 'United States' },
  { value: 'ca', label: 'Canada' },
  { value: 'uk', label: 'United Kingdom' },
  { value: 'au', label: 'Australia' },
  { value: 'de', label: 'Germany' },
  { value: 'fr', label: 'France' },
  { value: 'es', label: 'Spain' },
  { value: 'it', label: 'Italy' },
  { value: 'nl', label: 'Netherlands' },
  { value: 'tr', label: 'Turkey' },
  { value: 'other', label: 'Other' }
];

export function BusinessInfo({ data, onNext }) {
  const [formData, setFormData] = useState({
    businessName: data?.businessName || '',
    industry: data?.industry || '',
    country: data?.country || ''
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.businessName.trim()) {
      newErrors.businessName = 'Business name is required';
    }

    if (!formData.industry) {
      newErrors.industry = 'Please select an industry';
    }

    if (!formData.country) {
      newErrors.country = 'Please select a country';
    }

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onNext(formData);
  };

  return (
    <div className="bg-gray-900 rounded-xl p-8 border border-gray-800">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center">
            <Building2 className="w-6 h-6 text-blue-500" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Business Information</h2>
            <p className="text-gray-400 text-sm mt-1">
              Tell us about your business
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          label="Business Name"
          type="text"
          name="businessName"
          value={formData.businessName}
          onChange={handleChange}
          placeholder="Enter your business name"
          error={errors.businessName}
          required
        />

        <Select
          label="Industry"
          name="industry"
          value={formData.industry}
          onChange={handleChange}
          options={INDUSTRIES}
          placeholder="Select your industry"
          error={errors.industry}
          required
        />

        <Select
          label="Country"
          name="country"
          value={formData.country}
          onChange={handleChange}
          options={COUNTRIES}
          placeholder="Select your country"
          error={errors.country}
          required
        />

        {/* Navigation */}
        <div className="flex justify-end pt-6">
          <Button type="submit" variant="primary" size="lg">
            Continue
          </Button>
        </div>
      </form>
    </div>
  );
}
