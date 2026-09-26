import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { QrCode, Copy, Check, ExternalLink, ShieldCheck, Download } from 'lucide-react';

interface QRCodeCardProps {
  certificateId: string;
  verificationUrl?: string;
  instrumentId: string;
  size?: number;
  showDetails?: boolean;
}

export const QRCodeCard: React.FC<QRCodeCardProps> = ({
  certificateId,
  verificationUrl,
  instrumentId,
  size = 140,
  showDetails = true,
}) => {
  const [copied, setCopied] = useState(false);

  // Generate full verification URL
  const targetUrl = verificationUrl
    ? (verificationUrl.startsWith('http') ? verificationUrl : `${window.location.origin}${verificationUrl}`)
    : `${window.location.origin}/public/verify/${certificateId}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(targetUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const svg = document.getElementById(`qr-code-${certificateId}`);
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.onload = () => {
      canvas.width = 300;
      canvas.height = 300;
      if (ctx) {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, 300, 300);
        ctx.drawImage(img, 20, 20, 260, 260);
        const pngFile = canvas.toDataURL('image/png');
        const downloadLink = document.createElement('a');
        downloadLink.download = `QR-${certificateId}.png`;
        downloadLink.href = `${pngFile}`;
        downloadLink.click();
      }
    };
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  return (
    <div className="flex flex-col items-center justify-center p-5 bg-white dark:bg-[#131E2C] rounded-2xl border border-[#E5EAF0] dark:border-[#1E293B] shadow-soft-card text-center">
      <div className="relative p-3 bg-white rounded-xl shadow-xs border border-slate-100 dark:border-slate-800">
        <QRCodeSVG
          id={`qr-code-${certificateId}`}
          value={targetUrl}
          size={size}
          level="H"
          marginSize={1}
          fgColor="#123F66"
        />
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="h-7 w-7 rounded-full bg-white shadow-xs border border-slate-200 flex items-center justify-center">
            <ShieldCheck className="h-4 w-4 text-[#1769AA]" />
          </div>
        </div>
      </div>

      {showDetails && (
        <div className="mt-3.5 space-y-1.5 max-w-xs">
          <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-[#17324D] dark:text-slate-100">
            <QrCode className="h-3.5 w-3.5 text-[#1769AA] dark:text-[#38BDF8]" />
            <span>Digital QR Seal</span>
          </div>
          <p className="text-[11px] font-mono text-slate-500 dark:text-slate-400 break-all px-2">
            {certificateId}
          </p>
          <p className="text-[10px] text-slate-600 dark:text-slate-400">
            Inst: <span className="font-semibold">{instrumentId}</span>
          </p>

          <div className="pt-2 flex items-center justify-center gap-2">
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-lg bg-[#EAF3FA] text-[#1769AA] hover:bg-[#d6e9f8] transition-colors dark:bg-slate-800 dark:text-[#38BDF8]"
              title="Copy verification link"
            >
              {copied ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
              <span>{copied ? 'Copied' : 'Copy Link'}</span>
            </button>
            <button
              onClick={handleDownload}
              className="inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors dark:bg-slate-800 dark:text-slate-300"
              title="Download QR image"
            >
              <Download className="h-3 w-3" />
              <span>Download</span>
            </button>
            <a
              href={targetUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors dark:bg-slate-800 dark:text-slate-300"
              title="Open public page"
            >
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
      )}
    </div>
  );
};
