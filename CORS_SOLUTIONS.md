# CORS Error Solutions

This document provides multiple solutions to fix CORS (Cross-Origin Resource Sharing) errors in your React admin application.

## Current Configuration

Your API is hosted at: `https://api.jalsuvidha.com/`
Your frontend runs on: `http://localhost:5173` (development)

## Solutions Implemented

### 1. ✅ Vite Proxy Configuration (Development)

**File:** `vite.config.ts`

```typescript
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:5000", // Change to your backend URL
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, "/api"),
      },
    },
  },
});
```

**For your API, update to:**

```typescript
server: {
  proxy: {
    '/api': {
      target: 'https://api.jalsuvidha.com/',
      changeOrigin: true,
      secure: true, // Use true for HTTPS
      rewrite: (path) => path.replace(/^\/api/, '')
    }
  }
}
```

### 2. ✅ Enhanced API Client with CORS Support

**File:** `src/services/interceptor.ts`

- Added `withCredentials: true` for CORS requests
- Added request interceptor for auth tokens
- Added response interceptor for error handling

### 3. ✅ Environment Variables

**File:** `.env`

```properties
VITE_API_BASE_URL=https://api.jalsuvidha.com/
```

### 4. ✅ TypeScript Types

**File:** `src/types/api.ts`

- Proper TypeScript interfaces for API responses
- Type-safe service methods

## Alternative Solutions

### Option A: Backend CORS Configuration

If you control the backend, add CORS headers:

**Express.js Example:**

```javascript
const cors = require("cors");

app.use(
  cors({
    origin: ["http://localhost:5173", "https://your-production-domain.com"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
```

**Node.js without Express:**

```javascript
res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
res.setHeader(
  "Access-Control-Allow-Methods",
  "GET, POST, PUT, DELETE, OPTIONS"
);
res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
res.setHeader("Access-Control-Allow-Credentials", "true");
```

### Option B: Development-Specific Proxy

**Update Vite config for your specific API:**

```typescript
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "https://api.jalsuvidha.com/",
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
        configure: (proxy, options) => {
          proxy.on("error", (err, req, res) => {
            console.log("Proxy error", err);
          });
          proxy.on("proxyReq", (proxyReq, req, res) => {
            console.log("Sending Request to the Target:", req.method, req.url);
          });
          proxy.on("proxyRes", (proxyRes, req, res) => {
            console.log(
              "Received Response from the Target:",
              proxyRes.statusCode,
              req.url
            );
          });
        },
      },
    },
  },
});
```

### Option C: Update API Client Base URL

**For direct API calls (if CORS is enabled on backend):**

```typescript
const apiClient = axios.create({
  baseURL: "https://api.jalsuvidha.com/",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});
```

## Testing Solutions

### 1. Restart Development Server

```bash
npm run dev
```

### 2. Check Browser Console

- Open DevTools → Console
- Look for CORS-related errors
- Check Network tab for failed requests

### 3. Test API Endpoints

```typescript
// Test in browser console
fetch("/api/admin/temples")
  .then((res) => res.json())
  .then((data) => console.log(data))
  .catch((err) => console.error(err));
```

## Production Deployment

### Environment Variables for Production

```properties
# .env.production
VITE_API_BASE_URL=https://api.jalsuvidha.com/
```

### Build Configuration

```typescript
// vite.config.ts - Production optimized
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  server:
    mode === "development"
      ? {
          proxy: {
            "/api": {
              target: "https://api.jalsuvidha.com/",
              changeOrigin: true,
              secure: true,
              rewrite: (path) => path.replace(/^\/api/, ""),
            },
          },
        }
      : {},
}));
```

## Troubleshooting

### Common Issues:

1. **Preflight OPTIONS requests failing**

   - Backend must handle OPTIONS requests
   - Add CORS middleware on backend

2. **Credentials not being sent**

   - Set `withCredentials: true` in axios
   - Backend must allow credentials

3. **SSL/HTTPS issues**
   - Set `secure: true` for HTTPS targets
   - Check SSL certificates

### Debug Steps:

1. **Check Network Tab:**

   - Is the request being made?
   - What's the actual URL being called?
   - Are CORS headers present in response?

2. **Verify Proxy:**

   ```bash
   # Check if proxy is working
   curl -X GET http://localhost:5173/api/admin/temples
   ```

3. **Test Direct API Call:**
   ```bash
   # Test API directly
   curl -X GET https://api.jalsuvidha.com//admin/temples
   ```

## Next Steps

1. **Restart your development server** to apply Vite proxy changes
2. **Update your Vite config** with the correct target URL for your API
3. **Test the API calls** in your application
4. **Check browser console** for any remaining errors

The proxy configuration should resolve your CORS issues for development. For production, ensure your backend has proper CORS headers configured.
