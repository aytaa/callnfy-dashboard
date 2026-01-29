import { Link } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useRegisterMutation } from '../../slices/apiSlice/authApiSlice';

const validationSchema = Yup.object({
  name: Yup.string()
    .min(2, 'Name must be at least 2 characters')
    .required('Name is required'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(/[a-z]/, 'Password must contain a lowercase letter')
    .matches(/[A-Z]/, 'Password must contain an uppercase letter')
    .matches(/[0-9]/, 'Password must contain a number')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Confirm password is required'),
});

function Register() {
  const [register] = useRegisterMutation();

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting, setStatus }) => {
      setStatus(null);

      try {
        await register({
          email: values.email,
          name: values.name,
          password: values.password,
        }).unwrap();

        setStatus({ success: true, email: values.email });
      } catch (err) {
        setStatus({ error: err?.data?.error?.message || err?.data?.message || 'Failed to create account. Please try again.' });
      } finally {
        setSubmitting(false);
      }
    },
  });

  const inputBaseClass = 'w-full px-3 py-2 border rounded-lg bg-white dark:bg-[#1a1a1d] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none transition-all text-sm';
  const inputNormalClass = `${inputBaseClass} border-gray-200 dark:border-[#303030] focus:border-gray-400 dark:focus:border-[#404040]`;
  const inputErrorClass = `${inputBaseClass} border-red-400 dark:border-red-600 focus:border-red-500 dark:focus:border-red-500`;

  if (formik.status?.success) {
    return (
      <div className="text-center">
        <div className="flex items-center justify-center space-x-2 text-gray-900 dark:text-white mb-6">
          <span className="text-xl" style={{fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700}}>Callnfy</span>
        </div>
        <div className="mb-8">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Check your email
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            We've sent a verification link to
          </p>
          <p className="text-gray-900 dark:text-white font-semibold mt-1">
            {formik.status.email}
          </p>
        </div>

        <div className="space-y-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Click the link in the email to verify your account and complete registration.
          </p>

          <Link
            to="/login"
            className="inline-block w-full bg-gray-900 dark:bg-white text-white dark:text-black py-2 rounded-lg font-medium text-sm hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors text-center"
          >
            Back to sign in
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 text-center">
        <div className="flex items-center justify-center space-x-2 text-gray-900 dark:text-white mb-4">
          <span className="text-xl" style={{fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700}}>Callnfy</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
          Create your account
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Get started with Callnfy today
        </p>
      </div>

      <form className="space-y-4" onSubmit={formik.handleSubmit}>
        {formik.status?.error && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-sm text-red-600 dark:text-red-400">{formik.status.error}</p>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
            Full name
          </label>
          <input
            type="text"
            name="name"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={formik.touched.name && formik.errors.name ? inputErrorClass : inputNormalClass}
            placeholder="John Doe"
          />
          {formik.touched.name && formik.errors.name && (
            <span className="text-red-500 text-sm mt-1 block">{formik.errors.name}</span>
          )}
        </div>

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

        <div>
          <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
            Confirm password
          </label>
          <input
            type="password"
            name="confirmPassword"
            value={formik.values.confirmPassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={formik.touched.confirmPassword && formik.errors.confirmPassword ? inputErrorClass : inputNormalClass}
            placeholder="••••••••"
          />
          {formik.touched.confirmPassword && formik.errors.confirmPassword && (
            <span className="text-red-500 text-sm mt-1 block">{formik.errors.confirmPassword}</span>
          )}
        </div>

        <button
          type="submit"
          disabled={formik.isSubmitting || !formik.isValid}
          className="w-full bg-gray-900 dark:bg-white text-white dark:text-black py-2 rounded-lg font-medium text-sm hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {formik.isSubmitting ? 'Creating account...' : 'Create account'}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Already have an account?{' '}
          <Link
            to="/login"
            className="text-gray-900 dark:text-white font-semibold hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
