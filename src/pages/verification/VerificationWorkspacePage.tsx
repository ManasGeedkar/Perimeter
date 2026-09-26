import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ShieldCheck,
  Scale,
  MapPin,
  Camera,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Upload,
  User,
  Building,
  Calendar,
  Save,
  Send,
  Plus,
  Trash2,
  Fingerprint,
  RotateCcw,
  Sparkles,
  ArrowLeft,
  Navigation,
} from 'lucide-react';
import { mockApplications } from '../../data/mockApplications';
import { mockInstruments } from '../../data/mockInstruments';
import { verificationService, DEFAULT_TEST_OBSERVATIONS } from '../../services/verificationService';
import { TestObservation, Application } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import { useAuth } from '../../context/AuthContext';

export const VerificationWorkspacePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  // If no ID passed, select first pending/scheduled application or default
  const activeAppId = id || mockApplications[0]?.id;
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);

  // Verification Checklist States
  const [physicalCondition, setPhysicalCondition] = useState<'Pass' | 'Fail' | 'Needs Repair'>('Pass');
  const [displayAccuracy, setDisplayAccuracy] = useState<'Pass' | 'Fail'>('Pass');
  const [sealStatus, setSealStatus] = useState<'Yes' | 'No' | 'Tampered' | 'Replaced'>('Yes');
  const [identificationVerified, setIdentificationVerified] = useState<'Verified' | 'Pending Identification' | 'Re-tagged'>('Verified');

  // Test Observations Table
  const [testRows, setTestRows] = useState<TestObservation[]>([...DEFAULT_TEST_OBSERVATIONS]);

  // Field details
  const [photos, setPhotos] = useState<string[]>([
    'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=400&q=80',
  ]);
  const [gpsCoords, setGpsCoords] = useState({ lat: 22.7196, lng: 75.8577 });
  const [remarks, setRemarks] = useState('Standard verification test completed as per Legal Metrology (General) Rules. Standard lead seal stamped.');
  const [failureReason, setFailureReason] = useState('');
  const [overallResult, setOverallResult] = useState<'PASS' | 'FAIL'>('PASS');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successCertificateId, setSuccessCertificateId] = useState<string | null>(null);

  useEffect(() => {
    const found = mockApplications.find((a) => a.id === activeAppId);
    if (found) {
      setSelectedApp(found);
      if (found.hasDamagedPlate) {
        setIdentificationVerified('Re-tagged');
        setRemarks('SPECIAL CASE: Damaged serial number plate inspected. Applied official re-tagging barcode.');
      }
    }
  }, [activeAppId]);

  const handleAddTestRow = () => {
    const newRow: TestObservation = {
      id: `${Date.now()}`,
      testLoad: '20 kg (2/3 Max)',
      indicatedValue: '20.000 kg',
      error: '0.000 kg',
      allowableError: '± 0.002 kg',
      passed: true,
    };
    setTestRows([...testRows, newRow]);
  };

  const handleRemoveTestRow = (rowId: string) => {
    setTestRows(testRows.filter((r) => r.id !== rowId));
  };

  const handleDetectGPS = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setGpsCoords({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
        },
        () => {
          // Fallback simulation
          setGpsCoords({ lat: 22.7196 + (Math.random() * 0.01 - 0.005), lng: 75.8577 + (Math.random() * 0.01 - 0.005) });
        }
      );
    }
  };

  const handleSubmitVerification = async () => {
    if (overallResult === 'FAIL' && !failureReason.trim()) {
      alert('Statutory Requirement: A detailed failure reason is mandatory for FAIL results under Section 24.');
      return;
    }

    if (!selectedApp) return;

    setIsSubmitting(true);
    try {
      const res = await verificationService.submitVerification({
        applicationId: selectedApp.id,
        instrumentId: selectedApp.instrumentId,
        officerId: user.id,
        officerName: user.name,
        verificationCentre: 'Indore Central Metrology Lab (GATC-01)',
        inspectionDate: new Date().toISOString().split('T')[0],
        physicalConditionStatus: physicalCondition,
        displayAccuracyStatus: displayAccuracy,
        sealIntact: sealStatus,
        identificationVerified,
        testObservations: testRows,
        photos,
        remarks,
        overallResult,
        failureReason: overallResult === 'FAIL' ? failureReason : undefined,
        digitalSignature: `DIGITAL_SIG_${user.name.toUpperCase().replace(/\s+/g, '_')}_${Date.now()}`,
        gpsCoordinates: gpsCoords,
      });

      if (res.certificateId) {
        setSuccessCertificateId(res.certificateId);
      } else {
        alert('Verification saved with FAIL status. Notice served to applicant.');
        navigate('/applications');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 card-greeting p-6 rounded-3xl border border-[#CCE3F3] shadow-soft-card">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/applications')}
            className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white border border-[#CFE5F5] hover:bg-[#EDF8FE] text-[#123F63] transition-colors cursor-pointer"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="font-outfit text-xl sm:text-2xl font-extrabold text-[#123F63]">
                Field Verification Workspace
              </h1>
              <span className="text-xs bg-[#EDF8FE] text-[#1E75AC] border border-[#CFE5F5] px-2.5 py-0.5 rounded-full font-bold">
                LMO / GATC Mode
              </span>
            </div>
            <p className="text-xs text-[#527290] mt-0.5">
              Conduct standard weight testing, seal integrity audit, and digital certification stamping
            </p>
          </div>
        </div>

        {/* Quick Application Switcher Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-[#527290] hidden sm:inline">Active App:</span>
          <select
            value={selectedApp?.id || ''}
            onChange={(e) => navigate(`/verification/${e.target.value}`)}
            className="rounded-2xl border border-[#CFE5F5] bg-white px-3.5 py-2 text-xs font-bold text-[#1E75AC] focus:outline-hidden"
          >
            {mockApplications.map((a) => (
              <option key={a.id} value={a.id}>
                {a.id} — {a.businessName} ({a.instrumentType})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Success Modal / Banner upon PASS verification */}
      {successCertificateId && (
        <div className="rounded-3xl card-mint border border-[#CDEFE0] p-6 text-center space-y-3">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#1E8E5A] text-white shadow-soft">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <h3 className="font-outfit text-xl font-bold text-[#1E8E5A]">
            Verification Passed & e-Certificate Generated!
          </h3>
          <p className="text-xs text-[#123F63] max-w-lg mx-auto">
            Instrument passed all Maximum Permissible Error (MPE) tolerances. Digital certificate <span className="font-mono font-bold">{successCertificateId}</span> has been signed with SHA-256 seal.
          </p>
          <div className="pt-2 flex justify-center gap-3">
            <Link
              to={`/certificates/${successCertificateId}`}
              className="px-6 py-2.5 rounded-2xl bg-[#2F8FCC] hover:bg-[#1E75AC] text-white font-bold text-xs shadow-soft transition-all cursor-pointer"
            >
              View & Print Certificate →
            </Link>
            <button
              onClick={() => {
                setSuccessCertificateId(null);
                navigate('/certificates');
              }}
              className="px-5 py-2.5 rounded-2xl bg-white text-[#123F63] font-bold text-xs border border-[#CFE5F5] cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Overview Cards: Assignment & Instrument Header (Section 22) */}
      {selectedApp && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-2xl card-lavender p-4 border border-[#E0DCFB] shadow-soft-card">
            <span className="text-[11px] text-[#646A94] font-medium block">Application & Type</span>
            <p className="font-mono font-bold text-xs text-[#5B5FC7] mt-0.5">
              {selectedApp.id}
            </p>
            <p className="text-xs font-semibold text-[#123F63] mt-1">
              {selectedApp.verificationType}
            </p>
          </div>

          <div className="rounded-2xl card-sky p-4 border border-[#CFE5F5] shadow-soft-card">
            <span className="text-[11px] text-[#527290] font-medium block">Instrument Linked</span>
            <Link
              to={`/instruments/${selectedApp.instrumentId}`}
              className="font-mono font-bold text-xs text-[#1E75AC] hover:underline block mt-0.5 cursor-pointer"
            >
              {selectedApp.instrumentId}
            </Link>
            <p className="text-xs font-medium text-[#123F63] mt-1 truncate">
              {selectedApp.instrumentType}
            </p>
          </div>

          <div className="rounded-2xl card-neutral-blue p-4 border border-[#DCEAF4] shadow-soft-card">
            <span className="text-[11px] text-[#527290] font-medium block">Applicant & Premise</span>
            <p className="text-xs font-bold text-[#123F63] mt-0.5 truncate">
              {selectedApp.businessName}
            </p>
            <p className="text-[11px] text-[#527290] mt-1 truncate">
              {selectedApp.address}, {selectedApp.district}
            </p>
          </div>

          <div className="rounded-2xl card-mint p-4 border border-[#CDEFE0] shadow-soft-card">
            <span className="text-[11px] text-[#246A48] font-medium block">Assigned Officer</span>
            <p className="text-xs font-bold text-[#123F63] mt-0.5">
              {user.name} ({user.roleBadge})
            </p>
            <p className="text-[11px] text-[#1E8E5A] font-semibold mt-1">
              Inspection Date: Today
            </p>
          </div>
        </div>
      )}

      {/* Main Inspection Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Checklist & Test Observations */}
        <div className="lg:col-span-2 space-y-6">
          {/* Section A: Statutory Physical & Seal Checklist (Section 22) */}
          <div className="rounded-3xl card-neutral-blue p-6 border border-[#DCEAF4] shadow-soft-card space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#DCEAF4]">
              <h3 className="font-outfit text-base font-bold text-[#123F63]">
                1. Physical & Visual Examination Checklist
              </h3>
              <span className="text-xs font-bold text-[#527290]">Step 1 of 3</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              {/* Physical Condition */}
              <div className="p-4 rounded-2xl bg-white border border-[#CFE5F5] space-y-2">
                <label className="font-bold text-[#123F63] block">
                  Physical Condition & Level Bubble *
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {(['Pass', 'Needs Repair', 'Fail'] as const).map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setPhysicalCondition(opt)}
                      className={`py-2 px-1 rounded-xl text-xs font-bold transition-all text-center cursor-pointer ${
                        physicalCondition === opt
                          ? opt === 'Pass'
                            ? 'bg-[#1E8E5A] text-white'
                            : opt === 'Needs Repair'
                            ? 'bg-[#B86C0B] text-white'
                            : 'bg-[#C7493A] text-white'
                          : 'bg-[#F0F8FD] text-[#527290] border border-[#CFE5F5] hover:bg-[#E2F0F9]'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Display Accuracy */}
              <div className="p-4 rounded-2xl bg-white border border-[#CFE5F5] space-y-2">
                <label className="font-bold text-[#123F63] block">
                  Display / Zero Tracking *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(['Pass', 'Fail'] as const).map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setDisplayAccuracy(opt)}
                      className={`py-2 rounded-xl text-xs font-bold transition-all text-center cursor-pointer ${
                        displayAccuracy === opt
                          ? opt === 'Pass'
                            ? 'bg-[#1E8E5A] text-white'
                            : 'bg-[#C7493A] text-white'
                          : 'bg-[#F0F8FD] text-[#527290] border border-[#CFE5F5] hover:bg-[#E2F0F9]'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Security Seal Intactness */}
              <div className="p-4 rounded-2xl bg-white border border-[#CFE5F5] space-y-2">
                <label className="font-bold text-[#123F63] block">
                  Security Lead Seal Intact? *
                </label>
                <div className="grid grid-cols-4 gap-1">
                  {(['Yes', 'No', 'Tampered', 'Replaced'] as const).map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setSealStatus(opt)}
                      className={`py-2 px-1 rounded-xl text-[11px] font-bold transition-all text-center cursor-pointer ${
                        sealStatus === opt
                          ? opt === 'Yes'
                            ? 'bg-[#1E8E5A] text-white'
                            : opt === 'Replaced'
                            ? 'bg-[#2F8FCC] text-white'
                            : 'bg-[#C7493A] text-white'
                          : 'bg-[#F0F8FD] text-[#527290] border border-[#CFE5F5] hover:bg-[#E2F0F9]'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Identification Plate Verification (Special Case handling) */}
              <div className="p-4 rounded-2xl bg-white border border-[#CFE5F5] space-y-2">
                <label className="font-bold text-[#123F63] block">
                  Nameplate / Serial Tag Status *
                </label>
                <div className="grid grid-cols-3 gap-1">
                  {(['Verified', 'Pending Identification', 'Re-tagged'] as const).map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setIdentificationVerified(opt)}
                      className={`py-2 px-1 rounded-xl text-[10px] font-bold transition-all text-center cursor-pointer ${
                        identificationVerified === opt
                          ? opt === 'Verified'
                            ? 'bg-[#1E8E5A] text-white'
                            : opt === 'Re-tagged'
                            ? 'bg-[#2F8FCC] text-white'
                            : 'bg-[#B86C0B] text-white'
                          : 'bg-[#F0F8FD] text-[#527290] border border-[#CFE5F5] hover:bg-[#E2F0F9]'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Section B: Standard Weights Test Observations Table (Section 22 & 23) */}
          <div className="rounded-3xl card-neutral-blue p-6 border border-[#DCEAF4] shadow-soft-card space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#DCEAF4]">
              <div>
                <h3 className="font-outfit text-base font-bold text-[#123F63]">
                  2. Standard Test Load Observations & MPE Tolerance
                </h3>
                <p className="text-xs text-[#527290]">
                  Record test readings against OIML standard weights
                </p>
              </div>

              <button
                type="button"
                onClick={handleAddTestRow}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#EDF8FE] hover:bg-[#E2F0F9] text-[#1E75AC] border border-[#CFE5F5] text-xs font-bold transition-colors cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add Test Row</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#CFE5F5] bg-[#EDF8FE] text-[#123F63] font-bold uppercase tracking-wider text-[11px]">
                    <th className="py-2.5 px-3">Test Load Applied</th>
                    <th className="py-2.5 px-3">Indicated Value</th>
                    <th className="py-2.5 px-3">Calculated Error</th>
                    <th className="py-2.5 px-3">Allowable MPE</th>
                    <th className="py-2.5 px-3 text-center">Result</th>
                    <th className="py-2.5 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#DCEAF4] font-mono">
                  {testRows.map((row, index) => (
                    <tr key={row.id}>
                      <td className="py-2.5 px-2">
                        <input
                          type="text"
                          value={row.testLoad}
                          onChange={(e) => {
                            const updated = [...testRows];
                            updated[index].testLoad = e.target.value;
                            setTestRows(updated);
                          }}
                          className="w-full rounded-lg border border-[#CFE5F5] bg-white px-2.5 py-1 text-xs font-sans text-[#123F63]"
                        />
                      </td>

                      <td className="py-2.5 pr-2">
                        <input
                          type="text"
                          value={row.indicatedValue}
                          onChange={(e) => {
                            const updated = [...testRows];
                            updated[index].indicatedValue = e.target.value;
                            setTestRows(updated);
                          }}
                          className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-2.5 py-1 text-xs"
                        />
                      </td>

                      <td className="py-2.5 pr-2">
                        <input
                          type="text"
                          value={row.error}
                          onChange={(e) => {
                            const updated = [...testRows];
                            updated[index].error = e.target.value;
                            setTestRows(updated);
                          }}
                          className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-2.5 py-1 text-xs"
                        />
                      </td>

                      <td className="py-2.5 pr-2 text-slate-500">
                        {row.allowableError}
                      </td>

                      <td className="py-2.5 text-center">
                        <button
                          type="button"
                          onClick={() => {
                            const updated = [...testRows];
                            updated[index].passed = !updated[index].passed;
                            setTestRows(updated);
                          }}
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            row.passed
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300'
                              : 'bg-red-100 text-red-800 dark:bg-red-950/40 dark:text-red-300'
                          }`}
                        >
                          {row.passed ? 'PASS' : 'FAIL'}
                        </button>
                      </td>

                      <td className="py-2.5 text-right">
                        <button
                          type="button"
                          onClick={() => handleRemoveTestRow(row.id)}
                          className="text-slate-400 hover:text-red-500 p-1"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Col: Field Controls, GPS, Photos, Pass/Fail Certification */}
        <div className="space-y-6">
          {/* Geo Coordinates Tag (Section 23) */}
          <div className="rounded-3xl card-sky p-6 border border-[#CFE5F5] shadow-soft-card space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#CFE5F5]">
              <span className="text-xs font-bold text-[#123F63]">
                GPS Verification Tag
              </span>
              <button
                type="button"
                onClick={handleDetectGPS}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-[#2F8FCC] hover:text-[#1E75AC] hover:underline cursor-pointer"
              >
                <Navigation className="h-3 w-3" />
                <span>Detect GPS</span>
              </button>
            </div>

            <div className="p-3 rounded-2xl bg-white border border-[#CFE5F5] text-xs font-mono text-[#123F63]">
              <div className="flex items-center justify-between">
                <span className="text-[#527290]">Latitude:</span>
                <span className="font-bold">{gpsCoords.lat.toFixed(5)} N</span>
              </div>
              <div className="flex items-center justify-between mt-1">
                <span className="text-[#527290]">Longitude:</span>
                <span className="font-bold">{gpsCoords.lng.toFixed(5)} E</span>
              </div>
            </div>
          </div>

          {/* Inspection Photos (Section 23) */}
          <div className="rounded-3xl card-lavender p-6 border border-[#E0DCFB] shadow-soft-card space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#E0DCFB]">
              <span className="text-xs font-bold text-[#123F63]">
                Field Photos ({photos.length})
              </span>
              <button
                type="button"
                onClick={() => {
                  setPhotos([
                    ...photos,
                    'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=400&q=80',
                  ]);
                }}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-[#5B5FC7] hover:underline cursor-pointer"
              >
                <Camera className="h-3 w-3" />
                <span>+ Capture</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {photos.map((url, i) => (
                <div key={i} className="relative rounded-xl overflow-hidden aspect-video border border-[#E0DCFB]">
                  <img src={url} alt="Inspection Photo" className="w-full h-full object-cover" />
                  <span className="absolute bottom-1 left-1 bg-black/60 text-white text-[9px] px-1.5 py-0.2 rounded-sm font-mono">
                    Photo #{i + 1}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Overall Decision: PASS vs FAIL (Section 22) */}
          <div className="rounded-3xl card-greeting p-6 border border-[#CCE3F3] shadow-soft-card space-y-4">
            <h4 className="font-outfit text-base font-bold text-[#123F63]">
              Final Verification Verdict
            </h4>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setOverallResult('PASS')}
                className={`py-3 rounded-2xl flex flex-col items-center justify-center gap-1 font-bold text-xs transition-all cursor-pointer ${
                  overallResult === 'PASS'
                    ? 'bg-[#1E8E5A] text-white shadow-soft ring-4 ring-[#1E8E5A]/20'
                    : 'bg-white text-[#527290] border border-[#CCE3F3] hover:bg-[#EDF8FE]'
                }`}
              >
                <CheckCircle2 className="h-5 w-5" />
                <span>PASS & STAMP</span>
              </button>

              <button
                type="button"
                onClick={() => setOverallResult('FAIL')}
                className={`py-3 rounded-2xl flex flex-col items-center justify-center gap-1 font-bold text-xs transition-all cursor-pointer ${
                  overallResult === 'FAIL'
                    ? 'bg-[#C7493A] text-white shadow-soft ring-4 ring-[#C7493A]/20'
                    : 'bg-white text-[#527290] border border-[#CCE3F3] hover:bg-[#EDF8FE]'
                }`}
              >
                <XCircle className="h-5 w-5" />
                <span>REJECT / FAIL</span>
              </button>
            </div>

            {overallResult === 'FAIL' && (
              <div className="space-y-1 animate-in fade-in">
                <label className="text-xs font-bold text-[#C7493A] block">
                  Statutory Failure Reason (Required) *
                </label>
                <textarea
                  rows={2}
                  required
                  value={failureReason}
                  onChange={(e) => setFailureReason(e.target.value)}
                  placeholder="State exact clause or error deviation (e.g. Corner eccentricity error exceeded 2e tolerance)..."
                  className="w-full rounded-xl border border-red-300 bg-white p-2 text-xs text-red-900"
                />
              </div>
            )}

            <div>
              <label className="text-xs font-semibold text-[#123F63] block mb-1">
                LMO Final Remarks & Certificate Notes
              </label>
              <textarea
                rows={2}
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                className="w-full rounded-xl border border-[#CCE3F3] bg-white p-2 text-xs text-[#123F63]"
              />
            </div>

            {/* Action Buttons */}
            <div className="pt-2 space-y-2">
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleSubmitVerification}
                className={`w-full py-3 rounded-2xl text-white font-bold text-xs shadow-soft transition-all active:scale-98 flex items-center justify-center gap-2 cursor-pointer ${
                  overallResult === 'PASS'
                    ? 'bg-[#1E8E5A] hover:bg-[#177348]'
                    : 'bg-[#C7493A] hover:bg-[#A8382B]'
                }`}
              >
                <Fingerprint className="h-4 w-4" />
                <span>
                  {isSubmitting
                    ? 'Submitting & Digitally Signing...'
                    : overallResult === 'PASS'
                    ? 'Authorize & Issue Certificate'
                    : 'Submit Formal Rejection Notice'}
                </span>
              </button>

              <button
                type="button"
                onClick={() => alert('Draft saved successfully to offline browser cache.')}
                className="w-full py-2 rounded-xl bg-white border border-[#CCE3F3] hover:bg-[#EDF8FE] text-[#123F63] font-semibold text-xs transition-colors cursor-pointer"
              >
                Save Draft
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
