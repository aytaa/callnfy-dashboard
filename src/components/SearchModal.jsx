import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ArrowRight, Home, Phone, Calendar, Users, Bot, Building, CreditCard, User, Settings as SettingsIcon } from 'lucide-react';

export default function SearchModal({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();

  // Close on Escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleEscape);
      return () => window.removeEventListener('keydown', handleEscape);
    }
  }, [onClose, isOpen]);

  // Reset when modal opens
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const actions = [
    { icon: ArrowRight, label: 'Switch Organization', shortcut: '\u2318 0', action: () => console.log('Switch org') }
  ];

  const pages = [
    { icon: Home, label: 'Overview', section: null, path: '/dashboard/overview' },
    { icon: Phone, label: 'Calls', section: 'Main', path: '/dashboard/calls' },
    { icon: Calendar, label: 'Appointments', section: 'Main', path: '/dashboard/appointments' },
    { icon: Users, label: 'Customers', section: 'Main', path: '/dashboard/customers' },
    { icon: Bot, label: 'AI Assistant', section: 'Main', path: '/dashboard/ai-assistant' },
    { icon: Phone, label: 'Phone Numbers', section: 'Main', path: '/dashboard/phone-numbers' },
    { icon: SettingsIcon, label: 'Organization Settings', section: 'Settings', path: '/settings/organization' },
    { icon: CreditCard, label: 'Billing & Add-Ons', section: 'Settings', path: '/settings/billing' },
    { icon: Users, label: 'Members', section: 'Settings', path: '/settings/members' },
    { icon: User, label: 'Profile', section: 'Settings', path: '/settings/profile' }
  ];

  const filteredPages = pages.filter(p =>
    p.label.toLowerCase().includes(query.toLowerCase()) ||
    (p.section && p.section.toLowerCase().includes(query.toLowerCase()))
  );

  const allItems = [...actions, ...filteredPages];
  const resultCount = allItems.length;

  const handleNavigate = (path) => {
    if (path) {
      navigate(path);
      onClose();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % allItems.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + allItems.length) % allItems.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const selectedItem = allItems[selectedIndex];
      if (selectedItem.path) {
        handleNavigate(selectedItem.path);
      } else if (selectedItem.action) {
        selectedItem.action();
      }
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/80 z-50" onClick={onClose} />

      {/* Modal */}
      <div className="fixed top-[20%] left-1/2 -translate-x-1/2 w-full max-w-lg bg-[#111] border border-[#1a1a1a] rounded-xl z-50 overflow-hidden">

        {/* Search Input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-[#1a1a1a]">
          <Search className="w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search pages..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent text-white placeholder:text-gray-500 focus:outline-none text-sm"
            autoFocus
          />
        </div>

        {/* Results */}
        <div className="max-h-[400px] overflow-y-auto">

          {/* Actions Section */}
          {actions.length > 0 && (
            <div className="px-3 py-2">
              <p className="text-xs text-gray-500 px-2 mb-1">Actions</p>
              {actions.map((action, i) => (
                <div
                  key={`action-${i}`}
                  onClick={action.action}
                  className={`flex items-center justify-between px-2 py-2 rounded-lg cursor-pointer ${
                    selectedIndex === i ? 'bg-[#1a1a1a]' : 'hover:bg-[#1a1a1a]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <action.icon className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-300">{action.label}</span>
                  </div>
                  <span className="text-xs text-gray-500">{action.shortcut}</span>
                </div>
              ))}
            </div>
          )}

          {/* Pages Section */}
          {filteredPages.length > 0 && (
            <div className="px-3 py-2">
              <p className="text-xs text-gray-500 px-2 mb-1">All Pages</p>
              {filteredPages.map((page, i) => {
                const itemIndex = actions.length + i;
                return (
                  <div
                    key={`page-${i}`}
                    onClick={() => handleNavigate(page.path)}
                    className={`flex items-center gap-3 px-2 py-2 rounded-lg cursor-pointer ${
                      selectedIndex === itemIndex ? 'bg-[#1a1a1a]' : 'hover:bg-[#1a1a1a]'
                    }`}
                  >
                    <page.icon className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-300">{page.label}</span>
                    {page.section && (
                      <span className="text-xs text-gray-600">\u2014 {page.section}</span>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* No Results */}
          {filteredPages.length === 0 && query && (
            <div className="px-3 py-8 text-center">
              <p className="text-sm text-gray-500">No results found</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center gap-4 px-4 py-2 border-t border-[#1a1a1a] text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <span>\u2191\u2193</span> to navigate
          </span>
          <span className="flex items-center gap-1">
            <span>\u21b5</span> to select
          </span>
          <span className="flex items-center gap-1">
            <span>\u2318 0</span> Switch Organizations
          </span>
          <span className="ml-auto">{resultCount} results</span>
        </div>
      </div>
    </>
  );
}
