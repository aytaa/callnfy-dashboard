import React, { useState } from 'react';
import { CreditCard, Calendar, FileText, AlertCircle, Loader2 } from 'lucide-react';
import { useGetSubscriptionQuery, useGetPortalUrlMutation } from '../../slices/apiSlice/subscriptionApiSlice';
import toast from 'react-hot-toast';

export default function Billing() {
  const [showCancelModal, setShowCancelModal] = useState(false);

  const { data: subscription, isLoading, error } = useGetSubscriptionQuery();
  const [getPortalUrl, { isLoading: isLoadingPortal }] = useGetPortalUrlMutation();

  // Mock data fallback for development
  const currentPlan = subscription?.plan || {
    name: 'Professional',
    price: 99,
    interval: 'month',
    status: 'active', // active, trialing, canceled, past_due
    trialEndsAt: null, // '2026-01-15'
    currentPeriodEnd: '2026-02-01',
    cancelAtPeriodEnd: false,
  };

  const paymentMethod = subscription?.paymentMethod || {
    brand: 'Visa',
    last4: '4242',
    expMonth: 12,
    expYear: 2026,
  };

  const invoices = subscription?.invoices || [
    {
      id: 'inv_1',
      date: '2026-01-01',
      description: 'Professional Plan - Monthly',
      amount: 9900,
      status: 'paid',
      pdfUrl: '#',
    },
    {
      id: 'inv_2',
      date: '2025-12-01',
      description: 'Professional Plan - Monthly',
      amount: 9900,
      status: 'paid',
      pdfUrl: '#',
    },
    {
      id: 'inv_3',
      date: '2025-11-01',
      description: 'Professional Plan - Monthly',
      amount: 9900,
      status: 'paid',
      pdfUrl: '#',
    },
    {
      id: 'inv_4',
      date: '2025-10-01',
      description: 'Professional Plan - Monthly',
      amount: 9900,
      status: 'paid',
      pdfUrl: '#',
    },
  ];

  const handleManageBilling = async () => {
    try {
      const result = await getPortalUrl().unwrap();
      if (result?.url) {
        window.location.href = result.url;
      }
    } catch (err) {
      toast.error('Failed to open billing portal');
    }
  };

  const handleCancelSubscription = async () => {
    try {
      // This would call the portal URL with cancel flow
      const result = await getPortalUrl().unwrap();
      if (result?.url) {
        window.location.href = result.url;
      }
    } catch (err) {
      toast.error('Failed to cancel subscription');
    }
    setShowCancelModal(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatAmount = (cents) => {
    return `$${(cents / 100).toFixed(2)}`;
  };

  const getStatusBadge = (status) => {
    const styles = {
      active: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      trialing: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      canceled: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20',
      past_due: 'bg-red-500/10 text-red-400 border-red-500/20',
      paid: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      open: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
      void: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20',
    };

    const labels = {
      active: 'Active',
      trialing: 'Trial',
      canceled: 'Canceled',
      past_due: 'Past Due',
      paid: 'Paid',
      open: 'Open',
      void: 'Void',
    };

    return (
      <span className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded border ${styles[status] || styles.active}`}>
        {labels[status] || status}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 text-gray-400 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
        <div className="flex items-center gap-2 text-red-400">
          <AlertCircle className="w-4 h-4" />
          <span className="text-sm">Failed to load billing information</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-lg font-semibold text-white mb-1">Billing</h1>
      <p className="text-sm text-gray-400 mb-6">Manage your subscription and billing details</p>

      {/* Current Plan */}
      <div className="bg-[#1a1a1d] border border-[#303030] rounded-xl p-4 mb-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-white">Current Plan</h2>
          <button
            onClick={handleManageBilling}
            disabled={isLoadingPortal}
            className="bg-orange-500 text-white px-3 py-1.5 text-sm font-medium rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isLoadingPortal && <Loader2 className="w-3 h-3 animate-spin" />}
            Manage Plan
          </button>
        </div>

        <div className="flex items-center gap-3 mb-4">
          <span className="text-xl font-bold text-white">{currentPlan.name}</span>
          <span className="text-lg text-gray-400">
            ${currentPlan.price}/{currentPlan.interval === 'year' ? 'yr' : 'mo'}
          </span>
          {getStatusBadge(currentPlan.status)}
        </div>

        {/* Trial Info */}
        {currentPlan.status === 'trialing' && currentPlan.trialEndsAt && (
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 mb-4">
            <div className="flex items-center gap-2 text-blue-400 text-sm">
              <AlertCircle className="w-4 h-4" />
              <span>Your trial ends on {formatDate(currentPlan.trialEndsAt)}</span>
            </div>
          </div>
        )}

        {/* Cancellation Notice */}
        {currentPlan.cancelAtPeriodEnd && (
          <div className="bg-zinc-500/10 border border-zinc-500/20 rounded-lg p-3 mb-4">
            <div className="flex items-center gap-2 text-zinc-400 text-sm">
              <AlertCircle className="w-4 h-4" />
              <span>Your subscription will end on {formatDate(currentPlan.currentPeriodEnd)}</span>
            </div>
          </div>
        )}

        <div className="pt-3 border-t border-[#303030]">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-white opacity-60 mb-1">Next Billing Date</p>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-400" strokeWidth={1.5} />
                <span className="text-white font-medium">{formatDate(currentPlan.currentPeriodEnd)}</span>
              </div>
            </div>
            <div>
              <p className="text-sm text-white opacity-60 mb-1">Amount Due</p>
              <span className="text-white font-medium text-lg">${currentPlan.price}.00</span>
            </div>
          </div>
        </div>

        {/* Cancel Subscription */}
        {currentPlan.status !== 'canceled' && !currentPlan.cancelAtPeriodEnd && (
          <div className="pt-3 mt-3 border-t border-[#303030]">
            <button
              onClick={() => setShowCancelModal(true)}
              className="text-sm text-gray-400 hover:text-red-400 transition-colors"
            >
              Cancel subscription
            </button>
          </div>
        )}
      </div>

      {/* Payment Method */}
      <div className="bg-[#1a1a1d] border border-[#303030] rounded-xl p-4 mb-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold text-white">Payment Method</h2>
          <button
            onClick={handleManageBilling}
            disabled={isLoadingPortal}
            className="text-sm text-gray-400 hover:text-white transition-colors disabled:opacity-50"
          >
            Update
          </button>
        </div>

        {paymentMethod ? (
          <div className="flex items-center gap-3">
            <div className="bg-[#111114] p-2.5 rounded-lg">
              <CreditCard className="w-5 h-5 text-gray-400" strokeWidth={1.5} />
            </div>
            <div>
              <p className="text-white text-sm font-medium">
                {paymentMethod.brand} •••• {paymentMethod.last4}
              </p>
              <p className="text-gray-400 text-xs">
                Expires {String(paymentMethod.expMonth).padStart(2, '0')}/{paymentMethod.expYear}
              </p>
            </div>
          </div>
        ) : (
          <div className="text-gray-400 text-sm">No payment method on file</div>
        )}
      </div>

      {/* Billing History */}
      <div className="bg-[#1a1a1d] border border-[#303030] rounded-xl overflow-hidden">
        <h2 className="text-base font-semibold text-white p-4 pb-3">Billing History</h2>

        {invoices.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#111114]">
                <tr>
                  <th className="px-4 py-2 text-left text-xs text-gray-400 uppercase tracking-wider font-medium">Date</th>
                  <th className="px-4 py-2 text-left text-xs text-gray-400 uppercase tracking-wider font-medium">Description</th>
                  <th className="px-4 py-2 text-left text-xs text-gray-400 uppercase tracking-wider font-medium">Amount</th>
                  <th className="px-4 py-2 text-left text-xs text-gray-400 uppercase tracking-wider font-medium">Status</th>
                  <th className="px-4 py-2 text-right text-xs text-gray-400 uppercase tracking-wider font-medium">Invoice</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((invoice) => (
                  <tr key={invoice.id} className="border-t border-[#303030]">
                    <td className="px-4 py-3 text-white text-sm">{formatDate(invoice.date)}</td>
                    <td className="px-4 py-3 text-white text-sm">{invoice.description}</td>
                    <td className="px-4 py-3 text-white text-sm">{formatAmount(invoice.amount)}</td>
                    <td className="px-4 py-3">{getStatusBadge(invoice.status)}</td>
                    <td className="px-4 py-3 text-right">
                      {invoice.pdfUrl && (
                        <a
                          href={invoice.pdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-white transition-colors"
                        >
                          <FileText className="w-4 h-4" strokeWidth={1.5} />
                          <span>PDF</span>
                        </a>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="px-4 pb-4">
            <p className="text-gray-400 text-sm">No billing history available</p>
          </div>
        )}
      </div>

      {/* Cancel Subscription Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#1a1a1d] border border-[#303030] rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-white mb-2">Cancel Subscription</h3>
            <p className="text-gray-400 text-sm mb-6">
              Are you sure you want to cancel your subscription? You'll continue to have access until {formatDate(currentPlan.currentPeriodEnd)}.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowCancelModal(false)}
                className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
              >
                Keep Subscription
              </button>
              <button
                onClick={handleCancelSubscription}
                className="px-4 py-2 text-sm bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg hover:bg-red-500/20 transition-colors"
              >
                Cancel Subscription
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
