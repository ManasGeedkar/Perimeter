import React, { useState } from 'react';
import {
  BarChart3,
  FileSpreadsheet,
  Download,
  Printer,
  FileText,
  Calendar,
  CheckCircle2,
  TrendingUp,
  Filter,
  PieChart as PieChartIcon,
  Eye,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { mockDashboardData } from '../../data/mockDashboard';

export const ReportsPage: React.FC = () => {
  const [selectedReport, setSelectedReport] = useState('summary');
  const [dateRange, setDateRange] = useState('FY 2025-2026');

  const reportCards = [
    {
      id: 'summary',
      title: 'Verification Summary Report',
      description: 'Comprehensive audit output across all registered instruments and certificates.',
      category: 'Executive Overview',
      totalRecords: '12,482 instruments',
      lastUpdated: 'Today 09:30 IST',
    },
    {
      id: 'pending',
      title: 'Pending Applications Audit',
      description: 'Overdue schedules, applications awaiting officer assignment, and fee verification.',
      category: 'Operational',
      totalRecords: '324 pending',
      lastUpdated: '1 hour ago',
    },
    {
      id: 'officers',
      title: 'Officer Performance & Workload',
      description: 'Monthly quotas, physical inspection turnaround times, and pass/fail ratios by LMO.',
      category: 'Personnel',
      totalRecords: '10 Officers / 6 GATCs',
      lastUpdated: 'Yesterday',
    },
    {
      id: 'expiry',
      title: 'Certificate Expiry Forecast',
      description: 'Projections of expiring instruments in 30, 60, and 90-day warning horizons.',
      category: 'Compliance',
      totalRecords: '184 expiring soon',
      lastUpdated: 'Today 06:00 IST',
    },
    {
      id: 'regional',
      title: 'State-wise Verification Matrix',
      description: 'Jurisdictional compliance rates, revenue collection, and circle flying squad actions.',
      category: 'Regional',
      totalRecords: '7 Primary States',
      lastUpdated: '2 days ago',
    },
    {
      id: 'passfail',
      title: 'Pass / Fail & MPE Tolerance Analysis',
      description: 'Breakdown of failed instruments, strain gauge faults, and lead seal tampering cases.',
      category: 'Quality Assurance',
      totalRecords: '382 rejections logged',
      lastUpdated: 'Today',
    },
  ];

  const handleExport = (type: 'pdf' | 'excel' | 'print') => {
    if (type === 'print') {
      window.print();
    } else {
      alert(`Generating official ${type.toUpperCase()} report export for "${selectedReport}"... Download will start automatically.`);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header (Section 28) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 card-greeting p-6 sm:p-8 rounded-3xl shadow-soft-card">
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#D5EEFB] text-[#1E75AC] border border-[#BDE0F7] shadow-xs">
            <BarChart3 className="h-5 w-5" />
          </div>
          <div>
            <h1 className="font-outfit text-xl sm:text-2xl font-extrabold text-[#123F63]">
              Reports & Analytics
            </h1>
            <p className="text-xs text-[#527290]">
              Statutory verification intelligence, compliance summaries, and official exports
            </p>
          </div>
        </div>

        {/* Global Export Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => handleExport('excel')}
            className="inline-flex items-center gap-1.5 rounded-2xl bg-white border border-[#CFE5F5] text-[#123F63] px-3.5 py-2 text-xs font-bold shadow-xs hover:bg-[#EDF8FE] transition-all cursor-pointer"
          >
            <FileSpreadsheet className="h-4 w-4 text-[#1E8E5A]" />
            <span>Export Excel</span>
          </button>

          <button
            onClick={() => handleExport('pdf')}
            className="inline-flex items-center gap-1.5 rounded-2xl bg-white border border-[#CFE5F5] text-[#123F63] px-3.5 py-2 text-xs font-bold shadow-xs hover:bg-[#EDF8FE] transition-all cursor-pointer"
          >
            <Download className="h-4 w-4 text-[#1E75AC]" />
            <span>Export PDF</span>
          </button>

          <button
            onClick={() => handleExport('print')}
            className="inline-flex items-center gap-1.5 rounded-2xl bg-[#2F8FCC] hover:bg-[#1E75AC] text-white px-4 py-2 text-xs font-bold shadow-soft transition-all cursor-pointer"
          >
            <Printer className="h-4 w-4" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* Report Cards Grid (Section 28) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {reportCards.map((rep, idx) => {
          const isSelected = selectedReport === rep.id;
          // Apply pastel cards
          const cardClasses = [
            'card-sky',
            'card-lavender',
            'card-neutral-blue',
            'card-amber',
            'card-mint',
            'card-sky',
          ][idx % 6];

          return (
            <div
              key={rep.id}
              onClick={() => setSelectedReport(rep.id)}
              className={`p-5 rounded-3xl cursor-pointer transition-all duration-200 shadow-soft-card flex flex-col justify-between ${cardClasses} ${
                isSelected
                  ? 'ring-2 ring-[#2F8FCC]'
                  : 'hover:shadow-hover'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/80 text-[#1E75AC] border border-[#CFE5F5] shadow-xs">
                    {rep.category}
                  </span>
                  <span className="text-[10px] text-[#7A93A8]">{rep.lastUpdated}</span>
                </div>

                <h3 className="font-outfit text-base font-bold text-[#123F63]">
                  {rep.title}
                </h3>

                <p className="text-xs text-[#527290] leading-relaxed">
                  {rep.description}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-black/5 flex items-center justify-between text-xs">
                <span className="font-bold text-[#123F63]">
                  {rep.totalRecords}
                </span>
                <span className="text-[#1E75AC] font-bold inline-flex items-center gap-1">
                  <span>{isSelected ? 'Viewing' : 'Select'}</span>
                  <span>→</span>
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Report Interactive Detail View */}
      <div className="rounded-3xl card-neutral-blue p-6 sm:p-8 shadow-soft-card space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#CFE5F5]">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-outfit text-xl font-bold text-[#123F63]">
                Active Report Preview: {reportCards.find((r) => r.id === selectedReport)?.title}
              </h2>
              <span className="text-xs bg-[#EFFAF4] text-[#1E8E5A] border border-[#CDEFE0] font-bold px-2.5 py-0.5 rounded-full">
                Certified
              </span>
            </div>
            <p className="text-xs text-[#627B94] mt-0.5">
              Compiled from automated National Metrology Grid records
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-[#627B94]">Date Range:</span>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="rounded-xl border border-[#CFE5F5] bg-white px-3 py-1.5 font-semibold text-[#123F63] focus:ring-2 focus:ring-[#2F8FCC]"
            >
              <option>FY 2025-2026</option>
              <option>Last 30 Days</option>
              <option>Current Quarter</option>
              <option>Previous Fiscal Year</option>
            </select>
          </div>
        </div>

        {/* Dynamic Visualizations based on report */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h4 className="font-outfit text-sm font-bold text-[#123F63]">
              Pass / Fail & Compliance Tolerance Breakdown
            </h4>
            <div className="h-60 w-full relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={mockDashboardData.passFailData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {mockDashboardData.passFailData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-outfit text-sm font-bold text-[#123F63]">
              State Verification Output Quota
            </h4>
            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mockDashboardData.stateWiseActivity}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2EEF7" />
                  <XAxis dataKey="state" tick={{ fontSize: 9, fill: '#627B94' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: '#627B94' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: '12px', fontSize: '11px', borderColor: '#CFE5F5' }} />
                  <Bar dataKey="verified" name="Verified Units" fill="#1E8E5A" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Summary Table */}
        <div className="border-t border-[#CFE5F5] pt-4">
          <h4 className="font-outfit text-sm font-bold text-[#123F63] mb-2">
            Executive Summary Key Metrics
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-2xl bg-white border border-[#CFE5F5] shadow-xs">
              <span className="text-[#627B94] block text-[10px]">Total Stamped</span>
              <span className="text-base font-bold text-[#1E8E5A]">10,921 Units</span>
            </div>
            <div className="p-3 rounded-2xl bg-white border border-[#CFE5F5] shadow-xs">
              <span className="text-[#627B94] block text-[10px]">Statutory Fee Collected</span>
              <span className="text-base font-bold text-[#1E75AC]">₹ 54,82,450</span>
            </div>
            <div className="p-3 rounded-2xl bg-white border border-[#CFE5F5] shadow-xs">
              <span className="text-[#627B94] block text-[10px]">Rejection Rate</span>
              <span className="text-base font-bold text-[#D95C59]">3.1%</span>
            </div>
            <div className="p-3 rounded-2xl bg-white border border-[#CFE5F5] shadow-xs">
              <span className="text-[#627B94] block text-[10px]">Avg Inspection Time</span>
              <span className="text-base font-bold text-[#123F63]">2.4 Days</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
