import { NavLink, Outlet } from 'react-router-dom';
import { Settings, CreditCard, Users, User } from 'lucide-react';

export default function SettingsLayout() {
  const navItems = [
    {
      section: 'ORG SETTINGS',
      items: [
        { icon: Settings, label: 'Org Settings', path: '/settings/organization' },
        { icon: CreditCard, label: 'Billing & Add-Ons', path: '/settings/billing' },
        { icon: Users, label: 'Members', path: '/settings/members' },
      ]
    },
    {
      section: 'ACCOUNT SETTINGS',
      items: [
        { icon: User, label: 'Profile', path: '/settings/profile' },
      ]
    }
  ];

  return (
    <div className="flex h-screen bg-[#212121]">
      {/* Settings Sidebar */}
      <div className="w-64 border-r border-[#303030] p-4 flex-shrink-0">
        <div className="flex items-center gap-2 mb-6">
          <Settings className="w-5 h-5 text-gray-400" />
          <span className="text-white font-semibold">Settings</span>
        </div>

        {navItems.map((group, i) => (
          <div key={i} className="mb-6">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-2 px-2">
              {group.section}
            </p>
            {group.items.map((item, j) => (
              <NavLink
                key={j}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-2 py-2 rounded-lg text-sm transition-colors ${
                    isActive
                      ? 'bg-[#262626] text-white'
                      : 'text-gray-400 hover:bg-[#262626] hover:text-white'
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
