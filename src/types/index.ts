// Core Types for Legal Metrology Verification Portal (PERIMETER - SIH 2026)

export type InstrumentStatus = 
  | 'Registered'
  | 'Pending Verification'
  | 'Verified'
  | 'Expiring Soon'
  | 'Expired'
  | 'Suspended'
  | 'Identification Pending';

export type ApplicationStatus =
  | 'Pending'
  | 'Under Review'
  | 'Scheduled'
  | 'Assigned'
  | 'In Verification'
  | 'Verified'
  | 'Failed'
  | 'Rejected'
  | 'Identification Pending';

export type VerificationType = 
  | 'Initial Verification'
  | 'Periodic Verification'
  | 'Re-verification'
  | 'Special Verification';

export type CertificateStatus = 
  | 'VALID'
  | 'EXPIRED'
  | 'REVOKED'
  | 'INVALID';

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

export interface Instrument {
  id: string; // e.g. MP-IND-WT-2026-001284
  type: string; // e.g. Electronic Weighing Scale
  manufacturer: string;
  model: string;
  serialNumber: string;
  capacity: string;
  unit: string;
  accuracyClass: 'Class I (Special)' | 'Class II (High)' | 'Class III (Medium)' | 'Class IIII (Ordinary)';
  ownerName: string;
  businessName: string;
  contactPhone: string;
  contactEmail: string;
  address: string;
  district: string;
  state: string;
  pincode: string;
  gpsCoordinates: { lat: number; lng: number };
  lastVerifiedDate: string;
  validUntilDate: string;
  status: InstrumentStatus;
  verificationCentre: string;
  certificateId: string;
  registrationDate: string;
  isTemporaryId?: boolean;
  nameplateDamaged?: boolean;
  nameplatePhotoUrl?: string;
  notes?: string;
}

export interface Application {
  id: string; // e.g. APP-2026-000182 or TEMP-APP-2026-000042
  instrumentId: string;
  instrumentType: string;
  applicantName: string;
  businessName: string;
  contactNumber: string;
  email: string;
  address: string;
  district: string;
  state: string;
  verificationType: VerificationType;
  preferredDate: string;
  submittedDate: string;
  scheduledDate?: string;
  assignedOfficerId?: string;
  assignedOfficerName?: string;
  assignedGATCId?: string;
  assignedGATCName?: string;
  status: ApplicationStatus;
  hasDamagedPlate: boolean;
  temporaryId?: string;
  supportingDocs: string[];
  remarks: string;
  rejectionReason?: string;
  feePaid?: number;
  paymentRef?: string;
}

export interface TestObservation {
  id: string;
  testLoad: string;
  indicatedValue: string;
  error: string;
  allowableError: string;
  passed: boolean;
}

export interface VerificationRecord {
  id: string;
  applicationId: string;
  instrumentId: string;
  officerId: string;
  officerName: string;
  verificationCentre: string;
  inspectionDate: string;
  physicalConditionStatus: 'Pass' | 'Fail' | 'Needs Repair';
  displayAccuracyStatus: 'Pass' | 'Fail';
  sealIntact: 'Yes' | 'No' | 'Tampered' | 'Replaced';
  identificationVerified: 'Verified' | 'Pending Identification' | 'Re-tagged';
  testObservations: TestObservation[];
  photos: string[];
  remarks: string;
  overallResult: 'PASS' | 'FAIL' | 'PENDING';
  failureReason?: string;
  digitalSignature: string;
  gpsCoordinates: { lat: number; lng: number };
  certificateGeneratedId?: string;
}

export interface Certificate {
  id: string; // e.g. CERT-MP-2026-000821
  certificateNumber: string;
  instrumentId: string;
  instrumentType: string;
  manufacturer: string;
  model: string;
  serialNumber: string;
  capacity: string;
  accuracyClass: string;
  ownerName: string;
  businessName: string;
  location: {
    address: string;
    district: string;
    state: string;
    pincode: string;
  };
  issueDate: string;
  validUntil: string;
  verifiedByOfficerId: string;
  verifiedByOfficerName: string;
  officerDesignation: string;
  verificationCentre: string;
  securityStampHash: string;
  status: CertificateStatus;
  observations: string;
  qrVerificationUrl: string;
  daysRemaining?: number;
}

export interface Officer {
  id: string;
  employeeId: string;
  name: string;
  designation: string;
  district: string;
  state: string;
  email: string;
  phone: string;
  activeAssignments: number;
  completedVerifications: number;
  pendingTasks: number;
  status: 'Active' | 'On Field Duty' | 'On Leave';
  avatarInitials: string;
}

export interface GATC {
  id: string;
  centreId: string;
  centreName: string;
  location: string;
  district: string;
  state: string;
  contactPerson: string;
  phone: string;
  email: string;
  assignedCount: number;
  completedCount: number;
  pendingCount: number;
  status: 'Accredited' | 'Under Audit' | 'Suspended';
  accreditationValidUntil: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'expiry' | 'assignment' | 'application' | 'verification' | 'certificate' | 'alert';
  priority: 'high' | 'medium' | 'low';
  link?: string;
}

export interface DashboardMetrics {
  totalInstruments: number;
  pendingApplications: number;
  verifiedInstruments: number;
  expiringSoon: number;
  expiredCertificates: number;
  scheduledToday: number;
  monthlyTrends: Array<{ month: string; verified: number; scheduled: number; failed: number }>;
  statusDistribution: Array<{ name: string; value: number; color: string }>;
  instrumentTypeDistribution: Array<{ type: string; count: number }>;
  stateWiseActivity: Array<{ state: string; count: number; verified: number }>;
  officerWorkload: Array<{ name: string; assigned: number; completed: number }>;
  passFailData: Array<{ name: string; value: number; color: string }>;
}
