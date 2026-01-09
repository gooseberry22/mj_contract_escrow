# SPA Routing Configuration

This document explains the Single Page Application (SPA) routing configuration for AWS Amplify.

## Application Routing Type

The application uses **state-based navigation** (not URL-based routing):
- Navigation is handled through React state (`useState`)
- Page changes are managed via callbacks and state updates
- No URL routing library (React Router) is used

## Why SPA Redirect Rules Are Still Needed

Even though the app doesn't use URL-based routing, we still need redirect rules for:

1. **Direct URL Access**
   - If someone types a URL directly (e.g., `https://yourdomain.com/dashboard`)
   - Amplify needs to serve `index.html` so the app can load

2. **Page Refreshes**
   - When a user refreshes the page, the browser requests that URL
   - Amplify needs to serve `index.html` instead of returning 404

3. **404 Error Handling**
   - Any 404 errors should redirect to `index.html`
   - The app can then handle the error or show the home page

4. **Deep Linking (Future)**
   - If URL-based routing is added later, the redirect rules will already be in place

## Amplify Configuration

### Rewrites
```yaml
rewrites:
  - source: '/<*>'
    target: '/index.html'
    status: '200'
```
- Rewrites all paths to `index.html` with 200 status
- Ensures the app loads for any URL

### Redirects
```yaml
redirects:
  - source: '/<*>'
    target: '/index.html'
    status: '404'
```
- Redirects 404 errors to `index.html`
- Handles cases where files don't exist

### Custom Headers
Security headers are also configured:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`

## How It Works

1. **User visits any URL** (e.g., `/dashboard`, `/payments`, `/nonexistent`)
2. **Amplify checks** if the file exists
3. **If file doesn't exist** (404), redirects to `/index.html`
4. **App loads** and handles the route internally
5. **App shows appropriate page** based on state

## Testing SPA Routing

### Test Direct URL Access
1. Deploy to Amplify
2. Try accessing: `https://yourdomain.com/dashboard`
3. App should load (even if it shows home page initially)

### Test Page Refresh
1. Navigate to a page in the app
2. Refresh the browser
3. App should reload correctly

### Test 404 Handling
1. Try accessing: `https://yourdomain.com/nonexistent-page`
2. Should redirect to `index.html` and show the app

## Current Navigation Flow

The app uses state-based navigation:

```typescript
const [currentPage, setCurrentPage] = useState<Page>('home');

// Navigation examples:
setCurrentPage('dashboard');
setCurrentPage('payments');
setCurrentPage('login');
```

### Available Pages
- `home` - Landing page
- `login` - Login page
- `create-account` - Account creation
- `dashboard` - Main dashboard
- `payments` - Payments page
- `milestones` - Milestones page
- `support` - Support page
- And more...

## Future: Adding URL-Based Routing

If you want to add URL-based routing in the future:

1. **Install React Router**:
   ```bash
   npm install react-router-dom
   ```

2. **Update App.tsx** to use routes:
   ```typescript
   import { BrowserRouter, Routes, Route } from 'react-router-dom';
   
   <BrowserRouter>
     <Routes>
       <Route path="/" element={<Home />} />
       <Route path="/dashboard" element={<Dashboard />} />
       <Route path="/payments" element={<Payments />} />
     </Routes>
   </BrowserRouter>
   ```

3. **The redirect rules will already work** - no changes needed to `amplify.yml`

## Troubleshooting

### App shows 404 page
- Check that redirect rules are in `amplify.yml`
- Verify `rewrites` and `redirects` sections are correct
- Ensure `baseDirectory: build` is set correctly

### App doesn't load on refresh
- Verify redirect rules are configured
- Check browser console for errors
- Ensure `index.html` exists in build output

### Direct URL access doesn't work
- Check Amplify Console → Rewrites and redirects
- Verify the rules are deployed
- Test with a fresh browser session (clear cache)

## Related Files

- `amplify.yml` - Amplify build configuration with redirect rules
- `src/App.tsx` - Main app component with state-based navigation
- `build/index.html` - Entry point HTML file

## Additional Resources

- [AWS Amplify Rewrites and Redirects](https://docs.aws.amazon.com/amplify/latest/userguide/redirects.html)
- [SPA Routing Best Practices](https://docs.aws.amazon.com/amplify/latest/userguide/redirects.html#redirects-for-single-page-web-apps-spa)


