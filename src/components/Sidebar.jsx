import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  Home,
  Phone as PhoneIcon,
  Calendar,
  Users,
  Bot,
  Hash,
  Building2,
  CreditCard,
  ChevronDown,
  ChevronUp,
  Search,
  X,
} from 'lucide-react';
import clsx from 'clsx';

function Sidebar({ isOpen, onClose }) {
  const [orgDropdownOpen, setOrgDropdownOpen] = useState(false);

  // Get user email and name from localStorage
  const user = JSON.parse(localStorage.getItem('user') || '{"email":"aytac@callnfy.com","name":"Aytac"}');
  const userEmail = user.email || 'aytac@callnfy.com';
  const userName = user.name || 'User';
  const userInitial = userName.charAt(0).toUpperCase();

  const menuSections = [
    {
      title: 'MAIN',
      items: [
        { icon: Home, label: 'Overview', path: '/dashboard' },
        { icon: PhoneIcon, label: 'Calls', path: '/dashboard/calls' },
        { icon: Calendar, label: 'Appointments', path: '/dashboard/appointments' },
        { icon: Users, label: 'Customers', path: '/dashboard/customers' },
      ],
    },
    {
      title: 'SETTINGS',
      items: [
        { icon: Bot, label: 'AI Assistant', path: '/settings/ai-assistant' },
        { icon: Hash, label: 'Phone Numbers', path: '/settings/phone-numbers' },
        { icon: Building2, label: 'Business Settings', path: '/settings/business' },
        { icon: CreditCard, label: 'Billing', path: '/settings/billing' },
      ],
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={clsx(
          'fixed top-0 left-0 z-50 h-screen w-60 bg-[#0a0a0a] border-r border-[#1a1a1a] transition-transform duration-300 ease-in-out',
          'flex flex-col',
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Top Section */}
        <div className="p-4 space-y-3">
          {/* Logo + Close Button */}
          <div className="flex items-center justify-between mb-2">
            <span className="text-lg font-bold text-white">Callnfy</span>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-[#1a1a1a] transition-colors lg:hidden"
            >
              <X className="w-4 h-4 text-gray-400" />
            </button>
          </div>

          {/* Organization Row */}
          <button
            onClick={() => setOrgDropdownOpen(!orgDropdownOpen)}
            className="w-full flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-[#1a1a1a] transition-colors"
          >
            {/* Avatar Circle */}
            <div className="w-6 h-6 rounded-full bg-[#2a2a2a] flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs font-semibold">{userInitial}</span>
            </div>
            {/* Email */}
            <span className="text-sm text-white truncate flex-1 text-left">
              {userEmail}'s Org
            </span>
            {/* Chevron */}
            {orgDropdownOpen ? (
              <ChevronUp className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
            )}
          </button>

          {/* Search Bar */}
          <button className="w-full h-9 flex items-center justify-between px-3 rounded-lg border border-[#2a2a2a] bg-transparent hover:bg-[#1a1a1a] transition-colors">
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">Search</span>
            </div>
            <span className="text-xs text-gray-600 font-medium">⌘K</span>
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-2">
          {/* Menu Sections */}
          {menuSections.map((section) => (
            <div key={section.title} className="mb-6 first:mt-0 mt-6">
              <h3 className="px-3 mb-2 text-[11px] font-medium text-gray-600 uppercase tracking-wider">
                {section.title}
              </h3>
              <ul className="space-y-0.5">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <li key={item.path}>
                      <NavLink
                        to={item.path}
                        onClick={onClose}
                        className={({ isActive }) =>
                          clsx(
                            'flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors',
                            isActive
                              ? 'bg-[#1a1a1a] text-white'
                              : 'text-gray-500 hover:bg-[#1a1a1a] hover:text-gray-300'
                          )
                        }
                      >
                        <Icon className="w-4 h-4" strokeWidth={1.5} />
                        <span>{item.label}</span>
                      </NavLink>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* Bottom Section */}
        <div className="p-3 space-y-2">
          {/* Plan Badge and Usage */}
          <div className="px-3 py-2">
            <div className="flex items-center justify-between mb-2">
              <span className="inline-block px-2 py-0.5 bg-[#1a1a1a] text-gray-400 text-xs font-medium rounded">
                STARTER
              </span>
              <span className="text-xs text-gray-500">125 / 150 min</span>
            </div>
          </div>

          {/* Upgrade Button */}
          <button className="w-full px-3 py-2 text-sm font-medium text-gray-400 border border-[#2a2a2a] hover:border-[#3a3a3a] hover:text-gray-300 rounded-lg transition-colors">
            Upgrade
          </button>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
