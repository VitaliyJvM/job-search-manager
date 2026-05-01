import type { ApplicationStatus, MessageDirection } from '../types/index.ts';

const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  INTERESTED:       { label: 'Interested',       className: 'badge badge-interested' },
  APPLIED:          { label: 'Applied',           className: 'badge badge-applied' },
  HR_SCREEN:        { label: 'HR Screen',         className: 'badge badge-hr-screen' },
  TECH_INTERVIEW:   { label: 'Tech Interview',    className: 'badge badge-tech' },
  OFFER:            { label: 'Offer',             className: 'badge badge-offer' },
  REJECTED:         { label: 'Rejected',          className: 'badge badge-rejected' },
  FOLLOW_UP_NEEDED: { label: 'Follow-Up Needed',  className: 'badge badge-follow-up' },
  INBOUND:          { label: 'Inbound',           className: 'badge badge-inbound' },
  OUTBOUND:         { label: 'Outbound',          className: 'badge badge-outbound' },
  RECRUITER:        { label: 'Recruiter',         className: 'badge badge-applied' },
  ENGINEER:         { label: 'Engineer',          className: 'badge badge-tech' },
  MANAGER:          { label: 'Manager',           className: 'badge badge-offer' },
  REFERRAL:         { label: 'Referral',          className: 'badge badge-follow-up' },
  LOCAL_CONTACT:    { label: 'Local Contact',     className: 'badge badge-hr-screen' },
  OTHER:            { label: 'Other',             className: 'badge badge-neutral' },
};

interface StatusBadgeProps {
  value?: string;
}

export default function StatusBadge({ value }: StatusBadgeProps) {
  if (!value) return null;
  const config = STATUS_CONFIG[value] ?? { label: value, className: 'badge badge-neutral' };
  return <span className={config.className}>{config.label}</span>;
}

export function getStatusBadgeClass(status: ApplicationStatus): string {
  return STATUS_CONFIG[status]?.className ?? 'badge badge-neutral';
}

export const ALL_STATUSES: ApplicationStatus[] = [
  'INTERESTED', 'APPLIED', 'HR_SCREEN', 'TECH_INTERVIEW', 'OFFER', 'REJECTED', 'FOLLOW_UP_NEEDED'
];

export const DIRECTION_LABELS: Record<MessageDirection, string> = {
  INBOUND: 'Inbound',
  OUTBOUND: 'Outbound',
};
