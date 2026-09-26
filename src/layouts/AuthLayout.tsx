import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import { LanguageSwitcher } from '../components/common/LanguageSwitcher';

export const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F4F9FD] via-[#E5F2FB] to-[#D5EBF9] flex flex-col justify-between">
      <header className="px-6 py-4 flex items-center justify-between border-b border-[#D8EAF8]/60 bg-white/70 backdrop-blur-md">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#1B5887] to-[#2F8FCC] flex items-center justify-center text-white shadow-soft">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="font-extrabold text-[#123F63] text-lg tracking-tight">PERIMETER</span>
            <span className="text-[10px] block text-[#527290] font-medium uppercase tracking-wider">
              Legal Metrology System
            </span>
          </div>
        </Link>
        <LanguageSwitcher />
      </header>

      <main className="flex-1 flex items-center justify-center p-4 sm:p-6">
        <Outlet />
      </main>

      <footer className="py-4 text-center text-xs text-[#527290] border-t border-[#D8EAF8]/60 bg-white/40">
        © 2026 PERIMETER — Smart India Hackathon PS 26036. Department of Consumer Affairs.
      </footer>
    </div>
  );
};
