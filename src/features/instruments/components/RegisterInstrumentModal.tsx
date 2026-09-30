import React, { useState } from 'react';
import { Modal } from '../../../components/common/Modal';
import { ImageCaptureUpload } from '../../../components/common/ImageCaptureUpload';
import { instrumentService } from '../api';
import { Instrument } from '../types';

interface RegisterInstrumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegistered?: (instrument: Instrument) => void;
}

export const RegisterInstrumentModal: React.FC<RegisterInstrumentModalProps> = ({
  isOpen,
  onClose,
  onRegistered,
}) => {
  const [type, setType] = useState('Electronic Weighing Scale');
  const [manufacturer, setManufacturer] = useState('Essae-Teraoka Ltd.');
  const [model, setModel] = useState('DS-852 Table Top');
  const [serialNumber, setSerialNumber] = useState(`ES-2026-${Math.floor(10000 + Math.random() * 90000)}`);
  const [capacity, setCapacity] = useState('30 kg');
  const [unit, setUnit] = useState('kg (e=1g)');
  const [accuracyClass, setAccuracyClass] = useState<Instrument['accuracyClass']>('Class III (Medium)');

  const [businessName, setBusinessName] = useState('Kisan Agro Commodities Pvt Ltd');
  const [ownerName, setOwnerName] = useState('Mahendra Patel');
  const [contactPhone, setContactPhone] = useState('+91 98260 99881');
  const [contactEmail, setContactEmail] = useState('mahendra@kisanagro.in');
  const [address, setAddress] = useState('B-12, Krishi Upaj Mandi');
  const [district, setDistrict] = useState('Indore');
  const [state, setState] = useState('Madhya Pradesh');
  const [pincode, setPincode] = useState('452001');

  const [photoFile, setPhotoFile] = useState<File | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const inst = await instrumentService.register({
        type,
        manufacturer,
        model,
        serialNumber,
        capacity,
        unit,
        accuracyClass,
        businessName,
        ownerName,
        contactPhone,
        contactEmail,
        address,
        district,
        state,
        pincode,
        gpsCoordinates: { lat: 22.7196, lng: 75.8577 },
        verificationCentre: `${district} Legal Metrology Centre`,
        notes: 'Initial registration entered into National Grid.',
      });

      if (onRegistered) onRegistered(inst);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Register New Instrument"
      subtitle="Enter weighing or measuring instrument into National Metrology Grid"
      maxWidth="2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="font-bold text-[#123F63] block mb-1">
              Instrument Type *
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full rounded-xl border border-[#CFE5F5] bg-white px-3 py-2 text-xs text-[#123F63] focus:ring-2 focus:ring-[#2F8FCC] focus:outline-none"
            >
              <option>Electronic Weighing Scale</option>
              <option>Platform Scale</option>
              <option>Fuel Dispenser</option>
              <option>Weighbridge</option>
              <option>Analytical Balance</option>
              <option>Mechanical Counter Scale</option>
              <option>Measuring Instrument</option>
            </select>
          </div>
          <div>
            <label className="font-bold text-[#123F63] block mb-1">
              Accuracy Class *
            </label>
            <select
              value={accuracyClass}
              onChange={(e) => setAccuracyClass(e.target.value as Instrument['accuracyClass'])}
              className="w-full rounded-xl border border-[#CFE5F5] bg-white px-3 py-2 text-xs text-[#123F63] focus:ring-2 focus:ring-[#2F8FCC] focus:outline-none"
            >
              <option value="Class I (Special)">Class I (Special Precision)</option>
              <option value="Class II (High)">Class II (High Precision)</option>
              <option value="Class III (Medium)">Class III (Medium / Trade)</option>
              <option value="Class IIII (Ordinary)">Class IIII (Ordinary)</option>
            </select>
          </div>
          <div>
            <label className="font-bold text-[#123F63] block mb-1">
              Manufacturer *
            </label>
            <input
              type="text"
              required
              value={manufacturer}
              onChange={(e) => setManufacturer(e.target.value)}
              className="w-full rounded-xl border border-[#CFE5F5] bg-white px-3 py-2 text-xs text-[#123F63] focus:ring-2 focus:ring-[#2F8FCC] focus:outline-none"
            />
          </div>
          <div>
            <label className="font-bold text-[#123F63] block mb-1">
              Model & Serial Number *
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                required
                value={model}
                onChange={(e) => setModel(e.target.value)}
                placeholder="Model"
                className="w-1/2 rounded-xl border border-[#CFE5F5] bg-white px-3 py-2 text-xs text-[#123F63] focus:ring-2 focus:ring-[#2F8FCC] focus:outline-none"
              />
              <input
                type="text"
                required
                value={serialNumber}
                onChange={(e) => setSerialNumber(e.target.value)}
                placeholder="Serial No"
                className="w-1/2 rounded-xl border border-[#CFE5F5] bg-white px-3 py-2 text-xs font-mono text-[#123F63] focus:ring-2 focus:ring-[#2F8FCC] focus:outline-none"
              />
            </div>
          </div>
          <div>
            <label className="font-bold text-[#123F63] block mb-1">
              Capacity & Unit *
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                required
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                placeholder="Capacity (e.g. 30 kg)"
                className="w-1/2 rounded-xl border border-[#CFE5F5] bg-white px-3 py-2 text-xs text-[#123F63] focus:ring-2 focus:ring-[#2F8FCC] focus:outline-none"
              />
              <input
                type="text"
                required
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                placeholder="e.g. kg (e=1g)"
                className="w-1/2 rounded-xl border border-[#CFE5F5] bg-white px-3 py-2 text-xs text-[#123F63] focus:ring-2 focus:ring-[#2F8FCC] focus:outline-none"
              />
            </div>
          </div>
          <div>
            <label className="font-bold text-[#123F63] block mb-1">
              Business / Trading Establishment Name *
            </label>
            <input
              type="text"
              required
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              className="w-full rounded-xl border border-[#CFE5F5] bg-white px-3 py-2 text-xs text-[#123F63] focus:ring-2 focus:ring-[#2F8FCC] focus:outline-none"
            />
          </div>
          <div>
            <label className="font-bold text-[#123F63] block mb-1">
              Owner / Representative Name *
            </label>
            <input
              type="text"
              required
              value={ownerName}
              onChange={(e) => setOwnerName(e.target.value)}
              className="w-full rounded-xl border border-[#CFE5F5] bg-white px-3 py-2 text-xs text-[#123F63] focus:ring-2 focus:ring-[#2F8FCC] focus:outline-none"
            />
          </div>
          <div>
            <label className="font-bold text-[#123F63] block mb-1">
              Contact Mobile & Email *
            </label>
            <div className="flex gap-2">
              <input
                type="tel"
                required
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                placeholder="+91..."
                className="w-1/2 rounded-xl border border-[#CFE5F5] bg-white px-3 py-2 text-xs text-[#123F63] focus:ring-2 focus:ring-[#2F8FCC] focus:outline-none"
              />
              <input
                type="email"
                required
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder="email"
                className="w-1/2 rounded-xl border border-[#CFE5F5] bg-white px-3 py-2 text-xs text-[#123F63] focus:ring-2 focus:ring-[#2F8FCC] focus:outline-none"
              />
            </div>
          </div>
          <div className="sm:col-span-2">
            <label className="font-bold text-[#123F63] block mb-1">
              Premises Physical Address *
            </label>
            <input
              type="text"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full rounded-xl border border-[#CFE5F5] bg-white px-3 py-2 text-xs text-[#123F63] focus:ring-2 focus:ring-[#2F8FCC] focus:outline-none"
            />
          </div>
          <div>
            <label className="font-bold text-[#123F63] block mb-1">
              District *
            </label>
            <input
              type="text"
              required
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              className="w-full rounded-xl border border-[#CFE5F5] bg-white px-3 py-2 text-xs text-[#123F63] focus:ring-2 focus:ring-[#2F8FCC] focus:outline-none"
            />
          </div>
          <div>
            <label className="font-bold text-[#123F63] block mb-1">
              State & PIN Code *
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                required
                value={state}
                onChange={(e) => setState(e.target.value)}
                placeholder="State"
                className="w-2/3 rounded-xl border border-[#CFE5F5] bg-white px-3 py-2 text-xs text-[#123F63] focus:ring-2 focus:ring-[#2F8FCC] focus:outline-none"
              />
              <input
                type="text"
                required
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                placeholder="PIN"
                className="w-1/3 rounded-xl border border-[#CFE5F5] bg-white px-3 py-2 text-xs font-mono text-[#123F63] focus:ring-2 focus:ring-[#2F8FCC] focus:outline-none"
              />
            </div>
          </div>
        </div>
        <div className="pt-2">
          <ImageCaptureUpload
            label="Instrument Photo (Optional)"
            onImageSelected={(file) => setPhotoFile(file as File)}
            onImageRemoved={() => setPhotoFile(null)}
          />
        </div>

        <div className="pt-3 flex justify-end gap-2 border-t border-[#DCEAF4]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-[#CFE5F5] text-[#527290] hover:bg-[#EDF8FE] hover:text-[#123F63] font-semibold cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2.5 rounded-2xl bg-[#2F8FCC] text-white hover:bg-[#1E75AC] font-bold shadow-soft transition-all cursor-pointer"
          >
            {isSubmitting ? 'Registering...' : 'Register Instrument'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
