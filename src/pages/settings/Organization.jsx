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
    <div className="p-6 pt-8">
      <div className="max-w-3xl">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-[#1a1a1a] rounded-lg flex items-center justify-center">
            <Settings className="w-5 h-5 text-gray-400" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-white">{orgName}</h1>
          </div>
        </div>

        {/* Organization Settings Card */}
        <div className="bg-[#111] border border-[#1a1a1a] rounded-xl p-4">
          <h2 className="text-lg font-semibold text-white mb-1">Organization Settings</h2>
          <p className="text-gray-500 text-sm mb-4">Your organization's server and security details.</p>

          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Organization Name</label>
              <input
                className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-[#3a3a3a]"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">Organization Email</label>
              <input
                className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-[#3a3a3a]"
                value={orgEmail}
                onChange={(e) => setOrgEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">Organization ID</label>
              <div className="flex items-center gap-2">
                <input
                  className="flex-1 bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg px-3 py-2 text-sm text-white"
                  value={orgId}
                  readOnly
                />
                <button
                  onClick={handleCopy}
                  className="p-2 text-gray-400 hover:text-white hover:bg-[#1a1a1a] rounded-lg transition-colors"
                  title="Copy Organization ID"
                >
                  {copied ? (
                    <span className="text-xs text-white">Copied!</span>
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
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
