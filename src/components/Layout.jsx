import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Phone,
  Calendar,
  Users,
  Settings,
  Menu,
  X,
  Bot,
  CreditCard,
  Building2
} from 'lucide-react';

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const mainMenuItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Overview' },
    { path: '/dashboard/calls', icon: Phone, label: 'Calls' },
    { path: '/dashboard/appointments', icon: Calendar, label: 'Appointments' },
    { path: '/dashboard/customers', icon: Users, label: 'Customers' },
  ];

  const settingsMenuItems = [
    { path: '/settings/ai-assistant', icon: Bot, label: 'AI Assistant' },
    { path: '/settings/phone-numbers', icon: Phone, label: 'Phone Numbers' },
    { path: '/settings/business', icon: Building2, label: 'Business' },
    { path: '/settings/billing', icon: CreditCard, label: 'Billing' },
  ];

  const isActive = (path) => location.pathname === path;

  const NavLink = ({ item }) => (
    <Link
      to={item.path}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
        isActive(item.path)
          ? 'bg-blue-600 text-white'
          : 'text-gray-400 hover:bg-gray-800 hover:text-white'
      }`}
      onClick={() => setSidebarOpen(false)}
    >
      <item.icon className="w-5 h-5" />
      <span>{item.label}</span>
    </Link>
  );

  return (
    <div className="flex h-screen bg-gray-950">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 border-r border-gray-800 transform transition-transform duration-300 lg:relative lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-6 border-b border-gray-800">
            <h1 className="text-xl font-bold text-white">Callnfy</h1>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            <div className="mb-6">
              {mainMenuItems.map((item) => (
                <NavLink key={item.path} item={item} />
              ))}
            </div>

            <div className="pt-6 border-t border-gray-800">
              <p className="px-4 mb-2 text-xs font-semibold text-gray-500 uppercase">
                Settings
              </p>
              {settingsMenuItems.map((item) => (
                <NavLink key={item.path} item={item} />
              ))}
            </div>
          </nav>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-gray-900 border-b border-gray-800 p-4 lg:p-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-gray-400 hover:text-white"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-white">
                {mainMenuItems.find(item => isActive(item.path))?.label ||
                 settingsMenuItems.find(item => isActive(item.path))?.label ||
                 'Dashboard'}
              </h2>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
