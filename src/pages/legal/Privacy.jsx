import { Link } from 'react-router-dom';
import { Phone, ArrowLeft } from 'lucide-react';
import ThemeToggle from '../../components/ui/ThemeToggle';

export default function Privacy() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#111114]">
      {/* Header */}
      <header className="bg-white dark:bg-[#111114] border-b border-gray-200 dark:border-[#303030]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="inline-flex items-center space-x-2 text-gray-900 dark:text-white hover:opacity-70 transition-opacity">
              <Phone className="w-6 h-6" />
              <span className="text-xl font-bold">Callnfy</span>
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          to="/login"
          className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to sign in
        </Link>

        <div className="bg-white dark:bg-[#1a1a1d] border border-gray-200 dark:border-[#303030] rounded-lg p-6 sm:p-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Privacy Policy</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">Last updated: January 2025</p>

          <div className="prose prose-gray dark:prose-invert max-w-none">
            <div className="space-y-8">
              {/* Introduction */}
              <section>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">1. Introduction</h2>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  Callnfy ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our AI-powered phone receptionist service.
                </p>
              </section>

              {/* Data Collection */}
              <section>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">2. Information We Collect</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-3">We collect the following types of information:</p>
                <ul className="list-disc pl-5 text-gray-600 dark:text-gray-400 space-y-2">
                  <li><strong className="text-gray-900 dark:text-white">Account Information:</strong> Email address, name, password, and business details when you create an account.</li>
                  <li><strong className="text-gray-900 dark:text-white">Business Information:</strong> Business name, industry, operating hours, and service details you provide to customize your AI assistant.</li>
                  <li><strong className="text-gray-900 dark:text-white">Call Data:</strong> Phone call recordings, transcriptions, caller information, and call metadata processed through our service.</li>
                  <li><strong className="text-gray-900 dark:text-white">Calendar Data:</strong> Calendar events and availability when you connect your Google Calendar for appointment scheduling.</li>
                  <li><strong className="text-gray-900 dark:text-white">Payment Information:</strong> Billing details processed securely through Stripe. We do not store your full credit card numbers.</li>
                  <li><strong className="text-gray-900 dark:text-white">Usage Data:</strong> Information about how you interact with our service, including features used and pages visited.</li>
                </ul>
              </section>

              {/* How We Use Data */}
              <section>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">3. How We Use Your Information</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-3">We use your information to:</p>
                <ul className="list-disc pl-5 text-gray-600 dark:text-gray-400 space-y-2">
                  <li>Provide and maintain our AI phone receptionist service</li>
                  <li>Process and manage your appointments and calendar integrations</li>
                  <li>Handle phone calls and provide AI-powered responses</li>
                  <li>Process payments and manage subscriptions</li>
                  <li>Send service notifications and updates</li>
                  <li>Improve our service and develop new features</li>
                  <li>Respond to customer support inquiries</li>
                  <li>Comply with legal obligations</li>
                </ul>
              </section>

              {/* Third-Party Services */}
              <section>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">4. Third-Party Services</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-3">We use the following third-party services to operate Callnfy:</p>
                <ul className="list-disc pl-5 text-gray-600 dark:text-gray-400 space-y-2">
                  <li><strong className="text-gray-900 dark:text-white">Vapi:</strong> Voice AI platform for handling phone calls and AI conversations.</li>
                  <li><strong className="text-gray-900 dark:text-white">Google Calendar:</strong> For calendar integration and appointment scheduling (when you connect your account).</li>
                  <li><strong className="text-gray-900 dark:text-white">Stripe:</strong> For secure payment processing and subscription management.</li>
                  <li><strong className="text-gray-900 dark:text-white">Resend:</strong> For sending transactional emails and notifications.</li>
                </ul>
                <p className="text-gray-600 dark:text-gray-400 mt-3">
                  Each third-party service has its own privacy policy governing their use of your data.
                </p>
              </section>

              {/* Data Storage */}
              <section>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">5. Data Storage and Security</h2>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  Your data is stored securely using industry-standard encryption and security practices. We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. Call recordings and transcriptions are stored securely and retained according to your account settings and our data retention policies.
                </p>
              </section>

              {/* User Rights */}
              <section>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">6. Your Rights</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-3">You have the right to:</p>
                <ul className="list-disc pl-5 text-gray-600 dark:text-gray-400 space-y-2">
                  <li><strong className="text-gray-900 dark:text-white">Access:</strong> Request a copy of your personal data we hold.</li>
                  <li><strong className="text-gray-900 dark:text-white">Correction:</strong> Request correction of inaccurate personal data.</li>
                  <li><strong className="text-gray-900 dark:text-white">Deletion:</strong> Request deletion of your personal data, subject to legal retention requirements.</li>
                  <li><strong className="text-gray-900 dark:text-white">Export:</strong> Request export of your data in a portable format.</li>
                  <li><strong className="text-gray-900 dark:text-white">Opt-out:</strong> Unsubscribe from marketing communications at any time.</li>
                </ul>
                <p className="text-gray-600 dark:text-gray-400 mt-3">
                  To exercise any of these rights, please contact us at hello@callnfy.com.
                </p>
              </section>

              {/* Cookies */}
              <section>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">7. Cookies and Tracking</h2>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  We use essential cookies to operate our service, including authentication cookies to keep you logged in and preference cookies to remember your settings. We may also use analytics cookies to understand how users interact with our service. You can control cookie preferences through your browser settings.
                </p>
              </section>

              {/* Data Retention */}
              <section>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">8. Data Retention</h2>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  We retain your personal data for as long as your account is active or as needed to provide you services. Call recordings and transcriptions are retained according to your subscription plan settings. When you delete your account, we will delete or anonymize your personal data within 30 days, except where we are required to retain it for legal purposes.
                </p>
              </section>

              {/* Changes */}
              <section>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">9. Changes to This Policy</h2>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new Privacy Policy on this page and updating the "Last updated" date. Your continued use of our service after any changes constitutes acceptance of the updated policy.
                </p>
              </section>

              {/* Contact */}
              <section>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">10. Contact Us</h2>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  If you have any questions about this Privacy Policy or our data practices, please contact us at:
                </p>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  <strong className="text-gray-900 dark:text-white">Email:</strong> hello@callnfy.com
                </p>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  <strong className="text-gray-900 dark:text-white">Phone:</strong>
                </p>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  🇺🇸 <a href="tel:+12517582527" className="hover:text-gray-900 dark:hover:text-white transition-colors">+1 (251) 758-2527</a>
                </p>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  🇬🇧 <a href="tel:+442045721905" className="hover:text-gray-900 dark:hover:text-white transition-colors">+44 (20) 4572 1905</a>
                </p>
              </section>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center space-x-3 text-xs text-gray-500 dark:text-gray-400">
          <Link to="/terms" className="hover:text-gray-900 dark:hover:text-white transition-colors">
            Terms of Service
          </Link>
          <span>·</span>
          <Link to="/privacy" className="hover:text-gray-900 dark:hover:text-white transition-colors">
            Privacy Policy
          </Link>
        </div>
      </footer>
    </div>
  );
}
