import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import ForgotPassword from './pages/auth/ForgotPassword';
import { Onboarding } from './pages/onboarding/Onboarding';
import Layout from './components/Layout';
import { AuthLayout } from './layouts/AuthLayout';
import SettingsLayout from './layouts/SettingsLayout';

// Dashboard pages
import Overview from './pages/dashboard/Overview';
import Calls from './pages/dashboard/Calls';
import Appointments from './pages/dashboard/Appointments';
import Customers from './pages/dashboard/Customers';
import AIAssistant from './pages/dashboard/AIAssistant';
import PhoneNumbers from './pages/dashboard/PhoneNumbers';

// Settings pages
import Organization from './pages/settings/Organization';
import Billing from './pages/settings/Billing';
import Members from './pages/settings/Members';
import Profile from './pages/settings/Profile';

// Protected Route Component
function ProtectedRoute({ children }) {
  const token = localStorage.getItem('callnfy_auth_token');

  if (!token) {
    return <Navigate to="/auth/login" replace />;
  }

  return children;
}

// Auth Route Component (redirect if already logged in)
function AuthRoute({ children }) {
  const token = localStorage.getItem('callnfy_auth_token');

  if (token) {
    return <Navigate to="/dashboard" replace />;
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
                <Signup />
              </AuthLayout>
            </AuthRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <AuthRoute>
              <AuthLayout>
                <Signup />
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

        {/* Onboarding Route */}
        <Route
          path="/onboarding"
          element={
            <ProtectedRoute>
              <Onboarding />
            </ProtectedRoute>
          }
        />

        {/* Dashboard Routes (Protected) */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Layout>
                <Overview />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/calls"
          element={
            <ProtectedRoute>
              <Layout>
                <Calls />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/appointments"
          element={
            <ProtectedRoute>
              <Layout>
                <Appointments />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/customers"
          element={
            <ProtectedRoute>
              <Layout>
                <Customers />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/ai-assistant"
          element={
            <ProtectedRoute>
              <Layout>
                <AIAssistant />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/phone-numbers"
          element={
            <ProtectedRoute>
              <Layout>
                <PhoneNumbers />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Settings Routes (Protected with SettingsLayout) */}
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Layout>
                <SettingsLayout />
              </Layout>
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/settings/organization" replace />} />
          <Route path="organization" element={<Organization />} />
          <Route path="billing" element={<Billing />} />
          <Route path="members" element={<Members />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        {/* 404 Fallback */}
        <Route path="*" element={<Navigate to="/auth/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
