import { Link } from 'react-router-dom';
import { Phone, ArrowLeft } from 'lucide-react';
import ThemeToggle from '../../components/ui/ThemeToggle';

export default function Terms() {
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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Terms of Service</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">Last updated: January 2025</p>

          <div className="prose prose-gray dark:prose-invert max-w-none">
            <div className="space-y-8">
              {/* Acceptance */}
              <section>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">1. Acceptance of Terms</h2>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  By accessing or using Callnfy's AI phone receptionist service ("Service"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, please do not use our Service. These Terms apply to all users, including business owners, administrators, and any other visitors.
                </p>
              </section>

              {/* Service Description */}
              <section>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">2. Description of Service</h2>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  Callnfy provides an AI-powered virtual receptionist service that handles incoming phone calls for your business. Our Service includes automated call answering, appointment scheduling, customer inquiries handling, calendar integration, and call transcription. The Service is designed to help businesses manage their phone communications efficiently.
                </p>
              </section>

              {/* User Accounts */}
              <section>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">3. User Accounts</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-3">When creating an account, you agree to:</p>
                <ul className="list-disc pl-5 text-gray-600 dark:text-gray-400 space-y-2">
                  <li>Provide accurate and complete registration information</li>
                  <li>Maintain the security of your account credentials</li>
                  <li>Notify us immediately of any unauthorized access</li>
                  <li>Accept responsibility for all activities under your account</li>
                  <li>Not share your account with others or create multiple accounts</li>
                </ul>
                <p className="text-gray-600 dark:text-gray-400 mt-3">
                  We reserve the right to suspend or terminate accounts that violate these Terms.
                </p>
              </section>

              {/* Subscription and Billing */}
              <section>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">4. Subscription and Billing</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-3">Our subscription terms include:</p>
                <ul className="list-disc pl-5 text-gray-600 dark:text-gray-400 space-y-2">
                  <li><strong className="text-gray-900 dark:text-white">Billing Cycle:</strong> Subscriptions are billed monthly or annually as selected.</li>
                  <li><strong className="text-gray-900 dark:text-white">Automatic Renewal:</strong> Subscriptions automatically renew unless cancelled before the renewal date.</li>
                  <li><strong className="text-gray-900 dark:text-white">Price Changes:</strong> We may change prices with 30 days' notice. Changes take effect at your next billing cycle.</li>
                  <li><strong className="text-gray-900 dark:text-white">Refunds:</strong> Refunds may be provided at our discretion for unused portions of your subscription.</li>
                  <li><strong className="text-gray-900 dark:text-white">Trial Period:</strong> Trial periods, if offered, allow you to evaluate the Service before committing to a paid subscription.</li>
                </ul>
              </section>

              {/* Acceptable Use */}
              <section>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">5. Acceptable Use Policy</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-3">You agree not to use our Service to:</p>
                <ul className="list-disc pl-5 text-gray-600 dark:text-gray-400 space-y-2">
                  <li>Violate any applicable laws or regulations</li>
                  <li>Engage in fraudulent, deceptive, or misleading activities</li>
                  <li>Transmit spam, unsolicited communications, or automated calls</li>
                  <li>Harass, abuse, or harm others</li>
                  <li>Infringe on intellectual property rights</li>
                  <li>Attempt to gain unauthorized access to our systems</li>
                  <li>Interfere with or disrupt the Service</li>
                  <li>Use the Service for any illegal telemarketing activities</li>
                </ul>
              </section>

              {/* Intellectual Property */}
              <section>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">6. Intellectual Property</h2>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  The Service, including its original content, features, and functionality, is owned by Callnfy and protected by copyright, trademark, and other intellectual property laws. You retain ownership of any content you provide to the Service, but grant us a license to use it for providing and improving our Service. You may not copy, modify, distribute, or reverse engineer any part of our Service without permission.
                </p>
              </section>

              {/* Limitation of Liability */}
              <section>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">7. Limitation of Liability</h2>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  To the maximum extent permitted by law, Callnfy shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, or business opportunities. Our total liability shall not exceed the amount you paid us in the twelve months preceding the claim. The Service is provided "as is" without warranties of any kind, express or implied.
                </p>
              </section>

              {/* Indemnification */}
              <section>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">8. Indemnification</h2>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  You agree to indemnify and hold harmless Callnfy, its officers, directors, employees, and agents from any claims, damages, losses, or expenses arising from your use of the Service, violation of these Terms, or infringement of any third-party rights.
                </p>
              </section>

              {/* Termination */}
              <section>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">9. Termination</h2>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  You may cancel your subscription at any time through your account settings. We may suspend or terminate your access to the Service immediately, without prior notice, for conduct that we believe violates these Terms or is harmful to other users, us, or third parties. Upon termination, your right to use the Service will cease immediately, and we may delete your account and data according to our data retention policies.
                </p>
              </section>

              {/* Changes to Terms */}
              <section>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">10. Changes to Terms</h2>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  We reserve the right to modify these Terms at any time. We will notify you of material changes by posting the updated Terms on our website and updating the "Last updated" date. Your continued use of the Service after any changes constitutes acceptance of the new Terms.
                </p>
              </section>

              {/* Governing Law */}
              <section>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">11. Governing Law</h2>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  These Terms shall be governed by and construed in accordance with the laws of England and Wales, without regard to conflict of law provisions. Any disputes arising from these Terms or your use of the Service shall be resolved in the courts of England and Wales.
                </p>
              </section>

              {/* Contact */}
              <section>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">12. Contact Us</h2>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  If you have any questions about these Terms, please contact us at:
                </p>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  <strong className="text-gray-900 dark:text-white">Email:</strong> hello@callnfy.com
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
