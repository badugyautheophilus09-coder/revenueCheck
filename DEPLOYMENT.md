# TEO Revenue Tracker - Deployment Instructions

## Local Development

To run the application locally:

```bash
cd teo-revenue-tracker
npm run dev
```

The app will be available at `http://localhost:3000`

## Deployment to Vercel

### Prerequisites
- A Vercel account (free tier works)
- Git repository (GitHub, GitLab, or Bitbucket)

### Step 1: Push to Git Repository

1. Initialize git if not already done:
```bash
cd teo-revenue-tracker
git init
git add .
git commit -m "Initial commit - TEO Revenue Tracker"
```

2. Create a repository on GitHub/GitLab/Bitbucket
3. Add remote and push:
```bash
git remote add origin <your-repository-url>
git branch -M main
git push -u origin main
```

### Step 2: Deploy to Vercel

#### Option A: Via Vercel Dashboard (Recommended)

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "Add New Project"
3. Import your git repository
4. Vercel will automatically detect Next.js
5. Configure build settings (if needed):
   - **Framework Preset**: Next.js
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `.next` (auto-detected)
   - **Install Command**: `npm install` (auto-detected)
6. Click "Deploy"

#### Option B: Via Vercel CLI

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

3. Deploy:
```bash
cd teo-revenue-tracker
vercel
```

4. Follow the prompts to deploy

### Step 3: Environment Variables

This application does not require any environment variables. All data is stored locally in the user's browser using LocalStorage.

### Step 4: Custom Domain (Optional)

1. Go to your project settings in Vercel
2. Navigate to "Domains"
3. Add your custom domain
4. Follow the DNS configuration instructions

## PWA Configuration

The application is configured as a Progressive Web App (PWA):

- **Manifest**: `/public/manifest.json`
- **Service Worker**: `/public/sw.js`
- **Theme Color**: Emerald green (#10b981)
- **Display Mode**: Standalone

The PWA will work offline after the first visit using the service worker caching strategy.

## Features Verification

After deployment, verify the following features:

1. **Revenue Tracking**: Test adding revenue for different days
2. **Calculations**: Verify weekly and monthly totals
3. **Navigation**: Test week and month navigation
4. **Currency**: Test currency switching in settings
5. **Dark Mode**: Test theme switching
6. **Data Persistence**: Refresh page and verify data is saved
7. **Export**: Test JSON and CSV export functionality
8. **Mobile**: Test on mobile device for responsiveness
9. **PWA**: Test installation on mobile device

## Troubleshooting

### Build Errors

If you encounter build errors:

1. Ensure all dependencies are installed:
```bash
npm install
```

2. Check Node.js version (should be 18+):
```bash
node --version
```

3. Clear Next.js cache:
```bash
rm -rf .next
npm run build
```

### PWA Issues

If PWA features don't work:

1. Check that the service worker is registered in browser DevTools
2. Verify manifest.json is accessible at `/manifest.json`
3. Check browser console for service worker errors

### LocalStorage Issues

If data doesn't persist:

1. Check browser LocalStorage in DevTools
2. Ensure browser doesn't block LocalStorage
3. Try in incognito mode (some browsers restrict LocalStorage)

## Performance Optimization

The application is already optimized with:

- Next.js automatic code splitting
- Tailwind CSS for minimal CSS bundle
- Client-side only rendering for PWA features
- Recharts for efficient charting
- LocalStorage for instant data access

## Support

For issues or questions:

1. Check the browser console for errors
2. Verify LocalStorage is enabled
3. Test in different browsers
4. Check Vercel deployment logs

## Application Structure

```
teo-revenue-tracker/
├── src/
│   ├── app/
│   │   ├── layout.tsx       # Root layout with theme provider
│   │   ├── page.tsx         # Home/dashboard page
│   │   ├── reports/
│   │   │   └── page.tsx     # Reports page
│   │   └── settings/
│   │       └── page.tsx     # Settings page
│   ├── components/
│   │   ├── Dashboard.tsx    # Main dashboard component
│   │   ├── WeeklyRevenue.tsx # Weekly revenue input
│   │   ├── MonthlyRevenue.tsx # Monthly revenue display
│   │   ├── RevenueChart.tsx # Chart component
│   │   ├── RevenueCard.tsx  # Stat card component
│   │   ├── RevenueInput.tsx # Input component
│   │   ├── Header.tsx       # App header
│   │   ├── BottomNavigation.tsx # Mobile nav
│   │   ├── ThemeProvider.tsx # Theme management
│   │   ├── ServiceWorkerRegister.tsx # PWA registration
│   │   ├── Toast.tsx        # Notification component
│   │   └── EmptyState.tsx   # Empty state component
│   └── lib/
│       ├── storage.ts       # LocalStorage utilities
│       ├── calculations.ts  # Revenue calculations
│       └── formatting.ts    # Currency/date formatting
├── public/
│   ├── manifest.json       # PWA manifest
│   ├── sw.js               # Service worker
│   └── icon.svg            # App icon
└── package.json
```

## Version History

- **v1.0.0**: Initial release with full revenue tracking functionality