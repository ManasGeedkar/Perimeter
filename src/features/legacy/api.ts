import { LegacyInstrumentOnboarding } from './types';

export const legacyService = {
  async getLegacyInstruments(): Promise<LegacyInstrumentOnboarding[]> {
    return [];
  },
  async submitProvisionalOnboarding(
    data: Partial<LegacyInstrumentOnboarding>,
  ): Promise<LegacyInstrumentOnboarding> {
    return {
      id: `LEGACY-${Date.now()}`,
      temporaryId: `TEMP-${Date.now()}`,
      instrumentType: data.instrumentType || 'Weighing Instrument',
      hasDamagedPlate: data.hasDamagedPlate ?? true,
      historicalDocumentUrls: data.historicalDocumentUrls || [],
      applicantName: data.applicantName || '',
      businessName: data.businessName || '',
      district: data.district || '',
      state: data.state || '',
      status: 'Provisional',
      createdDate: new Date().toISOString(),
    };
  },
};
