import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  QrCode,
  Search,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Building,
  User,
  Calendar,
  Scale,
  Camera,
  ExternalLink,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import { certificateService } from '../../services/certificateService';
import { Certificate, CertificateStatus } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';

export const QRVerifyPage: React.FC = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<{
    status: CertificateStatus;
    certificate?: Certificate;
    message: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleVerify = async (certIdToVerify?: string) => {
    const target = certIdToVerify || query;
    if (!target.trim()) return;

    setLoading(true);
    setResult(null);
    try {
      const res = await certificateService.verifyCertificate(target);
      setResult(res);
    } finally {
      setLoading(false);
    }
  };

  const simulateCameraScan = (sampleId: string) => {
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
      setQuery(sampleId);
      handleVerify(sampleId);
    }, 800);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-200">
      {/* Header */}
      <div className="card-greeting p-6 rounded-3xl border border-[#CCE3F3] shadow-soft-card text-center space-y-2">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#D5EEFB] text-[#1E75AC] shadow-soft">
          <QrCode className="h-6 w-6" />
        </div>
        <h1 className="font-outfit text-2xl font-extrabold text-[#123F63]">
          Certificate QR Verification
        </h1>
        <p className="text-xs text-[#527290] max-w-md mx-auto">
          Verify authentic Legal Metrology verification certificates and detect forged, expired, or revoked instruments.
        </p>
      </div>

      {/* Input / Scanner Card (Section 26) */}
      <div className="card-neutral-blue p-6 sm:p-8 rounded-3xl border border-[#DCEAF4] shadow-soft-card space-y-6">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleVerify();
          }}
          className="space-y-3"
        >
          <label className="text-xs font-bold uppercase tracking-wider text-[#527290] block">
            Enter Certificate ID or Scan Payload:
          </label>
          <div className="flex flex-col sm:flex-row gap-2.5">
            <div className="relative flex-1">
              <Search className="h-4 w-4 absolute left-3.5 top-3.5 text-[#8AA1B4]" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g. CERT-MP-2026-000821 or LMV/MP/IND/..."
                className="w-full rounded-2xl border border-[#CFE5F5] bg-white pl-10 pr-4 py-3 text-xs sm:text-sm font-mono text-[#123F63] placeholder:text-[#8AA1B4] focus:outline-hidden focus:ring-2 focus:ring-[#2F8FCC]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 rounded-2xl bg-[#2F8FCC] text-white font-bold text-xs sm:text-sm shadow-soft hover:bg-[#1E75AC] transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-60"
            >
              <span>{loading ? 'Verifying...' : 'Verify Certificate'}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </form>

        {/* Quick Demo Test Presets */}
        <div className="pt-2 border-t border-[#DCEAF4] space-y-2">
          <p className="text-[11px] font-bold text-[#527290] uppercase tracking-wider">
            Simulate QR Code Scans:
          </p>
          <div className="flex flex-wrap gap-2 text-xs">
            <button
              type="button"
              onClick={() => simulateCameraScan('CERT-MP-2026-000821')}
              className="px-3 py-1.5 rounded-xl card-mint text-[#1E8E5A] border border-[#CDEFE0] font-mono text-[11px] hover:bg-[#D4F6E5] transition-colors flex items-center gap-1 cursor-pointer"
            >
              <CheckCircle2 className="h-3.5 w-3.5 text-[#1E8E5A]" />
              <span>VALID: CERT-MP-2026-000821</span>
            </button>

            <button
              type="button"
              onClick={() => simulateCameraScan('CERT-KA-2025-004921')}
              className="px-3 py-1.5 rounded-xl card-amber text-[#B86C0B] border border-[#FCE3BA] font-mono text-[11px] hover:bg-[#FEEDC8] transition-colors flex items-center gap-1 cursor-pointer"
            >
              <AlertTriangle className="h-3.5 w-3.5 text-[#B86C0B]" />
              <span>EXPIRED: CERT-KA-2025-004921</span>
            </button>

            <button
              type="button"
              onClick={() => simulateCameraScan('CERT-AP-2025-008119')}
              className="px-3 py-1.5 rounded-xl bg-[#FDF0EF] text-[#C7493A] border border-[#FAD7D4] font-mono text-[11px] hover:bg-[#F9C7C2] transition-colors flex items-center gap-1 cursor-pointer"
            >
              <XCircle className="h-3.5 w-3.5 text-[#C7493A]" />
              <span>REVOKED: CERT-AP-2025-008119</span>
            </button>

            <button
              type="button"
              onClick={() => simulateCameraScan('FAKE-CERT-99999')}
              className="px-3 py-1.5 rounded-xl card-sky text-[#1E75AC] border border-[#CFE5F5] font-mono text-[11px] hover:bg-[#E2F0F9] transition-colors flex items-center gap-1 cursor-pointer"
            >
              <ShieldAlert className="h-3.5 w-3.5 text-[#1E75AC]" />
              <span>INVALID: FAKE-CERT-99999</span>
            </button>
          </div>
        </div>
      </div>

      {/* Verification Result Card (Section 26) */}
      {result && (
        <div
          className={`p-6 sm:p-8 rounded-3xl border shadow-soft-card animate-in zoom-in-95 duration-150 ${
            result.status === 'VALID'
              ? 'card-mint border-[#CDEFE0]'
              : result.status === 'EXPIRED'
              ? 'card-amber border-[#FCE3BA]'
              : result.status === 'REVOKED'
              ? 'bg-[#FDF0EF] border-[#FAD7D4]'
              : 'card-neutral-blue border-[#DCEAF4]'
          }`}
        >
          <div className="flex items-start gap-4">
            <div
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl shadow-xs text-white ${
                result.status === 'VALID'
                  ? 'bg-[#2EAD7B]'
                  : result.status === 'EXPIRED'
                  ? 'bg-[#E9A23B]'
                  : 'bg-[#D9534F]'
              }`}
            >
              {result.status === 'VALID' ? (
                <ShieldCheck className="h-7 w-7" />
              ) : result.status === 'EXPIRED' ? (
                <AlertTriangle className="h-7 w-7" />
              ) : (
                <XCircle className="h-7 w-7" />
              )}
            </div>

            <div className="space-y-1 flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-outfit text-xl font-bold text-[#123F63]">
                  {result.status === 'VALID'
                    ? 'Certificate Authentic & Valid'
                    : result.status === 'EXPIRED'
                    ? 'Certificate Expired'
                    : result.status === 'REVOKED'
                    ? 'Certificate Officially Revoked'
                    : 'Invalid Certificate Record'}
                </h3>
                <StatusBadge status={result.status} size="sm" />
              </div>

              <p className="text-xs text-[#527290]">
                {result.message}
              </p>
            </div>
          </div>

          {/* Details for Valid / Expired / Revoked */}
          {result.certificate && (
            <div className="mt-6 pt-5 border-t border-[#DCEAF4] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              <div className="space-y-0.5">
                <span className="text-[#8AA1B4] block text-[10px]">Instrument ID</span>
                <span className="font-mono font-bold text-[#123F63]">
                  {result.certificate.instrumentId}
                </span>
                <p className="text-[11px] text-[#527290]">{result.certificate.instrumentType}</p>
              </div>

              <div className="space-y-0.5">
                <span className="text-[#8AA1B4] block text-[10px]">Manufacturer & Model</span>
                <span className="font-semibold text-[#123F63]">
                  {result.certificate.manufacturer}
                </span>
                <p className="font-mono text-[11px] text-[#527290]">
                  SN: {result.certificate.serialNumber}
                </p>
              </div>

              <div className="space-y-0.5">
                <span className="text-[#8AA1B4] block text-[10px]">Establishment Owner</span>
                <span className="font-semibold text-[#123F63] truncate block">
                  {result.certificate.businessName}
                </span>
                <p className="text-[11px] text-[#527290]">{result.certificate.location.district}</p>
              </div>

              <div className="space-y-0.5">
                <span className="text-[#8AA1B4] block text-[10px]">Validity Period</span>
                <span className="font-bold text-[#123F63]">
                  {result.certificate.issueDate} → {result.certificate.validUntil}
                </span>
                <p className="text-[11px] text-[#527290]">
                  Verified by: {result.certificate.verifiedByOfficerName}
                </p>
              </div>
            </div>
          )}

          {result.certificate && (
            <div className="mt-4 pt-4 border-t border-[#DCEAF4] flex items-center justify-between">
              <span className="text-[11px] font-mono text-[#527290]">
                Security Hash: {result.certificate.securityStampHash.substring(0, 32)}...
              </span>
              <button
                onClick={() => navigate(`/certificates/${result.certificate?.id}`)}
                className="inline-flex items-center gap-1 text-xs font-bold text-[#2F8FCC] hover:text-[#1E75AC] hover:underline cursor-pointer"
              >
                <span>View Full Certificate Profile</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
