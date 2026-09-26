import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  Scale,
  CheckCircle2,
  FileText,
  UserCheck,
  Award,
  QrCode,
  ArrowRight,
  Phone,
  Mail,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from '../../i18n';
import { LanguageSwitcher } from '../../components/common/LanguageSwitcher';

export const LandingPage: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F7F3EA] text-[#183B59] font-sans antialiased selection:bg-[#EAF3F8] selection:text-[#17689A]">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-[#F0F8FD]/95 backdrop-blur-md border-b border-[#D4E8F5] shadow-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
          {/* Logo & SIH badge */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#2F8FCC] text-white shadow-soft transition-transform group-hover:scale-105">
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
              <p className="text-[11px] font-medium text-[#627B94] hidden sm:block">
                {t('brand.portalTitle')}
              </p>
            </div>
          </Link>

          {/* Nav Links, Language Switcher & Actions */}
          <div className="flex items-center gap-2.5 sm:gap-4">
            <Link
              to="/verify"
              className="text-xs sm:text-sm font-semibold text-[#16466F] hover:text-[#123F63] hover:underline transition-colors hidden md:block"
            >
              {t('nav.verifyCertificate')}
            </Link>

            {/* Language Switcher */}
            <LanguageSwitcher />

            {isAuthenticated ? (
              <Link
                to={
                  user.role === 'Legal Metrology Officer'
                    ? '/officer/dashboard'
                    : user.role === 'Administrator'
                    ? '/admin/dashboard'
                    : '/dashboard'
                }
                className="inline-flex items-center gap-1.5 rounded-2xl bg-[#2F8FCC] hover:bg-[#1E75AC] active:scale-[0.98] text-white px-4 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-bold shadow-soft transition-all"
              >
                <span>{t('action.goToDashboard')}</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="rounded-2xl border border-[#D4E8F5] bg-white px-3 sm:px-4 py-2 text-xs sm:text-sm font-bold text-[#123F63] shadow-xs hover:bg-[#EAF6FD] hover:border-[#2F8FCC] active:scale-[0.98] transition-all"
                >
                  {t('nav.login')}
                </Link>
                <Link
                  to="/signup"
                  className="rounded-2xl bg-[#2F8FCC] hover:bg-[#1E75AC] active:scale-[0.98] text-white px-3 sm:px-4 py-2 text-xs sm:text-sm font-bold shadow-soft transition-all hidden sm:inline-block"
                >
                  {t('nav.signup')}
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 pt-16 sm:pt-24 pb-16 text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#D5EEFB] text-[#123F63] text-xs font-bold border border-[#BCE0F7]">
          <Sparkles className="h-3.5 w-3.5 text-[#1E75AC]" />
          <span>{t('landing.heroTag')}</span>
        </div>

        <h1 className="font-outfit text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#123F63] tracking-tight leading-[1.15]">
          {t('landing.heroTitle1')} <br className="hidden sm:inline" />
          <span className="text-[#2F8FCC]">{t('landing.heroTitle2')}</span>
        </h1>

        <p className="text-base sm:text-lg text-[#627B94] max-w-2xl mx-auto font-normal leading-relaxed">
          {t('landing.heroDesc')}
        </p>

        {/* Primary CTA Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
          <Link
            to="/start-inspection"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-[#2F8FCC] hover:bg-[#1E75AC] text-white px-8 py-3.5 text-base font-bold shadow-soft hover:shadow-soft-lg active:scale-[0.98] transition-all cursor-pointer"
          >
            <span>{t('landing.startInspectionCta')}</span>
            <ArrowRight className="h-5 w-5" />
          </Link>

          <Link
            to="/verify"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-white border border-[#CFE5F5] text-[#123F63] hover:bg-[#EDF8FE] hover:border-[#2F8FCC] active:scale-[0.98] px-7 py-3.5 text-base font-bold shadow-soft-card transition-all cursor-pointer"
          >
            <QrCode className="h-5 w-5 text-[#1E75AC]" />
            <span>{t('landing.verifyCertificateCta')}</span>
          </Link>
        </div>

        {/* Clean Instrument Preview Card */}
        <div className="pt-10 max-w-xl mx-auto">
          <div className="relative rounded-3xl card-sky p-6 sm:p-8 border shadow-soft-card text-left space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-2xl bg-[#D5EEFB] flex items-center justify-center text-[#1E75AC] shadow-2xs">
                  <Scale className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-[#123F63]">
                    {t('landing.previewTitle')}
                  </h3>
                  <p className="text-xs text-[#627B94]">{t('landing.previewSubtitle')}</p>
                </div>
              </div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#D4F6E5] text-[#1E8E5A] border border-[#CDEFE0]">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>{t('landing.verifiedStamp')}</span>
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-[#CFE5F5] text-xs">
              <div>
                <span className="text-[#627B94] block text-[10px]">{t('landing.certificateNo')}</span>
                <span className="font-mono font-bold text-[#1E75AC]">LMV/MP/IND/2026/0821</span>
              </div>
              <div>
                <span className="text-[#627B94] block text-[10px]">{t('landing.validity')}</span>
                <span className="font-bold text-[#1E8E5A]">{t('landing.activeUntil')}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-[#FAF7F0] py-16 sm:py-20 border-y border-[#E8E3D9]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-12">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#1E75AC]">
              {t('landing.howItWorksTag')}
            </span>
            <h2 className="font-outfit text-2xl sm:text-3xl font-extrabold text-[#123F63]">
              {t('landing.howItWorksTitle')}
            </h2>
            <p className="text-xs sm:text-sm text-[#627B94] max-w-lg mx-auto">
              {t('landing.howItWorksDesc')}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                step: '1',
                title: t('landing.step1Title'),
                description: t('landing.step1Desc'),
                icon: Scale,
                cardClass: 'card-sky',
                iconBg: 'bg-[#D5EEFB] text-[#1E75AC]',
              },
              {
                step: '2',
                title: t('landing.step2Title'),
                description: t('landing.step2Desc'),
                icon: FileText,
                cardClass: 'card-lavender',
                iconBg: 'bg-[#E6E1FD] text-[#5B5FC7]',
              },
              {
                step: '3',
                title: t('landing.step3Title'),
                description: t('landing.step3Desc'),
                icon: UserCheck,
                cardClass: 'card-mint',
                iconBg: 'bg-[#D4F6E5] text-[#1E8E5A]',
              },
              {
                step: '4',
                title: t('landing.step4Title'),
                description: t('landing.step4Desc'),
                icon: Award,
                cardClass: 'card-amber',
                iconBg: 'bg-[#FEEDC8] text-[#B86C0B]',
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.step}
                  className={`rounded-3xl ${item.cardClass} p-6 border shadow-soft-card space-y-3 relative hover:-translate-y-0.5 transition-all`}
                >
                  <div className="flex items-center justify-between">
                    <div className={`h-10 w-10 rounded-2xl ${item.iconBg} flex items-center justify-center shadow-2xs`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="font-outfit text-2xl font-black text-black/15">
                      0{item.step}
                    </span>
                  </div>

                  <h3 className="font-outfit text-base font-bold text-[#123F63]">
                    {item.title}
                  </h3>

                  <p className="text-xs text-[#627B94] leading-relaxed font-normal">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Use PERIMETER */}
      <section className="py-16 sm:py-20 max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center space-y-2 mb-12">
          <h2 className="font-outfit text-2xl sm:text-3xl font-extrabold text-[#123F63]">
            {t('landing.whyTitle')}
          </h2>
          <p className="text-xs sm:text-sm text-[#627B94] max-w-md mx-auto">
            {t('landing.whySubtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              title: t('landing.why1Title'),
              desc: t('landing.why1Desc'),
              badge: 'bg-[#1E8E5A]',
            },
            {
              title: t('landing.why2Title'),
              desc: t('landing.why2Desc'),
              badge: 'bg-[#2F8FCC]',
            },
            {
              title: t('landing.why3Title'),
              desc: t('landing.why3Desc'),
              badge: 'bg-[#5B5FC7]',
            },
            {
              title: t('landing.why4Title'),
              desc: t('landing.why4Desc'),
              badge: 'bg-[#B86C0B]',
            },
          ].map((item, i) => (
            <div
              key={i}
              className="p-5 rounded-2xl card-neutral-blue border shadow-soft-card space-y-2 hover:-translate-y-0.5 transition-all"
            >
              <div className={`h-2 w-8 rounded-full ${item.badge}`} />
              <h4 className="font-bold text-sm text-[#123F63]">
                {item.title}
              </h4>
              <p className="text-xs text-[#627B94] font-normal">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Need Help / Contact Support Footer Section */}
      <section className="bg-white py-12 border-t border-[#E8E3D9]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-4">
          <h3 className="font-outfit text-xl font-bold text-[#16466F]">
            {t('landing.helpTitle')}
          </h3>
          <p className="text-xs sm:text-sm text-[#718295] max-w-md mx-auto">
            {t('landing.helpDesc')}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-semibold text-[#183B59] pt-2">
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-[#17689A]" />
              <span>{t('landing.helpline')}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-[#17689A]" />
              <span>{t('landing.supportEmail')}</span>
            </div>
          </div>

          <div className="pt-8 border-t border-[#E8E3D9]/60 text-[11px] text-[#718295]">
            <p>{t('landing.sihFooter')}</p>
            <p className="mt-0.5">{t('landing.sihSub')}</p>
          </div>
        </div>
      </section>
    </div>
  );
};
