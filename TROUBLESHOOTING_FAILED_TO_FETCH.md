# Failed to Fetch Error - Troubleshooting Guide

## 🔍 Error Analysis

**Error Message:** `Failed to load districts: TypeError: Failed to fetch (Code: NO_CODE)`

This is a **network-level error** that occurs before the request reaches Supabase. The browser cannot establish a connection to the Supabase server.

---

## 🎯 Most Likely Causes (In Order of Probability)

### 1. **Environment Variables Not Set in Vercel** (90% likely)
The `VITE_SUPABASE_URL` or `VITE_SUPABASE_ANON_KEY` are missing or incorrect in Vercel.

### 2. **Wrong Supabase URL**
The URL is malformed or points to the wrong project.

### 3. **CORS Issue**
Supabase is blocking requests from your domain.

### 4. **Network Connectivity**
Cannot reach Supabase servers (rare in production).

---

## 🔧 Diagnostic Steps

### Step 1: Check Browser Console

Open your production website and check the browser console (F12 → Console).

**Look for these messages:**

```
[SUPABASE] Initializing with environment variables
[SUPABASE] URL: https://your-project.supabase.co
[SUPABASE] Anon Key (first 20 chars): eyJhbGciOiJIUzI1NiIs...
[SUPABASE] URL format is valid
```

**If you see:**
```
[SUPABASE] CRITICAL: Missing environment variables: VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY
```
→ **Problem:** Environment variables not set in Vercel  
→ **Solution:** See "Fix #1" below

**If you see:**
```
[SUPABASE] ERROR: Invalid URL format: undefined
```
→ **Problem:** URL is undefined or malformed  
→ **Solution:** Check Vercel environment variables

---

### Step 2: Verify Vercel Environment Variables

1. Go to **Vercel Dashboard** → Your Project → **Settings** → **Environment Variables**
2. Check these variables exist for **Production**:

```
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Important:**
- Must have `VITE_` prefix
- Must be set for **Production** environment
- After adding/changing, you must **redeploy**

---

### Step 3: Get Correct Values from Supabase

1. Go to **Supabase Dashboard** → Your Project
2. Click **Settings** → **API**
3. Copy these values:

**Project URL:**
```
https://your-project-id.supabase.co
```

**anon public key:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Important:** Use the **anon public** key, NOT the service_role key!

---

### Step 4: Test Supabase Connection Manually

Open browser console and run:

```javascript
// Test if you can reach Supabase
fetch('https://your-project-id.supabase.co/rest/v1/', {
  method: 'GET',
  headers: {
    'apikey': 'your-anon-key',
    'Authorization': 'Bearer your-anon-key'
  }
})
.then(response => console.log('Success:', response))
.catch(error => console.error('Error:', error));
```

**If this fails:**
- Check your Supabase URL is correct
- Check your internet connection
- Check Supabase project is active

---

## ✅ Solutions

### Fix #1: Set Environment Variables in Vercel

1. Go to **Vercel Dashboard** → Your Project → **Settings** → **Environment Variables**
2. Click **Add New Environment Variable**
3. Add `VITE_SUPABASE_URL`:
   - **Name:** `VITE_SUPABASE_URL`
   - **Value:** `https://your-project-id.supabase.co`
   - **Environment:** Select **Production** (and Preview/Development if needed)
   - Click **Save**
4. Add `VITE_SUPABASE_ANON_KEY`:
   - **Name:** `VITE_SUPABASE_ANON_KEY`
   - **Value:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (your anon key)
   - **Environment:** Select **Production**
   - Click **Save**
5. Go to **Deployments** → Latest deployment → Click **⋮** → **Redeploy**
6. Wait for deployment to complete
7. Hard refresh browser (Ctrl+Shift+R or Cmd+Shift+R)

---

### Fix #2: Verify Supabase URL Format

**Correct format:**
```
https://your-project-id.supabase.co
```

**Incorrect formats:**
```
❌ http://your-project-id.supabase.co  (missing 's' in https)
❌ https://your-project-id.supabase.co/  (trailing slash)
❌ your-project-id.supabase.co  (missing https://)
❌ https://supabase.co/your-project-id  (wrong format)
```

---

### Fix #3: Check Supabase Project Status

1. Go to **Supabase Dashboard**
2. Verify your project is **Active** (not paused)
3. Check you're using the correct project
4. Verify the project URL matches your environment variable

---

### Fix #4: CORS Configuration (Rare)

If you're still getting "Failed to fetch" after verifying everything:

1. Go to **Supabase Dashboard** → Your Project → **Authentication** → **URL Configuration**
2. Check **Site URL** is set correctly
3. Check **Redirect URLs** includes your Vercel domain

**Example:**
```
Site URL: https://your-vercel-app.vercel.app
Redirect URLs: https://your-vercel-app.vercel.app/**
```

---

## 🧪 Testing After Fix

After applying the fix, check browser console for:

```
[SUPABASE] Initializing with environment variables
[SUPABASE] URL: https://your-project.supabase.co
[SUPABASE] Anon Key (first 20 chars): eyJhbGciOiJIUzI1NiIs...
[SUPABASE] URL format is valid
[LOCATION DEBUG] Fetching districts...
[LOCATION DEBUG] Testing Supabase connection...
[LOCATION DEBUG] Supabase connection successful
[LOCATION DEBUG] Districts fetched: 75
```

**If you see all these messages → Problem solved! ✅**

---

## 🚨 Common Mistakes

### Mistake 1: Using service_role key instead of anon key
```
❌ VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...service-role-key
✅ VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...anon-public-key
```

### Mistake 2: Missing VITE_ prefix
```
❌ SUPABASE_URL=https://your-project.supabase.co
✅ VITE_SUPABASE_URL=https://your-project.supabase.co
```

### Mistake 3: Setting variables for wrong environment
```
❌ Set only for "Development" but deploying to "Production"
✅ Set for "Production" (and optionally "Preview" and "Development")
```

### Mistake 4: Not redeploying after changing variables
```
❌ Changed environment variables but didn't redeploy
✅ After changing variables, click "Redeploy" in Vercel
```

### Mistake 5: Browser cache
```
❌ Old code still cached in browser
✅ Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
```

---

## 📊 Diagnostic Checklist

Run through this checklist:

- [ ] Browser console shows `[SUPABASE] Initializing with environment variables`
- [ ] Browser console shows `[SUPABASE] URL: https://...`
- [ ] URL is not `undefined` or `placeholder`
- [ ] URL format is valid (starts with `https://`)
- [ ] Anon key is not `undefined` or `placeholder`
- [ ] Anon key starts with `eyJhbGciOiJIUzI1NiIs...`
- [ ] Environment variables set in Vercel for **Production**
- [ ] Variables have `VITE_` prefix
- [ ] Redeployed after setting variables
- [ ] Hard refreshed browser
- [ ] Supabase project is **Active** (not paused)
- [ ] Using correct Supabase project
- [ ] Using **anon public** key (not service_role)

---

## 🔍 Advanced Debugging

### Check Network Tab

1. Open DevTools → **Network** tab
2. Refresh the page
3. Look for requests to `*.supabase.co`
4. Check:
   - **Status code:** Should be 200, not 404/500/CORS error
   - **Request URL:** Should match your `VITE_SUPABASE_URL`
   - **Request Headers:** Should include `apikey` and `Authorization`
   - **Response:** Should contain data, not error

### Check Request Details

Click on a Supabase request in Network tab:

**Headers:**
```
apikey: your-anon-key
Authorization: Bearer your-anon-key
```

**If headers are missing:**
→ Environment variables not set correctly

**If URL is wrong:**
→ Check `VITE_SUPABASE_URL` value

---

## 📞 Still Not Working?

If you've tried all the above and still getting "Failed to fetch":

1. **Share your browser console logs** (first 20 lines)
2. **Share your Network tab** (Supabase request details)
3. **Verify environment variables** (screenshot from Vercel, hide actual values)
4. **Check Supabase project** (is it active? correct project?)

---

## 🎯 Quick Fix Summary

**Most likely solution:**

1. Go to Vercel → Settings → Environment Variables
2. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` for Production
3. Get values from Supabase → Settings → API
4. Redeploy
5. Hard refresh browser

**Time to fix:** 5 minutes

---

## ✅ Success Indicators

After fixing, you should see in browser console:

```
[SUPABASE] Initializing with environment variables
[SUPABASE] URL: https://your-project.supabase.co
[SUPABASE] URL format is valid
[LOCATION DEBUG] Testing Supabase connection...
[LOCATION DEBUG] Supabase connection successful
[LOCATION DEBUG] Districts fetched: 75
```

And the district dropdown should load with 75 districts! 🎉
