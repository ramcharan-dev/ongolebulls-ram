export type Role =
  | 'ADMIN'
  | 'INDIVIDUAL_PARTNER'
  | 'NON_INDIVIDUAL_PARTNER'
  | 'RELATIONSHIP_MANAGER'
  | 'OPERATIONS'
  | 'COMPLIANCE'
  | 'FINANCE'
  | 'SUPPORT'
  | 'USER';

export interface AuthUser {
  email: string;
  name: string;
  role: Role;
}

export interface LoginResponse {
  token: string;
  role: Role;
  email: string;
  name: string;
}

export interface PartnerRegistrationRequest {
  partnerType: 'INDIVIDUAL_PARTNER' | 'NON_INDIVIDUAL_PARTNER';
  email: string;
  mobile: string;
  password: string;
  fullName?: string;
  firmName?: string;
  authorizedPerson?: string;
  pan: string;
  arn: string;
  euin?: string;
  euinHolderName?: string;
  bankAccount: string;
  ifsc: string;
  bankName: string;
  // Partner location — required, drives RM auto-assignment
  state: string;
  district: string;
  city: string;
}

export interface CreateUserRequest {
  name: string;
  email: string;
  role: Exclude<Role, 'INDIVIDUAL_PARTNER' | 'NON_INDIVIDUAL_PARTNER' | 'USER'>;
  password: string;
  // Only used when role = RELATIONSHIP_MANAGER
  assignedState?: string;
  assignedDistrict?: string;
}

export interface UserSummary {
  id: number;
  name: string;
  email: string;
  role: Role;
  isActivated: boolean;
  activated?: boolean;
  createdAt: string;
  assignedState?: string | null;
  assignedDistrict?: string | null;
}

export interface AdminStats {
  totalPartners: number;
  activePartners: number;
  pendingActivation: number;
  totalClients: number;
  recentPartners: UserSummary[];
  recentInternalUsers: UserSummary[];
}

export interface PartnerSummary {
  id: number;
  fullName: string;
  firmName: string | null;
  email: string;
  mobileNumber: string;
  partnerType: string;
  arn: string | null;
  pan: string | null;
  euin: string | null;
  partnerBankAccount: string | null;
  partnerIfsc: string | null;
  partnerBankName: string | null;
  isActivated: boolean;
  activated?: boolean;
  createdAt: string;
  state: string | null;
  district: string | null;
  city: string | null;
  assignedRmId: number | null;
  assignedRmName: string | null;
}

export interface ClientSummary {
  id: number;
  fullName: string;
  email: string;
  mobileNumber: string;
  isActivated: boolean;
  activated?: boolean;
  createdAt: string;
  kycStatus: string;
  assignedPartnerName: string | null;
}

// ── Partner Dashboard Types ──────────────────────────────────────────────────

export interface PartnerProfile {
  id: number;
  fullName: string;
  email: string;
  mobileNumber: string;
  pan: string | null;
  arn: string | null;
  euin: string | null;
  euinHolderName: string | null;
  firmName: string | null;
  authorizedPerson: string | null;
  partnerBankAccount: string | null;
  partnerIfsc: string | null;
  partnerBankName: string | null;
  arnStatus: 'NOT_SUBMITTED' | 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED';
  rejectionReason: string | null;
  isActivated: boolean;
  termsAccepted: boolean;
  declarationAccepted: boolean;
  role: Role;
  createdAt: string;
  hasArn: boolean;
  hasBankDetails: boolean;
  hasAgreement: boolean;
  // Location + assigned RM (read-only to the partner)
  state: string | null;
  district: string | null;
  city: string | null;
  assignedRmId: number | null;
  assignedRmName: string | null;
  assignedRmEmail: string | null;
}

export interface PartnerStats {
  totalClients: number;
  activeInvestors: number;
  pendingKyc: number;
  monthlySips: number;
  totalTransactions: number;
  totalTransactionAmount: number;
  totalRevenue: number;
  lifecycleDistribution: Record<string, number>;
}

export interface PartnerTransaction {
  id: number;
  clientId: number | null;
  clientName: string | null;
  type: string;
  schemeName: string | null;
  amount: number;
  status: string;
  notes: string | null;
  createdAt: string;
}

export interface PartnerRevenue {
  totalRevenue: number;
  releasedRevenue: number;
  pendingRevenue: number;
  monthlyBreakdown: { period: string; gross: number; net: number; status: string }[];
}

export type LifecycleStage =
  | 'LEAD_CREATED'
  | 'LINK_SENT'
  | 'LINK_OPENED'
  | 'KYC_STARTED'
  | 'KYC_COMPLETED'
  | 'INVESTMENT_READY'
  | 'ACTIVE_INVESTOR';

export interface PartnerClientSummary {
  id: number;
  fullName: string;
  email: string;
  mobileNumber: string;
  lifecycleStage: LifecycleStage;
  kycStatus: string;
  createdAt: string;
  lastActivityDate: string;
}

export interface SipSummary {
  id: number;
  clientName: string;
  clientId: number;
  fundName: string;
  amount: number;
  frequency: string;
  startDate: string | null;
  nextDueDate: string | null;
  status: string;
}

export interface TrackerHolding {
  id: number;
  clientName: string;
  clientId: number | null;
  amcName: string;
  fundName: string;
  folioNumber: string;
  units: number;
  nav: number;
  currentValue: number;
  uploadDate: string;
}

export interface TrackerSummary {
  holdings: TrackerHolding[];
  totalValue: number;
  folioCount: number;
  amcCount: number;
}

export interface CobOpportunity {
  clientName: string;
  amcCount: number;
  totalValue: number;
}

// ── RM Dashboard Types ──────────────────────────────────────────────────────

export interface RMPartnerSummary {
  id: number;
  fullName: string | null;
  firmName: string | null;
  email: string;
  mobileNumber: string;
  partnerType: string;
  arn: string | null;
  pan: string | null;
  euin: string | null;
  partnerBankAccount: string | null;
  partnerIfsc: string | null;
  partnerBankName: string | null;
  isActivated: boolean;
  clientCount: number;
  createdAt: string;
  notes: string | null;
}

export interface RMStats {
  totalPartners: number;
  activePartners: number;
  pendingActivation: number;
  totalClients: number;
  pendingPartners: RMPartnerSummary[];
  recentPartners: RMPartnerSummary[];
}

export interface RMPerformance {
  totalClients: number;
  clientsByStage: Record<string, number>;
  activePartners: number;
  pendingPartners: number;
  topPartners: { rank: number; partnerName: string; clients: number; activeInvestors: number; isActivated: boolean }[];
}

export type TaskPriority = 'HIGH' | 'MEDIUM' | 'LOW';

export interface RMTask {
  id: number;
  title: string;
  description: string | null;
  priority: TaskPriority;
  dueDate: string | null;
  isCompleted: boolean;
  relatedPartnerId: number | null;
  relatedPartnerName: string | null;
  createdAt: string;
  completedAt: string | null;
}

// ── Operations Dashboard Types ──────────────────────────────────────────────

export interface OpsPartnerVerification {
  id: number;
  fullName: string | null;
  firmName: string | null;
  email: string;
  mobileNumber: string;
  partnerType: string;
  arn: string | null;
  pan: string | null;
  euin: string | null;
  partnerBankAccount: string | null;
  partnerIfsc: string | null;
  partnerBankName: string | null;
  isActivated: boolean;
  termsAccepted: boolean;
  declarationAccepted: boolean;
  hasArn: boolean;
  hasPan: boolean;
  hasBankDetails: boolean;
  hasAgreement: boolean;
  daysWaiting: number;
  createdAt: string;
  rejectionReason: string | null;
}

export interface OpsStats {
  pendingActivation: number;
  activatedToday: number;
  clientsInKycQueue: number;
  activatedThisMonth: number;
  urgentPartners: OpsPartnerVerification[];
}

export interface OpsClientKyc {
  id: number;
  fullName: string;
  email: string;
  mobileNumber: string;
  lifecycleStage: string;
  kycStatus: string;
  assignedPartnerName: string | null;
  assignedPartnerId: number | null;
  daysSinceRegistration: number;
  createdAt: string;
}

export interface OpsDocumentReview {
  id: number;
  partnerId: number;
  partnerName: string;
  documentType: string;
  status: string;
  submittedAt: string;
  reviewedAt: string | null;
  notes: string | null;
}

// ── Compliance Dashboard Types ──────────────────────────────────────────────

export interface ComplianceStats {
  openFlags: number;
  resolvedToday: number;
  partnersUnderReview: number;
  pendingApprovals: number;
  totalAuditLogsToday: number;
}

export interface AuditLogEntry {
  id: number;
  entityType: string;
  entityId: number;
  action: string;
  performedBy: number;
  performedByName: string;
  performedAt: string;
  oldValue: string | null;
  newValue: string | null;
  notes: string | null;
}

export interface ComplianceFlag {
  id: number;
  entityType: string;
  entityId: number;
  entityName: string;
  flagType: string;
  reason: string;
  flaggedBy: number;
  flaggedByName: string;
  flaggedAt: string;
  status: string;
  resolvedAt: string | null;
  resolvedBy: number | null;
  resolvedByName: string | null;
  notes: string | null;
}

export interface PartnerRisk {
  id: number;
  fullName: string | null;
  firmName: string | null;
  email: string;
  partnerType: string;
  isActivated: boolean;
  missingArn: boolean;
  missingEuin: boolean;
  missingBankDetails: boolean;
  openFlagsCount: number;
  createdAt: string;
}

export interface DisclosureEntry {
  id: number;
  fullName: string | null;
  email: string;
  partnerType: string;
  termsAccepted: boolean;
  declarationAccepted: boolean;
  consentComm: boolean;
  consentShareAmc: boolean;
  consentShareDocs: boolean;
  createdAt: string;
}

// ── Finance Dashboard Types ─────────────────────────────────────────────────

export interface FinanceStats {
  totalPayoutsPending: number;
  totalPayoutsReleased: number;
  pendingAmount: number;
  releasedThisMonth: number;
  activeCommissionRules: number;
  disputedPayouts: number;
}

export interface PayoutEntry {
  id: number;
  partnerId: number;
  partnerName: string;
  period: string;
  grossAmount: number;
  gst: number;
  tds: number;
  netAmount: number;
  status: string;
  payoutDate: string | null;
  releasedBy: number | null;
  releasedByName: string | null;
  disputeReason: string | null;
  createdAt: string;
}

export interface CommissionRuleEntry {
  id: number;
  amcName: string;
  fundCategory: string;
  trailPercent: number;
  upfrontPercent: number;
  effectiveFrom: string;
  effectiveTo: string | null;
  isActive: boolean;
  createdBy: number;
  createdAt: string;
}

export interface ReconciliationData {
  period: string;
  totalGross: number;
  totalGst: number;
  totalTds: number;
  totalNetReleased: number;
  pendingRelease: number;
  partnerBreakdown: PayoutEntry[];
}

export interface GstTdsData {
  period: string;
  totalGst: number;
  totalTds: number;
  gstEntries: { partnerName: string; pan: string; period: string; grossAmount: number; rate: number; amount: number; status: string }[];
  tdsEntries: { partnerName: string; pan: string; period: string; grossAmount: number; rate: number; amount: number; status: string }[];
}

// ── Support Dashboard Types ─────────────────────────────────────────────────

export interface SupportStats {
  openTickets: number;
  inProgressTickets: number;
  resolvedToday: number;
  myOpenTickets: number;
  highPriorityOpen: number;
  avgResolutionHours: number;
}

export interface SupportTicket {
  id: number;
  ticketId: string;
  subject: string;
  description: string;
  category: string;
  priority: string;
  status: string;
  raisedByName: string;
  raisedByEmail: string;
  raisedById: number;
  assignedToName: string | null;
  assignedTo: number | null;
  isEscalated: boolean;
  createdAt: string;
  updatedAt: string;
  resolvedAt: string | null;
  replyCount: number;
}

export interface TicketDetail extends SupportTicket {
  raisedByRole: string;
  resolution: string | null;
  replies: TicketReplyEntry[];
}

export interface TicketReplyEntry {
  id: number;
  message: string;
  isFromSupport: boolean;
  repliedBy: string;
  createdAt: string;
}

export interface EscalationEntry {
  id: number;
  ticketId: string;
  subject: string;
  priority: string;
  status: string;
  raisedByName: string;
  assignedTo: number | null;
  assignedToName: string | null;
  hoursOpen: number;
  replyCount: number;
  isEscalated: boolean;
  createdAt: string;
}

// ── Referral Types ──────────────────────────────────────────────────────────

export interface ReferralEntry {
  id: number;
  referralType: string;
  clickedAt: string;
  converted: boolean;
  registeredUserName: string | null;
  registeredAt: string | null;
  registeredUserId: number | null;
  partnerStatus: string | null;
}

// ── Platform Stats Types ────────────────────────────────────────────────────

export interface ActivityEntry {
  action: string;
  entityType: string;
  entityName: string;
  performedByName: string;
  performedAt: string;
}

export interface PlatformStats {
  totalUsers: number;
  totalPartners: number;
  totalClients: number;
  totalInternalUsers: number;
  activePartners: number;
  pendingPartners: number;
  partnersByType: { individual: number; firm: number };
  clientsByLifecycle: Record<string, number>;
  internalUsersByRole: Record<string, number>;
  totalReferrals: number;
  convertedReferrals: number;
  recentActivity: ActivityEntry[];
}

export interface ReferralTreeEntry {
  referrerId: number;
  referrerName: string;
  referrerType: string;
  referredUserId: number;
  referredUserName: string;
  referredUserRole: string;
  referredUserActivated: boolean;
  referredAt: string;
}

export interface PartnerDetail {
  id: number;
  fullName: string | null;
  firmName: string | null;
  email: string;
  mobileNumber: string;
  partnerType: string;
  arn: string | null;
  pan: string | null;
  euin: string | null;
  partnerBankAccount: string | null;
  partnerIfsc: string | null;
  partnerBankName: string | null;
  isActivated: boolean;
  createdAt: string;
  totalClients: number;
  clientsByLifecycle: Record<string, number>;
  referralCount: number;
}

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

// ── Permission Types ────────────────────────────────────────────────────────

export interface PermissionRow {
  section: string;
  canView: boolean;
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canApprove: boolean;
}

export interface UserPermissions {
  userId: number;
  userName: string;
  role: string;
  dashboard: string;
  permissions: PermissionRow[];
}

export interface RoleUsers {
  role: string;
  displayName: string;
  userCount: number;
  users: { id: number; name: string; email: string; isActivated: boolean }[];
}
