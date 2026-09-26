export type UserRole = 
  | 'Administrator'
  | 'Legal Metrology Officer'
  | 'GATC'
  | 'Business / Instrument Owner';

export interface UserProfile {
  id: string;
  name: string;
  role: UserRole;
  roleBadge: string;
  email: string;
  designation: string;
  district: string;
  state: string;
  employeeId?: string;
  centreName?: string;
  businessName?: string;
}

export interface LoginCredentials {
  emailOrPhone: string;
  password: string;
  role?: UserRole;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
  expiresIn?: number;
}
