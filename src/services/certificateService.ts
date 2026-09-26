import { Certificate, CertificateStatus } from '../types';
import { mockCertificates } from '../data/mockCertificates';

let certificatesState: Certificate[] = [...mockCertificates];

export const certificateService = {
  getAll: async (filters?: {
    status?: CertificateStatus | 'All';
    search?: string;
  }): Promise<Certificate[]> => {
    let list = [...certificatesState];

    if (!filters) return list;

    if (filters.status && filters.status !== 'All') {
      list = list.filter((c) => c.status === filters.status);
    }

    if (filters.search) {
      const q = filters.search.toLowerCase().trim();
      list = list.filter(
        (c) =>
          c.id.toLowerCase().includes(q) ||
          c.certificateNumber.toLowerCase().includes(q) ||
          c.instrumentId.toLowerCase().includes(q) ||
          c.ownerName.toLowerCase().includes(q) ||
          c.businessName.toLowerCase().includes(q)
      );
    }

    return list;
  },

  getById: async (id: string): Promise<Certificate | undefined> => {
    return certificatesState.find(
      (c) => c.id.toLowerCase() === id.toLowerCase() || c.certificateNumber.toLowerCase() === id.toLowerCase()
    );
  },

  verifyCertificate: async (query: string): Promise<{
    status: CertificateStatus;
    certificate?: Certificate;
    message: string;
  }> => {
    // Clean string from potential full URL
    let cleanQuery = query.trim();
    if (cleanQuery.includes('/public/verify/')) {
      cleanQuery = cleanQuery.split('/public/verify/')[1] || cleanQuery;
    }
    if (cleanQuery.includes('/certificates/')) {
      cleanQuery = cleanQuery.split('/certificates/')[1] || cleanQuery;
    }

    const cert = certificatesState.find(
      (c) =>
        c.id.toLowerCase() === cleanQuery.toLowerCase() ||
        c.certificateNumber.toLowerCase() === cleanQuery.toLowerCase() ||
        c.instrumentId.toLowerCase() === cleanQuery.toLowerCase() ||
        c.serialNumber.toLowerCase() === cleanQuery.toLowerCase()
    );

    if (!cert) {
      return {
        status: 'INVALID',
        message: 'No official certificate found matching the provided identifier or QR code payload.',
      };
    }

    // Check validity date
    const today = new Date();
    const expiry = new Date(cert.validUntil);

    if (cert.status === 'REVOKED') {
      return {
        status: 'REVOKED',
        certificate: cert,
        message: 'This certificate was officially REVOKED by the Legal Metrology Controller.',
      };
    }

    if (expiry < today || cert.status === 'EXPIRED') {
      return {
        status: 'EXPIRED',
        certificate: cert,
        message: 'This certificate has EXPIRED. Commercial use of this instrument without reverification is illegal.',
      };
    }

    return {
      status: 'VALID',
      certificate: cert,
      message: 'Certificate is AUTHENTIC and actively valid under the Legal Metrology Act, 2009.',
    };
  },

  createCertificateFromVerification: async (data: {
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
    verifiedByOfficerId: string;
    verifiedByOfficerName: string;
    officerDesignation: string;
    verificationCentre: string;
    observations: string;
  }): Promise<Certificate> => {
    const today = new Date();
    const nextYear = new Date(today);
    nextYear.setFullYear(today.getFullYear() + 1);

    const issueDateStr = today.toISOString().split('T')[0];
    const validUntilStr = nextYear.toISOString().split('T')[0];

    const statePrefix = (data.location.state.substring(0, 2) || 'IN').toUpperCase();
    const distCode = (data.location.district.substring(0, 3) || 'MET').toUpperCase();
    const randomCertNum = Math.floor(100000 + Math.random() * 900000);

    const id = `CERT-${statePrefix}-2026-${randomCertNum}`;
    const certificateNumber = `LMV/${statePrefix}/${distCode}/2026/${randomCertNum}`;
    const hash = `SHA256:${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;

    const newCert: Certificate = {
      id,
      certificateNumber,
      instrumentId: data.instrumentId,
      instrumentType: data.instrumentType,
      manufacturer: data.manufacturer,
      model: data.model,
      serialNumber: data.serialNumber,
      capacity: data.capacity,
      accuracyClass: data.accuracyClass,
      ownerName: data.ownerName,
      businessName: data.businessName,
      location: data.location,
      issueDate: issueDateStr,
      validUntil: validUntilStr,
      verifiedByOfficerId: data.verifiedByOfficerId,
      verifiedByOfficerName: data.verifiedByOfficerName,
      officerDesignation: data.officerDesignation,
      verificationCentre: data.verificationCentre,
      securityStampHash: hash,
      status: 'VALID',
      observations: data.observations,
      qrVerificationUrl: `/public/verify/${id}`,
      daysRemaining: 365,
    };

    certificatesState = [newCert, ...certificatesState];
    return newCert;
  }
};
