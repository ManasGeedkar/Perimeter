import React, { useState } from 'react';
import {
  Users2,
  Search,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import { mockOfficers, mockGATCs } from '../../../data/mockOfficers';
import { StatusBadge } from '../../../components/common/StatusBadge';

export const OfficersPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'officers' | 'gatcs'>('officers');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredOfficers = mockOfficers.filter((o) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      o.name.toLowerCase().includes(q) ||
      o.employeeId.toLowerCase().includes(q) ||
      o.district.toLowerCase().includes(q) ||
      o.designation.toLowerCase().includes(q)
    );
  });

  const filteredGATCs = mockGATCs.filter((g) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      g.centreName.toLowerCase().includes(q) ||
      g.centreId.toLowerCase().includes(q) ||
      g.district.toLowerCase().includes(q) ||
      g.contactPerson.toLowerCase().includes(q)
    );
  });

  const workloadChartData = mockOfficers.map((o) => ({
    name: o.name.split(' ')[0],
    assigned: o.activeAssignments,
    completed: o.completedVerifications,
    pending: o.pendingTasks,
  }));

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header (Section 27) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 card-greeting p-6 sm:p-8 rounded-3xl shadow-soft-card">
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#D5EEFB] text-[#1E75AC] border border-[#BDE0F7] shadow-xs">
            <Users2 className="h-5 w-5" />
          </div>
          <div>
            <h1 className="font-outfit text-xl sm:text-2xl font-extrabold text-[#123F63]">
              Officers & GATC Laboratories
            </h1>
            <p className="text-xs text-[#527290]">
              Government Metrology field personnel & accredited testing laboratories
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-[#E2F0F9]/80 rounded-2xl border border-[#CCE2F2] text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('officers')}
            className={`px-4 py-2 rounded-xl font-bold transition-all cursor-pointer ${
              activeTab === 'officers'
                ? 'bg-[#2F8FCC] text-white shadow-xs'
                : 'text-[#527290] hover:text-[#123F63]'
            }`}
          >
            Legal Metrology Officers ({mockOfficers.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('gatcs')}
            className={`px-4 py-2 rounded-xl font-bold transition-all cursor-pointer ${
              activeTab === 'gatcs'
                ? 'bg-[#2F8FCC] text-white shadow-xs'
                : 'text-[#527290] hover:text-[#123F63]'
            }`}
          >
            GATC Testing Centres ({mockGATCs.length})
          </button>
        </div>
      </div>

      {/* Workload Visualization Card (Section 27) */}
      <div className="rounded-3xl card-neutral-blue p-6 shadow-soft-card space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-[#CFE5F5]">
          <div>
            <h3 className="font-outfit text-base font-bold text-[#123F63]">
              Inspection Workload & Capacity Analysis
            </h3>
            <p className="text-xs text-[#627B94]">
              Live ratio of active field allocations vs completed verifications by officer
            </p>
          </div>
          <span className="text-xs font-bold text-[#1E75AC] bg-[#D5EEFB] border border-[#BDE0F7] px-3 py-1 rounded-full">
            Active Grid Roster
          </span>
        </div>

        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={workloadChartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2EEF7" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#627B94' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#627B94' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: '12px', fontSize: '11px', borderColor: '#CFE5F5' }} />
              <Legend wrapperStyle={{ fontSize: '11px' }} />
              <Bar dataKey="assigned" name="Current Active" fill="#2F8FCC" radius={[4, 4, 0, 0]} />
              <Bar dataKey="pending" name="Pending Review" fill="#E9A23B" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Search Bar */}
      <div className="card-neutral-blue p-4 rounded-2xl shadow-soft-card flex items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="h-4 w-4 absolute left-3 top-2.5 text-[#7A93A8]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              activeTab === 'officers'
                ? 'Search officer name, designation, district...'
                : 'Search GATC centre, ID, location, contact...'
            }
            className="w-full rounded-xl border border-[#CFE5F5] bg-white pl-9 pr-3 py-1.5 text-xs text-[#123F63] focus:outline-none focus:ring-2 focus:ring-[#2F8FCC]"
          />
        </div>
        <span className="text-xs text-[#527290] hidden sm:inline">
          Showing {activeTab === 'officers' ? filteredOfficers.length : filteredGATCs.length} entities
        </span>
      </div>

      {/* Tables (Section 27) */}
      {activeTab === 'officers' ? (
        <div className="rounded-3xl card-neutral-blue shadow-soft-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-[#EDF8FE] border-b border-[#CFE5F5] text-[#527290] font-semibold uppercase tracking-wider text-[11px]">
                  <th className="py-3.5 px-4 font-semibold">Officer Name</th>
                  <th className="py-3.5 px-3 font-semibold">Employee ID</th>
                  <th className="py-3.5 px-3 font-semibold">Designation</th>
                  <th className="py-3.5 px-3 font-semibold">Jurisdiction District</th>
                  <th className="py-3.5 px-3 font-semibold text-center">Active Assigned</th>
                  <th className="py-3.5 px-3 font-semibold text-center">Completed</th>
                  <th className="py-3.5 px-3 font-semibold text-center">Pending</th>
                  <th className="py-3.5 px-4 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2EEF7]">
                {filteredOfficers.map((off) => (
                  <tr key={off.id} className="hover:bg-[#EDF8FE]/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#2F8FCC] text-white text-xs font-bold shadow-xs">
                          {off.avatarInitials}
                        </div>
                        <div>
                          <p className="font-bold text-[#123F63]">{off.name}</p>
                          <p className="text-[11px] text-[#627B94]">{off.email}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-3 font-mono font-medium text-[#1E75AC]">
                      {off.employeeId}
                    </td>

                    <td className="py-3.5 px-3 font-medium text-[#123F63]">
                      {off.designation}
                    </td>

                    <td className="py-3.5 px-3">
                      <p className="font-semibold text-[#123F63]">{off.district}</p>
                      <p className="text-[10px] text-[#7A93A8]">{off.state}</p>
                    </td>

                    <td className="py-3.5 px-3 text-center font-bold text-[#1E75AC]">
                      {off.activeAssignments}
                    </td>

                    <td className="py-3.5 px-3 text-center font-bold text-[#1E8E5A]">
                      {off.completedVerifications}
                    </td>

                    <td className="py-3.5 px-3 text-center font-bold text-[#B86C0B]">
                      {off.pendingTasks}
                    </td>

                    <td className="py-3.5 px-4">
                      <StatusBadge status={off.status} size="sm" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="rounded-3xl card-neutral-blue shadow-soft-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-[#EDF8FE] border-b border-[#CFE5F5] text-[#527290] font-semibold uppercase tracking-wider text-[11px]">
                  <th className="py-3.5 px-4 font-semibold">Testing Centre Name</th>
                  <th className="py-3.5 px-3 font-semibold">Centre ID</th>
                  <th className="py-3.5 px-3 font-semibold">Location & District</th>
                  <th className="py-3.5 px-3 font-semibold">Contact Person</th>
                  <th className="py-3.5 px-3 font-semibold text-center">Assigned</th>
                  <th className="py-3.5 px-3 font-semibold text-center">Completed</th>
                  <th className="py-3.5 px-3 font-semibold text-center">Pending</th>
                  <th className="py-3.5 px-4 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2EEF7]">
                {filteredGATCs.map((gatc) => (
                  <tr key={gatc.id} className="hover:bg-[#EDF8FE]/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-[#123F63]">{gatc.centreName}</p>
                      <p className="text-[11px] text-[#627B94]">Accredited till {gatc.accreditationValidUntil}</p>
                    </td>

                    <td className="py-3.5 px-3 font-mono font-medium text-[#1E75AC]">
                      {gatc.centreId}
                    </td>

                    <td className="py-3.5 px-3">
                      <p className="font-semibold text-[#123F63]">{gatc.district}, {gatc.state}</p>
                      <p className="text-[10px] text-[#7A93A8]">{gatc.location}</p>
                    </td>

                    <td className="py-3.5 px-3">
                      <p className="font-medium text-[#123F63]">{gatc.contactPerson}</p>
                      <p className="text-[10px] text-[#7A93A8]">{gatc.phone}</p>
                    </td>

                    <td className="py-3.5 px-3 text-center font-bold text-[#1E75AC]">
                      {gatc.assignedCount}
                    </td>

                    <td className="py-3.5 px-3 text-center font-bold text-[#1E8E5A]">
                      {gatc.completedCount}
                    </td>

                    <td className="py-3.5 px-3 text-center font-bold text-[#B86C0B]">
                      {gatc.pendingCount}
                    </td>

                    <td className="py-3.5 px-4">
                      <StatusBadge status={gatc.status} size="sm" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
