import { useState } from 'react';
import { Menu } from 'lucide-react';
import Sidebar from './Sidebar';
import AskAIButton from './AskAIButton';

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-[#0a0a0a]">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main content */}
      <div className="flex-1 flex flex-col lg:pl-60">
        {/* Mobile Header - Only shows hamburger menu */}
        <div className="lg:hidden fixed top-0 left-0 right-0 z-30 bg-[#111] border-b border-[#2a2a2a] p-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-gray-400 hover:text-white"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>

        {/* Page content - NO header on desktop */}
        <main className="flex-1 overflow-y-auto pt-20 lg:pt-0">
          {children}
        </main>

        {/* Ask AI Button */}
        <AskAIButton />
      </div>
    </div>
  );
}
