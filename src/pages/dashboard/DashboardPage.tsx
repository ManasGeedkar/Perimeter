import React, { useState, useMemo } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import {
  Scale,
  FileCheck2,
  ShieldCheck,
  AlertTriangle,
  Clock,
  CalendarCheck2,
  Plus,
  FileSpreadsheet,
  UserCheck,
  Filter,
  RotateCcw,
  Eye,
  MoreVertical,
  ExternalLink,
  ChevronRight,
  ShieldAlert,
  Sparkles,
  CheckCircle2,
  Search,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  CartesianGrid,
} from 'recharts';
import { useAuth } from '../../context/AuthContext';
import { mockDashboardData } from '../../data/mockDashboard';
import { mockApplications } from '../../data/mockApplications';
import { mockCertificates } from '../../data/mockCertificates';
import { StatCard } from '../../components/common/StatCard';
import { StatusBadge } from '../../components/common/StatusBadge';
import { RegisterInstrumentModal } from '../../features/instruments';
import { AssignOfficerModal } from '../../components/applications/AssignOfficerModal';

interface OutletContextType {
  openNewApplication: () => void;
}

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const outletContext = useOutletContext<OutletContextType | null>();
  const openNewApplication = outletContext?.openNewApplication || (() => navigate('/start-inspection'));

  // Modals state
  const [registerModalOpen, setRegisterModalOpen] = useState(false);
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedAppForAssign, setSelectedAppForAssign] = useState<any>(null);

  // Filters state
  const [selectedState, setSelectedState] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [searchTableQuery, setSearchTableQuery] = useState('');

  // Reset filters
  const handleResetFilters = () => {
    setSelectedState('All');
    setSelectedType('All');
    setSelectedStatus('All');
    setSearchTableQuery('');
  };

  // Filtered recent applications
  const filteredApplications = useMemo(() => {
    return mockApplications.filter((app) => {
      if (selectedStatus !== 'All' && app.status !== selectedStatus) return false;
      if (selectedType !== 'All' && app.instrumentType !== selectedType) return false;
      if (selectedState !== 'All' && app.state !== selectedState) return false;
      if (searchTableQuery) {
        const q = searchTableQuery.toLowerCase();
        return (
          app.id.toLowerCase().includes(q) ||
          app.instrumentId.toLowerCase().includes(q) ||
          app.businessName.toLowerCase().includes(q) ||
          app.applicantName.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [selectedStatus, selectedType, selectedState, searchTableQuery]);

  // Urgent expiring certificates (filtered to expiring soon / expired)
  const expiringCertificates = useMemo(() => {
    return mockCertificates.filter((c) => (c.daysRemaining !== undefined && c.daysRemaining <= 60) || c.status === 'EXPIRED');
  }, []);

  return (
    <div className="space-y-7 animate-in fade-in duration-200">
      {/* Welcome Banner & Quick Action Buttons (Section 10 & 15) */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 card-greeting p-6 sm:p-7 rounded-3xl border shadow-soft-card">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-outfit text-2xl sm:text-3xl font-extrabold text-[#123F63]">
              Good morning, {user.name.split(' ')[0]}
            </h1>
            <span className="text-xs bg-[#D4F6E5] text-[#1E8E5A] border border-[#CDEFE0] font-bold px-2.5 py-0.5 rounded-full">
              LMO Active
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#627B94] mt-1">
            Here's the current verification overview across the National Legal Metrology Grid.
          </p>
        </div>

        {/* Quick Actions Bar */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setRegisterModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-2xl bg-[#2F8FCC] hover:bg-[#1E75AC] text-white px-4 py-2.5 text-xs sm:text-sm font-bold shadow-soft active:scale-[0.98] transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-[#2F8FCC]"
          >
            <Plus className="h-4 w-4" />
            <span>Register Instrument</span>
          </button>

          <button
            onClick={openNewApplication}
            className="inline-flex items-center gap-2 rounded-2xl bg-[#1E8E5A] text-white px-4 py-2.5 text-xs sm:text-sm font-bold shadow-soft hover:bg-[#167247] active:scale-[0.98] transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-[#1E8E5A]"
          >
            <FileCheck2 className="h-4 w-4" />
            <span>New Verification</span>
          </button>

          <button
            onClick={() => {
              if (mockApplications[0]) {
                setSelectedAppForAssign(mockApplications[0]);
                setAssignModalOpen(true);
              }
            }}
            className="inline-flex items-center gap-2 rounded-2xl bg-white border border-[#CFE5F5] text-[#123F63] px-4 py-2.5 text-xs sm:text-sm font-bold shadow-xs hover:bg-[#EDF8FE] hover:border-[#2F8FCC] hover:text-[#123F63] active:scale-[0.98] transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-[#2F8FCC]"
          >
            <UserCheck className="h-4 w-4 text-[#1E75AC]" />
            <span>Assign Officer</span>
          </button>

          <button
            onClick={() => navigate('/reports')}
            className="inline-flex items-center gap-2 rounded-2xl bg-white border border-[#CFE5F5] text-[#123F63] px-4 py-2.5 text-xs sm:text-sm font-bold shadow-xs hover:bg-[#EDF8FE] hover:border-[#2F8FCC] hover:text-[#123F63] active:scale-[0.98] transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-[#2F8FCC]"
          >
            <FileSpreadsheet className="h-4 w-4 text-[#1E75AC]" />
            <span>Generate Report</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid (Section 10) with Differentiated Pastel Surfaces */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard
          title="Total Registered"
          value={mockDashboardData.totalInstruments}
          icon={Scale}
          variant="sky"
          trend={{ value: '+14% MoM', isPositive: true }}
          contextText="National Grid"
          onClick={() => navigate('/instruments')}
        />

        <StatCard
          title="Pending Applications"
          value={mockDashboardData.pendingApplications}
          icon={Clock}
          variant="lavender"
          trend={{ value: '38 urgent', isNeutral: true }}
          contextText="Under Review"
          onClick={() => navigate('/applications')}
        />

        <StatCard
          title="Verified Instruments"
          value={mockDashboardData.verifiedInstruments}
          icon={ShieldCheck}
          variant="mint"
          trend={{ value: '87.5% Ratio', isPositive: true }}
          contextText="Stamped & Active"
          onClick={() => navigate('/certificates')}
        />

        <StatCard
          title="Expiring Soon"
          value={mockDashboardData.expiringSoon}
          icon={AlertTriangle}
          variant="amber"
          trend={{ value: 'Next 30 Days', isNeutral: true }}
          contextText="Notice Sent"
          onClick={() => navigate('/certificates')}
        />

        <StatCard
          title="Expired Certificates"
          value={mockDashboardData.expiredCertificates}
          icon={ShieldAlert}
          variant="danger"
          trend={{ value: 'Penalties active', isPositive: false }}
          contextText="Overdue Renewal"
          onClick={() => navigate('/certificates')}
        />

        <StatCard
          title="Scheduled Today"
          value={mockDashboardData.scheduledToday}
          icon={CalendarCheck2}
          variant="neutral"
          trend={{ value: '18 Field Units', isPositive: true }}
          contextText="Circle Teams"
          onClick={() => navigate('/verification')}
        />
      </div>

      {/* Filter Toolbar (Section 12) */}
      <div className="flex flex-wrap items-center justify-between gap-3 card-neutral-blue p-4 rounded-2xl border shadow-soft-card">
        <div className="flex flex-wrap items-center gap-2.5 text-xs">
          <div className="flex items-center gap-1.5 font-bold text-[#123F63] mr-1">
            <Filter className="h-4 w-4 text-[#1E75AC]" />
            <span>Filters:</span>
          </div>

          {/* State Filter */}
          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="rounded-xl border border-[#DCEAF4] bg-white px-3 py-1.5 text-xs font-medium text-[#123F63] focus:outline-hidden focus:ring-1 focus:ring-[#2F8FCC]"
          >
            <option value="All">All States</option>
            <option value="Madhya Pradesh">Madhya Pradesh</option>
            <option value="Maharashtra">Maharashtra</option>
            <option value="Karnataka">Karnataka</option>
            <option value="Delhi">Delhi</option>
            <option value="Gujarat">Gujarat</option>
            <option value="Tamil Nadu">Tamil Nadu</option>
          </select>

          {/* Instrument Type */}
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="rounded-xl border border-[#DCEAF4] bg-white px-3 py-1.5 text-xs font-medium text-[#123F63] focus:outline-hidden focus:ring-1 focus:ring-[#2F8FCC]"
          >
            <option value="All">All Instrument Types</option>
            <option value="Electronic Weighing Scale">Electronic Weighing Scale</option>
            <option value="Platform Scale">Platform Scale</option>
            <option value="Fuel Dispenser">Fuel Dispenser</option>
            <option value="Weighbridge">Weighbridge</option>
            <option value="Analytical Balance">Analytical Balance</option>
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="rounded-xl border border-[#DCEAF4] bg-white px-3 py-1.5 text-xs font-medium text-[#123F63] focus:outline-hidden focus:ring-1 focus:ring-[#2F8FCC]"
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
          </select>
        </div>

        <button
          onClick={handleResetFilters}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#627B94] hover:text-[#1E75AC] transition-colors"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>Reset Filters</span>
        </button>
      </div>

      {/* Charts Grid (Section 11) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 1. Monthly Verification Trend (Line Chart - 2 cols on lg) */}
        <div className="lg:col-span-2 rounded-3xl card-neutral-blue p-6 border shadow-soft-card space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-outfit text-base font-bold text-[#123F63]">
                Monthly Verification Trend
              </h3>
              <p className="text-xs text-[#627B94]">
                Total verified, scheduled, and failed instrument audits over the past 12 months
              </p>
            </div>
            <span className="text-xs font-bold text-[#1E75AC] bg-[#D5EEFB] px-2.5 py-1 rounded-full border border-[#BCE0F7]">
              FY 2025-26
            </span>
          </div>

          <div className="h-64 sm:h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockDashboardData.monthlyTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#DCEAF4" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#627B94' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#627B94' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderRadius: '16px',
                    boxShadow: '0 4px 20px rgba(18,63,99,0.08)',
                    border: '1px solid #DCEAF4',
                    fontSize: '12px',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Line type="monotone" dataKey="verified" name="Verified & Stamped" stroke="#1E8E5A" strokeWidth={2.5} dot={{ r: 3 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="scheduled" name="Scheduled" stroke="#2F8FCC" strokeWidth={2} strokeDasharray="4 4" dot={false} />
                <Line type="monotone" dataKey="failed" name="Failed / Rejected" stroke="#D95C59" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 2. Verification Status Donut Chart */}
        <div className="rounded-3xl card-neutral-blue p-6 border shadow-soft-card space-y-4">
          <div>
            <h3 className="font-outfit text-base font-bold text-[#123F63]">
              Verification Status
            </h3>
            <p className="text-xs text-[#627B94]">
              Active distribution across statutory verification phases
            </p>
          </div>

          <div className="h-56 w-full relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={mockDashboardData.statusDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {mockDashboardData.statusDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: any) => [Number(value).toLocaleString('en-IN'), 'Instruments']}
                  contentStyle={{
                    borderRadius: '12px',
                    fontSize: '11px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-xl font-extrabold text-[#123F63]">
                87.5%
              </span>
              <span className="text-[10px] text-[#627B94] font-semibold">Compliance</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 border-t border-[#DCEAF4]">
            {mockDashboardData.statusDistribution.slice(0, 4).map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                <span className="truncate text-[#16466F]">{item.name}</span>
                <span className="font-bold ml-auto text-[#123F63]">{item.value.toLocaleString('en-IN')}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Instrument Type Distribution (Bar Chart) */}
        <div className="rounded-3xl card-neutral-blue p-6 border shadow-soft-card space-y-4">
          <div>
            <h3 className="font-outfit text-base font-bold text-[#123F63]">
              Instrument Types
            </h3>
            <p className="text-xs text-[#627B94]">
              Commercial instruments registered by category
            </p>
          </div>

          <div className="h-56 w-full pt-1">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockDashboardData.instrumentTypeDistribution} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#DCEAF4" />
                <XAxis type="number" tick={{ fontSize: 10, fill: '#627B94' }} axisLine={false} tickLine={false} />
                <YAxis dataKey="type" type="category" tick={{ fontSize: 10, fill: '#627B94' }} width={90} axisLine={false} tickLine={false} />
                <Tooltip
                  formatter={(value: any) => [Number(value).toLocaleString('en-IN'), 'Units']}
                  contentStyle={{ borderRadius: '12px', fontSize: '11px' }}
                />
                <Bar dataKey="count" fill="#2F8FCC" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 4. State-Wise Activity */}
        <div className="rounded-3xl card-neutral-blue p-6 border shadow-soft-card space-y-4">
          <div>
            <h3 className="font-outfit text-base font-bold text-[#123F63]">
              State-Wise Verification Activity
            </h3>
            <p className="text-xs text-[#627B94]">
              Audit volume and verified quota per state jurisdiction
            </p>
          </div>

          <div className="h-56 w-full pt-1">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockDashboardData.stateWiseActivity}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#DCEAF4" />
                <XAxis dataKey="state" tick={{ fontSize: 9, fill: '#627B94' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#627B94' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: '12px', fontSize: '11px' }} />
                <Bar dataKey="count" name="Total Filed" fill="#BCE0F7" radius={[4, 4, 0, 0]} />
                <Bar dataKey="verified" name="Verified" fill="#1E8E5A" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 5. Officer & GATC Workload */}
        <div className="rounded-3xl card-neutral-blue p-6 border shadow-soft-card space-y-4">
          <div>
            <h3 className="font-outfit text-base font-bold text-[#123F63]">
              Officer Workload & Output
            </h3>
            <p className="text-xs text-[#627B94]">
              Field inspections assigned vs completed this month
            </p>
          </div>

          <div className="h-56 w-full pt-1">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockDashboardData.officerWorkload} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#DCEAF4" />
                <XAxis type="number" tick={{ fontSize: 10, fill: '#627B94' }} axisLine={false} tickLine={false} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 9, fill: '#627B94' }} width={100} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: '12px', fontSize: '11px' }} />
                <Bar dataKey="completed" name="Completed" fill="#1E8E5A" radius={[0, 4, 4, 0]} stackId="a" />
                <Bar dataKey="assigned" name="Pending In Field" fill="#B86C0B" radius={[0, 4, 4, 0]} stackId="a" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Main Grid: Recent Applications & Expiring Certificates */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Recent Applications Table (2 Columns) */}
        <div className="xl:col-span-2 rounded-3xl card-neutral-blue p-6 border shadow-soft-card space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-outfit text-lg font-bold text-[#123F63]">
                  Recent Applications
                </h3>
                <span className="text-xs font-bold bg-[#D5EEFB] text-[#1E75AC] px-2 py-0.5 rounded-full border border-[#BCE0F7]">
                  {filteredApplications.length}
                </span>
              </div>
              <p className="text-xs text-[#627B94]">
                Track and manage verification requests across commercial establishments
              </p>
            </div>

            <div className="relative w-full sm:w-60">
              <Search className="h-4 w-4 absolute left-3 top-2.5 text-[#627B94]" />
              <input
                type="text"
                value={searchTableQuery}
                onChange={(e) => setSearchTableQuery(e.target.value)}
                placeholder="Search table..."
                className="w-full rounded-xl border border-[#DCEAF4] bg-white pl-9 pr-3 py-1.5 text-xs text-[#123F63] focus:outline-hidden focus:ring-1 focus:ring-[#2F8FCC]"
              />
            </div>
          </div>

          {/* Responsive Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#DCEAF4] text-[#627B94] font-semibold uppercase tracking-wider text-[11px]">
                  <th className="pb-3 font-semibold">Application & Instrument</th>
                  <th className="pb-3 font-semibold">Applicant / Business</th>
                  <th className="pb-3 font-semibold">Location</th>
                  <th className="pb-3 font-semibold">Assigned Officer</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DCEAF4]/60">
                {filteredApplications.slice(0, 6).map((app) => (
                  <tr
                    key={app.id}
                    className="hover:bg-[#EAF6FD] transition-colors group"
                  >
                    <td className="py-3 pr-2">
                      <div className="font-mono font-bold text-[#1E75AC] flex items-center gap-1.5">
                        <span>{app.id}</span>
                        {app.hasDamagedPlate && (
                          <span className="text-[9px] bg-[#FFF7E8] text-[#B86C0B] border border-[#FCE3BA] font-bold px-1.5 py-0.2 rounded-sm" title="Damaged Serial Plate Special Case">
                            Plate Damaged
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-[#627B94] font-medium truncate max-w-[150px]">
                        {app.instrumentType}
                      </div>
                    </td>

                    <td className="py-3 pr-2">
                      <div className="font-semibold text-[#123F63] truncate max-w-[170px]">
                        {app.businessName}
                      </div>
                      <div className="text-[11px] text-[#627B94]">{app.applicantName}</div>
                    </td>

                    <td className="py-3 pr-2">
                      <div className="text-[#16466F] font-medium">
                        {app.district}, {app.state}
                      </div>
                      <div className="text-[10px] text-[#627B94]">Date: {app.submittedDate}</div>
                    </td>

                    <td className="py-3 pr-2">
                      <div className="text-[#16466F] font-medium">
                        {app.assignedOfficerName ? app.assignedOfficerName.split('(')[0] : 'Unassigned'}
                      </div>
                      {app.scheduledDate && (
                        <div className="text-[10px] text-[#1E8E5A] font-semibold">
                          Sched: {app.scheduledDate}
                        </div>
                      )}
                    </td>

                    <td className="py-3 pr-2">
                      <StatusBadge status={app.status} size="sm" />
                    </td>

                    <td className="py-3 text-right space-x-1.5">
                      <button
                        onClick={() => navigate(`/applications/${app.id}`)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-[#DCEAF4] hover:bg-[#2F8FCC] hover:text-white text-[#123F63] font-semibold text-[11px] transition-colors"
                      >
                        <Eye className="h-3 w-3" />
                        <span>View</span>
                      </button>

                      <button
                        onClick={() => {
                          setSelectedAppForAssign(app);
                          setAssignModalOpen(true);
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#D5EEFB] border border-[#BCE0F7] hover:bg-[#2F8FCC] hover:text-white text-[#1E75AC] font-semibold text-[11px] transition-colors"
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

          <div className="pt-2 flex items-center justify-between border-t border-[#DCEAF4] text-xs">
            <span className="text-[#627B94]">
              Showing top 6 of {filteredApplications.length} requests
            </span>
            <button
              onClick={() => navigate('/applications')}
              className="font-bold text-[#1E75AC] hover:text-[#123F63] hover:underline inline-flex items-center gap-1"
            >
              <span>View All Applications</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Expiring Certificates Table & Right Side Panel */}
        <div className="space-y-6">
          {/* Expiring Soon Card: Pastel Amber Surface */}
          <div className="rounded-3xl card-amber p-6 border shadow-soft-card space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-outfit text-base font-bold text-[#123F63]">
                  Certificates Expiring Soon
                </h3>
                <p className="text-xs text-[#627B94]">
                  Mandatory annual renewal warnings
                </p>
              </div>
              <span className="text-xs font-bold text-[#B86C0B] bg-[#FEEDC8] px-2 py-0.5 rounded-full border border-[#FCE3BA]">
                Action Required
              </span>
            </div>

            <div className="space-y-2.5">
              {expiringCertificates.slice(0, 4).map((cert) => {
                const days = cert.daysRemaining ?? 0;
                const isOverdue = days < 0 || cert.status === 'EXPIRED';

                return (
                  <div
                    key={cert.id}
                    onClick={() => navigate(`/certificates/${cert.id}`)}
                    className="p-3 rounded-2xl bg-white border border-[#FCE3BA] hover:border-[#B86C0B] cursor-pointer transition-all space-y-1 group shadow-2xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-[#1E75AC]">
                        {cert.id}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isOverdue
                            ? 'bg-[#FFF2F2] text-[#D04040] border border-[#FAD0D0]'
                            : days <= 15
                            ? 'bg-[#FEEDC8] text-[#B86C0B] border border-[#FCE3BA]'
                            : 'bg-[#EFFAF4] text-[#1E8E5A] border border-[#CDEFE0]'
                        }`}
                      >
                        {isOverdue ? `${Math.abs(days)}d Overdue` : `${days} days left`}
                      </span>
                    </div>

                    <p className="text-xs font-semibold text-[#123F63] truncate">
                      {cert.businessName}
                    </p>

                    <div className="flex items-center justify-between text-[11px] text-[#627B94]">
                      <span>{cert.instrumentType}</span>
                      <span>Expiry: {cert.validUntil}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => navigate('/certificates')}
              className="w-full py-2.5 rounded-2xl bg-white border border-[#FCE3BA] hover:bg-[#FEEDC8]/50 text-xs font-bold text-[#B86C0B] text-center transition-colors block cursor-pointer"
            >
              View All Expiring Instruments
            </button>
          </div>

          {/* Statutory Verification Reference Panel: Pastel Sky Surface */}
          <div className="rounded-3xl card-sky p-6 border shadow-soft-card space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-[#123F63] uppercase tracking-wider">
              <Sparkles className="h-4 w-4 text-[#1E75AC]" />
              <span>Statutory Compliance Guidelines</span>
            </div>

            <h4 className="font-outfit text-base font-extrabold text-[#123F63]">
              Legal Metrology Act, 2009
            </h4>

            <div className="space-y-2 text-xs text-[#16466F]">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#1E8E5A] shrink-0 mt-0.5" />
                <span>
                  <strong>Section 24:</strong> Mandatory periodic reverification of all weights and measures used for transaction or protection.
                </span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#1E8E5A] shrink-0 mt-0.5" />
                <span>
                  <strong>Schedule IX:</strong> Standard weights tolerance within Maximum Permissible Error (MPE) thresholds.
                </span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#1E8E5A] shrink-0 mt-0.5" />
                <span>
                  <strong>Rule 14:</strong> Holographic digital seal and public QR certificate must be displayed at point of sale.
                </span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => navigate('/verification')}
                className="w-full py-2.5 rounded-2xl bg-[#2F8FCC] text-white hover:bg-[#1E75AC] text-xs font-bold shadow-soft transition-all text-center cursor-pointer"
              >
                Open Field Verification Workspace →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Register Instrument Modal */}
      <RegisterInstrumentModal
        isOpen={registerModalOpen}
        onClose={() => setRegisterModalOpen(false)}
        onRegistered={(inst) => {
          navigate(`/instruments/${inst.id}`);
        }}
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
