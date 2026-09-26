import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  Scale,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Upload,
  AlertTriangle,
  Building,
  User,
  MapPin,
  Calendar,
  Sparkles,
  FileText,
  ShieldAlert,
} from 'lucide-react';
import { applicationService } from '../../services/applicationService';
import { useTranslation } from '../../i18n';
import { LanguageSwitcher } from '../../components/common/LanguageSwitcher';

export const StartInspectionPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState(1);

  // Step 1: Instrument Type
  const [instrumentType, setInstrumentType] = useState('Electronic Scale');

  // Step 2: Instrument Details
  const [manufacturer, setManufacturer] = useState('Essae-Teraoka Ltd.');
  const [model, setModel] = useState('DS-215 POS Weigh');
  const [serialNumber, setSerialNumber] = useState('ES-2026-88129');
  const [capacity, setCapacity] = useState('30 kg');
  const [unit, setUnit] = useState('kg');
  const [noSerialNumber, setNoSerialNumber] = useState(false);

  // Step 3: Owner Details
  const [ownerName, setOwnerName] = useState('Rahul Sharma');
  const [businessName, setBusinessName] = useState('Shanti Grain Stores & Provisions');
  const [mobile, setMobile] = useState('+91 98260 44551');
  const [email, setEmail] = useState('rahul.sharma@indoregrain.in');
  const [address, setAddress] = useState('Shop 14, Bada Sarafa Market');
  const [state, setState] = useState('Madhya Pradesh');
  const [district, setDistrict] = useState('Indore');

  // Step 4: Uploads & Docs
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([
    'instrument_front_photo.jpg',
    'shop_trade_license.pdf',
  ]);
  const [remarks, setRemarks] = useState('');

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedAppId, setSubmittedAppId] = useState<string | null>(null);

  const instrumentTypes = [
    { label: 'Weighing Scale', desc: 'Standard retail or counter scale' },
    { label: 'Platform Scale', desc: 'Heavy duty warehouse or godown platform' },
    { label: 'Electronic Scale', desc: 'Digital sensor & POS integrated scale' },
    { label: 'Mechanical Scale', desc: 'Beam, counterpoise, or spring balance' },
    { label: 'Fuel Dispenser', desc: 'Petrol/diesel retail fuel pump nozzle' },
    { label: 'Measuring Instrument', desc: 'Flow meter, depth gauge, or volume measure' },
    { label: 'Other', desc: 'Specialized industrial metrology unit' },
  ];

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const app = await applicationService.create({
        instrumentId: noSerialNumber ? undefined : `INST-${district.substring(0, 3).toUpperCase()}-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        instrumentType,
        applicantName: ownerName,
        businessName,
        contactNumber: mobile,
        email,
        address,
        district,
        state,
        verificationType: 'Periodic Verification',
        preferredDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
        hasDamagedPlate: noSerialNumber,
        supportingDocs: uploadedFiles,
        remarks: remarks || (noSerialNumber ? 'Serial plate unavailable - field tagging requested' : 'Standard online verification request'),
      });

      setSubmittedAppId(app.id);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F3EA] text-[#183B59] py-8 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Simple Top Bar */}
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
              {t('auth.haveAccount')}
            </Link>
          </div>
        </div>

        {/* Confirmation Screen after submission */}
        {submittedAppId ? (
          <div className="rounded-3xl card-mint p-8 sm:p-12 shadow-soft-card text-center space-y-6 animate-in zoom-in-95 duration-200">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-[#D4F6E5] text-[#1E8E5A] border border-[#CDEFE0] shadow-soft">
              <CheckCircle2 className="h-10 w-10" />
            </div>

            <div className="space-y-2">
              <h2 className="font-outfit text-2xl sm:text-3xl font-extrabold text-[#123F63]">
                {t('apply.successTitle')}
              </h2>
              <p className="text-xs sm:text-sm text-[#527290] max-w-md mx-auto">
                {t('apply.successDesc')}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-[#CDEFE0] max-w-sm mx-auto shadow-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#627B94] block">
                {t('apply.appNumber')}
              </span>
              <span className="font-mono text-xl font-bold text-[#1E75AC]">
                {submittedAppId}
              </span>
              <p className="text-[11px] text-[#627B94] mt-1">
                {t('dashboard.overviewSub')}
              </p>
            </div>

            {noSerialNumber && (
              <div className="max-w-md mx-auto p-3.5 rounded-2xl card-amber text-left text-xs text-[#8A5108] flex items-start gap-2.5">
                <ShieldAlert className="h-5 w-5 text-[#B86C0B] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block">{t('status.pending')}</span>
                  <span>{t('apply.noSerialNotice')}</span>
                </div>
              </div>
            )}

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to={`/my-applications/${submittedAppId}`}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 rounded-2xl bg-[#2F8FCC] hover:bg-[#1E75AC] text-white px-6 py-3 text-xs sm:text-sm font-bold shadow-soft transition-all"
              >
                <span>{t('landing.why2Title')}</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/dashboard"
                className="w-full sm:w-auto rounded-2xl bg-white border border-[#CFE5F5] hover:bg-[#EDF8FE] text-[#123F63] px-6 py-3 text-xs sm:text-sm font-bold transition-all shadow-xs"
              >
                {t('action.goToDashboard')}
              </Link>
            </div>
          </div>
        ) : (
          /* Guided Multi-Step Form */
          <div className="rounded-3xl card-neutral-blue shadow-soft-card overflow-hidden">
            {/* Header */}
            <div className="p-6 sm:p-8 border-b border-[#CFE5F5] space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#1E75AC]">
                Step {currentStep} of 5
              </span>
              <h1 className="font-outfit text-2xl font-extrabold text-[#123F63]">
                Let's get your instrument verified.
              </h1>
              <p className="text-xs text-[#527290]">
                We'll ask for a few details about your instrument. It only takes a few minutes.
              </p>

              {/* Progress Bar */}
              <div className="w-full bg-white h-2 rounded-full mt-4 overflow-hidden border border-[#CFE5F5]">
                <div
                  className="bg-[#2F8FCC] h-full transition-all duration-300 rounded-full"
                  style={{ width: `${(currentStep / 5) * 100}%` }}
                />
              </div>
            </div>

            {/* Form Steps Body */}
            <div className="p-6 sm:p-8">
              {/* STEP 1: Instrument Type */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  <h3 className="font-outfit text-base font-bold text-[#123F63]">
                    What type of instrument is it?
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {instrumentTypes.map((type) => (
                      <div
                        key={type.label}
                        onClick={() => setInstrumentType(type.label)}
                        role="radio"
                        tabIndex={0}
                        aria-checked={instrumentType === type.label}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            setInstrumentType(type.label);
                          }
                        }}
                        className={`p-4 rounded-2xl border cursor-pointer transition-all duration-150 active:scale-[0.99] focus-visible:outline-2 focus-visible:outline-[#2F8FCC] ${
                          instrumentType === type.label
                            ? 'card-sky border-[#2F8FCC] ring-2 ring-[#2F8FCC]/20 shadow-xs'
                            : 'bg-white border-[#CFE5F5] hover:border-[#2F8FCC]/40 hover:bg-[#EDF8FE]/40 hover:-translate-y-0.5'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-[#123F63]">
                            {type.label}
                          </span>
                          {instrumentType === type.label && (
                            <CheckCircle2 className="h-4 w-4 text-[#1E75AC]" />
                          )}
                        </div>
                        <p className="text-[11px] text-[#627B94] mt-1">{type.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 2: Instrument Details & Damaged Plate */}
              {currentStep === 2 && (
                <div className="space-y-4 text-xs">
                  <div className="flex items-center justify-between">
                    <h3 className="font-outfit text-base font-bold text-[#123F63]">
                      Instrument Details
                    </h3>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="noSerialToggle"
                        checked={noSerialNumber}
                        onChange={(e) => setNoSerialNumber(e.target.checked)}
                        className="h-4 w-4 rounded-md border-[#CFE5F5] text-[#2F8FCC] focus:ring-[#2F8FCC]"
                      />
                      <label
                        htmlFor="noSerialToggle"
                        className="text-xs font-semibold text-[#B86C0B] cursor-pointer"
                      >
                        I don't have my serial number
                      </label>
                    </div>
                  </div>

                  {!noSerialNumber ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="font-semibold text-[#123F63] block mb-1">
                          Manufacturer *
                        </label>
                        <input
                          type="text"
                          value={manufacturer}
                          onChange={(e) => setManufacturer(e.target.value)}
                          placeholder="e.g. Essae, Avery, Mettler"
                          className="w-full rounded-xl border border-[#CFE5F5] bg-white px-3.5 py-2.5 text-xs text-[#123F63] focus:outline-none focus:ring-2 focus:ring-[#2F8FCC]"
                        />
                      </div>

                      <div>
                        <label className="font-semibold text-[#123F63] block mb-1">
                          Model *
                        </label>
                        <input
                          type="text"
                          value={model}
                          onChange={(e) => setModel(e.target.value)}
                          placeholder="e.g. DS-215, E1205"
                          className="w-full rounded-xl border border-[#CFE5F5] bg-white px-3.5 py-2.5 text-xs text-[#123F63] focus:outline-none focus:ring-2 focus:ring-[#2F8FCC]"
                        />
                      </div>

                      <div>
                        <label className="font-semibold text-[#123F63] block mb-1">
                          Serial Number (from sticker/plate) *
                        </label>
                        <input
                          type="text"
                          value={serialNumber}
                          onChange={(e) => setSerialNumber(e.target.value)}
                          placeholder="e.g. ES-2024-99824"
                          className="w-full rounded-xl border border-[#CFE5F5] bg-white px-3.5 py-2.5 text-xs font-mono text-[#123F63] focus:outline-none focus:ring-2 focus:ring-[#2F8FCC]"
                        />
                      </div>

                      <div>
                        <label className="font-semibold text-[#123F63] block mb-1">
                          Capacity & Unit *
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={capacity}
                            onChange={(e) => setCapacity(e.target.value)}
                            placeholder="Capacity (e.g. 30 kg)"
                            className="w-2/3 rounded-xl border border-[#CFE5F5] bg-white px-3.5 py-2.5 text-xs text-[#123F63] focus:outline-none focus:ring-2 focus:ring-[#2F8FCC]"
                          />
                          <select
                            value={unit}
                            onChange={(e) => setUnit(e.target.value)}
                            className="w-1/3 rounded-xl border border-[#CFE5F5] bg-white px-3 py-2.5 text-xs text-[#123F63] focus:outline-none focus:ring-2 focus:ring-[#2F8FCC]"
                          >
                            <option>kg</option>
                            <option>g</option>
                            <option>Ton</option>
                            <option>Liters</option>
                            <option>Carats</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* Special Case Flow */
                    <div className="p-4 rounded-2xl card-amber space-y-3">
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="h-5 w-5 text-[#B86C0B] shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold text-[#8A5108]">
                            Missing or Damaged Serial Number Plate
                          </p>
                          <p className="text-[11px] text-[#8A5108]/90 mt-0.5">
                            Do not worry! You don't need to guess or invent a fake serial number. Enter what you know, and upload a photo of the damaged plate in the next step. Our officer will inspect and re-tag your instrument.
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                        <div>
                          <label className="font-semibold text-[#123F63] block mb-1">
                            Manufacturer (if known)
                          </label>
                          <input
                            type="text"
                            value={manufacturer}
                            onChange={(e) => setManufacturer(e.target.value)}
                            placeholder="e.g. Unknown / Local"
                            className="w-full rounded-xl border border-[#CFE5F5] bg-white px-3 py-2 text-xs text-[#123F63]"
                          />
                        </div>
                        <div>
                          <label className="font-semibold text-[#123F63] block mb-1">
                            Approximate Capacity *
                          </label>
                          <input
                            type="text"
                            value={capacity}
                            onChange={(e) => setCapacity(e.target.value)}
                            placeholder="e.g. 30 kg"
                            className="w-full rounded-xl border border-[#CFE5F5] bg-white px-3 py-2 text-xs text-[#123F63]"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* STEP 3: Owner Details */}
              {currentStep === 3 && (
                <div className="space-y-4 text-xs">
                  <h3 className="font-outfit text-base font-bold text-[#123F63]">
                    Owner & Business Details
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="font-semibold text-[#123F63] block mb-1">
                        Your Full Name *
                      </label>
                      <input
                        type="text"
                        value={ownerName}
                        onChange={(e) => setOwnerName(e.target.value)}
                        className="w-full rounded-xl border border-[#CFE5F5] bg-white px-3.5 py-2.5 text-xs text-[#123F63] focus:outline-none focus:ring-2 focus:ring-[#2F8FCC]"
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-[#123F63] block mb-1">
                        Business / Shop Name *
                      </label>
                      <input
                        type="text"
                        value={businessName}
                        onChange={(e) => setBusinessName(e.target.value)}
                        className="w-full rounded-xl border border-[#CFE5F5] bg-white px-3.5 py-2.5 text-xs text-[#123F63] focus:outline-none focus:ring-2 focus:ring-[#2F8FCC]"
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-[#123F63] block mb-1">
                        Mobile Number *
                      </label>
                      <input
                        type="tel"
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value)}
                        className="w-full rounded-xl border border-[#CFE5F5] bg-white px-3.5 py-2.5 text-xs text-[#123F63] focus:outline-none focus:ring-2 focus:ring-[#2F8FCC]"
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-[#123F63] block mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full rounded-xl border border-[#CFE5F5] bg-white px-3.5 py-2.5 text-xs text-[#123F63] focus:outline-none focus:ring-2 focus:ring-[#2F8FCC]"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="font-semibold text-[#123F63] block mb-1">
                        Shop / Physical Address where scale is used *
                      </label>
                      <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full rounded-xl border border-[#CFE5F5] bg-white px-3.5 py-2.5 text-xs text-[#123F63] focus:outline-none focus:ring-2 focus:ring-[#2F8FCC]"
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-[#123F63] block mb-1">
                        State *
                      </label>
                      <input
                        type="text"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        className="w-full rounded-xl border border-[#CFE5F5] bg-white px-3.5 py-2.5 text-xs text-[#123F63] focus:outline-none focus:ring-2 focus:ring-[#2F8FCC]"
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-[#123F63] block mb-1">
                        District *
                      </label>
                      <input
                        type="text"
                        value={district}
                        onChange={(e) => setDistrict(e.target.value)}
                        className="w-full rounded-xl border border-[#CFE5F5] bg-white px-3.5 py-2.5 text-xs text-[#123F63] focus:outline-none focus:ring-2 focus:ring-[#2F8FCC]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 4: Upload Photos & Supporting Docs (Reference Style Dropzone) */}
              {currentStep === 4 && (
                <div className="space-y-4 text-xs">
                  <h3 className="font-outfit text-base font-bold text-[#123F63]">
                    Upload Photos & Documents
                  </h3>
                  <p className="text-[#527290] text-[11px]">
                    Upload clear photos of your instrument, trade license, or past verification stamp if available.
                  </p>

                  <div className="border-2 border-dashed border-[#CFE5F5] rounded-3xl p-8 text-center bg-[#F0F8FD] space-y-3">
                    <div className="h-14 w-14 rounded-full bg-white text-[#1E75AC] border border-[#CFE5F5] flex items-center justify-center shadow-soft mx-auto">
                      <Upload className="h-7 w-7" />
                    </div>
                    <div>
                      <p className="font-bold text-sm text-[#123F63]">
                        Drag and drop instrument photos here
                      </p>
                      <p className="text-[#627B94] text-[11px] mt-0.5">JPG, PNG, WEBP or PDF up to 10MB each</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const newDoc = noSerialNumber ? 'damaged_plate_closeup.jpg' : `instrument_stamp_${Date.now()}.pdf`;
                        setUploadedFiles([...uploadedFiles, newDoc]);
                      }}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#2F8FCC] hover:bg-[#1E75AC] text-white text-xs font-bold shadow-soft transition-colors cursor-pointer"
                    >
                      <Upload className="h-3.5 w-3.5" />
                      <span>Browse Files</span>
                    </button>
                  </div>

                  <div className="space-y-1.5 pt-2">
                    <span className="font-semibold text-[#123F63] block">
                      Attached Files ({uploadedFiles.length})
                    </span>
                    {uploadedFiles.map((file, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-3 rounded-2xl bg-white border border-[#CFE5F5]"
                      >
                        <span className="font-mono text-xs text-[#123F63]">{file}</span>
                        <button
                          type="button"
                          onClick={() => setUploadedFiles(uploadedFiles.filter((_, idx) => idx !== i))}
                          className="text-[#D95C59] hover:text-red-700 font-bold text-xs cursor-pointer"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>

                  <div>
                    <label className="font-semibold text-[#123F63] block mb-1">
                      Remarks / Specific Access Instructions (Optional)
                    </label>
                    <textarea
                      rows={2}
                      value={remarks}
                      onChange={(e) => setRemarks(e.target.value)}
                      placeholder="e.g. Shop open between 10 AM to 8 PM. Please inspect in the morning."
                      className="w-full rounded-xl border border-[#CFE5F5] bg-white px-3.5 py-2.5 text-xs text-[#123F63] focus:outline-none focus:ring-2 focus:ring-[#2F8FCC]"
                    />
                  </div>
                </div>
              )}

              {/* STEP 5: Review & Submit */}
              {currentStep === 5 && (
                <div className="space-y-4 text-xs">
                  <h3 className="font-outfit text-base font-bold text-[#123F63]">
                    Review Your Information
                  </h3>

                  <div className="rounded-2xl card-sky p-5 space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <span className="text-[#627B94] block text-[10px]">Instrument</span>
                        <span className="font-bold text-[#123F63]">
                          {instrumentType} ({capacity} {unit})
                        </span>
                      </div>
                      <div>
                        <span className="text-[#627B94] block text-[10px]">Serial Number</span>
                        <span className="font-mono font-bold text-[#123F63]">
                          {noSerialNumber ? 'Identification Pending' : serialNumber}
                        </span>
                      </div>
                      <div>
                        <span className="text-[#627B94] block text-[10px]">Establishment</span>
                        <span className="font-bold text-[#123F63]">
                          {businessName}
                        </span>
                      </div>
                      <div>
                        <span className="text-[#627B94] block text-[10px]">Owner</span>
                        <span className="font-bold text-[#123F63]">
                          {ownerName} ({mobile})
                        </span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-[#627B94] block text-[10px]">Location</span>
                        <span className="text-[#527290]">
                          {address}, {district}, {state}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-[#EFFAF4] border border-[#CDEFE0] text-[#1E8E5A] text-xs">
                    <p className="font-bold">Official Statutory Processing</p>
                    <p className="text-[11px] mt-0.5 text-[#1E8E5A]/90">
                      Upon submission, an application ID will be assigned and routed to your district Legal Metrology Office for scheduling.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Navigation Buttons Footer */}
            <div className="p-6 sm:p-8 bg-[#EDF8FE]/60 border-t border-[#CFE5F5] flex items-center justify-between">
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={() => setCurrentStep((prev) => prev - 1)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-[#CFE5F5] text-xs font-bold text-[#123F63] hover:bg-[#EDF8FE] active:scale-[0.98] transition-all shadow-xs cursor-pointer"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>{t('action.back')}</span>
                </button>
              ) : (
                <div />
              )}

              {currentStep < 5 ? (
                <button
                  type="button"
                  onClick={() => setCurrentStep((prev) => prev + 1)}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#2F8FCC] hover:bg-[#1E75AC] active:scale-[0.98] text-white px-6 py-2.5 text-xs sm:text-sm font-bold shadow-soft transition-all cursor-pointer"
                >
                  <span>{t('action.next')}</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              ) : (
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleSubmit}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#1E8E5A] hover:bg-[#167046] active:scale-[0.98] text-white px-7 py-3 text-xs sm:text-sm font-bold shadow-soft transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>{isSubmitting ? `${t('action.submit')}...` : t('action.submitApplication')}</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
