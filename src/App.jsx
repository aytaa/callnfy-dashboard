import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated } from './slices/authSlice';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import VerifyEmail from './pages/auth/VerifyEmail';
import Layout from './components/Layout';
import { AuthLayout } from './layouts/AuthLayout';
import SettingsLayout from './layouts/SettingsLayout';
import SubscriptionGuard from './components/SubscriptionGuard';

// Dashboard pages
import Overview from './pages/dashboard/Overview';
import Calls from './pages/dashboard/Calls';
import Appointments from './pages/dashboard/Appointments';
import Customers from './pages/dashboard/Customers';
import AIAssistantDetail from './pages/AIAssistant/AIAssistantDetail';
import PhoneNumbers from './pages/dashboard/PhoneNumbers';
import PhoneNumberSettings from './pages/dashboard/PhoneNumberSettings';
import SelectPlan from './pages/dashboard/SelectPlan';
import Plan from './pages/onboarding/Plan';
import CheckoutSuccess from './pages/onboarding/CheckoutSuccess';

// Settings pages
import Organization from './pages/settings/Organization';
import Billing from './pages/settings/Billing';
import Members from './pages/settings/Members';
import Profile from './pages/settings/Profile';
import Integrations from './pages/settings/Integrations';
import NotificationSettings from './pages/settings/NotificationSettings';

// Other pages
import Notifications from './pages/Notifications';

// Legal pages
import Privacy from './pages/legal/Privacy';
import Terms from './pages/legal/Terms';

// Protected Route Component
function ProtectedRoute({ children }) {
  const isAuthenticated = useSelector(selectIsAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  return children;
}

// Auth Route Component (redirect if already logged in)
function AuthRoute({ children }) {
  const isAuthenticated = useSelector(selectIsAuthenticated);

  if (isAuthenticated) {
    return <Navigate to="/overview" replace />;
  }

  return children;
}

function App() {
  return (
    <Router>
      <Routes>
        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/auth/login" replace />} />

        {/* Auth Routes */}
        <Route
          path="/auth/login"
          element={
            <AuthRoute>
              <AuthLayout>
                <Login />
              </AuthLayout>
            </AuthRoute>
          }
        />
        <Route
          path="/login"
          element={
            <AuthRoute>
              <AuthLayout>
                <Login />
              </AuthLayout>
            </AuthRoute>
          }
        />
        <Route
          path="/auth/register"
          element={
            <AuthRoute>
              <AuthLayout>
                <Register />
              </AuthLayout>
            </AuthRoute>
          }
        />
        <Route
          path="/register"
          element={
            <AuthRoute>
              <AuthLayout>
                <Register />
              </AuthLayout>
            </AuthRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <AuthRoute>
              <AuthLayout>
                <Register />
              </AuthLayout>
            </AuthRoute>
          }
        />
        <Route
          path="/auth/forgot-password"
          element={
            <AuthRoute>
              <AuthLayout>
                <ForgotPassword />
              </AuthLayout>
            </AuthRoute>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <AuthRoute>
              <AuthLayout>
                <ForgotPassword />
              </AuthLayout>
            </AuthRoute>
          }
        />
        <Route
          path="/auth/reset-password"
          element={
            <AuthRoute>
              <AuthLayout>
                <ResetPassword />
              </AuthLayout>
            </AuthRoute>
          }
        />
        <Route
          path="/reset-password"
          element={
            <AuthRoute>
              <AuthLayout>
                <ResetPassword />
              </AuthLayout>
            </AuthRoute>
          }
        />
        <Route
          path="/auth/verify-email"
          element={
            <AuthRoute>
              <AuthLayout>
                <VerifyEmail />
              </AuthLayout>
            </AuthRoute>
          }
        />
        <Route
          path="/verify-email"
          element={
            <AuthRoute>
              <AuthLayout>
                <VerifyEmail />
              </AuthLayout>
            </AuthRoute>
          }
        />

        {/* Plan/Onboarding Route (Protected, but no subscription check) */}
        <Route
          path="/plan"
          element={
            <ProtectedRoute>
              <Plan />
            </ProtectedRoute>
          }
        />

        {/* Checkout Success Route (Protected, no subscription check) */}
        <Route
          path="/checkout/success"
          element={
            <ProtectedRoute>
              <CheckoutSuccess />
            </ProtectedRoute>
          }
        />

        {/* Select Plan Route (for upgrades, no subscription check) */}
        <Route
          path="/select-plan"
          element={
            <ProtectedRoute>
              <SelectPlan />
            </ProtectedRoute>
          }
        />

        {/* Dashboard Routes (Protected + Subscription Required) */}
        <Route
          path="/overview"
          element={
            <ProtectedRoute>
              <SubscriptionGuard>
                <Layout>
                  <Overview />
                </Layout>
              </SubscriptionGuard>
            </ProtectedRoute>
          }
        />
        <Route
          path="/calls"
          element={
            <ProtectedRoute>
              <SubscriptionGuard>
                <Layout>
                  <Calls />
                </Layout>
              </SubscriptionGuard>
            </ProtectedRoute>
          }
        />
        <Route
          path="/appointments"
          element={
            <ProtectedRoute>
              <SubscriptionGuard>
                <Layout>
                  <Appointments />
                </Layout>
              </SubscriptionGuard>
            </ProtectedRoute>
          }
        />
        <Route
          path="/customers"
          element={
            <ProtectedRoute>
              <SubscriptionGuard>
                <Layout>
                  <Customers />
                </Layout>
              </SubscriptionGuard>
            </ProtectedRoute>
          }
        />
        <Route
          path="/ai-assistant"
          element={
            <ProtectedRoute>
              <SubscriptionGuard>
                <Layout>
                  <AIAssistantDetail />
                </Layout>
              </SubscriptionGuard>
            </ProtectedRoute>
          }
        />
        <Route
          path="/phone-numbers"
          element={
            <ProtectedRoute>
              <SubscriptionGuard>
                <Layout>
                  <PhoneNumbers />
                </Layout>
              </SubscriptionGuard>
            </ProtectedRoute>
          }
        />
        <Route
          path="/phone-numbers/:id"
          element={
            <ProtectedRoute>
              <SubscriptionGuard>
                <Layout>
                  <PhoneNumberSettings />
                </Layout>
              </SubscriptionGuard>
            </ProtectedRoute>
          }
        />
        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <SubscriptionGuard>
                <Layout>
                  <Notifications />
                </Layout>
              </SubscriptionGuard>
            </ProtectedRoute>
          }
        />

        {/* Redirects for old dashboard routes */}
        <Route path="/dashboard" element={<Navigate to="/overview" replace />} />
        <Route path="/dashboard/calls" element={<Navigate to="/calls" replace />} />
        <Route path="/dashboard/appointments" element={<Navigate to="/appointments" replace />} />
        <Route path="/dashboard/customers" element={<Navigate to="/customers" replace />} />
        <Route path="/dashboard/ai-assistant" element={<Navigate to="/ai-assistant" replace />} />
        <Route path="/dashboard/phone-numbers" element={<Navigate to="/phone-numbers" replace />} />

        {/* Settings Routes (Protected + Subscription Required) */}
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <SubscriptionGuard>
                <Layout>
                  <SettingsLayout />
                </Layout>
              </SubscriptionGuard>
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/settings/organization" replace />} />
          <Route path="organization" element={<Organization />} />
          <Route path="billing" element={<Billing />} />
          <Route path="members" element={<Members />} />
          <Route path="integrations" element={<Integrations />} />
          <Route path="profile" element={<Profile />} />
          <Route path="notifications" element={<NotificationSettings />} />
        </Route>

        {/* Legal Pages (Public) */}
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />

        {/* 404 Fallback */}
        <Route path="*" element={<Navigate to="/auth/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
