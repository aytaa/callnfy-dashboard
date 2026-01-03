import { Phone, Calendar, AlertTriangle, MessageSquare, CreditCard, Bell } from 'lucide-react';

// Get icon based on notification type
const getNotificationIcon = (type) => {
  switch (type) {
    case 'call':
    case 'call_summary':
    case 'missed_call':
      return Phone;
    case 'appointment':
    case 'appointment_reminder':
    case 'new_appointment':
      return Calendar;
    case 'low_minutes':
    case 'usage_warning':
      return AlertTriangle;
    case 'message':
      return MessageSquare;
    case 'billing':
    case 'payment':
      return CreditCard;
    default:
      return Bell;
  }
};

// Format time ago
const formatTimeAgo = (dateString) => {
  if (!dateString) return '';

  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString();
};

export default function NotificationItem({ notification, onRead, onClick, compact = false }) {
  const Icon = getNotificationIcon(notification.type);
  const isUnread = !notification.read && !notification.readAt;

  const handleClick = () => {
    if (isUnread && onRead) {
      onRead(notification.id);
    }
    if (onClick) {
      onClick(notification);
    }
  };

  if (compact) {
    // Compact version for dropdown
    return (
      <button
        onClick={handleClick}
        className={`w-full flex items-start gap-3 px-3 py-2.5 text-left transition-colors hover:bg-white/10 ${
          isUnread ? 'bg-white/5' : 'bg-transparent'
        }`}
      >
        <div className="w-8 h-8 rounded-full bg-[#111114] flex items-center justify-center flex-shrink-0 mt-0.5">
          <Icon className="w-4 h-4 text-white/60" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <p className={`text-sm truncate ${isUnread ? 'text-white font-medium' : 'text-white/80'}`}>
              {notification.title}
            </p>
            {isUnread && (
              <span className="w-2 h-2 rounded-full bg-white flex-shrink-0 mt-1.5" />
            )}
          </div>
          <p className="text-xs text-white/50 truncate mt-0.5">{notification.message}</p>
          <p className="text-xs text-white/40 mt-1">{formatTimeAgo(notification.createdAt)}</p>
        </div>
      </button>
    );
  }

  // Full version for notifications page
  return (
    <div
      onClick={handleClick}
      className={`flex items-start gap-4 p-4 rounded-lg cursor-pointer transition-colors hover:bg-white/10 ${
        isUnread ? 'bg-white/5' : 'bg-transparent'
      }`}
    >
      <div className="w-10 h-10 rounded-full bg-[#111114] flex items-center justify-center flex-shrink-0">
        <Icon className="w-5 h-5 text-white/60" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <p className={`text-sm ${isUnread ? 'text-white font-medium' : 'text-white/80'}`}>
              {notification.title}
            </p>
            <p className="text-sm text-white/60 mt-1">{notification.message}</p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="text-xs text-white/40">{formatTimeAgo(notification.createdAt)}</span>
            {isUnread && (
              <span className="w-2 h-2 rounded-full bg-white" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
