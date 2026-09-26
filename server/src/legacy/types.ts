export interface LegacyOnboardingPayload {
  provisionalId: string;
  hasDamagedPlate: boolean;
  manualType: string;
  manualManufacturer?: string;
  manualModel?: string;
  manualCapacity?: string;
  ownerName: string;
  businessName: string;
  address: string;
  district: string;
  state: string;
  photographs: string[];
}
