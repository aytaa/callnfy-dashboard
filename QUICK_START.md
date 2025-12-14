# Quick Start Guide - Callnfy Dashboard

## Get Started in 3 Steps

### 1️⃣ Install Dependencies
```bash
npm install
```
Dependencies are already installed! ✅

### 2️⃣ Start Development Server
```bash
npm run dev
```
Server will start at: **http://localhost:5173**

### 3️⃣ Login & Explore
- Open http://localhost:5173 in your browser
- Use any email/password (mock auth)
- Example: `admin@callnfy.com` / `password`

---

## Available Scripts

```bash
npm run dev      # Start development server (port 5173)
npm run build    # Build for production
npm run preview  # Preview production build
```

---

## First-Time User Flow

### 1. Login Page (/)
- Enter any email and password
- Click "Sign In"
- Or click "Sign up" to register

### 2. Dashboard (/dashboard)
You'll see:
- 4 stat cards (calls, minutes, appointments, customers)
- Recent calls table
- Upcoming appointments
- Chart placeholder

### 3. Explore Pages
Use the sidebar to navigate:

**MAIN Section:**
- **Overview** - Dashboard home
- **Calls** - View call history and transcripts
- **Appointments** - Manage bookings (calendar/list view)
- **Customers** - Customer database

**SETTINGS Section:**
- **AI Assistant** - Configure AI behavior
- **Phone Numbers** - Manage phone settings
- **Business Settings** - Business profile and hours
- **Billing** - Plans and payment

### 4. Try Features

**View Call Details:**
1. Go to "Calls" page
2. Click any row in the table
3. See transcript, AI summary, and audio player

**Add Appointment:**
1. Go to "Appointments" page
2. Click "Add Appointment" button
3. Fill in the form
4. Click "Save"

**Toggle Theme:**
1. Click the sun/moon icon in the header
2. Watch the theme switch smoothly

**Search Customers:**
1. Go to "Customers" page
2. Type in the search bar
3. Results filter in real-time

---

## Key Pages & Routes

| Route | Page | Description |
|-------|------|-------------|
| `/` | Login | Sign in page |
| `/register` | Register | Sign up page |
| `/forgot-password` | Reset | Password reset |
| `/onboarding` | Onboarding | 6-step wizard |
| `/dashboard` | Overview | Dashboard home |
| `/dashboard/calls` | Calls | Call management |
| `/dashboard/appointments` | Appointments | Booking system |
| `/dashboard/customers` | Customers | CRM |
| `/settings/ai-assistant` | AI Settings | Configure AI |
| `/settings/phone-numbers` | Phone | Number settings |
| `/settings/business` | Business | Profile & hours |
| `/settings/billing` | Billing | Plans & payment |

---

## Testing the App

### Test Login
```
Email: admin@callnfy.com
Password: password (or anything)
```

### Test Registration
1. Go to `/register`
2. Fill in any details
3. Click "Sign Up"
4. Complete onboarding wizard

### Test Calls Page
- Filter by date (Today, Last 7 days, etc.)
- Click a call row to see transcript
- View AI summary and call details

### Test Appointments
- Toggle between Calendar and List view
- Click "Add Appointment"
- Fill in form and save

### Test Theme
- Click sun/moon icon in header
- Theme switches instantly
- Preference saved to localStorage

---

## Mock Data Overview

The app includes realistic mock data:

- **15 Customers** - Full profiles with contact info
- **15 Calls** - With transcripts and AI summaries
- **20 Appointments** - Past and upcoming
- **10 Services** - Haircut, color, massage, etc.
- **5 Billing Records** - Payment history

All data is in `src/data/mockData.js`

---

## Customization Guide

### Change Primary Color
Edit `tailwind.config.js`:
```javascript
colors: {
  primary: '#your-color',
}
```

### Change Business Name
Edit `src/components/Sidebar.jsx`:
```javascript
<div className="text-xl font-bold">Your Business</div>
```

### Add New Service
Edit `src/data/mockData.js`:
```javascript
export const services = [
  { id: 11, name: 'New Service', duration: 60, price: 75 },
  // ...
];
```

### Change Language
The app supports EN and TR. To switch:
```javascript
// In any component
import { useTranslation } from './hooks/useTranslation';

function MyComponent() {
  const { changeLanguage } = useTranslation();

  return (
    <button onClick={() => changeLanguage('tr')}>
      Türkçe
    </button>
  );
}
```

---

## Troubleshooting

### Port Already in Use
If port 5173 is busy:
```bash
npm run dev -- --port 3000
```

### Build Fails
Clear cache and rebuild:
```bash
rm -rf node_modules dist
npm install
npm run build
```

### Theme Not Switching
Check browser console for errors. Theme state is saved to localStorage.

### Mock Data Not Showing
Ensure you're logged in (any credentials work). Check `src/data/mockData.js` exists.

---

## Next Steps

### For Development
1. ✅ App is running
2. Explore all pages
3. Test responsive design (resize browser)
4. Try dark/light theme toggle
5. Review mock data structure

### For Production
1. Replace mock auth with real API
2. Connect to backend database
3. Add real-time WebSocket updates
4. Deploy to Vercel/Netlify/AWS

### For Learning
1. Study component structure in `src/components/`
2. Review routing in `src/App.jsx`
3. Understand Tailwind usage
4. Explore theme system in `src/hooks/useTheme.js`

---

## Pro Tips

1. **Dark Mode by Default** - The app loads in dark mode. Toggle with sun/moon icon.

2. **Search is Real-Time** - On Customers page, search filters as you type.

3. **Calendar View** - Appointments page has a beautiful monthly calendar view.

4. **Call Transcripts** - Click any call to see full AI-generated transcript and summary.

5. **Responsive Sidebar** - On mobile, sidebar becomes a hamburger menu.

6. **i18n Ready** - Full English and Turkish translations included.

---

## Resources

- **README.md** - Comprehensive documentation
- **PROJECT_SUMMARY.md** - Full project overview
- **src/data/mockData.js** - All mock data
- **tailwind.config.js** - Color customization

---

## Need Help?

- Check README.md for detailed documentation
- Review inline code comments
- Explore `src/components/ui/` for component examples
- All mock data is in `src/data/mockData.js`

---

**You're all set! Start exploring the dashboard.** 🚀

```bash
npm run dev
```

Then open: **http://localhost:5173**

Happy coding! ✨
