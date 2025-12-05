# Easy Configurable Router Setup

This admin application now includes a comprehensive and easy-to-configure routing system using React Router v6.

## Features

✅ **Centralized Route Configuration** - All routes defined in one place  
✅ **Multiple Layout Support** - Auth, Main, and Blank layouts  
✅ **Protected Routes** - Authentication-based route protection  
✅ **Lazy Loading** - Code-splitting for better performance  
✅ **Navigation Menu** - Auto-generated from route configuration  
✅ **Authentication Context** - Complete auth state management

## Quick Start

The application is now running at **http://localhost:5173/**

### Demo Login Credentials

- **Email:** admin@bhaktiapp.com
- **Password:** admin123

## Project Structure

```
src/
├── components/
│   ├── auth/
│   │   ├── Login.tsx              # Login component
│   │   └── ProtectedRoute.tsx     # Route protection wrapper
│   └── layout/
│       ├── MainLayout.tsx         # Main app layout with sidebar
│       ├── AuthLayout.tsx         # Authentication pages layout
│       └── BlankLayout.tsx        # Minimal layout
├── contexts/
│   └── AuthContext.tsx            # Authentication state management
├── pages/
│   ├── Dashboard.tsx              # Dashboard page
│   ├── PujaTypes.tsx             # Puja types listing
│   ├── Profile.tsx               # User profile page
│   └── Settings.tsx              # App settings page
├── router/
│   ├── routes.ts                 # Centralized route configuration
│   └── AppRouter.tsx             # Main router component
└── App.tsx                       # Root component with providers
```

## Adding New Routes

### 1. Create Your Component

```tsx
// src/pages/MyNewPage.tsx
import React from "react";

const MyNewPage: React.FC = () => {
  return (
    <div>
      <h1>My New Page</h1>
      <p>Content goes here...</p>
    </div>
  );
};

export default MyNewPage;
```

### 2. Add Route to Configuration

```tsx
// src/router/routes.ts
import MyNewPage from "../pages/MyNewPage";

export const routes: RouteConfig[] = [
  // ... existing routes
  {
    path: "/my-new-page",
    name: "My New Page",
    component: MyNewPage,
    requiresAuth: true, // Set to false for public routes
    layout: "main", // 'main', 'auth', or 'blank'
    meta: {
      title: "My New Page - Admin Panel",
      description: "Description of my new page",
      icon: "page", // Icon identifier
      showInNavigation: true, // Show in sidebar menu
    },
  },
];
```

### 3. Update Router (if using lazy loading)

```tsx
// src/router/AppRouter.tsx
const MyNewPage = lazy(() => import('../pages/MyNewPage'));

// Add to router configuration
{
  path: 'my-new-page',
  element: (
    <ProtectedRoute>
      <Suspense fallback={<Loading />}>
        <MyNewPage />
      </Suspense>
    </ProtectedRoute>
  )
}
```

## Route Configuration Options

| Property                | Type      | Description                           |
| ----------------------- | --------- | ------------------------------------- |
| `path`                  | string    | URL path for the route                |
| `name`                  | string    | Display name (used in navigation)     |
| `component`             | Component | React component to render             |
| `requiresAuth`          | boolean   | Whether authentication is required    |
| `layout`                | string    | Layout type ('main', 'auth', 'blank') |
| `meta.title`            | string    | Page title                            |
| `meta.icon`             | string    | Icon identifier for navigation        |
| `meta.showInNavigation` | boolean   | Show in sidebar menu                  |

## Layouts

### MainLayout

- Includes sidebar navigation
- Header with user info
- Used for authenticated pages
- Auto-generates navigation from routes

### AuthLayout

- Centered login form
- Beautiful gradient background
- Used for login/register pages

### BlankLayout

- Minimal layout
- Just renders the page component
- Used for special pages (404, maintenance, etc.)

## Authentication

The app includes a complete authentication system:

### AuthContext

- `isAuthenticated` - Current auth status
- `user` - Current user data
- `login(email, password)` - Login function
- `logout()` - Logout function
- `loading` - Loading state

### Protected Routes

Routes with `requiresAuth: true` are automatically protected and redirect to login if user is not authenticated.

## Navigation

Navigation menu is auto-generated from routes with `meta.showInNavigation: true`.

Icons supported:

- `dashboard` → 📊
- `temple` → 🏛️
- `user` → 👤
- `settings` → ⚙️

## Customization

### Adding New Layouts

1. Create layout component in `src/components/layout/`
2. Update `getLayoutComponent` in `AppRouter.tsx`
3. Use new layout type in route configuration

### Custom Authentication

Replace the mock authentication in `AuthContext.tsx` with your actual API calls:

```tsx
const login = async (email: string, password: string): Promise<boolean> => {
  try {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      const { token, user } = await response.json();
      localStorage.setItem("authToken", token);
      setIsAuthenticated(true);
      setUser(user);
      return true;
    }
    return false;
  } catch (error) {
    console.error("Login error:", error);
    return false;
  }
};
```

## Available Routes

| Route             | Description          | Auth Required |
| ----------------- | -------------------- | ------------- |
| `/login`          | Login page           | No            |
| `/`               | Dashboard (redirect) | Yes           |
| `/dashboard`      | Main dashboard       | Yes           |
| `/puja-types`     | Puja types listing   | Yes           |
| `/puja-types/add` | Add new puja type    | Yes           |
| `/profile`        | User profile         | Yes           |
| `/settings`       | App settings         | Yes           |

## Best Practices

1. **Route Organization** - Keep all route definitions in `routes.ts`
2. **Lazy Loading** - Use lazy loading for better performance on larger apps
3. **Protected Routes** - Always wrap authenticated pages with `ProtectedRoute`
4. **Consistent Layouts** - Use appropriate layouts for different page types
5. **Navigation** - Set `showInNavigation: true` for main menu items only

## Development

The router setup is now complete and the application is running. You can:

1. Navigate to http://localhost:5173/
2. Login with the demo credentials
3. Explore the different pages and navigation
4. Add new routes as needed following the patterns above

The routing system is designed to be easily extensible and maintainable!
