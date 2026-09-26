export interface PhysicalCharacteristics {
  conditionStatus: 'Good' | 'Damaged' | 'Needs Repair';
  displayStatus: 'Working' | 'Not Working';
  sealStatus: 'Intact' | 'Damaged' | 'Tampered' | 'Replaced';
  identificationStatus: 'Clearly visible' | 'Damaged' | 'Missing';
}

export interface OfficialStampInfo {
  stampNumber: string;
  quarterYear: string;
  officerId: string;
  securityStampHash: string;
  stampedAt: string;
}

export interface PhysicalIdentityEvidence {
  instrumentId: string;
  characteristics: PhysicalCharacteristics;
  stamp?: OfficialStampInfo;
  photoUrls: string[];
  identityConfidenceScore: number;
}
