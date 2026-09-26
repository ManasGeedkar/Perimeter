import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, UserCheck } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { UserRole } from '../../../types';
import { useTranslation } from '../../../i18n';
import { LanguageSwitcher } from '../../../components/common/LanguageSwitcher';

export const LoginPage: React.FC = () => {
  const { login, switchRole } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [emailOrPhone, setEmailOrPhone] = useState('rahul.sharma@indoregrain.in');
  const [password, setPassword] = useState('Sharma@2026');
  const [isOfficerMode, setIsOfficerMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const role: UserRole = isOfficerMode ? 'Legal Metrology Officer' : 'Business / Instrument Owner';
      await login(emailOrPhone, password, role);

      if (isOfficerMode) {
        navigate('/officer/dashboard');
      } else {
        navigate('/dashboard');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const setOfficerDemo = () => {
    setIsOfficerMode(true);
    setEmailOrPhone('rajesh.kumar@legalmetrology.gov.in');
    setPassword('LMO@Indore2026');
  };

  const setBusinessDemo = () => {
    setIsOfficerMode(false);
    setEmailOrPhone('rahul.sharma@indoregrain.in');
    setPassword('Sharma@2026');
  };

  return (
    <div className="min-h-screen bg-[#F7F3EA] text-[#183B59] flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
        <div className="flex items-center justify-center gap-4">
          <Link to="/" className="inline-flex items-center gap-2.5">
            <div className="h-10 w-10 rounded-2xl bg-[#17689A] text-white flex items-center justify-center shadow-soft">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <span className="font-outfit text-2xl font-extrabold text-[#16466F]">
              {t('brand.name')}
            </span>
          </Link>
          <LanguageSwitcher />
        </div>
        <h2 className="font-outfit text-2xl sm:text-3xl font-extrabold text-[#16466F]">
          {t('auth.welcomeBack')}
        </h2>
        <p className="text-xs text-[#718295]">
          {isOfficerMode
            ? `${t('role.officer')} • ${t('brand.portalTitle')}`
            : t('auth.loginSubtitle')}
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="rounded-3xl card-neutral-blue p-7 sm:p-9 border border-[#DCEAF4] shadow-soft-card space-y-6">
          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div>
              <label className="font-bold text-[#123F63] block mb-1">
                {t('auth.emailOrPhone')}
              </label>
              <input
                type="text"
                required
                value={emailOrPhone}
                onChange={(e) => setEmailOrPhone(e.target.value)}
                placeholder="Enter mobile or email"
                className="w-full rounded-xl border border-[#CFE5F5] bg-[#F0F8FD] px-3.5 py-3 text-xs sm:text-sm text-[#123F63] placeholder:text-[#8AA1B4] focus:outline-none focus:ring-2 focus:ring-[#2F8FCC]/20 focus:border-[#2F8FCC]"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-bold text-[#123F63]">
                  {t('auth.password')}
                </label>
                <a
                  href="#forgot"
                  onClick={(e) => {
                    e.preventDefault();
                    alert('Demo Mode: Password reset link dispatched via SMS.');
                  }}
                  className="font-semibold text-[#2F8FCC] hover:text-[#1E75AC] hover:underline"
                >
                  Forgot password?
                </a>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full rounded-xl border border-[#CFE5F5] bg-[#F0F8FD] px-3.5 py-3 text-xs sm:text-sm text-[#123F63] placeholder:text-[#8AA1B4] focus:outline-none focus:ring-2 focus:ring-[#2F8FCC]/20 focus:border-[#2F8FCC]"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-[#2F8FCC] hover:bg-[#1E75AC] active:scale-[0.98] text-white font-bold text-xs sm:text-sm shadow-soft transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-[#2F8FCC]"
            >
              {isLoading ? `${t('status.pending')}...` : isOfficerMode ? `${t('nav.login')} (${t('role.officer')})` : t('auth.loginButton')}
            </button>
          </form>

          <div className="pt-2 text-center text-xs text-[#527290]">
            <span>{t('auth.noAccount')} </span>
            <Link to="/signup" className="font-bold text-[#2F8FCC] hover:text-[#1E75AC] hover:underline transition-colors">
              {t('auth.createAccount')}
            </Link>
          </div>

          {/* Officer Login toggle link */}
          <div className="pt-4 border-t border-[#DCEAF4] text-center">
            <p className="text-[11px] text-[#527290]">
              {isOfficerMode ? 'Are you a shop or instrument owner?' : 'Are you a Legal Metrology Officer?'}
            </p>
            <button
              type="button"
              onClick={() => {
                if (isOfficerMode) setBusinessDemo();
                else setOfficerDemo();
              }}
              className="mt-1 text-xs font-bold text-[#2F8FCC] hover:text-[#1E75AC] hover:underline inline-flex items-center gap-1 cursor-pointer transition-colors"
            >
              <UserCheck className="h-3.5 w-3.5" />
              <span>{isOfficerMode ? 'Switch to Business Login' : 'Officer Login'}</span>
            </button>
          </div>
        </div>

        {/* Quick Demo Role Switcher for Hackathon Judges */}
        <div className="mt-4 p-3 rounded-2xl card-sky border border-[#CFE5F5] text-center text-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#527290] block mb-1">
            Evaluator Demo Quick Fill
          </span>
          <div className="flex justify-center gap-2">
            <button
              type="button"
              onClick={setBusinessDemo}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all active:scale-[0.98] cursor-pointer focus-visible:outline-2 focus-visible:outline-[#2F8FCC] ${
                !isOfficerMode ? 'bg-[#2F8FCC] text-white shadow-2xs' : 'bg-white text-[#123F63] border border-[#CFE5F5] hover:bg-[#E2F0F9]'
              }`}
            >
              Rahul (Business User)
            </button>
            <button
              type="button"
              onClick={setOfficerDemo}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all active:scale-[0.98] cursor-pointer focus-visible:outline-2 focus-visible:outline-[#2F8FCC] ${
                isOfficerMode ? 'bg-[#2F8FCC] text-white shadow-2xs' : 'bg-white text-[#123F63] border border-[#CFE5F5] hover:bg-[#E2F0F9]'
              }`}
            >
              Rajesh (LMO Officer)
            </button>
            <button
              type="button"
              onClick={() => {
                switchRole('Administrator');
                navigate('/admin/dashboard');
              }}
              className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-white text-[#123F63] border border-[#CFE5F5] hover:bg-[#E2F0F9] active:scale-[0.98] transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-[#2F8FCC]"
            >
              Admin View
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
