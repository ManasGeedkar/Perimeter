import { VerificationRecord, TestObservation } from '../types';
import { certificateService } from './certificateService';
import { applicationService } from './applicationService';
import { instrumentService } from './instrumentService';

// Default standard test observations for an electronic scale
export const DEFAULT_TEST_OBSERVATIONS: TestObservation[] = [
  { id: '1', testLoad: '5 kg (1/6 Max)', indicatedValue: '5.000 kg', error: '0.000 kg', allowableError: '± 0.002 kg', passed: true },
  { id: '2', testLoad: '15 kg (1/2 Max)', indicatedValue: '15.001 kg', error: '+0.001 kg', allowableError: '± 0.002 kg', passed: true },
  { id: '3', testLoad: '30 kg (Max Load)', indicatedValue: '30.001 kg', error: '+0.001 kg', allowableError: '± 0.003 kg', passed: true },
  { id: '4', testLoad: 'Eccentricity (Corner 1)', indicatedValue: '10.000 kg', error: '0.000 kg', allowableError: '± 0.002 kg', passed: true },
  { id: '5', testLoad: 'Eccentricity (Corner 4)', indicatedValue: '10.001 kg', error: '+0.001 kg', allowableError: '± 0.002 kg', passed: true },
];

let verificationRecordsState: VerificationRecord[] = [
  {
    id: 'VR-2026-000821',
    applicationId: 'APP-2026-000182',
    instrumentId: 'MP-IND-WT-2026-001284',
    officerId: 'OFF-IND-01',
    officerName: 'Rajesh Kumar',
    verificationCentre: 'Indore Central Metrology Lab (GATC-01)',
    inspectionDate: '2026-09-24',
    physicalConditionStatus: 'Pass',
    displayAccuracyStatus: 'Pass',
    sealIntact: 'Yes',
    identificationVerified: 'Verified',
    testObservations: DEFAULT_TEST_OBSERVATIONS,
    photos: [
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=400&q=80'
    ],
    remarks: 'Instrument verified in full compliance with Legal Metrology (General) Rules. Standard lead seal stamped.',
    overallResult: 'PASS',
    digitalSignature: 'SIG_SHA256_RAJESH_KUMAR_IND_2026',
    gpsCoordinates: { lat: 22.7196, lng: 75.8577 },
    certificateGeneratedId: 'CERT-MP-2026-000821'
  }
];

export const verificationService = {
  getByApplicationId: async (applicationId: string): Promise<VerificationRecord | undefined> => {
    return verificationRecordsState.find((r) => r.applicationId === applicationId);
  },

  submitVerification: async (record: Omit<VerificationRecord, 'id'>): Promise<{ record: VerificationRecord; certificateId?: string }> => {
    const vrId = `VR-2026-${Math.floor(100000 + Math.random() * 900000)}`;
    let generatedCertId: string | undefined = undefined;

    if (record.overallResult === 'PASS') {
      // Find instrument details
      const inst = await instrumentService.getById(record.instrumentId);
      if (inst) {
        const cert = await certificateService.createCertificateFromVerification({
          instrumentId: inst.id,
          instrumentType: inst.type,
          manufacturer: inst.manufacturer,
          model: inst.model,
          serialNumber: inst.serialNumber,
          capacity: inst.capacity,
          accuracyClass: inst.accuracyClass,
          ownerName: inst.ownerName,
          businessName: inst.businessName,
          location: {
            address: inst.address,
            district: inst.district,
            state: inst.state,
            pincode: inst.pincode,
          },
          verifiedByOfficerId: record.officerId,
          verifiedByOfficerName: record.officerName,
          officerDesignation: 'Senior Legal Metrology Officer',
          verificationCentre: record.verificationCentre,
          observations: record.remarks || 'Standard weights test completed successfully.',
        });

        generatedCertId = cert.id;
        await instrumentService.updateStatus(inst.id, 'Verified');
        await applicationService.updateStatus(record.applicationId, 'Verified');
      }
    } else {
      await applicationService.updateStatus(record.applicationId, 'Failed');
    }

    const savedRecord: VerificationRecord = {
      ...record,
      id: vrId,
      certificateGeneratedId: generatedCertId,
    };

    verificationRecordsState = [savedRecord, ...verificationRecordsState];
    return { record: savedRecord, certificateId: generatedCertId };
  }
};
