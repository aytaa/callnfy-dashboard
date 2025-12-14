import { Link } from 'react-router-dom';
import { Phone } from 'lucide-react';

export function AuthLayout({ children, title, subtitle }) {
  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      {/* Header */}
      <header className="p-6">
        <Link to="/" className="inline-flex items-center space-x-2 text-white hover:text-blue-400 transition-colors">
          <Phone className="w-8 h-8" />
          <span className="text-2xl font-bold">Callnfy</span>
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Title Section */}
          {(title || subtitle) && (
            <div className="text-center mb-8">
              {title && <h1 className="text-3xl font-bold text-white mb-2">{title}</h1>}
              {subtitle && <p className="text-gray-400">{subtitle}</p>}
            </div>
          )}

          {/* Card Container */}
          <div className="bg-gray-900 rounded-xl shadow-2xl p-8 border border-gray-800">
            {children}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-6 text-center text-gray-500 text-sm">
        <p>&copy; 2025 Callnfy. All rights reserved.</p>
      </footer>
    </div>
  );
}
