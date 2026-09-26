import { Officer, GATC } from '../types';
import { mockOfficers, mockGATCs } from '../data/mockOfficers';

let officersState: Officer[] = [...mockOfficers];
let gatcsState: GATC[] = [...mockGATCs];

export const officerService = {
  getOfficers: async (district?: string): Promise<Officer[]> => {
    if (!district || district === 'All') return officersState;
    return officersState.filter((o) => o.district.toLowerCase() === district.toLowerCase());
  },

  getOfficerById: async (id: string): Promise<Officer | undefined> => {
    return officersState.find((o) => o.id === id);
  },

  getGATCs: async (state?: string): Promise<GATC[]> => {
    if (!state || state === 'All') return gatcsState;
    return gatcsState.filter((g) => g.state.toLowerCase() === state.toLowerCase());
  },

  getGATCById: async (id: string): Promise<GATC | undefined> => {
    return gatcsState.find((g) => g.id === id);
  }
};
