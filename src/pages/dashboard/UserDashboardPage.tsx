import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Scale,
  ShieldCheck,
  AlertTriangle,
  Plus,
  ArrowRight,
  Eye,
  Clock,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from '../../i18n';
import { mockInstruments } from '../../data/mockInstruments';
import { mockApplications } from '../../data/mockApplications';
import { mockCertificates } from '../../data/mockCertificates';
import { StatusBadge } from '../../components/common/StatusBadge';
import { RegisterInstrumentModal } from '../../features/instruments';

export const UserDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [registerModalOpen, setRegisterModalOpen] = useState(false);

  // Business owner relevant instruments & applications
  const myInstruments = mockInstruments.slice(0, 5);
  const myApplications = mockApplications.slice(0, 3);
  const expiringCert =
    mockCertificates.find((c) => (c.daysRemaining ?? 0) > 0 && (c.daysRemaining ?? 0) <= 30) ||
    mockCertificates[1];

  return (
    <div className="space-y-7 max-w-5xl mx-auto animate-in fade-in duration-200 font-sans">
      {/* Friendly Human Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 card-greeting p-6 sm:p-8 rounded-3xl border shadow-soft-card">
        <div>
          <h1 className="font-outfit text-2xl sm:text-3xl font-extrabold text-[#123F63]">
            {t('dashboard.greeting')}, {user.name.split(' ')[0]}.
          </h1>
          <p className="text-xs sm:text-sm text-[#627B94] mt-1">
            {t('dashboard.overviewSub')}
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setRegisterModalOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-white border border-[#CFE5F5] text-[#123F63] px-4 py-2.5 text-xs sm:text-sm font-bold shadow-xs hover:bg-[#EDF8FE] hover:border-[#2F8FCC] active:scale-[0.98] transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-[#2F8FCC]"
          >
            <Plus className="h-4 w-4 text-[#1E75AC]" />
            <span>{t('action.registerInstrument')}</span>
          </button>

          <Link
            to="/start-inspection"
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#2F8FCC] hover:bg-[#1E75AC] active:scale-[0.98] text-white px-5 py-2.5 text-xs sm:text-sm font-bold shadow-soft transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-[#2F8FCC]"
          >
            <span>{t('action.applyVerification')}</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* 4 Differentiated Human Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. MY INSTRUMENTS: Very light sky blue */}
        <Link
          to="/my-instruments"
          className="rounded-3xl card-sky p-5 sm:p-6 border shadow-soft-card hover:border-[#2F8FCC]/60 hover:-translate-y-0.5 transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#627B94]">
              {t('dashboard.myInstruments')}
            </span>
            <div className="h-10 w-10 rounded-2xl bg-[#D5EEFB] text-[#1E75AC] flex items-center justify-center shadow-2xs">
              <Scale className="h-5 w-5" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-[#123F63] mt-2 font-outfit">
            5
          </p>
          <span className="text-[11px] text-[#1E75AC] font-bold group-hover:underline inline-flex items-center gap-1 mt-2">
            <span>{t('action.viewAll')}</span>
            <span>→</span>
          </span>
        </Link>

        {/* 2. PENDING VERIFICATIONS: Very light lavender */}
        <Link
          to="/my-applications"
          className="rounded-3xl card-lavender p-5 sm:p-6 border shadow-soft-card hover:border-[#5B5FC7]/60 hover:-translate-y-0.5 transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#627B94]">
              {t('dashboard.pendingVerifications')}
            </span>
            <div className="h-10 w-10 rounded-2xl bg-[#E6E1FD] text-[#5B5FC7] flex items-center justify-center shadow-2xs">
              <Clock className="h-5 w-5" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-[#123F63] mt-2 font-outfit">
            2
          </p>
          <span className="text-[11px] text-[#5B5FC7] font-bold group-hover:underline inline-flex items-center gap-1 mt-2">
            <span>{t('action.viewDetails')}</span>
            <span>→</span>
          </span>
        </Link>

        {/* 3. VERIFIED: Very light mint */}
        <Link
          to="/my-certificates"
          className="rounded-3xl card-mint p-5 sm:p-6 border shadow-soft-card hover:border-[#1E8E5A]/60 hover:-translate-y-0.5 transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#627B94]">
              {t('status.verified')}
            </span>
            <div className="h-10 w-10 rounded-2xl bg-[#D4F6E5] text-[#1E8E5A] flex items-center justify-center shadow-2xs">
              <ShieldCheck className="h-5 w-5" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-[#123F63] mt-2 font-outfit">
            4
          </p>
          <span className="text-[11px] text-[#1E8E5A] font-bold group-hover:underline inline-flex items-center gap-1 mt-2">
            <span>{t('nav.myCertificates')}</span>
            <span>→</span>
          </span>
        </Link>

        {/* 4. EXPIRING SOON: Very light warm amber */}
        <Link
          to="/my-certificates"
          className="rounded-3xl card-amber p-5 sm:p-6 border shadow-soft-card hover:border-[#B86C0B]/60 hover:-translate-y-0.5 transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#627B94]">
              {t('status.expiringSoon')}
            </span>
            <div className="h-10 w-10 rounded-2xl bg-[#FEEDC8] text-[#B86C0B] flex items-center justify-center shadow-2xs">
              <AlertTriangle className="h-5 w-5" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-[#123F63] mt-2 font-outfit">
            1
          </p>
          <span className="text-[11px] text-[#B86C0B] font-bold group-hover:underline inline-flex items-center gap-1 mt-2">
            <span>{t('action.viewDetails')}</span>
            <span>→</span>
          </span>
        </Link>
      </div>

      {/* Upcoming / Important Alert Card */}
      {expiringCert && (
        <div className="rounded-3xl card-amber border p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-soft-card">
          <div className="flex items-start gap-3.5">
            <div className="h-10 w-10 rounded-2xl bg-[#FEEDC8] text-[#B86C0B] flex items-center justify-center shrink-0">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div className="space-y-0.5">
              <h4 className="font-bold text-sm text-[#B86C0B]">
                {t('dashboard.expiryAlertTitle')}
              </h4>
              <p className="text-xs text-[#8A5B14]">
                {t('dashboard.expiryAlertDesc')} (ID: <span className="font-mono font-bold">{expiringCert.instrumentId}</span> • <span className="font-bold">{expiringCert.daysRemaining || 15} {t('dashboard.daysRemaining')}</span>)
              </p>
            </div>
          </div>

          <Link
            to="/start-inspection"
            className="self-start sm:self-center shrink-0 px-4 py-2 rounded-xl bg-[#B86C0B] hover:bg-[#965606] active:scale-[0.98] text-white text-xs font-bold shadow-soft transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-[#B86C0B]"
          >
            {t('action.applyVerification')}
          </Link>
        </div>
      )}

      {/* Recent Applications Simple List with Neutral Light Sky-Blue Surface */}
      <div className="rounded-3xl card-neutral-blue p-6 sm:p-8 border shadow-soft-card space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#DCEAF4]">
          <div>
            <h3 className="font-outfit text-lg font-bold text-[#123F63]">
              {t('dashboard.recentApplications')}
            </h3>
            <p className="text-xs text-[#627B94]">
              {t('dashboard.overviewSub')}
            </p>
          </div>
          <Link
            to="/my-applications"
            className="text-xs font-bold text-[#1E75AC] hover:text-[#123F63] hover:underline transition-colors"
          >
            {t('dashboard.viewAllApplications')} →
          </Link>
        </div>

        <div className="divide-y divide-[#DCEAF4]">
          {myApplications.map((app) => (
            <div
              key={app.id}
              onClick={() => navigate(`/my-applications/${app.id}`)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  navigate(`/my-applications/${app.id}`);
                }
              }}
              className="py-3.5 flex items-center justify-between gap-3 cursor-pointer table-row-clickable hover:bg-[#EAF6FD] active:bg-[#DDEBF4] active:scale-[0.995] rounded-2xl px-3 transition-all group focus-visible:outline-2 focus-visible:outline-[#2F8FCC]"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-xs text-[#1E75AC]">
                    {app.id}
                  </span>
                  <StatusBadge status={app.status} size="sm" />
                </div>
                <p className="text-xs font-semibold text-[#16466F] mt-0.5 truncate">
                  {app.instrumentType} • {app.verificationType}
                </p>
                <p className="text-[11px] text-[#627B94]">
                  {t('dashboard.dateApplied')}: {app.submittedDate}
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span className="text-xs font-semibold text-[#627B94] hidden sm:inline">
                  {app.scheduledDate ? `${t('status.scheduled')}: ${app.scheduledDate}` : t('status.pending')}
                </span>
                <span className="p-2 rounded-xl bg-white border border-[#DCEAF4] text-[#123F63] group-hover:bg-[#2F8FCC] group-hover:text-white group-hover:border-[#2F8FCC] active:scale-95 transition-all shadow-2xs">
                  <Eye className="h-4 w-4" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Register Instrument Modal */}
      <RegisterInstrumentModal
        isOpen={registerModalOpen}
        onClose={() => setRegisterModalOpen(false)}
        onRegistered={() => navigate('/my-instruments')}
      />
    </div>
  );
};
