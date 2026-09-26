import { Instrument, InstrumentStatus } from '../types';
import { mockInstruments } from '../data/mockInstruments';

// In-memory state initialized with mock data
let instrumentsState: Instrument[] = [...mockInstruments];

export const instrumentService = {
  getAll: async (filters?: {
    type?: string;
    state?: string;
    district?: string;
    status?: InstrumentStatus | 'All';
    search?: string;
  }): Promise<Instrument[]> => {
    let list = [...instrumentsState];

    if (!filters) return list;

    if (filters.status && filters.status !== 'All') {
      list = list.filter((i) => i.status === filters.status);
    }

    if (filters.type && filters.type !== 'All') {
      list = list.filter((i) => i.type === filters.type);
    }

    if (filters.state && filters.state !== 'All') {
      list = list.filter((i) => i.state.toLowerCase() === filters.state?.toLowerCase());
    }

    if (filters.district && filters.district !== 'All') {
      list = list.filter((i) => i.district.toLowerCase() === filters.district?.toLowerCase());
    }

    if (filters.search) {
      const q = filters.search.toLowerCase().trim();
      list = list.filter(
        (i) =>
          i.id.toLowerCase().includes(q) ||
          i.serialNumber.toLowerCase().includes(q) ||
          i.businessName.toLowerCase().includes(q) ||
          i.ownerName.toLowerCase().includes(q) ||
          i.manufacturer.toLowerCase().includes(q)
      );
    }

    return list;
  },

  getById: async (id: string): Promise<Instrument | undefined> => {
    return instrumentsState.find((i) => i.id === id);
  },

  register: async (newInstrument: Omit<Instrument, 'id' | 'registrationDate' | 'status' | 'certificateId' | 'lastVerifiedDate' | 'validUntilDate'>): Promise<Instrument> => {
    const statePrefix = (newInstrument.state.substring(0, 2) || 'IN').toUpperCase();
    const distPrefix = (newInstrument.district.substring(0, 3) || 'MET').toUpperCase();
    const typeCode = newInstrument.type.includes('Weigh') ? 'WT' : newInstrument.type.includes('Fuel') ? 'FL' : 'IN';
    const randNum = Math.floor(100000 + Math.random() * 900000);
    const generatedId = `${statePrefix}-${distPrefix}-${typeCode}-2026-${randNum.toString().substring(0, 6)}`;

    const instrument: Instrument = {
      ...newInstrument,
      id: generatedId,
      registrationDate: new Date().toISOString().split('T')[0],
      status: 'Registered',
      certificateId: 'PENDING_INITIAL_VERIFICATION',
      lastVerifiedDate: 'N/A',
      validUntilDate: 'N/A',
    };

    instrumentsState = [instrument, ...instrumentsState];
    return instrument;
  },

  updateStatus: async (id: string, status: InstrumentStatus): Promise<Instrument | null> => {
    const index = instrumentsState.findIndex((i) => i.id === id);
    if (index === -1) return null;
    instrumentsState[index] = { ...instrumentsState[index], status };
    return instrumentsState[index];
  }
};
