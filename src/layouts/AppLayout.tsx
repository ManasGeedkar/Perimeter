import React, { useState } from 'react';
import { Outlet, NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import {
  ShieldCheck,
  LayoutDashboard,
  Scale,
  FileText,
  Award,
  User,
  LogOut,
  Users,
  BarChart3,
  CheckCircle2,
  Menu,
  X,
  History,
  ChevronDown,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from '../i18n';
import { LanguageSwitcher } from '../components/common/LanguageSwitcher';
import { UserRole } from '../types';

export const AppLayout: React.FC = () => {
  const { user, switchRole, logout } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  // Navigation Items customized by logged-in role
  const getNavItems = () => {
    if (user.role === 'Legal Metrology Officer') {
      return [
        { label: t('nav.dashboard'), to: '/officer/dashboard', icon: LayoutDashboard },
        { label: t('nav.myInspections'), to: '/officer/inspections', icon: Scale },
        { label: t('nav.verificationHistory'), to: '/officer/history', icon: History },
        { label: t('nav.myCertificates'), to: '/my-certificates', icon: Award },
        { label: t('nav.profile'), to: '/profile', icon: User },
      ];
    } else if (user.role === 'GATC') {
      return [
        { label: t('nav.dashboard'), to: '/officer/dashboard', icon: LayoutDashboard },
        { label: t('nav.assignedInspections'), to: '/officer/inspections', icon: Scale },
        { label: t('nav.verificationHistory'), to: '/officer/history', icon: History },
        { label: t('nav.myCertificates'), to: '/my-certificates', icon: Award },
        { label: t('nav.profile'), to: '/profile', icon: User },
      ];
    } else if (user.role === 'Administrator') {
      return [
        { label: t('nav.dashboard'), to: '/admin/dashboard', icon: LayoutDashboard },
        { label: t('nav.applications'), to: '/admin/applications', icon: FileText },
        { label: t('nav.instruments'), to: '/admin/instruments', icon: Scale },
        { label: t('nav.officers'), to: '/admin/officers', icon: Users },
        { label: t('nav.reports'), to: '/admin/reports', icon: BarChart3 },
        { label: t('nav.profile'), to: '/profile', icon: User },
      ];
    }

    // Default: Business / Instrument Owner
    return [
      { label: t('nav.dashboard'), to: '/dashboard', icon: LayoutDashboard },
      { label: t('nav.myInstruments'), to: '/my-instruments', icon: Scale },
      { label: t('nav.myApplications'), to: '/my-applications', icon: FileText },
      { label: t('nav.myCertificates'), to: '/my-certificates', icon: Award },
      { label: t('nav.profile'), to: '/profile', icon: User },
    ];
  };

  const navItems = getNavItems();

  const getRoleLabel = (role: UserRole) => {
    switch (role) {
      case 'Legal Metrology Officer':
        return t('role.officer');
      case 'Administrator':
        return t('role.admin');
      case 'GATC':
        return t('role.gatc');
      default:
        return t('role.businessOwner');
    }
  };

  const handleRoleChange = (role: UserRole) => {
    switchRole(role);
    setRoleDropdownOpen(false);
    if (role === 'Legal Metrology Officer' || role === 'GATC') {
      navigate('/officer/dashboard');
    } else if (role === 'Administrator') {
      navigate('/admin/dashboard');
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F3EA] text-[#183B59] flex flex-col font-sans">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-[#F0F8FD]/95 backdrop-blur-md border-b border-[#D4E8F5] shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Left: Mobile Toggle & Brand Mark */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-2xl bg-white border border-[#D4E8F5] text-[#123F63] shadow-xs hover:bg-[#EAF6FD]"
              aria-label="Open navigation menu"
            >
              <Menu className="h-5 w-5" />
            </button>

            <Link to="/" className="flex items-center gap-2.5">
              <div className="h-10 w-10 rounded-2xl bg-[#2F8FCC] text-white flex items-center justify-center shadow-soft">
                <ShieldCheck className="h-6 w-6" strokeWidth={2.2} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-outfit text-xl font-extrabold tracking-tight text-[#123F63]">
                    {t('brand.name')}
                  </span>
                  <span className="text-[10px] font-bold bg-[#D4EBF9] text-[#123F63] px-2 py-0.5 rounded-full border border-[#BCE0F7]">
                    {t('brand.sihBadge')}
                  </span>
                </div>
                <p className="text-[10px] text-[#627B94] hidden sm:block">
                  {t('brand.portalTitle')}
                </p>
              </div>
            </Link>
          </div>

          {/* Center (Desktop): Clean Top Navigation bar tailored to active role */}
          <nav className="hidden lg:flex items-center gap-1.5 bg-[#E2F0F9]/80 p-1.5 rounded-2xl border border-[#CCE2F2] shadow-xs">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.label}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-150 active:scale-[0.98] ${
                      isActive
                        ? 'bg-[#2F8FCC] text-white shadow-xs'
                        : 'text-[#16466F] hover:text-[#123F63] hover:bg-white/80'
                    }`
                  }
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>

          {/* Right: Evaluator Role Switcher Pill, Language Switcher, Theme & Logout */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Quick Role Switcher Pill for judges */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-white border border-[#D4E8F5] shadow-xs text-xs font-bold hover:bg-[#EAF6FD] hover:border-[#2F8FCC]/40 active:scale-[0.98] transition-all duration-150 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#2F8FCC]"
                title={t('nav.switchPersona')}
              >
                <span className="h-2 w-2 rounded-full bg-[#1E8E5A]" />
                <span className="text-[#123F63] hidden sm:inline">{t('nav.role')}:</span>
                <span className="text-[#1E75AC]">{user.roleBadge}</span>
                <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
              </button>

              {roleDropdownOpen && (
                <div className="absolute right-0 mt-2 w-72 rounded-3xl bg-[#F0F8FD] p-3 shadow-soft-lg border border-[#D4E8F5] z-50 animate-in zoom-in-95 duration-150 space-y-1">
                  <div className="px-2.5 py-1.5 border-b border-[#D4E8F5]">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#627B94] block">
                      {t('nav.switchPersona')}:
                    </span>
                  </div>

                  {(
                    [
                      'Business / Instrument Owner',
                      'Legal Metrology Officer',
                      'Administrator',
                      'GATC',
                    ] as UserRole[]
                  ).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => handleRoleChange(r)}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-all duration-150 cursor-pointer active:scale-[0.99] ${
                        user.role === r
                          ? 'bg-[#2F8FCC] text-white font-bold'
                          : 'text-[#16466F] hover:text-[#123F63] hover:bg-white/80'
                      }`}
                    >
                      <span>{getRoleLabel(r)}</span>
                      {user.role === r && <CheckCircle2 className="h-4 w-4 text-white" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Language Switcher [ English | हिंदी ] */}
            <LanguageSwitcher />

            {/* Logout */}
            <button
              onClick={() => {
                logout();
                navigate('/login');
              }}
              className="p-2 rounded-2xl bg-white border border-[#D4E8F5] text-[#627B94] hover:text-red-600 hover:bg-red-50 hover:border-red-200 active:scale-[0.96] shadow-xs transition-all duration-150 hidden sm:block cursor-pointer focus-visible:outline-2 focus-visible:outline-[#2F8FCC]"
              title={t('nav.logout')}
              aria-label={t('nav.logout')}
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-slate-900/30 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative w-72 max-w-[85vw] bg-[#F0F8FD] border-r border-[#D4E8F5] shadow-soft-lg z-10 h-full flex flex-col p-5 justify-between animate-in slide-in-from-left duration-200">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-[#D4E8F5]">
                <div className="flex items-center gap-2">
                  <div className="h-9 w-9 rounded-xl bg-[#2F8FCC] text-white flex items-center justify-center">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-outfit text-base font-bold text-[#123F63]">
                      {t('brand.name')}
                    </h3>
                    <p className="text-[10px] text-[#627B94]">{getRoleLabel(user.role)}</p>
                  </div>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 rounded-xl text-slate-400 hover:bg-white hover:text-slate-700 active:scale-95 transition-all"
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Mobile Language Switcher */}
              <div className="pb-2">
                <LanguageSwitcher className="w-full justify-center" />
              </div>

              <nav className="space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.label}
                      to={item.to}
                      onClick={() => setMobileMenuOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all duration-150 active:scale-[0.98] ${
                          isActive
                            ? 'bg-[#2F8FCC] text-white shadow-xs'
                            : 'text-[#16466F] hover:bg-white/80 hover:text-[#123F63]'
                        }`
                      }
                    >
                      <Icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </NavLink>
                  );
                })}
              </nav>
            </div>

            <div className="pt-4 border-t border-[#D4E8F5]">
              <button
                onClick={() => {
                  logout();
                  navigate('/login');
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-2xl bg-red-50 text-red-700 hover:bg-red-100 active:scale-[0.98] text-xs font-bold transition-all"
              >
                <LogOut className="h-4 w-4" />
                <span>{t('nav.logout')}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet context={{ openNewApplication: () => navigate('/start-inspection') }} />
      </main>
    </div>
  );
};
