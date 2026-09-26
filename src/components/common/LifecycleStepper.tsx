import React from 'react';
import {
  FilePlus,
  FileCheck2,
  UserCheck,
  Search,
  Award,
  FileBadge,
  QrCode,
  ShieldCheck,
  RotateCw,
  CheckCircle2,
  Clock,
  AlertCircle,
} from 'lucide-react';

export interface LifecycleStep {
  id: string;
  name: string;
  description: string;
  status: 'completed' | 'current' | 'upcoming' | 'action_required';
  date?: string;
  actor: string;
  icon: React.ElementType;
}

interface LifecycleStepperProps {
  currentStage?: string;
  stepsData?: Partial<Record<string, { date?: string; actor?: string; notes?: string }>>;
  orientation?: 'horizontal' | 'vertical';
}

export const LifecycleStepper: React.FC<LifecycleStepperProps> = ({
  currentStage = 'Verification Result',
  stepsData = {},
  orientation = 'horizontal',
}) => {
  const steps: LifecycleStep[] = [
    {
      id: 'registration',
      name: 'Registration',
      description: 'Instrument cataloged & initial metadata logged',
      status: 'completed',
      date: stepsData['registration']?.date || '12-Apr-2023',
      actor: stepsData['registration']?.actor || 'Applicant / Manufacturer',
      icon: FilePlus,
    },
    {
      id: 'application',
      name: 'Application',
      description: 'Statutory verification request filed & fee paid',
      status: 'completed',
      date: stepsData['application']?.date || '22-Sep-2026',
      actor: stepsData['application']?.actor || 'Business Owner',
      icon: FileCheck2,
    },
    {
      id: 'assignment',
      name: 'Assignment',
      description: 'Allocated to certified LMO / GATC testing lab',
      status: 'completed',
      date: stepsData['assignment']?.date || '23-Sep-2026',
      actor: stepsData['assignment']?.actor || 'District Controller',
      icon: UserCheck,
    },
    {
      id: 'inspection',
      name: 'Physical Inspection',
      description: 'On-site standard weight testing & seal check',
      status: currentStage === 'Physical Inspection' ? 'current' : 'completed',
      date: stepsData['inspection']?.date || '24-Sep-2026',
      actor: stepsData['inspection']?.actor || 'Rajesh Kumar (Senior LMO)',
      icon: Search,
    },
    {
      id: 'result',
      name: 'Verification Result',
      description: 'Pass / Fail test observations certified',
      status:
        currentStage === 'Verification Result'
          ? 'current'
          : currentStage === 'Physical Inspection'
          ? 'upcoming'
          : 'completed',
      date: stepsData['result']?.date || '24-Sep-2026',
      actor: stepsData['result']?.actor || 'Legal Metrology Officer',
      icon: Award,
    },
    {
      id: 'certificate',
      name: 'Digital Certificate',
      description: 'Cryptographically signed e-Certificate issued',
      status:
        currentStage === 'Digital Certificate'
          ? 'current'
          : ['Registration', 'Application', 'Assignment', 'Physical Inspection', 'Verification Result'].includes(currentStage)
          ? 'upcoming'
          : 'completed',
      date: stepsData['certificate']?.date || '24-Sep-2026',
      actor: stepsData['certificate']?.actor || 'Portal Automated Signer',
      icon: FileBadge,
    },
    {
      id: 'qr_verify',
      name: 'QR Verification',
      description: 'Tamper-evident public QR code activated',
      status:
        ['Digital Certificate', 'QR Verification', 'Validity Tracking', 'Re-verification'].includes(currentStage)
          ? 'completed'
          : 'upcoming',
      date: stepsData['qr_verify']?.date || 'Active 24/7',
      actor: stepsData['qr_verify']?.actor || 'Public / Consumer Scan',
      icon: QrCode,
    },
    {
      id: 'validity',
      name: 'Validity Tracking',
      description: 'Active validity monitor & expiry reminders',
      status:
        currentStage === 'Validity Tracking'
          ? 'current'
          : currentStage === 'Re-verification'
          ? 'completed'
          : 'upcoming',
      date: stepsData['validity']?.date || 'Valid till 23-Sep-2027',
      actor: stepsData['validity']?.actor || 'PERIMETER Engine',
      icon: ShieldCheck,
    },
    {
      id: 'reverification',
      name: 'Re-verification',
      description: 'Annual statutory cycle renewal prompt',
      status: currentStage === 'Re-verification' ? 'action_required' : 'upcoming',
      date: stepsData['reverification']?.date || 'Due Aug 2027',
      actor: stepsData['reverification']?.actor || 'LMO / Field Division',
      icon: RotateCw,
    },
  ];

  return (
    <div className="w-full">
      {/* Horizontal View (Desktop/Tablet) */}
      <div className="hidden lg:block overflow-x-auto pb-4 pt-2">
        <div className="flex items-start min-w-[950px] relative">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isCompleted = step.status === 'completed';
            const isCurrent = step.status === 'current';
            const isAction = step.status === 'action_required';

            return (
              <div key={step.id} className="flex-1 relative group">
                {/* Connecting bar */}
                {index < steps.length - 1 && (
                  <div
                    className={`absolute top-5 left-1/2 w-full h-[3px] -z-0 transition-colors duration-200 ${
                      isCompleted
                        ? 'bg-[#2EAD7B]'
                        : isCurrent
                        ? 'bg-gradient-to-r from-[#1769AA] to-slate-200 dark:to-slate-700'
                        : 'bg-slate-200 dark:bg-slate-700'
                    }`}
                  />
                )}

                {/* Node */}
                <div className="flex flex-col items-center text-center px-1">
                  <div
                    className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full transition-all duration-200 shadow-xs ${
                      isCompleted
                        ? 'bg-[#E8F6F0] text-[#1E7D58] border-2 border-[#2EAD7B] dark:bg-[#064E3B] dark:text-[#34D399]'
                        : isCurrent
                        ? 'bg-[#1769AA] text-white ring-4 ring-[#1769AA]/20 animate-pulse'
                        : isAction
                        ? 'bg-amber-100 text-amber-700 border-2 border-amber-500 animate-bounce'
                        : 'bg-white text-slate-400 border-2 border-slate-200 dark:bg-slate-800 dark:border-slate-700'
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="h-5 w-5" />
                    ) : (
                      <Icon className="h-5 w-5" />
                    )}
                  </div>

                  <span
                    className={`mt-2.5 text-xs font-bold ${
                      isCompleted
                        ? 'text-[#17324D] dark:text-slate-200'
                        : isCurrent
                        ? 'text-[#1769AA] dark:text-[#38BDF8]'
                        : 'text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    {step.name}
                  </span>

                  <span className="text-[10px] text-slate-600 dark:text-slate-400 mt-0.5 line-clamp-1">
                    {step.actor}
                  </span>

                  {step.date && (
                    <span className="text-[9px] font-semibold text-[#1769AA] dark:text-[#38BDF8] bg-[#EAF3FA] dark:bg-slate-800 px-1.5 py-0.5 rounded-full mt-1">
                      {step.date}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Vertical View (Mobile/Tablet and Compact) */}
      <div className="lg:hidden space-y-4">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isCompleted = step.status === 'completed';
          const isCurrent = step.status === 'current';
          const isAction = step.status === 'action_required';

          return (
            <div key={step.id} className="relative flex items-start gap-3.5">
              {/* Vertical connector line */}
              {index < steps.length - 1 && (
                <div
                  className={`absolute left-5 top-10 bottom-0 w-[2px] -ml-[1px] ${
                    isCompleted
                      ? 'bg-[#2EAD7B]'
                      : 'bg-slate-200 dark:bg-slate-700'
                  }`}
                />
              )}

              <div
                className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full shadow-xs ${
                  isCompleted
                    ? 'bg-[#E8F6F0] text-[#1E7D58] border-2 border-[#2EAD7B] dark:bg-[#064E3B] dark:text-[#34D399]'
                    : isCurrent
                    ? 'bg-[#1769AA] text-white ring-4 ring-[#1769AA]/20'
                    : isAction
                    ? 'bg-amber-100 text-amber-700 border-2 border-amber-500'
                    : 'bg-white text-slate-400 border-2 border-slate-200 dark:bg-slate-800 dark:border-slate-700'
                }`}
              >
                {isCompleted ? (
                  <CheckCircle2 className="h-5 w-5" />
                ) : (
                  <Icon className="h-5 w-5" />
                )}
              </div>

              <div className="min-w-0 flex-1 pt-0.5 pb-3">
                <div className="flex items-center justify-between gap-2">
                  <p
                    className={`text-sm font-bold ${
                      isCompleted
                        ? 'text-[#17324D] dark:text-slate-100'
                        : isCurrent
                        ? 'text-[#1769AA] dark:text-[#38BDF8]'
                        : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {step.name}
                  </p>
                  {step.date && (
                    <span className="text-[10px] font-semibold text-[#1769AA] dark:text-[#38BDF8] bg-[#EAF3FA] dark:bg-slate-800 px-2 py-0.5 rounded-full">
                      {step.date}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {step.description}
                </p>
                <p className="text-[11px] font-medium text-slate-600 dark:text-slate-300 mt-1">
                  Actor: <span className="font-semibold">{step.actor}</span>
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
