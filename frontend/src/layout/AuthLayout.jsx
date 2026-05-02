import React from 'react';
import AnchorCrystal from '../components/common/AnchorCrystal';
import { motion } from 'framer-motion';

const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen w-full bg-bg text-on-surface flex flex-col relative overflow-hidden">
      {/* Background Volumetric Fog */}
      <div className="absolute inset-0 z-0 opacity-40">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-tertiary/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-secondary/10 blur-[150px]" />
      </div>

      {/* Header with Crystal */}
      <header className="p-8 flex justify-end relative z-50">
        <AnchorCrystal />
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4 relative z-10">
        {children}
      </main>

      {/* Minimal Footer */}
      <footer className="p-8 text-center relative z-10">
        <p className="text-[10px] font-bold text-on-surface/20 tracking-[0.5em]">KALEIDO V.01 — VOID PROTOCOL</p>
      </footer>
    </div>
  );
};

export default AuthLayout;
