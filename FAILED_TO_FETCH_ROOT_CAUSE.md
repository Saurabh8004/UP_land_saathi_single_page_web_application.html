# "Failed to fetch" Error - Root Cause Analysis

## 🎯 Most Likely Cause

**Environment variables were not set at BUILD TIME in Vercel.**

Vite embeds environment variables into the JavaScript bundle during the build process. If `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` were not set when the project was built, the deployed code contains `undefined` or placeholder values.

---

## 🔍 How to Confirm This Is the Issue

### Step 1: Open Browser Console

1. Go to your production website
2. Press **F12** to open Developer Tools
3. Click **Console** tab
4. Look for these messages:

**If you see this:**
```
[SUPABASE] CRITICAL: Missing environment variables: VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY
[SUPABASE] Using fallback URL: https://placeholder.supabase.co
[SUPABASE] Using fallback key: placeholder-key...
[LOCATION DEBUG] Supabase URL from env: undefined
[LOCATION ERROR] Network error: Cannot connect to Supabase at undefined/placeholder
```

**→ CONFIRMED:** Environment variables are missing from the build

**If you see this:**
```
[SUPABASE] Initializing with environment variables
[SUPABASE] URL: https://your-project.supabase.co
[SUPABASE] Anon Key (first 20 chars): eyJhbGciOiJIUzI1NiIs...
[SUPABASE] URL format is valid
[LOCATION DEBUG] Supabase URL from env: https://your-project.supabase.co
[LOCATION DEBUG] Testing Supabase connection...
[LOCATION ERROR] Network error: Cannot connect to Supabase at https://your-project.supabase.co
```

**→ Different issue:** URL is set but connection is failing (CORS, DNS, network)

---

## ✅ Solution: Rebuild with Environment Variables

### Step 1: Set Environment Variables in Vercel

1. Go to **Vercel Dashboard** → Your Project → **Settings** → **Environment Variables**
2. Add these for **Production** environment:

```
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Important:** 
- Must have `VITE_` prefix
- Must be set for **Production** (not just Preview/Development)
- Get values from Supabase Dashboard → Settings → API

### Step 2: Redeploy

After setting environment variables, you **MUST redeploy**:

1. Go to **Vercel** → **Deployments** tab
2. Find the latest deployment
3. Click **⋮** (three dots) → **Redeploy**
4. Wait for deployment to complete (2-5 minutes)

**Why redeploy is necessary:**
- Vite embeds environment variables at BUILD TIME
- Setting variables after the build doesn't update the deployed code
- Redeploying creates a new build with the variables embedded

### Step 3: Hard Refresh Browser

After redeployment:
1. Open your production website
2. Press **Ctrl+Shift+R** (Windows/Linux) or **Cmd+Shift+R** (Mac)
3. This clears the browser cache and loads the new build

---

## 🔬 Advanced Diagnostics

### Check Network Tab

1. Open DevTools → **Network** tab
2. Refresh the page
3. Filter by "supabase" or look for requests to `*.supabase.co`
4. Check the request details:

**Request URL should be:**
```
https://your-project-id.supabase.co/rest/v1/districts?select=count&limit=1
```

**If you see:**
```
https://placeholder.supabase.co/rest/v1/districts...
```
→ Environment variables not embedded in build

**If request shows:**
- **Status:** `(failed)` or `net::ERR_FAILED`
- **Type:** `fetch`
- **Initiator:** Your JavaScript bundle

→ Network-level failure (URL is wrong or unreachable)

### Check Request Headers

Click on the failed request and check **Headers** tab:

**Should see:**
```
apikey: eyJhbGciOiJIUzI1NiIs...
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

**If headers are missing:**
→ Anon key not set correctly

**If URL is wrong:**
→ VITE_SUPABASE_URL not set or incorrect

---

## 🧪 Quick Test

Run this in browser console to test the connection:

```javascript
// Test if you can reach Supabase
const url = 'https://your-project-id.supabase.co/rest/v1/';
const key = 'your-anon-key';

fetch(url, {
  method: 'GET',
  headers: {
    'apikey': key,
    'Authorization': `Bearer ${key}`
  }
})
.then(response => {
  console.log('✅ Success! Status:', response.status);
  console.log('Response:', response);
})
.catch(error => {
  console.error('❌ Failed:', error);
  console.error('This means the URL is unreachable or blocked');
});
```

Replace `your-project-id` and `your-anon-key` with actual values from Supabase Dashboard → Settings → API.

---

## 📊 Diagnostic Flowchart

```
"Failed to fetch" error
    ↓
Check browser console for:
    ↓
[SUPABASE] URL: ???
    ↓
├─ undefined/placeholder → Environment variables not in build
│   └─ Solution: Set VITE_SUPABASE_URL in Vercel and REDEPLOY
│
├─ https://your-project.supabase.co → URL is set
│   ↓
│   Check Network tab for request URL
│   ↓
│   ├─ placeholder.supabase.co → Build has old values
│   │   └─ Solution: REDEPLOY after setting variables
│   │
│   └─ your-project.supabase.co → URL is correct
│       ↓
│       Check request status
│       ↓
│       ├─ CORS error → Supabase blocking your domain
│       │   └─ Solution: Check Supabase CORS settings
│       │
│       ├─ DNS error → Wrong URL
│       │   └─ Solution: Verify Supabase project URL
│       │
│       └─ Network error → Connectivity issue
│           └─ Solution: Check internet, firewall, extensions
```

---

## 🚨 Common Mistakes

### Mistake 1: Setting variables but not redeploying
```
❌ Set VITE_SUPABASE_URL in Vercel
❌ Didn't redeploy
❌ Old build still has undefined values
```

**Fix:** Redeploy after setting variables

### Mistake 2: Setting variables for wrong environment
```
❌ Set variables for "Development" only
❌ Deploying to "Production"
❌ Production build doesn't have the variables
```

**Fix:** Set variables for **Production** environment

### Mistake 3: Missing VITE_ prefix
```
❌ SUPABASE_URL=https://...
✅ VITE_SUPABASE_URL=https://...
```

**Fix:** Add `VITE_` prefix to all client-side environment variables

### Mistake 4: Using service_role key
```
❌ VITE_SUPABASE_ANON_KEY=eyJ...service-role-key
✅ VITE_SUPABASE_ANON_KEY=eyJ...anon-public-key
```

**Fix:** Use the **anon public** key from Supabase Dashboard → Settings → API

### Mistake 5: Not hard refreshing browser
```
❌ Old build cached in browser
✅ Hard refresh: Ctrl+Shift+R or Cmd+Shift+R
```

**Fix:** Hard refresh after redeployment

---

## ✅ Verification Checklist

After redeployment, verify:

- [ ] Browser console shows `[SUPABASE] URL: https://your-project.supabase.co`
- [ ] URL is NOT `undefined` or `placeholder`
- [ ] Browser console shows `[SUPABASE] URL format is valid`
- [ ] Network tab shows requests to `your-project.supabase.co`
- [ ] Requests include `apikey` and `Authorization` headers
- [ ] District dropdown loads 75 districts
- [ ] No "Failed to fetch" errors

---

## 📞 Still Not Working?

If you've verified all the above and still getting errors:

1. **Share browser console logs** (first 30 lines)
2. **Share Network tab screenshot** (showing the failed request)
3. **Verify environment variables** in Vercel (screenshot, hide actual values)
4. **Test manually** using the fetch test above

---

## 🎯 Summary

**Root cause:** Environment variables not embedded in build

**Solution:**
1. Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in Vercel
2. **REDEPLOY** the project
3. Hard refresh browser

**Time to fix:** 5 minutes

**Status:** ✅ Code updated with better diagnostics, awaiting redeployment
