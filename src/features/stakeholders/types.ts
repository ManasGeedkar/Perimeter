import { Officer, GATC, UserRole, UserProfile } from '../../types';

export type { Officer, GATC, UserRole, UserProfile };

export interface StakeholderOrganization {
  id: string;
  name: string;
  type: 'Business' | 'LMO' | 'GATC' | 'Admin';
  registrationNumber?: string;
  address: string;
  district: string;
  state: string;
}
