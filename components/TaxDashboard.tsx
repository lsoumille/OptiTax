
import React from 'react';
import { AnalysisResult } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { ChevronRight, FileCheck } from 'lucide-react';

interface Props {
  data: AnalysisResult;
}

const COLORS = ['#00D9FF', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export const TaxDashboard: React.FC<Props> = ({ data }) => {
  const { extractedData, optimizations, summary } = data;

  const tmiData = [
    { name: '0%', value: 11294 },
    { name: '11%', value: 28797 - 11294 },
    { name: '30%', value: 82341 - 28797 },
    { name: '41%', value: 177106 - 82341 },
    { name: '45%', value: 50000 },
  ];

  return (
    <div className="space-y-12 animate-fadeInUp mt-8">
      {/* Top Grid: Client Info & TMI */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Col: Overview */}
        <div className="glass-card rounded-3xl overflow-hidden flex flex-col h-full">
          <div className="bg-brand-navy px-6 py-5">
            <h2 className="text-2xl font-heading font-bold text-white">{extractedData.fullName}</h2>
            <p className="text-white/60">Situation Fiscale {extractedData.year}</p>
          </div>
          <div className="p-6 flex-1 flex flex-col justify-center">
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex justify-between items-center">
                <p className="text-sm text-slate-500">Revenu Imposable</p>
                <p className="text-xl font-heading font-bold text-brand-navy">{extractedData.taxableIncome.toLocaleString('fr-FR')} €</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex justify-between items-center">
                <p className="text-sm text-slate-500">Impôt sur le Revenu</p>
                <p className="text-xl font-heading font-bold text-brand-navy">{extractedData.totalTaxPaid.toLocaleString('fr-FR')} €</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex justify-between items-center">
                <p className="text-sm text-slate-500">Plafond PER Dispo.</p>
                <p className="text-xl font-heading font-bold text-emerald-600">{extractedData.perCeilingAvailable.toLocaleString('fr-FR')} €</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: TMI Chart */}
        <div className="glass-card rounded-3xl overflow-hidden flex flex-col h-full">
          <div className="bg-brand-navy px-6 py-5">
            <h3 className="text-lg font-heading font-bold text-white">Positionnement TMI</h3>
          </div>
          <div className="p-6 flex-1 min-h-[300px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={tmiData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {tmiData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={extractedData.tmi >= parseInt(entry.name) ? COLORS[index % COLORS.length] : '#f1f5f9'} stroke="none" />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
              <span className="block text-4xl font-heading font-black text-brand-navy tracking-tight">{extractedData.tmi}%</span>
              <span className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1 block">TMI</span>
              <div className="mt-2 pt-2 border-t border-slate-100">
                <p className="text-xs text-emerald-500 font-bold uppercase tracking-wider">{extractedData.householdParts} parts</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Card */}
      <div className="glass-card rounded-3xl overflow-hidden">
        <div className="bg-brand-navy px-6 py-4">
          <h3 className="text-lg font-heading font-bold text-white flex items-center gap-2">
            <span className="w-2 h-6 bg-brand-accent rounded-full"></span>
            Synthèse de l'Expert
          </h3>
        </div>
        <div className="p-8">
          <p className="text-slate-600 leading-relaxed italic text-lg border-l-4 border-brand-accent pl-6">
            "{summary}"
          </p>
        </div>
      </div>

      {/* Newsletter */}
      <div className="bg-gradient-to-br from-brand-navy/5 to-brand-accent/5 p-8 rounded-3xl border border-brand-accent/20">
        <div className="flex items-center gap-4 mb-6">
          <div className="bg-brand-accent/10 p-3 rounded-xl">
            <svg className="w-6 h-6 text-brand-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-xl font-heading font-bold text-brand-navy">
            Restez informé des actualités patrimoniales
          </h3>
        </div>
        <div className="bg-white rounded-xl overflow-hidden shadow-lg border border-slate-100 flex justify-center py-4">
          <iframe
            src="https://lingepatrimoine.substack.com/embed"
            width="480"
            height="320"
            style={{ background: 'white' }}
            frameBorder="0"
            scrolling="no"
            title="Newsletter"
          />
        </div>
      </div>

      {/* Strategies */}
      <div className="glass-card rounded-3xl overflow-hidden relative">
        <div className="bg-brand-navy px-6 py-4">
          <h3 className="text-lg font-heading font-bold text-white flex items-center gap-2">
            <span className="w-2 h-6 bg-brand-accent rounded-full"></span>
            Stratégies d'Optimisation Préconisées
          </h3>
        </div>
        <div className="p-8">
          <div className="grid grid-cols-1 gap-4">
            {optimizations.slice(0, 1).map((opt, idx) => (
              <div key={idx} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-50 bg-slate-50/50 flex flex-col md:flex-row justify-between items-start gap-4">
                  <div className="flex-1">
                    <span className={`inline-block px-3 py-1 rounded-lg text-[10px] font-heading font-bold uppercase tracking-widest mb-3 ${opt.category === 'Retirement' ? 'bg-amber-100 text-amber-700' :
                      opt.category === 'Investment' ? 'bg-brand-navy text-brand-accent' :
                        opt.category === 'RealEstate' ? 'bg-emerald-100 text-emerald-700' :
                          'bg-slate-100 text-slate-700'
                      }`}>
                      {opt.category}
                    </span>
                    <h4 className="text-2xl font-heading font-bold text-brand-navy">{opt.title}</h4>
                  </div>

                  <div className="flex flex-col items-end gap-3 min-w-[180px]">
                    {/* Gain Box */}
                    <div className="bg-emerald-50 px-5 py-2 rounded-xl border border-emerald-100 flex items-center justify-between w-full gap-4">
                      <span className="text-[10px] uppercase tracking-widest text-emerald-600 font-bold">Gain</span>
                      <span className="text-lg font-black text-emerald-600">{opt.estimatedGain}</span>
                    </div>

                    {/* Complexity Badge */}
                    <div className={`px-4 py-2 rounded-xl border w-full flex items-center justify-between ${opt.complexity === 'Low' ? 'bg-emerald-50/50 border-emerald-100 text-emerald-700' :
                        opt.complexity === 'Medium' ? 'bg-amber-50/50 border-amber-100 text-amber-700' :
                          'bg-rose-50/50 border-rose-100 text-rose-700'
                      }`}>
                      <span className="text-[10px] uppercase tracking-widest font-bold opacity-70">Complexité</span>
                      <span className="text-xs font-bold">
                        {opt.complexity === 'Low' ? 'Simple' : opt.complexity === 'Medium' ? 'Modérée' : 'Complexe'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-8 space-y-6">
                  <div>
                    <h5 className="text-sm font-bold text-brand-navy uppercase tracking-wider mb-2 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-accent"></span>
                      Analyse
                    </h5>
                    <p className="text-slate-600 leading-relaxed">
                      {opt.description}
                    </p>
                  </div>

                  {opt.reasoning && (
                    <div className="bg-blue-50/50 p-6 rounded-xl border border-blue-100">
                      <h5 className="text-sm font-bold text-blue-800 uppercase tracking-wider mb-2 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                        Le Conseil de l'Expert
                      </h5>
                      <p className="text-blue-900/80 italic leading-relaxed">
                        "{opt.reasoning}"
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Blurred Strategies */}
            {optimizations.length > 1 && (
              <div className="relative mt-8">
                <div className="absolute inset-x-0 -top-12 bottom-0 z-10 bg-gradient-to-b from-white/0 via-white/40 to-white flex flex-col items-center justify-center pt-12">
                  <div className="text-center p-8 rounded-3xl bg-white shadow-2xl border border-slate-100 max-w-md mx-auto relative overflow-hidden group">
                    <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-brand-navy via-brand-accent to-brand-navy"></div>
                    <h3 className="text-xl font-heading font-bold text-brand-navy mb-3">
                      Débloquez votre potentiel fiscal
                    </h3>
                    <p className="text-slate-500 mb-8 leading-relaxed">
                      {optimizations.length - 1} autres stratégies sont disponibles pour optimiser votre situation. Prenez rendez-vous pour une analyse personnalisée.
                    </p>

                    <a
                      href="https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ0..."
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-3 bg-brand-accent text-brand-navy px-8 py-4 rounded-xl font-heading font-bold shadow-lg hover:shadow-brand-accent/50 hover:-translate-y-1 transition-all duration-300 w-full justify-center group-hover:bg-brand-navy group-hover:text-white"
                    >
                      <span>Prendre Rendez-vous</span>
                      <ChevronRight className="w-5 h-5" />
                    </a>
                  </div>
                </div>
                <div className="opacity-40 filter blur-md select-none pointer-events-none space-y-6 grayscale">
                  {optimizations.slice(1).map((opt, idx) => (
                    <div key={`blurred-${idx}`} className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                      <div className="flex justify-between items-center mb-6">
                        <div className="h-6 w-32 bg-slate-300 rounded animate-pulse"></div>
                        <div className="h-10 w-24 bg-slate-300 rounded-xl animate-pulse"></div>
                      </div>
                      <div className="space-y-3">
                        <div className="h-4 w-full bg-slate-200 rounded animate-pulse"></div>
                        <div className="h-4 w-5/6 bg-slate-200 rounded animate-pulse"></div>
                        <div className="h-4 w-4/6 bg-slate-200 rounded animate-pulse"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
