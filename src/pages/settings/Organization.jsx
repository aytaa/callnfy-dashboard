import { useState } from 'react';
import { Settings, Copy } from 'lucide-react';

export default function Organization() {
  const [orgName, setOrgName] = useState("aytac@callnfy.com's Org");
  const [orgEmail, setOrgEmail] = useState('aytac@callnfy.com');
  const orgId = '43e90965-409c-48c4-841f-c1952f7d14ec';
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(orgId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 bg-[#1a1a1d] rounded-lg flex items-center justify-center">
          <Settings className="w-4 h-4 text-white" />
        </div>
        <h1 className="text-lg font-semibold text-white">{orgName}</h1>
      </div>

      {/* Card */}
      <div className="bg-[#1a1a1d] border border-[#303030] rounded-xl p-4">
        <h2 className="text-base font-semibold text-white mb-1">Organization Settings</h2>
        <p className="text-white text-sm opacity-60 mb-4">Your organization's details.</p>

        <div className="space-y-3">
          <div>
            <label className="block text-sm text-white opacity-60 mb-1">Organization Name</label>
            <input
              className="w-full bg-[#111114] border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white placeholder:text-gray-600 focus:border-[#3a3a3a] focus:outline-none"
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm text-white opacity-60 mb-1">Organization Email</label>
            <input
              className="w-full bg-[#111114] border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white placeholder:text-gray-600 focus:border-[#3a3a3a] focus:outline-none"
              value={orgEmail}
              onChange={(e) => setOrgEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm text-white opacity-60 mb-1">Organization ID</label>
            <div className="flex items-center gap-2">
              <input
                className="flex-1 bg-[#111114] border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white"
                value={orgId}
                readOnly
              />
              <button
                onClick={handleCopy}
                className="p-2 text-white opacity-60 hover:opacity-100 hover:bg-[#1a1a1d] rounded-lg transition-all"
                title="Copy Organization ID"
              >
                {copied ? (
                  <span className="text-xs">Copied!</span>
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-4 pt-3 border-t border-[#303030]">
          <button className="bg-white text-black px-3 py-1.5 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors">
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
