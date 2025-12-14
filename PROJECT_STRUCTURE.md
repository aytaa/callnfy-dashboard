# Callnfy Dashboard - Project Structure

```
callnfy-dashboard/
├── index.html                      # Main HTML entry point
├── package.json                    # Project dependencies
├── vite.config.js                  # Vite configuration
├── tailwind.config.js              # Tailwind CSS configuration
├── postcss.config.js               # PostCSS configuration
├── PHASE_4-5_README.md            # Phase 4-5 implementation guide
│
└── src/
    ├── main.jsx                    # React entry point
    ├── App.jsx                     # Main app with routing
    ├── index.css                   # Global styles + Tailwind
    │
    ├── components/
    │   └── ui/                     # Reusable UI components
    │       ├── Button.jsx          # Button with variants
    │       ├── Input.jsx           # Text input with validation
    │       ├── Select.jsx          # Dropdown select
    │       ├── Checkbox.jsx        # Checkbox with label
    │       ├── Textarea.jsx        # Multi-line text input
    │       ├── Badge.jsx           # Status badges
    │       ├── Card.jsx            # Card container
    │       ├── DataTable.jsx       # Data table
    │       ├── Modal.jsx           # Modal dialog
    │       ├── StatCard.jsx        # Statistics card
    │       ├── Toggle.jsx          # Toggle switch
    │       ├── ThemeToggle.jsx     # Theme switcher
    │       ├── ProgressBar.jsx     # Progress bar
    │       └── index.js            # Component exports
    │
    ├── layouts/
    │   └── AuthLayout.jsx          # Layout for auth pages
    │
    ├── pages/
    │   ├── auth/                   # Authentication pages
    │   │   ├── Login.jsx           # ✅ Login page
    │   │   ├── Register.jsx        # ✅ Registration page
    │   │   ├── ForgotPassword.jsx  # ✅ Password reset page
    │   │   └── Signup.jsx          # (Alternative signup)
    │   │
    │   ├── onboarding/             # Onboarding wizard
    │   │   ├── Onboarding.jsx      # ✅ Main wizard container
    │   │   └── steps/
    │   │       ├── BusinessInfo.jsx    # ✅ Step 1: Business details
    │   │       ├── WorkingHours.jsx    # ✅ Step 2: Working hours
    │   │       ├── Services.jsx        # ✅ Step 3: Services list
    │   │       ├── AISettings.jsx      # ✅ Step 4: AI configuration
    │   │       ├── PhoneNumber.jsx     # ✅ Step 5: Phone setup
    │   │       └── TestCall.jsx        # ✅ Step 6: Test call
    │   │
    │   └── dashboard/              # Dashboard pages (by other agents)
    │       ├── Overview.jsx
    │       ├── Calls.jsx
    │       ├── Appointments.jsx
    │       ├── Customers.jsx
    │       ├── AIAssistant.jsx
    │       ├── PhoneNumbers.jsx
    │       ├── Business.jsx
    │       └── Billing.jsx
    │
    └── utils/                      # Utility functions
```

## Phase 4-5 Deliverables (✅ Complete)

### Auth Pages (3 pages)
1. ✅ Login.jsx - Email/password login with validation
2. ✅ Register.jsx - Business registration form
3. ✅ ForgotPassword.jsx - Password reset flow

### Onboarding Wizard (1 + 6 steps)
4. ✅ Onboarding.jsx - Wizard container with progress bar
5. ✅ BusinessInfo.jsx - Step 1: Business information
6. ✅ WorkingHours.jsx - Step 2: Operating hours
7. ✅ Services.jsx - Step 3: Service management
8. ✅ AISettings.jsx - Step 4: AI assistant configuration
9. ✅ PhoneNumber.jsx - Step 5: Phone number setup
10. ✅ TestCall.jsx - Step 6: Test call simulation

### Supporting Files
- ✅ AuthLayout.jsx - Consistent auth page layout
- ✅ UI Components (Button, Input, Select, Checkbox, Textarea)
- ✅ App.jsx with routing
- ✅ Configuration files (Vite, Tailwind, PostCSS)

## Routes

| Route                    | Component         | Protection | Description                |
|-------------------------|-------------------|------------|----------------------------|
| `/`                     | Navigate          | Public     | Redirects to login         |
| `/auth/login`           | Login             | Auth       | Login page                 |
| `/auth/register`        | Register          | Auth       | Registration page          |
| `/auth/forgot-password` | ForgotPassword    | Auth       | Password reset             |
| `/onboarding`           | Onboarding        | Protected  | 6-step onboarding wizard   |
| `/dashboard`            | Dashboard         | Protected  | Main dashboard             |

**Auth Routes:** Redirect to dashboard if already logged in
**Protected Routes:** Redirect to login if not authenticated

## Data Flow

### Registration → Onboarding → Dashboard
```
User Registration
    ↓
Save to localStorage:
  - callnfy_user (user data)
  - callnfy_auth_token (auth token)
    ↓
Redirect to /onboarding
    ↓
Complete 6 Steps:
  1. Business Info
  2. Working Hours
  3. Services
  4. AI Settings
  5. Phone Number
  6. Test Call
    ↓
Save each step to localStorage (callnfy_onboarding)
    ↓
Complete test call
    ↓
Mark onboarding complete
    ↓
Clear onboarding data
    ↓
Redirect to /dashboard
```

### Login → Dashboard
```
User Login
    ↓
Save to localStorage:
  - callnfy_user (user data)
  - callnfy_auth_token (auth token)
    ↓
Redirect to /dashboard
```

## Key Features

### Form Validation
- Real-time validation
- Error messages
- Required field indicators
- Email format checking
- Password matching
- Phone number validation

### State Management
- React hooks (useState, useEffect)
- localStorage persistence
- Form state management
- Multi-step wizard state

### UI/UX
- Dark mode design
- Loading states
- Success/error feedback
- Responsive layout
- Accessibility (ARIA labels)
- Icons (Lucide React)
- Smooth transitions
- Progress indicators

### Mock Features
- Mock authentication (accepts any credentials)
- Mock phone number generation
- Mock test call simulation
- Mock email sending

## Technologies

- **React 18.3.1** - UI library
- **React Router 7.1.1** - Client-side routing
- **Vite 6.0.0** - Build tool
- **Tailwind CSS 3.4.0** - Styling
- **Lucide React 0.468.0** - Icons
- **clsx 2.1.0** - Class name utilities

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- ES6+ features
- CSS Grid & Flexbox
- LocalStorage API

## Accessibility

- Semantic HTML
- ARIA labels
- Keyboard navigation
- Focus indicators
- Error announcements
- Form labels

## Performance

- Code splitting (React Router)
- Lazy loading (potential)
- Optimized builds (Vite)
- Minimal bundle size
- Fast development server

## Security Notes

**Current Implementation (Mock):**
- Client-side only authentication
- No password hashing
- LocalStorage for sensitive data
- No CSRF protection
- No rate limiting

**Production Requirements:**
- Server-side authentication
- Password hashing (bcrypt)
- JWT tokens with expiration
- HTTPS only
- CSRF tokens
- Rate limiting
- Input sanitization
- XSS protection
