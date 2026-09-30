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
import { QRScanner } from '../../components/common/QRScanner';

export const QRVerifyPage: React.FC = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [showScanner, setShowScanner] = useState(false);
  const [scanError, setScanError] = useState<string | null>(null);
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
    setScanError(null);
    
    try {
      // Validate perimeter certificate format if scanned from QR
      const isUrl = target.startsWith('http');
      let extractedId = target;
      
      if (isUrl) {
        // e.g. http://localhost:5173/public/verify/CERT-MP-2026-000821
        const parts = target.split('/');
        extractedId = parts[parts.length - 1];
      }
      
      const res = await certificateService.verifyCertificate(extractedId);
      
      // If it fails to verify and it was a scan, show safe error message instead of crashing
      if (!res) {
        setScanError('This QR code is not a valid Perimeter certificate.');
        return;
      }
      
      setQuery(extractedId);
      setResult(res);
      setShowScanner(false);
    } catch (err) {
      setScanError('This QR code is not a valid Perimeter certificate.');
    } finally {
      setLoading(false);
    }
  };

  const handleScanSuccess = (decodedText: string) => {
    handleVerify(decodedText);
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

        <div className="pt-4 border-t border-[#DCEAF4]">
          {!showScanner ? (
            <button
              type="button"
              onClick={() => {
                setShowScanner(true);
                setScanError(null);
                setResult(null);
              }}
              className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-white border-2 border-dashed border-[#2F8FCC] text-[#1E75AC] font-bold text-sm shadow-sm hover:bg-[#EDF8FE] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Camera className="h-5 w-5" />
              <span>Open Camera Scanner</span>
            </button>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-[#123F63] flex items-center gap-2">
                  <Camera className="h-4 w-4 text-[#2F8FCC]" />
                  Scan Certificate QR
                </h3>
                <button
                  type="button"
                  onClick={() => setShowScanner(false)}
                  className="text-xs font-bold text-[#D95C59] hover:text-red-700 cursor-pointer"
                >
                  Close Scanner
                </button>
              </div>

              {scanError && (
                <div className="p-3 rounded-xl bg-[#FCECEC] border border-[#F8C8C6] flex items-start gap-2 text-xs">
                  <AlertTriangle className="h-4 w-4 text-[#A62F2C] shrink-0" />
                  <span className="font-bold text-[#A62F2C]">{scanError}</span>
                </div>
              )}

              <QRScanner
                onScanSuccess={handleScanSuccess}
                onClose={() => setShowScanner(false)}
                className="w-full aspect-[4/3] sm:aspect-video rounded-2xl shadow-inner border border-[#DCEAF4]"
              />
            </div>
          )}
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
