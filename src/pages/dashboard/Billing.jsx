import React, { useState } from 'react';
import { CreditCard, Calendar, TrendingUp, Check } from 'lucide-react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Badge from '../../components/Badge';
import ProgressBar from '../../components/ProgressBar';
import DataTable from '../../components/DataTable';
import Modal from '../../components/Modal';

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
        <Badge variant={row.status === 'paid' ? 'green' : 'yellow'}>
          {row.status}
        </Badge>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Billing & Subscription</h1>
        <p className="text-gray-400 mt-1">Manage your plan and payment methods</p>
      </div>

      {/* Current Plan */}
      <Card>
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-white mb-2">Current Plan</h2>
            <div className="flex items-center gap-3">
              <Badge variant="blue">{currentPlan.name}</Badge>
              <span className="text-2xl font-bold text-white">${currentPlan.price}/mo</span>
            </div>
          </div>
          <Button onClick={() => setIsUpgradeModalOpen(true)}>
            <TrendingUp className="w-4 h-4 mr-2" />
            Upgrade Plan
          </Button>
        </div>

        <div className="mt-6">
          <ProgressBar
            label="Minutes Used"
            current={currentPlan.minutesUsed}
            max={currentPlan.minutesIncluded}
          />
        </div>

        <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-gray-800">
          <div>
            <p className="text-sm text-gray-400">Next Billing Date</p>
            <div className="flex items-center gap-2 mt-1">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span className="text-white font-medium">{currentPlan.nextBillingDate}</span>
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-400">Amount Due</p>
            <span className="text-white font-medium text-lg">${currentPlan.price}.00</span>
          </div>
        </div>
      </Card>

      {/* Payment Method */}
      <Card>
        <h2 className="text-lg font-semibold text-white mb-4">Payment Method</h2>
        <div className="flex items-center justify-between bg-gray-800/50 rounded-lg p-4">
          <div className="flex items-center gap-4">
            <div className="bg-gray-700 p-3 rounded-lg">
              <CreditCard className="w-6 h-6 text-gray-300" />
            </div>
            <div>
              <p className="text-white font-medium">
                {paymentMethod.type} ending in {paymentMethod.last4}
              </p>
              <p className="text-sm text-gray-400">Expires {paymentMethod.expiry}</p>
            </div>
          </div>
          <Button variant="outline" size="sm">
            Update
          </Button>
        </div>
      </Card>

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
            <Card
              key={plan.name}
              className={`relative ${
                plan.popular
                  ? 'border-blue-500 shadow-lg shadow-blue-500/20'
                  : plan.isCurrent
                  ? 'border-green-500'
                  : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge variant="blue">POPULAR</Badge>
                </div>
              )}
              {plan.isCurrent && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge variant="green">CURRENT PLAN</Badge>
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
                    <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300 text-sm">{feature}</span>
                  </div>
                ))}
              </div>

              <Button
                variant={plan.isCurrent ? 'secondary' : plan.popular ? 'primary' : 'outline'}
                className="w-full"
                disabled={plan.isCurrent}
              >
                {plan.isCurrent ? 'Current Plan' : 'Upgrade'}
              </Button>
            </Card>
          ))}
        </div>
      </Modal>
    </div>
  );
}
