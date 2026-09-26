export interface LegacyInstrumentOnboarding {
  id: string;
  temporaryId: string;
  instrumentType: string;
  manufacturer?: string;
  model?: string;
  capacity?: string;
  hasDamagedPlate: boolean;
  nameplatePhotoUrl?: string;
  historicalDocumentUrls: string[];
  applicantName: string;
  businessName: string;
  district: string;
  state: string;
  status: 'Provisional' | 'Under Inspection' | 'Hardware Tagged' | 'Rejected';
  createdDate: string;
}

export interface ProvisionalIdentityToken {
  provisionalId: string;
  issuedAt: string;
  validUntil: string;
  assignedOffice: string;
}
