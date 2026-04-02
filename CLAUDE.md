# CLAUDE.md

Single source of truth for any developer or AI tool working on this codebase.

---

## 1. Project Overview

OngoleBulls Invest is a B2B Mutual Fund Distributor Platform. Two user categories:

- **External**: Partners (Individual and Non-Individual) who distribute mutual funds
- **Internal**: Operations team (Admin, RM, Operations, Compliance, Finance, Support)

8 role-based dashboards, single unified login at `/login`. Partners self-register at `/register/partner`. Internal users are created by Admin.

## 2. Tech Stack

- **Backend:** Spring Boot 3.4.2, Java 21, Maven, MySQL, Spring Security, Spring Data JPA, JJWT 0.12.6
- **Frontend:** React 18, Vite 5, JavaScript + TypeScript (coexisting, `allowJs: true`), Tailwind CSS 4, styled-components, React Router v6, Axios
- **Deployment:** AWS Elastic Beanstalk (ap-south-1) via GitHub Actions

## 3. Development Commands

### Backend (from `backend/`)
```bash
mvn spring-boot:run              # Start dev server on :8080
mvn clean package -DskipTests    # Build production JAR
mvn test                         # Run all tests
mvn test -Dtest=ClassName        # Run single test class
mvn test -Dtest=ClassName#method # Run single test method
```

### Frontend (from `frontend/`)
```bash
npm run dev      # Start Vite dev server on :5173 (proxies /api to :8080)
npm run build    # Production build to dist/
npm run preview  # Preview production build
```

### Local Development
1. Start MySQL with database `ongolebulls` (user: root, password: root)
2. Set JAVA_HOME to Java 21: `export JAVA_HOME=/Library/Java/JavaVirtualMachines/temurin-21.jdk/Contents/Home`
3. Start backend: `cd backend && mvn spring-boot:run`
4. Start frontend: `cd frontend && npm run dev`
5. Access at `http://localhost:5173` — Vite proxies `/api/*`, `/reset-password`, `/funds` to `:8080`

## 4. Authentication

- **Mechanism:** JWT-based (JJWT 0.12.6), stateless (SessionCreationPolicy.STATELESS)
- **Login:** POST `/api/auth/login` with `{ email, password }`
- **Login response:** `{ token, id, email, fullName, mobileNumber, username, role, user: {...} }`
- **Token storage:** Entire user object (including token and role) stored in localStorage under key `ob_user`
- **Admin storage:** Separate localStorage key `ob_admin` for website-controls admin
- **Axios interceptor:** `frontend/src/api/axiosConfig.js` reads `ob_user.token` and attaches as `Authorization: Bearer <token>` header
- **Auto-logout:** Axios response interceptor clears `ob_user` and redirects to `/login` on 401 responses (excludes `/api/auth/*` and `/api/login` endpoints to avoid breaking login error messages)
- **Password encoding:** BCrypt via Spring Security `PasswordEncoder` bean
- **JWT secret:** Configured in `application.yml` as `jwt.secret` (env var `JWT_SECRET`, must be 32+ chars)
- **JWT expiry:** 24 hours (86400000ms), configurable via `jwt.expiration`
- **Key classes:**
  - `dev.ongolebulls.security.JwtUtil` — token generation, validation, claim extraction
  - `dev.ongolebulls.security.JwtAuthenticationFilter` — extracts Bearer token, sets SecurityContext
  - `dev.ongolebulls.config.SecurityConfig` — filter chain, role-based matchers, public endpoints
  - `dev.ongolebulls.service.CustomUserDetailsService` — loads User by email for authentication

### OTP Flow (unchanged)
`sendEmailOtp` -> `verifyEmailOtp` -> `registerClient` (for investor registration)

### Password Reset (unchanged)
POST `/api/auth/forgot-password` sends email with reset link (30-min expiry token)

## 5. Roles and Dashboard Routes

The `Role` enum is at `dev.ongolebulls.model.Role`.
Frontend routing utility: `frontend/src/utils/roleRoutes.ts`.

| Role | Dashboard Route | Status |
|------|----------------|--------|
| ADMIN | `/dashboard/admin` | Built (user management panel) |
| INDIVIDUAL_PARTNER | `/dashboard/partner` | Placeholder |
| NON_INDIVIDUAL_PARTNER | `/dashboard/partner-firm` | Placeholder |
| RELATIONSHIP_MANAGER | `/dashboard/rm` | Placeholder |
| OPERATIONS | `/dashboard/operations` | Placeholder |
| COMPLIANCE | `/dashboard/compliance` | Placeholder |
| FINANCE | `/dashboard/finance` | Placeholder |
| SUPPORT | `/dashboard/support` | Placeholder |
| USER | `/dashboard` | Built (legacy investor dashboard) |

All role-based dashboard routes are wrapped in `ProtectedRoute` (redirects to `/login` if no session).
The legacy `/dashboard/*` routes (explore, sips, statements, profile, kyc, ucc) remain for the USER role.

## 6. Partner Registration

- **URL:** `/register/partner` (public, no auth required)
- **Component:** `frontend/src/pages/auth/PartnerRegister.tsx`
- **Backend:** POST `/api/auth/register/partner` handled by `PartnerRegistrationController`
- **Partner types:** Individual Partner, Non-Individual Partner (dropdown selector)
- **On registration:** User created with `isActivated = false`, `enabled = true`, role = selected partner type
- **Activation:** Partners must be activated by Admin before business access
- **OTP:** Uses existing email OTP flow (`/api/auth/send-email-otp`, `/api/auth/verify-email-otp`)
- **DTO:** `dev.ongolebulls.dto.PartnerRegistrationRequest`

## 7. Admin User Management

- **URL:** `/dashboard/admin`
- **Component:** `frontend/src/pages/dashboards/AdminDashboard.tsx`
- **API service:** `frontend/src/api/adminUserApi.js`
- **Endpoints:**
  - GET `/api/admin/users` — list internal users (excludes USER, INDIVIDUAL_PARTNER, NON_INDIVIDUAL_PARTNER)
  - POST `/api/admin/users` — create internal user (RM, Operations, Compliance, Finance, Support, Admin)
  - PATCH `/api/admin/users/{id}/status` — toggle isActivated
- **Rule:** Partners CANNOT be created via admin panel — backend returns 400 if partner role is specified
- **Internal users** are created with `isActivated = true`
- **Backend controller:** `dev.ongolebulls.controller.AdminUserController`
- **DTOs:** `CreateUserRequest`, `UserSummaryResponse`

## 8. Database Schema Management

- **Current mechanism:** Hibernate `ddl-auto: update` (auto-creates/alters tables from JPA entities)
- **Legacy Flyway scripts:** `backend/src/main/resources/db/migration/` (4 SQL files, not actively managed)
- **No Liquibase:** Not yet configured in pom.xml or application.yml
- **When adding new entity fields:** Hibernate will auto-add columns on restart. For production, write manual SQL migration scripts.

### User Entity Key Fields
The `User` entity (`dev.ongolebulls.model.User`) implements `UserDetails` and includes:
- Core: `id`, `fullName`, `email`, `mobileNumber`, `passwordHash`
- Auth: `role` (enum), `enabled`, `isActivated`
- Partner-specific: `firmName`, `authorizedPerson`, `pan`, `arn`, `euin`, `euinHolderName`, `partnerBankAccount`, `partnerIfsc`, `partnerBankName`
- Relations: `KycDetails`, `BankDetails`, `RiskProfile`, `InvestorAccount`
- `getAuthorities()` returns `ROLE_<role.name()>` as GrantedAuthority
- `isEnabled()` returns `enabled && termsAccepted && declarationAccepted`

## 9. Security Config — API Namespaces

Defined in `dev.ongolebulls.config.SecurityConfig`. The `/api/auth/**` wildcard covers all auth endpoints as public.

| Namespace | Access | Status |
|-----------|--------|--------|
| `/api/auth/**` | Public (permitAll) | Complete — login, OTP, registration, password reset, partner registration |
| `/api/admin/**` | `hasRole("ADMIN")` | Complete — user management |
| `/api/partner/**` | `hasAnyRole("INDIVIDUAL_PARTNER", "NON_INDIVIDUAL_PARTNER")` | Not built yet |
| `/api/rm/**` | `hasRole("RELATIONSHIP_MANAGER")` | Not built yet |
| `/api/operations/**` | `hasRole("OPERATIONS")` | Not built yet |
| `/api/compliance/**` | `hasRole("COMPLIANCE")` | Not built yet |
| `/api/finance/**` | `hasRole("FINANCE")` | Not built yet |
| `/api/support/**` | `hasRole("SUPPORT")` | Not built yet |
| `/api/contact`, `/api/subscribers/**` | Public | Existing |
| `/api/admin/login` | Public | Website Controls CMS login |

Also public: Swagger UI (`/swagger-ui/**`, `/v3/api-docs/**`), static assets, password reset pages.

## 10. Frontend Folder Conventions

```
frontend/src/
  api/                  # Axios API service files (authApi.js, adminUserApi.js, etc.)
  components/           # Shared components (ProtectedRoute, Header, Footer, BrandLoader)
  components/user-db/   # Legacy USER dashboard (sidebar, header, pages)
  pages/auth/           # Login.jsx, Signup.jsx, PartnerRegister.tsx
  pages/dashboards/     # Role-based dashboard pages (all .tsx)
  pages/admin-portal/   # Website Controls CMS (AdminPortalLayout, ClientsPage, etc.)
  pages/                # Public pages (blogs, tools, etc.)
  types/api.ts          # Shared TypeScript types (Role, AuthUser, UserSummary, etc.)
  utils/roleRoutes.ts   # Role-to-dashboard-URL mapping
  utils/storage.js      # localStorage helpers (saveUser/getUser/clearUser, saveAdmin/getAdmin/clearAdmin)
  styles/               # Global CSS
```

- All NEW files must be `.tsx` (TypeScript)
- Existing `.js`/`.jsx` files stay as-is until naturally modified
- Route definitions: `src/App.jsx` (uses React.lazy for code splitting)
- Route guards: `ProtectedRoute` (checks `ob_user` in localStorage), `AdminRoute` (checks `ob_admin`)
- Admin portal CSS: `src/pages/admin-portal/admin-portal.css` (prefix: `ap-*` classes)
- Auth page CSS: `src/pages/auth/Auth.css`

## 11. Backend Folder Conventions

```
backend/src/main/java/dev/ongolebulls/
  config/       # SecurityConfig, CorsConfig, OpenApiConfig
  controller/   # REST controllers (AuthController, AdminUserController, PartnerRegistrationController, etc.)
  dto/          # Request/response DTOs (CreateUserRequest, PartnerRegistrationRequest, etc.)
  model/        # JPA entities (User, Role, KycDetails, BankDetails, etc.)
  repository/   # Spring Data JPA repositories
  security/     # JwtUtil, JwtAuthenticationFilter
  service/      # Business logic (UserService, OtpService, EmailService, etc.)
  util/         # EncryptionService (AES)
```

New role-specific endpoints should follow the namespace convention:
- Controllers: `controller/<RoleName>Controller.java` or `controller/<role>/` package
- Services: `service/<feature>Service.java`
- DTOs: `dto/<FeatureName>Request.java`, `dto/<FeatureName>Response.java`

## 12. Rules for AI Tools Working on This Codebase

1. **Always read this CLAUDE.md before starting any work**
2. **Always read files you plan to modify BEFORE modifying them**
3. Never modify `SecurityConfig` without checking impact on all roles and public endpoints
4. Never modify the `User` entity without verifying the DB schema handles the change (Hibernate ddl-auto will auto-add columns, but never removes them)
5. Never use HttpSession for authentication — auth is JWT-only, sessions are stateless
6. Never add a frontend dashboard route without wrapping it in `ProtectedRoute`
7. Never create partner users from admin endpoints — partners self-register only
8. New frontend files must be `.tsx` (TypeScript)
9. New API types must be added to `frontend/src/types/api.ts`
10. Run `mvn clean package -DskipTests` after every backend change (requires Java 21)
11. Run `npm run build` after every frontend change
12. Backend port is **8080** — do not change without updating Vite proxy config
13. The `ob_user` localStorage key stores the entire user session object including `token` — do not change this structure without updating `axiosConfig.js` and `storage.js`

## 13. What Is Not Built Yet

### Dashboard Placeholders (routes exist, show "Under Construction")
- `/dashboard/partner` — Individual Partner dashboard
- `/dashboard/partner-firm` — Non-Individual Partner dashboard
- `/dashboard/rm` — Relationship Manager dashboard
- `/dashboard/operations` — Operations dashboard
- `/dashboard/compliance` — Compliance dashboard
- `/dashboard/finance` — Finance dashboard
- `/dashboard/support` — Support dashboard

### Known Gaps
None — all Phase 0 gaps have been resolved.

## 14. Environment Variables

### Backend (`application.yml`)
| Variable | Default | Description |
|----------|---------|-------------|
| `SERVER_PORT` | `8080` | Backend server port |
| `DB_HOST` | `localhost` | MySQL host |
| `DB_NAME` | `ongolebulls` | MySQL database name |
| `HIBERNATE_DDL_AUTO` | `update` | JPA schema strategy |
| `JWT_SECRET` | (insecure default) | JWT signing key, must be 32+ chars |
| `JWT_EXPIRATION` | `86400000` | Token TTL in milliseconds (24h) |
| `EMAIL_HOST` | `mail.ongolebullsinvest.com` | SMTP host |
| `EMAIL_PORT` | `587` | SMTP port |
| `EMAIL_USERNAME` | `info@ongolebullsinvest.com` | SMTP username |
| `EMAIL_PASSWORD` | (set in config) | SMTP password |

### Frontend (`.env` or inline)
| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_API_BASE_URL` | `http://localhost:8080` | Backend API base URL |

### CORS
Allowed origins: `http://localhost:5173`, `https://www.ongolebullsinvest.com`, `https://ongolebullsinvest.com`
Configured in `dev.ongolebulls.config.CorsConfig`.

## 15. Key Files Quick Reference

| What | Path |
|------|------|
| All routes | `frontend/src/App.jsx` |
| Route guards | `frontend/src/components/ProtectedRoute.jsx` |
| Axios config | `frontend/src/api/axiosConfig.js` |
| Auth storage | `frontend/src/utils/storage.js` |
| Role routing | `frontend/src/utils/roleRoutes.ts` |
| Shared types | `frontend/src/types/api.ts` |
| Security config | `backend/.../config/SecurityConfig.java` |
| JWT utility | `backend/.../security/JwtUtil.java` |
| JWT filter | `backend/.../security/JwtAuthenticationFilter.java` |
| User entity | `backend/.../model/User.java` |
| Role enum | `backend/.../model/Role.java` |
| Auth controller | `backend/.../controller/AuthController.java` |
| Admin user mgmt | `backend/.../controller/AdminUserController.java` |
| Partner registration | `backend/.../controller/PartnerRegistrationController.java` |
| Backend config | `backend/src/main/resources/application.yml` |
| Vite config | `frontend/vite.config.ts` |
| TS config | `frontend/tsconfig.json` |
