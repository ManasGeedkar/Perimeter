import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Scale,
  Building,
  Award,
  FileCheck2,
  ArrowLeft,
  AlertTriangle,
  ExternalLink,
} from 'lucide-react';
import { instrumentService } from '../api';
import { Instrument } from '../types';
import { StatusBadge } from '../../../components/common/StatusBadge';
import { QRCodeCard } from '../../../components/common/QRCodeCard';

export const MyInstrumentDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [instrument, setInstrument] = useState<Instrument | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    instrumentService.getById(id).then((inst) => {
      setInstrument(inst || null);
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return <div className="py-20 text-center text-slate-500">Loading instrument details...</div>;
  }

  if (!instrument) {
    return (
      <div className="rounded-3xl bg-white dark:bg-[#131E2C] p-8 text-center border border-[#E5EAF0] dark:border-[#1E293B] space-y-4">
        <AlertTriangle className="h-10 w-10 text-amber-500 mx-auto" />
        <h2 className="text-xl font-bold">Instrument Not Found</h2>
        <button
          onClick={() => navigate('/my-instruments')}
          className="rounded-2xl bg-[#1769AA] text-white px-5 py-2 text-xs font-bold"
        >
          Back to My Instruments
        </button>
      </div>
    );
  }

  // Human timeline stages (Section 11)
  const timelineStages = [
    { label: 'Registered', done: true, date: instrument.registrationDate },
    { label: 'Application Submitted', done: true, date: '15-Sep-2026' },
    { label: 'Inspection', done: instrument.status !== 'Pending Verification', date: instrument.lastVerifiedDate },
    { label: 'Verified', done: instrument.status === 'Verified' || instrument.status === 'Expiring Soon', date: instrument.lastVerifiedDate },
    { label: 'Certificate Issued', done: !!instrument.certificateId && !instrument.certificateId.includes('PENDING'), date: instrument.lastVerifiedDate },
    { label: 'Re-verification Due', done: false, date: instrument.validUntilDate },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in duration-200">
      {/* Top Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 card-greeting p-6 sm:p-8 rounded-3xl shadow-soft-card">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/my-instruments')}
            className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white border border-[#CFE5F5] hover:bg-[#EDF8FE] text-[#123F63] transition-colors cursor-pointer shadow-xs"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="font-outfit text-xl sm:text-2xl font-extrabold text-[#123F63]">
                {instrument.type}
              </h1>
              <StatusBadge status={instrument.status} size="md" />
            </div>
            <p className="font-mono text-xs text-[#1E75AC] font-bold mt-0.5">
              ID: {instrument.id}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            to="/start-inspection"
            className="inline-flex items-center gap-1.5 rounded-2xl bg-[#2F8FCC] hover:bg-[#1E75AC] text-white px-5 py-2.5 text-xs font-bold shadow-soft transition-all"
          >
            <FileCheck2 className="h-4 w-4" />
            <span>Apply for Verification</span>
          </Link>
        </div>
      </div>

      {/* Human Verification Journey Timeline (Section 11) */}
      <div className="rounded-3xl card-neutral-blue p-6 sm:p-8 shadow-soft-card space-y-4">
        <div>
          <h3 className="font-outfit text-base font-bold text-[#123F63]">
            Your Verification Journey
          </h3>
          <p className="text-xs text-[#527290]">
            Track your instrument from registration to on-site testing and digital certificate issuance
          </p>
        </div>

        <div className="overflow-x-auto pt-2 pb-2">
          <div className="flex items-center justify-between min-w-[650px] relative">
            {timelineStages.map((stage, i) => (
              <div key={stage.label} className="flex-1 flex flex-col items-center text-center relative group">
                {/* Connecting bar */}
                {i < timelineStages.length - 1 && (
                  <div
                    className={`absolute top-4 left-1/2 w-full h-[2px] -z-0 ${
                      stage.done ? 'bg-[#1E8E5A]' : 'bg-[#DCEAF4]'
                    }`}
                  />
                )}

                {/* Node */}
                <div
                  className={`relative z-10 h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold shadow-xs ${
                    stage.done
                      ? 'bg-[#1E8E5A] text-white'
                      : 'bg-white border-2 border-[#CFE5F5] text-[#7A93A8]'
                  }`}
                >
                  {stage.done ? '✓' : i + 1}
                </div>

                <span
                  className={`text-xs font-bold mt-2 ${
                    stage.done ? 'text-[#123F63]' : 'text-[#7A93A8]'
                  }`}
                >
                  {stage.label}
                </span>

                <span className="text-[10px] text-[#7A93A8] mt-0.5">
                  {stage.date}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Details Sections Grid (Section 11) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Instrument Information */}
        <div className="rounded-3xl card-sky p-6 shadow-soft-card space-y-3">
          <h4 className="font-outfit text-sm font-bold text-[#123F63] border-b border-[#CFE5F5] pb-2 flex items-center gap-2">
            <div className="p-1 rounded-md bg-[#D5EEFB] text-[#1E75AC]">
              <Scale className="h-4 w-4" />
            </div>
            <span>Instrument Information</span>
          </h4>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-[#627B94] block text-[10px]">Type</span>
              <span className="font-bold text-[#123F63]">{instrument.type}</span>
            </div>
            <div>
              <span className="text-[#627B94] block text-[10px]">Manufacturer</span>
              <span className="font-semibold text-[#123F63]">{instrument.manufacturer}</span>
            </div>
            <div>
              <span className="text-[#627B94] block text-[10px]">Model</span>
              <span className="font-medium text-[#123F63]">{instrument.model}</span>
            </div>
            <div>
              <span className="text-[#627B94] block text-[10px]">Serial Number</span>
              <span className="font-mono font-bold text-[#123F63]">{instrument.serialNumber}</span>
            </div>
            <div>
              <span className="text-[#627B94] block text-[10px]">Capacity & Unit</span>
              <span className="font-semibold text-[#123F63]">{instrument.capacity} ({instrument.unit})</span>
            </div>
            <div>
              <span className="text-[#627B94] block text-[10px]">Accuracy Class</span>
              <span className="font-semibold text-[#123F63]">{instrument.accuracyClass}</span>
            </div>
          </div>
        </div>

        {/* Location & Owner */}
        <div className="rounded-3xl card-lavender p-6 shadow-soft-card space-y-3">
          <h4 className="font-outfit text-sm font-bold text-[#123F63] border-b border-[#E0DCFB] pb-2 flex items-center gap-2">
            <div className="p-1 rounded-md bg-[#E6E1FD] text-[#5B5FC7]">
              <Building className="h-4 w-4" />
            </div>
            <span>Owner & Shop Premises</span>
          </h4>

          <div className="space-y-2 text-xs">
            <div>
              <span className="text-[#627B94] block text-[10px]">Business Name</span>
              <span className="font-bold text-[#123F63]">{instrument.businessName}</span>
            </div>
            <div>
              <span className="text-[#627B94] block text-[10px]">Proprietor</span>
              <span className="font-semibold text-[#123F63]">{instrument.ownerName}</span>
            </div>
            <div>
              <span className="text-[#627B94] block text-[10px]">Physical Address</span>
              <span className="text-[#527290]">
                {instrument.address}, {instrument.district}, {instrument.state} - {instrument.pincode}
              </span>
            </div>
            <div>
              <span className="text-[#627B94] block text-[10px]">Contact Mobile</span>
              <span className="font-mono text-[#527290]">{instrument.contactPhone}</span>
            </div>
          </div>
        </div>

        {/* Certificate Card & QR Code */}
        {instrument.certificateId && !instrument.certificateId.includes('PENDING') && (
          <div className="md:col-span-2 rounded-3xl card-mint p-6 shadow-soft-card flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-xs flex-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#1E8E5A]">
                Active Legal Certificate
              </span>
              <h4 className="font-outfit text-lg font-bold text-[#123F63] font-mono">
                {instrument.certificateId}
              </h4>
              <p className="text-[#527290]">
                Issued by <span className="font-semibold">{instrument.verificationCentre}</span>. Stamped and certified valid until <span className="font-bold text-[#1E8E5A]">{instrument.validUntilDate}</span>.
              </p>

              <div className="pt-2 flex items-center gap-3">
                <Link
                  to={`/my-certificates/${instrument.certificateId}`}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#2F8FCC] hover:bg-[#1E75AC] text-white font-bold shadow-soft transition-all text-xs"
                >
                  <Award className="h-4 w-4" />
                  <span>View Official Certificate</span>
                </Link>
                <Link
                  to={`/verify/${instrument.certificateId}`}
                  target="_blank"
                  className="inline-flex items-center gap-1 text-[#1E75AC] font-bold hover:underline text-xs"
                >
                  <span>Public QR Link</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>

            <div className="shrink-0 bg-white p-3 rounded-2xl border border-[#CDEFE0] shadow-xs">
              <QRCodeCard
                certificateId={instrument.certificateId}
                instrumentId={instrument.id}
                size={110}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
