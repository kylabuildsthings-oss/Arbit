# How to Fix the API URL Issue

## The Problem
Your `.env.local` has the wrong API URL: `https://api.pearprotocol.io`
It should be: `https://hl-v2.pearprotocol.io`

## The Solution

### Step 1: Update `.env.local`

Edit the file and change this line:
```
NEXT_PUBLIC_PEAR_API_URL=https://api.pearprotocol.io
```

To this:
```
NEXT_PUBLIC_PEAR_API_URL=https://hl-v2.pearprotocol.io
```

### Step 2: Fully Restart Next.js

**IMPORTANT**: In Next.js, `NEXT_PUBLIC_` environment variables are embedded at build time. You need to:

1. **Stop the dev server** completely (Ctrl+C)
2. **Kill any remaining processes** if needed
3. **Delete the `.next` folder** (this clears cached builds):
   ```bash
   rm -rf .next
   ```
4. **Start the server again**:
   ```bash
   npm run dev
   ```

### Step 3: Test Again

```bash
curl http://localhost:3000/api/test-auth
```

You should now see `"apiUrl":"https://hl-v2.pearprotocol.io"` in the response.

## Alternative: Remove the Variable

If you want to use the default (which is already correct), just **delete or comment out** the `NEXT_PUBLIC_PEAR_API_URL` line in `.env.local`:

```bash
# NEXT_PUBLIC_PEAR_API_URL=https://api.pearprotocol.io
```

Then restart as above.

