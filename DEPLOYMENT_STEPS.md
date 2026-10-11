# Deployment Steps - Vercel

## 🚀 Deploy Updated Code to Production

Follow these steps exactly to deploy the district loading fix.

---

## Prerequisites

- [x] Code changes verified
- [x] Build successful
- [x] Database grants applied in Supabase
- [x] Git repository connected to Vercel

---

## Step 1: Commit and Push Changes

```bash
# Check what files changed
git status

# Expected changes:
# - src/services/locationService.ts
# - src/lib/supabase.ts
# - src/App.tsx
# - VERIFICATION_REPORT.md
# - DEPLOYMENT_STEPS.md

# Stage all changes
git add .

# Commit with descriptive message
git commit -m "fix: improve district loading error handling and diagnostics

- Enhanced error logging in locationService.ts to show actual Supabase errors
- Added environment variable validation in supabase.ts
- Improved error display in App.tsx for debugging
- No secrets exposed, only public anon key used
- Build successful, all verification checks passed"

# Push to repository
git push origin main
```

**Note:** If your default branch is `master` instead of `main`, use:
```bash
git push origin master
```

---

## Step 2: Verify Vercel Environment Variables

### Check Current Variables

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Click **Settings** → **Environment Variables**
4. Verify these exist for **Production**:

```
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### If Variables Are Missing

1. Click **Add New Environment Variable**
2. Add `VITE_SUPABASE_URL`:
   - **Name:** `VITE_SUPABASE_URL`
   - **Value:** Your Supabase project URL (from Supabase Dashboard → Settings → API)
   - **Environment:** Select **Production** (and optionally Preview/Development)
   - Click **Save**

3. Click **Add New Environment Variable** again
4. Add `VITE_SUPABASE_ANON_KEY`:
   - **Name:** `VITE_SUPABASE_ANON_KEY`
   - **Value:** Your Supabase anon/public key (from Supabase Dashboard → Settings → API)
   - **Environment:** Select **Production** (and optionally Preview/Development)
   - Click **Save**

### If Variables Need Updating

1. Click the **Edit** icon next to the variable
2. Update the value
3. Click **Save**

**Important:** After changing environment variables, you must redeploy (see Step 4).

---

## Step 3: Verify Automatic Deployment

Vercel should automatically deploy when you push to your repository.

### Check Deployment Status

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Click **Deployments** tab
4. You should see a new deployment in progress

### Wait for Deployment to Complete

- **Status:** Should show "Building" → "Deploying" → "Ready"
- **Duration:** Typically 2-5 minutes
- **Build Logs:** Click on the deployment to view logs

### Verify Build Success

In the deployment logs, look for:
```
✓ 1868 modules transformed
✓ Built in X.XXs
```

If you see errors:
- Check the build logs for details
- Common issues: TypeScript errors, missing dependencies
- Fix the issue, commit, and push again

---

## Step 4: Manual Redeploy (If Needed)

If you updated environment variables or the automatic deployment didn't trigger:

1. Go to **Deployments** tab
2. Find the latest deployment
3. Click the **⋮** (three dots) menu
4. Click **Redeploy**
5. Confirm the redeployment

---

## Step 5: Test Production Website

### Open Production URL

1. Go to your production URL (e.g., `https://your-project.vercel.app`)
2. Or click the **Visit** button in Vercel Dashboard

### Open Browser Console

1. Press **F12** (or right-click → Inspect)
2. Click **Console** tab
3. Clear any existing logs (click the 🚫 icon)

### Navigate to Property Search

1. Click on "Find Your Property" or navigate to the property search page
2. Watch the console for these logs:

**Success Logs:**
```
[SUPABASE] Initializing with environment variables
[SUPABASE] URL: https://your-project.supabase.co
[LOCATION DEBUG] Fetching districts...
[LOCATION DEBUG] Districts fetched: 75
[LOCATION DEBUG] First 3 districts: [Array(3)]
```

**If you see these logs, the fix is working! ✅**

### Test District Dropdown

1. Click on the **District** dropdown
2. Verify it shows **75 districts**
3. Try searching for "Amroha" or "Agra"
4. Select a district
5. Verify the **Tehsil** dropdown becomes enabled
6. Select a tehsil
7. Verify the **Village** dropdown becomes enabled

### Check Network Tab

1. In DevTools, click **Network** tab
2. Refresh the page
3. Look for Supabase API calls (filter by "supabase" or "rest")
4. Verify they return **200 OK** status
5. Check the response contains district data

---

## Step 6: Verify Error Handling (Optional)

### Test Missing Environment Variables

To verify error diagnostics work:

1. Temporarily remove `VITE_SUPABASE_URL` in Vercel
2. Redeploy
3. Open production website
4. Check console for:
   ```
   [SUPABASE] CRITICAL: Missing environment variables: VITE_SUPABASE_URL
   [SUPABASE] Please set these in Vercel Dashboard → Settings → Environment Variables
   ```
5. **Important:** Add the variable back and redeploy immediately!

### Test Database Connection Issues

If districts don't load, check console for specific errors:

**Permission Denied:**
```
[LOCATION ERROR] Failed to fetch districts: {
  code: "42501",
  message: "permission denied for table districts"
}
```
**Fix:** Re-run the GRANT statements in Supabase SQL Editor

**Table Not Found:**
```
[LOCATION ERROR] Failed to fetch districts: {
  code: "42P01",
  message: "relation \"districts\" does not exist"
}
```
**Fix:** Run the migration to create the districts table

**Invalid API Key:**
```
[LOCATION ERROR] Failed to fetch districts: {
  message: "Invalid API key"
}
```
**Fix:** Check `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in Vercel

---

## Step 7: Monitor for Issues

### Check Vercel Analytics

1. Go to **Analytics** tab in Vercel
2. Monitor for:
   - Increased error rates
   - Slow page loads
   - Failed API calls

### Check Supabase Logs

1. Go to Supabase Dashboard → **Logs**
2. Filter by **API** or **PostgREST**
3. Look for failed queries
4. Check for permission errors

### Set Up Error Monitoring (Recommended)

Consider adding error tracking:
- Sentry
- LogRocket
- Datadog

---

## Troubleshooting

### Issue: Districts Still Don't Load

**Check 1: Browser Console**
- Open F12 → Console
- Look for `[SUPABASE]` or `[LOCATION ERROR]` messages
- Note the exact error message and code

**Check 2: Network Tab**
- Open F12 → Network
- Look for failed requests to Supabase
- Check the response body for error details

**Check 3: Environment Variables**
- Verify `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set
- Verify they match your Supabase project
- Redeploy if you changed them

**Check 4: Database Grants**
```sql
-- In Supabase SQL Editor
SELECT table_name, grantee, privilege_type
FROM information_schema.role_table_grants
WHERE table_name = 'districts'
  AND grantee IN ('anon', 'authenticated');
```
Expected: 2 rows with SELECT privilege

**Check 5: RLS Policies**
```sql
-- In Supabase SQL Editor
SELECT tablename, policyname, cmd, roles::text
FROM pg_policies
WHERE tablename = 'districts';
```
Expected: SELECT policies for anon/authenticated

### Issue: Build Fails on Vercel

**Check Build Logs:**
1. Go to Vercel → Deployments
2. Click on the failed deployment
3. Check the build logs for errors

**Common Issues:**
- TypeScript errors → Fix the code and push again
- Missing dependencies → Run `npm install` locally, commit `package-lock.json`
- Environment variables not set → Add them in Vercel Settings

### Issue: Environment Variables Not Taking Effect

**Solution:**
1. Verify variables are set for the correct environment (Production/Preview/Development)
2. Redeploy the project (variables are baked into the build)
3. Hard refresh the browser (Ctrl+Shift+R or Cmd+Shift+R)
4. Clear browser cache if needed

---

## Rollback Plan

If the deployment causes issues:

### Option 1: Revert Code Changes

```bash
# Find the previous working commit
git log --oneline

# Revert to previous commit
git revert <commit-hash>

# Push the revert
git push origin main
```

### Option 2: Redeploy Previous Version

1. Go to Vercel → Deployments
2. Find the last working deployment
3. Click **⋮** → **Promote to Production**

### Option 3: Database Grants Are Safe

The GRANT statements don't break anything. If you need to rollback:
- Revert code changes
- Database grants can stay (they're additive)

---

## Post-Deployment Verification

### Complete Testing Checklist

- [ ] Production website loads without errors
- [ ] Browser console shows successful Supabase initialization
- [ ] District dropdown loads 75 districts
- [ ] Can select a district
- [ ] Tehsil dropdown loads for selected district
- [ ] Can select a tehsil
- [ ] Village dropdown loads for selected tehsil
- [ ] Can select a village
- [ ] Can proceed to next step (Gata/Khasra input)
- [ ] No errors in browser console
- [ ] No errors in Supabase logs
- [ ] Network requests return 200 OK

### Performance Check

- [ ] Page load time < 3 seconds
- [ ] District dropdown opens instantly
- [ ] No lag when selecting district/tehsil/village
- [ ] Smooth user experience

---

## Success Criteria

The deployment is successful when:

✅ District dropdown loads 75 districts  
✅ No "Failed to load districts" error in UI  
✅ Browser console shows successful data fetch  
✅ User can complete the full location selection flow  
✅ No errors in Supabase logs  
✅ No performance degradation  

---

## Support

If you encounter issues during deployment:

1. **Check browser console** - The improved error logging will show exact issues
2. **Check Vercel build logs** - Look for deployment errors
3. **Check Supabase logs** - Look for database query errors
4. **Review this guide** - Troubleshooting section covers common issues

---

## Next Steps After Successful Deployment

1. **Monitor for 24 hours** - Watch for any error reports
2. **Test on different devices** - Mobile, tablet, desktop
3. **Test on different browsers** - Chrome, Firefox, Safari, Edge
4. **Gather user feedback** - Confirm the district dropdown works for users
5. **Document the fix** - Update internal documentation

---

## Deployment Summary

**What Changed:**
- Improved error handling and logging
- Better environment variable diagnostics
- No breaking changes to functionality

**What Stayed the Same:**
- Database schema (no changes)
- API endpoints (no changes)
- User interface (no changes)
- Business logic (no changes)

**Risk Level:** 🟢 LOW
- Only error handling improved
- No breaking changes
- Backward compatible
- Easy to rollback if needed

**Estimated Deployment Time:** 5-10 minutes

---

## Final Checklist Before Deployment

- [ ] All code changes committed
- [ ] Build successful locally
- [ ] Database grants applied in Supabase
- [ ] Environment variables verified in Vercel
- [ ] Rollback plan documented
- [ ] Testing plan ready
- [ ] Team notified of deployment

**Ready to deploy?** Proceed with Step 1 above.
