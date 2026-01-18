
import React from 'react';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FA]">
      <nav className="bg-[#0A2540] sticky top-0 z-50 shadow-lg backdrop-blur-md bg-opacity-95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center md:justify-start h-20 items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-[#00D9FF] rounded-xl flex items-center justify-center text-[#0A2540] font-black text-xl shadow-lg shadow-cyan-500/20">O</div>
              <div className="flex flex-col">
                <span className="text-xl font-extrabold text-white tracking-tight leading-none">OptiTax</span>
                <span className="text-[10px] font-bold text-[#00D9FF] uppercase tracking-[0.2em] mt-1">by l'Ingé Patrimoine</span>
              </div>
            </div>
          </div>
        </div>
      </nav>
      <main className="flex-grow">
        {children}
      </main>
      <footer className="bg-[#0A2540] border-t border-white/10 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex flex-col items-center md:items-start">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-6 h-6 bg-[#00D9FF] rounded flex items-center justify-center text-[#0A2540] font-bold text-xs">O</div>
                <span className="text-lg font-bold text-white tracking-tight">OptiTax <span className="text-[#00D9FF]">by l'Ingé Patrimoine</span></span>
              </div>
              <p className="text-white/50 text-xs max-w-xs text-center md:text-left">
                L'outil d'analyse fiscale par excellence pour les professionnels exigeants du patrimoine.
              </p>
            </div>
            <div className="text-white/40 text-sm font-medium">
              &copy; 2024 OptiTax by l'Ingé Patrimoine. Tous droits réservés.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
