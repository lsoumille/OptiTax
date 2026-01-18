
import React from 'react';
import { AnalysisResult } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';

interface Props {
  data: AnalysisResult;
}

const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export const TaxDashboard: React.FC<Props> = ({ data }) => {
  const { extractedData, optimizations, summary } = data;

  const tmiData = [
    { name: '0%', value: 11294 },
    { name: '11%', value: 28797 - 11294 },
    { name: '30%', value: 82341 - 28797 },
    { name: '41%', value: 177106 - 82341 },
    { name: '45%', value: 50000 }, // Mock end
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Client Overview Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">{extractedData.fullName}</h2>
            <p className="text-slate-500">Situation Fiscale {extractedData.year}</p>
          </div>
          <div className="flex gap-3">
             <div className="bg-indigo-50 px-4 py-2 rounded-xl text-center">
                <p className="text-xs text-indigo-600 font-bold uppercase tracking-wider">TMI Actuelle</p>
                <p className="text-2xl font-black text-indigo-900">{extractedData.tmi}%</p>
             </div>
             <div className="bg-emerald-50 px-4 py-2 rounded-xl text-center">
                <p className="text-xs text-emerald-600 font-bold uppercase tracking-wider">Parts Fiscales</p>
                <p className="text-2xl font-black text-emerald-900">{extractedData.householdParts}</p>
             </div>
          </div>
        </div>
        
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
            <p className="text-sm text-slate-500 mb-1">Revenu Imposable</p>
            <p className="text-xl font-bold text-slate-900">{extractedData.taxableIncome.toLocaleString('fr-FR')} €</p>
          </div>
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
            <p className="text-sm text-slate-500 mb-1">Impôt sur le Revenu</p>
            <p className="text-xl font-bold text-slate-900">{extractedData.totalTaxPaid.toLocaleString('fr-FR')} €</p>
          </div>
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
            <p className="text-sm text-slate-500 mb-1">Plafond PER Dispo.</p>
            <p className="text-xl font-bold text-emerald-600">{extractedData.perCeilingAvailable.toLocaleString('fr-FR')} €</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Summary Card */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
              <span className="w-2 h-6 bg-indigo-600 rounded-full mr-3"></span>
              Synthèse de l'Expert
            </h3>
            <div className="prose prose-slate max-w-none">
              <p className="text-slate-600 leading-relaxed italic">
                "{summary}"
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center">
              <span className="w-2 h-6 bg-indigo-600 rounded-full mr-3"></span>
              Stratégies d'Optimisation Préconisées
            </h3>
            <div className="grid grid-cols-1 gap-4">
              {optimizations.map((opt, idx) => (
                <div key={idx} className="group p-5 rounded-xl border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/30 transition-all">
                  <div className="flex justify-between items-start mb-2">
                    <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest ${
                      opt.category === 'Retirement' ? 'bg-amber-100 text-amber-700' :
                      opt.category === 'Investment' ? 'bg-indigo-100 text-indigo-700' :
                      opt.category === 'RealEstate' ? 'bg-emerald-100 text-emerald-700' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                      {opt.category}
                    </span>
                    <span className="text-emerald-600 font-bold text-sm">Gain est. : {opt.estimatedGain}</span>
                  </div>
                  <h4 className="font-bold text-slate-900 mb-1">{opt.title}</h4>
                  <p className="text-sm text-slate-600 mb-3">{opt.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-slate-400">Complexité:</span>
                      <span className={`text-xs font-medium ${
                         opt.complexity === 'Low' ? 'text-emerald-500' : 
                         opt.complexity === 'Medium' ? 'text-amber-500' : 'text-rose-500'
                      }`}>{opt.complexity}</span>
                    </div>
                    <button className="text-xs font-bold text-indigo-600 group-hover:underline">
                      En savoir plus →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="space-y-8">
           <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Positionnement TMI</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={tmiData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {tmiData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={extractedData.tmi >= parseInt(entry.name) ? COLORS[index % COLORS.length] : '#f1f5f9'} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="text-center -mt-36">
                <span className="block text-3xl font-black text-slate-800">{extractedData.tmi}%</span>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Votre Tranche</span>
              </div>
            </div>
          </div>

          <div className="bg-indigo-600 rounded-2xl shadow-lg p-6 text-white relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-xl font-bold mb-2">Prochaines Étapes</h3>
              <ul className="space-y-3 text-indigo-100 text-sm">
                <li className="flex items-center">
                  <div className="w-5 h-5 rounded-full bg-indigo-500 flex items-center justify-center mr-2 text-[10px]">1</div>
                  Générer le rapport PDF pour le client
                </li>
                <li className="flex items-center">
                  <div className="w-5 h-5 rounded-full bg-indigo-500 flex items-center justify-center mr-2 text-[10px]">2</div>
                  Simuler un versement PER de 5k€
                </li>
                <li className="flex items-center">
                  <div className="w-5 h-5 rounded-full bg-indigo-500 flex items-center justify-center mr-2 text-[10px]">3</div>
                  Prendre rendez-vous de conseil
                </li>
              </ul>
              <button className="w-full mt-6 bg-white text-indigo-600 py-3 rounded-xl font-bold hover:bg-indigo-50 transition-colors">
                Générer Rapport CGP
              </button>
            </div>
            {/* Decoration */}
            <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 bg-indigo-500 rounded-full opacity-20"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
