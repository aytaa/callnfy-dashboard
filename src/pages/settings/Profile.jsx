import { useState, useEffect } from 'react';
import { Loader2, Building2 } from 'lucide-react';
import { useGetMeQuery } from '../../slices/apiSlice/authApiSlice';
import toast from 'react-hot-toast';

export default function Profile() {
  const { data: userData, isLoading, error } = useGetMeQuery(undefined, {
    refetchOnMountOrArgChange: false,
    refetchOnFocus: false,
    refetchOnReconnect: false,
  });

  // Normalize user data from API (data.name, data.email, data.businessName)
  const user = userData?.data || userData || {};
  const [name, setName] = useState('');

  // Populate form when user data loads
  useEffect(() => {
    if (user) {
      setName(user.name || '');
    }
  }, [user]);

  const email = user.email || '';
  const businessName = user.businessName || user.business_name || '';
  const initials = name ? name.charAt(0).toUpperCase() : 'U';

  const handleSave = () => {
    // TODO: Implement update profile API call
    toast.success('Profile updated');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 text-gray-400 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-zinc-500/10 border border-zinc-500/20 rounded-lg p-3">
        <p className="text-zinc-400 text-sm">Failed to load profile</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-lg font-semibold text-white mb-1">Profile</h1>
      <p className="text-sm text-gray-400 mb-4">Manage your account settings</p>

      {/* Profile Card */}
      <div className="bg-[#1a1a1d] border border-[#303030] rounded-lg p-3 mb-3">
        <div className="flex items-center gap-3 mb-3 pb-3 border-b border-[#303030]">
          <div className="w-10 h-10 bg-[#111114] rounded-full flex items-center justify-center text-white text-sm font-medium">
            {initials}
          </div>
          <div className="flex-1">
            <p className="text-white text-sm font-medium">{name}</p>
            <p className="text-gray-500 text-xs">{email}</p>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Name</label>
            <input
              className="w-full bg-[#111114] border border-[#303030] rounded-md px-2.5 py-1.5 text-sm text-white placeholder:text-gray-600 focus:border-[#404040] focus:outline-none"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1">Email</label>
            <input
              className="w-full bg-[#111114] border border-[#303030] rounded-md px-2.5 py-1.5 text-sm text-white/50 cursor-not-allowed"
              value={email}
              disabled
            />
            <p className="text-xs text-gray-600 mt-1">Email cannot be changed</p>
          </div>
        </div>

        <div className="flex justify-end mt-3 pt-3 border-t border-[#303030]">
          <button
            onClick={handleSave}
            className="bg-white text-black px-3 py-1 text-xs font-medium rounded-md hover:bg-gray-200 transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>

      {/* Organization Card */}
      {businessName && (
        <div className="bg-[#1a1a1d] border border-[#303030] rounded-lg p-3 mb-3">
          <h2 className="text-sm font-semibold text-white mb-2">Organization</h2>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-[#111114] rounded-md flex items-center justify-center">
              <Building2 className="w-4 h-4 text-gray-400" strokeWidth={1.5} />
            </div>
            <div>
              <p className="text-white text-sm">{businessName}</p>
              <p className="text-gray-500 text-xs">Member</p>
            </div>
          </div>
        </div>
      )}

      {/* Security Card */}
      <div className="bg-[#1a1a1d] border border-[#303030] rounded-lg p-3">
        <h2 className="text-sm font-semibold text-white mb-2">Security</h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white text-sm">Password</p>
            <p className="text-gray-500 text-xs">Last changed: Never</p>
          </div>
          <button className="text-xs text-gray-400 hover:text-white transition-colors">
            Change
          </button>
        </div>
      </div>
    </div>
  );
}
