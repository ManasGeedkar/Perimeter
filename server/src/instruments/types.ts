export interface InstrumentPassportData {
  passportNumber: string;
  isProvisional: boolean;
  category: string;
  instrumentType: string;
  serialNumber?: string;
  capacity?: number;
  unit?: string;
  accuracyClass?: string;
  ownerOrganizationId?: string;
  jurisdictionId?: string;
  currentStatus: string;
}
