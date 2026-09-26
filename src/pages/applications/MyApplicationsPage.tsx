import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  FileText,
  Plus,
  Calendar,
  Clock,
  ArrowRight,
  ShieldCheck,
  UserCheck,
  Building,
} from 'lucide-react';
import { mockApplications } from '../../data/mockApplications';
import { StatusBadge } from '../../components/common/StatusBadge';

export const MyApplicationsPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in duration-200 font-sans">
      {/* Header (Section 12) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 card-greeting p-6 sm:p-8 rounded-3xl border shadow-soft-card">
        <div>
          <h1 className="font-outfit text-2xl sm:text-3xl font-extrabold text-[#123F63]">
            My Applications
          </h1>
          <p className="text-xs sm:text-sm text-[#627B94] mt-1">
            Track statutory verification requests submitted for your instruments
          </p>
        </div>

        <Link
          to="/start-inspection"
          className="inline-flex items-center gap-2 rounded-xl bg-[#2F8FCC] hover:bg-[#1E75AC] active:scale-[0.98] text-white px-5 py-2.5 text-xs sm:text-sm font-bold shadow-soft transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-[#2F8FCC]"
        >
          <Plus className="h-4 w-4" />
          <span>Apply for Verification</span>
        </Link>
      </div>

      {/* Applications as Pastel Lavender/Periwinkle Cards */}
      <div className="space-y-4">
        {mockApplications.map((app) => (
          <div
            key={app.id}
            className="rounded-3xl card-lavender p-6 border shadow-soft-card hover:border-[#5B5FC7]/60 hover:-translate-y-0.5 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-3">
                <span className="font-mono text-sm font-bold text-[#5B5FC7]">
                  {app.id}
                </span>
                <StatusBadge status={app.status} size="sm" />
                {app.hasDamagedPlate && (
                  <span className="text-[10px] bg-[#FFF7E8] text-[#B86C0B] border border-[#FCE3BA] font-bold px-2 py-0.5 rounded-full">
                    Damaged Plate
                  </span>
                )}
              </div>

              <h3 className="font-outfit text-base font-bold text-[#123F63]">
                {app.instrumentType} — <span className="font-normal text-[#16466F]">{app.verificationType}</span>
              </h3>

              <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-xs text-[#627B94]">
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-[#627B94]" />
                  <span>Submitted: <strong className="text-[#123F63]">{app.submittedDate}</strong></span>
                </span>

                <span className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-[#627B94]" />
                  <span>Expected Inspection: <strong className="text-[#1E8E5A]">{app.scheduledDate || app.preferredDate}</strong></span>
                </span>

                {app.assignedOfficerName && (
                  <span className="flex items-center gap-1.5">
                    <UserCheck className="h-3.5 w-3.5 text-[#627B94]" />
                    <span>Officer: <strong className="text-[#123F63]">{app.assignedOfficerName.split('(')[0]}</strong></span>
                  </span>
                )}
              </div>
            </div>

            <button
              onClick={() => navigate(`/my-applications/${app.id}`)}
              className="self-start sm:self-center inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-white hover:bg-[#E6E1FD] hover:border-[#5B5FC7] hover:text-[#123F63] active:scale-[0.98] border border-[#E0DCFB] text-[#123F63] font-bold text-xs transition-all shrink-0 shadow-xs cursor-pointer focus-visible:outline-2 focus-visible:outline-[#5B5FC7]"
            >
              <span>View Application</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
