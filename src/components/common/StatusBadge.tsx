import React from 'react';
import { InstrumentStatus, ApplicationStatus, CertificateStatus } from '../../types';
import { useTranslation } from '../../i18n';

type AnyStatus = InstrumentStatus | ApplicationStatus | CertificateStatus | 'Active' | 'On Field Duty' | 'On Leave' | 'Accredited' | 'Under Audit' | 'Pass' | 'Fail';

interface StatusBadgeProps {
  status: AnyStatus | string;
  size?: 'sm' | 'md' | 'lg';
  showDot?: boolean;
  onClick?: () => void;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'md',
  showDot = true,
  onClick,
}) => {
  const { t, language } = useTranslation();
  let bgClass = 'bg-slate-100 text-slate-700 border-slate-200';
  let dotClass = 'bg-slate-400';

  const normalized = status.toLowerCase();

  let displayLabel: string = status;

  if (
    normalized === 'verified' ||
    normalized === 'valid' ||
    normalized === 'pass' ||
    normalized === 'active' ||
    normalized === 'accredited'
  ) {
    bgClass = 'bg-[#E9F7F0] text-[#238258] border-[#C5ECD9]';
    dotClass = 'bg-[#36B37E]';
    if (language === 'hi') {
      displayLabel = normalized === 'pass' ? t('status.pass') : t('status.verified');
    }
  } else if (
    normalized === 'expiring soon' ||
    normalized === 'under review' ||
    normalized === 'scheduled' ||
    normalized === 'in verification' ||
    normalized === 'under audit'
  ) {
    bgClass = 'bg-[#FFF4DC] text-[#8A5B14] border-[#F5E1B5]';
    dotClass = 'bg-[#D99A32]';
    if (language === 'hi') {
      displayLabel = normalized === 'expiring soon' ? t('status.expiringSoon') : normalized === 'scheduled' ? t('status.scheduled') : t('status.pending');
    }
  } else if (
    normalized === 'pending' ||
    normalized === 'assigned' ||
    normalized === 'registered' ||
    normalized === 'on field duty'
  ) {
    bgClass = 'bg-[#EAF3F8] text-[#17689A] border-[#D5E6F2]';
    dotClass = 'bg-[#17689A]';
    if (language === 'hi') {
      displayLabel = t('status.pending');
    }
  } else if (
    normalized === 'expired' ||
    normalized === 'failed' ||
    normalized === 'rejected' ||
    normalized === 'revoked' ||
    normalized === 'invalid' ||
    normalized === 'suspended'
  ) {
    bgClass = 'bg-[#FCECEC] text-[#A62F2C] border-[#F8C8C6]';
    dotClass = 'bg-[#D95C59]';
    if (language === 'hi') {
      displayLabel = normalized === 'failed' ? t('status.fail') : normalized === 'expired' ? t('status.expired') : t('status.rejected');
    }
  } else if (
    normalized === 'identification pending' ||
    normalized === 'pending identification' ||
    normalized === 'needs repair'
  ) {
    bgClass = 'bg-[#FFF4DC] text-[#8A5B14] border-[#F5E1B5]';
    dotClass = 'bg-[#D99A32]';
    if (language === 'hi') {
      displayLabel = t('status.pending');
    }
  }

  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5 font-medium gap-1',
    md: 'text-xs px-2.5 py-1 font-semibold gap-1.5',
    lg: 'text-sm px-3.5 py-1.5 font-semibold gap-2',
  }[size];

  return (
    <span
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      className={`inline-flex items-center rounded-full border shadow-xs transition-all duration-150 ${sizeClasses} ${bgClass} ${
        onClick ? 'cursor-pointer hover:brightness-95 active:scale-95 focus-visible:outline-2 focus-visible:outline-[#17689A]' : ''
      }`}
    >
      {showDot && (
        <span
          className={`h-1.5 w-1.5 rounded-full ${dotClass} shrink-0`}
          aria-hidden="true"
        />
      )}
      <span className="truncate">{displayLabel}</span>
    </span>
  );
};
