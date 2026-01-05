import { useState, useEffect } from 'react';
import { Loader2, Copy, Building2, Check } from 'lucide-react';
import { useGetBusinessesQuery, useUpdateBusinessMutation } from '../../slices/apiSlice/businessApiSlice';
import toast from 'react-hot-toast';

export default function Organization() {
  const { data: businesses, isLoading, error } = useGetBusinessesQuery();
  const [updateBusiness, { isLoading: isUpdating }] = useUpdateBusinessMutation();

  // Get first business (primary organization)
  const business = Array.isArray(businesses) && businesses.length > 0 ? businesses[0] : null;

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [website, setWebsite] = useState('');
  const [industry, setIndustry] = useState('');
  const [copied, setCopied] = useState(false);

  // Populate form when business data loads
  useEffect(() => {
    if (business) {
      setName(business.name || '');
      setEmail(business.email || '');
      setPhone(business.phone || '');
      setWebsite(business.website || '');
      setIndustry(business.industry || '');
    }
  }, [business]);

  const businessId = business?.id || '';

  const handleCopy = () => {
    navigator.clipboard.writeText(businessId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = async () => {
    if (!business?.id) return;

    try {
      await updateBusiness({
        id: business.id,
        name,
        email,
        phone,
        website,
        industry,
      }).unwrap();
      toast.success('Organization updated');
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to update organization');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 text-gray-500 dark:text-gray-400 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-zinc-500/10 border border-red-200 dark:border-zinc-500/20 rounded-lg p-3">
        <p className="text-red-600 dark:text-zinc-400 text-sm">Failed to load organization</p>
      </div>
    );
  }

  if (!business) {
    return (
      <div className="bg-gray-50 dark:bg-zinc-500/10 border border-gray-200 dark:border-zinc-500/20 rounded-lg p-3">
        <p className="text-gray-500 dark:text-zinc-400 text-sm">No organization found</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Organization</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Manage your organization settings</p>

      {/* Organization Info Card */}
      <div className="bg-white dark:bg-[#1a1a1d] border border-gray-200 dark:border-[#303030] rounded-lg p-3 mb-3">
        <div className="flex items-center gap-3 mb-3 pb-3 border-b border-gray-200 dark:border-[#303030]">
          <div className="w-10 h-10 bg-gray-100 dark:bg-[#111114] rounded-lg flex items-center justify-center">
            <Building2 className="w-5 h-5 text-gray-900 dark:text-white" strokeWidth={1.5} />
          </div>
          <div className="flex-1">
            <p className="text-gray-900 dark:text-white text-sm font-medium">{name || 'Organization'}</p>
            <p className="text-gray-500 text-xs">{industry || 'Business'}</p>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Organization Name</label>
            <input
              className="w-full bg-white dark:bg-[#111114] border border-gray-200 dark:border-[#303030] rounded-md px-2.5 py-1.5 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:border-gray-300 dark:focus:border-[#404040] focus:outline-none"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Organization name"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Email</label>
              <input
                className="w-full bg-white dark:bg-[#111114] border border-gray-200 dark:border-[#303030] rounded-md px-2.5 py-1.5 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:border-gray-300 dark:focus:border-[#404040] focus:outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="contact@example.com"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Phone</label>
              <input
                className="w-full bg-white dark:bg-[#111114] border border-gray-200 dark:border-[#303030] rounded-md px-2.5 py-1.5 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:border-gray-300 dark:focus:border-[#404040] focus:outline-none"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 000-0000"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Website</label>
              <input
                className="w-full bg-white dark:bg-[#111114] border border-gray-200 dark:border-[#303030] rounded-md px-2.5 py-1.5 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:border-gray-300 dark:focus:border-[#404040] focus:outline-none"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="https://example.com"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Industry</label>
              <input
                className="w-full bg-white dark:bg-[#111114] border border-gray-200 dark:border-[#303030] rounded-md px-2.5 py-1.5 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:border-gray-300 dark:focus:border-[#404040] focus:outline-none"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                placeholder="e.g. Healthcare"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-3 pt-3 border-t border-gray-200 dark:border-[#303030]">
          <button
            onClick={handleSave}
            disabled={isUpdating}
            className="bg-gray-900 dark:bg-white text-white dark:text-black px-3 py-1 text-xs font-medium rounded-md hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
          >
            {isUpdating && <Loader2 className="w-3 h-3 animate-spin" />}
            Save Changes
          </button>
        </div>
      </div>

      {/* Organization ID Card */}
      <div className="bg-white dark:bg-[#1a1a1d] border border-gray-200 dark:border-[#303030] rounded-lg p-3">
        <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Organization ID</h2>
        <div className="flex items-center gap-2">
          <input
            className="flex-1 bg-gray-50 dark:bg-[#111114] border border-gray-200 dark:border-[#303030] rounded-md px-2.5 py-1.5 text-xs text-gray-500 dark:text-white/60 font-mono"
            value={businessId}
            readOnly
          />
          <button
            onClick={handleCopy}
            className="p-1.5 text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-[#111114] rounded-md transition-colors"
            title="Copy ID"
          >
            {copied ? (
              <Check className="w-4 h-4 text-gray-900 dark:text-white" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </button>
        </div>
        <p className="text-xs text-gray-400 dark:text-gray-600 mt-1.5">Use this ID for API integrations</p>
      </div>
    </div>
  );
}
