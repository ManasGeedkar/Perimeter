/**
 * PERIMETER AUTHENTICATION SERVICE (FRONTEND INTEGRATION BOUNDARY)
 * 
 * ============================================================================
 * IMPORTANT SECURITY NOTICE: DEMO MODE vs PRODUCTION AUTHORIZATION
 * ============================================================================
 * The preset profiles and localStorage mechanisms below are strictly for
 * client-side UI prototyping and demonstration (DEMO_MODE).
 * 
 * LocalStorage role switching is NOT AUTHORITATIVE and is NEVER trusted by the
 * backend. All production authorization, role evaluation, and stakeholder
 * permissions are enforced strictly server-side in NestJS via:
 *   - POST /api/v1/auth/login
 *   - POST /api/v1/auth/register
 *   - GET  /api/v1/auth/me
 *   - JwtAuthGuard & RolesGuard
 * ============================================================================
 */

import { UserProfile, UserRole } from '../../types';

export const IS_DEMO_MODE = true;
export const API_BASE_URL = import.meta.env?.VITE_API_URL || 'http://localhost:3000/api/v1';

export const PRESET_USERS: Record<UserRole, UserProfile> = {
  'Legal Metrology Officer': {
    id: 'OFF-IND-01',
    name: 'Rajesh Kumar',
    role: 'Legal Metrology Officer',
    roleBadge: 'LMO',
    email: 'rajesh.kumar@legalmetrology.gov.in',
    designation: 'Senior Legal Metrology Officer',
    district: 'Indore',
    state: 'Madhya Pradesh',
    employeeId: 'LMO-MP-4091',
  },
  'Administrator': {
    id: 'ADMIN-001',
    name: 'Sunil Mathur',
    role: 'Administrator',
    roleBadge: 'ADMIN',
    email: 'admin.metrology@gov.in',
    designation: 'Director of Legal Metrology (HQ)',
    district: 'New Delhi',
    state: 'Delhi',
    employeeId: 'DIR-DL-001',
  },
  'GATC': {
    id: 'GATC-USER-01',
    name: 'Er. Sandeep Joshi',
    role: 'GATC',
    roleBadge: 'GATC',
    email: 'indorelab@gatc-standards.gov.in',
    designation: 'Director, Indore Central Metrology Lab',
    district: 'Indore',
    state: 'Madhya Pradesh',
    centreName: 'Indore Central Metrology Lab (GATC-01)',
  },
  'Business / Instrument Owner': {
    id: 'OWNER-001',
    name: 'Rameshwar Patidar',
    role: 'Business / Instrument Owner',
    roleBadge: 'OWNER',
    email: 'shreeganeshagro@indoregrain.in',
    designation: 'Proprietor, Shree Ganesh Agro Mills',
    district: 'Indore',
    state: 'Madhya Pradesh',
  },
};

export const authService = {
  /**
   * Returns current active user profile.
   * In DEMO_MODE, returns local storage mock state.
   */
  getCurrentUser: (): UserProfile => {
    const saved = localStorage.getItem('lmv_current_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // Fallback to default
      }
    }
    return PRESET_USERS['Legal Metrology Officer'];
  },

  setCurrentUser: (profile: UserProfile): void => {
    localStorage.setItem('lmv_current_user', JSON.stringify(profile));
  },

  /**
   * Prototype role switcher. Marked explicitly as DEMO_MODE.
   */
  switchRole: (role: UserRole): UserProfile => {
    console.warn('[PERIMETER-DEMO] Switching client role in DEMO_MODE. Not authoritative for server requests.');
    const user = PRESET_USERS[role] || PRESET_USERS['Legal Metrology Officer'];
    localStorage.setItem('lmv_current_user', JSON.stringify(user));
    return user;
  },

  /**
   * Prototype mock login.
   */
  login: async (emailOrPhone: string, _password: string, role: UserRole = 'Legal Metrology Officer'): Promise<UserProfile> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const user = { ...PRESET_USERS[role] };
    if (emailOrPhone.includes('@')) {
      user.email = emailOrPhone;
    }
    localStorage.setItem('lmv_current_user', JSON.stringify(user));
    localStorage.setItem('lmv_auth_token', 'demo_mock_jwt_token_sih2026_' + Date.now());
    return user;
  },

  logout: async (): Promise<void> => {
    localStorage.removeItem('lmv_auth_token');
    localStorage.removeItem('lmv_access_token');
    localStorage.removeItem('lmv_refresh_token');
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('lmv_auth_token') || !!localStorage.getItem('lmv_access_token');
  },

  /**
   * PRODUCTION BACKEND API INTEGRATION
   * Directly interfaces with the Phase 2 NestJS Authentication Controller
   */
  loginWithBackend: async (email: string, password: string): Promise<any> => {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || 'Authentication failed');
    }

    const data = await res.json();
    localStorage.setItem('lmv_access_token', data.tokens.accessToken);
    localStorage.setItem('lmv_refresh_token', data.tokens.refreshToken);
    localStorage.setItem('lmv_current_user', JSON.stringify(data.user));
    return data;
  },

  registerWithBackend: async (registrationData: {
    email: string;
    password: string;
    fullName: string;
    phone?: string;
    businessName?: string;
    registrationNumber?: string;
    stateCode?: string;
    districtCode?: string;
  }): Promise<any> => {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(registrationData),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || 'Registration failed');
    }

    const data = await res.json();
    localStorage.setItem('lmv_access_token', data.tokens.accessToken);
    localStorage.setItem('lmv_refresh_token', data.tokens.refreshToken);
    localStorage.setItem('lmv_current_user', JSON.stringify(data.user));
    return data;
  },

  fetchProfileFromBackend: async (): Promise<any> => {
    const token = localStorage.getItem('lmv_access_token');
    if (!token) throw new Error('Unauthenticated');

    const res = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) throw new Error('Failed to retrieve profile');
    return res.json();
  },
};
