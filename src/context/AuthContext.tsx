import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole } from '../types';

export const DEMO_USERS: Record<UserRole, UserProfile> = {
  'Business / Instrument Owner': {
    id: 'OWNER-001',
    name: 'Rahul Sharma',
    role: 'Business / Instrument Owner',
    roleBadge: 'Business',
    email: 'rahul.sharma@indoregrain.in',
    designation: 'Proprietor, Shanti Grain Stores',
    district: 'Indore',
    state: 'Madhya Pradesh',
  },
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
    roleBadge: 'Admin',
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
    designation: 'Director, Central Metrology Testing Centre',
    district: 'Indore',
    state: 'Madhya Pradesh',
    centreName: 'Indore Central Metrology Lab (GATC-01)',
  },
};

interface AuthContextType {
  user: UserProfile;
  switchRole: (role: UserRole) => void;
  login: (email: string, pass: string, role?: UserRole) => Promise<UserProfile>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('lmv_current_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    // Default to Business User for a simple, friendly entry point
    return DEMO_USERS['Business / Instrument Owner'];
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('lmv_is_logged_in') !== 'false';
  });

  useEffect(() => {
    localStorage.setItem('lmv_current_user', JSON.stringify(user));
  }, [user]);

  const switchRole = (role: UserRole) => {
    const newUser = DEMO_USERS[role] || DEMO_USERS['Business / Instrument Owner'];
    setUser(newUser);
    setIsAuthenticated(true);
    localStorage.setItem('lmv_is_logged_in', 'true');
  };

  const login = async (email: string, _pass: string, role?: UserRole): Promise<UserProfile> => {
    const matchedRole = role || (email.includes('officer') || email.includes('lmo') ? 'Legal Metrology Officer' : email.includes('admin') ? 'Administrator' : 'Business / Instrument Owner');
    const loggedUser = { ...DEMO_USERS[matchedRole] };
    if (email && email.includes('@')) {
      loggedUser.email = email;
    }
    setUser(loggedUser);
    setIsAuthenticated(true);
    localStorage.setItem('lmv_is_logged_in', 'true');
    return loggedUser;
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.setItem('lmv_is_logged_in', 'false');
  };

  return (
    <AuthContext.Provider value={{ user, switchRole, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
