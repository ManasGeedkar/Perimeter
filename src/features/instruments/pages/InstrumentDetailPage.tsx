import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Scale,
  Building,
  MapPin,
  Award,
  FileCheck2,
  ArrowLeft,
  AlertTriangle,
  Phone,
  ShieldAlert,
} from 'lucide-react';
import { instrumentService } from '../api';
import { Instrument } from '../types';
import { StatusBadge } from '../../../components/common/StatusBadge';
import { LifecycleStepper } from '../../../components/common/LifecycleStepper';
import { QRCodeCard } from '../../../components/common/QRCodeCard';
import { NewApplicationModal } from '../../../components/applications/NewApplicationModal';

export const InstrumentDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [instrument, setInstrument] = useState<Instrument | null>(null);
  const [loading, setLoading] = useState(true);
  const [applyModalOpen, setApplyModalOpen] = useState(false);

  useEffect(() => {
    if (!id) return;
    instrumentService.getById(id).then((inst) => {
      setInstrument(inst || null);
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return (
      <div className="py-20 text-center text-slate-500">
        Loading instrument records...
      </div>
    );
  }

  if (!instrument) {
    return (
      <div className="rounded-3xl bg-white dark:bg-[#131E2C] p-8 text-center border border-[#E5EAF0] dark:border-[#1E293B] space-y-4">
        <AlertTriangle className="h-10 w-10 text-amber-500 mx-auto" />
        <h2 className="text-xl font-bold">Instrument Not Found</h2>
        <p className="text-xs text-slate-500">No instrument registered with ID: {id}</p>
        <button
          onClick={() => navigate('/instruments')}
          className="rounded-2xl bg-[#1769AA] text-white px-5 py-2 text-xs font-bold"
        >
          Back to Instruments
        </button>
      </div>
    );
  }

  // Determine current lifecycle stage based on status
  let lifecycleStage = 'Verification Result';
  if (instrument.status === 'Registered') lifecycleStage = 'Registration';
  else if (instrument.status === 'Pending Verification') lifecycleStage = 'Application';
  else if (instrument.status === 'Verified') lifecycleStage = 'Validity Tracking';
  else if (instrument.status === 'Expiring Soon' || instrument.status === 'Expired') lifecycleStage = 'Re-verification';

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Back Button & Top Action Section (Section 17) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 card-greeting p-6 rounded-3xl border border-[#CCE3F3] shadow-soft-card">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/instruments')}
            className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white border border-[#CFE5F5] hover:bg-[#EDF8FE] text-[#123F63] transition-colors cursor-pointer"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="font-outfit text-xl sm:text-2xl font-extrabold text-[#123F63] font-mono">
                {instrument.id}
              </h1>
              <StatusBadge status={instrument.status} size="md" />
            </div>
            <p className="text-xs text-[#527290] mt-0.5">
              {instrument.businessName} • Registered on {instrument.registrationDate}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {instrument.certificateId && !instrument.certificateId.includes('PENDING') && (
            <Link
              to={`/certificates/${instrument.certificateId}`}
              className="inline-flex items-center gap-1.5 rounded-2xl bg-white border border-[#CFE5F5] text-[#123F63] px-4 py-2 text-xs font-bold shadow-xs hover:bg-[#EDF8FE] transition-all cursor-pointer"
            >
              <Award className="h-4 w-4 text-[#2F8FCC]" />
              <span>View e-Certificate</span>
            </Link>
          )}

          <button
            onClick={() => setApplyModalOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-2xl bg-[#2F8FCC] text-white px-5 py-2 text-xs font-bold shadow-soft hover:bg-[#1E75AC] transition-all cursor-pointer"
          >
            <FileCheck2 className="h-4 w-4" />
            <span>Apply for Verification</span>
          </button>
        </div>
      </div>

      {/* Special Case Alert for Damaged / Missing Nameplate */}
      {instrument.nameplateDamaged && (
        <div className="rounded-3xl card-amber border border-[#FCE3BA] p-5 flex items-start gap-3.5">
          <ShieldAlert className="h-6 w-6 text-[#B86C0B] shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-[#7C4806]">
              Special Case: Identifier Unavailable / Nameplate Damaged
            </h4>
            <p className="text-xs text-[#8F5509]">
              This instrument was registered under Section 21 provisions with damaged or missing serial plate rivets. The current serial code is temporary. An authorized Legal Metrology Officer will tag official tamper-evident barcode hardware during physical inspection.
            </p>
          </div>
        </div>
      )}

      {/* Statutory Lifecycle Component (Section 18) */}
      <div className="rounded-3xl card-neutral-blue p-6 border border-[#DCEAF4] shadow-soft-card space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#DCEAF4]">
          <div>
            <h3 className="font-outfit text-base font-bold text-[#123F63]">
              Instrument Statutory Verification Lifecycle
            </h3>
            <p className="text-xs text-[#527290]">
              End-to-end audit progression from registration to physical test, stamping, and validity monitoring
            </p>
          </div>
          <span className="text-xs font-bold bg-[#EDF8FE] text-[#1E75AC] border border-[#CFE5F5] px-3 py-1 rounded-full">
            Stage: {lifecycleStage}
          </span>
        </div>

        <LifecycleStepper
          currentStage={lifecycleStage}
          stepsData={{
            registration: { date: instrument.registrationDate, actor: instrument.manufacturer },
            inspection: { date: instrument.lastVerifiedDate, actor: 'Rajesh Kumar (Senior LMO)' },
            certificate: { date: instrument.lastVerifiedDate, actor: 'Portal Stamping Engine' },
            validity: { date: `Valid till ${instrument.validUntilDate}`, actor: 'National Grid' },
          }}
        />
      </div>

      {/* Information Cards Grid (Section 17) */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {/* 1. Instrument Information */}
        <div className="rounded-3xl card-sky p-6 border border-[#CFE5F5] shadow-soft-card space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#1E75AC]">
            <div className="h-7 w-7 rounded-xl bg-[#D5EEFB] text-[#1E75AC] flex items-center justify-center">
              <Scale className="h-4 w-4" />
            </div>
            <span>Technical Specs</span>
          </div>

          <div className="space-y-2 text-xs">
            <div>
              <span className="text-[#527290] block text-[11px]">Category / Type</span>
              <span className="font-bold text-[#123F63]">
                {instrument.type}
              </span>
            </div>
            <div>
              <span className="text-[#527290] block text-[11px]">Manufacturer</span>
              <span className="font-semibold text-[#123F63]">
                {instrument.manufacturer}
              </span>
            </div>
            <div>
              <span className="text-[#527290] block text-[11px]">Model & Serial</span>
              <span className="font-mono text-[#123F63]">
                {instrument.model} ({instrument.serialNumber})
              </span>
            </div>
            <div>
              <span className="text-[#527290] block text-[11px]">Capacity & Unit</span>
              <span className="font-semibold text-[#123F63]">
                {instrument.capacity} ({instrument.unit})
              </span>
            </div>
            <div>
              <span className="text-[#527290] block text-[11px]">Accuracy Class</span>
              <span className="inline-block mt-0.5 px-2 py-0.5 rounded-md bg-white border border-[#CFE5F5] font-bold text-[11px] text-[#123F63]">
                {instrument.accuracyClass}
              </span>
            </div>
          </div>
        </div>

        {/* 2. Owner Information */}
        <div className="rounded-3xl card-lavender p-6 border border-[#E0DCFB] shadow-soft-card space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#5B5FC7]">
            <div className="h-7 w-7 rounded-xl bg-[#E6E1FD] text-[#5B5FC7] flex items-center justify-center">
              <Building className="h-4 w-4" />
            </div>
            <span>Owner & Business</span>
          </div>

          <div className="space-y-2 text-xs">
            <div>
              <span className="text-[#646A94] block text-[11px]">Establishment Name</span>
              <span className="font-bold text-[#123F63]">
                {instrument.businessName}
              </span>
            </div>
            <div>
              <span className="text-[#646A94] block text-[11px]">Owner / Representative</span>
              <span className="font-semibold text-[#123F63]">
                {instrument.ownerName}
              </span>
            </div>
            <div>
              <span className="text-[#646A94] block text-[11px]">Contact Phone</span>
              <span className="font-mono text-[#123F63] flex items-center gap-1.5 mt-0.5">
                <Phone className="h-3 w-3 text-[#5B5FC7]" />
                {instrument.contactPhone}
              </span>
            </div>
            <div>
              <span className="text-[#646A94] block text-[11px]">Official Email</span>
              <span className="text-[#123F63] truncate block mt-0.5">
                {instrument.contactEmail}
              </span>
            </div>
          </div>
        </div>

        {/* 3. Location Information */}
        <div className="rounded-3xl card-neutral-blue p-6 border border-[#DCEAF4] shadow-soft-card space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#1E75AC]">
            <div className="h-7 w-7 rounded-xl bg-[#E2F0F9] text-[#1E75AC] flex items-center justify-center">
              <MapPin className="h-4 w-4" />
            </div>
            <span>Location & GPS</span>
          </div>

          <div className="space-y-2 text-xs">
            <div>
              <span className="text-[#527290] block text-[11px]">Premises Address</span>
              <span className="text-[#123F63] font-medium">
                {instrument.address}
              </span>
            </div>
            <div>
              <span className="text-[#527290] block text-[11px]">District & State</span>
              <span className="font-bold text-[#123F63]">
                {instrument.district}, {instrument.state} - {instrument.pincode}
              </span>
            </div>
            <div>
              <span className="text-[#527290] block text-[11px]">Geo Coordinates</span>
              <span className="font-mono text-[11px] text-[#1E75AC] bg-[#EDF8FE] border border-[#CFE5F5] px-2 py-0.5 rounded-md inline-block mt-0.5">
                Lat: {instrument.gpsCoordinates.lat.toFixed(4)}, Lng: {instrument.gpsCoordinates.lng.toFixed(4)}
              </span>
            </div>
            <div>
              <span className="text-[#527290] block text-[11px]">Testing Jurisdiction</span>
              <span className="text-[#527290]">
                {instrument.verificationCentre}
              </span>
            </div>
          </div>
        </div>

        {/* 4. Verification QR Card */}
        <div className="rounded-3xl card-mint p-6 border border-[#CDEFE0] shadow-soft-card flex flex-col justify-between">
          <QRCodeCard
            certificateId={instrument.certificateId}
            instrumentId={instrument.id}
            size={120}
          />
        </div>
      </div>

      {/* New Application Modal */}
      <NewApplicationModal
        isOpen={applyModalOpen}
        onClose={() => setApplyModalOpen(false)}
        preselectedInstrumentId={instrument.id}
        onSuccess={(appId) => navigate(`/applications/${appId}`)}
      />
    </div>
  );
};
