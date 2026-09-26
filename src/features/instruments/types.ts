import { Instrument, InstrumentStatus } from '../../types';

export type { Instrument, InstrumentStatus };

export interface RegisterInstrumentPayload {
  type: string;
  manufacturer: string;
  model: string;
  serialNumber: string;
  capacity: string;
  unit: string;
  accuracyClass: Instrument['accuracyClass'];
  businessName: string;
  ownerName: string;
  contactPhone: string;
  contactEmail: string;
  address: string;
  district: string;
  state: string;
  pincode: string;
  gpsCoordinates: { lat: number; lng: number };
  verificationCentre: string;
  notes?: string;
}
