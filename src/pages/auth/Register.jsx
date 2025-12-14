import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthLayout } from '../../layouts/AuthLayout';
import { Button } from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';

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

export function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    businessName: '',
    email: '',
    password: '',
    confirmPassword: '',
    industry: '',
    country: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.businessName.trim()) {
      newErrors.businessName = 'Business name is required';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.industry) {
      newErrors.industry = 'Please select an industry';
    }

    if (!formData.country) {
      newErrors.country = 'Please select a country';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);

    // Mock registration - simulate API call
    setTimeout(() => {
      // Save user data to localStorage
      const userData = {
        businessName: formData.businessName,
        email: formData.email,
        industry: formData.industry,
        country: formData.country,
        registeredAt: new Date().toISOString(),
        onboardingComplete: false
      };
      localStorage.setItem('callnfy_user', JSON.stringify(userData));
      localStorage.setItem('callnfy_auth_token', 'mock_token_' + Date.now());

      setLoading(false);

      // Redirect to onboarding
      navigate('/onboarding');
    }, 1000);
  };

  return (
    <AuthLayout
      title="Create Account"
      subtitle="Start your AI calling journey with Callnfy"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Business Name */}
        <Input
          label="Business Name"
          type="text"
          name="businessName"
          value={formData.businessName}
          onChange={handleChange}
          placeholder="Acme Corporation"
          error={errors.businessName}
          required
        />

        {/* Email */}
        <Input
          label="Email Address"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="you@business.com"
          error={errors.email}
          required
        />

        {/* Password */}
        <Input
          label="Password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="••••••••"
          error={errors.password}
          required
        />

        {/* Confirm Password */}
        <Input
          label="Confirm Password"
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="••••••••"
          error={errors.confirmPassword}
          required
        />

        {/* Industry */}
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

        {/* Country */}
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

        {/* Submit Button */}
        <Button
          type="submit"
          variant="primary"
          className="w-full mt-6"
          loading={loading}
        >
          Create Account
        </Button>

        {/* Login Link */}
        <div className="text-center text-sm text-gray-400">
          Already have an account?{' '}
          <Link
            to="/auth/login"
            className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
          >
            Login
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
}
