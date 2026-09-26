import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { mockOfficers, mockGATCs } from '../../data/mockOfficers';
import { applicationService } from '../../services/applicationService';
import { UserCheck, Building2, Calendar, CheckCircle2 } from 'lucide-react';

interface AssignOfficerModalProps {
  isOpen: boolean;
  onClose: () => void;
  applicationId: string;
  applicantBusiness: string;
  instrumentType: string;
  onAssigned?: (appId: string, officerName: string) => void;
}

export const AssignOfficerModal: React.FC<AssignOfficerModalProps> = ({
  isOpen,
  onClose,
  applicationId,
  applicantBusiness,
  instrumentType,
  onAssigned,
}) => {
  const [selectedOfficerId, setSelectedOfficerId] = useState(mockOfficers[0]?.id || '');
  const [selectedGATCId, setSelectedGATCId] = useState('');
  const [scheduledDate, setScheduledDate] = useState('2026-09-29');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAssign = async () => {
    setIsSubmitting(true);
    try {
      const officer = mockOfficers.find((o) => o.id === selectedOfficerId);
      const gatc = mockGATCs.find((g) => g.id === selectedGATCId);

      await applicationService.assignOfficer(
        applicationId,
        selectedOfficerId,
        officer ? `${officer.name} (${officer.designation})` : 'Assigned Officer',
        selectedGATCId || undefined,
        gatc?.centreName || undefined,
        scheduledDate
      );

      if (onAssigned && officer) {
        onAssigned(applicationId, officer.name);
      }
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Assign Legal Metrology Officer / GATC"
      subtitle={`Allocate verification for ${applicationId}`}
      maxWidth="lg"
    >
      <div className="space-y-4 text-xs">
        <div className="p-3 rounded-2xl card-sky border border-[#CFE5F5]">
          <p className="font-bold text-[#123F63]">
            {applicantBusiness}
          </p>
          <p className="text-[#527290]">
            Instrument: <span className="font-semibold text-[#123F63]">{instrumentType}</span>
          </p>
        </div>

        <div>
          <label className="font-bold text-[#123F63] block mb-1">
            Assign Legal Metrology Officer (LMO) *
          </label>
          <select
            value={selectedOfficerId}
            onChange={(e) => setSelectedOfficerId(e.target.value)}
            className="w-full rounded-xl border border-[#CFE5F5] bg-white px-3 py-2.5 text-xs text-[#123F63] focus:ring-2 focus:ring-[#2F8FCC] focus:outline-none"
          >
            {mockOfficers.map((off) => (
              <option key={off.id} value={off.id}>
                {off.name} ({off.designation} - {off.district}, {off.state}) — Active: {off.activeAssignments}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="font-bold text-[#123F63] block mb-1">
            Assign Testing Facility / GATC (Optional)
          </label>
          <select
            value={selectedGATCId}
            onChange={(e) => setSelectedGATCId(e.target.value)}
            className="w-full rounded-xl border border-[#CFE5F5] bg-white px-3 py-2.5 text-xs text-[#123F63] focus:ring-2 focus:ring-[#2F8FCC] focus:outline-none"
          >
            <option value="">-- None / Direct On-site LMO Inspection --</option>
            {mockGATCs.map((gatc) => (
              <option key={gatc.id} value={gatc.id}>
                {gatc.centreName} ({gatc.district})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="font-bold text-[#123F63] block mb-1">
            Scheduled Inspection Date *
          </label>
          <input
            type="date"
            value={scheduledDate}
            onChange={(e) => setScheduledDate(e.target.value)}
            className="w-full rounded-xl border border-[#CFE5F5] bg-white px-3 py-2 text-xs text-[#123F63] focus:ring-2 focus:ring-[#2F8FCC] focus:outline-none"
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
            type="button"
            disabled={isSubmitting}
            onClick={handleAssign}
            className="px-5 py-2 rounded-xl bg-[#2F8FCC] text-white hover:bg-[#1E75AC] font-bold shadow-soft transition-all cursor-pointer"
          >
            {isSubmitting ? 'Assigning...' : 'Confirm Assignment'}
          </button>
        </div>
      </div>
    </Modal>
  );
};
