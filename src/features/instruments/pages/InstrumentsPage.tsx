import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Scale,
  Plus,
  Download,
  Search,
  Eye,
  RotateCcw,
} from 'lucide-react';
import { mockInstruments } from '../../../data/mockInstruments';
import { StatusBadge } from '../../../components/common/StatusBadge';
import { RegisterInstrumentModal } from '../components/RegisterInstrumentModal';
import { InstrumentStatus } from '../../../types';

export const InstrumentsPage: React.FC = () => {
  const navigate = useNavigate();
  const [registerModalOpen, setRegisterModalOpen] = useState(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedState, setSelectedState] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState<InstrumentStatus | 'All'>('All');
  const [selectedManufacturer, setSelectedManufacturer] = useState('All');

  // Manufacturers list
  const manufacturers = useMemo(() => {
    return Array.from(new Set(mockInstruments.map((i) => i.manufacturer)));
  }, []);

  const filteredInstruments = useMemo(() => {
    return mockInstruments.filter((inst) => {
      if (selectedStatus !== 'All' && inst.status !== selectedStatus) return false;
      if (selectedType !== 'All' && inst.type !== selectedType) return false;
      if (selectedState !== 'All' && inst.state !== selectedState) return false;
      if (selectedManufacturer !== 'All' && inst.manufacturer !== selectedManufacturer) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (
          inst.id.toLowerCase().includes(q) ||
          inst.serialNumber.toLowerCase().includes(q) ||
          inst.businessName.toLowerCase().includes(q) ||
          inst.ownerName.toLowerCase().includes(q) ||
          inst.model.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [selectedStatus, selectedType, selectedState, selectedManufacturer, searchQuery]);

  const handleExportCSV = () => {
    const headers = ['Instrument ID', 'Type', 'Manufacturer', 'Model', 'Serial Number', 'Owner', 'Business', 'District', 'State', 'Status'];
    const rows = filteredInstruments.map((i) => [
      i.id,
      i.type,
      `"${i.manufacturer}"`,
      `"${i.model}"`,
      i.serialNumber,
      `"${i.ownerName}"`,
      `"${i.businessName}"`,
      i.district,
      i.state,
      i.status,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `LMV_Instruments_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedType('All');
    setSelectedState('All');
    setSelectedStatus('All');
    setSelectedManufacturer('All');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header (Section 16) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 card-greeting p-6 sm:p-8 rounded-3xl shadow-soft-card">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#D5EEFB] text-[#1E75AC] border border-[#BDE0F7] shadow-xs">
              <Scale className="h-5 w-5" />
            </div>
            <div>
              <h1 className="font-outfit text-xl sm:text-2xl font-extrabold text-[#123F63]">
                Instruments
              </h1>
              <p className="text-xs text-[#527290]">
                Registered weighing and measuring instruments repository across India
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-2 rounded-2xl bg-white border border-[#CFE5F5] text-[#123F63] px-4 py-2.5 text-xs sm:text-sm font-bold shadow-xs hover:bg-[#EDF8FE] transition-all cursor-pointer"
          >
            <Download className="h-4 w-4 text-[#1E75AC]" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => setRegisterModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-2xl bg-[#2F8FCC] hover:bg-[#1E75AC] text-white px-5 py-2.5 text-xs sm:text-sm font-bold shadow-soft transition-all cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>+ Register Instrument</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar (Section 16) */}
      <div className="card-neutral-blue p-5 rounded-3xl shadow-soft-card space-y-3">
        <div className="flex flex-col lg:flex-row lg:items-center gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="h-4 w-4 absolute left-3.5 top-3 text-[#7A93A8]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by instrument ID or serial number..."
              className="w-full rounded-2xl border border-[#CFE5F5] bg-white pl-10 pr-4 py-2 text-xs sm:text-sm text-[#123F63] focus:outline-hidden focus:ring-2 focus:ring-[#2F8FCC]"
            />
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {/* Status */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as any)}
              className="rounded-xl border border-[#CFE5F5] bg-white px-3 py-2 text-xs text-[#123F63] font-medium focus:ring-2 focus:ring-[#2F8FCC]"
            >
              <option value="All">All Statuses</option>
              <option value="Registered">Registered</option>
              <option value="Pending Verification">Pending Verification</option>
              <option value="Verified">Verified</option>
              <option value="Expiring Soon">Expiring Soon</option>
              <option value="Expired">Expired</option>
              <option value="Suspended">Suspended</option>
              <option value="Identification Pending">Identification Pending</option>
            </select>

            {/* Type */}
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="rounded-xl border border-[#CFE5F5] bg-white px-3 py-2 text-xs text-[#123F63] font-medium focus:ring-2 focus:ring-[#2F8FCC]"
            >
              <option value="All">All Types</option>
              <option value="Electronic Weighing Scale">Electronic Weighing Scale</option>
              <option value="Platform Scale">Platform Scale</option>
              <option value="Fuel Dispenser">Fuel Dispenser</option>
              <option value="Weighbridge">Weighbridge</option>
              <option value="Analytical Balance">Analytical Balance</option>
              <option value="Mechanical Counter Scale">Mechanical Counter Scale</option>
              <option value="Measuring Instrument">Measuring Instrument</option>
            </select>

            {/* State */}
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="rounded-xl border border-[#CFE5F5] bg-white px-3 py-2 text-xs text-[#123F63] font-medium focus:ring-2 focus:ring-[#2F8FCC]"
            >
              <option value="All">All States</option>
              <option value="Madhya Pradesh">Madhya Pradesh</option>
              <option value="Maharashtra">Maharashtra</option>
              <option value="Karnataka">Karnataka</option>
              <option value="Delhi">Delhi</option>
              <option value="Gujarat">Gujarat</option>
              <option value="Tamil Nadu">Tamil Nadu</option>
              <option value="Rajasthan">Rajasthan</option>
            </select>

            {/* Manufacturer */}
            <select
              value={selectedManufacturer}
              onChange={(e) => setSelectedManufacturer(e.target.value)}
              className="rounded-xl border border-[#CFE5F5] bg-white px-3 py-2 text-xs text-[#123F63] font-medium max-w-[150px] focus:ring-2 focus:ring-[#2F8FCC]"
            >
              <option value="All">All Manufacturers</option>
              {manufacturers.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>

            <button
              onClick={handleResetFilters}
              className="p-2 rounded-xl text-[#7A93A8] hover:text-[#123F63] hover:bg-[#EDF8FE] transition-colors cursor-pointer"
              title="Reset Filters"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-[#527290] pt-1">
          <span>Found {filteredInstruments.length} instruments</span>
          <span className="text-[11px]">Click an instrument to inspect full lifecycle & technical details</span>
        </div>
      </div>

      {/* Instruments Table (Section 16) */}
      <div className="rounded-3xl card-neutral-blue shadow-soft-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#EDF8FE] border-b border-[#CFE5F5] text-[#527290] font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-4 font-semibold">Instrument ID</th>
                <th className="py-3.5 px-3 font-semibold">Type & Specs</th>
                <th className="py-3.5 px-3 font-semibold">Manufacturer & Model</th>
                <th className="py-3.5 px-3 font-semibold">Serial Number</th>
                <th className="py-3.5 px-3 font-semibold">Owner & Location</th>
                <th className="py-3.5 px-3 font-semibold">Last Verified</th>
                <th className="py-3.5 px-3 font-semibold">Valid Until</th>
                <th className="py-3.5 px-3 font-semibold">Status</th>
                <th className="py-3.5 px-4 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2EEF7]">
              {filteredInstruments.map((inst) => (
                <tr
                  key={inst.id}
                  className="hover:bg-[#EDF8FE]/80 transition-colors cursor-pointer group"
                  onClick={() => navigate(`/instruments/${inst.id}`)}
                >
                  <td className="py-3.5 px-4 font-mono font-bold text-[#1E75AC]">
                    {inst.id}
                  </td>

                  <td className="py-3.5 px-3">
                    <p className="font-semibold text-[#123F63]">
                      {inst.type}
                    </p>
                    <p className="text-[11px] text-[#627B94]">
                      {inst.capacity} • {inst.accuracyClass.split(' ')[0]}
                    </p>
                  </td>

                  <td className="py-3.5 px-3">
                    <p className="font-medium text-[#123F63]">
                      {inst.manufacturer}
                    </p>
                    <p className="text-[11px] text-[#627B94]">{inst.model}</p>
                  </td>

                  <td className="py-3.5 px-3 font-mono font-medium text-[#527290]">
                    {inst.nameplateDamaged ? (
                      <span className="text-[10px] bg-[#FFF7E8] text-[#B86C0B] border border-[#FCE3BA] px-1.5 py-0.5 rounded-sm font-semibold">
                        Damaged Plate
                      </span>
                    ) : (
                      inst.serialNumber
                    )}
                  </td>

                  <td className="py-3.5 px-3">
                    <p className="font-semibold text-[#123F63] truncate max-w-[160px]">
                      {inst.businessName}
                    </p>
                    <p className="text-[11px] text-[#627B94]">
                      {inst.district}, {inst.state}
                    </p>
                  </td>

                  <td className="py-3.5 px-3 font-medium text-[#527290]">
                    {inst.lastVerifiedDate}
                  </td>

                  <td className="py-3.5 px-3 font-medium">
                    <span
                      className={
                        inst.status === 'Expired'
                          ? 'text-[#D95C59] font-bold'
                          : inst.status === 'Expiring Soon'
                          ? 'text-[#B86C0B] font-bold'
                          : 'text-[#123F63]'
                      }
                    >
                      {inst.validUntilDate}
                    </span>
                  </td>

                  <td className="py-3.5 px-3">
                    <StatusBadge status={inst.status} size="sm" />
                  </td>

                  <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => navigate(`/instruments/${inst.id}`)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white border border-[#CFE5F5] hover:bg-[#EDF8FE] text-[#123F63] font-bold text-[11px] transition-colors shadow-xs"
                    >
                      <Eye className="h-3 w-3 text-[#1E75AC]" />
                      <span>Details</span>
                    </button>
                  </td>
                </tr>
              ))}

              {filteredInstruments.length === 0 && (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-[#7A93A8] text-sm">
                    No instruments match the selected search or filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Register Instrument Modal */}
      <RegisterInstrumentModal
        isOpen={registerModalOpen}
        onClose={() => setRegisterModalOpen(false)}
        onRegistered={(inst) => navigate(`/instruments/${inst.id}`)}
      />
    </div>
  );
};
