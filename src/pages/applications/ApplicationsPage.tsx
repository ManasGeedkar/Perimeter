import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileCheck2,
  Plus,
  Search,
  Filter,
  Eye,
  UserCheck,
  ShieldCheck,
  Calendar,
  Building,
  RotateCcw,
  AlertTriangle,
} from 'lucide-react';
import { mockApplications } from '../../data/mockApplications';
import { StatusBadge } from '../../components/common/StatusBadge';
import { NewApplicationModal } from '../../components/applications/NewApplicationModal';
import { AssignOfficerModal } from '../../components/applications/AssignOfficerModal';
import { ApplicationStatus } from '../../types';

export const ApplicationsPage: React.FC = () => {
  const navigate = useNavigate();
  const [newAppModalOpen, setNewAppModalOpen] = useState(false);
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedAppForAssign, setSelectedAppForAssign] = useState<any>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | 'All'>('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [stateFilter, setStateFilter] = useState('All');

  const filteredApplications = useMemo(() => {
    return mockApplications.filter((app) => {
      if (statusFilter !== 'All' && app.status !== statusFilter) return false;
      if (typeFilter !== 'All' && app.verificationType !== typeFilter) return false;
      if (stateFilter !== 'All' && app.state !== stateFilter) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (
          app.id.toLowerCase().includes(q) ||
          app.instrumentId.toLowerCase().includes(q) ||
          app.businessName.toLowerCase().includes(q) ||
          app.applicantName.toLowerCase().includes(q) ||
          app.district.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [statusFilter, typeFilter, stateFilter, searchQuery]);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header (Section 19) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 card-greeting p-6 sm:p-8 rounded-3xl shadow-soft-card">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#D5EEFB] text-[#1E75AC] border border-[#BDE0F7] shadow-xs">
              <FileCheck2 className="h-5 w-5" />
            </div>
            <div>
              <h1 className="font-outfit text-xl sm:text-2xl font-extrabold text-[#123F63]">
                Applications
              </h1>
              <p className="text-xs text-[#527290]">
                Track and manage statutory verification requests, schedules, and officer assignments
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => setNewAppModalOpen(true)}
          className="inline-flex items-center gap-2 rounded-2xl bg-[#2F8FCC] hover:bg-[#1E75AC] text-white px-5 py-2.5 text-xs sm:text-sm font-bold shadow-soft transition-all cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>+ New Application</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="card-neutral-blue p-5 rounded-3xl shadow-soft-card space-y-3">
        <div className="flex flex-col lg:flex-row lg:items-center gap-3">
          <div className="relative flex-1">
            <Search className="h-4 w-4 absolute left-3.5 top-3 text-[#7A93A8]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by application ID, instrument ID, or applicant business..."
              className="w-full rounded-2xl border border-[#CFE5F5] bg-white pl-10 pr-4 py-2 text-xs sm:text-sm text-[#123F63] focus:outline-hidden focus:ring-2 focus:ring-[#2F8FCC]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="rounded-xl border border-[#CFE5F5] bg-white px-3 py-2 text-xs text-[#123F63] font-medium focus:ring-2 focus:ring-[#2F8FCC]"
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Under Review">Under Review</option>
              <option value="Scheduled">Scheduled</option>
              <option value="Assigned">Assigned</option>
              <option value="In Verification">In Verification</option>
              <option value="Verified">Verified</option>
              <option value="Identification Pending">Identification Pending</option>
              <option value="Failed">Failed</option>
              <option value="Rejected">Rejected</option>
            </select>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="rounded-xl border border-[#CFE5F5] bg-white px-3 py-2 text-xs text-[#123F63] font-medium focus:ring-2 focus:ring-[#2F8FCC]"
            >
              <option value="All">All Verification Types</option>
              <option value="Initial Verification">Initial Verification</option>
              <option value="Periodic Verification">Periodic Verification</option>
              <option value="Re-verification">Re-verification</option>
              <option value="Special Verification">Special Verification</option>
            </select>

            <select
              value={stateFilter}
              onChange={(e) => setStateFilter(e.target.value)}
              className="rounded-xl border border-[#CFE5F5] bg-white px-3 py-2 text-xs text-[#123F63] font-medium focus:ring-2 focus:ring-[#2F8FCC]"
            >
              <option value="All">All States</option>
              <option value="Madhya Pradesh">Madhya Pradesh</option>
              <option value="Maharashtra">Maharashtra</option>
              <option value="Karnataka">Karnataka</option>
              <option value="Delhi">Delhi</option>
              <option value="Tamil Nadu">Tamil Nadu</option>
              <option value="Gujarat">Gujarat</option>
            </select>

            <button
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('All');
                setTypeFilter('All');
                setStateFilter('All');
              }}
              className="p-2 rounded-xl text-[#7A93A8] hover:text-[#123F63] hover:bg-[#EDF8FE] transition-colors"
              title="Reset Filters"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-[#527290] pt-1">
          <span>Found {filteredApplications.length} applications</span>
          <span>Click any row to open the complete verification review and assignment drawer</span>
        </div>
      </div>

      {/* Applications Table (Section 19) */}
      <div className="rounded-3xl card-neutral-blue shadow-soft-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#EDF8FE] border-b border-[#CFE5F5] text-[#527290] font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-4 font-semibold">Application ID</th>
                <th className="py-3.5 px-3 font-semibold">Instrument & Type</th>
                <th className="py-3.5 px-3 font-semibold">Applicant & Business</th>
                <th className="py-3.5 px-3 font-semibold">Verification Type</th>
                <th className="py-3.5 px-3 font-semibold">Submitted</th>
                <th className="py-3.5 px-3 font-semibold">Scheduled Date</th>
                <th className="py-3.5 px-3 font-semibold">Assigned To</th>
                <th className="py-3.5 px-3 font-semibold">Status</th>
                <th className="py-3.5 px-4 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2EEF7]">
              {filteredApplications.map((app) => (
                <tr
                  key={app.id}
                  className="hover:bg-[#EDF8FE]/80 transition-colors cursor-pointer group"
                  onClick={() => navigate(`/applications/${app.id}`)}
                >
                  <td className="py-3.5 px-4">
                    <div className="font-mono font-bold text-[#1E75AC]">
                      {app.id}
                    </div>
                    {app.hasDamagedPlate && (
                      <span className="inline-block mt-0.5 text-[9px] bg-[#FFF7E8] text-[#B86C0B] border border-[#FCE3BA] font-bold px-1.5 py-0.2 rounded-sm">
                        Damaged Plate
                      </span>
                    )}
                  </td>

                  <td className="py-3.5 px-3">
                    <p className="font-mono font-semibold text-[#123F63]">
                      {app.instrumentId}
                    </p>
                    <p className="text-[11px] text-[#627B94]">{app.instrumentType}</p>
                  </td>

                  <td className="py-3.5 px-3">
                    <p className="font-semibold text-[#123F63] truncate max-w-[170px]">
                      {app.businessName}
                    </p>
                    <p className="text-[11px] text-[#627B94]">{app.applicantName} ({app.district})</p>
                  </td>

                  <td className="py-3.5 px-3 font-medium text-[#123F63]">
                    {app.verificationType}
                  </td>

                  <td className="py-3.5 px-3 text-[#627B94]">{app.submittedDate}</td>

                  <td className="py-3.5 px-3 font-medium">
                    {app.scheduledDate ? (
                      <span className="text-[#1E8E5A] font-semibold">
                        {app.scheduledDate}
                      </span>
                    ) : (
                      <span className="text-[#7A93A8]">Not Scheduled</span>
                    )}
                  </td>

                  <td className="py-3.5 px-3">
                    {app.assignedOfficerName ? (
                      <p className="font-medium text-[#123F63] truncate max-w-[140px]">
                        {app.assignedOfficerName.split('(')[0]}
                      </p>
                    ) : (
                      <span className="text-[#7A93A8] italic">Unassigned</span>
                    )}
                  </td>

                  <td className="py-3.5 px-3">
                    <StatusBadge status={app.status} size="sm" />
                  </td>

                  <td className="py-3.5 px-4 text-right space-x-1" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => navigate(`/applications/${app.id}`)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-[#CFE5F5] hover:bg-[#EDF8FE] text-[#123F63] font-bold text-[11px] transition-colors shadow-xs"
                    >
                      <Eye className="h-3 w-3 text-[#1E75AC]" />
                      <span>View</span>
                    </button>

                    <button
                      onClick={() => {
                        setSelectedAppForAssign(app);
                        setAssignModalOpen(true);
                      }}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#D5EEFB] border border-[#BDE0F7] hover:bg-[#BDE0F7] text-[#1E75AC] font-bold text-[11px] transition-colors shadow-xs"
                    >
                      <UserCheck className="h-3 w-3" />
                      <span>Assign</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Application Modal */}
      <NewApplicationModal
        isOpen={newAppModalOpen}
        onClose={() => setNewAppModalOpen(false)}
        onSuccess={(appId) => navigate(`/applications/${appId}`)}
      />

      {/* Assign Officer Modal */}
      {selectedAppForAssign && (
        <AssignOfficerModal
          isOpen={assignModalOpen}
          onClose={() => setAssignModalOpen(false)}
          applicationId={selectedAppForAssign.id}
          applicantBusiness={selectedAppForAssign.businessName}
          instrumentType={selectedAppForAssign.instrumentType}
        />
      )}
    </div>
  );
};
