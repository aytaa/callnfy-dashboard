import { useState, useEffect } from 'react';
import { Menu } from 'lucide-react';
import Sidebar from './Sidebar';

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const saved = localStorage.getItem('sidebarCollapsed');
    return saved === 'true';
  });

  // Listen for sidebar collapse changes
  useEffect(() => {
    const handleStorageChange = () => {
      const saved = localStorage.getItem('sidebarCollapsed');
      setIsCollapsed(saved === 'true');
    };

    // Listen for storage events from other tabs/windows
    window.addEventListener('storage', handleStorageChange);

    // Also check on interval for same-tab changes (since storage event doesn't fire in same tab)
    const interval = setInterval(handleStorageChange, 100);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="flex h-screen bg-[#212121]">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className={`flex-1 flex flex-col transition-all duration-300 ${isCollapsed ? 'lg:pl-16' : 'lg:pl-60'}`}>
        <div className="lg:hidden fixed top-0 left-0 right-0 z-30 bg-[#212121] border-b border-[#303030] p-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-white hover:text-white"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
        <main className="flex-1 overflow-y-auto pt-20 lg:pt-0">
          {children}
        </main>
      </div>
    </div>
  );
}
