import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  ArrowRight,
  Play,
  Scale,
  Building2,
  Smartphone,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from '../../i18n';

export const OfficerDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const todaySchedule = [
    {
      time: '09:30 AM',
      id: 'APP-2026-000182',
      business: 'ABC Traders',
      instrument: 'Electronic Weighing Scale (30 kg)',
      location: '14, Sarafa Bazar, Indore, MP',
      status: 'Ready',
      statusLabelKey: 'officer.ready',
      statusColor: 'text-[#17689A] bg-[#EAF3F8] border-[#D5E6F2]',
    },
    {
      time: '11:00 AM',
      id: 'APP-2026-000185',
      business: 'XYZ Supermart',
      instrument: 'Platform Scale (150 kg)',
      location: 'Plot 45, Scheme 54, Vijay Nagar, Indore, MP',
      status: 'Ready',
      statusLabelKey: 'officer.ready',
      statusColor: 'text-[#17689A] bg-[#EAF3F8] border-[#D5E6F2]',
    },
    {
      time: '02:15 PM',
      id: 'APP-2026-000174',
      business: 'Malwa Agro Industries',
      instrument: 'Electronic Weighbridge (50 Ton)',
      location: 'Sanwer Road Industrial Area, Indore, MP',
      status: 'Completed',
      statusLabelKey: 'status.completed',
      statusColor: 'text-[#238258] bg-[#E9F7F0] border-[#C5ECD9]',
    },
    {
      time: '04:30 PM',
      id: 'APP-2026-000189',
      business: 'Narmada Fuel Centre',
      instrument: 'Multi-Nozzle Fuel Dispenser (L/min)',
      location: 'Bhawarkua Main Road, Indore, MP',
      status: 'Pending',
      statusLabelKey: 'status.pending',
      statusColor: 'text-[#8A5B14] bg-[#FFF4DC] border-[#F5E1B5]',
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans">
      {/* Dashboard Hero / Greeting Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 card-greeting p-6 sm:p-8 rounded-3xl border shadow-soft-card">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="h-2.5 w-2.5 rounded-full bg-[#1E8E5A]" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#627B94]">
              {t('officer.badge')} • {t('role.officer')}
            </span>
          </div>
          <h1 className="font-outfit text-3xl font-extrabold text-[#123F63]">
            {t('officer.goodMorning')}, {user.name.split(' ')[0] || 'Rajesh'}.
          </h1>
          <p className="text-[#627B94] text-sm mt-1">
            {t('officer.subtitle')}
          </p>
        </div>

        <Link
          to="/officer/inspect/APP-2026-000182"
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#2F8FCC] hover:bg-[#1E75AC] active:scale-[0.98] text-white font-bold text-sm shadow-soft transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-[#2F8FCC]"
        >
          <Play className="h-4 w-4 fill-white" />
          <span>{t('action.startInspection')}</span>
        </Link>
      </div>

      {/* Task-Focused Pastel Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {/* Today's Inspections: Sky Blue */}
        <div className="card-sky rounded-3xl p-6 border shadow-soft-card flex items-center justify-between hover:-translate-y-0.5 transition-all">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-[#627B94]">
              {t('officer.todayInspections')}
            </p>
            <p className="font-outfit text-4xl font-extrabold text-[#123F63] mt-2">
              8
            </p>
            <p className="text-xs text-[#627B94] mt-1">4 morning • 4 afternoon</p>
          </div>
          <div className="h-14 w-14 rounded-2xl bg-[#D5EEFB] text-[#1E75AC] flex items-center justify-center shadow-2xs">
            <Calendar className="h-7 w-7" />
          </div>
        </div>

        {/* Pending Reviews: Lavender */}
        <div className="card-lavender rounded-3xl p-6 border shadow-soft-card flex items-center justify-between hover:-translate-y-0.5 transition-all">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-[#5B5FC7]">
              {t('status.pending')}
            </p>
            <p className="font-outfit text-4xl font-extrabold text-[#123F63] mt-2">
              4
            </p>
            <p className="text-xs text-[#627B94] mt-1">{t('officer.pendingReviews')}</p>
          </div>
          <div className="h-14 w-14 rounded-2xl bg-[#E6E1FD] text-[#5B5FC7] flex items-center justify-center shadow-2xs">
            <Clock className="h-7 w-7" />
          </div>
        </div>

        {/* Completed Today: Mint */}
        <div className="card-mint rounded-3xl p-6 border shadow-soft-card flex items-center justify-between hover:-translate-y-0.5 transition-all">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-[#1E8E5A]">
              {t('status.completed')}
            </p>
            <p className="font-outfit text-4xl font-extrabold text-[#123F63] mt-2">
              12
            </p>
            <p className="text-xs text-[#627B94] mt-1">{t('officer.completedToday')}</p>
          </div>
          <div className="h-14 w-14 rounded-2xl bg-[#D4F6E5] text-[#1E8E5A] flex items-center justify-center shadow-2xs">
            <CheckCircle2 className="h-7 w-7" />
          </div>
        </div>
      </div>

      {/* Field Inspection Mobile App banner tip */}
      <div className="card-neutral-blue rounded-3xl p-5 border shadow-soft-card flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="h-12 w-12 rounded-2xl bg-[#D5EEFB] flex items-center justify-center shrink-0 shadow-2xs">
            <Smartphone className="h-6 w-6 text-[#1E75AC]" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-[#123F63]">{t('officer.standardsNotice')}</h4>
            <p className="text-xs text-[#627B94]">
              {t('officer.standardsSub')}
            </p>
          </div>
        </div>
        <Link
          to="/officer/inspect/APP-2026-000182"
          className="px-4 py-2 rounded-xl bg-[#2F8FCC] text-white text-xs font-bold hover:bg-[#1E75AC] active:scale-[0.98] transition-all shrink-0 shadow-soft cursor-pointer focus-visible:outline-2 focus-visible:outline-[#2F8FCC]"
        >
          {t('officer.openFieldTool')}
        </Link>
      </div>

      {/* Today's Schedule (Timeline / Card List) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-outfit text-xl font-bold text-[#123F63]">
              {t('officer.todaysSchedule')}
            </h2>
            <p className="text-xs text-[#627B94]">
              {t('officer.scheduleSubtitle')}
            </p>
          </div>
          <Link
            to="/officer/inspections"
            className="text-xs font-bold text-[#1E75AC] hover:text-[#123F63] hover:underline flex items-center gap-1 transition-colors"
          >
            <span>{t('officer.viewFullQueue')}</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="space-y-3.5">
          {todaySchedule.map((item, idx) => (
            <div
              key={idx}
              className="card-neutral-blue rounded-3xl p-5 border shadow-soft-card hover:border-[#2F8FCC]/50 hover:-translate-y-0.5 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-4">
                <div className="px-3 py-2 rounded-2xl bg-white border border-[#DCEAF4] text-center shrink-0 shadow-2xs">
                  <Clock className="h-4 w-4 text-[#1E75AC] mx-auto mb-0.5" />
                  <span className="font-mono text-xs font-extrabold text-[#123F63]">
                    {item.time}
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="font-mono text-xs font-bold text-[#627B94]">
                      {item.id}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${item.statusColor}`}
                    >
                      {t(item.statusLabelKey as any, item.status)}
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-[#123F63] flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-[#1E75AC]" />
                    {item.business}
                  </h3>

                  <p className="text-xs text-[#16466F] flex items-center gap-1.5">
                    <Scale className="h-3.5 w-3.5 text-[#627B94]" />
                    {item.instrument}
                  </p>

                  <p className="text-xs text-[#627B94] flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-[#627B94]" />
                    {item.location}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end md:self-center">
                {item.status === 'Completed' ? (
                  <button
                    onClick={() => navigate('/my-certificates')}
                    className="px-4 py-2 rounded-xl bg-white border border-[#DCEAF4] text-[#123F63] font-bold text-xs hover:bg-[#EDF8FE] hover:border-[#2F8FCC] active:scale-[0.98] transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-[#2F8FCC]"
                  >
                    {t('nav.myCertificates')}
                  </button>
                ) : (
                  <button
                    onClick={() => navigate(`/officer/inspect/${item.id}`)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#2F8FCC] hover:bg-[#1E75AC] active:scale-[0.98] text-white font-bold text-xs shadow-soft transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-[#2F8FCC]"
                  >
                    <Play className="h-3.5 w-3.5 fill-white" />
                    <span>{t('action.startInspection')}</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
