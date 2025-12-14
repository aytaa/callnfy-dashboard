import { useState } from 'react';

export default function Profile() {
  const [fullName, setFullName] = useState('Aytac');
  const [email] = useState('aytac@callnfy.com');

  return (
    <div>
      <h1 className="text-lg font-semibold text-white mb-4">Profile</h1>

      <div className="bg-[#111] border border-[#1a1a1a] rounded-xl p-4">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 bg-[#2a2a2a] rounded-full flex items-center justify-center text-white text-xl">
            A
          </div>
          <button className="text-white text-sm opacity-60 hover:opacity-100">Change</button>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-sm text-white opacity-60 mb-1">Name</label>
            <input
              className="w-full bg-black border border-[#2a2a2a] rounded-lg px-3 py-2 text-sm text-white placeholder:text-gray-600 focus:border-[#3a3a3a] focus:outline-none"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm text-white opacity-60 mb-1">Email</label>
            <input
              className="w-full bg-black border border-[#2a2a2a] rounded-lg px-3 py-2 text-sm text-white opacity-50"
              value={email}
              disabled
            />
          </div>
        </div>

        <div className="flex justify-end mt-4 pt-3 border-t border-[#1a1a1a]">
          <button className="bg-white text-black px-3 py-1.5 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors">
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
