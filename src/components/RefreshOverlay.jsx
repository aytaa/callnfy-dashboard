import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { subscribeToRefreshing, getIsRefreshing } from '../slices/customBaseQuery';

// Custom hook to reactively get isRefreshing state
export function useIsRefreshing() {
  const [isRefreshing, setIsRefreshing] = useState(getIsRefreshing);

  useEffect(() => {
    // Subscribe to changes
    const unsubscribe = subscribeToRefreshing(setIsRefreshing);
    return unsubscribe;
  }, []);

  return isRefreshing;
}

// Overlay component shown during token refresh
export default function RefreshOverlay() {
  const isRefreshing = useIsRefreshing();

  if (!isRefreshing) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/30 backdrop-blur-[2px]">
      <div className="flex flex-col items-center gap-3 rounded-xl bg-white/90 dark:bg-[#1a1a1d]/90 px-8 py-6 shadow-lg border border-gray-200 dark:border-[#303030]">
        <Loader2 className="w-6 h-6 text-gray-600 dark:text-gray-300 animate-spin" />
        <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
          Oturum yenileniyor...
        </span>
      </div>
    </div>
  );
}
