# ARN Onboarding & Approval Workflow — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build an ARN onboarding flow where partners submit ARN details, admins review/approve/reject, and the dashboard reflects status throughout.

**Architecture:** Add `ArnStatus` enum to the data model. Add `arnStatus` field to the existing `User` entity. New endpoint for partner ARN submission, three new admin endpoints for listing/approving/rejecting. Partner Dashboard gets an ARN onboarding page. Admin Dashboard gets a new "ARN Requests" section.

**Tech Stack:** Spring Boot 3.4.2, Java 21, Lombok, React 18, TypeScript, Tailwind-style inline CSS (matching existing dashboard patterns)

---

## File Structure

### Backend — New Files
- `backend/src/main/java/dev/ongolebulls/model/ArnStatus.java` — Enum: NOT_SUBMITTED, PENDING_APPROVAL, APPROVED, REJECTED
- `backend/src/main/java/dev/ongolebulls/dto/partner/ArnSubmitRequest.java` — Request DTO for partner ARN submission
- `backend/src/main/java/dev/ongolebulls/dto/admin/ArnRequestResponse.java` — Response DTO for admin ARN request listing

### Backend — Modified Files
- `backend/src/main/java/dev/ongolebulls/model/User.java` — Add `arnStatus` field
- `backend/src/main/java/dev/ongolebulls/dto/partner/PartnerProfileResponse.java` — Add `arnStatus` field
- `backend/src/main/java/dev/ongolebulls/service/partner/PartnerService.java` — Add `submitArn()`, `getArnRequests()`, `approveArn()`, `rejectArn()` methods
- `backend/src/main/java/dev/ongolebulls/controller/partner/PartnerController.java` — Add `POST /api/partner/arn-submit`
- `backend/src/main/java/dev/ongolebulls/controller/AdminPartnerController.java` — Add 3 ARN admin endpoints

### Frontend — Modified Files
- `frontend/src/types/api.ts` — Add `ArnStatus` type, `ArnRequestResponse` interface, update `PartnerProfile`
- `frontend/src/api/partnerApi.ts` — Add `submitArn()`
- `frontend/src/api/adminUserApi.js` — Add `getArnRequests()`, `approveArn()`, `rejectArn()`
- `frontend/src/pages/dashboards/PartnerDashboard.tsx` — Replace activation banner with ARN status banners, add ARN onboarding page
- `frontend/src/pages/dashboards/AdminDashboard.tsx` — Add "ARN Requests" section to nav and implement the section component

---

## Task 1: Backend — ArnStatus Enum & User Entity

**Files:**
- Create: `backend/src/main/java/dev/ongolebulls/model/ArnStatus.java`
- Modify: `backend/src/main/java/dev/ongolebulls/model/User.java` (add field after line 354)

- [ ] **Step 1: Create ArnStatus enum**

Create file `backend/src/main/java/dev/ongolebulls/model/ArnStatus.java`:

```java
package dev.ongolebulls.model;

public enum ArnStatus {
    NOT_SUBMITTED,
    PENDING_APPROVAL,
    APPROVED,
    REJECTED
}
```

- [ ] **Step 2: Add arnStatus field to User entity**

In `backend/src/main/java/dev/ongolebulls/model/User.java`, add after the `isActivated` field (line 354):

```java
@Enumerated(EnumType.STRING)
@Column(name = "arn_status", columnDefinition = "varchar(255) default 'NOT_SUBMITTED'")
private ArnStatus arnStatus = ArnStatus.NOT_SUBMITTED;
```

Also add import at top of file:
```java
import dev.ongolebulls.model.ArnStatus;
```

Note: Since `User.java` uses Lombok `@Data`, getter/setter are auto-generated.

- [ ] **Step 3: Verify build compiles**

Run: `cd /Users/ramcharan/Desktop/ongolebullsinvest-Final/backend && mvn clean compile -q`
Expected: BUILD SUCCESS

- [ ] **Step 4: Commit**

```bash
git add backend/src/main/java/dev/ongolebulls/model/ArnStatus.java backend/src/main/java/dev/ongolebulls/model/User.java
git commit -m "feat: add ArnStatus enum and arnStatus field to User entity"
```

---

## Task 2: Backend — DTOs

**Files:**
- Create: `backend/src/main/java/dev/ongolebulls/dto/partner/ArnSubmitRequest.java`
- Create: `backend/src/main/java/dev/ongolebulls/dto/admin/ArnRequestResponse.java`
- Modify: `backend/src/main/java/dev/ongolebulls/dto/partner/PartnerProfileResponse.java`

- [ ] **Step 1: Create ArnSubmitRequest DTO**

Create file `backend/src/main/java/dev/ongolebulls/dto/partner/ArnSubmitRequest.java`:

```java
package dev.ongolebulls.dto.partner;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ArnSubmitRequest {

    @NotBlank(message = "ARN number is required")
    private String arnNumber;

    @NotBlank(message = "PAN is required")
    @Pattern(regexp = "^[A-Z]{5}[0-9]{4}[A-Z]{1}$", message = "Invalid PAN format. Expected: ABCDE1234F")
    private String pan;

    private String euin;
}
```

- [ ] **Step 2: Create ArnRequestResponse DTO**

Create file `backend/src/main/java/dev/ongolebulls/dto/admin/ArnRequestResponse.java`:

```java
package dev.ongolebulls.dto.admin;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ArnRequestResponse {
    private Long userId;
    private String fullName;
    private String firmName;
    private String email;
    private String partnerType;
    private String arn;
    private String pan;
    private String euin;
    private String arnStatus;
    private String rejectionReason;
    private Instant createdAt;
}
```

- [ ] **Step 3: Add arnStatus to PartnerProfileResponse**

In `backend/src/main/java/dev/ongolebulls/dto/partner/PartnerProfileResponse.java`, add after the `partnerBankName` field (line 27):

```java
    private String arnStatus;
```

- [ ] **Step 4: Verify build compiles**

Run: `cd /Users/ramcharan/Desktop/ongolebullsinvest-Final/backend && mvn clean compile -q`
Expected: BUILD SUCCESS

- [ ] **Step 5: Commit**

```bash
git add backend/src/main/java/dev/ongolebulls/dto/partner/ArnSubmitRequest.java \
       backend/src/main/java/dev/ongolebulls/dto/admin/ArnRequestResponse.java \
       backend/src/main/java/dev/ongolebulls/dto/partner/PartnerProfileResponse.java
git commit -m "feat: add ARN onboarding DTOs and arnStatus to PartnerProfileResponse"
```

---

## Task 3: Backend — PartnerService ARN Methods

**Files:**
- Modify: `backend/src/main/java/dev/ongolebulls/service/partner/PartnerService.java`

- [ ] **Step 1: Update getProfile to include arnStatus**

In `PartnerService.java`, in the `getProfile` method (around line 46-70), add `.arnStatus(partner.getArnStatus() != null ? partner.getArnStatus().name() : "NOT_SUBMITTED")` to the builder chain. Add it after the `.partnerBankName(...)` line and before `.isActivated(...)`:

Find this in the builder:
```java
            .partnerBankName(partner.getPartnerBankName())
            .isActivated(partner.isActivated())
```

Replace with:
```java
            .partnerBankName(partner.getPartnerBankName())
            .arnStatus(partner.getArnStatus() != null ? partner.getArnStatus().name() : "NOT_SUBMITTED")
            .isActivated(partner.isActivated())
```

- [ ] **Step 2: Add submitArn method**

Add this method to `PartnerService.java` (after the `acceptAgreement` method, around line 153):

```java
    public PartnerProfileResponse submitArn(User partner, ArnSubmitRequest request) {
        partner.setArn(request.getArnNumber());
        partner.setPan(request.getPan());
        if (request.getEuin() != null && !request.getEuin().isBlank()) {
            partner.setEuin(request.getEuin());
        }
        partner.setArnStatus(ArnStatus.PENDING_APPROVAL);
        partner.setRejectionReason(null);
        userRepository.save(partner);
        log.info("Partner {} submitted ARN for approval", partner.getId());
        return getProfile(partner);
    }
```

Add these imports at the top of the file:
```java
import dev.ongolebulls.model.ArnStatus;
import dev.ongolebulls.dto.partner.ArnSubmitRequest;
import dev.ongolebulls.dto.admin.ArnRequestResponse;
```

- [ ] **Step 3: Add getArnRequests method**

Add this method to `PartnerService.java`:

```java
    public List<ArnRequestResponse> getArnRequests(String status, String search) {
        List<Role> partnerRoles = List.of(Role.INDIVIDUAL_PARTNER, Role.NON_INDIVIDUAL_PARTNER);
        List<User> partners = userRepository.findByRoleIn(partnerRoles);

        return partners.stream()
                .filter(p -> p.getArnStatus() != null && p.getArnStatus() != ArnStatus.NOT_SUBMITTED)
                .filter(p -> {
                    if (status == null || status.isBlank()) return true;
                    return status.equalsIgnoreCase(p.getArnStatus().name());
                })
                .filter(p -> {
                    if (search == null || search.isBlank()) return true;
                    String q = search.toLowerCase();
                    String name = p.getFullName() != null ? p.getFullName().toLowerCase() : "";
                    String firmName = p.getFirmName() != null ? p.getFirmName().toLowerCase() : "";
                    String arn = p.getArn() != null ? p.getArn().toLowerCase() : "";
                    return name.contains(q) || firmName.contains(q) || arn.contains(q);
                })
                .map(this::toArnRequestResponse)
                .toList();
    }

    private ArnRequestResponse toArnRequestResponse(User u) {
        return ArnRequestResponse.builder()
                .userId(u.getId())
                .fullName(u.getFullName())
                .firmName(u.getFirmName())
                .email(u.getEmail())
                .partnerType(u.getRole().name())
                .arn(u.getArn())
                .pan(u.getPan())
                .euin(u.getEuin())
                .arnStatus(u.getArnStatus() != null ? u.getArnStatus().name() : "NOT_SUBMITTED")
                .rejectionReason(u.getRejectionReason())
                .createdAt(u.getCreatedAt())
                .build();
    }
```

Add this import:
```java
import java.util.List;
```

- [ ] **Step 4: Add approveArn method**

Add this method to `PartnerService.java`:

```java
    public ArnRequestResponse approveArn(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Partner not found"));
        List<Role> partnerRoles = List.of(Role.INDIVIDUAL_PARTNER, Role.NON_INDIVIDUAL_PARTNER);
        if (!partnerRoles.contains(user.getRole())) {
            throw new RuntimeException("User is not a partner");
        }
        user.setArnStatus(ArnStatus.APPROVED);
        user.setActivated(true);
        user.setRejectionReason(null);
        userRepository.save(user);
        log.info("Partner {} ARN approved", userId);
        return toArnRequestResponse(user);
    }
```

- [ ] **Step 5: Add rejectArn method**

Add this method to `PartnerService.java`:

```java
    public ArnRequestResponse rejectArn(Long userId, String reason) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Partner not found"));
        List<Role> partnerRoles = List.of(Role.INDIVIDUAL_PARTNER, Role.NON_INDIVIDUAL_PARTNER);
        if (!partnerRoles.contains(user.getRole())) {
            throw new RuntimeException("User is not a partner");
        }
        user.setArnStatus(ArnStatus.REJECTED);
        user.setRejectionReason(reason);
        userRepository.save(user);
        log.info("Partner {} ARN rejected: {}", userId, reason);
        return toArnRequestResponse(user);
    }
```

- [ ] **Step 6: Verify build compiles**

Run: `cd /Users/ramcharan/Desktop/ongolebullsinvest-Final/backend && mvn clean compile -q`
Expected: BUILD SUCCESS

- [ ] **Step 7: Commit**

```bash
git add backend/src/main/java/dev/ongolebulls/service/partner/PartnerService.java
git commit -m "feat: add ARN submit, approve, reject methods to PartnerService"
```

---

## Task 4: Backend — Controller Endpoints

**Files:**
- Modify: `backend/src/main/java/dev/ongolebulls/controller/partner/PartnerController.java`
- Modify: `backend/src/main/java/dev/ongolebulls/controller/AdminPartnerController.java`

- [ ] **Step 1: Add POST /api/partner/arn-submit endpoint**

In `PartnerController.java`, add this method after the `acceptAgreement` endpoint (after line 92):

```java
    @PostMapping("/arn-submit")
    public ResponseEntity<?> submitArn(Authentication auth, @Valid @RequestBody ArnSubmitRequest request) {
        try {
            User partner = partnerService.getCurrentPartner(auth);
            return ResponseEntity.ok(partnerService.submitArn(partner, request));
        } catch (Exception e) {
            log.error("Error submitting ARN: {}", e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
```

Add these imports to `PartnerController.java`:
```java
import dev.ongolebulls.dto.partner.ArnSubmitRequest;
import jakarta.validation.Valid;
```

- [ ] **Step 2: Add GET /api/admin/partners/arn-requests endpoint**

In `AdminPartnerController.java`, add these three methods after the `deactivatePartner` method (after line 95):

```java
    @GetMapping("/arn-requests")
    public ResponseEntity<List<ArnRequestResponse>> getArnRequests(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String search
    ) {
        return ResponseEntity.ok(partnerService.getArnRequests(status, search));
    }

    @PatchMapping("/arn-requests/{userId}/approve")
    public ResponseEntity<?> approveArn(@PathVariable Long userId) {
        try {
            return ResponseEntity.ok(partnerService.approveArn(userId));
        } catch (Exception e) {
            log.error("Error approving ARN for user {}: {}", userId, e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PatchMapping("/arn-requests/{userId}/reject")
    public ResponseEntity<?> rejectArn(@PathVariable Long userId, @RequestBody Map<String, String> body) {
        try {
            String reason = body.getOrDefault("reason", "No reason provided");
            return ResponseEntity.ok(partnerService.rejectArn(userId, reason));
        } catch (Exception e) {
            log.error("Error rejecting ARN for user {}: {}", userId, e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
```

Add these imports to `AdminPartnerController.java`:
```java
import dev.ongolebulls.dto.admin.ArnRequestResponse;
import dev.ongolebulls.service.partner.PartnerService;
```

Also inject `PartnerService` in the controller. `AdminPartnerController` currently injects `UserRepository` directly. Add `PartnerService` injection:

```java
    private final PartnerService partnerService;
```

And add it to the constructor (if using constructor injection) or add `@Autowired` annotation. Check existing injection pattern — if the class uses `@RequiredArgsConstructor` (Lombok), just add the `private final` field and Lombok handles the rest.

- [ ] **Step 3: Verify build compiles**

Run: `cd /Users/ramcharan/Desktop/ongolebullsinvest-Final/backend && mvn clean compile -q`
Expected: BUILD SUCCESS

- [ ] **Step 4: Build full package**

Run: `cd /Users/ramcharan/Desktop/ongolebullsinvest-Final/backend && mvn clean package -DskipTests -q`
Expected: BUILD SUCCESS

- [ ] **Step 5: Commit**

```bash
git add backend/src/main/java/dev/ongolebulls/controller/partner/PartnerController.java \
       backend/src/main/java/dev/ongolebulls/controller/AdminPartnerController.java
git commit -m "feat: add ARN submit, approve, reject controller endpoints"
```

---

## Task 5: Frontend — Types & API Calls

**Files:**
- Modify: `frontend/src/types/api.ts`
- Modify: `frontend/src/api/partnerApi.ts`
- Modify: `frontend/src/api/adminUserApi.js`

- [ ] **Step 1: Update PartnerProfile interface in api.ts**

In `frontend/src/types/api.ts`, find the `PartnerProfile` interface (line 100). Add `arnStatus` field after `partnerBankName`:

Find:
```typescript
  partnerBankName: string | null;
  isActivated: boolean;
```

Replace with:
```typescript
  partnerBankName: string | null;
  arnStatus: 'NOT_SUBMITTED' | 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED';
  rejectionReason: string | null;
  isActivated: boolean;
```

- [ ] **Step 2: Add ArnRequestResponse interface in api.ts**

Add this interface after the `PartnerProfile` interface (after line 122):

```typescript
export interface ArnRequestResponse {
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

- [ ] **Step 3: Add submitArn to partnerApi.ts**

In `frontend/src/api/partnerApi.ts`, add after the `acceptAgreement` method (after line 16):

```typescript
  // ARN Onboarding
  submitArn: (data: { arnNumber: string; pan: string; euin?: string }) =>
    api.post('/api/partner/arn-submit', data),
```

- [ ] **Step 4: Add ARN admin API calls to adminUserApi.js**

In `frontend/src/api/adminUserApi.js`, add after the `deactivatePartner` line (after line 17):

```javascript
  // ARN Requests
  getArnRequests: (params) => api.get('/api/admin/partners/arn-requests', { params }),
  approveArn: (userId) => api.patch(`/api/admin/partners/arn-requests/${userId}/approve`),
  rejectArn: (userId, reason) => api.patch(`/api/admin/partners/arn-requests/${userId}/reject`, { reason }),
```

- [ ] **Step 5: Verify frontend builds**

Run: `cd /Users/ramcharan/Desktop/ongolebullsinvest-Final/frontend && npm run build`
Expected: Build succeeds (no type errors)

- [ ] **Step 6: Commit**

```bash
git add frontend/src/types/api.ts frontend/src/api/partnerApi.ts frontend/src/api/adminUserApi.js
git commit -m "feat: add ARN onboarding types and API calls"
```

---

## Task 6: Frontend — Partner Dashboard ARN Onboarding

**Files:**
- Modify: `frontend/src/pages/dashboards/PartnerDashboard.tsx`

This is the largest frontend task. We modify the existing PartnerDashboard to:
1. Replace the existing `ActivationBanner` with ARN-status-aware banners
2. Add an ARN onboarding page (shown when user clicks "Complete ARN" or "Resubmit ARN")
3. Update the overview section's focus card

- [ ] **Step 1: Add 'arn-onboarding' to the Section type**

In `PartnerDashboard.tsx`, find the `Section` type (around line 15-17). It looks like:
```typescript
type Section = 'overview' | 'clients' | 'transactions' | 'sips' | 'revenue' | 'tracker' | 'profile' | 'referrals';
```

Add `'arn-onboarding'` to it:
```typescript
type Section = 'overview' | 'clients' | 'transactions' | 'sips' | 'revenue' | 'tracker' | 'profile' | 'referrals' | 'arn-onboarding';
```

- [ ] **Step 2: Replace the ActivationBanner component**

Find the `ActivationBanner` component (around line 267-280). Replace it entirely with an ARN-status-aware banner:

```typescript
function ArnStatusBanner({ profile, onCompleteArn }: { profile: PartnerProfile; onCompleteArn: () => void }) {
  if (profile.arnStatus === 'APPROVED') return null;

  const configs: Record<string, { bg: string; border: string; iconColor: string; title: string; desc: string; btnLabel?: string }> = {
    NOT_SUBMITTED: {
      bg: C.amber50, border: C.amber500, iconColor: '#92400E',
      title: 'ARN Verification Required',
      desc: 'Submit your ARN details to get verified and start using the platform.',
      btnLabel: 'Complete ARN',
    },
    PENDING_APPROVAL: {
      bg: '#EFF6FF', border: '#3B82F6', iconColor: '#1E40AF',
      title: 'ARN Verification Pending',
      desc: 'Your ARN submission is under review. We will notify you once verified.',
    },
    REJECTED: {
      bg: '#FEF2F2', border: '#EF4444', iconColor: '#991B1B',
      title: 'ARN Verification Rejected',
      desc: profile.rejectionReason ? `Reason: ${profile.rejectionReason}. Please resubmit with correct details.` : 'Your ARN was rejected. Please resubmit.',
      btnLabel: 'Resubmit ARN',
    },
  };
  const c = configs[profile.arnStatus] || configs.NOT_SUBMITTED;

  return (
    <div style={{ background: c.bg, border: `1px solid ${c.border}33`, borderLeft: `4px solid ${c.border}`, borderRadius: 12, padding: '20px 24px', marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
        <Lock size={18} color={c.iconColor} style={{ marginTop: 2, flexShrink: 0 }} />
        <div>
          <div style={{ fontWeight: 600, fontSize: 15, color: c.iconColor, marginBottom: 4 }}>{c.title}</div>
          <div style={{ fontSize: 14, color: c.iconColor + 'CC' }}>{c.desc}</div>
        </div>
      </div>
      {c.btnLabel && <button type="button" style={S.btnPrimary} onClick={onCompleteArn}>{c.btnLabel} <ArrowRight size={14} /></button>}
    </div>
  );
}
```

- [ ] **Step 3: Add the ArnOnboardingSection component**

Add this new component in `PartnerDashboard.tsx` (after the `ArnStatusBanner` component):

```typescript
function ArnOnboardingSection({ profile, showToast, setSection }: { profile: PartnerProfile; showToast: (t: 'success' | 'error', m: string) => void; setSection: (s: Section) => void }) {
  const [step, setStep] = useState<'ask' | 'form' | 'no-arn'>('ask');
  const [arnNumber, setArnNumber] = useState(profile.arn || '');
  const [pan, setPan] = useState(profile.pan || '');
  const [euin, setEuin] = useState(profile.euin || '');
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!arnNumber.trim()) e.arnNumber = 'ARN number is required';
    if (!pan.trim()) e.pan = 'PAN is required';
    else if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(pan)) e.pan = 'Invalid PAN format (e.g. ABCDE1234F)';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    try {
      await partnerApi.submitArn({ arnNumber: arnNumber.trim(), pan: pan.trim(), euin: euin.trim() || undefined });
      showToast('success', 'ARN submitted for verification');
      setSection('overview');
    } catch (err: any) {
      showToast('error', err?.response?.data?.error || 'Failed to submit ARN');
    } finally {
      setSubmitting(false);
    }
  };

  if (step === 'no-arn') {
    return (
      <div style={{ maxWidth: 640, margin: '0 auto' }}>
        <button type="button" onClick={() => setStep('ask')} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, color: C.primary, fontWeight: 500, fontSize: 14, marginBottom: 24, padding: 0 }}>
          <ArrowRight size={14} style={{ transform: 'rotate(180deg)' }} /> Back
        </button>
        <div style={{ background: C.card, borderRadius: 16, border: `1px solid ${C.border}`, padding: 32 }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: C.text, marginBottom: 8 }}>How to Get Your ARN</h2>
          <p style={{ fontSize: 14, color: C.textSecondary, marginBottom: 24 }}>
            ARN (AMFI Registration Number) is mandatory for mutual fund distribution in India. Follow these steps to obtain your ARN:
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 24 }}>
            {[
              { num: '1', title: 'Pass NISM Certification', desc: 'Clear the NISM Series V-A: Mutual Fund Distributors Certification Examination.' },
              { num: '2', title: 'Register on AMFI Portal', desc: 'Visit the AMFI website and complete the ARN registration process with required documents.' },
              { num: '3', title: 'Receive Your ARN', desc: 'Once approved, AMFI will issue your unique ARN which you can submit here.' },
            ].map(s => (
              <div key={s.num} style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: C.primary, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14, flexShrink: 0 }}>{s.num}</div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 15, color: C.text, marginBottom: 2 }}>{s.title}</div>
                  <div style={{ fontSize: 13, color: C.textSecondary }}>{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
          <a href="https://www.amfiindia.com/distributor-corner" target="_blank" rel="noopener noreferrer"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: C.primary, color: '#fff', padding: '12px 24px', borderRadius: 10, fontWeight: 600, fontSize: 14, textDecoration: 'none', marginBottom: 16 }}>
            Visit AMFI Portal <ArrowRight size={14} />
          </a>
          <div style={{ marginTop: 16 }}>
            <button type="button" style={{ ...S.btnPrimary, background: 'transparent', color: C.primary, border: `1px solid ${C.primary}` }} onClick={() => { setStep('form'); }}>
              I Have My ARN Now
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'form') {
    return (
      <div style={{ maxWidth: 640, margin: '0 auto' }}>
        <button type="button" onClick={() => setStep('ask')} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, color: C.primary, fontWeight: 500, fontSize: 14, marginBottom: 24, padding: 0 }}>
          <ArrowRight size={14} style={{ transform: 'rotate(180deg)' }} /> Back
        </button>
        <div style={{ background: C.card, borderRadius: 16, border: `1px solid ${C.border}`, padding: 32 }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: C.text, marginBottom: 8 }}>Submit ARN Details</h2>
          <p style={{ fontSize: 14, color: C.textSecondary, marginBottom: 24 }}>Enter your AMFI registration details for verification.</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 6 }}>ARN Number *</label>
              <input type="text" value={arnNumber} onChange={e => { setArnNumber(e.target.value); setErrors(prev => ({ ...prev, arnNumber: '' })); }}
                placeholder="e.g. ARN-12345" style={{ ...S.input, borderColor: errors.arnNumber ? '#EF4444' : C.border }} />
              {errors.arnNumber && <div style={{ color: '#EF4444', fontSize: 12, marginTop: 4 }}>{errors.arnNumber}</div>}
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 6 }}>PAN Number *</label>
              <input type="text" value={pan} onChange={e => { setPan(e.target.value.toUpperCase()); setErrors(prev => ({ ...prev, pan: '' })); }}
                placeholder="e.g. ABCDE1234F" maxLength={10} style={{ ...S.input, borderColor: errors.pan ? '#EF4444' : C.border }} />
              {errors.pan && <div style={{ color: '#EF4444', fontSize: 12, marginTop: 4 }}>{errors.pan}</div>}
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 6 }}>EUIN (Optional)</label>
              <input type="text" value={euin} onChange={e => setEuin(e.target.value)}
                placeholder="e.g. E123456" style={S.input} />
            </div>
            <button type="button" style={{ ...S.btnPrimary, width: '100%', justifyContent: 'center', opacity: submitting ? 0.7 : 1 }}
              onClick={handleSubmit} disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit for Verification'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // step === 'ask'
  return (
    <div style={{ maxWidth: 640, margin: '0 auto' }}>
      <div style={{ background: C.card, borderRadius: 16, border: `1px solid ${C.border}`, padding: 32, textAlign: 'center' }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: C.text, marginBottom: 8 }}>ARN Verification</h2>
        <p style={{ fontSize: 14, color: C.textSecondary, marginBottom: 32 }}>
          Do you have an AMFI Registration Number (ARN)?
        </p>
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
          <button type="button" style={{ ...S.btnPrimary, padding: '14px 40px', fontSize: 15 }} onClick={() => setStep('form')}>
            Yes, I have an ARN
          </button>
          <button type="button" style={{ ...S.btnPrimary, padding: '14px 40px', fontSize: 15, background: 'transparent', color: C.text, border: `1px solid ${C.border}` }} onClick={() => setStep('no-arn')}>
            No, I don't
          </button>
        </div>
      </div>
    </div>
  );
}
```

Add `useState` to imports if not already there (it should be). Also ensure `partnerApi` is imported at the top of the file — it likely already is via `import { partnerApi } from '../../api/partnerApi';`.

- [ ] **Step 4: Update the OverviewSection to use ArnStatusBanner instead of ActivationBanner**

In the `OverviewSection` component (around line 327), find where `ActivationBanner` is rendered. It will look something like:

```typescript
{!profile.isActivated && <ActivationBanner onGoProfile={() => setSection('profile')} />}
```

Replace with:
```typescript
<ArnStatusBanner profile={profile} onCompleteArn={() => setSection('arn-onboarding')} />
```

- [ ] **Step 5: Update the focus card title and action**

Find the focus card logic (around lines 432-438):
```typescript
const focusTitle = !profile.hasArn
    ? 'Complete ARN to unlock client onboarding and start using the full partner workflow.'
    : 'ARN is completed. Review your profile and keep partner credentials current to preserve full dashboard access.';
const focusActionLabel = !profile.hasArn ? 'Complete ARN' : 'Open Profile';
const focusAction = () => {
    setSection('profile');
};
```

Replace with:
```typescript
const focusTitle = profile.arnStatus === 'NOT_SUBMITTED'
    ? 'Complete ARN verification to unlock client onboarding and start using the full partner workflow.'
    : profile.arnStatus === 'PENDING_APPROVAL'
    ? 'Your ARN is under review. You will be notified once verified.'
    : profile.arnStatus === 'REJECTED'
    ? 'Your ARN was rejected. Please resubmit with correct details.'
    : 'ARN verified. Review your profile and keep partner credentials current.';
const focusActionLabel = profile.arnStatus === 'NOT_SUBMITTED' ? 'Complete ARN'
    : profile.arnStatus === 'REJECTED' ? 'Resubmit ARN'
    : profile.arnStatus === 'PENDING_APPROVAL' ? 'View Status'
    : 'Open Profile';
const focusAction = () => {
    if (profile.arnStatus === 'NOT_SUBMITTED' || profile.arnStatus === 'REJECTED') {
        setSection('arn-onboarding');
    } else {
        setSection('profile');
    }
};
```

- [ ] **Step 6: Add arn-onboarding section to the render switch**

Find where sections are rendered in the main component body. There should be a conditional render block like:

```typescript
{section === 'overview' && <OverviewSection ... />}
{section === 'profile' && <ProfileSection ... />}
{section === 'clients' && <ClientsSection ... />}
```

Add the new section:
```typescript
{section === 'arn-onboarding' && <ArnOnboardingSection profile={profile} showToast={showToast} setSection={setSection} />}
```

Note: `arn-onboarding` is not added to the `NAV_ITEMS` array — it's not a sidebar nav item. It's only accessed via the banner button or focus card.

- [ ] **Step 7: Verify frontend builds**

Run: `cd /Users/ramcharan/Desktop/ongolebullsinvest-Final/frontend && npm run build`
Expected: Build succeeds

- [ ] **Step 8: Commit**

```bash
git add frontend/src/pages/dashboards/PartnerDashboard.tsx
git commit -m "feat: add ARN onboarding page and status banners to Partner Dashboard"
```

---

## Task 7: Frontend — Admin Dashboard ARN Requests Section

**Files:**
- Modify: `frontend/src/pages/dashboards/AdminDashboard.tsx`

- [ ] **Step 1: Add 'arnRequests' to the Section type and NAV array**

Find the `Section` type in `AdminDashboard.tsx` (around line 44). Add `'arnRequests'` to it.

Find the `NAV` array (around line 90-99). Add a new entry after 'partners':

```typescript
  { key: 'arnRequests', label: 'ARN Requests', icon: <FileCheck size={16} /> },
```

Add `FileCheck` to the lucide-react import at the top of the file.

- [ ] **Step 2: Add the ArnRequestsSection component**

Add this component in `AdminDashboard.tsx` (after the existing `PartnersSection` component, before the main dashboard component):

```typescript
function ArnRequestsSection({ showToast }: { showToast: (t: Toast['type'], m: string) => void }) {
  const [requests, setRequests] = useState<ArnRequestResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [rejectModal, setRejectModal] = useState<{ userId: number; name: string } | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params: Record<string, string> = {};
      if (statusFilter) params.status = statusFilter;
      if (search) params.search = search;
      const res = await adminUserApi.getArnRequests(params);
      setRequests(Array.isArray(res.data) ? res.data : []);
    } catch {
      setError('Failed to load ARN requests');
      setRequests([]);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, search]);

  useEffect(() => { load(); }, [load]);

  const handleApprove = async (userId: number) => {
    setActionLoading(userId);
    try {
      await adminUserApi.approveArn(userId);
      showToast('success', 'ARN approved successfully');
      load();
    } catch {
      showToast('error', 'Failed to approve ARN');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async () => {
    if (!rejectModal || !rejectReason.trim()) return;
    setActionLoading(rejectModal.userId);
    try {
      await adminUserApi.rejectArn(rejectModal.userId, rejectReason.trim());
      showToast('success', 'ARN rejected');
      setRejectModal(null);
      setRejectReason('');
      load();
    } catch {
      showToast('error', 'Failed to reject ARN');
    } finally {
      setActionLoading(null);
    }
  };

  const STATUS_FILTERS = [
    { label: 'All', value: '' },
    { label: 'Pending', value: 'PENDING_APPROVAL' },
    { label: 'Approved', value: 'APPROVED' },
    { label: 'Rejected', value: 'REJECTED' },
  ];

  const statusBadge = (status: string) => {
    const map: Record<string, { bg: string; color: string; label: string }> = {
      PENDING_APPROVAL: { bg: '#FEF3C7', color: '#92400E', label: 'Pending' },
      APPROVED: { bg: '#D1FAE5', color: '#065F46', label: 'Approved' },
      REJECTED: { bg: '#FEE2E2', color: '#991B1B', label: 'Rejected' },
    };
    const s = map[status] || { bg: '#F3F4F6', color: '#6B7280', label: status };
    return <span style={{ padding: '3px 10px', borderRadius: 999, fontSize: 12, fontWeight: 600, background: s.bg, color: s.color }}>{s.label}</span>;
  };

  return (
    <>
      <div className="ap-section-header">
        <h2>ARN Requests</h2>
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
        <div className="ap-filter-group">
          {STATUS_FILTERS.map(f => (
            <button key={f.value} type="button"
              className={`ap-filter-btn ${statusFilter === f.value ? 'active' : ''}`}
              onClick={() => setStatusFilter(f.value)}>{f.label}</button>
          ))}
        </div>
        <input type="text" className="ap-search" placeholder="Search by name or ARN..."
          value={search} onChange={e => setSearch(e.target.value)} style={{ marginLeft: 'auto', maxWidth: 260 }} />
      </div>

      {error && <div className="ap-error">{error}</div>}

      <div className="ap-table-wrap">
        <table className="ap-table">
          <thead>
            <tr>
              <th>Partner Name</th>
              <th>Type</th>
              <th>ARN Number</th>
              <th>PAN</th>
              <th>EUIN</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7}><div className="ap-loading"><div className="ap-spinner" /></div></td></tr>
            ) : requests.length ? (
              requests.map(r => (
                <tr key={r.userId}>
                  <td>{r.partnerType === 'NON_INDIVIDUAL_PARTNER' ? (r.firmName || r.fullName || '-') : (r.fullName || '-')}</td>
                  <td>{ROLE_LABELS[r.partnerType] || r.partnerType}</td>
                  <td>{r.arn || '-'}</td>
                  <td>{r.pan || '-'}</td>
                  <td>{r.euin || '-'}</td>
                  <td>
                    {statusBadge(r.arnStatus)}
                    {r.arnStatus === 'REJECTED' && r.rejectionReason && (
                      <div style={{ fontSize: 11, color: '#991B1B', marginTop: 4 }} title={r.rejectionReason}>
                        Reason: {r.rejectionReason.length > 30 ? r.rejectionReason.slice(0, 30) + '...' : r.rejectionReason}
                      </div>
                    )}
                  </td>
                  <td>
                    <div className="ap-actions">
                      {r.arnStatus === 'PENDING_APPROVAL' && (
                        <>
                          <button type="button" className="ap-btn ap-btn-primary" onClick={() => handleApprove(r.userId)}
                            disabled={actionLoading === r.userId} style={{ fontSize: 12, padding: '5px 10px' }}>Approve</button>
                          <button type="button" className="ap-btn ap-btn-danger" onClick={() => setRejectModal({ userId: r.userId, name: r.fullName || r.firmName || 'Partner' })}
                            disabled={actionLoading === r.userId} style={{ fontSize: 12, padding: '5px 10px' }}>Reject</button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan={7}><div className="ap-empty">No ARN requests found</div></td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Reject Modal */}
      {rejectModal && (
        <div className="ap-modal-backdrop">
          <div className="ap-modal" role="dialog" aria-modal="true" style={{ maxWidth: 480 }}>
            <div className="ap-modal-header">
              <h2>Reject ARN</h2>
              <button type="button" className="ap-btn ap-btn-ghost" onClick={() => { setRejectModal(null); setRejectReason(''); }}><X size={16} /></button>
            </div>
            <div className="ap-modal-body">
              <p style={{ marginBottom: 16, fontSize: 14 }}>Reject ARN for <strong>{rejectModal.name}</strong>?</p>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Rejection Reason *</label>
              <textarea value={rejectReason} onChange={e => setRejectReason(e.target.value)}
                placeholder="Enter reason for rejection..." rows={3}
                style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #D1D5DB', fontSize: 14, resize: 'vertical' }} />
            </div>
            <div className="ap-modal-footer">
              <button type="button" className="ap-btn ap-btn-secondary" onClick={() => { setRejectModal(null); setRejectReason(''); }}>Cancel</button>
              <button type="button" className="ap-btn ap-btn-danger" onClick={handleReject}
                disabled={!rejectReason.trim() || actionLoading === rejectModal.userId}>
                {actionLoading === rejectModal.userId ? 'Rejecting...' : 'Confirm Reject'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
```

Add the `ArnRequestResponse` import at the top:
```typescript
import type { ArnRequestResponse } from '../../types/api';
```

- [ ] **Step 3: Add ArnRequestsSection to the render switch**

Find where sections are conditionally rendered in the main admin component. There will be a pattern like:

```typescript
{section === 'partners' && <PartnersSection showToast={showToast} />}
```

Add after it:
```typescript
{section === 'arnRequests' && <ArnRequestsSection showToast={showToast} />}
```

- [ ] **Step 4: Verify frontend builds**

Run: `cd /Users/ramcharan/Desktop/ongolebullsinvest-Final/frontend && npm run build`
Expected: Build succeeds

- [ ] **Step 5: Commit**

```bash
git add frontend/src/pages/dashboards/AdminDashboard.tsx
git commit -m "feat: add ARN Requests section to Admin Dashboard"
```

---

## Task 8: Final Verification

- [ ] **Step 1: Full backend build**

Run: `cd /Users/ramcharan/Desktop/ongolebullsinvest-Final/backend && mvn clean package -DskipTests`
Expected: BUILD SUCCESS

- [ ] **Step 2: Full frontend build**

Run: `cd /Users/ramcharan/Desktop/ongolebullsinvest-Final/frontend && npm run build`
Expected: Build succeeds with no errors

- [ ] **Step 3: Verify all files are committed**

Run: `cd /Users/ramcharan/Desktop/ongolebullsinvest-Final && git status`
Expected: Clean working directory (nothing unstaged)

- [ ] **Step 4: Review commit log**

Run: `cd /Users/ramcharan/Desktop/ongolebullsinvest-Final && git log --oneline -10`
Expected: See all feature commits for ARN onboarding