import React, { useState } from 'react';
import { CreditCard, Calendar, TrendingUp, Check } from 'lucide-react';
import ProgressBar from '../../components/ui/ProgressBar';
import DataTable from '../../components/ui/DataTable';
import Modal from '../../components/ui/Modal';

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

  const plans = [
    {
      name: 'STARTER',
      price: 49,
      minutes: 150,
      features: [
        '1 Phone Number',
        'AI Assistant',
        'Call Recording',
        'Email Support',
        'Basic Analytics',
      ],
      isCurrent: true,
    },
    {
      name: 'PROFESSIONAL',
      price: 99,
      minutes: 500,
      features: [
        '3 Phone Numbers',
        'Advanced AI Assistant',
        'Call Recording & Transcription',
        'Priority Support',
        'Advanced Analytics',
        'Custom Integrations',
      ],
      isCurrent: false,
      popular: true,
    },
    {
      name: 'ENTERPRISE',
      price: 249,
      minutes: 2000,
      features: [
        'Unlimited Phone Numbers',
        'Premium AI Assistant',
        'Full Call Suite',
        '24/7 Dedicated Support',
        'Custom Analytics',
        'API Access',
        'White Label Options',
      ],
      isCurrent: false,
    },
  ];

  const columns = [
    { header: 'Date', accessor: 'date' },
    { header: 'Description', accessor: 'description' },
    { header: 'Amount', accessor: 'amount' },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => (
        <span className="inline-block px-2 py-0.5 bg-[#262626] text-gray-400 text-xs font-medium rounded">
          {row.status}
        </span>
      ),
    },
  ];

  return (
    <div className="p-6 pt-8">
      <div className="max-w-5xl mx-auto space-y-4">
        {/* Header */}
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-white">Billing & Subscription</h1>
          <p className="text-gray-400 text-sm mt-1">Manage your plan and payment methods</p>
        </div>

        {/* Current Plan */}
        <div className="bg-[#171717] border border-[#303030] rounded-xl p-4">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-white mb-2">Current Plan</h2>
              <div className="flex items-center gap-3">
                <span className="inline-block px-2 py-0.5 bg-[#262626] text-gray-400 text-xs font-medium rounded">
                  {currentPlan.name}
                </span>
                <span className="text-2xl font-bold text-white">${currentPlan.price}/mo</span>
              </div>
            </div>
            <button
              onClick={() => setIsUpgradeModalOpen(true)}
              className="flex items-center gap-2 bg-white text-black font-medium px-3 py-1.5 text-sm rounded-lg hover:bg-gray-200 transition-colors"
            >
              <TrendingUp className="w-4 h-4" />
              Upgrade Plan
            </button>
          </div>

          <div className="mt-6">
            <ProgressBar
              label="Minutes Used"
              current={currentPlan.minutesUsed}
              max={currentPlan.minutesIncluded}
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-[#303030]">
            <div>
              <p className="text-sm text-gray-400">Next Billing Date</p>
              <div className="flex items-center gap-2 mt-1">
                <Calendar className="w-4 h-4 text-gray-400" strokeWidth={1.5} />
                <span className="text-white font-medium">{currentPlan.nextBillingDate}</span>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-400">Amount Due</p>
              <span className="text-white font-medium text-lg">${currentPlan.price}.00</span>
            </div>
          </div>
        </div>

        {/* Payment Method */}
        <div className="bg-[#171717] border border-[#303030] rounded-xl p-4">
          <h2 className="text-lg font-semibold text-white mb-4">Payment Method</h2>
          <div className="flex items-center justify-between bg-[#212121] border border-[#303030] rounded-lg p-4">
            <div className="flex items-center gap-4">
              <div className="bg-[#262626] p-3 rounded-lg">
                <CreditCard className="w-6 h-6 text-gray-400" strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-white font-medium">
                  {paymentMethod.type} ending in {paymentMethod.last4}
                </p>
                <p className="text-sm text-gray-400">Expires {paymentMethod.expiry}</p>
              </div>
            </div>
            <button className="border border-[#303030] text-gray-400 px-3 py-1.5 text-sm rounded-lg hover:border-[#3a3a3a] hover:text-white transition-colors">
              Update
            </button>
          </div>
        </div>

        {/* Billing History */}
        <div>
          <h2 className="text-lg font-semibold text-white mb-4">Billing History</h2>
          <DataTable columns={columns} data={billingHistory} />
        </div>

        {/* Upgrade Modal */}
        <Modal
          isOpen={isUpgradeModalOpen}
          onClose={() => setIsUpgradeModalOpen(false)}
          title="Choose Your Plan"
          size="xl"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative bg-[#171717] border rounded-xl p-4 ${
                  plan.popular
                    ? 'border-[#303030] shadow-lg'
                    : plan.isCurrent
                    ? 'border-[#303030]'
                    : 'border-[#303030]'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="inline-block px-2 py-0.5 bg-[#262626] text-gray-400 text-xs font-medium rounded">
                      POPULAR
                    </span>
                  </div>
                )}
                {plan.isCurrent && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="inline-block px-2 py-0.5 bg-[#262626] text-gray-400 text-xs font-medium rounded">
                      CURRENT PLAN
                    </span>
                  </div>
                )}

                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-bold text-white">${plan.price}</span>
                    <span className="text-gray-400">/month</span>
                  </div>
                  <p className="text-sm text-gray-400 mt-2">{plan.minutes} minutes included</p>
                </div>

                <div className="space-y-3 mb-6">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" strokeWidth={1.5} />
                      <span className="text-gray-300 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                <button
                  className={`w-full px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                    plan.isCurrent
                      ? 'bg-[#262626] text-gray-500 cursor-not-allowed'
                      : 'bg-white text-black hover:bg-gray-200'
                  }`}
                  disabled={plan.isCurrent}
                >
                  {plan.isCurrent ? 'Current Plan' : 'Upgrade'}
                </button>
              </div>
            ))}
          </div>
        </Modal>
      </div>
    </div>
  );
}
