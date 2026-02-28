
import React from 'react';
import { ExternalLink, Calendar, AlertCircle } from 'lucide-react';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col font-body">
      {/* Navbar - Solid background to prevent flickering from animated grid background */}
      <header className="bg-brand-navy border-b border-brand-accent/20 fixed top-0 left-0 right-0 w-full z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white p-2 rounded-xl shadow-[0_0_15px_rgba(0,217,255,0.3)] flex items-center justify-center overflow-hidden">
              <img
                src="https://lingepatrimoine.fr/logo/logo_inge_patrimoine-removebg-preview.png"
                alt="Logo L'Ingé Patrimoine"
                className="w-8 h-8 object-contain"
              />
            </div>
            <div>
              <h1 className="text-xl font-heading font-extrabold tracking-tight text-white">Opti<span className="text-brand-accent">Tax</span></h1>
              <p className="text-[10px] text-brand-accent/70 font-bold uppercase tracking-widest">by L'Ingé Patrimoine</p>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-1">
            {/* Navigation links removed as requested */}
          </nav>
        </div>
      </header>

      {/* Main Content - pt-20 added to compensate for fixed header */}
      <main className="flex-grow pt-20 container mx-auto px-4 py-12 relative z-10">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-brand-navy border-t border-brand-accent/10 py-12">
        <div className="max-w-7xl mx-auto px-4">
          {/* Disclaimer plus visible */}
          <div className="bg-white/5 border border-brand-accent/20 rounded-2xl p-6 mb-8">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-brand-accent shrink-0 mt-0.5" />
              <div className="text-white/80 text-xs leading-relaxed">
                <p className="font-bold text-white mb-1">Information importante</p>
                <p>Cet outil est purement informatif et ne constitue pas un conseil. Les analyses et suggestions proposées sont indicatives. Consultez toujours votre conseiller en gestion de patrimoine pour toute décision.</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-4">
              <div className="bg-white/10 p-2 rounded-xl border border-white/10">
                <img
                  src="https://lingepatrimoine.fr/logo/logo_inge_patrimoine-removebg-preview.png"
                  alt="Logo L'Ingé Patrimoine"
                  className="w-6 h-6 object-contain"
                />
              </div>
              <div>
                <span className="text-white font-heading font-bold text-lg tracking-tight">Opti<span className="text-brand-accent">Tax</span></span>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
              <a
                href="https://lingepatrimoine.fr"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-white/60 hover:text-brand-accent transition-colors text-sm"
              >
                <ExternalLink className="w-4 h-4" />
                Retourner sur L'Ingé Patrimoine
              </a>

              <a
                href="https://calendly.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-brand-accent text-brand-navy px-5 py-2.5 rounded-xl font-heading font-bold text-xs uppercase tracking-wider hover:bg-white transition-all"
              >
                <Calendar className="w-4 h-4" />
                Prendre rendez-vous
              </a>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-white/10 text-center">
            <p className="text-white/30 text-xs">© 2026 L'Ingé Patrimoine. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
