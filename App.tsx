
import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { TaxDashboard } from './components/TaxDashboard';
import { analyzeTaxDocuments } from './services/geminiService';
import { AnalysisResult } from './types';

const App: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [userContext, setUserContext] = useState<string>("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
      setError(null);
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = (reader.result as string).split(',')[1];
        resolve(base64String);
      };
      reader.onerror = error => reject(error);
    });
  };

  const processAnalysis = async () => {
    if (files.length === 0) {
      setError("Action requise : Veuillez sélectionner au moins un document fiscal (avis d'imposition ou déclaration) pour lancer l'audit.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const base64Files = await Promise.all(
        files.map(async (file) => ({
          data: await fileToBase64(file),
          mimeType: file.type || 'image/png'
        }))
      );

      const analysis = await analyzeTaxDocuments(base64Files, userContext);
      setResult(analysis);
    } catch (err) {
      console.error(err);
      setError("Une erreur est survenue lors de l'analyse. Veuillez vérifier vos documents et réessayer.");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setResult(null);
    setFiles([]);
    setError(null);
    setUserContext("");
  };

  return (
    <Layout>
      <div className="bg-hero-gradient min-h-[calc(100vh-80px)]">
        <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
          {!result && !loading && (
            <div className="max-w-3xl mx-auto text-center space-y-12 animate-in fade-in zoom-in duration-700">
              <div className="space-y-6">
                <span className="inline-block px-4 py-1.5 rounded-full bg-cyan-100 text-[#00B8D9] text-xs font-black uppercase tracking-[0.2em]">
                  Expertise Patrimoniale IA
                </span>
                <h1 className="text-5xl md:text-7xl font-extrabold text-[#0A2540] tracking-tight">
                  OptiTax <span className="text-[#00D9FF]">by l'Ingé Patrimoine</span>
                </h1>
                <p className="text-xl text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed">
                  Apportez une valeur ajoutée immédiate à vos clients. Analysez leurs avis d'imposition et décelez chaque levier d'optimisation en un instant.
                </p>
              </div>

              <div className="opti-card p-10 bg-white shadow-2xl space-y-8 relative overflow-hidden border-t-4 border-t-[#00D9FF]">
                <div 
                  className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-3xl p-10 hover:border-[#00D9FF] hover:bg-cyan-50/30 transition-all group cursor-pointer"
                  onClick={() => document.getElementById('fileInput')?.click()}
                >
                  <div className="w-16 h-16 bg-[#F0FDF4] rounded-2xl flex items-center justify-center text-[#10B981] mb-4 group-hover:scale-110 group-hover:bg-[#10B981] group-hover:text-white transition-all shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-[#0A2540] mb-1">Documents Fiscaux</h3>
                  <p className="text-slate-400 text-sm mb-4">Glissez vos fichiers ici ou cliquez pour parcourir</p>
                  
                  <button className="bg-white border border-slate-200 text-[#0A2540] px-6 py-2 rounded-xl text-sm font-bold shadow-sm group-hover:bg-[#0A2540] group-hover:text-white transition-all">
                    Parcourir les fichiers
                  </button>
                  
                  <input id="fileInput" type="file" className="hidden" multiple accept="image/*,.pdf" onChange={handleFileChange} />
                </div>

                {files.length > 0 && (
                  <div className="space-y-3 animate-in fade-in slide-in-from-top-4">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-left px-2">Fichiers sélectionnés ({files.length})</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {files.map((f, i) => (
                        <div key={i} className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-100">
                          <div className="flex items-center space-x-3 truncate">
                            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-[#0A2540] shadow-sm">
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M4 4a2 2 0 012-2h4.586A1 1 0 0111 2.414l5.586 5.586A1 1 0 0117 8.586V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" /></svg>
                            </div>
                            <span className="text-sm font-bold text-[#0A2540] truncate">{f.name}</span>
                          </div>
                          <button onClick={(e) => { e.stopPropagation(); setFiles(files.filter((_, idx) => idx !== i)); }} className="text-rose-500 hover:bg-rose-50 p-1.5 rounded-lg transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-3 text-left">
                  <label htmlFor="context" className="text-[10px] font-black text-slate-400 uppercase tracking-widest block px-2">
                    Commentaires & Contexte (Optionnel)
                  </label>
                  <textarea
                    id="context"
                    rows={3}
                    className="w-full p-5 rounded-2xl border border-slate-200 focus:border-[#00D9FF] focus:ring-4 focus:ring-cyan-50 transition-all outline-none text-sm text-[#0A2540] font-medium placeholder:text-slate-300 shadow-inner bg-slate-50/50"
                    placeholder="Ex: Projet d'investissement, changement de situation familiale..."
                    value={userContext}
                    onChange={(e) => setUserContext(e.target.value)}
                  />
                </div>

                {error && (
                  <div className="bg-rose-50 text-rose-700 p-5 rounded-2xl text-sm font-bold border border-rose-100 animate-pulse">
                    <div className="flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                      {error}
                    </div>
                  </div>
                )}

                <div className="pt-4">
                  <button 
                    onClick={processAnalysis}
                    className={`w-full py-5 rounded-2xl text-xl font-bold shadow-xl transition-all hover:-translate-y-1 active:scale-[0.98] flex items-center justify-center space-x-3 ${
                      files.length > 0 
                      ? 'bg-[#0A2540] text-white shadow-indigo-900/20 hover:bg-[#0D3D5F]' 
                      : 'bg-slate-200 text-slate-500 hover:bg-slate-300'
                    }`}
                  >
                    <span>Lancer l'Analyse Patrimoniale</span>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path></svg>
                  </button>
                  <p className="mt-4 text-[11px] text-slate-400 font-medium">Analyse propulsée par l'Intelligence Artificielle d'OptiTax</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
                {[
                  { title: "Audit Exhaustif", desc: "Scan de toutes les niches fiscales." },
                  { title: "Précision CGP", desc: "Basé sur les barèmes d'imposition." },
                  { title: "Zéro Doublon", desc: "Analyse des choix déjà faits." }
                ].map((item, i) => (
                  <div key={i} className="flex items-center space-x-4 bg-white/50 p-4 rounded-2xl border border-white/20 backdrop-blur-sm">
                    <div className="w-10 h-10 bg-[#00D9FF] rounded-xl flex items-center justify-center text-[#0A2540] shadow-sm">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                    </div>
                    <div>
                      <h4 className="font-bold text-[#0A2540] text-sm">{item.title}</h4>
                      <p className="text-[11px] text-slate-500 font-medium">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {loading && (
            <div className="max-w-xl mx-auto text-center space-y-10 py-20 animate-in fade-in duration-300">
              <div className="relative inline-block">
                 <div className="w-32 h-32 border-8 border-cyan-100 border-t-[#00D9FF] rounded-full animate-spin"></div>
                 <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 bg-[#0A2540] rounded-2xl animate-pulse flex items-center justify-center shadow-2xl">
                       <span className="text-[#00D9FF] font-black text-2xl">IA</span>
                    </div>
                 </div>
              </div>
              <div className="space-y-4">
                <h2 className="text-3xl font-black text-[#0A2540]">Génération de l'Audit...</h2>
                <p className="text-slate-500 font-medium text-lg leading-relaxed">
                  L'IA d'OptiTax analyse vos documents et vos commentaires pour maximiser le gain fiscal.
                </p>
              </div>
            </div>
          )}

          {result && (
            <div className="space-y-8">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-4">
                <button 
                  onClick={reset}
                  className="flex items-center text-[#0A2540] font-bold hover:text-[#00D9FF] transition-all bg-white px-5 py-2.5 rounded-xl shadow-sm border border-slate-100"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                  Nouvel Audit
                </button>
                <div className="flex space-x-3 w-full sm:w-auto">
                  <button className="flex-1 sm:flex-none bg-white border border-slate-200 text-[#0A2540] px-6 py-3 rounded-xl font-bold hover:bg-slate-50 transition-colors shadow-sm">Export JSON</button>
                  <button className="flex-1 sm:flex-none bg-[#0A2540] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#041729] shadow-xl shadow-indigo-900/20 transition-all hover:-translate-y-1">Imprimer Rapport PDF</button>
                </div>
              </div>
              <TaxDashboard data={result} />
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default App;
