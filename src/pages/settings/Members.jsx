import { useState } from 'react';

export default function Members() {
  const [members] = useState([
    { name: 'Aytac', email: 'aytac@callnfy.com', role: 'Owner', avatar: 'A' }
  ]);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-lg font-semibold text-white">Members</h1>
        <button className="bg-white text-black px-3 py-1.5 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors">
          Invite
        </button>
      </div>

      <div className="bg-[#111] border border-[#1a1a1a] rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-black">
            <tr>
              <th className="px-4 py-2 text-left text-xs text-gray-400 uppercase tracking-wider">Member</th>
              <th className="px-4 py-2 text-left text-xs text-gray-400 uppercase tracking-wider">Role</th>
              <th className="px-4 py-2 text-right text-xs text-gray-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            {members.map((member, i) => (
              <tr key={i} className="border-t border-[#1a1a1a]">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[#2a2a2a] rounded-full flex items-center justify-center text-white text-sm">
                      {member.avatar}
                    </div>
                    <div>
                      <p className="text-white text-sm">{member.name}</p>
                      <p className="text-white text-xs opacity-50">{member.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-white text-sm">{member.role}</td>
                <td className="px-4 py-3 text-right">
                  <button className="text-white text-sm opacity-60 hover:opacity-100">Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
