import React, { useState } from 'react';
import { CreditCard, Calendar, TrendingUp, Check } from 'lucide-react';

export default function Billing() {
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);

  const currentPlan = {
    name: 'STARTER',
    price: 49,
    minutesIncluded: 150,
    minutesUsed: 125,
    nextBillingDate: 'Jan 1, 2026',
  };

  const paymentMethod = {
    type: 'Visa',
    last4: '4242',
    expiry: '12/26',
  };

  const billingHistory = [
    {
      id: 1,
      date: 'Dec 1, 2025',
      description: 'Starter Plan - Monthly',
      amount: '$49.00',
      status: 'paid',
    },
    {
      id: 2,
      date: 'Nov 1, 2025',
      description: 'Starter Plan - Monthly',
      amount: '$49.00',
      status: 'paid',
    },
    {
      id: 3,
      date: 'Oct 1, 2025',
      description: 'Starter Plan - Monthly',
      amount: '$49.00',
      status: 'paid',
    },
    {
      id: 4,
      date: 'Sep 1, 2025',
      description: 'Starter Plan - Monthly',
      amount: '$49.00',
      status: 'paid',
    },
  ];

  const percentage = Math.min((currentPlan.minutesUsed / currentPlan.minutesIncluded) * 100, 100);

  return (
    <div>
      <h1 className="text-lg font-semibold text-white mb-4">Billing & Add-Ons</h1>

      {/* Current Plan */}
      <div className="bg-[#1a1a1d] border border-[#303030] rounded-xl p-4 mb-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-white text-sm opacity-60 mb-1">Current Plan</p>
            <div className="flex items-center gap-2">
              <span className="inline-block px-2 py-0.5 bg-[#1a1a1d] text-white text-xs font-medium rounded">
                {currentPlan.name}
              </span>
              <span className="text-xl font-bold text-white">${currentPlan.price}/mo</span>
            </div>
          </div>
          <button
            onClick={() => setIsUpgradeModalOpen(true)}
            className="bg-white text-black px-3 py-1.5 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
          >
            Upgrade
          </button>
        </div>

        {/* Usage */}
        <div className="pt-3 border-t border-[#303030]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white text-sm">Minutes Used</span>
            <span className="text-white text-sm">{currentPlan.minutesUsed}/{currentPlan.minutesIncluded}</span>
          </div>
          <div className="h-2 bg-[#1a1a1d] rounded-full">
            <div className="h-2 bg-white rounded-full transition-all duration-300" style={{ width: `${percentage}%` }}></div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4 pt-3 border-t border-[#303030]">
          <div>
            <p className="text-sm text-white opacity-60">Next Billing Date</p>
            <div className="flex items-center gap-2 mt-1">
              <Calendar className="w-4 h-4 text-white opacity-60" strokeWidth={1.5} />
              <span className="text-white font-medium">{currentPlan.nextBillingDate}</span>
            </div>
          </div>
          <div>
            <p className="text-sm text-white opacity-60">Amount Due</p>
            <span className="text-white font-medium text-lg">${currentPlan.price}.00</span>
          </div>
        </div>
      </div>

      {/* Payment Method */}
      <div className="bg-[#1a1a1d] border border-[#303030] rounded-xl p-4 mb-4">
        <h2 className="text-base font-semibold text-white mb-3">Payment Method</h2>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-[#1a1a1d] p-2 rounded">
              <CreditCard className="w-4 h-4 text-white" strokeWidth={1.5} />
            </div>
            <span className="text-white text-sm">•••• •••• •••• {paymentMethod.last4}</span>
          </div>
          <button className="text-white text-sm opacity-60 hover:opacity-100">Update</button>
        </div>
      </div>

      {/* Billing History */}
      <div className="bg-[#1a1a1d] border border-[#303030] rounded-xl overflow-hidden">
        <h2 className="text-base font-semibold text-white p-4 pb-3">Billing History</h2>
        <table className="w-full">
          <thead className="bg-[#111114]">
            <tr>
              <th className="px-4 py-2 text-left text-xs text-gray-400 uppercase tracking-wider">Date</th>
              <th className="px-4 py-2 text-left text-xs text-gray-400 uppercase tracking-wider">Description</th>
              <th className="px-4 py-2 text-left text-xs text-gray-400 uppercase tracking-wider">Amount</th>
              <th className="px-4 py-2 text-left text-xs text-gray-400 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody>
            {billingHistory.map((row) => (
              <tr key={row.id} className="border-t border-[#303030]">
                <td className="px-4 py-3 text-white text-sm">{row.date}</td>
                <td className="px-4 py-3 text-white text-sm">{row.description}</td>
                <td className="px-4 py-3 text-white text-sm">{row.amount}</td>
                <td className="px-4 py-3">
                  <span className="inline-block px-2 py-0.5 bg-[#1a1a1d] text-white text-xs font-medium rounded">
                    {row.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
