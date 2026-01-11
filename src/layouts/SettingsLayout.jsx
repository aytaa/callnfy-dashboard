import { NavLink, Outlet } from 'react-router-dom';
import { Building2, CreditCard, Users, User, Puzzle, Bell, Clock } from 'lucide-react';

export default function SettingsLayout() {
  const navItems = [
    {
      section: 'ORG SETTINGS',
      items: [
        { icon: Building2, label: 'Org Settings', path: '/settings/organization' },
        { icon: Clock, label: 'Working Hours', path: '/settings/working-hours' },
        { icon: CreditCard, label: 'Billing & Add-Ons', path: '/settings/billing' },
        { icon: Users, label: 'Members', path: '/settings/members' },
        { icon: Puzzle, label: 'Integrations', path: '/settings/integrations' },
      ]
    },
    {
      section: 'ACCOUNT SETTINGS',
      items: [
        { icon: User, label: 'Profile', path: '/settings/profile' },
        { icon: Bell, label: 'Notifications', path: '/settings/notifications' },
      ]
    }
  ];

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-[#111114]">
      {/* Settings Sidebar */}
      <div className="w-64 bg-white dark:bg-[#111114] border-r border-gray-200 dark:border-[#303030] p-4 flex-shrink-0">
        {navItems.map((group, i) => (
          <div key={i} className="mb-6">
            <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2 px-2">
              {group.section}
            </p>
            {group.items.map((item, j) => (
              <NavLink
                key={j}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-2 py-2 rounded-lg text-sm transition-colors ${
                    isActive
                      ? 'bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-white'
                      : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10 hover:text-gray-900 dark:hover:text-white'
                  }`
                }
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </NavLink>
            ))}
          </div>
        ))}
      </div>

      {/* Settings Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6">
          <div className="max-w-2xl mx-auto">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
