import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Camera,
  ArrowLeft,
  Building2,
  Scale,
  FileCheck,
  Save,
  Send,
  Check,
  X,
  BadgeCheck,
} from 'lucide-react';
import { useTranslation } from '../../i18n';
import { LanguageSwitcher } from '../../components/common/LanguageSwitcher';

export const OfficerInspectionWorkspacePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Mobile checklist state
  const [physicalCondition, setPhysicalCondition] = useState<'Good' | 'Damaged'>('Good');
  const [displayStatus, setDisplayStatus] = useState<'Working' | 'Not Working'>('Working');
  const [sealStatus, setSealStatus] = useState<'Intact' | 'Damaged'>('Intact');
  const [idStatus, setIdStatus] = useState<'Clearly visible' | 'Damaged' | 'Missing'>('Clearly visible');

  // Observations
  const [testLoad, setTestLoad] = useState('20.000');
  const [indicatedReading, setIndicatedReading] = useState('20.002');
  const [errorDeviation, setErrorDeviation] = useState('+0.002 kg');

  // Photos
  const [photos, setPhotos] = useState<string[]>([
    'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=400&q=80',
  ]);

  // Remarks
  const [remarks, setRemarks] = useState(
    'Stamped lead verification seal #MP-IND-7782. Instrument satisfies OIML R-76 Class III standard tolerances.'
  );

  // Verification result: PASS or FAIL
  const [result, setResult] = useState<'PASS' | 'FAIL'>('PASS');
  const [failReason, setFailReason] = useState('');

  // Submission state
  const [submitted, setSubmitted] = useState(false);
  const [draftSaved, setDraftSaved] = useState(false);

  const handleAddMockPhoto = () => {
    setPhotos([
      ...photos,
      'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=400&q=80',
    ]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (result === 'FAIL' && !failReason.trim()) {
      alert('Please specify the reason for verification rejection.');
      return;
    }
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#F7F3EA] text-[#183B59] py-12 px-4 font-sans">
        <div className="max-w-xl mx-auto text-center space-y-6">
          <div className="h-20 w-20 rounded-full bg-[#E9F7F0] text-[#36B37E] mx-auto flex items-center justify-center shadow-soft">
            <BadgeCheck className="h-10 w-10" />
          </div>
          <div className="space-y-2">
            <h2 className="font-outfit text-2xl sm:text-3xl font-black text-[#16466F]">
              {result === 'PASS' ? t('inspect.completedNotice') : t('status.rejected')}
            </h2>
            <p className="text-[#718295] text-sm">
              {result === 'PASS'
                ? t('inspect.passDesc')
                : t('inspect.failDesc')}
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-[#E8E3D9] shadow-soft-card text-left space-y-3 font-mono text-xs">
            <div className="flex justify-between">
              <span className="text-[#718295]">{t('dashboard.applicationId')}:</span>
              <span className="font-bold text-[#16466F]">{id || 'APP-2026-000182'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#718295]">{t('inspect.finalDecision')}:</span>
              <span className={`font-black ${result === 'PASS' ? 'text-[#36B37E]' : 'text-[#D95C59]'}`}>
                {result === 'PASS' ? t('status.pass') : t('status.fail')}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#718295]">{t('cert.officerDetails')}:</span>
              <span className="font-bold text-[#183B59]">LMO-MP-042 (Officer Rajesh Sharma)</span>
            </div>
            {result === 'PASS' && (
              <div className="flex justify-between">
                <span className="text-[#718295]">{t('cert.certNo')}:</span>
                <span className="font-bold text-[#17689A]">CERT-2026-000841</span>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            {result === 'PASS' ? (
              <Link
                to="/my-certificates/CERT-2026-000841"
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#17689A] hover:bg-[#16466F] text-white font-bold text-xs shadow-soft transition-colors"
              >
                {t('action.downloadCertificate')}
              </Link>
            ) : null}
            <Link
              to="/officer/dashboard"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white border border-[#E8E3D9] text-[#183B59] font-bold text-xs hover:bg-[#FAF7F0] shadow-soft-card"
            >
              {t('action.goToDashboard')}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F3EA] text-[#183B59] py-6 px-4 font-sans">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Top Mobile Bar with Language Switcher */}
        <div className="flex items-center justify-between">
          <Link
            to="/officer/inspections"
            className="flex items-center gap-1.5 text-xs font-bold text-[#718295] hover:text-[#17689A]"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>{t('action.back')}</span>
          </Link>
          <div className="flex items-center gap-2.5">
            <LanguageSwitcher />
            <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-[#E9F7F0] text-[#238258] border border-[#C5ECD9]">
              {t('officer.badge')}
            </span>
          </div>
        </div>

        {/* Main Title & Instrument Header */}
        <div>
          <h1 className="font-outfit text-2xl sm:text-3xl font-extrabold text-[#16466F]">
            {t('inspect.title')}
          </h1>
          <p className="text-xs text-[#718295] mt-1">
            {t('inspect.subtitle')}
          </p>
        </div>

        {/* Instrument Overview Card */}
        <div className="card-sky rounded-3xl p-5 sm:p-6 shadow-soft-card space-y-4">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <span className="font-mono text-xs font-bold text-[#1E75AC] bg-[#D5EEFB] border border-[#BDE0F7] px-2.5 py-1 rounded-lg">
                {id || 'APP-2026-000182'}
              </span>
              <h2 className="font-outfit text-xl font-bold text-[#123F63]">
                Electronic Weighing Scale (30 kg)
              </h2>
              <p className="text-xs text-[#527290] flex items-center gap-1.5">
                <Building2 className="h-3.5 w-3.5 text-[#1E75AC]" />
                ABC Traders (Mr. Rahul Verma)
              </p>
            </div>
            <div className="h-10 w-10 rounded-2xl bg-[#D5EEFB] text-[#1E75AC] border border-[#BDE0F7] flex items-center justify-center shrink-0 shadow-xs">
              <Scale className="h-5 w-5" />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-[#CFE5F5] text-xs">
            <div>
              <span className="text-[#627B94] block text-[10px] uppercase font-bold">{t('apply.manufacturer')}</span>
              <span className="font-semibold text-[#123F63]">Avery Weigh-Tronix</span>
            </div>
            <div>
              <span className="text-[#627B94] block text-[10px] uppercase font-bold">{t('apply.model')}</span>
              <span className="font-semibold text-[#123F63]">ProScale-30D</span>
            </div>
            <div>
              <span className="text-[#627B94] block text-[10px] uppercase font-bold">{t('cert.serialNo')}</span>
              <span className="font-mono font-semibold text-[#123F63]">AV-2024-9981</span>
            </div>
            <div>
              <span className="text-[#627B94] block text-[10px] uppercase font-bold">{t('cert.address')}</span>
              <span className="font-semibold text-[#123F63]">Sarafa Bazar, Indore</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* SECTION 1: Field Inspection Touch Checklist */}
          <div className="card-neutral-blue rounded-3xl p-5 sm:p-6 shadow-soft-card space-y-5">
            <h3 className="font-outfit text-base font-bold text-[#123F63] flex items-center gap-2">
              <div className="p-1 rounded-md bg-[#D5EEFB] text-[#1E75AC]">
                <FileCheck className="h-4 w-4" />
              </div>
              <span>{t('inspect.checklist')}</span>
            </h3>

            {/* 1. Physical Condition */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#123F63]">
                1. {t('inspect.physicalCondition')}
              </label>
              <div className="grid grid-cols-2 gap-3">
                {(['Good', 'Damaged'] as const).map((opt) => (
                  <button
                    type="button"
                    key={opt}
                    onClick={() => setPhysicalCondition(opt)}
                    className={`py-3.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 border transition-all ${
                      physicalCondition === opt
                        ? opt === 'Good'
                          ? 'bg-[#EFFAF4] border-[#CDEFE0] text-[#1E8E5A] shadow-xs'
                          : 'bg-[#FCECEC] border-[#F8C8C6] text-[#A62F2C] shadow-xs'
                        : 'bg-white border-[#DCEAF4] text-[#627B94] hover:bg-[#F0F8FD]'
                    }`}
                  >
                    {opt === 'Good' ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                    <span>{opt === 'Good' ? t('status.intact') : t('status.damaged')}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Display */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#123F63]">
                2. {t('inspect.displayWorking')}
              </label>
              <div className="grid grid-cols-2 gap-3">
                {(['Working', 'Not Working'] as const).map((opt) => (
                  <button
                    type="button"
                    key={opt}
                    onClick={() => setDisplayStatus(opt)}
                    className={`py-3.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 border transition-all ${
                      displayStatus === opt
                        ? opt === 'Working'
                          ? 'bg-[#EFFAF4] border-[#CDEFE0] text-[#1E8E5A] shadow-xs'
                          : 'bg-[#FCECEC] border-[#F8C8C6] text-[#A62F2C] shadow-xs'
                        : 'bg-white border-[#DCEAF4] text-[#627B94] hover:bg-[#F0F8FD]'
                    }`}
                  >
                    {opt === 'Working' ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                    <span>{opt === 'Working' ? t('status.intact') : t('status.damaged')}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Verification Seal */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#123F63]">
                3. {t('inspect.leadSealStatus')}
              </label>
              <div className="grid grid-cols-2 gap-3">
                {(['Intact', 'Damaged'] as const).map((opt) => (
                  <button
                    type="button"
                    key={opt}
                    onClick={() => setSealStatus(opt)}
                    className={`py-3.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 border transition-all ${
                      sealStatus === opt
                        ? opt === 'Intact'
                          ? 'bg-[#EFFAF4] border-[#CDEFE0] text-[#1E8E5A] shadow-xs'
                          : 'bg-[#FCECEC] border-[#F8C8C6] text-[#A62F2C] shadow-xs'
                        : 'bg-white border-[#DCEAF4] text-[#627B94] hover:bg-[#F0F8FD]'
                    }`}
                  >
                    {opt === 'Intact' ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                    <span>{opt === 'Intact' ? t('status.intact') : t('status.damaged')}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 4. Identification Plate */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#123F63]">
                4. {t('inspect.serialVisibility')}
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['Clearly visible', 'Damaged', 'Missing'] as const).map((opt) => (
                  <button
                    type="button"
                    key={opt}
                    onClick={() => setIdStatus(opt)}
                    className={`py-3 px-2 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 border text-center transition-all ${
                      idStatus === opt
                        ? opt === 'Clearly visible'
                          ? 'bg-[#EFFAF4] border-[#CDEFE0] text-[#1E8E5A] shadow-xs'
                          : 'bg-[#FFF7E8] border-[#FCE3BA] text-[#B86C0B] shadow-xs'
                        : 'bg-white border-[#DCEAF4] text-[#627B94] hover:bg-[#F0F8FD]'
                    }`}
                  >
                    <span>{opt === 'Clearly visible' ? t('status.intact') : opt === 'Damaged' ? t('status.damaged') : t('status.pending')}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* SECTION 2: Measurement & Test Observations */}
          <div className="card-neutral-blue rounded-3xl p-5 sm:p-6 shadow-soft-card space-y-4">
            <h3 className="font-outfit text-base font-bold text-[#123F63] flex items-center gap-2">
              <div className="p-1 rounded-md bg-[#D5EEFB] text-[#1E75AC]">
                <Scale className="h-4 w-4" />
              </div>
              <span>{t('inspect.testLoad')} / {t('inspect.errorDeviation')}</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div>
                <label className="block text-xs font-semibold text-[#123F63] mb-1">
                  {t('inspect.testLoad')}
                </label>
                <input
                  type="text"
                  value={testLoad}
                  onChange={(e) => setTestLoad(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white border border-[#DCEAF4] text-xs font-mono font-bold text-[#123F63] focus:outline-none focus:ring-2 focus:ring-[#2F8FCC]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#123F63] mb-1">
                  {t('inspect.indicatedReading')}
                </label>
                <input
                  type="text"
                  value={indicatedReading}
                  onChange={(e) => setIndicatedReading(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white border border-[#DCEAF4] text-xs font-mono font-bold text-[#123F63] focus:outline-none focus:ring-2 focus:ring-[#2F8FCC]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#123F63] mb-1">
                  {t('inspect.errorDeviation')}
                </label>
                <input
                  type="text"
                  value={errorDeviation}
                  onChange={(e) => setErrorDeviation(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white border border-[#DCEAF4] text-xs font-mono font-bold text-[#123F63] focus:outline-none focus:ring-2 focus:ring-[#2F8FCC]"
                />
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#EFFAF4] border border-[#CDEFE0] flex items-center justify-between text-xs">
              <span className="font-semibold text-[#1E8E5A]">
                {t('inspect.toleranceResult')}:
              </span>
              <span className="font-bold text-[#1E8E5A]">{t('status.pass')}</span>
            </div>
          </div>

          {/* SECTION 3: Field Photos */}
          <div className="card-lavender rounded-3xl p-5 sm:p-6 shadow-soft-card space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-outfit text-base font-bold text-[#123F63] flex items-center gap-2">
                <div className="p-1 rounded-md bg-[#E6E1FD] text-[#5B5FC7]">
                  <Camera className="h-4 w-4" />
                </div>
                <span>{t('inspect.capturePhotos')}</span>
              </h3>
              <span className="text-xs text-[#627B94]">{photos.length} captured</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {photos.map((url, idx) => (
                <div
                  key={idx}
                  className="relative rounded-2xl overflow-hidden aspect-video border border-[#E0DCFB] shadow-xs group"
                >
                  <img src={url} alt={`Evidence ${idx + 1}`} className="w-full h-full object-cover" />
                  <span className="absolute bottom-1.5 left-1.5 text-[9px] font-bold bg-black/60 text-white px-2 py-0.5 rounded">
                    Photo #{idx + 1}
                  </span>
                </div>
              ))}

              <button
                type="button"
                onClick={handleAddMockPhoto}
                className="border-2 border-dashed border-[#CCE2F5] bg-white/70 rounded-2xl aspect-video flex flex-col items-center justify-center gap-1 text-[#627B94] hover:border-[#2F8FCC] hover:bg-white transition-all cursor-pointer"
              >
                <Camera className="h-5 w-5 text-[#2F8FCC]" />
                <span className="text-[11px] font-bold text-[#123F63]">{t('inspect.addPhoto')}</span>
              </button>
            </div>
          </div>

          {/* SECTION 4: Remarks */}
          <div className="card-neutral-blue rounded-3xl p-5 sm:p-6 shadow-soft-card space-y-2">
            <label className="block text-xs font-bold text-[#123F63]">
              {t('inspect.officerRemarks')}
            </label>
            <textarea
              rows={2}
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white border border-[#DCEAF4] text-xs font-medium text-[#123F63] focus:outline-none focus:ring-2 focus:ring-[#2F8FCC]"
            />
          </div>

          {/* SECTION 5: Verification Result (PASS / FAIL) */}
          <div className="card-greeting rounded-3xl p-6 shadow-soft-card space-y-4">
            <div>
              <h3 className="font-outfit text-base font-bold text-[#123F63]">
                {t('inspect.finalDecision')}
              </h3>
              <p className="text-xs text-[#627B94]">
                {t('officer.standardsSub')}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setResult('PASS')}
                className={`py-4 px-6 rounded-xl font-bold text-sm flex items-center justify-center gap-3 transition-all duration-150 cursor-pointer active:scale-[0.98] ${
                  result === 'PASS'
                    ? 'bg-[#1E8E5A] text-white shadow-soft'
                    : 'bg-white text-[#627B94] border border-[#DCEAF4] hover:bg-[#EFFAF4] hover:text-[#1E8E5A] hover:border-[#CDEFE0]'
                }`}
              >
                <CheckCircle2 className="h-6 w-6" />
                <span>{t('status.pass')}</span>
              </button>

              <button
                type="button"
                onClick={() => setResult('FAIL')}
                className={`py-4 px-6 rounded-xl font-bold text-sm flex items-center justify-center gap-3 transition-all duration-150 cursor-pointer active:scale-[0.98] ${
                  result === 'FAIL'
                    ? 'bg-[#D95C59] text-white shadow-soft'
                    : 'bg-white text-[#627B94] border border-[#DCEAF4] hover:bg-[#FCECEC] hover:text-[#A62F2C] hover:border-[#F8C8C6]'
                }`}
              >
                <XCircle className="h-6 w-6" />
                <span>{t('status.fail')}</span>
              </button>
            </div>

            {/* Conditional FAIL reason */}
            {result === 'FAIL' && (
              <div className="p-4 rounded-2xl bg-[#FCECEC] border border-[#F8C8C6] space-y-2">
                <label className="block text-xs font-bold text-[#A62F2C]">
                  {t('inspect.failDesc')}
                </label>
                <textarea
                  required
                  rows={2}
                  value={failReason}
                  onChange={(e) => setFailReason(e.target.value)}
                  placeholder="Explain rejection reason..."
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#F8C8C6] text-xs font-medium text-[#183B59] focus:outline-none focus:ring-2 focus:ring-[#D95C59]"
                />
              </div>
            )}
          </div>

          {/* Bottom Actions: Save Draft & Submit */}
          <div className="flex items-center justify-between gap-4 pt-4">
            <button
              type="button"
              onClick={() => {
                setDraftSaved(true);
                setTimeout(() => setDraftSaved(false), 2500);
              }}
              className="px-5 py-3.5 rounded-xl bg-white border border-[#CFE5F5] text-[#123F63] font-bold text-xs flex items-center gap-2 hover:bg-[#EDF8FE] hover:border-[#2F8FCC] active:scale-[0.98] transition-all shadow-xs cursor-pointer"
            >
              <Save className="h-4 w-4 text-[#2F8FCC]" />
              <span>{draftSaved ? '✓ Saved' : t('action.saveDraft')}</span>
            </button>

            <button
              type="submit"
              className="flex-1 sm:flex-none px-8 py-3.5 rounded-xl bg-[#2F8FCC] hover:bg-[#1E75AC] active:scale-[0.98] text-white font-bold text-xs shadow-soft transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Send className="h-4 w-4" />
              <span>{t('inspect.completeVerification')}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
