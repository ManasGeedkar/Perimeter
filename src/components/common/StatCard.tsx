import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown, Minus } from 'lucide-react';

export type StatCardVariant = 'sky' | 'lavender' | 'mint' | 'amber' | 'danger' | 'neutral';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  iconColor?: string;
  iconBg?: string;
  variant?: StatCardVariant;
  trend?: {
    value: string;
    isPositive?: boolean;
    isNeutral?: boolean;
    label?: string;
  };
  contextText?: string;
  onClick?: () => void;
  highlight?: boolean;
}

const variantStyles: Record<
  StatCardVariant,
  { card: string; iconBg: string; iconColor: string }
> = {
  sky: {
    card: 'bg-[#EDF8FE] border-[#CFE5F5]',
    iconBg: 'bg-[#D5EEFB]',
    iconColor: 'text-[#1E75AC]',
  },
  lavender: {
    card: 'bg-[#F3F1FE] border-[#E0DCFB]',
    iconBg: 'bg-[#E6E1FD]',
    iconColor: 'text-[#5B5FC7]',
  },
  mint: {
    card: 'bg-[#EFFAF4] border-[#CDEFE0]',
    iconBg: 'bg-[#D4F6E5]',
    iconColor: 'text-[#1E8E5A]',
  },
  amber: {
    card: 'bg-[#FFF7E8] border-[#FCE3BA]',
    iconBg: 'bg-[#FEEDC8]',
    iconColor: 'text-[#B86C0B]',
  },
  danger: {
    card: 'bg-[#FFF2F2] border-[#FAD0D0]',
    iconBg: 'bg-[#FDE2E2]',
    iconColor: 'text-[#D04040]',
  },
  neutral: {
    card: 'bg-[#F5FAFD] border-[#DCEAF4]',
    iconBg: 'bg-[#E3EFF7]',
    iconColor: 'text-[#1E75AC]',
  },
};

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  iconColor,
  iconBg,
  variant,
  trend,
  contextText,
  onClick,
  highlight = false,
}) => {
  const chosenVariant = variant ? variantStyles[variant] : null;
  const cardStyle = chosenVariant ? chosenVariant.card : 'bg-white border-[#E8E3D9]';
  const effectiveIconBg = iconBg || chosenVariant?.iconBg || 'bg-[#EAF3FA]';
  const effectiveIconColor = iconColor || chosenVariant?.iconColor || 'text-[#1E75AC]';

  return (
    <div
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={(e) => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick();
        }
      }}
      className={`group relative overflow-hidden rounded-2xl md:rounded-3xl p-5 md:p-6 transition-all duration-200 border shadow-soft-card ${cardStyle} ${
        highlight
          ? 'border-[#2F8FCC]/60 ring-2 ring-[#2F8FCC]/20'
          : ''
      } ${
        onClick
          ? 'cursor-pointer hover:-translate-y-1 hover:shadow-soft-lg hover:border-[#2F8FCC]/50 active:scale-[0.99] focus-visible:outline-2 focus-visible:outline-[#2F8FCC]'
          : ''
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <p className="text-xs md:text-sm font-semibold text-[#627B94] tracking-wide">
            {title}
          </p>
          <p className="text-2xl md:text-3xl font-extrabold tracking-tight text-[#123F63] font-outfit">
            {typeof value === 'number' ? value.toLocaleString('en-IN') : value}
          </p>
        </div>
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl transition-transform duration-200 group-hover:scale-105 shadow-2xs ${effectiveIconBg} ${effectiveIconColor}`}
        >
          <Icon className="h-6 w-6" strokeWidth={2.2} />
        </div>
      </div>

      {(trend || contextText) && (
        <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-black/5 pt-3 text-xs">
          {trend && (
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-medium ${
                trend.isNeutral
                  ? 'bg-slate-100 text-slate-700'
                  : trend.isPositive
                  ? 'bg-[#EFFAF4] text-[#1E8E5A] border border-[#CDEFE0]'
                  : 'bg-[#FFF2F2] text-[#D04040] border border-[#FAD0D0]'
              }`}
            >
              {trend.isNeutral ? (
                <Minus className="h-3 w-3" />
              ) : trend.isPositive ? (
                <TrendingUp className="h-3 w-3" />
              ) : (
                <TrendingDown className="h-3 w-3" />
              )}
              {trend.value}
            </span>
          )}
          {contextText && (
            <span className="text-[#627B94] truncate font-medium">
              {contextText}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
