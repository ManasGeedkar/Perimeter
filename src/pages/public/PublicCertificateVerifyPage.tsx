import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Search,
} from 'lucide-react';
import { certificateService } from '../../services/certificateService';
import { Certificate, CertificateStatus } from '../../types';
import { useTranslation } from '../../i18n';
import { LanguageSwitcher } from '../../components/common/LanguageSwitcher';
import { QRScanner } from '../../components/common/QRScanner';
import { Camera } from 'lucide-react';

export const PublicCertificateVerifyPage: React.FC = () => {
  const { certificateId } = useParams<{ certificateId?: string }>();
  const { t } = useTranslation();
  const [query, setQuery] = useState(certificateId || '');
  const [cert, setCert] = useState<Certificate | null>(null);
  const [status, setStatus] = useState<CertificateStatus | null>(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [scanError, setScanError] = useState<string | null>(null);

  const runVerification = async (targetId: string) => {
    if (!targetId.trim()) return;
    setLoading(true);
    setStatus(null);
    setScanError(null);
    try {
      // Validate perimeter certificate format if scanned from QR
      const isUrl = targetId.startsWith('http');
      let extractedId = targetId;
      
      if (isUrl) {
        const parts = targetId.split('/');
        extractedId = parts[parts.length - 1];
      }
      
      const res = await certificateService.verifyCertificate(extractedId);
      
      if (!res) {
        setScanError('This QR code is not a valid Perimeter certificate.');
        return;
      }
      
      setQuery(extractedId);
      setStatus(res.status);
      setMessage(res.message);
      setCert(res.certificate || null);
      setShowScanner(false);
    } catch (err) {
      setScanError('This QR code is not a valid Perimeter certificate.');
    } finally {
      setLoading(false);
    }
  };

  const handleScanSuccess = (decodedText: string) => {
    runVerification(decodedText);
  };

  useEffect(() => {
    if (certificateId) {
      setQuery(certificateId);
      runVerification(certificateId);
    }
  }, [certificateId]);

  return (
    <div className="min-h-screen bg-[#F7F3EA] text-[#183B59] py-8 px-4 sm:px-6 font-sans">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Simple Header */}
        <div className="flex items-center justify-between card-greeting px-5 py-3.5 rounded-2xl shadow-soft-card">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-[#2F8FCC] text-white flex items-center justify-center shadow-soft">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <span className="font-outfit text-lg font-bold text-[#123F63]">
              {t('brand.name')}
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <Link
              to="/login"
              className="text-xs font-semibold text-[#527290] hover:text-[#1E75AC]"
            >
              {t('nav.login')} →
            </Link>
          </div>
        </div>

        {/* Verification Query Card */}
        <div className="rounded-3xl card-neutral-blue p-6 sm:p-8 shadow-soft-card space-y-5">
          <div className="space-y-1">
            <h1 className="font-outfit text-2xl font-extrabold text-[#123F63]">
              {t('verify.title')}
            </h1>
            <p className="text-xs sm:text-sm text-[#527290] font-normal">
              {t('verify.subtitle')}
            </p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              runVerification(query);
            }}
            className="flex flex-col sm:flex-row gap-2.5"
          >
            <div className="relative flex-1">
              <Search className="h-4 w-4 absolute left-3.5 top-3.5 text-[#7A93A8]" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t('verify.placeholder')}
                className="w-full rounded-xl border border-[#CFE5F5] bg-white pl-10 pr-4 py-3 text-xs sm:text-sm font-mono text-[#123F63] focus:outline-none focus:ring-2 focus:ring-[#2F8FCC]"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 rounded-xl bg-[#2F8FCC] hover:bg-[#1E75AC] active:scale-[0.98] text-white font-bold text-xs sm:text-sm shadow-soft transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? `${t('action.search')}...` : t('verify.searchButton')}
            </button>
          </form>

          <div className="pt-4 border-t border-[#CFE5F5]">
            {!showScanner ? (
              <button
                type="button"
                onClick={() => {
                  setShowScanner(true);
                  setScanError(null);
                  setStatus(null);
                }}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white border-2 border-dashed border-[#2F8FCC] text-[#1E75AC] font-bold text-xs sm:text-sm shadow-sm hover:bg-[#EDF8FE] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Camera className="h-4 w-4" />
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
                  className="w-full aspect-[4/3] sm:aspect-video rounded-2xl shadow-inner border border-[#CFE5F5]"
                />
              </div>
            )}
          </div>

          {/* Quick Demo Test Pills */}
          <div className="pt-2 flex flex-wrap items-center gap-1.5 text-[11px] text-[#627B94]">
            <span>{t('landing.whyTitle')}:</span>
            <button
              type="button"
              onClick={() => {
                setQuery('CERT-MP-2026-000821');
                runVerification('CERT-MP-2026-000821');
              }}
              className="px-2.5 py-1 rounded-lg bg-white hover:bg-[#EDF8FE] active:scale-[0.98] border border-[#CFE5F5] text-[#123F63] font-mono transition-all cursor-pointer shadow-xs"
            >
              CERT-MP-2026-000821 ({t('status.verified')})
            </button>
            <button
              type="button"
              onClick={() => {
                setQuery('CERT-KA-2025-004921');
                runVerification('CERT-KA-2025-004921');
              }}
              className="px-2.5 py-1 rounded-lg bg-white hover:bg-[#EDF8FE] active:scale-[0.98] border border-[#CFE5F5] text-[#123F63] font-mono transition-all cursor-pointer shadow-xs"
            >
              CERT-KA-2025-004921 ({t('status.expired')})
            </button>
          </div>
        </div>

        {/* Verification Result Display */}
        {status && (
          <div
            className={`rounded-3xl p-6 sm:p-8 shadow-soft-card space-y-5 animate-in zoom-in-95 duration-150 ${
              status === 'VALID'
                ? 'card-mint'
                : status === 'EXPIRED'
                ? 'card-amber'
                : status === 'REVOKED'
                ? 'bg-[#FCECEC] border border-[#F8C8C6]'
                : 'card-neutral-blue'
            }`}
          >
            <div className="flex items-center gap-3.5">
              <div
                className={`h-12 w-12 rounded-2xl flex items-center justify-center text-white shadow-soft ${
                  status === 'VALID'
                    ? 'bg-[#36B37E]'
                    : status === 'EXPIRED'
                    ? 'bg-[#D99A32]'
                    : 'bg-[#D95C59]'
                }`}
              >
                {status === 'VALID' ? (
                  <CheckCircle2 className="h-7 w-7" />
                ) : status === 'EXPIRED' ? (
                  <AlertTriangle className="h-7 w-7" />
                ) : (
                  <XCircle className="h-7 w-7" />
                )}
              </div>

              <div>
                <h3 className="font-outfit text-xl font-bold text-[#16466F]">
                  {status === 'VALID'
                    ? `✓ ${t('status.verified')}`
                    : status === 'EXPIRED'
                    ? `⚠ ${t('status.expired')}`
                    : status === 'REVOKED'
                    ? t('status.rejected')
                    : t('verify.invalidNotice')}
                </h3>
                <p className="text-xs text-[#718295]">
                  {status === 'VALID' ? t('verify.validNotice') : message}
                </p>
              </div>
            </div>

            {cert && (
              <div className="rounded-2xl bg-white p-5 border border-[#E8E3D9] grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-[#718295] block text-[10px]">{t('cert.certNo')}</span>
                  <span className="font-mono font-bold text-[#16466F]">
                    {cert.certificateNumber}
                  </span>
                </div>
                <div>
                  <span className="text-[#718295] block text-[10px]">{t('cert.instrumentDetails')}</span>
                  <span className="font-bold text-[#183B59]">
                    {cert.instrumentType} ({cert.capacity})
                  </span>
                  <p className="font-mono text-[10px] text-[#718295]">{cert.manufacturer} • SN: {cert.serialNumber}</p>
                </div>
                <div>
                  <span className="text-[#718295] block text-[10px]">{t('cert.ownerDetails')}</span>
                  <span className="font-bold text-[#183B59]">
                    {cert.businessName}
                  </span>
                  <p className="text-[11px] text-[#718295]">{cert.ownerName} ({cert.location.district})</p>
                </div>
                <div>
                  <span className="text-[#718295] block text-[10px]">{t('cert.validUntil')}</span>
                  <span className="font-bold text-[#36B37E]">
                    {cert.issueDate} to {cert.validUntil}
                  </span>
                  <p className="text-[10px] text-[#718295]">{t('verify.officer')}: {cert.verifiedByOfficerName}</p>
                </div>
                <div className="sm:col-span-2 pt-2 border-t border-[#E8E3D9]/60 flex items-center justify-between text-[11px]">
                  <span className="text-[#718295]">
                    {t('dashboard.status')}: <span className="font-bold text-[#238258]">{status === 'VALID' ? t('status.verified') : status}</span>
                  </span>
                  <span className="font-mono text-[#718295] text-[10px]">
                    ID: {cert.id}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="text-center text-xs text-[#718295] pt-6">
          <p>{t('brand.portalTitle')} • {t('cert.govtOfIndia')}</p>
        </div>
      </div>
    </div>
  );
};
