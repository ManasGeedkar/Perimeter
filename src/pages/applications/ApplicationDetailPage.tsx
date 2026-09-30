import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  FileCheck2,
  Building,
  UserCheck,
  Calendar,
  Clock,
  ShieldAlert,
  ArrowLeft,
  FileText,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  ShieldCheck,
  ChevronRight,
  Upload,
} from 'lucide-react';
import { applicationService } from '../../services/applicationService';
import { Application } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import { AssignOfficerModal } from '../../components/applications/AssignOfficerModal';

export const ApplicationDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [app, setApp] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [assignModalOpen, setAssignModalOpen] = useState(false);

  useEffect(() => {
    if (!id) return;
    applicationService.getById(id).then((res) => {
      setApp(res || null);
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return <div className="py-20 text-center text-slate-500">Loading application data...</div>;
  }

  if (!app) {
    return (
      <div className="rounded-3xl bg-white dark:bg-[#131E2C] p-8 text-center border border-[#E5EAF0] dark:border-[#1E293B] space-y-4">
        <AlertTriangle className="h-10 w-10 text-amber-500 mx-auto" />
        <h2 className="text-xl font-bold">Application Not Found</h2>
        <p className="text-xs text-slate-500">No application recorded with ID: {id}</p>
        <button
          onClick={() => navigate('/admin/applications')}
          className="rounded-2xl bg-[#1769AA] text-white px-5 py-2 text-xs font-bold"
        >
          Back to Applications
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 card-greeting p-6 rounded-3xl border border-[#CCE3F3] shadow-soft-card">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/admin/applications')}
            className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white border border-[#CFE5F5] hover:bg-[#EDF8FE] text-[#123F63] transition-colors cursor-pointer"
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
              {app.verificationType} • Submitted on {app.submittedDate}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setAssignModalOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-2xl bg-white border border-[#CFE5F5] text-[#123F63] px-4 py-2 text-xs font-bold shadow-xs hover:bg-[#EDF8FE] transition-all cursor-pointer"
          >
            <UserCheck className="h-4 w-4 text-[#2F8FCC]" />
            <span>{app.assignedOfficerName ? 'Reassign Officer' : 'Assign Officer'}</span>
          </button>

          <button
            onClick={() => navigate(`/verification/${app.id}`)}
            className="inline-flex items-center gap-1.5 rounded-2xl bg-[#2F8FCC] text-white px-5 py-2 text-xs font-bold shadow-soft hover:bg-[#1E75AC] transition-all cursor-pointer"
          >
            <ShieldCheck className="h-4 w-4" />
            <span>Open Verification Workspace →</span>
          </button>
        </div>
      </div>

      {/* Special Case: Damaged Plate Notification */}
      {app.hasDamagedPlate && (
        <div className="rounded-3xl card-amber border border-[#FCE3BA] p-5 flex items-start gap-3.5">
          <ShieldAlert className="h-6 w-6 text-[#B86C0B] shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-[#7C4806]">
              Special Case: Identifier Unavailable / Damaged Nameplate
            </h4>
            <p className="text-xs text-[#8F5509]">
              This verification request operates under temporary identification rules. The business has declared that the manufacturer stamped serial number is damaged or unavailable. During field verification, the inspecting Legal Metrology Officer will verify physical dimensions, load cell serials, and attach an official re-tagging barcode.
            </p>
          </div>
        </div>
      )}

      {/* Grid: Details, Assignment, Documents */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Application Specs & Establishment Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-3xl card-lavender p-6 border border-[#E0DCFB] shadow-soft-card space-y-4">
            <h3 className="font-outfit text-base font-bold text-[#123F63] border-b border-[#E0DCFB] pb-3">
              Application Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-[#646A94] block text-[11px]">Instrument Linked</span>
                <Link
                  to={`/instruments/${app.instrumentId}`}
                  className="font-mono font-bold text-[#2F8FCC] hover:text-[#1E75AC] hover:underline inline-flex items-center gap-1 mt-0.5 cursor-pointer"
                >
                  <span>{app.instrumentId}</span>
                  <ExternalLink className="h-3 w-3" />
                </Link>
              </div>

              <div>
                <span className="text-[#646A94] block text-[11px]">Instrument Type</span>
                <span className="font-bold text-[#123F63]">
                  {app.instrumentType}
                </span>
              </div>

              <div>
                <span className="text-[#646A94] block text-[11px]">Applicant & Business</span>
                <span className="font-bold text-[#123F63]">
                  {app.applicantName} ({app.businessName})
                </span>
              </div>

              <div>
                <span className="text-[#646A94] block text-[11px]">Contact Mobile & Email</span>
                <span className="font-mono text-[#123F63]">
                  {app.contactNumber} • {app.email}
                </span>
              </div>

              <div className="sm:col-span-2">
                <span className="text-[#646A94] block text-[11px]">Inspection Premises</span>
                <span className="font-medium text-[#123F63]">
                  {app.address}, {app.district}, {app.state}
                </span>
              </div>

              <div>
                <span className="text-[#646A94] block text-[11px]">Preferred Inspection Date</span>
                <span className="font-bold text-[#123F63]">
                  {app.preferredDate}
                </span>
              </div>

              <div>
                <span className="text-[#646A94] block text-[11px]">Statutory Fee Status</span>
                <span className="font-bold text-[#1E8E5A]">
                  ₹{app.feePaid || 450} (Paid - Ref: {app.paymentRef || 'TXN-998214'})
                </span>
              </div>
            </div>

            {app.remarks && (
              <div className="pt-3 border-t border-[#E0DCFB]">
                <span className="text-[#646A94] block text-[11px] mb-1">Remarks & Notes</span>
                <p className="text-xs text-[#123F63] bg-white/70 p-3 rounded-2xl border border-[#E0DCFB]">
                  {app.remarks}
                </p>
              </div>
            )}
          </div>

          {/* Supporting Documents & Photos Card */}
          <div className="rounded-3xl card-neutral-blue p-6 border border-[#DCEAF4] shadow-soft-card space-y-4">
            <h3 className="font-outfit text-base font-bold text-[#123F63] border-b border-[#DCEAF4] pb-3">
              Supporting Verification Documents ({app.supportingDocs.length})
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {app.supportingDocs.map((doc, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-2xl bg-white border border-[#CFE5F5] text-xs"
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <FileText className="h-4 w-4 text-[#2F8FCC] shrink-0" />
                    <span className="font-mono text-[11px] font-medium text-[#123F63] truncate">
                      {doc}
                    </span>
                  </div>
                  <span className="text-[10px] text-[#1E8E5A] font-bold bg-[#D4F6E5] px-2 py-0.5 rounded-full shrink-0">
                    Uploaded
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Assigned Officer, Schedule & Direct Actions */}
        <div className="space-y-6">
          {/* Assignment Card */}
          <div className="rounded-3xl card-sky p-6 border border-[#CFE5F5] shadow-soft-card space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#CFE5F5]">
              <h3 className="font-outfit text-base font-bold text-[#123F63]">
                Officer Assignment
              </h3>
              <div className="h-7 w-7 rounded-xl bg-[#D5EEFB] text-[#1E75AC] flex items-center justify-center">
                <UserCheck className="h-4 w-4" />
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-[#527290] block text-[11px]">Assigned LMO</span>
                <p className="font-bold text-[#123F63] text-sm mt-0.5">
                  {app.assignedOfficerName || 'Pending Officer Allocation'}
                </p>
              </div>

              <div>
                <span className="text-[#527290] block text-[11px]">Testing Lab / GATC</span>
                <p className="font-medium text-[#527290] mt-0.5">
                  {app.assignedGATCName || 'District Legal Metrology Squad (On-site)'}
                </p>
              </div>

              <div>
                <span className="text-[#527290] block text-[11px]">Scheduled Audit Date</span>
                <p className="font-bold text-[#1E75AC] text-sm mt-0.5">
                  {app.scheduledDate || 'To be scheduled'}
                </p>
              </div>
            </div>

            <button
              onClick={() => setAssignModalOpen(true)}
              className="w-full py-2.5 rounded-2xl bg-white border border-[#CFE5F5] hover:bg-[#E2F0F9] text-xs font-bold text-[#123F63] transition-colors cursor-pointer"
            >
              Update Schedule or Officer
            </button>
          </div>

          {/* Action to proceed to verification */}
          <div className="rounded-3xl card-greeting p-6 border border-[#CCE3F3] shadow-soft-card space-y-3">
            <h4 className="font-outfit text-base font-bold text-[#123F63]">
              Ready for Physical Inspection?
            </h4>
            <p className="text-xs text-[#527290]">
              Open the digital verification workspace to conduct test load checks, examine lead seals, capture field photos, and certify results.
            </p>
            <button
              onClick={() => navigate(`/verification/${app.id}`)}
              className="w-full py-3 rounded-2xl bg-[#2F8FCC] hover:bg-[#1E75AC] text-white font-bold text-xs shadow-soft transition-all cursor-pointer"
            >
              Open Verification Workspace
            </button>
          </div>
        </div>
      </div>

      {/* Assign Modal */}
      <AssignOfficerModal
        isOpen={assignModalOpen}
        onClose={() => setAssignModalOpen(false)}
        applicationId={app.id}
        applicantBusiness={app.businessName}
        instrumentType={app.instrumentType}
        onAssigned={(_appId, officerName) => {
          setApp({
            ...app,
            assignedOfficerName: officerName,
            status: 'Scheduled',
          });
        }}
      />
    </div>
  );
};
