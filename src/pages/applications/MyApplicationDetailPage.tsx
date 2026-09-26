import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  FileText,
  Building,
  UserCheck,
  Calendar,
  Clock,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  ShieldCheck,
  Scale,
  ShieldAlert,
} from 'lucide-react';
import { applicationService } from '../../services/applicationService';
import { Application } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';

export const MyApplicationDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [app, setApp] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    applicationService.getById(id).then((res) => {
      setApp(res || null);
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return <div className="py-20 text-center text-slate-500">Loading application...</div>;
  }

  if (!app) {
    return (
      <div className="rounded-3xl bg-white dark:bg-[#131E2C] p-8 text-center border border-[#E5EAF0] dark:border-[#1E293B] space-y-4">
        <AlertTriangle className="h-10 w-10 text-amber-500 mx-auto" />
        <h2 className="text-xl font-bold">Application Not Found</h2>
        <button
          onClick={() => navigate('/my-applications')}
          className="rounded-2xl bg-[#1769AA] text-white px-5 py-2 text-xs font-bold"
        >
          Back to Applications
        </button>
      </div>
    );
  }

  // Visual Application Timeline Stages (Section 13)
  const isVerified = app.status === 'Verified';
  const isInVerification = app.status === 'In Verification' || app.status === 'Scheduled';
  const hasOfficer = !!app.assignedOfficerName;

  const steps = [
    { label: 'Submitted', done: true, state: 'Done' },
    { label: 'Under Review', done: true, state: 'Done' },
    { label: 'Officer Assigned', done: hasOfficer, state: hasOfficer ? 'Done' : 'Current' },
    { label: 'Inspection', done: isVerified, state: isVerified ? 'Done' : isInVerification ? 'Current' : 'Pending' },
    { label: 'Certificate', done: isVerified, state: isVerified ? 'Done' : 'Pending' },
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 card-greeting p-6 sm:p-8 rounded-3xl shadow-soft-card">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/my-applications')}
            className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white border border-[#CFE5F5] hover:bg-[#EDF8FE] text-[#123F63] transition-colors cursor-pointer shadow-xs"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="font-outfit text-xl sm:text-2xl font-extrabold text-[#123F63] font-mono">
                {app.id}
              </h1>
              <StatusBadge status={app.status} size="md" />
            </div>
            <p className="text-xs text-[#527290] mt-0.5">
              {app.instrumentType} • {app.verificationType}
            </p>
          </div>
        </div>

        {isVerified && (
          <Link
            to="/my-certificates"
            className="inline-flex items-center gap-1.5 rounded-2xl bg-[#2F8FCC] hover:bg-[#1E75AC] text-white px-5 py-2.5 text-xs font-bold shadow-soft transition-all"
          >
            <span>View Certificate →</span>
          </Link>
        )}
      </div>

      {/* Special Case Alert */}
      {app.hasDamagedPlate && (
        <div className="rounded-3xl card-amber p-5 flex items-start gap-3.5 shadow-soft-card">
          <ShieldAlert className="h-5 w-5 text-[#B86C0B] shrink-0 mt-0.5" />
          <div className="space-y-0.5 text-xs text-[#8A5108]">
            <span className="font-bold block">Damaged / Missing Serial Plate</span>
            <p className="text-[#8A5108]/90">
              An authorized officer will tag your instrument with a permanent tamper-evident barcode during physical on-site testing.
            </p>
          </div>
        </div>
      )}

      {/* Visual Timeline (Section 13) */}
      <div className="rounded-3xl card-neutral-blue p-6 sm:p-8 shadow-soft-card space-y-6">
        <h3 className="font-outfit text-base font-bold text-[#123F63]">
          Application Progress
        </h3>

        <div className="overflow-x-auto pb-2">
          <div className="flex items-center justify-between min-w-[500px] relative">
            {steps.map((st, i) => (
              <div key={st.label} className="flex-1 flex flex-col items-center text-center relative group">
                {/* Connector */}
                {i < steps.length - 1 && (
                  <div
                    className={`absolute top-4 left-1/2 w-full h-[2px] -z-0 ${
                      st.done ? 'bg-[#1E8E5A]' : 'bg-[#DCEAF4]'
                    }`}
                  />
                )}

                <div
                  className={`relative z-10 h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold shadow-xs ${
                    st.done
                      ? 'bg-[#1E8E5A] text-white'
                      : st.state === 'Current'
                      ? 'bg-[#2F8FCC] text-white ring-4 ring-[#2F8FCC]/20 animate-pulse'
                      : 'bg-white border-2 border-[#CFE5F5] text-[#7A93A8]'
                  }`}
                >
                  {st.done ? '✓' : i + 1}
                </div>

                <span
                  className={`text-xs font-bold mt-2 ${
                    st.done
                      ? 'text-[#123F63]'
                      : st.state === 'Current'
                      ? 'text-[#2F8FCC]'
                      : 'text-[#7A93A8]'
                  }`}
                >
                  {st.label}
                </span>

                <span className="text-[10px] text-[#7A93A8] mt-0.5">
                  {st.state}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Details Cards (Section 13) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        <div className="rounded-3xl card-lavender p-6 shadow-soft-card space-y-3">
          <h4 className="font-bold text-[#123F63] uppercase tracking-wider text-[11px] border-b border-[#E0DCFB] pb-1">
            Application Details
          </h4>
          <div className="space-y-2">
            <div>
              <span className="text-[#627B94] block text-[10px]">Instrument</span>
              <span className="font-bold text-[#123F63]">{app.instrumentType}</span>
              <p className="font-mono text-[#5B5FC7] text-[11px]">{app.instrumentId}</p>
            </div>
            <div>
              <span className="text-[#627B94] block text-[10px]">Submitted Date</span>
              <span className="font-semibold text-[#123F63]">{app.submittedDate}</span>
            </div>
            <div>
              <span className="text-[#627B94] block text-[10px]">Statutory Fee</span>
              <span className="font-bold text-[#1E8E5A]">₹{app.feePaid || 450} (Paid)</span>
            </div>
          </div>
        </div>

        <div className="rounded-3xl card-sky p-6 shadow-soft-card space-y-3">
          <h4 className="font-bold text-[#123F63] uppercase tracking-wider text-[11px] border-b border-[#CFE5F5] pb-1">
            Inspection & Officer
          </h4>
          <div className="space-y-2">
            <div>
              <span className="text-[#627B94] block text-[10px]">Assigned Officer</span>
              <span className="font-bold text-[#123F63]">
                {app.assignedOfficerName || 'Pending Allocation'}
              </span>
            </div>
            <div>
              <span className="text-[#627B94] block text-[10px]">Scheduled On-site Date</span>
              <span className="font-bold text-[#1E8E5A]">
                {app.scheduledDate || app.preferredDate}
              </span>
            </div>
            <div>
              <span className="text-[#627B94] block text-[10px]">Inspection Location</span>
              <span className="text-[#527290]">
                {app.address}, {app.district}, {app.state}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
