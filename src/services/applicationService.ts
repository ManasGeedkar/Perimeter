import { Application, ApplicationStatus } from '../types';
import { mockApplications } from '../data/mockApplications';

let applicationsState: Application[] = [...mockApplications];

export const applicationService = {
  getAll: async (filters?: {
    status?: ApplicationStatus | 'All';
    verificationType?: string;
    state?: string;
    district?: string;
    search?: string;
  }): Promise<Application[]> => {
    let list = [...applicationsState];

    if (!filters) return list;

    if (filters.status && filters.status !== 'All') {
      list = list.filter((a) => a.status === filters.status);
    }

    if (filters.verificationType && filters.verificationType !== 'All') {
      list = list.filter((a) => a.verificationType === filters.verificationType);
    }

    if (filters.state && filters.state !== 'All') {
      list = list.filter((a) => a.state.toLowerCase() === filters.state?.toLowerCase());
    }

    if (filters.district && filters.district !== 'All') {
      list = list.filter((a) => a.district.toLowerCase() === filters.district?.toLowerCase());
    }

    if (filters.search) {
      const q = filters.search.toLowerCase().trim();
      list = list.filter(
        (a) =>
          a.id.toLowerCase().includes(q) ||
          a.instrumentId.toLowerCase().includes(q) ||
          a.businessName.toLowerCase().includes(q) ||
          a.applicantName.toLowerCase().includes(q)
      );
    }

    return list;
  },

  getById: async (id: string): Promise<Application | undefined> => {
    return applicationsState.find((a) => a.id === id || a.temporaryId === id);
  },

  create: async (payload: {
    instrumentId?: string;
    instrumentType: string;
    applicantName: string;
    businessName: string;
    contactNumber: string;
    email: string;
    address: string;
    district: string;
    state: string;
    verificationType: Application['verificationType'];
    preferredDate: string;
    hasDamagedPlate: boolean;
    supportingDocs: string[];
    remarks: string;
  }): Promise<Application> => {
    const todayStr = new Date().toISOString().split('T')[0];
    const randNum = Math.floor(1000 + Math.random() * 9000);

    let id: string;
    let tempId: string | undefined = undefined;
    let instrumentId = payload.instrumentId;
    let status: ApplicationStatus = 'Pending';

    if (payload.hasDamagedPlate) {
      id = `TEMP-APP-2026-00${randNum}`;
      tempId = id;
      status = 'Identification Pending';
      if (!instrumentId) {
        instrumentId = `TEMP-INST-2026-00${randNum}`;
      }
    } else {
      id = `APP-2026-00${randNum}`;
    }

    const newApp: Application = {
      id,
      instrumentId: instrumentId || 'PENDING-IDENTIFICATION',
      instrumentType: payload.instrumentType,
      applicantName: payload.applicantName,
      businessName: payload.businessName,
      contactNumber: payload.contactNumber,
      email: payload.email,
      address: payload.address,
      district: payload.district,
      state: payload.state,
      verificationType: payload.verificationType,
      preferredDate: payload.preferredDate,
      submittedDate: todayStr,
      status,
      hasDamagedPlate: payload.hasDamagedPlate,
      temporaryId: tempId,
      supportingDocs: payload.supportingDocs,
      remarks: payload.remarks,
      feePaid: payload.hasDamagedPlate ? 650 : 450,
      paymentRef: `UPI-GOV-${Math.floor(10000000 + Math.random() * 90000000)}`
    };

    applicationsState = [newApp, ...applicationsState];
    return newApp;
  },

  assignOfficer: async (
    applicationId: string,
    officerId: string,
    officerName: string,
    gatcId?: string,
    gatcName?: string,
    scheduledDate?: string
  ): Promise<Application | null> => {
    const index = applicationsState.findIndex((a) => a.id === applicationId);
    if (index === -1) return null;

    applicationsState[index] = {
      ...applicationsState[index],
      assignedOfficerId: officerId,
      assignedOfficerName: officerName,
      assignedGATCId: gatcId,
      assignedGATCName: gatcName,
      scheduledDate: scheduledDate || new Date().toISOString().split('T')[0],
      status: 'Scheduled',
    };

    return applicationsState[index];
  },

  updateStatus: async (applicationId: string, status: ApplicationStatus): Promise<Application | null> => {
    const index = applicationsState.findIndex((a) => a.id === applicationId);
    if (index === -1) return null;

    applicationsState[index] = {
      ...applicationsState[index],
      status
    };

    return applicationsState[index];
  }
};
