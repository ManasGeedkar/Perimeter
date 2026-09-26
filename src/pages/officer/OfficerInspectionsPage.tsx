import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Scale,
  Calendar,
  Clock,
  MapPin,
  Search,
  Filter,
  Play,
  CheckCircle2,
  AlertCircle,
  Building2,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';
import { applicationService } from '../../services/applicationService';
import { Application } from '../../types';

export const OfficerInspectionsPage: React.FC = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState<Application[]>([]);
  const [filterTab, setFilterTab] = useState<'All' | 'Today' | 'Pending' | 'Completed'>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    setLoading(true);
    const data = await applicationService.getAll();
    setApplications(data);
    setLoading(false);
  };

  const filteredApps = applications.filter((app) => {
    if (filterTab === 'Today') {
      return app.scheduledDate === '2026-09-18' || app.status === 'Scheduled';
    }
    if (filterTab === 'Pending') {
      return (
        app.status === 'Pending' ||
        app.status === 'Under Review' ||
        app.status === 'Scheduled' ||
        app.status === 'Assigned' ||
        app.status === 'In Verification'
      );
    }
    if (filterTab === 'Completed') {
      return app.status === 'Verified';
    }
    return true;
  }).filter((app) => {
    if (!searchTerm.trim()) return true;
    const q = searchTerm.toLowerCase();
    return (
      app.id.toLowerCase().includes(q) ||
      app.businessName.toLowerCase().includes(q) ||
      app.instrumentType.toLowerCase().includes(q) ||
      app.district.toLowerCase().includes(q)
    );
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 card-greeting p-6 sm:p-8 rounded-3xl border shadow-soft-card">
        <div>
          <h1 className="font-outfit text-3xl font-extrabold text-[#123F63]">
            Assigned Inspections
          </h1>
          <p className="text-[#627B94] text-sm mt-1">
            Verification requests allocated to your jurisdiction and badge.
          </p>
        </div>

        <Link
          to="/officer/dashboard"
          className="text-xs font-bold text-[#1E75AC] hover:text-[#123F63] hover:underline"
        >
          ← Back to Officer Dashboard
        </Link>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 card-neutral-blue p-1.5 rounded-2xl border shadow-xs overflow-x-auto">
          {(['All', 'Today', 'Pending', 'Completed'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilterTab(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                filterTab === tab
                  ? 'bg-[#2F8FCC] text-white shadow-xs'
                  : 'text-[#627B94] hover:text-[#123F63] hover:bg-white/60'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="relative min-w-[260px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#627B94]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by business, ID, city..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-[#DCEAF4] text-xs font-medium text-[#123F63] focus:outline-none focus:ring-2 focus:ring-[#2F8FCC]/20 focus:border-[#2F8FCC]"
          />
        </div>
      </div>

      {/* Inspection List Cards */}
      <div className="space-y-4">
        {filteredApps.length === 0 ? (
          <div className="card-neutral-blue rounded-3xl p-12 text-center border shadow-soft-card">
            <Scale className="h-10 w-10 text-[#627B94]/50 mx-auto mb-3" />
            <p className="text-base font-bold text-[#123F63]">
              No inspections found
            </p>
            <p className="text-xs text-[#627B94] mt-1">
              Try adjusting your filter or search query.
            </p>
          </div>
        ) : (
          filteredApps.map((app) => (
            <div
              key={app.id}
              className="card-neutral-blue rounded-3xl p-6 border shadow-soft-card hover:border-[#2F8FCC]/50 hover:-translate-y-0.5 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="font-mono text-xs font-extrabold text-[#1E75AC] bg-[#D5EEFB] px-3 py-1 rounded-xl border border-[#BCE0F7]">
                    {app.id}
                  </span>
                  <span className="text-[11px] font-bold px-3 py-1 rounded-full border bg-amber-50 text-amber-700 border-amber-200">
                    {app.status}
                  </span>
                  <span className="text-xs text-[#627B94]">
                    Submitted on {app.submittedDate}
                  </span>
                </div>

                <div>
                  <h3 className="font-outfit text-lg font-bold text-[#123F63] flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-[#1E75AC]" />
                    {app.businessName}
                  </h3>
                  <p className="text-xs text-[#627B94]">
                    Applicant: {app.applicantName} • Phone: {app.contactNumber}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs text-[#16466F] pt-1">
                  <div className="flex items-center gap-1.5">
                    <Scale className="h-4 w-4 text-[#627B94]" />
                    <span className="font-semibold">{app.instrumentType}</span>
                    <span className="text-[#627B94]">({app.instrumentId})</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4 text-[#627B94]" />
                    <span>
                      {app.address}, {app.district}, {app.state}
                    </span>
                  </div>
                  {app.scheduledDate && (
                    <div className="flex items-center gap-1.5 text-[#1E75AC] font-bold">
                      <Calendar className="h-4 w-4" />
                      <span>Scheduled: {app.scheduledDate}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
                <button
                  onClick={() => navigate(`/officer/inspect/${app.id}`)}
                  className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#2F8FCC] hover:bg-[#1E75AC] active:scale-[0.98] text-white font-bold text-xs shadow-soft transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-[#2F8FCC]"
                >
                  <Play className="h-4 w-4 fill-white" />
                  <span>Open Inspection Workspace</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
