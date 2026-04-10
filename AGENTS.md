# AGENTS.md

Single source of truth for every developer and AI tool working on this codebase. Read this before touching anything.

---

## 1. Project Overview

OngoleBulls Invest is a B2B Mutual Fund Distributor Platform.

Two user categories:
- **External**: Individual Partners and Partner Firms who distribute mutual funds to end investors
- **Internal**: Admin, RM, Operations, Compliance, Finance, Support

Three user-facing surfaces:
1. **Public website** — marketing pages, tools, blogs, contact
2. **Role-based dashboards** — 8 dashboards under unified login at `/login`
3. **Website Controls CMS** — content management at `/website-controls/*` (separate auth)

Partners self-register at `/register/partner`. Internal users are created by Admin only. End investors use the legacy `/dashboard/*` (USER role).

## 2. Tech Stack

### Backend
- Spring Boot 3.4.2, Java 21, Maven
- MySQL on AWS RDS
- Spring Security (JWT stateless), Spring Data JPA, Hibernate ddl-auto: update
- JJWT 0.12.6 (JWT tokens)
- Spring Boot Starter WebFlux (WebClient for external API calls)
- Spring Boot Starter Thymeleaf (password reset pages)
- Spring Boot Starter Validation (bean validation)
- Spring Boot Starter Mail (SMTP email)
- Twilio SDK 8.31.1 (SMS)
- Lombok 1.18.30
- springdoc-openapi 2.8.4 (Swagger UI)

### Frontend
- React 18, Vite 5, TypeScript 6.0.2
- JavaScript + TypeScript coexisting (`allowJs: true`)
- Tailwind CSS 4.2.1
- styled-components 6.3.11 (dashboard theming via ThemeProvider)
- React Router v6, Axios
- React Hook Form 7.71.2 + Zod 4.3.6 (form validation)
- Chart.js 4.5.1 + react-chartjs-2 5.3.1 (charts)
- Framer Motion 12.35.2 (animations)
- Lenis 1.3.18 (smooth scrolling)
- Lucide React, React Icons, Bootstrap Icons (icons)
- ThemeContext (light/dark mode via `data-theme` on html element)
- lightTheme/darkTheme from `components/user-db/theme.js`

### Deployment
- AWS Elastic Beanstalk (ap-south-1) via GitHub Actions
- Backend-only deployment (JAR artifact)
- Frontend served as static build bundled in JAR

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
1. The active `application.yml` points directly to AWS RDS dev instance (no local MySQL needed)
2. Set JAVA_HOME to Java 21: `export JAVA_HOME=/Library/Java/JavaVirtualMachines/temurin-21.jdk/Contents/Home`
3. Start backend: `cd backend && mvn spring-boot:run`
4. Start frontend: `cd frontend && npm run dev`
5. Access at `http://localhost:5173` — Vite proxies `/api/*`, `/reset-password`, `/funds` to `:8080`

## 4. Database

### Environments

| Environment | RDS Region | Endpoint | Database | Username |
|---|---|---|---|---|
| Dev (default profile) | ap-south-2 | `ongolebulls-db.cbqqc0wcszzt.ap-south-2.rds.amazonaws.com` | `ongolebulls` | `admin` |
| Prod (`application-prod.yml`) | ap-south-1 | EB-managed RDS instance | `ebdb` | `root` |

- Engine: MySQL 8.0 on AWS RDS
- Port: 3306
- Schema management: Hibernate `ddl-auto: update` (auto-creates/alters tables, never removes columns)
- Legacy Flyway scripts: `backend/src/main/resources/db/migration/` (4 SQL files, not actively managed)
- No Liquibase configured

### Key Entity Categories

**Core User:** User, Role (enum), AdminUser, UserPermission
**Auth/Security:** EmailOtp, OtpToken, PasswordResetToken
**Client/KYC:** Client, KycDetails, BankDetails, RiskProfile, InvestorAccount, DocumentSubmission, DocumentNominee, DocumentReview, Nominee
**Investment:** Fund, Scheme, AMC, FundSuggestion, SipPlan, SIPRequest, InvestmentRequest, InvestmentTransaction, PortfolioPosition, RedemptionRequest, TrackerHolding
**Business:** Lead, Appointment, Contact, Subscriber, Blog, Job, JobApplication, CandidateApplication, Service, ServiceSection, SectionItem, Settings, SeoSetting
**Operations:** Activity, AuditLog, Task, Ticket, TicketReply, SmartAlert, CommissionRule, ComplianceFlag, Payout, RMPerformance, ReferralClick
**UCC:** UccRegistration
**BSE v2:** BseRequest, BseResponse, BseToken
**Enums:** Role, AlertType, AppointmentType, AssetClass, BseRequestStatus, LifecycleStage, TxnType

Total: 59 entities + 7 enums = 66 model classes

### User Entity Key Fields
The `User` entity (`dev.ongolebulls.model.User`) implements `UserDetails` and includes:
- Core: `id`, `fullName`, `email`, `mobileNumber`, `passwordHash`
- Auth: `role` (enum), `enabled`, `isActivated`
- Partner-specific: `firmName`, `authorizedPerson`, `pan`, `arn`, `euin`, `euinHolderName`, `partnerBankAccount`, `partnerIfsc`, `partnerBankName`
- Relations: `KycDetails`, `BankDetails`, `RiskProfile`, `InvestorAccount`
- `getAuthorities()` returns `ROLE_<role.name()>` as GrantedAuthority
- `isEnabled()` returns `enabled && termsAccepted && declarationAccepted`

## 5. Authentication

- **Mechanism:** JWT-based (JJWT 0.12.6), stateless (SessionCreationPolicy.STATELESS)
- **Login:** POST `/api/auth/login` with `{ email, password }`
- **Login response:** `{ token, id, email, fullName, mobileNumber, username, role, user: {...} }`
- **Token storage:** Entire user object (including token and role) stored in localStorage under key `ob_user`
- **Admin CMS storage:** Separate localStorage key `ob_admin` for Website Controls
- **Axios interceptor:** `frontend/src/api/axiosConfig.js` reads `ob_user.token` and attaches as `Authorization: Bearer <token>` header
- **Auto-logout:** Axios response interceptor clears `ob_user` and redirects to `/login` on 401 responses (excludes `/api/auth/*` and `/api/login` endpoints to avoid breaking login error messages)
- **Password encoding:** BCrypt via Spring Security `PasswordEncoder` bean
- **JWT secret:** Configured in `application.yml` as `jwt.secret` (env var `JWT_SECRET`, must be 32+ chars)
- **JWT expiry:** 24 hours (86400000ms), configurable via `jwt.expiration`
- **Key classes:**
  - `dev.ongolebulls.security.JwtUtil` — token generation, validation, claim extraction (HMAC-SHA256)
  - `dev.ongolebulls.security.JwtAuthenticationFilter` — extracts Bearer token, sets SecurityContext
  - `dev.ongolebulls.config.SecurityConfig` — filter chain, role-based matchers, public endpoints
  - `dev.ongolebulls.service.CustomUserDetailsService` — loads User by email for authentication

### OTP Flow
`sendEmailOtp` -> `verifyEmailOtp` -> `registerClient` (for investor registration)

### Password Reset
POST `/api/auth/forgot-password` sends email with reset link (30-min expiry token). Reset page rendered via Thymeleaf templates.

## 6. Roles and Dashboard Routes

The `Role` enum is at `dev.ongolebulls.model.Role`.
Frontend routing utility: `frontend/src/utils/roleRoutes.ts`.

| Role | Dashboard Route | Status |
|------|----------------|--------|
| ADMIN | `/dashboard/admin` | Complete |
| INDIVIDUAL_PARTNER | `/dashboard/partner` | Complete |
| NON_INDIVIDUAL_PARTNER | `/dashboard/partner-firm` | Complete (re-exports PartnerDashboard) |
| RELATIONSHIP_MANAGER | `/dashboard/rm` | Complete |
| OPERATIONS | `/dashboard/operations` | Complete |
| COMPLIANCE | `/dashboard/compliance` | Complete |
| FINANCE | `/dashboard/finance` | Complete |
| SUPPORT | `/dashboard/support` | Complete |
| USER | `/dashboard` | Complete (legacy investor dashboard) |

All role-based dashboard routes are wrapped in `ProtectedRoute` (redirects to `/login` if no session).
All 8 dashboard `.tsx` files are flat in `frontend/src/pages/dashboards/` (no subdirectories).
The legacy `/dashboard/*` routes (explore, sips, statements, profile, kyc, ucc) remain for the USER role.

## 7. Dashboard Summary

### Admin (`/dashboard/admin`)
- File: `pages/dashboards/AdminDashboard.tsx`
- Sections: Overview, Internal Users, Partners, Clients, Platform Stats, Referral Tree, Roles & Permissions, BSE Monitor
- APIs: `/api/admin/**`, `/api/bse/**`
- API service: `frontend/src/api/adminUserApi.js`

### Individual Partner (`/dashboard/partner`)
- File: `pages/dashboards/PartnerDashboard.tsx`
- Sections: Overview, Profile & Verification, My Clients, SIP Book, Tracker, My Referrals
- APIs: `/api/partner/**`
- API service: `frontend/src/api/partnerApi.ts`
- Activation guard: temporarily disabled for testing (search `ACTIVATION_GUARD_DISABLED_FOR_TESTING` to re-enable)

### Partner Firm (`/dashboard/partner-firm`)
- File: `pages/dashboards/PartnerFirmDashboard.tsx`
- Re-exports PartnerDashboard as default export — same component, same sections

### RM (`/dashboard/rm`)
- File: `pages/dashboards/RMDashboard.tsx`
- Sections: Overview, My Partners, Business Performance, Tasks
- APIs: `/api/rm/**`
- API service: `frontend/src/api/rm/rmApi.ts`

### Operations (`/dashboard/operations`)
- File: `pages/dashboards/OperationsDashboard.tsx`
- Sections: Overview, Partner Verification, Client KYC Queue, Document & Mandate Flow
- APIs: `/api/operations/**`
- API service: `frontend/src/api/operations/operationsApi.ts`

### Compliance (`/dashboard/compliance`)
- File: `pages/dashboards/ComplianceDashboard.tsx`
- Sections: Overview, Audit Logs, Compliance Flags, Partner Risk, Disclosures
- APIs: `/api/compliance/**`
- API service: `frontend/src/api/compliance/complianceApi.ts`
- Theme: styled-components + ThemeProvider

### Finance (`/dashboard/finance`)
- File: `pages/dashboards/FinanceDashboard.tsx`
- Sections: Overview, Payouts, Commission Rules, Reconciliation, GST/TDS
- APIs: `/api/finance/**`
- API service: `frontend/src/api/finance/financeApi.ts`
- Theme: styled-components + ThemeProvider

### Support (`/dashboard/support`)
- File: `pages/dashboards/SupportDashboard.tsx`
- Sections: Overview, All Tickets, My Tickets, Escalations
- APIs: `/api/support/**`
- API service: `frontend/src/api/support/supportApi.ts`
- Theme: styled-components + ThemeProvider

## 8. Partner Registration

- **URL:** `/register/partner` (public, no auth required)
- **Component:** `frontend/src/pages/auth/PartnerRegister.tsx`
- **Backend:** POST `/api/auth/register/partner` handled by `PartnerRegistrationController`
- **Partner types:** Individual Partner, Non-Individual Partner (dropdown selector)
- **Referral:** `?ref=ID&type=TYPE` pre-selects type and shows referrer banner
- **Referrer info:** GET `/api/auth/referrer-info?ref=X` (public endpoint)
- **On registration:** User created with `isActivated = false`, `enabled = true`, role = selected partner type, `referredBy = ref` if valid
- **Activation:** Partners must be activated by Admin before business access
- **OTP:** Uses existing email OTP flow (`/api/auth/send-email-otp`, `/api/auth/verify-email-otp`)
- **DTO:** `dev.ongolebulls.dto.PartnerRegistrationRequest`

## 9. Admin User Management

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

## 10. Referral System

- **Model:** `model/ReferralClick.java` -> table: `referral_clicks`
- **Fields:** referrerId, referrerName, referralType, clickedAt, ipAddress, registeredUserId, registeredUserName, registeredAt, converted
- **Repository:** `ReferralClickRepository`
- **Partner sees own referrals:** GET `/api/partner/referrals`
- **Admin sees all:** GET `/api/admin/referrals`
- **Registration banner:** GET `/api/auth/referrer-info?ref=X` (public)

## 11. Permissions System

- **Model:** `model/UserPermission.java` -> table: `user_permissions`
- **Unique constraint:** (user_id, dashboard, section)
- **Fields:** canView, canCreate, canEdit, canDelete, canApprove, updatedBy, updatedAt

**Controller:** `controller/admin/PermissionController.java`
- GET `/api/admin/permissions/roles` — list role users
- GET `/api/admin/permissions/users/{userId}` — get user permissions
- PUT `/api/admin/permissions/users/{userId}` — update permissions
- GET `/api/admin/permissions/defaults/{role}` — get role defaults

**Dashboard sections per role:**
- RM: OVERVIEW, MY_PARTNERS, BUSINESS_PERFORMANCE, TASKS
- OPERATIONS: OVERVIEW, PARTNER_VERIFICATION, CLIENT_KYC, DOCUMENTS
- COMPLIANCE: OVERVIEW, AUDIT_LOGS, FLAGS, PARTNER_RISK, DISCLOSURES
- FINANCE: OVERVIEW, PAYOUTS, COMMISSION_RULES, RECONCILIATION, GST_TDS
- SUPPORT: OVERVIEW, ALL_TICKETS, MY_TICKETS, ESCALATIONS

Note: Permissions stored in DB. UI enforcement is display-only in Phase 1 — full enforcement in Phase 2.

## 12. BSE Integration

### 12a. BSE StarMF v1 (SOAP — UCC only)
- **Service:** `service/BseStarMfService.java` (DO NOT TOUCH)

- **API:** BSE StarMF SOAP API at `https://www.bsestarmf.in/RptWebService/WebService.asmx`
- **Purpose:** Creates UCC (Unique Client Code) from `UccRegistration` multi-step form data
- **Related:** `UccRegistrationController.java`, `UccRegistrationService.java`, `UccWorkerService.java`

### 12b. BSE StAR MF v2 (JOSE — Foundation Layer)
- **Status:** Phase 1 complete — JOSE encryption, token management, async request/response, admin monitor
- **Base URL:** `https://starmfv2wrapper.bseindia.com`
- **Encryption:** JOSE (JWE + JWS) using Nimbus JOSE+JWT 9.37.3 + BouncyCastle 1.77
- **Mock mode:** `BSE_V2_MOCK_MODE=true` (default) — uses base64 instead of real encryption

**Architecture — every BSE v2 call follows this flow:**
1. Validate input
2. Save to `bse_requests` table (status: PENDING)
3. Return transactionId immediately
4. `@Async` background: encrypt → sign → call BSE → decrypt
5. Save to `bse_responses` table (linked by transactionId)
6. Update `bse_requests` status (SUCCESS/FAILED)
7. Frontend polls `GET /api/bse/status/{transactionId}`

**Key services:**
- `service/bse/BseJoseService.java` — JWE encrypt/decrypt, JWS sign/verify
- `service/bse/BseTokenManager.java` — login, token refresh (`@Scheduled` every 50 min)
- `service/bse/BseV2HttpClient.java` — async HTTP calls to BSE (`@Async`)
- `service/bse/BseV2Service.java` — business methods (login, schemes, NAV)

**Controller:** `controller/bse/BseController.java`
- `GET /api/bse/status/{transactionId}` — poll transaction status
- `POST /api/bse/login` — trigger BSE login (ADMIN only)
- `POST /api/bse/schemes` — fetch scheme list (authenticated)
- `POST /api/bse/nav` — fetch NAV list (authenticated)
- `GET /api/bse/transactions` — recent transactions (ADMIN only)

**DB tables:** `bse_requests`, `bse_responses`, `bse_tokens`

**Config:**
```yaml
bse:
  starmf:
    v2:
      base-url: ${BSE_V2_BASE_URL:https://starmfv2wrapper.bseindia.com}
      username: ${BSE_V2_USERNAME:}
      password: ${BSE_V2_PASSWORD:}
      member-code: ${BSE_V2_MEMBER_CODE:}
      fingerprint: ${BSE_V2_FINGERPRINT:}
      private-key-path: ${BSE_V2_PRIVATE_KEY_PATH:}
      bse-public-key-path: ${BSE_V2_BSE_PUBLIC_KEY_PATH:}
      token-refresh-minutes: ${BSE_V2_TOKEN_REFRESH_MINUTES:55}
      mock-mode: ${BSE_V2_MOCK_MODE:true}
```

**Phase 1 APIs (implemented):** Login, Scheme List, NAV Master List
**Phase 2 APIs (not yet built):** UCC Creation, Order Placement, SIP Registration, KYC Status Check

## 13. Security Config — API Namespaces

Defined in `dev.ongolebulls.config.SecurityConfig`.

### Public Endpoints (permitAll)
```
/auth/**                    /api/auth/**
/api/login                  /api/admin/login
/api/contact                /api/subscribers/**
/api/kpi                    /api/charts/**
/api/leaderboard            /api/alerts
/api/services/**            /api/service-sections/**
/api/section-items/**       /api/clients
/api/reports/**             /api/blogs/**
/api/documents/**           /api/jobs/**
/api/candidates/**          /api/funds/**
/api/appointments/**        /api/seo/**
/api/plans/**               /otp/**
/password-reset/**          /reset-password/**
/v3/api-docs/**             /swagger-ui/**
```
Also: static assets (`/assets/**`, `/*.css`, `/*.js`, `/*.png`, etc.)

### Role-Based Access

| Namespace | Access | Status |
|-----------|--------|--------|
| `/api/admin/**` | `hasRole("ADMIN")` | Complete |
| `/api/partner/**` | `hasAnyRole("INDIVIDUAL_PARTNER", "NON_INDIVIDUAL_PARTNER")` | Complete |
| `/api/rm/**` | `hasRole("RELATIONSHIP_MANAGER")` | Complete |
| `/api/operations/**` | `hasRole("OPERATIONS")` | Complete |
| `/api/compliance/**` | `hasRole("COMPLIANCE")` | Complete |
| `/api/finance/**` | `hasRole("FINANCE")` | Complete |
| `/api/support/**` | `hasRole("SUPPORT")` | Complete |
| `/api/bse/**` | `authenticated()` | Complete (Phase 1) |

All other requests: `anyRequest().authenticated()`

Note: CSRF is globally disabled. OPTIONS requests are permitAll for CORS preflight.

## 14. Website Controls CMS

- **URL:** `/website-controls/*` (route in App.jsx)
- **Login:** `/website-controls/login` -> POST `/api/admin/login`
- **Auth:** Stored in localStorage as `ob_admin` (separate from `ob_user`)
- **Route guard:** `AdminRoute` component (checks `ob_admin`)
- **Controller:** `AdminAuthController.java` (`/api/admin`)
- **Credentials seeded by:** `DummyDataInitializer` on startup
- **Default:** `controls@ongolebullsinvest.com` / `controls123`
- **Table:** `ob_admin_users` (separate from `users` table)
- **Password comparison:** Plain text (not BCrypt) in AdminAuthController

**CMS Pages** (in `frontend/src/pages/admin-portal/`):
AdminPortalLayout, DashboardPage, ClientsPage, PlansPage, InvestmentsPage, BlogsPage, ServicesPage, ServiceDetailPage, ServiceSectionsPage, SeoPage, SettingsPage, DocumentsPage, CareersPage

**CMS API endpoints** are `permitAll()` because Website Controls uses separate `ob_admin` session, not JWT. Write operations should eventually validate `ob_admin` session (deferred to post-MVP).

## 15. Theme System (Light/Dark Mode)

- **Provider:** `frontend/src/context/ThemeContext.jsx`
- **Hook:** `useTheme()` -> `{ isDark, toggleTheme }`
- **Storage:** localStorage key `ongolebulls_theme` ('light' or 'dark')
- **DOM:** `data-theme` attribute on `<html>` element
- **System preference:** Respects `prefers-color-scheme` on first load

**CSS variables:** Defined in `frontend/src/styles/global.css`
- `:root` / `[data-theme="light"]` — light theme colors
- `[data-theme="dark"]` — dark theme colors (bg: `#0f172a`, card: `#1e293b`)

**styled-components dashboards:**
```js
import { lightTheme, darkTheme } from '../../../components/user-db/theme.js'
// Wrap in: <ThemeProvider theme={isDark ? darkTheme : lightTheme}>
```

Dashboards using styled-components (full dark mode): Compliance, Finance, Support
Dashboards using CSS variables (partial dark mode): Admin, Partner, RM, Operations

## 16. Frontend Folder Structure

```
frontend/src/
  api/
    axiosConfig.js          # Shared Axios instance with auth interceptor
    authApi.js              # Login, OTP, registration
    adminUserApi.js         # Admin user management
    adminApi.js             # Admin dashboard data
    adminDocumentApi.js     # Admin document management
    partnerApi.ts           # Partner dashboard endpoints
    userApi.js              # User profile/dashboard
    clientApi.js            # Client management
    ticketApi.js            # Ticket/support
    uccApi.js               # UCC registration
    fundApi.js              # Fund exploration
    contactApi.js           # Contact form
    blogApi.js              # Blog CMS
    serviceApi.js           # Service CMS
    seoApi.js               # SEO CMS
    settingsApi.js          # Settings CMS
    subscriberApi.js        # Newsletter subscribers
    appointmentApi.js       # Appointments
    calculatorApi.js        # Financial calculators
    candidateApi.js         # Job candidates
    documentApi.js          # Documents
    jobApi.js               # Jobs CMS
    passwordResetApi.js     # Password reset
    rm/rmApi.ts             # RM dashboard endpoints
    operations/operationsApi.ts
    compliance/complianceApi.ts
    finance/financeApi.ts
    support/supportApi.ts
  components/
    ProtectedRoute.jsx      # ProtectedRoute + AdminRoute guards
    Header.jsx, Footer.jsx  # Public site layout
    user-db/                # Legacy USER dashboard components
      theme.js              # lightTheme, darkTheme exports
  context/
    ThemeContext.jsx         # Light/dark mode provider
  pages/
    auth/
      Login.jsx             # Unified login
      Signup.jsx            # Investor signup
      Register.jsx          # Legacy register
      PartnerRegister.tsx   # Partner registration
      ForgotPassword.jsx
      ResetPassword.jsx
      Auth.css              # Auth page styles
    dashboards/             # All 8 role-based dashboards (flat, no subdirs)
      AdminDashboard.tsx
      PartnerDashboard.tsx
      PartnerFirmDashboard.tsx
      RMDashboard.tsx
      OperationsDashboard.tsx
      ComplianceDashboard.tsx
      FinanceDashboard.tsx
      SupportDashboard.tsx
    admin-portal/           # Website Controls CMS pages
      AdminPortalLayout.jsx
      DashboardPage.jsx, ClientsPage.jsx, PlansPage.jsx, ...
      admin-portal.css      # CMS styles (ap-* class prefix)
      components/           # ConfirmDialog, ServiceCard, ServiceFormModal, StepIndicator
    (public pages)          # Home, blogs, tools, calculator, careers, contact, etc.
  types/
    api.ts                  # ALL shared TypeScript interfaces (581 lines)
  utils/
    roleRoutes.ts           # Role-to-dashboard-URL mapping
    storage.js              # localStorage helpers (ob_user, ob_admin)
  styles/
    global.css              # CSS variables for light/dark themes + utility classes
```

- All NEW files must be `.tsx` (TypeScript)
- Existing `.js`/`.jsx` files stay as-is until naturally modified
- Route definitions: `src/App.jsx` (uses React.lazy for code splitting)
- Route guards: `ProtectedRoute` (checks `ob_user`), `AdminRoute` (checks `ob_admin`)

## 17. Backend Folder Structure

```
backend/src/main/java/dev/ongolebulls/
  config/
    SecurityConfig.java         # JWT filter chain, role-based access
    CorsConfig.java             # CORS origins
    OpenApiConfig.java          # Swagger/OpenAPI setup
    MailConfig.java             # SMTP JavaMailSender
    DummyDataInitializer.java   # Seeds Website Controls admin + test data
  controller/                   # 43 root controllers
    AuthController.java         # /api/auth — login, OTP, registration
    PartnerRegistrationController.java  # /api/auth — partner registration
    AdminAuthController.java    # /api/admin — CMS login
    AdminUserController.java    # /api/admin/users
    AdminPartnerController.java # /api/admin/partners
    AdminClientController.java  # /api/admin/clients
    AdminStatsController.java   # /api/admin/stats
    AdminTicketController.java  # /api/admin/tickets
    AdminDocumentController.java # /api/admin/documents
    AdminDashboardController.java
    UccRegistrationController.java  # /api/ucc
    DashboardController.java    # /api/dashboard
    ProfileController.java      # /api/profile
    ClientController.java       # /api/clients
    ContactController.java      # /api/contact
    BlogController.java         # /api/blogs
    ServiceController.java      # /api/services
    FundController.java         # /funds
    ExploreFundsController.java # /api/explore
    SipsController.java         # /api/sips
    PortfolioController.java    # /api/portfolio
    NotificationController.java # /api/notifications
    SettingsController.java     # /api/settings
    PasswordResetController.java # /reset-password (Thymeleaf)
    ... (and more: Appointment, Blog, Calculator, Candidate, Help, Job, Lead, MarketData, etc.)
    admin/
      AdminPlatformController.java   # /api/admin — platform-stats
      PermissionController.java      # /api/admin/permissions
    partner/
      PartnerController.java         # /api/partner
    rm/
      RMController.java              # /api/rm
    operations/
      OperationsController.java      # /api/operations
    compliance/
      ComplianceController.java      # /api/compliance
    finance/
      FinanceController.java         # /api/finance
    support/
      SupportController.java         # /api/support
    bse/
      BseController.java             # /api/bse
  dto/                          # 49 root DTOs + sub-packages
    admin/    (7 DTOs)          # PartnerDetailResponse, PermissionRow, PlatformStatsResponse, etc.
    partner/  (10 DTOs)         # AddClientRequest, PartnerProfileResponse, TrackerHoldingRequest, etc.
    rm/       (5 DTOs)          # RMStatsResponse, RMPartnerSummary, TaskRequest, etc.
    operations/ (4 DTOs)        # OperationsStatsResponse, PartnerVerificationResponse, etc.
    compliance/ (7 DTOs)        # ComplianceStatsResponse, AuditLogResponse, RaiseFlagRequest, etc.
    finance/  (8 DTOs)          # FinanceStatsResponse, CommissionRuleRequest, PayoutRequest, etc.
    support/  (6 DTOs)          # SupportStatsResponse, TicketResponse, TicketReplyRequest, etc.
  model/                        # 59 entities + 7 enums (66 total)
  repository/                   # 50 repository interfaces
  security/
    JwtUtil.java
    JwtAuthenticationFilter.java
  service/                      # 31 root services + sub-packages
    BseStarMfService.java       # BSE StarMF v1 SOAP API for UCC (DO NOT TOUCH)
    UserService.java
    AuthService.java
    CustomUserDetailsService.java
    EmailService.java
    OtpService.java
    UccRegistrationService.java
    UccWorkerService.java
    ... (and more)
    admin/
      PermissionService.java
    bse/
      BseJoseService.java       # JWE encrypt/decrypt, JWS sign/verify
      BseTokenManager.java      # Login, token refresh (@Scheduled)
      BseV2HttpClient.java      # Async HTTP calls to BSE (@Async)
      BseV2Service.java         # Business methods (login, schemes, NAV)
    partner/
      PartnerService.java
    rm/
      RMService.java
    operations/
      OperationsService.java
    compliance/
      ComplianceService.java
    finance/
      FinanceService.java
    support/
      SupportService.java
  util/
    EncryptionService (AES)
```

## 18. Deployment

### GitHub Actions (`.github/workflows/deploy.yml`)
- **Trigger:** Push to `main` branch
- **Java:** Amazon Corretto 21
- **Build:** `mvn clean package -DskipTests`
- **Deploy:** AWS Elastic Beanstalk via `einaregilsson/beanstalk-deploy@v21`
- **Application:** `ongolebullsinvests`
- **Environment:** `ongolebullsinvests-env`
- **Region:** `ap-south-1`
- **Artifact:** `target/ongolebulls-0.0.1-SNAPSHOT.jar`
- **Secrets:** `AWS_ACCESS_KEY`, `AWS_SECRET_ACCESS_KEY`

### Production Profile (`application-prod.yml`)
- Separate RDS endpoint in ap-south-1 (EB-managed)
- Database: `ebdb`

Note: Only backend JAR is deployed. Frontend is not separately deployed via this workflow.

## 19. Rules for AI Tools Working on This Codebase

1. **Always read this AGENTS.md before starting any work**
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
14. The active `application.yml` connects directly to AWS RDS dev — do NOT run destructive queries against it
15. Sub-package controllers (`controller/admin/`, `controller/rm/`, etc.) follow role-based namespacing — new role-specific endpoints go in the corresponding sub-package
16. Sub-package services and DTOs follow the same convention (`service/rm/`, `dto/rm/`, etc.)
17. NEVER touch `BseStarMfService.java` (v1 SOAP) — it handles existing UCC creation
18. NEVER log or store BSE private key values anywhere
19. NEVER commit `.pem` key files to git (added to `.gitignore`)
20. BSE calls: always store request in DB BEFORE calling BSE, always store response AFTER receiving from BSE

## 20. Environment Variables

### Backend (`application.yml`)
| Variable | Default | Description |
|----------|---------|-------------|
| `SERVER_PORT` | `8080` | Backend server port |
| `HIBERNATE_DDL_AUTO` | `update` | JPA schema strategy |
| `JWT_SECRET` | (insecure default) | JWT signing key, must be 32+ chars |
| `JWT_EXPIRATION` | `86400000` | Token TTL in milliseconds (24h) |
| `EMAIL_HOST` | `mail.ongolebullsinvest.com` | SMTP host |
| `EMAIL_PORT` | `587` | SMTP port |
| `EMAIL_USERNAME` | `info@ongolebullsinvest.com` | SMTP username |
| `EMAIL_PASSWORD` | (set in config) | SMTP password |
| `BSE_STARMF_API_URL` | `https://www.bsestarmf.in/RptWebService/WebService.asmx` | BSE SOAP API |
| `BSE_MEMBER_ID` | (empty) | BSE member ID |
| `BSE_USER_ID` | (empty) | BSE user ID |
| `BSE_PASSWORD` | (empty) | BSE password |
| `BSE_V2_BASE_URL` | `https://starmfv2wrapper.bseindia.com` | BSE v2 REST API |
| `BSE_V2_USERNAME` | (empty) | BSE v2 username |
| `BSE_V2_PASSWORD` | (empty) | BSE v2 password |
| `BSE_V2_MEMBER_CODE` | (empty) | BSE v2 member code |
| `BSE_V2_FINGERPRINT` | (empty) | BSE v2 fingerprint |
| `BSE_V2_PRIVATE_KEY_PATH` | (empty) | Path to member RSA private key PEM |
| `BSE_V2_BSE_PUBLIC_KEY_PATH` | (empty) | Path to BSE RSA public key PEM |
| `BSE_V2_TOKEN_REFRESH_MINUTES` | `55` | Token auto-refresh interval |
| `BSE_V2_MOCK_MODE` | `true` | Mock mode (base64 instead of JOSE) |
| `WEBSITE_CONTROLS_EMAIL` | `controls@ongolebullsinvest.com` | CMS seed email |
| `WEBSITE_CONTROLS_PASSWORD` | `controls123` | CMS seed password |
| `WEBSITE_CONTROLS_NAME` | `Website Controls` | CMS seed name |
| `SPRING_SECURITY_USER_NAME` | `ob-api` | Spring HTTP Basic user |
| `SPRING_SECURITY_USER_PASSWORD` | `ob-local-dev-only` | Spring HTTP Basic password |

Note: DB credentials (`DB_URL`, `DB_USERNAME`, `DB_PASSWORD`) are currently hardcoded in `application.yml` rather than using env vars. This should be changed.

### Frontend (`.env` or inline)
| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_API_BASE_URL` | `http://localhost:8080` | Backend API base URL (empty in prod = same origin) |

### CORS
Allowed origins: `http://localhost:5173`, `https://www.ongolebullsinvest.com`, `https://ongolebullsinvest.com`
Configured in `dev.ongolebulls.config.CorsConfig`.

## 21. Key Files Quick Reference

| What | Path |
|------|------|
| All routes | `frontend/src/App.jsx` |
| Route guards | `frontend/src/components/ProtectedRoute.jsx` |
| Axios config | `frontend/src/api/axiosConfig.js` |
| Auth storage | `frontend/src/utils/storage.js` |
| Role routing | `frontend/src/utils/roleRoutes.ts` |
| Shared types | `frontend/src/types/api.ts` |
| Theme context | `frontend/src/context/ThemeContext.jsx` |
| Theme tokens | `frontend/src/components/user-db/theme.js` |
| Global CSS vars | `frontend/src/styles/global.css` |
| Security config | `backend/.../config/SecurityConfig.java` |
| CORS config | `backend/.../config/CorsConfig.java` |
| Data seeder | `backend/.../config/DummyDataInitializer.java` |
| JWT utility | `backend/.../security/JwtUtil.java` |
| JWT filter | `backend/.../security/JwtAuthenticationFilter.java` |
| User entity | `backend/.../model/User.java` |
| Role enum | `backend/.../model/Role.java` |
| Auth controller | `backend/.../controller/AuthController.java` |
| Admin user mgmt | `backend/.../controller/AdminUserController.java` |
| Admin CMS auth | `backend/.../controller/AdminAuthController.java` |
| Partner registration | `backend/.../controller/PartnerRegistrationController.java` |
| Permission controller | `backend/.../controller/admin/PermissionController.java` |
| BSE StarMF v1 (SOAP) | `backend/.../service/BseStarMfService.java` |
| BSE JOSE service | `backend/.../service/bse/BseJoseService.java` |
| BSE token manager | `backend/.../service/bse/BseTokenManager.java` |
| BSE v2 HTTP client | `backend/.../service/bse/BseV2HttpClient.java` |
| BSE v2 service | `backend/.../service/bse/BseV2Service.java` |
| BSE controller | `backend/.../controller/bse/BseController.java` |
| BSE async config | `backend/.../config/BseAsyncConfig.java` |
| UCC controller | `backend/.../controller/UccRegistrationController.java` |
| Backend config | `backend/src/main/resources/application.yml` |
| Prod config | `backend/src/main/resources/application-prod.yml` |
| Deploy workflow | `.github/workflows/deploy.yml` |
| Vite config | `frontend/vite.config.ts` |
| TS config | `frontend/tsconfig.json` |

## 22. Known Limitations / Tech Debt

1. **Activation guard disabled** on Partner Dashboard for testing. Search: `ACTIVATION_GUARD_DISABLED_FOR_TESTING` to re-enable.
2. **CMS endpoints are `permitAll()`** — write operations should eventually validate `ob_admin` session.
3. **Permissions system** stores in DB but UI enforcement is display-only — full enforcement in Phase 2.
4. **BSE v2 is Phase 1 only** — foundation layer (JOSE, tokens, async, admin monitor) is built. Order placement, redemption, SIP registration, and KYC status check are not yet built. BSE v1 SOAP (UCC) remains untouched.
5. **Website Controls uses plaintext passwords** — `AdminAuthController` compares passwords without hashing. Should migrate to BCrypt.
6. **DB credentials hardcoded** in `application.yml` — should use env vars (`DB_URL`, `DB_USERNAME`, `DB_PASSWORD`).
7. **No test suite** — no meaningful test files beyond default Spring Boot test skeleton.
8. **No frontend CI/CD** — GitHub Actions only deploys backend JAR; frontend build is not in the workflow.
9. **Dev RDS in different region** — Dev DB is in ap-south-2, Elastic Beanstalk is in ap-south-1. Prod DB is correctly in ap-south-1.
10. **3/8 dashboards have full dark mode** (styled-components: Compliance, Finance, Support). The other 5 use CSS variables only (partial dark mode).
11. **Many CMS-related endpoints are `permitAll()`** that probably shouldn't be — `/api/clients`, `/api/documents/**`, `/api/reports/**`, `/api/funds/**` etc. are public because CMS uses non-JWT auth.
