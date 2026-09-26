import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ShieldAlert,
  FileCheck2,
  Award,
  Filter,
  Check,
  RotateCcw,
  ExternalLink,
} from 'lucide-react';
import { useNotifications } from '../../context/NotificationContext';
import { NotificationItem } from '../../types';

export const NotificationsPage: React.FC = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const navigate = useNavigate();

  const [filterType, setFilterType] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');

  const filteredNotifications = notifications.filter((notif) => {
    if (filterType === 'unread' && notif.read) return false;
    if (filterType !== 'all' && filterType !== 'unread' && notif.type !== filterType) return false;
    if (filterPriority !== 'all' && notif.priority !== filterPriority) return false;
    return true;
  });

  const getNotificationIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'expiry':
        return <Clock className="h-5 w-5 text-amber-500" />;
      case 'assignment':
        return <FileCheck2 className="h-5 w-5 text-[#1769AA]" />;
      case 'verification':
        return <CheckCircle2 className="h-5 w-5 text-emerald-500" />;
      case 'certificate':
        return <Award className="h-5 w-5 text-sky-500" />;
      case 'alert':
        return <ShieldAlert className="h-5 w-5 text-[#D9534F]" />;
      default:
        return <Bell className="h-5 w-5 text-slate-500" />;
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-200">
      {/* Header (Section 29) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 card-greeting p-6 sm:p-8 rounded-3xl shadow-soft-card">
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#D5EEFB] text-[#1E75AC] border border-[#BDE0F7] shadow-xs">
            <Bell className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-outfit text-xl sm:text-2xl font-extrabold text-[#123F63]">
                Notifications Centre
              </h1>
              {unreadCount > 0 && (
                <span className="text-xs bg-[#2F8FCC] text-white font-bold px-2.5 py-0.5 rounded-full">
                  {unreadCount} Unread
                </span>
              )}
            </div>
            <p className="text-xs text-[#527290]">
              Live alerts for expirations, assignments, applications, and statutory notices
            </p>
          </div>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-white border border-[#CFE5F5] text-[#123F63] text-xs font-bold shadow-xs hover:bg-[#EDF8FE] transition-colors cursor-pointer"
          >
            <Check className="h-4 w-4 text-[#1E8E5A]" />
            <span>Mark All as Read</span>
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 card-neutral-blue p-4 rounded-2xl shadow-soft-card text-xs">
        <div className="flex flex-wrap items-center gap-1.5">
          {[
            { id: 'all', label: 'All Alerts' },
            { id: 'unread', label: 'Unread Only' },
            { id: 'expiry', label: 'Expiry Alerts' },
            { id: 'assignment', label: 'Assignments' },
            { id: 'verification', label: 'Verifications' },
            { id: 'certificate', label: 'Certificates' },
            { id: 'alert', label: 'Critical Alerts' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterType(tab.id)}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                filterType === tab.id
                  ? 'bg-[#2F8FCC] text-white shadow-xs'
                  : 'text-[#527290] hover:bg-[#EDF8FE] hover:text-[#123F63]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <select
          value={filterPriority}
          onChange={(e) => setFilterPriority(e.target.value)}
          className="rounded-xl border border-[#CFE5F5] bg-white px-3 py-1.5 text-xs font-semibold text-[#123F63] focus:ring-2 focus:ring-[#2F8FCC]"
        >
          <option value="all">All Priorities</option>
          <option value="high">High Priority</option>
          <option value="medium">Medium Priority</option>
          <option value="low">Low Priority</option>
        </select>
      </div>

      {/* Notification List */}
      <div className="space-y-3">
        {filteredNotifications.map((notif) => {
          let cardTypeClass = 'card-neutral-blue';
          if (notif.type === 'expiry') cardTypeClass = 'card-amber';
          else if (notif.type === 'verification') cardTypeClass = 'card-mint';
          else if (notif.type === 'assignment') cardTypeClass = 'card-lavender';
          else if (notif.type === 'alert') cardTypeClass = 'bg-[#FCECEC] border border-[#F8C8C6]';
          else if (notif.type === 'certificate') cardTypeClass = 'card-sky';

          return (
            <div
              key={notif.id}
              onClick={() => {
                markAsRead(notif.id);
                if (notif.link) navigate(notif.link);
              }}
              className={`p-4 sm:p-5 rounded-3xl transition-all duration-150 cursor-pointer flex items-start gap-4 shadow-soft-card hover:shadow-hover ${cardTypeClass} ${
                !notif.read ? 'ring-2 ring-[#2F8FCC]/30' : ''
              }`}
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white border border-[#DCEAF4] shadow-xs">
                {getNotificationIcon(notif.type)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-outfit text-sm font-bold text-[#123F63]">
                      {notif.title}
                    </h4>
                    {!notif.read && (
                      <span className="h-2 w-2 rounded-full bg-[#2F8FCC] shrink-0" />
                    )}
                    {notif.priority === 'high' && (
                      <span className="text-[10px] font-bold bg-[#FCECEC] text-[#A62F2C] border border-[#F8C8C6] px-2 py-0.2 rounded-full">
                        High Priority
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-[#7A93A8] shrink-0 font-medium">
                    {notif.timestamp}
                  </span>
                </div>

                <p className="text-xs text-[#527290] mt-1 leading-relaxed">
                  {notif.message}
                </p>

                {notif.link && (
                  <div className="mt-2.5 flex items-center gap-1 text-[11px] font-bold text-[#1E75AC]">
                    <span>Open Related Record</span>
                    <ExternalLink className="h-3 w-3" />
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {filteredNotifications.length === 0 && (
          <div className="rounded-3xl card-neutral-blue p-12 text-center text-[#527290] space-y-2">
            <Bell className="h-8 w-8 text-[#7A93A8] mx-auto" />
            <p className="text-sm font-bold text-[#123F63]">No notifications found</p>
            <p className="text-xs">You're completely caught up on all statutory verification alerts.</p>
          </div>
        )}
      </div>
    </div>
  );
};
