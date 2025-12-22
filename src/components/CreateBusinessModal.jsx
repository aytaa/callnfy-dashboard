import { useState } from 'react';
import { Building2, X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useCreateBusinessMutation } from '../slices/apiSlice/businessApiSlice';

export default function CreateBusinessModal() {
  const [createBusiness, { isLoading }] = useCreateBusinessMutation();
  const [formData, setFormData] = useState({
    name: '',
    industry: '',
    phone: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error('Business name is required');
      return;
    }

    try {
      // Build payload, exclude empty fields
      const payload = {
        name: formData.name.trim(),
      };

      // Only add industry if selected
      if (formData.industry) {
        payload.industry = formData.industry;
      }

      // Only add phone if provided
      if (formData.phone.trim()) {
        payload.phone = formData.phone.trim();
      }

      await createBusiness(payload).unwrap();

      toast.success('Business created successfully!');
      // The query will automatically refetch due to invalidatesTags
    } catch (err) {
      console.error('Failed to create business:', err);
      toast.error(err?.data?.message || 'Failed to create business');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#171717] border border-[#303030] rounded-xl max-w-md w-full p-6">
        {/* Header */}
        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 bg-[#262626] rounded-lg flex items-center justify-center flex-shrink-0">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-white mb-1">Create Your Business</h2>
            <p className="text-sm text-gray-400">
              Set up your business to start using Callnfy
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1.5">
              Business Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Acme Salon"
              className="w-full bg-[#262626] border border-[#303030] rounded-lg px-3 py-2 text-sm text-white placeholder:text-gray-600 focus:border-[#3a3a3a] focus:outline-none"
              disabled={isLoading}
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1.5">Industry</label>
            <select
              value={formData.industry}
              onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
              className="w-full bg-[#262626] border border-[#303030] rounded-lg px-3 py-2 text-sm text-white focus:border-[#3a3a3a] focus:outline-none"
              disabled={isLoading}
            >
              <option value="">Select Industry (Optional)</option>
              <option value="hair_salon">Hair Salon</option>
              <option value="beauty_salon">Beauty Salon</option>
              <option value="clinic">Clinic</option>
              <option value="hotel">Hotel</option>
              <option value="plumber">Plumber</option>
              <option value="electrician">Electrician</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1.5">Phone Number</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="e.g., +1 (555) 123-4567"
              className="w-full bg-[#262626] border border-[#303030] rounded-lg px-3 py-2 text-sm text-white placeholder:text-gray-600 focus:border-[#3a3a3a] focus:outline-none"
              disabled={isLoading}
            />
            <p className="text-xs text-gray-500 mt-1.5">
              Optional - You can add a Callnfy phone number later
            </p>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-white text-black text-sm py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {isLoading ? 'Creating...' : 'Create Business'}
            </button>
          </div>
        </form>

        <p className="text-xs text-gray-500 mt-4 text-center">
          You can update these details anytime in Settings
        </p>
      </div>
    </div>
  );
}
