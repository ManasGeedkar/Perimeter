import React, { useState } from 'react';
import {
  User,
  CheckCircle2,
  Save,
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { useTheme } from '../../../context/ThemeContext';

export const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const { isDarkMode, toggleDarkMode } = useTheme();

  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [businessName, setBusinessName] = useState(user.businessName || 'ABC Traders');
  const [phone, setPhone] = useState('+91 98260 12345');
  const [district, setDistrict] = useState(user.district || 'Indore');
  const [state, setState] = useState(user.state || 'Madhya Pradesh');
  const [address, setAddress] = useState('14, Sarafa Bazar, Chhatribagh');
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-outfit text-3xl font-extrabold text-[#123F66] dark:text-white">
          My Profile & Settings
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
          Manage your verified business credentials and statutory communication details.
        </p>
      </div>

      {/* Account Badge Card */}
      <div className="card-greeting rounded-3xl p-6 shadow-soft-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-2xl bg-[#D5EEFB] text-[#1E75AC] border border-[#BDE0F7] flex items-center justify-center font-outfit text-2xl font-black shadow-xs">
            {name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-outfit text-xl font-bold text-[#123F63]">
                {name}
              </h2>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#EFFAF4] text-[#1E8E5A] border border-[#CDEFE0] flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" />
                Verified
              </span>
            </div>
            <p className="text-xs text-[#527290] mt-0.5">
              Role: <strong className="text-[#1E75AC] font-semibold">{user.role}</strong>
            </p>
            <p className="text-xs text-[#7A93A8]">
              Jurisdiction: {district}, {state}
            </p>
          </div>
        </div>

        <div
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#EDF8FE] border border-[#CFE5F5] text-xs font-bold text-[#16466F] self-start sm:self-center shadow-xs"
        >
          <span className="h-2 w-2 rounded-full bg-[#1E8E5A]" />
          <span>Theme: PERIMETER Sky-Cream</span>
        </div>
      </div>

      {/* Profile Form */}
      <form onSubmit={handleSave} className="card-neutral-blue rounded-3xl p-6 sm:p-8 shadow-soft-card space-y-6">
        <h3 className="font-outfit text-lg font-bold text-[#123F63] flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-[#D5EEFB] text-[#1E75AC]">
            <User className="h-4 w-4" />
          </div>
          <span>General Information</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#527290] mb-1">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-white border border-[#DCEAF4] text-xs font-medium text-[#123F63] focus:outline-none focus:ring-2 focus:ring-[#2F8FCC]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#527290] mb-1">
              Business / Trade Name
            </label>
            <input
              type="text"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-white border border-[#DCEAF4] text-xs font-medium text-[#123F63] focus:outline-none focus:ring-2 focus:ring-[#2F8FCC]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#527290] mb-1">
              Official Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-white border border-[#DCEAF4] text-xs font-medium text-[#123F63] focus:outline-none focus:ring-2 focus:ring-[#2F8FCC]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#527290] mb-1">
              Mobile Number
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-white border border-[#DCEAF4] text-xs font-medium text-[#123F63] focus:outline-none focus:ring-2 focus:ring-[#2F8FCC]"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-[#527290] mb-1">
              Business Premise Address
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-white border border-[#DCEAF4] text-xs font-medium text-[#123F63] focus:outline-none focus:ring-2 focus:ring-[#2F8FCC]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#527290] mb-1">
              District
            </label>
            <input
              type="text"
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-white border border-[#DCEAF4] text-xs font-medium text-[#123F63] focus:outline-none focus:ring-2 focus:ring-[#2F8FCC]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#527290] mb-1">
              State
            </label>
            <input
              type="text"
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-white border border-[#DCEAF4] text-xs font-medium text-[#123F63] focus:outline-none focus:ring-2 focus:ring-[#2F8FCC]"
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-[#DCEAF4]">
          <span className="text-xs text-[#1E8E5A] font-bold">
            {saved ? 'Changes saved successfully!' : ''}
          </span>

          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#2F8FCC] hover:bg-[#1E75AC] text-white font-bold text-xs shadow-soft transition-all"
          >
            <Save className="h-4 w-4" />
            <span>Save Profile</span>
          </button>
        </div>
      </form>
    </div>
  );
};
