import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Award,
  Download,
  QrCode,
  Eye,
  CheckCircle2,
  Calendar,
  Building,
  AlertTriangle,
  ExternalLink,
} from 'lucide-react';
import { mockCertificates } from '../../data/mockCertificates';
import { StatusBadge } from '../../components/common/StatusBadge';

export const MyCertificatesPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in duration-200 font-sans">
      {/* Header (Section 16) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 card-greeting p-6 sm:p-8 rounded-3xl border shadow-soft-card">
        <div>
          <h1 className="font-outfit text-2xl sm:text-3xl font-extrabold text-[#123F63]">
            My Certificates
          </h1>
          <p className="text-xs sm:text-sm text-[#627B94] mt-1">
            Official digital verification certificates issued with QR verification
          </p>
        </div>

        <Link
          to="/verify"
          className="inline-flex items-center gap-2 rounded-xl bg-white border border-[#CFE5F5] text-[#123F63] px-4 py-2.5 text-xs sm:text-sm font-bold shadow-xs hover:bg-[#EDF8FE] hover:border-[#2F8FCC] transition-colors"
        >
          <QrCode className="h-4 w-4 text-[#1E75AC]" />
          <span>Verify Any QR</span>
        </Link>
      </div>

      {/* Certificate Cards Grid (Section 16) with Differentiated Pastel Surfaces */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {mockCertificates.slice(0, 6).map((cert) => {
          const isExpiring = (cert.daysRemaining ?? 100) <= 30;
          const cardClass = isExpiring ? 'card-amber' : 'card-mint';
          const iconBg = isExpiring ? 'bg-[#FEEDC8] text-[#B86C0B]' : 'bg-[#D4F6E5] text-[#1E8E5A]';
          const borderClass = isExpiring ? 'border-[#FCE3BA]' : 'border-[#CDEFE0]';

          return (
            <div
              key={cert.id}
              className={`rounded-3xl ${cardClass} p-6 border shadow-soft-card space-y-4 hover:-translate-y-0.5 transition-all flex flex-col justify-between`}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className={`h-11 w-11 rounded-2xl ${iconBg} flex items-center justify-center shrink-0 shadow-2xs`}>
                      <Award className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-mono text-sm font-bold text-[#1E75AC]">
                        {cert.id}
                      </h3>
                      <p className="text-xs text-[#627B94] font-medium">
                        {cert.instrumentType}
                      </p>
                    </div>
                  </div>
                  <StatusBadge status={cert.status} size="sm" />
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                  <div>
                    <span className="text-[#627B94] block text-[10px]">Instrument ID</span>
                    <span className="font-mono text-[#123F63] font-semibold">{cert.instrumentId}</span>
                  </div>
                  <div>
                    <span className="text-[#627B94] block text-[10px]">Issued On</span>
                    <span className="text-[#16466F] font-semibold">{cert.issueDate}</span>
                  </div>
                  <div>
                    <span className="text-[#627B94] block text-[10px]">Valid Until</span>
                    <span className={`font-bold ${isExpiring ? 'text-[#B86C0B]' : 'text-[#1E8E5A]'}`}>
                      {cert.validUntil}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#627B94] block text-[10px]">Verified By</span>
                    <span className="text-[#16466F] font-semibold truncate block">
                      {cert.verifiedByOfficerName}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className={`pt-3 border-t ${borderClass} flex items-center justify-between gap-2`}>
                <Link
                  to={`/my-certificates/${cert.id}`}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#2F8FCC] text-white hover:bg-[#1E75AC] active:scale-[0.98] text-xs font-bold shadow-soft transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-[#2F8FCC]"
                >
                  <Eye className="h-3.5 w-3.5" />
                  <span>View Certificate</span>
                </Link>

                <div className="flex items-center gap-1.5">
                  <Link
                    to={`/verify/${cert.id}`}
                    className="p-2 rounded-xl bg-white hover:bg-[#D5EEFB] hover:border-[#2F8FCC] hover:text-[#123F63] active:scale-95 border border-[#CFE5F5] text-[#16466F] transition-all shadow-xs cursor-pointer focus-visible:outline-2 focus-visible:outline-[#2F8FCC]"
                    title="Verify QR Code"
                    aria-label="Verify QR Code"
                  >
                    <QrCode className="h-4 w-4" />
                  </Link>

                  <button
                    onClick={() => alert(`Downloading signed certificate PDF (${cert.certificateNumber})...`)}
                    className="p-2 rounded-xl bg-white hover:bg-[#D5EEFB] hover:border-[#2F8FCC] hover:text-[#123F63] active:scale-95 border border-[#CFE5F5] text-[#16466F] transition-all shadow-xs cursor-pointer focus-visible:outline-2 focus-visible:outline-[#2F8FCC]"
                    title="Download Certificate"
                    aria-label="Download Certificate"
                  >
                    <Download className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
