import { PhysicalIdentityEvidence } from './types';

export const physicalIdentityService = {
  async getEvidenceByInstrumentId(
    _instrumentId: string,
  ): Promise<PhysicalIdentityEvidence | null> {
    return null;
  },
  async submitEvidence(_evidence: PhysicalIdentityEvidence): Promise<boolean> {
    return true;
  },
};
