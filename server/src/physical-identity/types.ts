export interface PhysicalIdentityRecord {
  instrumentId: string;
  physicalCondition: 'Good' | 'Damaged' | 'Needs Repair';
  displayStatus: 'Working' | 'Not Working';
  sealStatus: 'Intact' | 'Damaged' | 'Tampered' | 'Replaced';
  idStatus: 'Clearly visible' | 'Damaged' | 'Missing';
  officialStampHash?: string;
  photographs: string[];
}
