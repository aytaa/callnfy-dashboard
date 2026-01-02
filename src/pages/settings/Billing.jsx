import React, { useState } from 'react';
import { CreditCard, Calendar, Eye, AlertCircle, Loader2, Clock } from 'lucide-react';
import {
  useGetSubscriptionQuery,
  useGetPaymentMethodQuery,
  useGetInvoicesQuery,
  useGetPortalUrlMutation,
  useCancelSubscriptionMutation,
} from '../../slices/apiSlice/billingApiSlice';
import toast from 'react-hot-toast';

export default function Billing() {
  const [showCancelModal, setShowCancelModal] = useState(false);

  // API queries
  const { data: subscription, isLoading: isLoadingSubscription, error: subscriptionError } = useGetSubscriptionQuery();
  const { data: paymentMethod, isLoading: isLoadingPayment } = useGetPaymentMethodQuery();
  const { data: invoices, isLoading: isLoadingInvoices } = useGetInvoicesQuery();

  // Mutations
  const [getPortalUrl, { isLoading: isLoadingPortal }] = useGetPortalUrlMutation();
  const [cancelSubscription, { isLoading: isCanceling }] = useCancelSubscriptionMutation();

  const isLoading = isLoadingSubscription || isLoadingPayment || isLoadingInvoices;

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
      await cancelSubscription().unwrap();
      toast.success('Subscription canceled successfully');
      setShowCancelModal(false);
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to cancel subscription');
    }
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
    if (typeof cents !== 'number') return '$0.00';
    return `$${(cents / 100).toFixed(2)}`;
  };

  const getDaysRemaining = (endDate) => {
    if (!endDate) return 0;
    const end = new Date(endDate);
    const now = new Date();
    const diffTime = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  // Monochrome status badges
  const getStatusBadge = (status) => {
    const isPositive = status === 'active' || status === 'paid' || status === 'trialing';
    const style = isPositive
      ? 'bg-white/10 text-white border-white/20'
      : 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20';

    const labels = {
      active: 'Active',
      trialing: 'Trial',
      canceled: 'Canceled',
      past_due: 'Past Due',
      paid: 'Paid',
      open: 'Open',
      void: 'Void',
      draft: 'Draft',
      uncollectible: 'Failed',
    };

    return (
      <span className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded border ${style}`}>
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

  if (subscriptionError) {
    return (
      <div className="bg-zinc-500/10 border border-zinc-500/20 rounded-lg p-3">
        <div className="flex items-center gap-2 text-zinc-400">
          <AlertCircle className="w-4 h-4" />
          <span className="text-sm">Failed to load billing information</span>
        </div>
      </div>
    );
  }

  // Extract data with fallbacks and normalize field names
  const rawPlan = subscription || {};
  const plan = {
    ...rawPlan,
    trialEnd: rawPlan.trialEnd || rawPlan.trialEndsAt || rawPlan.trial_end,
    currentPeriodEnd: rawPlan.currentPeriodEnd || rawPlan.current_period_end,
  };

  // Normalize payment method data
  const rawCard = paymentMethod || null;
  const card = rawCard ? {
    brand: rawCard.brand || rawCard.card?.brand || 'Card',
    last4: rawCard.last4 || rawCard.card?.last4,
    expMonth: rawCard.expMonth || rawCard.exp_month || rawCard.card?.exp_month,
    expYear: rawCard.expYear || rawCard.exp_year || rawCard.card?.exp_year,
  } : null;

  const invoiceList = Array.isArray(invoices) ? invoices : [];

  return (
    <div>
      <h1 className="text-lg font-semibold text-white mb-1">Billing</h1>
      <p className="text-sm text-gray-400 mb-4">Manage your subscription and billing details</p>

      {/* Trial Banner - Monochrome */}
      {plan.status === 'trialing' && plan.trialEnd && (
        <div className="bg-[#1a1a1d] border border-[#303030] rounded-lg p-3 mb-3">
          <div className="flex items-center gap-3">
            <div className="bg-[#111114] p-2 rounded-lg">
              <Clock className="w-4 h-4 text-white" strokeWidth={1.5} />
            </div>
            <div className="flex-1">
              <p className="text-white text-sm font-medium">
                Free trial · {getDaysRemaining(plan.trialEnd)} days left
              </p>
              <p className="text-gray-400 text-xs">
                You won't be charged until {formatDate(plan.trialEnd)}
              </p>
            </div>
            <span className="px-2 py-0.5 text-xs font-medium rounded border bg-white/10 text-white border-white/20">
              Trial
            </span>
          </div>
        </div>
      )}

      {/* Current Plan */}
      <div className="bg-[#1a1a1d] border border-[#303030] rounded-lg p-3 mb-3">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-white">Current Plan</h2>
          <button
            onClick={handleManageBilling}
            disabled={isLoadingPortal}
            className="bg-white text-black px-3 py-1 text-xs font-medium rounded-md hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
          >
            {isLoadingPortal && <Loader2 className="w-3 h-3 animate-spin" />}
            Manage Plan
          </button>
        </div>

        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg font-bold text-white">{plan.name || 'No Plan'}</span>
          {plan.price !== undefined && (
            <span className="text-sm text-gray-400">
              ${plan.price}/{plan.interval === 'year' ? 'yr' : 'mo'}
            </span>
          )}
          {plan.status && plan.status !== 'trialing' && getStatusBadge(plan.status)}
        </div>

        {/* Cancellation Notice */}
        {plan.cancelAtPeriodEnd && (
          <div className="bg-[#111114] rounded-md p-2 mb-3">
            <div className="flex items-center gap-2 text-gray-400 text-xs">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Ends on {formatDate(plan.currentPeriodEnd)}</span>
            </div>
          </div>
        )}

        {plan.currentPeriodEnd && (
          <div className="pt-2 border-t border-[#303030]">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-gray-500 mb-0.5">Next Billing</p>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-gray-400" strokeWidth={1.5} />
                  <span className="text-white text-sm">{formatDate(plan.currentPeriodEnd)}</span>
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-0.5">Amount Due</p>
                <span className="text-white text-sm font-medium">
                  {plan.price !== undefined ? `$${plan.price}.00` : '—'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Cancel Subscription */}
        {plan.status && plan.status !== 'canceled' && !plan.cancelAtPeriodEnd && (
          <div className="pt-2 mt-2 border-t border-[#303030]">
            <button
              onClick={() => setShowCancelModal(true)}
              className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
            >
              Cancel subscription
            </button>
          </div>
        )}
      </div>

      {/* Payment Method */}
      <div className="bg-[#1a1a1d] border border-[#303030] rounded-lg p-3 mb-3">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-semibold text-white">Payment Method</h2>
          <button
            onClick={handleManageBilling}
            disabled={isLoadingPortal}
            className="text-xs text-gray-400 hover:text-white transition-colors disabled:opacity-50"
          >
            {card ? 'Update' : 'Add'}
          </button>
        </div>

        {card && card.last4 ? (
          <div className="flex items-center gap-2.5">
            <div className="bg-[#111114] p-2 rounded-md">
              <CreditCard className="w-4 h-4 text-gray-400" strokeWidth={1.5} />
            </div>
            <div>
              <p className="text-white text-sm">
                {card.brand} •••• {card.last4}
              </p>
              {card.expMonth && card.expYear && (
                <p className="text-gray-500 text-xs">
                  Expires {String(card.expMonth).padStart(2, '0')}/{card.expYear}
                </p>
              )}
            </div>
          </div>
        ) : (
          <p className="text-gray-500 text-xs">No payment method on file</p>
        )}
      </div>

      {/* Billing History */}
      <div className="bg-[#1a1a1d] border border-[#303030] rounded-lg overflow-hidden">
        <h2 className="text-sm font-semibold text-white p-3 pb-2">Billing History</h2>

        {invoiceList.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#111114]">
                <tr>
                  <th className="px-3 py-1.5 text-left text-xs text-gray-500 uppercase tracking-wider font-medium">Date</th>
                  <th className="px-3 py-1.5 text-left text-xs text-gray-500 uppercase tracking-wider font-medium">Description</th>
                  <th className="px-3 py-1.5 text-left text-xs text-gray-500 uppercase tracking-wider font-medium">Amount</th>
                  <th className="px-3 py-1.5 text-left text-xs text-gray-500 uppercase tracking-wider font-medium">Status</th>
                  <th className="px-3 py-1.5 text-right text-xs text-gray-500 uppercase tracking-wider font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {invoiceList.map((invoice) => (
                  <tr key={invoice.id} className="border-t border-[#303030]">
                    <td className="px-3 py-2 text-white text-xs">{formatDate(invoice.date)}</td>
                    <td className="px-3 py-2 text-white text-xs">{invoice.description}</td>
                    <td className="px-3 py-2 text-white text-xs">{formatAmount(invoice.amount)}</td>
                    <td className="px-3 py-2">{getStatusBadge(invoice.status)}</td>
                    <td className="px-3 py-2 text-right">
                      {invoice.hostedUrl && (
                        <button
                          onClick={() => window.open(invoice.hostedUrl, '_blank')}
                          className="p-1 text-white/60 hover:text-white transition-colors"
                          title="View invoice"
                        >
                          <Eye className="w-4 h-4" strokeWidth={1.5} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="px-3 pb-3">
            <p className="text-gray-500 text-xs">No billing history yet</p>
          </div>
        )}
      </div>

      {/* Cancel Subscription Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#1a1a1d] border border-[#303030] rounded-lg p-4 max-w-sm w-full mx-4">
            <h3 className="text-base font-semibold text-white mb-2">Cancel Subscription</h3>
            <p className="text-gray-400 text-sm mb-4">
              Are you sure? You'll have access until {formatDate(plan.currentPeriodEnd)}.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowCancelModal(false)}
                disabled={isCanceling}
                className="px-3 py-1.5 text-xs text-gray-400 hover:text-white transition-colors disabled:opacity-50"
              >
                Keep Plan
              </button>
              <button
                onClick={handleCancelSubscription}
                disabled={isCanceling}
                className="px-3 py-1.5 text-xs bg-white/10 text-white border border-white/20 rounded-md hover:bg-white/20 transition-colors disabled:opacity-50 flex items-center gap-1.5"
              >
                {isCanceling && <Loader2 className="w-3 h-3 animate-spin" />}
                Cancel Subscription
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
