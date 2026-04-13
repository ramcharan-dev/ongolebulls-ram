# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Start Vite dev server (port 5173, proxies /api to localhost:8080)
npm run build      # Production build
npm run preview    # Preview production build
```

No test runner or linter CLI is configured in package.json. ESLint is configured (flat config) but has no `lint` script — run directly with `npx eslint .` if needed.

## Architecture

This is a **React 18 SPA** built with **Vite**, serving three audiences through distinct route layouts:

1. **Public site** (`/`, `/services/*`, `/blogs/*`, etc.) — marketing pages with Header/Footer, scroll animations via Framer Motion + Lenis smooth scrolling
2. **User dashboard** (`/dashboard/*`) — protected by `ProtectedRoute`, custom sidebar/header layout, portfolio management, KYC/UCC onboarding
3. **Admin portal** (`/admin-portal/*`) — protected by `AdminRoute`, CMS for managing clients, blogs, services, plans, SEO, documents

### Routing & Code Splitting

Routes are defined in `src/App.jsx`. Heavy pages (Auth, Admin, Dashboard) use `React.lazy()` for code splitting. Tool-related routes are extracted to `src/routes/toolsRoutes.jsx`.

### State Management

No Redux — uses **React Context + custom hooks**:
- `src/context/ThemeContext.jsx` — light/dark theme via CSS `data-theme` attribute, persisted to localStorage
- `src/hooks/useAuth.js` — dual auth state (user stored as `ob_user`, admin as `ob_admin` in localStorage), provides `login/logout/adminLogin/adminLogout`
- `src/hooks/useApi.js` — generic async wrapper returning `{ success, data, message }` with loading/error state

### API Layer

All backend communication goes through `src/api/axiosConfig.js` (Axios instance):
- Base URL from `VITE_API_BASE_URL` env var (defaults to `http://localhost:8080`)
- Request interceptor attaches Bearer token from localStorage
- Response interceptor normalizes errors with `userMessage` property
- 15s timeout

Domain-specific API modules in `src/api/` (authApi, fundApi, blogApi, userApi, adminApi, serviceApi, etc.) all import the shared axios instance. Pattern: `export const doThing = (params) => api.post('/api/endpoint', data)`.

### Styling

Dual approach:
- **Tailwind CSS 4** — primary utility framework, theme variables defined as CSS custom properties in `src/styles/global.css` (green brand palette, light/dark variants)
- **styled-components** — used for component-scoped dynamic styles

Service pages use a theme system (`src/config/serviceThemes.js`) with Gold and Blue theme variants, each having light/dark modes.

### Key Patterns

- **Scroll animations**: `ScrollReveal`, `RevealItem`, `ScrollScale` components in `src/utils/animations.jsx` wrap content for viewport-triggered Framer Motion animations
- **Forms**: React Hook Form + Zod validation (KYC, appointments, contacts)
- **File uploads**: Multipart form data via axios for KYC docs, blog images, etc.
- **Media resolution**: `src/utils/media.js` handles both local assets and API-served images
- **Formatters**: `src/utils/formatters.js` — Indian currency (₹), date (Indian locale), percentage formatting
- **Services hierarchy**: Services → Sections → Items (3-level content structure managed in admin)

### Dev Server Proxies (vite.config.js)

- `/api` → `http://localhost:8080` (Spring Boot backend)
- `/reset-password` → `http://localhost:8080`
- `/funds` → `http://localhost:8080`