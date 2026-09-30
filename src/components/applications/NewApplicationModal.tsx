import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { mockInstruments } from '../../data/mockInstruments';
import { VerificationType } from '../../types';
import { applicationService } from '../../services/applicationService';
import {
  CheckCircle2,
  AlertTriangle,
  Upload,
  Calendar,
  Building,
  Scale,
  FileCheck,
  ArrowRight,
  ArrowLeft,
  FileText,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';
import { ImageCaptureUpload } from '../common/ImageCaptureUpload';

interface NewApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (appId: string) => void;
  preselectedInstrumentId?: string;
}

export const NewApplicationModal: React.FC<NewApplicationModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  preselectedInstrumentId,
}) => {
  const [currentStep, setCurrentStep] = useState(1);

  // Form states
  const [selectedInstId, setSelectedInstId] = useState(preselectedInstrumentId || '');
  const [hasDamagedPlate, setHasDamagedPlate] = useState(false);

  // Unidentified / Damaged plate fields
  const [manualType, setManualType] = useState('Electronic Weighing Scale');
  const [manualManufacturer, setManualManufacturer] = useState('');
  const [manualModel, setManualModel] = useState('');
  const [manualCapacity, setManualCapacity] = useState('30 kg');

  // Business & Owner details
  const [applicantName, setApplicantName] = useState('Rameshwar Patidar');
  const [businessName, setBusinessName] = useState('Shree Ganesh Agro Mills & Trading');
  const [contactNumber, setContactNumber] = useState('+91 98260 12345');
  const [email, setEmail] = useState('shreeganeshagro@indoregrain.in');
  const [address, setAddress] = useState('Plot 42, Sanwer Industrial Area, Sector C');
  const [district, setDistrict] = useState('Indore');
  const [state, setState] = useState('Madhya Pradesh');

  // Details
  const [verificationType, setVerificationType] = useState<VerificationType>('Periodic Verification');
  const [preferredDate, setPreferredDate] = useState('2026-10-05');
  const [remarks, setRemarks] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedAppId, setSubmittedAppId] = useState<string | null>(null);

  // Handle instrument selection change
  const handleInstrumentSelect = (id: string) => {
    setSelectedInstId(id);
    const inst = mockInstruments.find((i) => i.id === id);
    if (inst) {
      setApplicantName(inst.ownerName);
      setBusinessName(inst.businessName);
      setContactNumber(inst.contactPhone);
      setEmail(inst.contactEmail);
      setAddress(inst.address);
      setDistrict(inst.district);
      setState(inst.state);
      setManualType(inst.type);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const selectedInst = mockInstruments.find((i) => i.id === selectedInstId);
      const app = await applicationService.create({
        instrumentId: hasDamagedPlate ? undefined : selectedInstId,
        instrumentType: hasDamagedPlate ? manualType : (selectedInst?.type || manualType),
        applicantName,
        businessName,
        contactNumber,
        email,
        address,
        district,
        state,
        verificationType,
        preferredDate,
        hasDamagedPlate,
        supportingDocs: uploadedFiles.map(f => f.name),
        remarks: remarks || (hasDamagedPlate ? 'Identification pending - damaged plate inspection requested' : 'Standard periodic verification'),
      });

      setSubmittedAppId(app.id);
      if (onSuccess) onSuccess(app.id);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetAndClose = () => {
    setCurrentStep(1);
    setSubmittedAppId(null);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleResetAndClose}
      title="New Verification Application"
      subtitle="Statutory verification request under Legal Metrology Act, 2009"
      maxWidth="3xl"
    >
      {/* If already submitted successfully */}
      {submittedAppId ? (
        <div className="text-center py-6 space-y-4">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-[#E8F6F0] text-[#2EAD7B] shadow-soft">
            <CheckCircle2 className="h-10 w-10" />
          </div>
          <div>
            <h4 className="text-xl font-bold text-[#123F66] dark:text-white">
              Application Submitted Successfully!
            </h4>
            <div className="mt-2 inline-flex items-center gap-2 bg-[#EAF3FA] dark:bg-slate-800 px-4 py-1.5 rounded-full text-sm font-mono font-bold text-[#1769AA] dark:text-[#38BDF8]">
              <span>Application ID: {submittedAppId}</span>
            </div>
            {hasDamagedPlate && (
              <div className="mt-3 mx-auto max-w-md p-3 rounded-2xl bg-amber-50 border border-amber-200 text-left text-xs text-amber-900 dark:bg-amber-950/30 dark:border-amber-800 dark:text-amber-200">
                <p className="font-bold flex items-center gap-1.5">
                  <AlertTriangle className="h-4 w-4 text-amber-600" />
                  Identification Pending Status Assigned
                </p>
                <p className="mt-1">
                  Because the instrument serial plate is damaged/unavailable, a Legal Metrology Officer will verify physical dimensions, load cells, and attach an official QR tag during physical inspection.
                </p>
              </div>
            )}
          </div>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Your verification request has been queued. You can track assignment, pay statutory fees, and view inspection schedules.
          </p>
          <div className="pt-2 flex justify-center gap-3">
            <button
              onClick={handleResetAndClose}
              className="rounded-2xl bg-[#1769AA] text-white px-6 py-2.5 text-sm font-bold shadow-soft hover:bg-[#125891] transition-all"
            >
              Done & View Application
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Stepper Header */}
          <div className="grid grid-cols-4 gap-2 text-center border-b border-[#DCEAF4] pb-4">
            {[
              { num: 1, label: 'Instrument' },
              { num: 2, label: 'Details' },
              { num: 3, label: 'Documents' },
              { num: 4, label: 'Review' },
            ].map((s) => (
              <div key={s.num} className="flex flex-col items-center">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-xl text-xs font-bold transition-all ${
                    currentStep === s.num
                      ? 'bg-[#2F8FCC] text-white ring-4 ring-[#2F8FCC]/20'
                      : currentStep > s.num
                      ? 'bg-[#1E8E5A] text-white'
                      : 'bg-[#EDF8FE] text-[#527290] border border-[#CFE5F5]'
                  }`}
                >
                  {currentStep > s.num ? '✓' : s.num}
                </div>
                <span className="text-[11px] font-semibold text-[#123F63] mt-1">
                  {s.label}
                </span>
              </div>
            ))}
          </div>

          {/* STEP 1: Instrument Selection & Damaged Plate Special Case */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Select Registered Instrument
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="damagedPlateToggle"
                    checked={hasDamagedPlate}
                    onChange={(e) => setHasDamagedPlate(e.target.checked)}
                    className="h-4 w-4 rounded-md border-slate-300 text-[#1769AA] focus:ring-[#1769AA]"
                  />
                  <label
                    htmlFor="damagedPlateToggle"
                    className="text-xs font-semibold text-amber-700 dark:text-amber-400 cursor-pointer flex items-center gap-1"
                  >
                    <span>I don't have the instrument serial number</span>
                  </label>
                </div>
              </div>

              {!hasDamagedPlate ? (
                <div className="space-y-2">
                  <select
                    value={selectedInstId}
                    onChange={(e) => handleInstrumentSelect(e.target.value)}
                    className="w-full rounded-2xl border border-[#E5EAF0] dark:border-[#1E293B] bg-white dark:bg-slate-900 px-3.5 py-3 text-sm text-[#17324D] dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-[#1769AA]"
                  >
                    <option value="">-- Choose an instrument from database --</option>
                    {mockInstruments.map((inst) => (
                      <option key={inst.id} value={inst.id}>
                        {inst.id} — {inst.businessName} ({inst.type}, {inst.capacity})
                      </option>
                    ))}
                  </select>

                  {selectedInstId && (
                    <div className="p-4 rounded-2xl bg-[#EAF3FA]/60 dark:bg-slate-800/60 border border-[#CCE2F5] dark:border-slate-700 text-xs space-y-1.5">
                      {(() => {
                        const i = mockInstruments.find((inst) => inst.id === selectedInstId);
                        if (!i) return null;
                        return (
                          <>
                            <div className="flex items-center justify-between font-bold text-[#123F66] dark:text-slate-100">
                              <span>{i.type}</span>
                              <span className="font-mono text-[11px]">{i.serialNumber}</span>
                            </div>
                            <p className="text-slate-600 dark:text-slate-300">
                              Manufacturer: <span className="font-semibold">{i.manufacturer}</span> ({i.model})
                            </p>
                            <p className="text-slate-600 dark:text-slate-300">
                              Capacity: {i.capacity} • Accuracy: {i.accuracyClass}
                            </p>
                            <p className="text-slate-600 dark:text-slate-300">
                              Location: {i.address}, {i.district}, {i.state}
                            </p>
                          </>
                        );
                      })()}
                    </div>
                  )}
                </div>
              ) : (
                /* Special Case UI: Identifier Unavailable */
                <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 dark:bg-amber-950/20 dark:border-amber-900/60 space-y-4">
                  <div className="flex items-start gap-2.5">
                    <ShieldAlert className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <h5 className="text-xs font-bold text-amber-900 dark:text-amber-200 uppercase tracking-wider">
                        Special Case: Missing or Damaged Serial Number Plate
                      </h5>
                      <p className="text-xs text-amber-800 dark:text-amber-300 mt-0.5">
                        As per statutory provisions, do NOT invent an official serial number. A temporary application ID will be generated, and an authorized LMO will inspect and tag the instrument on-site.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                        Instrument Type *
                      </label>
                      <select
                        value={manualType}
                        onChange={(e) => setManualType(e.target.value)}
                        className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs"
                      >
                        <option>Electronic Weighing Scale</option>
                        <option>Platform Scale</option>
                        <option>Fuel Dispenser</option>
                        <option>Weighbridge</option>
                        <option>Analytical Balance</option>
                        <option>Mechanical Counter Scale</option>
                      </select>
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                        Capacity *
                      </label>
                      <input
                        type="text"
                        value={manualCapacity}
                        onChange={(e) => setManualCapacity(e.target.value)}
                        placeholder="e.g. 50 kg, 100 Ton"
                        className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                        Manufacturer (if known)
                      </label>
                      <input
                        type="text"
                        value={manualManufacturer}
                        onChange={(e) => setManualManufacturer(e.target.value)}
                        placeholder="e.g. Essae / Avery / Eagle"
                        className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                        Model (if known)
                      </label>
                      <input
                        type="text"
                        value={manualModel}
                        onChange={(e) => setManualModel(e.target.value)}
                        placeholder="e.g. DS-215 / E1205"
                        className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 2: Verification Type & Schedule */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">
                  Select Verification Type *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(
                    [
                      {
                        type: 'Initial Verification',
                        desc: 'First-time stamping of newly manufactured or imported instrument.',
                      },
                      {
                        type: 'Periodic Verification',
                        desc: 'Annual / bi-annual mandatory renewal under Legal Metrology Act.',
                      },
                      {
                        type: 'Re-verification',
                        desc: 'Stamping after repair, seal breakage, or overhaul.',
                      },
                      {
                        type: 'Special Verification',
                        desc: 'On-demand audit, dispute resolution, or damaged plate tagging.',
                      },
                    ] as const
                  ).map((item) => (
                    <div
                      key={item.type}
                      onClick={() => setVerificationType(item.type)}
                      className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                        verificationType === item.type
                          ? 'border-[#1769AA] bg-[#EAF3FA]/80 dark:bg-slate-800 dark:border-[#38BDF8] ring-2 ring-[#1769AA]/10'
                          : 'border-[#E5EAF0] dark:border-[#1E293B] hover:bg-slate-50 dark:hover:bg-slate-800/50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#17324D] dark:text-white">
                          {item.type}
                        </span>
                        {verificationType === item.type && (
                          <CheckCircle2 className="h-4 w-4 text-[#1769AA] dark:text-[#38BDF8]" />
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                        {item.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Preferred Verification Date *
                  </label>
                  <input
                    type="date"
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Contact Mobile Number *
                  </label>
                  <input
                    type="tel"
                    value={contactNumber}
                    onChange={(e) => setContactNumber(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1 text-xs">
                  Physical Verification Location / Premise Address *
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Full shop / warehouse / mandi address"
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs"
                />
              </div>
            </div>
          )}

          {/* STEP 3: Supporting Documents & Photos */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <ImageCaptureUpload
                label={hasDamagedPlate ? 'Upload Photos of Instrument & Damaged Nameplate' : 'Upload Supporting Documents'}
                onImageSelected={(file) => setUploadedFiles([...uploadedFiles, file as File])}
              />

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1.5">
                  Attached Files ({uploadedFiles.length})
                </label>
                <div className="space-y-1.5 max-h-32 overflow-y-auto">
                  {uploadedFiles.map((f, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
                    >
                      <span className="font-mono text-[11px] text-slate-700 dark:text-slate-300">
                        {f.name}
                      </span>
                      <button
                        onClick={() => setUploadedFiles(uploadedFiles.filter((_, i) => i !== idx))}
                        className="text-red-500 hover:text-red-700 text-[11px] font-bold cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1 text-xs">
                  Applicant Remarks / Inspection Access Notes
                </label>
                <textarea
                  rows={2}
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="e.g. Operational hours 9 AM - 6 PM. Standard weights hoist available."
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs"
                />
              </div>
            </div>
          )}

          {/* STEP 4: Review & Statutory Submission */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <div className="rounded-2xl bg-[#F7F8F6] dark:bg-slate-900/60 p-4 border border-[#E5EAF0] dark:border-[#1E293B] text-xs space-y-2">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-700 font-bold text-sm text-[#123F66] dark:text-white">
                  <span>Application Summary</span>
                  <span className="text-[#2EAD7B] font-semibold">
                    Fee: ₹{hasDamagedPlate ? '650' : '450'}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-slate-600 dark:text-slate-300">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Verification Type</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-100">
                      {verificationType}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Preferred Date</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-100">
                      {preferredDate}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Applicant & Business</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-100">
                      {applicantName} ({businessName})
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Status on Submit</span>
                    <span className="font-bold text-[#1769AA] dark:text-[#38BDF8]">
                      {hasDamagedPlate ? 'Identification Pending' : 'Pending Review'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-2xl card-sky border border-[#CFE5F5] text-xs text-[#123F63]">
                <p className="font-semibold text-[#1E75AC]">Statutory Undertaking (Rule 14)</p>
                <p className="text-[11px] mt-0.5 text-[#527290]">
                  I hereby declare that the instrument details furnished above are accurate. I agree to keep standard testing provisions and facilities accessible for the verifying officer.
                </p>
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-[#DCEAF4]">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={() => setCurrentStep((prev) => prev - 1)}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#527290] hover:text-[#123F63] cursor-pointer"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back</span>
              </button>
            ) : (
              <div />
            )}

            {currentStep < 4 ? (
              <button
                type="button"
                onClick={() => {
                  if (currentStep === 1 && !selectedInstId && !hasDamagedPlate) {
                    alert('Please select an instrument or check "I don\'t have the instrument serial number"');
                    return;
                  }
                  setCurrentStep((prev) => prev + 1);
                }}
                className="inline-flex items-center gap-1.5 rounded-2xl bg-[#2F8FCC] text-white px-5 py-2.5 text-xs font-bold shadow-soft hover:bg-[#1E75AC] transition-all cursor-pointer"
              >
                <span>Continue</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleSubmit}
                className="inline-flex items-center gap-1.5 rounded-2xl bg-[#1E8E5A] text-white px-6 py-2.5 text-xs font-bold shadow-soft hover:bg-[#177348] transition-all active:scale-98 cursor-pointer"
              >
                <Sparkles className="h-4 w-4" />
                <span>{isSubmitting ? 'Submitting Application...' : 'Confirm & Submit Application'}</span>
              </button>
            )}
          </div>
        </div>
      )}
    </Modal>
  );
};
