import { useState } from 'react';
import { Phone, Plus, Eye, Copy, Trash2, Check } from 'lucide-react';

export default function PhoneNumbers() {
  const [copiedId, setCopiedId] = useState(null);

  // Mock phone numbers data
  const phoneNumbers = [
    {
      id: 1,
      number: '+1 (555) 123-4567',
      name: 'Main Reception',
      status: 'active',
      monthlyMinutes: 245,
      totalCalls: 89,
      createdAt: 'Nov 1, 2025',
    },
    {
      id: 2,
      number: '+1 (555) 987-6543',
      name: 'Customer Support',
      status: 'active',
      monthlyMinutes: 178,
      totalCalls: 52,
      createdAt: 'Nov 15, 2025',
    },
  ];

  const handleCopy = (number, id) => {
    navigator.clipboard.writeText(number);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleView = (id) => {
    console.log('View details for phone number:', id);
  };

  const handleDelete = (id) => {
    console.log('Delete phone number:', id);
  };

  const handleAddNumber = () => {
    console.log('Add new phone number');
  };

  return (
    <div className="p-6 pt-8">
      <div className="max-w-5xl mx-auto space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Phone Numbers</h1>
            <p className="text-white opacity-60 text-sm mt-1">
              Manage your AI receptionist phone numbers
            </p>
          </div>
          <button
            onClick={handleAddNumber}
            className="flex items-center gap-2 bg-white text-black font-medium px-3 py-1.5 text-sm rounded-lg hover:bg-gray-200 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Number
          </button>
        </div>

        {/* Phone Number Cards */}
        {phoneNumbers.length > 0 ? (
          <div className="space-y-4">
            {phoneNumbers.map((phone) => (
              <div
                key={phone.id}
                className="bg-[#111] border border-[#1a1a1a] rounded-xl p-4"
              >
                <div className="flex items-start justify-between">
                  {/* Left side - Number info */}
                  <div className="flex items-start gap-3 flex-1">
                    <div className="w-10 h-10 rounded-full bg-[#1a1a1a] flex items-center justify-center">
                      <Phone className="w-4 h-4 text-gray-400" strokeWidth={1.5} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-lg font-semibold text-white">
                          {phone.number}
                        </h3>
                        <span className="px-2 py-0.5 text-xs font-medium bg-[#1a1a1a] text-white rounded">
                          {phone.status}
                        </span>
                      </div>
                      <p className="text-sm text-white opacity-60 mb-3">{phone.name}</p>

                      {/* Stats */}
                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Total Calls</p>
                          <p className="text-sm font-semibold text-white">
                            {phone.totalCalls}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Monthly Minutes</p>
                          <p className="text-sm font-semibold text-white">
                            {phone.monthlyMinutes}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Created</p>
                          <p className="text-sm font-semibold text-white">
                            {phone.createdAt}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right side - Action icons */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleView(phone.id)}
                      className="p-2 text-gray-400 hover:text-white hover:bg-[#1a1a1a] rounded-lg transition-colors"
                      title="View details"
                    >
                      <Eye className="w-4 h-4" strokeWidth={1.5} />
                    </button>
                    <button
                      onClick={() => handleCopy(phone.number, phone.id)}
                      className="p-2 text-gray-400 hover:text-white hover:bg-[#1a1a1a] rounded-lg transition-colors"
                      title="Copy number"
                    >
                      {copiedId === phone.id ? (
                        <Check className="w-4 h-4 text-white" strokeWidth={1.5} />
                      ) : (
                        <Copy className="w-4 h-4" strokeWidth={1.5} />
                      )}
                    </button>
                    <button
                      onClick={() => handleDelete(phone.id)}
                      className="p-2 text-gray-400 hover:text-white hover:bg-[#1a1a1a] rounded-lg transition-colors"
                      title="Delete number"
                    >
                      <Trash2 className="w-4 h-4" strokeWidth={1.5} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="bg-[#111] border border-[#1a1a1a] rounded-xl p-12">
            <div className="flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-full bg-[#1a1a1a] flex items-center justify-center mb-4">
                <Phone className="w-8 h-8 text-gray-400" strokeWidth={1.5} />
              </div>
              <h3 className="text-lg font-semibold text-white mb-1">
                No phone numbers yet
              </h3>
              <p className="text-sm text-white opacity-60 mb-6">
                Get started by adding your first AI-powered phone number
              </p>
              <button
                onClick={handleAddNumber}
                className="flex items-center gap-2 bg-white text-black font-medium px-3 py-1.5 text-sm rounded-lg hover:bg-gray-200 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Number
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
