import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ShieldCheck,
  Search,
  Bell,
  Sun,
  Moon,
  Plus,
  Menu,
  ChevronDown,
  User,
  Shield,
  CheckCircle2,
  LogOut,
  Building2,
  Sliders,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useNotifications } from '../../context/NotificationContext';
import { UserRole } from '../../types';

interface TopHeaderProps {
  onOpenMobileMenu: () => void;
  onOpenSearch: () => void;
  onOpenNewApplication?: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  onOpenMobileMenu,
  onOpenSearch,
  onOpenNewApplication,
}) => {
  const { user, switchRole, logout } = useAuth();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const { notifications, unreadCount, markAsRead } = useNotifications();
  const navigate = useNavigate();

  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationDropdownOpen, setNotificationDropdownOpen] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotificationDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleRoleSelect = (role: UserRole) => {
    switchRole(role);
    setProfileDropdownOpen(false);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#F7F8F6]/90 dark:bg-[#0B131E]/90 backdrop-blur-md transition-colors duration-200">
      <div className="mx-auto flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Left: Mobile Toggle & Brand Mark */}
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            onClick={onOpenMobileMenu}
            className="flex lg:hidden h-10 w-10 items-center justify-center rounded-2xl bg-white dark:bg-[#131E2C] border border-[#E5EAF0] dark:border-[#1E293B] text-slate-700 dark:text-slate-200 shadow-soft-card"
            aria-label="Toggle navigation menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          <Link to="/dashboard" className="flex items-center gap-3 group">
            {/* GovTech Shield Icon */}
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#1769AA] text-white shadow-soft transition-transform group-hover:scale-105">
              <ShieldCheck className="h-6 w-6 text-white" strokeWidth={2.2} />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-outfit text-xl font-extrabold tracking-tight text-[#123F66] dark:text-white">
                  PERIMETER
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-[#EAF3FA] px-2 py-0.5 text-[11px] font-bold text-[#1769AA] dark:bg-slate-800 dark:text-[#38BDF8] border border-[#CCE2F5] dark:border-slate-700">
                  SIH 2026
                </span>
              </div>
              <p className="text-[11px] font-medium text-[#6B7C8F] dark:text-slate-400 hidden sm:block">
                Legal Metrology Verification Portal
              </p>
            </div>
          </Link>
        </div>

        {/* Center: Global Search Bar */}
        <div className="hidden md:flex flex-1 max-w-md mx-6">
          <button
            onClick={onOpenSearch}
            className="flex w-full items-center justify-between rounded-2xl bg-white dark:bg-[#131E2C] px-4 py-2.5 text-xs font-medium text-[#6B7C8F] dark:text-slate-400 border border-[#E5EAF0] dark:border-[#1E293B] shadow-soft-card hover:border-[#1769AA]/40 dark:hover:border-[#38BDF8]/40 transition-all text-left group"
          >
            <div className="flex items-center gap-2.5">
              <Search className="h-4 w-4 text-slate-400 group-hover:text-[#1769AA] dark:group-hover:text-[#38BDF8]" />
              <span className="truncate">Search instrument, certificate, application...</span>
            </div>
            <kbd className="hidden lg:inline-flex items-center gap-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[10px] font-mono text-slate-500 dark:text-slate-400">
              Ctrl+K
            </kbd>
          </button>
        </div>

        {/* Right: Quick Action, Search Icon (mobile), Theme, Notifications, User Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Mobile search button */}
          <button
            onClick={onOpenSearch}
            className="md:hidden flex h-10 w-10 items-center justify-center rounded-2xl bg-white dark:bg-[#131E2C] border border-[#E5EAF0] dark:border-[#1E293B] text-slate-600 dark:text-slate-300 shadow-soft-card"
            aria-label="Search"
          >
            <Search className="h-4 w-4" />
          </button>

          {/* New Verification Action Button matching reference green/blue rounded button */}
          <button
            onClick={() => {
              if (onOpenNewApplication) {
                onOpenNewApplication();
              } else {
                navigate('/applications');
              }
            }}
            className="hidden sm:inline-flex items-center gap-1.5 rounded-2xl bg-[#2EAD7B] hover:bg-[#259468] text-white px-4 py-2.5 text-xs sm:text-sm font-bold shadow-soft transition-all hover:shadow-soft-lg active:scale-98"
          >
            <Plus className="h-4 w-4" strokeWidth={2.5} />
            <span>New Verification</span>
          </button>

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white dark:bg-[#131E2C] border border-[#E5EAF0] dark:border-[#1E293B] text-slate-600 dark:text-slate-300 shadow-soft-card hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            aria-label="Toggle theme"
          >
            {isDarkMode ? (
              <Sun className="h-4 w-4 text-amber-400" />
            ) : (
              <Moon className="h-4 w-4 text-slate-600" />
            )}
          </button>

          {/* Notifications Dropdown */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setNotificationDropdownOpen((prev) => !prev)}
              className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-white dark:bg-[#131E2C] border border-[#E5EAF0] dark:border-[#1E293B] text-slate-600 dark:text-slate-300 shadow-soft-card hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              aria-label="Notifications"
            >
              <Bell className="h-4 w-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#D9534F] text-[10px] font-bold text-white px-1 shadow-xs animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Menu */}
            {notificationDropdownOpen && (
              <div className="absolute right-0 mt-3 w-80 sm:w-96 rounded-3xl bg-white dark:bg-[#131E2C] p-4 shadow-soft-lg border border-[#E5EAF0] dark:border-[#1E293B] z-50 animate-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between pb-3 border-b border-[#E5EAF0] dark:border-[#1E293B]">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-[#17324D] dark:text-white">
                      Notifications
                    </span>
                    {unreadCount > 0 && (
                      <span className="text-[11px] font-semibold bg-[#EAF3FA] text-[#1769AA] dark:bg-slate-800 dark:text-[#38BDF8] px-2 py-0.5 rounded-full">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  <Link
                    to="/notifications"
                    onClick={() => setNotificationDropdownOpen(false)}
                    className="text-xs text-[#1769AA] dark:text-[#38BDF8] font-semibold hover:underline"
                  >
                    View All
                  </Link>
                </div>

                <div className="mt-3 space-y-2 max-h-72 overflow-y-auto">
                  {notifications.slice(0, 4).map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => {
                        markAsRead(notif.id);
                        if (notif.link) navigate(notif.link);
                        setNotificationDropdownOpen(false);
                      }}
                      className={`p-3 rounded-2xl cursor-pointer transition-colors ${
                        notif.read
                          ? 'bg-slate-50/60 dark:bg-slate-800/40'
                          : 'bg-[#EAF3FA]/60 dark:bg-slate-800'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-xs font-bold text-[#17324D] dark:text-slate-100">
                          {notif.title}
                        </p>
                        <span className="text-[10px] text-slate-600 dark:text-slate-400 shrink-0">
                          {notif.timestamp}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-1 line-clamp-2">
                        {notif.message}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Pill matching reference style */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setProfileDropdownOpen((prev) => !prev)}
              className="flex items-center gap-2.5 rounded-2xl bg-white dark:bg-[#131E2C] p-1.5 sm:px-3 sm:py-1.5 border border-[#E5EAF0] dark:border-[#1E293B] shadow-soft-card hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#123F66] text-white text-xs font-bold font-outfit shadow-xs">
                {user.name.split(' ').map((n) => n[0]).join('')}
              </div>
              <div className="text-left hidden sm:block">
                <div className="flex items-center gap-1.5">
                  <p className="text-xs font-bold text-[#17324D] dark:text-slate-100 leading-tight">
                    {user.name}
                  </p>
                  <span className="text-[10px] font-bold bg-[#EAF3FA] text-[#1769AA] dark:bg-slate-800 dark:text-[#38BDF8] px-1.5 py-0.2 rounded-sm">
                    {user.roleBadge}
                  </span>
                </div>
                <p className="text-[10px] text-[#6B7C8F] dark:text-slate-400 leading-tight truncate max-w-[120px]">
                  {user.designation}
                </p>
              </div>
              <ChevronDown className="h-3.5 w-3.5 text-slate-400 hidden sm:block" />
            </button>

            {/* Profile & Role Switcher Dropdown */}
            {profileDropdownOpen && (
              <div className="absolute right-0 mt-3 w-72 rounded-3xl bg-white dark:bg-[#131E2C] p-4 shadow-soft-lg border border-[#E5EAF0] dark:border-[#1E293B] z-50 animate-in zoom-in-95 duration-150">
                <div className="pb-3 border-b border-[#E5EAF0] dark:border-[#1E293B]">
                  <p className="text-xs text-slate-600 dark:text-slate-400">Signed in as</p>
                  <p className="text-sm font-bold text-[#17324D] dark:text-white">
                    {user.name}
                  </p>
                  <p className="text-xs text-[#1769AA] dark:text-[#38BDF8] truncate">
                    {user.email}
                  </p>
                  <div className="mt-1 flex items-center gap-1.5 text-[11px] text-slate-500">
                    <span>District: {user.district}, {user.state}</span>
                  </div>
                </div>

                {/* Role Switcher for Hackathon Demonstrator */}
                <div className="py-3 border-b border-[#E5EAF0] dark:border-[#1E293B]">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
                    Switch Persona (Demo View)
                  </p>
                  <div className="space-y-1">
                    {(
                      [
                        'Legal Metrology Officer',
                        'Administrator',
                        'GATC',
                        'Business / Instrument Owner',
                      ] as UserRole[]
                    ).map((r) => (
                      <button
                        key={r}
                        onClick={() => handleRoleSelect(r)}
                        className={`w-full text-left px-2.5 py-1.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors ${
                          user.role === r
                            ? 'bg-[#EAF3FA] text-[#1769AA] dark:bg-slate-800 dark:text-[#38BDF8]'
                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                      >
                        <span>{r}</span>
                        {user.role === r && <CheckCircle2 className="h-3.5 w-3.5 text-[#1769AA] dark:text-[#38BDF8]" />}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-2 space-y-1">
                  <Link
                    to="/settings"
                    onClick={() => setProfileDropdownOpen(false)}
                    className="flex items-center gap-2 px-2.5 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                  >
                    <Sliders className="h-3.5 w-3.5" />
                    <span>Account Settings</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-2.5 py-2 text-xs font-medium text-[#D9534F] hover:bg-[#FDECEC] dark:hover:bg-red-950/40 rounded-xl transition-colors text-left"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
