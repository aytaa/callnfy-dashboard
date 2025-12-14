import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Phone,
  Calendar,
  Users,
  Bot,
  Hash,
  Building2,
  CreditCard,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import clsx from 'clsx';

function Sidebar({ isOpen, onClose }) {
  const menuSections = [
    {
      title: 'MAIN',
      items: [
        { icon: LayoutDashboard, label: 'Overview', path: '/dashboard' },
        { icon: Phone, label: 'Calls', path: '/dashboard/calls' },
        { icon: Calendar, label: 'Appointments', path: '/dashboard/appointments' },
        { icon: Users, label: 'Customers', path: '/dashboard/customers' },
      ],
    },
    {
      title: 'SETTINGS',
      items: [
        { icon: Bot, label: 'AI Assistant', path: '/dashboard/ai-assistant' },
        { icon: Hash, label: 'Phone Numbers', path: '/dashboard/phone-numbers' },
        { icon: Building2, label: 'Business', path: '/dashboard/business' },
        { icon: CreditCard, label: 'Billing', path: '/dashboard/billing' },
      ],
    },
  ];

  return (
    <>
      {/* Sidebar */}
      <aside
        className={clsx(
          'fixed top-0 left-0 z-40 h-screen w-64 bg-white dark:bg-dark-sidebar border-r border-gray-200 dark:border-dark-border transition-transform duration-300 ease-in-out',
          'flex flex-col',
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 dark:border-dark-border">
          <h1 className="text-xl font-bold bg-gradient-to-r from-teal-500 to-emerald-500 bg-clip-text text-transparent">
            Callnfy
          </h1>
          <button
            onClick={onClose}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-card"
          >
            <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-6 px-3 scrollbar-light dark:scrollbar-dark">
          {menuSections.map((section) => (
            <div key={section.title} className="mb-6">
              <h3 className="px-3 mb-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {section.title}
              </h3>
              <ul className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <li key={item.path}>
                      <NavLink
                        to={item.path}
                        onClick={onClose}
                        className={({ isActive }) =>
                          clsx(
                            'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                            isActive
                              ? 'bg-gradient-to-r from-teal-500 to-emerald-500 text-white'
                              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-card'
                          )
                        }
                      >
                        <Icon className="w-5 h-5" />
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
        <div className="border-t border-gray-200 dark:border-dark-border p-4 space-y-3">
          {/* Plan Badge */}
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg p-3 text-white">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-wide">Pro Plan</span>
              <Sparkles className="w-4 h-4" />
            </div>
            <p className="text-xs opacity-90">Access to all features</p>
          </div>

          {/* Minutes Usage */}
          <div className="bg-gray-100 dark:bg-dark-card rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                Monthly Minutes
              </span>
              <span className="text-xs font-semibold text-gray-900 dark:text-white">
                1,247 / 2,000
              </span>
            </div>
            <div className="w-full h-2 bg-gray-200 dark:bg-dark-bg rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-teal-500 to-emerald-500"
                style={{ width: '62%' }}
              />
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              753 minutes remaining
            </p>
          </div>

          {/* Upgrade Button */}
          <button className="w-full bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-lg py-2.5 px-4 text-sm font-semibold hover:shadow-lg transition-shadow">
            Upgrade Plan
          </button>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
