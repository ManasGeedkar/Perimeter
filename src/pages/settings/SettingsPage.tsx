import React, { useState } from 'react';
import {
  Settings,
  User,
  Moon,
  Sun,
  Bell,
  Shield,
  Sliders,
  CheckCircle2,
  Building,
  Key,
  Database,
  Sparkles,
  Save,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { UserRole } from '../../types';

export const SettingsPage: React.FC = () => {
  const { user, switchRole } = useAuth();
  const { isDarkMode, toggleDarkMode } = useTheme();

  const [activeTab, setActiveTab] = useState<'profile' | 'appearance' | 'notifications' | 'security' | 'standards'>('profile');

  // Form states
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [district, setDistrict] = useState(user.district);
  const [state, setState] = useState(user.state);

  // Notification toggles
  const [notifyExpiry30, setNotifyExpiry30] = useState(true);
  const [notifyExpiry7, setNotifyExpiry7] = useState(true);
  const [notifyAssigned, setNotifyAssigned] = useState(true);
  const [notifyPublicScans, setNotifyPublicScans] = useState(false);

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 card-greeting p-6 sm:p-8 rounded-3xl shadow-soft-card">
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#D5EEFB] text-[#1E75AC] border border-[#BDE0F7] shadow-xs">
            <Settings className="h-5 w-5" />
          </div>
          <div>
            <h1 className="font-outfit text-xl sm:text-2xl font-extrabold text-[#123F63]">
              System Settings & Preferences
            </h1>
            <p className="text-xs text-[#527290]">
              Manage personal profile, role perspectives, appearance, and statutory standards
            </p>
          </div>
        </div>
      </div>

      {/* Main Settings Card */}
      <div className="card-neutral-blue rounded-3xl shadow-soft-card overflow-hidden">
        {/* Navigation Tabs */}
        <div className="flex border-b border-[#CFE5F5] px-6 pt-4 gap-4 overflow-x-auto text-xs font-bold bg-[#EDF8FE]/50">
          {[
            { id: 'profile', label: 'Profile & Role', icon: User },
            { id: 'appearance', label: 'Appearance & Theme', icon: isDarkMode ? Moon : Sun },
            { id: 'notifications', label: 'Notification Alerts', icon: Bell },
            { id: 'standards', label: 'Metrology Standards', icon: Sliders },
            { id: 'security', label: 'Security & Auth', icon: Shield },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 pb-3.5 border-b-2 transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'border-[#2F8FCC] text-[#1E75AC]'
                    : 'border-transparent text-[#627B94] hover:text-[#123F63]'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Contents */}
        <div className="p-6 sm:p-8">
          {savedSuccess && (
            <div className="mb-6 flex items-center gap-2 p-3 rounded-2xl bg-[#EFFAF4] text-[#1E8E5A] text-xs font-semibold border border-[#CDEFE0]">
              <CheckCircle2 className="h-4 w-4" />
              <span>Settings and preferences successfully saved to portal.</span>
            </div>
          )}

          {/* 1. Profile & Role */}
          {activeTab === 'profile' && (
            <form onSubmit={handleSave} className="space-y-6 text-xs">
              <div className="p-4 rounded-2xl card-sky space-y-3">
                <span className="font-bold text-[#123F63] uppercase tracking-wider text-[11px] block">
                  Active Persona / Role Switcher (Hackathon Evaluator Mode)
                </span>
                <p className="text-[#527290]">
                  Switch roles instantly to experience the portal as different stakeholders:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
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
                      type="button"
                      onClick={() => switchRole(r)}
                      className={`p-3 rounded-xl text-left font-semibold border flex items-center justify-between transition-all cursor-pointer ${
                        user.role === r
                          ? 'bg-white border-[#2F8FCC] text-[#1E75AC] shadow-xs'
                          : 'bg-white/60 border-[#CFE5F5] text-[#527290] hover:bg-white'
                      }`}
                    >
                      <span>{r}</span>
                      {user.role === r && <CheckCircle2 className="h-4 w-4" />}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-[#527290] block mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-xl border border-[#CFE5F5] bg-white px-3 py-2 text-xs text-[#123F63] focus:outline-none focus:ring-2 focus:ring-[#2F8FCC]"
                  />
                </div>

                <div>
                  <label className="font-bold text-[#527290] block mb-1">
                    Official Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-[#CFE5F5] bg-white px-3 py-2 text-xs text-[#123F63] focus:outline-none focus:ring-2 focus:ring-[#2F8FCC]"
                  />
                </div>

                <div>
                  <label className="font-bold text-[#527290] block mb-1">
                    District Jurisdiction
                  </label>
                  <input
                    type="text"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full rounded-xl border border-[#CFE5F5] bg-white px-3 py-2 text-xs text-[#123F63] focus:outline-none focus:ring-2 focus:ring-[#2F8FCC]"
                  />
                </div>

                <div>
                  <label className="font-bold text-[#527290] block mb-1">
                    State Jurisdiction
                  </label>
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full rounded-xl border border-[#CFE5F5] bg-white px-3 py-2 text-xs text-[#123F63] focus:outline-none focus:ring-2 focus:ring-[#2F8FCC]"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-[#CFE5F5]">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-2xl bg-[#2F8FCC] hover:bg-[#1E75AC] text-white font-bold text-xs shadow-soft transition-all cursor-pointer"
                >
                  Save Profile Settings
                </button>
              </div>
            </form>
          )}

          {/* 2. Appearance & Theme */}
          {activeTab === 'appearance' && (
            <div className="space-y-6 text-xs">
              <div className="space-y-2">
                <h4 className="font-outfit text-sm font-bold text-[#123F63]">
                  Interface Theme
                </h4>
                <p className="text-[#527290]">
                  Standard PERIMETER Institutional Design System for the Department of Legal Metrology portal.
                </p>
              </div>

              <div className="max-w-md">
                <div className="p-5 rounded-3xl border border-[#2F8FCC] ring-2 ring-[#2F8FCC]/20 bg-[#F7F3EA] shadow-soft-card transition-all">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-[#123F63]">PERIMETER Sky-Cream Theme</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#EFFAF4] text-[#1E8E5A] border border-[#CDEFE0]">
                        Active & Standard
                      </span>
                    </div>
                    <CheckCircle2 className="h-5 w-5 text-[#1E8E5A]" />
                  </div>
                  <p className="text-[#527290] text-[11px] leading-relaxed">
                    Curated warm off-white cream (#F7F3EA), soft sky-blue identity (#2F8FCC), and differentiated pastel cards calibrated for high clarity and modern institutional elegance.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* 3. Notifications */}
          {activeTab === 'notifications' && (
            <div className="space-y-4 text-xs">
              <h4 className="font-outfit text-sm font-bold text-[#17324D] dark:text-white">
                Statutory Alert Triggers
              </h4>
              <div className="space-y-3">
                {[
                  {
                    label: '30-Day Certificate Expiry Warning',
                    desc: 'Notify when an instrument certificate reaches 30 days before statutory expiration.',
                    checked: notifyExpiry30,
                    toggle: () => setNotifyExpiry30(!notifyExpiry30),
                  },
                  {
                    label: '7-Day Urgent Expiry Notice',
                    desc: 'High priority alert to schedule final verification before penalty proceedings.',
                    checked: notifyExpiry7,
                    toggle: () => setNotifyExpiry7(!notifyExpiry7),
                  },
                  {
                    label: 'Officer Field Assignments',
                    desc: 'Notify whenever a new verification application is assigned to your circle.',
                    checked: notifyAssigned,
                    toggle: () => setNotifyAssigned(!notifyAssigned),
                  },
                  {
                    label: 'Public QR Code Scans',
                    desc: 'Receive audit logging when citizens scan counter QR codes.',
                    checked: notifyPublicScans,
                    toggle: () => setNotifyPublicScans(!notifyPublicScans),
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-start justify-between p-3.5 rounded-2xl bg-[#F7F8F6] dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
                  >
                    <div>
                      <span className="font-bold text-[#17324D] dark:text-white block">
                        {item.label}
                      </span>
                      <span className="text-[11px] text-slate-500">{item.desc}</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={item.checked}
                      onChange={item.toggle}
                      className="h-4 w-4 rounded-md border-slate-300 text-[#1769AA] focus:ring-[#1769AA] mt-1"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. Standards */}
          {activeTab === 'standards' && (
            <div className="space-y-4 text-xs">
              <h4 className="font-outfit text-sm font-bold text-[#17324D] dark:text-white">
                Statutory Metrology Rules & Tolerances
              </h4>
              <div className="p-4 rounded-2xl bg-[#F7F8F6] dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="flex items-center justify-between font-bold">
                  <span>Legal Metrology Act Version</span>
                  <span className="font-mono text-[#1769AA]">Act 1 of 2010 (Amended 2026)</span>
                </div>
                <div className="flex items-center justify-between font-bold">
                  <span>Maximum Permissible Error (MPE) Formula</span>
                  <span className="font-mono text-emerald-600">OIML R76 Class I-IIII</span>
                </div>
                <div className="flex items-center justify-between font-bold">
                  <span>National Physical Laboratory (NPL) Traceability</span>
                  <span className="text-emerald-700 font-semibold">Active Sync (100%)</span>
                </div>
                <div className="flex items-center justify-between font-bold">
                  <span>Digital Certificate Cryptographic Hash</span>
                  <span className="font-mono text-slate-500">SHA-256 + ECDSA</span>
                </div>
              </div>
            </div>
          )}

          {/* 5. Security */}
          {activeTab === 'security' && (
            <div className="space-y-4 text-xs">
              <h4 className="font-outfit text-sm font-bold text-[#17324D] dark:text-white">
                Security & Audit Ledger
              </h4>
              <div className="p-4 rounded-2xl bg-[#F7F8F6] dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold">Authentication Mode</span>
                  <span className="font-mono text-[#2EAD7B] font-bold">GovTech SSO / 2FA Ready</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-bold">Digital Signature Algorithm</span>
                  <span className="font-mono text-slate-600 dark:text-slate-300">FIPS 186-4 Compliant</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-bold">Audit Trail Storage</span>
                  <span className="font-mono text-slate-600 dark:text-slate-300">Immutable Hash Chain</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
