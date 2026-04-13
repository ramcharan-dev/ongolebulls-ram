# ARN Onboarding & Approval Workflow — Design Spec

## Overview

Complete ARN onboarding flow where partners submit ARN details for verification, and admins review/approve/reject from the Admin Dashboard. Integrates into existing Partner Dashboard and Admin panel without rebuilding pages.

## Data Model

### New Enum: `ArnStatus`

```java
public enum ArnStatus {
    NOT_SUBMITTED,
    PENDING_APPROVAL,
    APPROVED,
    REJECTED
}
```

Location: `backend/src/main/java/dev/ongolebulls/model/ArnStatus.java`

### User Entity Changes

Add to `User.java`:

```java
@Enumerated(EnumType.STRING)
@Column(columnDefinition = "varchar(255) default 'NOT_SUBMITTED'")
private ArnStatus arnStatus = ArnStatus.NOT_SUBMITTED;
```

Existing fields reused (no changes needed):
- `arn` (String) — ARN number
- `pan` (String) — PAN number
- `euin` (String) — EUIN
- `rejectionReason` (String) — rejection feedback
- `isActivated` (Boolean) — account activation flag

### State Transitions

| Action | arnStatus | isActivated | rejectionReason |
|--------|-----------|-------------|-----------------|
| Registration (default) | NOT_SUBMITTED | false | null |
| Partner submits ARN | PENDING_APPROVAL | false (unchanged) | null (cleared) |
| Admin approves | APPROVED | true | null |
| Admin rejects | REJECTED | false (unchanged) | set to reason |
| Partner resubmits | PENDING_APPROVAL | false (unchanged) | null (cleared) |

## Backend API

### New Partner Endpoint

**POST `/api/partner/arn-submit`**

Submit or resubmit ARN details.

Request DTO — `ArnSubmitRequest`:
```java
@NotBlank private String arnNumber;
@NotBlank @Pattern(regexp = "^[A-Z]{5}[0-9]{4}[A-Z]{1}$") private String pan;
private String euin; // optional
```

Behavior:
- Sets `user.arn = arnNumber`, `user.pan = pan`, `user.euin = euin`
- Sets `user.arnStatus = PENDING_APPROVAL`
- Clears `user.rejectionReason = null`
- Returns updated `PartnerProfileResponse`

Validations:
- Partner must have role INDIVIDUAL_PARTNER or NON_INDIVIDUAL_PARTNER
- PAN format validated via regex
- ARN number must not be blank

Location: Add to existing `PartnerController.java`
Service logic: Add to existing `PartnerService.java`

### New Admin Endpoints

**GET `/api/admin/arn-requests?status=&search=`**

List all ARN submissions (all statuses by default). Filterable by status and searchable by name/ARN.

Query params:
- `status` (optional): PENDING_APPROVAL, APPROVED, REJECTED (omit for all)
- `search` (optional): searches fullName, firmName, arn

Response: `List<ArnRequestResponse>`

Response DTO — `ArnRequestResponse`:
```java
private Long userId;
private String fullName;
private String firmName;
private String email;
private String partnerType; // INDIVIDUAL_PARTNER or NON_INDIVIDUAL_PARTNER
private String arn;
private String pan;
private String euin;
private String arnStatus;
private String rejectionReason;
private Instant createdAt;
```

**PATCH `/api/admin/arn-requests/{userId}/approve`**

- Sets `arnStatus = APPROVED`, `isActivated = true`
- Returns updated `ArnRequestResponse`

**PATCH `/api/admin/arn-requests/{userId}/reject`**

Request body:
```json
{ "reason": "Invalid ARN number" }
```

- Sets `arnStatus = REJECTED`, `rejectionReason = reason`
- Returns updated `ArnRequestResponse`

Location: New methods in existing `AdminPartnerController.java`
Service logic: New methods in existing `PartnerService.java` or a new `AdminPartnerService` — prefer adding to `PartnerService` since it already handles partner data.

DTO location: `dto/admin/ArnRequestResponse.java`, `dto/partner/ArnSubmitRequest.java`

### Existing Endpoint Enhanced

**GET `/api/partner/me`** — `PartnerProfileResponse` gains `arnStatus` field (String). No endpoint change needed, just DTO update.

## Frontend — Partner Side

### PartnerProfileResponse Type Update

Add to `PartnerProfile` interface in `types/api.ts`:
```typescript
arnStatus: 'NOT_SUBMITTED' | 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED';
```

### New API Call in `partnerApi.ts`

```typescript
submitArn(data: { arnNumber: string; pan: string; euin?: string })
// POST /api/partner/arn-submit
```

### Partner Dashboard Changes (PartnerDashboard.tsx)

**Onboarding banner logic** (replaces or enhances existing activation banner):

| arnStatus | Banner |
|-----------|--------|
| NOT_SUBMITTED | "Complete ARN verification to unlock your dashboard" + "Complete ARN" button |
| PENDING_APPROVAL | Status card: "ARN Verification Pending — Your submission is under review" |
| REJECTED | "ARN Rejected: {rejectionReason}" + "Resubmit ARN" button |
| APPROVED | No banner shown |

**ARN Submission Modal** (triggered by "Complete ARN" or "Resubmit ARN"):

Step 1 — "Do you have an ARN?"
- Yes → proceed to Step 2
- No → Show message: "You need a valid ARN to distribute mutual funds. Please register with AMFI to obtain your ARN." No submit button.

Step 2 — ARN Details Form:
- ARN Number (text input, required)
- PAN Number (text input, required, pattern validated)
- EUIN (text input, optional)
- Submit button → calls `submitArn()` → refreshes profile → shows pending status

**No feature locking.** All dashboard sections remain accessible regardless of ARN status (per user's requirement: "IF APPROVED for now this lock is not required").

## Frontend — Admin Side

### New Types in `api.ts`

```typescript
interface ArnRequestResponse {
  userId: number;
  fullName: string;
  firmName: string | null;
  email: string;
  partnerType: string;
  arn: string;
  pan: string;
  euin: string | null;
  arnStatus: string;
  rejectionReason: string | null;
  createdAt: string;
}
```

### New API Calls in `adminUserApi.js`

```javascript
getArnRequests(params)    // GET /api/admin/arn-requests
approveArn(userId)        // PATCH /api/admin/arn-requests/{userId}/approve
rejectArn(userId, reason) // PATCH /api/admin/arn-requests/{userId}/reject
```

### Admin Dashboard Changes (AdminDashboard.tsx)

**New section in sidebar/tab navigation:** "ARN Requests"

**ARN Requests section UI:**

1. Filter tabs: All | Pending | Approved | Rejected
2. Search input: search by partner name or ARN number
3. Data table with columns:
   - Partner Name (show firmName for non-individual, fullName for individual)
   - Partner Type (Individual / Non-Individual badge)
   - ARN Number
   - PAN
   - EUIN (or "—" if empty)
   - Status (color-coded badge: Pending=yellow, Approved=green, Rejected=red)
   - Actions
4. Actions column:
   - PENDING_APPROVAL → "Approve" (green) + "Reject" (red) buttons
   - APPROVED → No action buttons (row stays visible with green status)
   - REJECTED → No action buttons (rejection reason shown on hover/tooltip)

**Reject modal:** On clicking Reject, show a modal with:
- Text: "Reject ARN for {partnerName}?"
- Required textarea: "Rejection reason"
- Cancel + Confirm Reject buttons

**Follows existing admin patterns:** Same table styling, filter pattern, and button styles as existing Partners section.

## Files Changed (Summary)

### Backend (new files)
- `model/ArnStatus.java` — enum
- `dto/partner/ArnSubmitRequest.java` — request DTO
- `dto/admin/ArnRequestResponse.java` — response DTO

### Backend (modified files)
- `model/User.java` — add `arnStatus` field
- `controller/partner/PartnerController.java` — add `POST /arn-submit`
- `service/partner/PartnerService.java` — add `submitArn()` method
- `controller/AdminPartnerController.java` — add 3 ARN admin endpoints
- `dto/partner/PartnerProfileResponse.java` — add `arnStatus` field
- `dto/partner/PartnerStatsResponse.java` — add `arnStatus` if needed for dashboard

### Frontend (modified files)
- `types/api.ts` — add `ArnRequestResponse` interface, update `PartnerProfile`
- `api/partnerApi.ts` — add `submitArn()`
- `api/adminUserApi.js` — add 3 ARN admin API calls
- `pages/dashboards/PartnerDashboard.tsx` — ARN banner + submission modal
- `pages/dashboards/AdminDashboard.tsx` — ARN Requests section

## Out of Scope

- Feature locking (user specified not required for now)
- ARN format validation against AMFI/SEBI registry
- Operations dashboard changes (admin only per decision)
- Audit trail / submission history
- Email notifications on approve/reject