import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { UserRole } from '../../../types';

export const SignUpPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [roleOption, setRoleOption] = useState<UserRole>('Business / Instrument Owner');
  const [name, setName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login(email || mobile, password, roleOption);
      if (roleOption === 'Legal Metrology Officer') {
        navigate('/officer/dashboard');
      } else if (roleOption === 'GATC') {
        navigate('/officer/dashboard');
      } else {
        navigate('/dashboard');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F3EA] text-[#183B59] flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
        <Link to="/" className="inline-flex items-center gap-2.5">
          <div className="h-10 w-10 rounded-2xl bg-[#17689A] text-white flex items-center justify-center shadow-soft">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <span className="font-outfit text-2xl font-extrabold text-[#16466F] dark:text-white">
            PERIMETER
          </span>
        </Link>
        <h2 className="font-outfit text-2xl sm:text-3xl font-extrabold text-[#16466F] dark:text-white">
          Create your account
        </h2>
        <p className="text-xs text-[#718295]">
          Sign up to register instruments and manage verification certificates
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-lg px-4">
        <div className="rounded-3xl card-neutral-blue p-7 sm:p-9 border border-[#DCEAF4] shadow-soft-card space-y-6">
          {/* Question: What are you here for? */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#123F63] block">
              What are you here for?
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {(
                [
                  'Business / Instrument Owner',
                  'Legal Metrology Officer',
                  'GATC',
                ] as UserRole[]
              ).map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => setRoleOption(role)}
                  className={`p-3 rounded-2xl border text-left text-xs font-semibold transition-all cursor-pointer ${
                    roleOption === role
                      ? 'border-[#2F8FCC] bg-[#EDF8FE] text-[#123F63] font-bold shadow-xs'
                      : 'border-[#CFE5F5] bg-white text-[#527290] hover:bg-[#F0F8FD]'
                  }`}
                >
                  <span className="block">{role}</span>
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="font-bold text-[#123F63] block mb-1">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Rahul Sharma"
                className="w-full rounded-xl border border-[#CFE5F5] bg-[#F0F8FD] px-3.5 py-2.5 text-xs sm:text-sm text-[#123F63] placeholder:text-[#8AA1B4] focus:outline-none focus:ring-2 focus:ring-[#2F8FCC]/20 focus:border-[#2F8FCC]"
              />
            </div>

            {roleOption === 'Business / Instrument Owner' && (
              <div>
                <label className="font-bold text-[#123F63] block mb-1">
                  Business / Trading Establishment Name *
                </label>
                <input
                  type="text"
                  required
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="e.g. Shanti Grain Stores"
                  className="w-full rounded-xl border border-[#CFE5F5] bg-[#F0F8FD] px-3.5 py-2.5 text-xs sm:text-sm text-[#123F63] placeholder:text-[#8AA1B4] focus:outline-none focus:ring-2 focus:ring-[#2F8FCC]/20 focus:border-[#2F8FCC]"
                />
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-[#123F63] block mb-1">
                  Mobile Number *
                </label>
                <input
                  type="tel"
                  required
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  placeholder="+91 98..."
                  className="w-full rounded-xl border border-[#CFE5F5] bg-[#F0F8FD] px-3.5 py-2.5 text-xs sm:text-sm text-[#123F63] placeholder:text-[#8AA1B4] focus:outline-none focus:ring-2 focus:ring-[#2F8FCC]/20 focus:border-[#2F8FCC]"
                />
              </div>

              <div>
                <label className="font-bold text-[#123F63] block mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@business.com"
                  className="w-full rounded-xl border border-[#CFE5F5] bg-[#F0F8FD] px-3.5 py-2.5 text-xs sm:text-sm text-[#123F63] placeholder:text-[#8AA1B4] focus:outline-none focus:ring-2 focus:ring-[#2F8FCC]/20 focus:border-[#2F8FCC]"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-[#123F63] block mb-1">
                Password *
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full rounded-xl border border-[#CFE5F5] bg-[#F0F8FD] px-3.5 py-2.5 text-xs sm:text-sm text-[#123F63] placeholder:text-[#8AA1B4] focus:outline-none focus:ring-2 focus:ring-[#2F8FCC]/20 focus:border-[#2F8FCC]"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-[#2F8FCC] hover:bg-[#1E75AC] active:scale-[0.98] text-white font-bold text-xs sm:text-sm shadow-soft transition-all cursor-pointer"
            >
              {isLoading ? 'Creating account...' : 'Create Account & Continue'}
            </button>
          </form>

          <div className="pt-2 text-center text-xs text-[#527290]">
            <span>Already registered? </span>
            <Link to="/login" className="font-bold text-[#2F8FCC] hover:text-[#1E75AC] hover:underline">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
