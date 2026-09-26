import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Scale,
  Plus,
  ArrowRight,
  Search,
} from 'lucide-react';
import { mockInstruments } from '../../../data/mockInstruments';
import { StatusBadge } from '../../../components/common/StatusBadge';
import { RegisterInstrumentModal } from '../components/RegisterInstrumentModal';

export const MyInstrumentsPage: React.FC = () => {
  const navigate = useNavigate();
  const [registerModalOpen, setRegisterModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Business owner user's instruments (clean cards)
  const instruments = mockInstruments.filter((inst) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      inst.id.toLowerCase().includes(q) ||
      inst.serialNumber.toLowerCase().includes(q) ||
      inst.type.toLowerCase().includes(q) ||
      inst.manufacturer.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in duration-200 font-sans">
      {/* Header (Section 10) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 card-greeting p-6 sm:p-8 rounded-3xl border shadow-soft-card">
        <div>
          <h1 className="font-outfit text-2xl sm:text-3xl font-extrabold text-[#123F63]">
            My Instruments
          </h1>
          <p className="text-xs sm:text-sm text-[#627B94] mt-1">
            Registered weighing and measuring devices installed at your shop
          </p>
        </div>

        <button
          onClick={() => setRegisterModalOpen(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-[#2F8FCC] hover:bg-[#1E75AC] active:scale-[0.98] text-white px-5 py-2.5 text-xs sm:text-sm font-bold shadow-soft transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-[#2F8FCC]"
        >
          <Plus className="h-4 w-4" />
          <span>+ Add Instrument</span>
        </button>
      </div>

      {/* Quick Search */}
      <div className="relative">
        <Search className="h-4 w-4 absolute left-4 top-3.5 text-[#627B94]" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by instrument name, serial number, model..."
          className="w-full rounded-xl border border-[#DCEAF4] bg-white pl-11 pr-4 py-3 text-xs sm:text-sm text-[#123F63] shadow-soft-card focus:outline-none focus:ring-2 focus:ring-[#2F8FCC]/20 focus:border-[#2F8FCC]"
        />
      </div>

      {/* Instruments Displayed as Pastel Sky Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {instruments.map((inst) => (
          <div
            key={inst.id}
            className="rounded-3xl card-sky p-6 border shadow-soft-card space-y-4 hover:border-[#2F8FCC]/60 hover:-translate-y-0.5 transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="h-11 w-11 rounded-2xl bg-[#D5EEFB] text-[#1E75AC] flex items-center justify-center shrink-0 shadow-2xs">
                    <Scale className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-outfit text-base font-bold text-[#123F63]">
                      {inst.type}
                    </h3>
                    <p className="text-xs text-[#627B94]">
                      {inst.capacity} • {inst.unit}
                    </p>
                  </div>
                </div>
                <StatusBadge status={inst.status} size="sm" />
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                <div>
                  <span className="text-[#627B94] block text-[10px]">Manufacturer</span>
                  <span className="font-semibold text-[#16466F]">
                    {inst.manufacturer}
                  </span>
                </div>
                <div>
                  <span className="text-[#627B94] block text-[10px]">Model</span>
                  <span className="font-semibold text-[#16466F]">
                    {inst.model}
                  </span>
                </div>
                <div>
                  <span className="text-[#627B94] block text-[10px]">Serial Number</span>
                  <span className="font-mono font-semibold text-[#16466F]">
                    {inst.serialNumber}
                  </span>
                </div>
                <div>
                  <span className="text-[#627B94] block text-[10px]">Location</span>
                  <span className="font-semibold text-[#16466F] truncate block">
                    {inst.district}, {inst.state}
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-[#CFE5F5] flex items-center justify-between text-xs">
                <span className="text-[#627B94]">
                  Valid Until: <strong className="text-[#123F63]">{inst.validUntilDate || 'Pending Verification'}</strong>
                </span>
                <span className="font-mono text-[10px] text-[#1E75AC] font-bold">
                  {inst.id}
                </span>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between gap-2">
              <button
                onClick={() => navigate(`/my-instruments/${inst.id}`)}
                className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl border border-[#CFE5F5] bg-white hover:bg-[#D5EEFB] hover:border-[#2F8FCC] hover:text-[#123F63] active:scale-[0.98] text-[#16466F] px-4 py-2.5 text-xs font-bold transition-all shadow-xs cursor-pointer focus-visible:outline-2 focus-visible:outline-[#2F8FCC]"
              >
                <span>View Details</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Register Instrument Modal */}
      <RegisterInstrumentModal
        isOpen={registerModalOpen}
        onClose={() => setRegisterModalOpen(false)}
        onRegistered={() => setRegisterModalOpen(false)}
      />
    </div>
  );
};
