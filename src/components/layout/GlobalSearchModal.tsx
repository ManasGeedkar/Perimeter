import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Scale, FileText, Award, Building, ArrowRight, CornerDownLeft } from 'lucide-react';
import { mockInstruments } from '../../data/mockInstruments';
import { mockApplications } from '../../data/mockApplications';
import { mockCertificates } from '../../data/mockCertificates';
import { StatusBadge } from '../common/StatusBadge';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const q = query.trim().toLowerCase();

  const matchedInstruments = q
    ? mockInstruments.filter(
        (i) =>
          i.id.toLowerCase().includes(q) ||
          i.serialNumber.toLowerCase().includes(q) ||
          i.businessName.toLowerCase().includes(q) ||
          i.ownerName.toLowerCase().includes(q) ||
          i.type.toLowerCase().includes(q)
      ).slice(0, 4)
    : [];

  const matchedApplications = q
    ? mockApplications.filter(
        (a) =>
          a.id.toLowerCase().includes(q) ||
          a.instrumentId.toLowerCase().includes(q) ||
          a.businessName.toLowerCase().includes(q) ||
          a.applicantName.toLowerCase().includes(q)
      ).slice(0, 3)
    : [];

  const matchedCertificates = q
    ? mockCertificates.filter(
        (c) =>
          c.id.toLowerCase().includes(q) ||
          c.certificateNumber.toLowerCase().includes(q) ||
          c.instrumentId.toLowerCase().includes(q) ||
          c.businessName.toLowerCase().includes(q)
      ).slice(0, 3)
    : [];

  const handleSelect = (path: string) => {
    navigate(path);
    onClose();
    setQuery('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-16 sm:pt-24">
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full max-w-2xl rounded-3xl bg-white dark:bg-[#131E2C] shadow-soft-lg border border-[#E5EAF0] dark:border-[#1E293B] overflow-hidden z-10 transition-all animate-in zoom-in-95 duration-150">
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-[#E5EAF0] dark:border-[#1E293B]">
          <Search className="h-5 w-5 text-[#1769AA] shrink-0" />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search instrument, certificate, application, serial no, business..."
            className="w-full bg-transparent text-sm sm:text-base font-medium text-[#17324D] dark:text-slate-100 placeholder:text-slate-400 focus:outline-hidden"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-slate-400 hover:text-slate-600 rounded-full p-1"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <span className="hidden sm:inline-flex text-[11px] font-mono text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
            ESC
          </span>
        </div>

        {/* Results Body */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4">
          {!q && (
            <div className="py-6 text-center text-xs text-slate-600 dark:text-slate-400 space-y-2">
              <p>Type to search across registered instruments, verification applications, and certificates.</p>
              <div className="flex flex-wrap justify-center gap-2 pt-2">
                <button
                  onClick={() => setQuery('MP-IND')}
                  className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-mono text-[11px]"
                >
                  MP-IND-WT-2026-001284
                </button>
                <button
                  onClick={() => setQuery('Fuel Dispenser')}
                  className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-[11px]"
                >
                  Fuel Dispenser
                </button>
                <button
                  onClick={() => setQuery('CERT-')}
                  className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-[11px]"
                >
                  Certificates
                </button>
                <button
                  onClick={() => setQuery('Shree Ganesh')}
                  className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-[11px]"
                >
                  Shree Ganesh Agro
                </button>
              </div>
            </div>
          )}

          {q && (
            <>
              {/* Instruments */}
              {matchedInstruments.length > 0 && (
                <div>
                  <div className="flex items-center gap-1.5 px-3 py-1 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    <Scale className="h-3.5 w-3.5" />
                    <span>Instruments ({matchedInstruments.length})</span>
                  </div>
                  <div className="mt-1 space-y-1">
                    {matchedInstruments.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => handleSelect(`/instruments/${item.id}`)}
                        className="flex items-center justify-between p-3 rounded-2xl hover:bg-[#EAF3FA]/60 dark:hover:bg-slate-800/80 cursor-pointer transition-colors group"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-[#1769AA] dark:text-[#38BDF8]">
                              {item.id}
                            </span>
                            <StatusBadge status={item.status} size="sm" />
                          </div>
                          <p className="text-xs font-semibold text-[#17324D] dark:text-slate-200 truncate mt-0.5">
                            {item.businessName} — {item.type} ({item.capacity})
                          </p>
                          <p className="text-[11px] text-slate-600 dark:text-slate-400">
                            Serial: {item.serialNumber} • {item.district}, {item.state}
                          </p>
                        </div>
                        <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-[#1769AA] transition-transform group-hover:translate-x-1" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Applications */}
              {matchedApplications.length > 0 && (
                <div>
                  <div className="flex items-center gap-1.5 px-3 py-1 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    <FileText className="h-3.5 w-3.5" />
                    <span>Applications ({matchedApplications.length})</span>
                  </div>
                  <div className="mt-1 space-y-1">
                    {matchedApplications.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => handleSelect(`/applications/${item.id}`)}
                        className="flex items-center justify-between p-3 rounded-2xl hover:bg-[#EAF3FA]/60 dark:hover:bg-slate-800/80 cursor-pointer transition-colors group"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-[#1769AA] dark:text-[#38BDF8]">
                              {item.id}
                            </span>
                            <StatusBadge status={item.status} size="sm" />
                            {item.hasDamagedPlate && (
                              <span className="text-[10px] bg-amber-100 text-amber-800 font-semibold px-2 py-0.5 rounded-full">
                                Damaged Plate
                              </span>
                            )}
                          </div>
                          <p className="text-xs font-semibold text-[#17324D] dark:text-slate-200 truncate mt-0.5">
                            {item.businessName} • {item.verificationType}
                          </p>
                          <p className="text-[11px] text-slate-600 dark:text-slate-400">
                            Preferred: {item.preferredDate} • Submitted: {item.submittedDate}
                          </p>
                        </div>
                        <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-[#1769AA] transition-transform group-hover:translate-x-1" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Certificates */}
              {matchedCertificates.length > 0 && (
                <div>
                  <div className="flex items-center gap-1.5 px-3 py-1 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    <Award className="h-3.5 w-3.5" />
                    <span>Certificates ({matchedCertificates.length})</span>
                  </div>
                  <div className="mt-1 space-y-1">
                    {matchedCertificates.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => handleSelect(`/certificates/${item.id}`)}
                        className="flex items-center justify-between p-3 rounded-2xl hover:bg-[#EAF3FA]/60 dark:hover:bg-slate-800/80 cursor-pointer transition-colors group"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-[#1769AA] dark:text-[#38BDF8]">
                              {item.id}
                            </span>
                            <StatusBadge status={item.status} size="sm" />
                          </div>
                          <p className="text-xs font-semibold text-[#17324D] dark:text-slate-200 truncate mt-0.5">
                            {item.businessName} • {item.instrumentType}
                          </p>
                          <p className="text-[11px] text-slate-600 dark:text-slate-400">
                            Valid Until: {item.validUntil} • Verified by: {item.verifiedByOfficerName}
                          </p>
                        </div>
                        <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-[#1769AA] transition-transform group-hover:translate-x-1" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {matchedInstruments.length === 0 &&
                matchedApplications.length === 0 &&
                matchedCertificates.length === 0 && (
                  <div className="py-8 text-center text-sm text-slate-500">
                    No matching records found for "{query}".
                  </div>
                )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-[#E5EAF0] dark:border-[#1E293B] bg-[#F7F8F6]/60 dark:bg-slate-900/40 text-[11px] text-slate-500">
          <span>Search across National Metrology Grid</span>
          <div className="flex items-center gap-1.5">
            <CornerDownLeft className="h-3.5 w-3.5" />
            <span>Select to open profile</span>
          </div>
        </div>
      </div>
    </div>
  );
};
