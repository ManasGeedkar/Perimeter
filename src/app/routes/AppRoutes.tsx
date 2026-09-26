import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Layout
import { AppLayout } from '../../layouts/AppLayout';

// Public Pages
import { LandingPage } from '../../pages/public/LandingPage';
import { StartInspectionPage } from '../../pages/public/StartInspectionPage';
import { PublicCertificateVerifyPage } from '../../pages/public/PublicCertificateVerifyPage';
import { LoginPage } from '../../features/auth/pages/LoginPage';
import { SignUpPage } from '../../features/auth/pages/SignUpPage';

// Business User Area
import { UserDashboardPage } from '../../pages/dashboard/UserDashboardPage';
import { MyInstrumentsPage } from '../../features/instruments/pages/MyInstrumentsPage';
import { MyInstrumentDetailPage } from '../../features/instruments/pages/MyInstrumentDetailPage';
import { MyApplicationsPage } from '../../pages/applications/MyApplicationsPage';
import { MyApplicationDetailPage } from '../../pages/applications/MyApplicationDetailPage';
import { MyCertificatesPage } from '../../pages/certificates/MyCertificatesPage';
import { CertificateDetailPage } from '../../pages/certificates/CertificateDetailPage';
import { ProfilePage } from '../../features/stakeholders/pages/ProfilePage';

// Officer Area
import { OfficerDashboardPage } from '../../pages/officer/OfficerDashboardPage';
import { OfficerInspectionsPage } from '../../pages/officer/OfficerInspectionsPage';
import { OfficerInspectionWorkspacePage } from '../../pages/officer/OfficerInspectionWorkspacePage';
import { OfficerHistoryPage } from '../../pages/officer/OfficerHistoryPage';

// Admin Area
import { AdminDashboardPage } from '../../pages/admin/AdminDashboardPage';
import { ApplicationsPage } from '../../pages/applications/ApplicationsPage';
import { InstrumentsPage } from '../../features/instruments/pages/InstrumentsPage';
import { OfficersPage } from '../../features/stakeholders/pages/OfficersPage';
import { ReportsPage } from '../../pages/reports/ReportsPage';
import { NotificationsPage } from '../../pages/notifications/NotificationsPage';
import { SettingsPage } from '../../pages/settings/SettingsPage';

export const AppRoutes: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* ================= PUBLIC WEBSITE ================= */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/start-inspection" element={<StartInspectionPage />} />
        <Route path="/verify" element={<PublicCertificateVerifyPage />} />
        <Route path="/verify/:certificateId" element={<PublicCertificateVerifyPage />} />
        <Route path="/public/verify/:certificateId" element={<PublicCertificateVerifyPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />

        {/* ================= AUTHENTICATED PORTAL (AppLayout Shell) ================= */}
        <Route element={<AppLayout />}>
          {/* 1. BUSINESS USER JOURNEY */}
          <Route path="/dashboard" element={<UserDashboardPage />} />
          <Route path="/my-instruments" element={<MyInstrumentsPage />} />
          <Route path="/my-instruments/:id" element={<MyInstrumentDetailPage />} />
          <Route path="/my-applications" element={<MyApplicationsPage />} />
          <Route path="/my-applications/:id" element={<MyApplicationDetailPage />} />
          <Route path="/my-certificates" element={<MyCertificatesPage />} />
          <Route path="/my-certificates/:id" element={<CertificateDetailPage />} />
          <Route path="/profile" element={<ProfilePage />} />

          {/* 2. OFFICER / GATC JOURNEY */}
          <Route path="/officer/dashboard" element={<OfficerDashboardPage />} />
          <Route path="/officer/inspections" element={<OfficerInspectionsPage />} />
          <Route path="/officer/inspect/:id" element={<OfficerInspectionWorkspacePage />} />
          <Route path="/officer/history" element={<OfficerHistoryPage />} />

          {/* 3. ADMIN JOURNEY */}
          <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
          <Route path="/admin/applications" element={<ApplicationsPage />} />
          <Route path="/admin/instruments" element={<InstrumentsPage />} />
          <Route path="/admin/officers" element={<OfficersPage />} />
          <Route path="/admin/reports" element={<ReportsPage />} />

          {/* 4. UTILITIES & COMPATIBILITY ALIASES */}
          <Route path="/instruments" element={<Navigate to="/my-instruments" replace />} />
          <Route path="/instruments/:id" element={<MyInstrumentDetailPage />} />
          <Route path="/applications" element={<Navigate to="/my-applications" replace />} />
          <Route path="/applications/:id" element={<MyApplicationDetailPage />} />
          <Route path="/verification" element={<OfficerInspectionWorkspacePage />} />
          <Route path="/verification/:id" element={<OfficerInspectionWorkspacePage />} />
          <Route path="/certificates" element={<Navigate to="/my-certificates" replace />} />
          <Route path="/certificates/:id" element={<CertificateDetailPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/settings" element={<SettingsPage />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
