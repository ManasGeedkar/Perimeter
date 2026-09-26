import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Scale,
  FileCheck,
  ShieldCheck,
  Award,
  Users2,
  BarChart3,
  Bell,
  Settings,
  HelpCircle,
  Activity,
  X,
  Shield,
  Sparkles,
} from 'lucide-react';
import { useNotifications } from '../../context/NotificationContext';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  isMobileDrawer?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen = true,
  onClose,
  isMobileDrawer = false,
}) => {
  const { unreadCount } = useNotifications();

  const navigationItems = [
    { name: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
    { name: 'Instruments', to: '/instruments', icon: Scale },
    { name: 'Applications', to: '/applications', icon: FileCheck },
    { name: 'Verification', to: '/verification', icon: ShieldCheck },
    { name: 'Certificates', to: '/certificates', icon: Award },
    { name: 'Officers & GATC', to: '/officers', icon: Users2 },
    { name: 'Reports', to: '/reports', icon: BarChart3 },
    {
      name: 'Notifications',
      to: '/notifications',
      icon: Bell,
      badge: unreadCount > 0 ? unreadCount : undefined,
    },
    { name: 'Settings', to: '/settings', icon: Settings },
  ];

  const sidebarContent = (
    <div className="flex h-full flex-col justify-between p-4 sm:p-5">
      {/* Top Header inside Drawer for mobile */}
      {isMobileDrawer && (
        <div className="flex items-center justify-between pb-4 border-b border-[#E5EAF0] dark:border-[#1E293B] mb-2">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#1769AA] text-white shadow-soft">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-[#123F66] dark:text-white text-base font-outfit">
                  PERIMETER
                </span>
                <span className="text-[10px] bg-[#EAF3FA] text-[#1769AA] dark:bg-slate-800 dark:text-[#38BDF8] px-1.5 py-0.5 rounded-full font-bold">
                  SIH 2026
                </span>
              </div>
              <p className="text-[10px] text-[#6B7C8F] dark:text-slate-400">
                Legal Metrology Portal
              </p>
            </div>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="rounded-full p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
      )}

      {/* Navigation List */}
      <nav className="space-y-1.5 flex-1">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.to}
              onClick={isMobileDrawer ? onClose : undefined}
              className={({ isActive }) =>
                `group flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-sm font-semibold transition-all duration-150 ${
                  isActive
                    ? 'bg-[#EAF3FA] text-[#123F66] shadow-xs dark:bg-[#1E293B] dark:text-[#38BDF8]'
                    : 'text-[#6B7C8F] hover:bg-slate-100/80 hover:text-[#17324D] dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-slate-200'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-xl transition-colors ${
                        isActive
                          ? 'bg-[#1769AA] text-white dark:bg-[#38BDF8] dark:text-slate-950'
                          : 'text-slate-400 group-hover:text-[#1769AA] dark:text-slate-400 dark:group-hover:text-[#38BDF8]'
                      }`}
                    >
                      <Icon className="h-4 w-4" strokeWidth={isActive ? 2.5 : 2} />
                    </div>
                    <span>{item.name}</span>
                  </div>

                  {item.badge !== undefined && (
                    <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#1769AA] px-1.5 text-[10px] font-bold text-white shadow-xs">
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className="pt-4 border-t border-[#E5EAF0] dark:border-[#1E293B] space-y-2.5">
        <NavLink
          to="/settings"
          onClick={isMobileDrawer ? onClose : undefined}
          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
        >
          <HelpCircle className="h-4 w-4" />
          <span>Help & Statutory Support</span>
        </NavLink>

        {/* System Status Pill */}
        <div className="rounded-2xl bg-[#F7F8F6] p-3 border border-[#E5EAF0] dark:bg-[#0B131E] dark:border-[#1E293B]">
          <div className="flex items-center justify-between text-xs font-semibold">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#2EAD7B] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#2EAD7B]"></span>
              </span>
              <span className="text-[#17324D] dark:text-slate-200">Grid Connected</span>
            </div>
            <span className="text-[10px] text-[#2EAD7B] font-bold">100% OK</span>
          </div>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
            National Metrology Portal Active • SIH26036
          </p>
        </div>
      </div>
    </div>
  );

  // If Mobile Drawer
  if (isMobileDrawer) {
    if (!isOpen) return null;
    return (
      <div className="fixed inset-0 z-50 flex lg:hidden">
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
          onClick={onClose}
        />
        <div className="relative w-72 max-w-[85vw] bg-white dark:bg-[#131E2C] shadow-soft-lg z-10 h-full flex flex-col animate-in slide-in-from-left duration-200">
          {sidebarContent}
        </div>
      </div>
    );
  }

  // Desktop Floating / Docked Sidebar matching reference image
  return (
    <aside className="hidden lg:flex w-64 shrink-0 flex-col rounded-3xl bg-white dark:bg-[#131E2C] border border-[#E5EAF0] dark:border-[#1E293B] shadow-soft-card h-[calc(100vh-6rem)] sticky top-24 overflow-hidden">
      {sidebarContent}
    </aside>
  );
};
