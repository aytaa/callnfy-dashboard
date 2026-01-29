import { useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useLoginMutation } from '../../slices/apiSlice/authApiSlice';
import { setCredentials, clearForceLogout } from '../../slices/authSlice';

const validationSchema = Yup.object({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [login] = useLoginMutation();

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting, setStatus }) => {
      setStatus(null);

      try {
        const result = await login(values).unwrap();

        dispatch(clearForceLogout());

        dispatch(setCredentials({
          user: result.data.user,
        }));

        const from = location.state?.from?.pathname || '/overview';
        navigate(from, { replace: true });
      } catch (err) {
        if (err?.status === 401 || err?.data?.error?.code === 'INVALID_CREDENTIALS') {
          setStatus('Invalid email or password. Please try again.');
        } else if (err?.status === 429) {
          setStatus('Too many login attempts. Please wait a moment and try again.');
        } else {
          setStatus(err?.data?.error?.message || err?.data?.message || 'Failed to login. Please try again.');
        }
      } finally {
        setSubmitting(false);
      }
    },
  });

  useEffect(() => {
    if (location.state?.message) {
      formik.setStatus(location.state.message);
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const successMessage = location.state?.message;
  const inputBaseClass = 'w-full px-3 py-2 border rounded-lg bg-white dark:bg-[#1a1a1d] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none transition-all text-sm';
  const inputNormalClass = `${inputBaseClass} border-gray-200 dark:border-[#303030] focus:border-gray-400 dark:focus:border-[#404040]`;
  const inputErrorClass = `${inputBaseClass} border-red-400 dark:border-red-600 focus:border-red-500 dark:focus:border-red-500`;

  return (
    <div>
      <div className="mb-6 text-center">
        <div className="flex items-center justify-center space-x-2 text-gray-900 dark:text-white mb-4">
          <span className="text-xl" style={{fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700}}>Callnfy</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
          Sign in to your account
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Welcome back! Please enter your details.
        </p>
      </div>

      <form className="space-y-4" onSubmit={formik.handleSubmit}>
        {successMessage && (
          <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <p className="text-sm text-green-600 dark:text-green-400">{successMessage}</p>
          </div>
        )}

        {formik.status && !successMessage && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-sm text-red-600 dark:text-red-400">{formik.status}</p>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={formik.touched.email && formik.errors.email ? inputErrorClass : inputNormalClass}
            placeholder="you@example.com"
          />
          {formik.touched.email && formik.errors.email && (
            <span className="text-red-500 text-sm mt-1 block">{formik.errors.email}</span>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
            Password
          </label>
          <input
            type="password"
            name="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={formik.touched.password && formik.errors.password ? inputErrorClass : inputNormalClass}
            placeholder="••••••••"
          />
          {formik.touched.password && formik.errors.password && (
            <span className="text-red-500 text-sm mt-1 block">{formik.errors.password}</span>
          )}
        </div>

        <div className="flex items-center justify-end">
          <Link
            to="/forgot-password"
            className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            Forgot password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={formik.isSubmitting || !formik.isValid}
          className="w-full bg-gray-900 dark:bg-white text-white dark:text-black py-2 rounded-lg font-medium text-sm hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {formik.isSubmitting ? 'Signing in...' : 'Sign in'}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Don't have an account?{' '}
          <Link
            to="/register"
            className="text-gray-900 dark:text-white font-semibold hover:underline"
          >
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
