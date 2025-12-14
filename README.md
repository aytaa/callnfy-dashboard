# Callnfy Dashboard

A modern, feature-rich dashboard for managing AI-powered phone assistant services. Built with React, Vite, and Tailwind CSS with a beautiful Vapi-inspired dark mode design.

![Dashboard Preview](https://via.placeholder.com/800x400/0a0a0a/ffffff?text=Callnfy+Dashboard)

## Features

### Authentication & Onboarding
- **Login/Register** - Secure authentication with form validation
- **Password Reset** - Forgot password functionality
- **6-Step Onboarding Wizard**:
  1. Business Information
  2. Working Hours Configuration
  3. Services Setup
  4. AI Assistant Settings
  5. Phone Number Assignment
  6. Test Call Simulation

### Dashboard Pages

#### Main Features
- **Overview** - Dashboard home with key metrics and recent activity
  - Today's calls, minutes used, appointments, new customers
  - Recent calls table
  - Upcoming appointments
  - Call success chart (placeholder)

- **Calls** - Complete call management
  - Call history with filters (today, yesterday, last 7/30 days, all time)
  - Call details with AI-generated summaries
  - Full transcripts with audio player
  - Status badges (completed, missed, voicemail)
  - Outcome tracking (booked, info request, callback)

- **Appointments** - Booking management with dual views
  - Calendar view with monthly grid
  - List view with detailed table
  - Add/edit/cancel appointments
  - Status tracking (confirmed, pending, cancelled)
  - Customer and service details

- **Customers** - Customer relationship management
  - Searchable customer database
  - Customer profiles with contact info
  - Call history per customer
  - Appointment history tracking
  - Notes and preferences

#### Settings Pages
- **AI Assistant** - Configure AI behavior
  - Greeting messages
  - Voice selection (6 voices)
  - Tone adjustment (Professional, Friendly, Casual)
  - Language selection (6 languages)
  - Service configuration
  - Booking rules

- **Phone Numbers** - Phone system management
  - Current number display with status
  - Call forwarding setup
  - Recording, voicemail, and transcription toggles
  - Get new number functionality

- **Business Settings** - Business profile
  - Basic information (name, industry, address)
  - Working hours grid (7 days)
  - Timezone configuration

- **Billing** - Subscription and payments
  - Current plan display with usage
  - Payment method management
  - Billing history
  - Plan upgrade modal (3 tiers: Starter, Professional, Enterprise)

### UI Components

#### Base Components
- Button (5 variants, 3 sizes, loading states)
- Input, Select, Textarea (with validation)
- Toggle switches
- Badge (6 color variants)
- Card containers

#### Specialized Components
- StatCard (metrics with trend indicators)
- DataTable (sortable, paginated, with empty/loading states)
- Modal (4 sizes, customizable)
- ProgressBar (4 variants)
- ThemeToggle (dark/light mode)
- Calendar (monthly view with markers)
- EmptyState (placeholder UI)

### Design System

#### Color Scheme
**Dark Mode (Default)**
- Background: `#0a0a0a` (gray-950)
- Sidebar: `#111111` (gray-900)
- Cards: `#1a1a1a` (gray-800)
- Borders: `#2a2a2a` (gray-700)
- Text: white / gray-400
- Accent: teal-500 / emerald-500

**Light Mode**
- Background: `#f9fafb` (gray-50)
- Sidebar: white
- Cards: white
- Borders: gray-200
- Text: gray-900 / gray-500
- Accent: teal-600

#### Features
- Dark mode by default with toggle
- Smooth theme transitions
- Mobile responsive (hamburger menu, collapsible sidebar)
- Clean, minimal, professional SaaS aesthetic
- Tailwind CSS for all styling
- Lucide React icons

### Technical Stack

- **Framework**: React 18.3.1
- **Build Tool**: Vite 6.0.0
- **Styling**: Tailwind CSS 3.4.0
- **Routing**: React Router DOM 7.1.1
- **Icons**: Lucide React 0.468.0
- **Utilities**: clsx 2.1.0

### Internationalization (i18n)

- English (EN) - Full translation
- Turkish (TR) - Full translation
- Easy to extend with more languages
- Language switcher ready (hook provided)

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd callnfy-dashboard
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The build output will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
callnfy-dashboard/
├── src/
│   ├── components/
│   │   ├── layouts/
│   │   │   ├── AuthLayout.jsx
│   │   │   ├── DashboardLayout.jsx
│   │   │   └── OnboardingLayout.jsx
│   │   ├── ui/
│   │   │   ├── Badge.jsx
│   │   │   ├── Button.jsx
│   │   │   ├── Card.jsx
│   │   │   ├── Calendar.jsx
│   │   │   ├── DataTable.jsx
│   │   │   ├── EmptyState.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── ProgressBar.jsx
│   │   │   ├── Select.jsx
│   │   │   ├── StatCard.jsx
│   │   │   ├── Textarea.jsx
│   │   │   ├── ThemeToggle.jsx
│   │   │   └── Toggle.jsx
│   │   ├── Header.jsx
│   │   └── Sidebar.jsx
│   ├── pages/
│   │   ├── auth/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   └── ForgotPassword.jsx
│   │   ├── onboarding/
│   │   │   ├── Onboarding.jsx
│   │   │   └── steps/
│   │   │       ├── BusinessInfo.jsx
│   │   │       ├── WorkingHours.jsx
│   │   │       ├── Services.jsx
│   │   │       ├── AISettings.jsx
│   │   │       ├── PhoneNumber.jsx
│   │   │       └── TestCall.jsx
│   │   └── dashboard/
│   │       ├── Overview.jsx
│   │       ├── Calls.jsx
│   │       ├── Appointments.jsx
│   │       ├── Customers.jsx
│   │       ├── AIAssistant.jsx
│   │       ├── PhoneNumbers.jsx
│   │       ├── Business.jsx
│   │       └── Billing.jsx
│   ├── hooks/
│   │   ├── useTheme.js
│   │   └── useTranslation.js
│   ├── data/
│   │   └── mockData.js
│   ├── i18n/
│   │   ├── en.json
│   │   └── tr.json
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── public/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── README.md
```

## Mock Data

The application uses comprehensive mock data located in `src/data/mockData.js`:

- **30+ Customers** - Realistic names, emails, phone numbers
- **15+ Calls** - Full transcripts, AI summaries, varied statuses
- **20+ Appointments** - Past and upcoming with all details
- **Usage Stats** - Minutes used, call metrics, success rates
- **Billing History** - Payment records
- **Services** - 10 service types with pricing
- **User Profile** - Business information

All data is realistic and production-ready for demos.

## Authentication

**Mock Authentication** - For development/demo purposes:
- Any email/password combination works for login
- Registration saves to localStorage
- Auth state persists across sessions
- Protected routes redirect to login

To integrate real authentication:
1. Update `src/pages/auth/Login.jsx` to call your API
2. Update `src/pages/auth/Register.jsx` for registration
3. Modify `src/App.jsx` route guards to check real auth status

## Theme System

The app uses a `ThemeContext` for dark/light mode:

```javascript
import { useTheme } from './hooks/useTheme';

function MyComponent() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button onClick={toggleTheme}>
      Current theme: {theme}
    </button>
  );
}
```

Theme preference is saved to localStorage.

## Internationalization

Use the `useTranslation` hook for i18n:

```javascript
import { useTranslation } from './hooks/useTranslation';

function MyComponent() {
  const { t, language, changeLanguage } = useTranslation();

  return (
    <div>
      <h1>{t('common.welcome')}</h1>
      <button onClick={() => changeLanguage('tr')}>
        Türkçe
      </button>
    </div>
  );
}
```

Add new languages by creating `src/i18n/{lang}.json`.

## Customization

### Colors

Edit `tailwind.config.js` to customize the color palette:

```javascript
theme: {
  extend: {
    colors: {
      primary: '#14b8a6', // Your brand color
    }
  }
}
```

### Branding

Update the following for your brand:
- Logo/name in `src/components/Sidebar.jsx`
- Favicon in `public/`
- Title in `index.html`
- Business name in mock data

### Services

Modify `src/data/mockData.js` to match your services:

```javascript
export const services = [
  { id: 1, name: 'Your Service', duration: 60, price: 50 },
  // ...
];
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance

- **Bundle Size**: ~280 KB (79.5 KB gzipped)
- **CSS**: ~36 KB (6.4 KB gzipped)
- **Build Time**: ~1.2s
- **Lighthouse Score**: 95+ (target)

## Future Enhancements

- [ ] Real API integration
- [ ] WebSocket for real-time updates
- [ ] Advanced analytics charts
- [ ] Export data (CSV, PDF)
- [ ] Email notifications
- [ ] SMS integration
- [ ] Calendar sync (Google, Outlook)
- [ ] Team collaboration features
- [ ] Custom reporting
- [ ] Mobile app

## Contributing

This is a private project. For feature requests or bug reports, please contact the development team.

## License

© 2024 Callnfy. All rights reserved.

## Support

For questions or issues:
- Email: support@callnfy.com
- Documentation: Coming soon

---

**Built with ❤️ using React, Vite, and Tailwind CSS**
