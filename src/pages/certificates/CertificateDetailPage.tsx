import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Printer,
  QrCode,
  ShieldCheck,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  Download,
} from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { certificateService } from '../../services/certificateService';
import { Certificate } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import { QRCodeCard } from '../../components/common/QRCodeCard';
import { useTranslation } from '../../i18n';
import { LanguageSwitcher } from '../../components/common/LanguageSwitcher';

export const CertificateDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [cert, setCert] = useState<Certificate | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    certificateService.getById(id).then((res) => {
      setCert(res || null);
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return <div className="py-20 text-center text-[#718295]">{t('status.pending')}...</div>;
  }

  if (!cert) {
    return (
      <div className="rounded-3xl bg-white p-8 text-center border border-[#E8E3D9] space-y-4 font-sans">
        <AlertTriangle className="h-10 w-10 text-[#D99A32] mx-auto" />
        <h2 className="text-xl font-bold text-[#16466F]">{t('verify.invalidNotice')}</h2>
        <p className="text-xs text-[#718295]">ID: {id}</p>
        <button
          onClick={() => navigate('/my-certificates')}
          className="rounded-xl bg-[#17689A] hover:bg-[#16466F] text-white px-5 py-2 text-xs font-bold transition-colors"
        >
          {t('nav.myCertificates')}
        </button>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = async () => {
    if (!cert) return;
    setDownloading(true);
    setDownloadError(null);
    try {
      const element = document.getElementById('printable-certificate');
      if (!element) throw new Error('Certificate element not found');

      const canvas = await html2canvas(element, { 
        scale: 2,
        useCORS: true,
        logging: false
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Certificate-${cert.id}.pdf`);
    } catch (err: any) {
      setDownloadError(err.message || 'Failed to generate PDF download.');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200 font-sans">
      {downloadError && (
        <div className="no-print p-3 rounded-xl bg-[#FCECEC] border border-[#F8C8C6] flex items-start gap-2 text-xs">
          <AlertTriangle className="h-4 w-4 text-[#A62F2C] shrink-0" />
          <span className="font-bold text-[#A62F2C]">{downloadError}</span>
        </div>
      )}

      {/* Top Header Controls (Hidden on print) */}
      <div className="no-print flex flex-col sm:flex-row sm:items-center justify-between gap-4 card-greeting p-6 rounded-3xl shadow-soft-card">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/my-certificates')}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-white hover:bg-[#EDF8FE] hover:border-[#2F8FCC] hover:text-[#123F63] active:scale-95 text-[#123F63] transition-all border border-[#CFE5F5] cursor-pointer shadow-xs"
            title={t('action.back')}
            aria-label={t('action.back')}
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="font-outfit text-xl sm:text-2xl font-extrabold text-[#123F63] font-mono">
                {cert.id}
              </h1>
              <StatusBadge status={cert.status} size="md" />
            </div>
            <p className="text-xs text-[#527290] mt-0.5">
              {t('cert.certNo')}: {cert.certificateNumber} • {t('cert.issueDate')}: {cert.issueDate}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <LanguageSwitcher />

          <Link
            to={`/verify/${cert.id}`}
            target="_blank"
            className="inline-flex items-center gap-1.5 rounded-xl bg-white border border-[#CFE5F5] text-[#123F63] px-4 py-2.5 text-xs font-bold shadow-xs hover:bg-[#EDF8FE] hover:border-[#2F8FCC] active:scale-[0.98] transition-all cursor-pointer"
          >
            <QrCode className="h-4 w-4 text-[#2F8FCC]" />
            <span>{t('landing.why4Title')}</span>
            <ExternalLink className="h-3 w-3" />
          </Link>

          <button
            onClick={handleDownload}
            disabled={downloading}
            className="inline-flex items-center gap-1.5 rounded-xl bg-white hover:bg-[#EDF8FE] hover:border-[#2F8FCC] active:scale-[0.98] text-[#123F63] border border-[#CFE5F5] px-5 py-2.5 text-xs font-bold shadow-soft transition-all cursor-pointer disabled:opacity-50"
          >
            <Download className="h-4 w-4 text-[#2F8FCC]" />
            <span>{downloading ? 'Generating PDF...' : 'Download PDF'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#2F8FCC] hover:bg-[#1E75AC] active:scale-[0.98] text-white px-5 py-2.5 text-xs font-bold shadow-soft transition-all cursor-pointer"
          >
            <Printer className="h-4 w-4" />
            <span>{t('action.printCertificate')}</span>
          </button>
        </div>
      </div>

      {/* Official Certificate Preview Sheet */}
      <div id="printable-certificate" className="max-w-4xl mx-auto bg-white p-8 sm:p-12 rounded-3xl border border-[#CFE5F5] shadow-soft-lg text-[#123F63] space-y-6 relative overflow-hidden">
        {/* Subtle Watermark */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03]">
          <ShieldCheck className="w-[500px] h-[500px] text-[#123F63]" />
        </div>

        {/* Certificate Border Frame */}
        <div className="border border-[#CFE5F5] p-6 sm:p-8 rounded-2xl space-y-6 relative z-10 bg-gradient-to-b from-[#F9FCFE] to-white">
          {/* Certificate Header */}
          <div className="text-center space-y-1.5 border-b border-[#CFE5F5] pb-6">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#2F8FCC] text-white shadow-soft mb-2">
              <ShieldCheck className="h-8 w-8" />
            </div>
            <p className="text-xs uppercase tracking-widest font-bold text-[#627B94]">
              {t('cert.govDept')} • {t('cert.govtOfIndia')}
            </p>
            <h2 className="font-outfit text-2xl sm:text-3xl font-extrabold text-[#123F63] tracking-tight">
              {t('cert.title')}
            </h2>
            <p className="text-xs font-semibold text-[#627B94]">
              {t('cert.statutoryRule')}
            </p>
          </div>

          {/* Certificate Identifiers Banner */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#EDF8FE] p-4 rounded-xl border border-[#CFE5F5] text-xs font-mono">
            <div>
              <span className="text-[10px] text-[#627B94] uppercase block font-sans">{t('cert.certNo')}</span>
              <span className="font-bold text-[#123F63]">{cert.certificateNumber}</span>
            </div>
            <div>
              <span className="text-[10px] text-[#627B94] uppercase block font-sans">{t('dashboard.applicationId')}</span>
              <span className="font-bold text-[#1E75AC]">{cert.id}</span>
            </div>
            <div>
              <span className="text-[10px] text-[#627B94] uppercase block font-sans">{t('cert.issueDate')}</span>
              <span className="font-bold text-[#123F63]">{cert.issueDate}</span>
            </div>
            <div>
              <span className="text-[10px] text-[#627B94] uppercase block font-sans">{t('cert.validUntil')}</span>
              <span className="font-bold text-[#1E8E5A]">{cert.validUntil}</span>
            </div>
          </div>

          {/* Main Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs pt-2">
            {/* Instrument Information */}
            <div className="space-y-2.5">
              <h4 className="font-bold text-xs uppercase tracking-wider text-[#16466F] border-b border-[#E8E3D9] pb-1">
                {t('cert.instrumentDetails')}
              </h4>
              <div className="grid grid-cols-2 gap-2 text-[#183B59]">
                <div>
                  <span className="text-[#718295] block text-[10px]">ID</span>
                  <span className="font-mono font-bold text-[#16466F]">{cert.instrumentId}</span>
                </div>
                <div>
                  <span className="text-[#718295] block text-[10px]">{t('cert.type')}</span>
                  <span className="font-semibold">{cert.instrumentType}</span>
                </div>
                <div>
                  <span className="text-[#718295] block text-[10px]">{t('apply.manufacturer')}</span>
                  <span>{cert.manufacturer}</span>
                </div>
                <div>
                  <span className="text-[#718295] block text-[10px]">{t('apply.model')} & {t('cert.serialNo')}</span>
                  <span className="font-mono">{cert.model} ({cert.serialNumber})</span>
                </div>
                <div>
                  <span className="text-[#718295] block text-[10px]">{t('cert.capacity')}</span>
                  <span className="font-semibold">{cert.capacity} • {cert.accuracyClass}</span>
                </div>
                <div>
                  <span className="text-[#718295] block text-[10px]">{t('officer.badge')}</span>
                  <span className="truncate block">{cert.verificationCentre}</span>
                </div>
              </div>
            </div>

            {/* Owner & Establishment */}
            <div className="space-y-2.5">
              <h4 className="font-bold text-xs uppercase tracking-wider text-[#16466F] border-b border-[#E8E3D9] pb-1">
                {t('cert.ownerDetails')}
              </h4>
              <div className="space-y-1.5 text-[#183B59]">
                <div>
                  <span className="text-[#718295] block text-[10px]">{t('cert.business')}</span>
                  <span className="font-bold text-[#16466F]">{cert.businessName}</span>
                </div>
                <div>
                  <span className="text-[#718295] block text-[10px]">{t('apply.ownerName')}</span>
                  <span className="font-semibold">{cert.ownerName}</span>
                </div>
                <div>
                  <span className="text-[#718295] block text-[10px]">{t('cert.address')}</span>
                  <span className="text-[#718295]">
                    {cert.location.address}, {cert.location.district}, {cert.location.state} - {cert.location.pincode}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Statutory Statement */}
          <div className="border-t border-[#E8E3D9] pt-3 space-y-1 text-xs">
            <span className="font-bold text-[#16466F] uppercase text-[11px]">
              {t('cert.govDept')}:
            </span>
            <p className="text-[#183B59] bg-[#FAF7F0] p-3 rounded-xl border border-[#E8E3D9] leading-relaxed font-normal">
              {t('cert.legalStatement')}
            </p>
          </div>

          {/* Bottom Section: QR Code & Official Seal & Signature */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 border-t border-[#E8E3D9] items-center">
            {/* QR Code */}
            <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
              <QRCodeCard
                certificateId={cert.id}
                instrumentId={cert.instrumentId}
                size={110}
                showDetails={false}
              />
              <span className="text-[9px] text-[#718295] mt-1 font-mono">{t('cert.qrNotice')}</span>
            </div>

            {/* Cryptographic Security Stamp */}
            <div className="space-y-1 text-center sm:text-left">
              <span className="text-[10px] font-bold text-[#718295] uppercase tracking-wider block">
                {t('cert.sealNumber')}
              </span>
              <p className="font-mono text-[9px] text-[#718295] break-all bg-[#FAF7F0] p-2 rounded-lg border border-[#E8E3D9]">
                {cert.securityStampHash}
              </p>
              <div className="flex items-center gap-1 text-[10px] text-[#238258] font-semibold mt-1">
                <CheckCircle2 className="h-3 w-3" />
                <span>{t('cert.securityBadge')}</span>
              </div>
            </div>

            {/* Digital Signature */}
            <div className="text-center sm:text-right space-y-1">
              <div className="inline-block p-2 rounded-xl bg-[#FAF7F0] border border-[#E8E3D9] text-left">
                <p className="text-[9px] text-[#718295] uppercase font-mono">{t('verify.officer')}:</p>
                <p className="text-xs font-bold text-[#16466F]">{cert.verifiedByOfficerName}</p>
                <p className="text-[10px] text-[#718295]">{cert.officerDesignation}</p>
                <p className="text-[9px] text-[#718295] font-mono mt-0.5">{cert.issueDate} 15:42 IST</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
