import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  History,
  CheckCircle2,
  XCircle,
  Award,
  Search,
  Calendar,
  Building2,
  Scale,
  MapPin,
  ExternalLink,
} from 'lucide-react';

export const OfficerHistoryPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const historyRecords = [
    {
      id: 'INS-2026-0881',
      date: '2026-09-17',
      business: 'Malwa Agro Industries',
      instrument: 'Electronic Weighbridge (50 Ton)',
      instrumentId: 'INST-2026-004',
      result: 'PASS',
      certificateId: 'CERT-2026-000840',
      location: 'Sanwer Road, Indore',
    },
    {
      id: 'INS-2026-0879',
      date: '2026-09-16',
      business: 'Shree Krishna Sweets',
      instrument: 'Electronic Counter Scale (10 kg)',
      instrumentId: 'INST-2026-001',
      result: 'PASS',
      certificateId: 'CERT-2026-000839',
      location: 'Chhappan Dukan, Indore',
    },
    {
      id: 'INS-2026-0874',
      date: '2026-09-15',
      business: 'Gupta Hardware & Paints',
      instrument: 'Platform Scale (300 kg)',
      instrumentId: 'INST-2026-007',
      result: 'FAIL',
      certificateId: null,
      reason: 'Lead calibration seal broken and zero error exceeded MPE by 120g.',
      location: 'Loha Mandi, Indore',
    },
    {
      id: 'INS-2026-0868',
      date: '2026-09-12',
      business: 'Indore Central Cold Storage',
      instrument: 'Dormant Platform Scale (1000 kg)',
      instrumentId: 'INST-2026-012',
      result: 'PASS',
      certificateId: 'CERT-2026-000835',
      location: 'Rau Bypass, Indore',
    },
  ];

  const filtered = historyRecords.filter((rec) => {
    if (!searchTerm.trim()) return true;
    const q = searchTerm.toLowerCase();
    return (
      rec.business.toLowerCase().includes(q) ||
      rec.instrument.toLowerCase().includes(q) ||
      rec.id.toLowerCase().includes(q) ||
      (rec.certificateId && rec.certificateId.toLowerCase().includes(q))
    );
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header Banner */}
      <div className="card-greeting rounded-3xl p-6 sm:p-8 shadow-soft-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-outfit text-2xl sm:text-3xl font-extrabold text-[#123F63]">
            Verification History
          </h1>
          <p className="text-[#527290] text-sm mt-1">
            Audit trail of legal metrology inspections conducted by your badge.
          </p>
        </div>

        <div className="relative min-w-[260px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#7A93A8]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search past records..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-[#CFE5F5] text-xs font-medium text-[#123F63] focus:outline-none focus:ring-2 focus:ring-[#2F8FCC]"
          />
        </div>
      </div>

      <div className="space-y-3.5">
        {filtered.map((rec) => {
          const isPass = rec.result === 'PASS';
          return (
            <div
              key={rec.id}
              className={`${
                isPass ? 'card-mint' : 'card-amber'
              } rounded-3xl p-5 shadow-soft-card hover:shadow-hover transition-all flex flex-col md:flex-row md:items-center justify-between gap-4`}
            >
              <div className="space-y-1.5">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="font-mono text-xs font-bold text-[#627B94]">{rec.id}</span>
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 border ${
                      isPass
                        ? 'bg-[#EFFAF4] text-[#1E8E5A] border-[#CDEFE0]'
                        : 'bg-[#FCECEC] text-[#A62F2C] border-[#F8C8C6]'
                    }`}
                  >
                    {isPass ? (
                      <CheckCircle2 className="h-3 w-3" />
                    ) : (
                      <XCircle className="h-3 w-3" />
                    )}
                    <span>{rec.result}</span>
                  </span>
                  <span className="text-xs text-[#7A93A8] flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    {rec.date}
                  </span>
                </div>

                <h3 className="font-outfit text-base font-bold text-[#123F63] flex items-center gap-2">
                  <div className="p-1 rounded-md bg-[#D5EEFB] text-[#1E75AC]">
                    <Building2 className="h-4 w-4" />
                  </div>
                  {rec.business}
                </h3>

                <div className="flex flex-wrap items-center gap-3 text-xs text-[#527290]">
                  <span className="flex items-center gap-1">
                    <Scale className="h-3.5 w-3.5 text-[#7A93A8]" />
                    {rec.instrument}
                  </span>
                  <span className="text-[#A2B6C6]">•</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 text-[#7A93A8]" />
                    {rec.location}
                  </span>
                </div>

                {rec.reason && (
                  <p className="text-xs text-[#A62F2C] bg-white/70 p-2.5 rounded-xl border border-[#F8C8C6] mt-1">
                    Rejection Note: {rec.reason}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2 self-end md:self-center">
                {rec.certificateId ? (
                  <Link
                    to={`/my-certificates/${rec.certificateId}`}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-[#CDEFE0] text-[#1E8E5A] font-bold text-xs hover:bg-[#D4F6E5] transition-colors shadow-xs"
                  >
                    <Award className="h-3.5 w-3.5" />
                    <span>View Certificate</span>
                  </Link>
                ) : (
                  <span className="text-xs font-bold text-[#A62F2C] px-3 py-1.5 bg-white/60 rounded-xl border border-[#F8C8C6]">
                    Notice Served
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
