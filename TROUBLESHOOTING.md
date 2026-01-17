# Troubleshooting Localhost Issues

## ✅ Server Status
The Next.js dev server IS running on port 3000.

## Common Issues & Solutions

### 1. **Can't Access http://localhost:3000**

**Check:**
- Open your browser and go to: `http://localhost:3000`
- Make sure you're using `localhost` not `127.0.0.1` (though both should work)
- Check if port 3000 is blocked by firewall

**Solution:**
```bash
# Kill any existing process on port 3000
lsof -ti:3000 | xargs kill -9

# Start fresh
cd /Users/kylaangeles/Desktop/Arbit-Backend
npm run dev
```

### 2. **Blank Page or Styles Not Loading**

**Check browser console:**
- Press F12 (or Cmd+Option+I on Mac)
- Look for errors in Console tab
- Check Network tab for failed requests

**Common fixes:**
- Hard refresh: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)
- Clear browser cache
- Check if CSS files are loading (Network tab)

### 3. **Images Not Showing**

**Check:**
- Images should be in: `public/images/cards/`
- Image paths in code use: `/images/cards/filename.jpg`

**Fix:**
```bash
# Verify images exist
ls -la public/images/cards/

# If missing, copy from original project
cp -r "/Users/kylaangeles/Desktop/ARBIT - CARDS/web-preview/public/images/cards/"* public/images/cards/
```

### 4. **JavaScript Errors**

**Check:**
- Open browser console (F12)
- Look for red error messages
- Common issues:
  - Module not found
  - Import errors
  - Type errors

**Fix:**
```bash
# Reinstall dependencies
cd /Users/kylaangeles/Desktop/Arbit-Backend
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### 5. **Port Already in Use**

**Check:**
```bash
lsof -ti:3000
```

**Fix:**
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use a different port
PORT=3001 npm run dev
```

### 6. **Build Errors**

**Check terminal output:**
- Look for TypeScript errors
- Check for missing dependencies
- Verify file paths

**Fix:**
```bash
# Check for TypeScript errors
npm run lint

# Rebuild
npm run build
```

## Quick Diagnostic Steps

1. **Verify server is running:**
   ```bash
   curl http://localhost:3000
   ```
   Should return HTML content.

2. **Check browser console:**
   - Open DevTools (F12)
   - Check Console for errors
   - Check Network tab for failed requests

3. **Verify files exist:**
   ```bash
   ls -la app/components/
   ls -la public/images/cards/
   ```

4. **Restart server:**
   ```bash
   # Stop current server (Ctrl+C)
   # Then restart
   cd /Users/kylaangeles/Desktop/Arbit-Backend
   npm run dev
   ```

## Still Not Working?

**Provide this information:**
1. What URL are you trying to access?
2. What do you see? (blank page, error message, etc.)
3. Any errors in browser console? (F12 → Console tab)
4. Any errors in terminal where you ran `npm run dev`?
