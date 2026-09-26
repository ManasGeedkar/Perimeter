import React, { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Award,
  Search,
  Filter,
  Eye,
  Download,
  Printer,
  QrCode,
  ShieldCheck,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';
import { mockCertificates } from '../../data/mockCertificates';
import { StatusBadge } from '../../components/common/StatusBadge';
import { CertificateStatus } from '../../types';

export const CertificatesPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<CertificateStatus | 'All'>('All');

  const filteredCertificates = useMemo(() => {
    return mockCertificates.filter((cert) => {
      if (statusFilter !== 'All' && cert.status !== statusFilter) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (
          cert.id.toLowerCase().includes(q) ||
          cert.certificateNumber.toLowerCase().includes(q) ||
          cert.instrumentId.toLowerCase().includes(q) ||
          cert.ownerName.toLowerCase().includes(q) ||
          cert.businessName.toLowerCase().includes(q) ||
          cert.serialNumber.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [statusFilter, searchQuery]);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header (Section 24) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 card-greeting p-6 rounded-3xl border border-[#CCE3F3] shadow-soft-card">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#D4F6E5] text-[#1E8E5A] shadow-soft">
            <Award className="h-6 w-6" />
          </div>
          <div>
            <h1 className="font-outfit text-xl sm:text-2xl font-extrabold text-[#123F63]">
              Certificates
            </h1>
            <p className="text-xs text-[#527290]">
              Statutory verification certificates issued with cryptographic SHA-256 digital seals
            </p>
          </div>
        </div>

        <Link
          to="/certificates/verify"
          className="inline-flex items-center gap-2 rounded-2xl bg-[#2F8FCC] text-white px-5 py-2.5 text-xs sm:text-sm font-bold shadow-soft hover:bg-[#1E75AC] transition-all cursor-pointer"
        >
          <QrCode className="h-4 w-4" />
          <span>Verify QR Code</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="card-neutral-blue p-5 rounded-3xl border border-[#DCEAF4] shadow-soft-card space-y-3">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="h-4 w-4 absolute left-3.5 top-3 text-[#8AA1B4]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by certificate ID, instrument, serial number, business name..."
              className="w-full rounded-2xl border border-[#CFE5F5] bg-white pl-10 pr-4 py-2 text-xs sm:text-sm text-[#123F63] placeholder:text-[#8AA1B4] focus:outline-hidden focus:ring-2 focus:ring-[#2F8FCC]"
            />
          </div>

          <div className="flex items-center gap-2 text-xs w-full sm:w-auto">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="rounded-xl border border-[#CFE5F5] bg-white px-3 py-2 text-xs text-[#123F63] font-medium w-full sm:w-44 focus:ring-2 focus:ring-[#2F8FCC] focus:outline-none"
            >
              <option value="All">All Statuses</option>
              <option value="VALID">VALID</option>
              <option value="EXPIRED">EXPIRED</option>
              <option value="REVOKED">REVOKED</option>
            </select>

            <button
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('All');
              }}
              className="p-2 rounded-xl text-[#527290] hover:text-[#123F63] hover:bg-[#E2F0F9] transition-colors cursor-pointer"
              title="Reset Filters"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-[#527290] pt-1">
          <span>Found {filteredCertificates.length} certificates</span>
          <span>Click any certificate to preview official legal certificate document</span>
        </div>
      </div>

      {/* Certificates Table (Section 24) */}
      <div className="rounded-3xl card-neutral-blue border border-[#DCEAF4] shadow-soft-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#EDF8FE] border-b border-[#CFE5F5] text-[#123F63] font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-4 font-bold">Certificate ID</th>
                <th className="py-3.5 px-3 font-bold">Instrument ID</th>
                <th className="py-3.5 px-3 font-bold">Owner & Establishment</th>
                <th className="py-3.5 px-3 font-bold">Issued Date</th>
                <th className="py-3.5 px-3 font-bold">Valid Until</th>
                <th className="py-3.5 px-3 font-bold">Verified By</th>
                <th className="py-3.5 px-3 font-bold">Status</th>
                <th className="py-3.5 px-4 text-right font-bold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DCEAF4]">
              {filteredCertificates.map((cert) => (
                <tr
                  key={cert.id}
                  className="hover:bg-[#EDF8FE]/80 transition-colors cursor-pointer group"
                  onClick={() => navigate(`/certificates/${cert.id}`)}
                >
                  <td className="py-3.5 px-4">
                    <span className="font-mono font-bold text-[#2F8FCC]">
                      {cert.id}
                    </span>
                    <span className="text-[10px] text-[#527290] block font-mono">
                      {cert.certificateNumber}
                    </span>
                  </td>

                  <td className="py-3.5 px-3 font-mono font-medium text-[#123F63]">
                    {cert.instrumentId}
                  </td>

                  <td className="py-3.5 px-3">
                    <p className="font-semibold text-[#123F63] truncate max-w-[170px]">
                      {cert.businessName}
                    </p>
                    <p className="text-[11px] text-[#527290]">
                      {cert.ownerName} ({cert.location.district})
                    </p>
                  </td>

                  <td className="py-3.5 px-3 text-[#527290]">
                    {cert.issueDate}
                  </td>

                  <td className="py-3.5 px-3 font-medium">
                    <span
                      className={
                        cert.status === 'EXPIRED'
                          ? 'text-[#C7493A] font-bold'
                          : cert.daysRemaining !== undefined && cert.daysRemaining <= 30
                          ? 'text-[#B86C0B] font-bold'
                          : 'text-[#123F63]'
                      }
                    >
                      {cert.validUntil}
                    </span>
                  </td>

                  <td className="py-3.5 px-3">
                    <p className="font-medium text-[#123F63]">
                      {cert.verifiedByOfficerName}
                    </p>
                    <p className="text-[10px] text-[#527290]">{cert.officerDesignation}</p>
                  </td>

                  <td className="py-3.5 px-3">
                    <StatusBadge status={cert.status} size="sm" />
                  </td>

                  <td className="py-3.5 px-4 text-right space-x-1" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => navigate(`/certificates/${cert.id}`)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-[#CFE5F5] hover:bg-[#EDF8FE] hover:text-[#2F8FCC] text-[#123F63] font-bold text-[11px] transition-colors cursor-pointer"
                      title="View Details"
                    >
                      <Eye className="h-3 w-3" />
                      <span>View</span>
                    </button>

                    <button
                      onClick={() => navigate(`/public/verify/${cert.id}`)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#EDF8FE] border border-[#CFE5F5] hover:bg-[#E2F0F9] text-[#2F8FCC] font-bold text-[11px] transition-colors cursor-pointer"
                      title="Verify QR"
                    >
                      <QrCode className="h-3 w-3" />
                      <span>QR</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
