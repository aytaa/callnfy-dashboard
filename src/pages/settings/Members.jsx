import { useState } from 'react';

export default function Members() {
  const [members] = useState([
    { name: 'Aytac', email: 'aytac@callnfy.com', role: 'Owner', avatar: 'A' }
  ]);

  return (
    <div className="p-6 pt-8">
      <div className="max-w-3xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-semibold text-white">Members</h1>
            <p className="text-gray-500 text-sm">Manage your team members</p>
          </div>
          <button className="bg-white text-black px-3 py-1.5 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors">
            Invite Member
          </button>
        </div>

        <div className="bg-[#111] border border-[#1a1a1a] rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-[#0a0a0a]">
              <tr>
                <th className="px-4 py-3 text-left text-xs text-gray-500 uppercase">Member</th>
                <th className="px-4 py-3 text-left text-xs text-gray-500 uppercase">Role</th>
                <th className="px-4 py-3 text-right text-xs text-gray-500 uppercase">Actions</th>
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
                        <p className="text-gray-500 text-xs">{member.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-gray-400 text-sm">{member.role}</span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button className="text-gray-500 text-sm hover:text-white">Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
