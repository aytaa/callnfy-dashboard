import { useState } from 'react';

export default function Profile() {
  const [fullName, setFullName] = useState('Aytac');
  const [email] = useState('aytac@callnfy.com');

  return (
    <div className="p-6 pt-8">
      <div className="max-w-3xl">
        <h1 className="text-xl font-semibold text-white mb-6">Profile</h1>

        <div className="bg-[#111] border border-[#1a1a1a] rounded-xl p-4">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-[#2a2a2a] rounded-full flex items-center justify-center text-white text-xl">
              A
            </div>
            <button className="text-gray-400 text-sm hover:text-white">Change Avatar</button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Full Name</label>
              <input
                className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-[#3a3a3a]"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">Email</label>
              <input
                className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg px-3 py-2 text-sm text-gray-500"
                value={email}
                disabled
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">Password</label>
              <button className="text-gray-400 text-sm hover:text-white">Change Password</button>
            </div>
          </div>

          <div className="flex justify-end mt-6 pt-4 border-t border-[#1a1a1a]">
            <button className="bg-white text-black px-3 py-1.5 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors">
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
