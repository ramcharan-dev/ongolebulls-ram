import type { Role } from '../types/api';

export const ROLE_DASHBOARD_MAP: Record<Role, string> = {
  ADMIN: '/dashboard/admin',
  INDIVIDUAL_PARTNER: '/dashboard/partner',
  NON_INDIVIDUAL_PARTNER: '/dashboard/partner-firm',
  RELATIONSHIP_MANAGER: '/dashboard/rm',
  OPERATIONS: '/dashboard/operations',
  COMPLIANCE: '/dashboard/compliance',
  FINANCE: '/dashboard/finance',
  SUPPORT: '/dashboard/support',
  USER: '/dashboard',
};

export function getDashboardRoute(role: Role): string {
  return ROLE_DASHBOARD_MAP[role] || '/dashboard';
}
