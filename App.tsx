
import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { TaxDashboard } from './components/TaxDashboard';
import { analyzeTaxDocuments } from './services/geminiService';
import { AnalysisResult } from './types';
import { Loader2, FileText, Upload, ArrowRight, RotateCcw, Download, Printer } from 'lucide-react';

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
      {!result && !loading && (
        <div className="max-w-4xl mx-auto text-center mb-16 mt-12 animate-fadeInUp">
          <h2 className="text-4xl md:text-6xl font-heading font-extrabold mb-6 leading-tight text-brand-navy">
            Optimisez vos impôts <br /> <span className="text-brand-accent">sécurisez votre patrimoine.</span>
          </h2>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto font-light leading-relaxed">
            Ajouter votre avis d'imposition pour déceler les leviers d'optimisation fiscale en un instant.
          </p>
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 space-y-6">
          <div className="relative">
            <div className="w-24 h-24 border-4 border-brand-accent/10 rounded-full animate-pulse"></div>
            <Loader2 className="w-24 h-24 text-brand-accent animate-spin absolute top-0 left-0" />
          </div>
          <div className="text-center space-y-2">
            <h3 className="text-2xl font-heading font-bold text-brand-navy">Génération de l'Audit...</h3>
            <p className="text-slate-400 text-sm">Analyse de vos documents fiscaux selon les barèmes en vigueur.</p>
          </div>
        </div>
      ) : error ? (
        <div className="max-w-md mx-auto glass-card p-10 rounded-2xl text-center border-red-100">
          <p className="text-red-500 font-medium mb-6">{error}</p>
          <button onClick={reset} className="bg-brand-navy text-white px-8 py-3 rounded-xl font-bold hover:bg-brand-accent hover:text-brand-navy transition-all duration-300">Réessayer</button>
        </div>
      ) : result ? (
        <div className="max-w-4xl mx-auto space-y-8 animate-fadeInUp">
          <TaxDashboard data={result} />

          <div className="flex justify-center pt-8 pb-8">
            <button
              onClick={reset}
              className="flex items-center gap-2 text-brand-navy font-heading font-bold hover:text-brand-accent transition-all bg-white px-8 py-4 rounded-xl shadow-lg border border-slate-100 hover:shadow-xl hover:-translate-y-1"
            >
              <RotateCcw className="w-5 h-5" />
              Nouvel Audit
            </button>
          </div>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto animate-fadeInUp">
          {/* Main Card */}
          <div className="glass-card rounded-3xl overflow-hidden">
            {/* Dark Header */}
            <div className="bg-brand-navy px-8 py-6">
              <div>
                <h2 className="text-xl font-heading font-bold text-white">
                  Analyse <span className="text-brand-accent">Fiscale</span>
                </h2>
                <p className="text-white/60 text-sm mt-1">Téléchargez vos documents pour commencer</p>
              </div>
            </div>

            {/* Card Body */}
            <div className="p-8 space-y-8">
              {/* File Upload Area */}
              <div
                className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-2xl p-10 hover:border-brand-accent hover:bg-brand-accentLight transition-all group cursor-pointer"
                onClick={() => document.getElementById('fileInput')?.click()}
              >
                <div className="w-16 h-16 bg-brand-navy rounded-2xl flex items-center justify-center text-brand-accent mb-4 group-hover:scale-110 transition-all shadow-lg">
                  <Upload className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-heading font-bold text-brand-navy mb-1">Documents Fiscaux</h3>
                <p className="text-slate-400 text-sm mb-4">Glissez vos fichiers ici ou cliquez pour parcourir</p>

                <button className="bg-brand-navy text-white px-6 py-2.5 rounded-full text-sm font-heading font-bold shadow-lg hover:shadow-[0_0_20px_rgba(0,217,255,0.3)] transition-all">
                  Parcourir les fichiers
                </button>

                <input id="fileInput" type="file" className="hidden" multiple accept="image/*,.pdf" onChange={handleFileChange} />
              </div>

              {/* Selected Files */}
              {files.length > 0 && (
                <div className="space-y-3 animate-fadeIn">
                  <p className="text-[10px] font-heading font-bold text-slate-400 uppercase tracking-widest text-left px-2">Fichiers sélectionnés ({files.length})</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {files.map((f, i) => (
                      <div key={i} className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <div className="flex items-center gap-3 truncate">
                          <div className="w-8 h-8 bg-brand-navy rounded-lg flex items-center justify-center text-brand-accent shadow-sm">
                            <FileText className="w-4 h-4" />
                          </div>
                          <span className="text-sm font-bold text-brand-navy truncate">{f.name}</span>
                        </div>
                        <button
                          onClick={(e) => { e.stopPropagation(); setFiles(files.filter((_, idx) => idx !== i)); }}
                          className="text-rose-500 hover:bg-rose-50 p-1.5 rounded-lg transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Context Input */}
              <div className="space-y-3 text-left">
                <label htmlFor="context" className="text-[10px] font-heading font-bold text-slate-400 uppercase tracking-widest block px-2">
                  Commentaires & Contexte (Optionnel)
                </label>
                <textarea
                  id="context"
                  rows={3}
                  className="w-full p-5 rounded-2xl border border-slate-200 focus:border-brand-accent focus:ring-4 focus:ring-brand-accentLight transition-all outline-none text-sm text-brand-navy font-medium placeholder:text-slate-300 bg-white"
                  placeholder="Ex: Projet d'investissement, changement de situation familiale..."
                  value={userContext}
                  onChange={(e) => setUserContext(e.target.value)}
                />
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  onClick={processAnalysis}
                  className={`w-full py-4 rounded-2xl text-lg font-heading font-bold shadow-xl transition-all hover:-translate-y-1 active:scale-[0.98] flex items-center justify-center gap-3 ${files.length > 0
                    ? 'bg-brand-accent text-brand-navy shadow-[0_0_30px_rgba(0,217,255,0.4)] hover:shadow-[0_0_40px_rgba(0,217,255,0.6)]'
                    : 'bg-slate-200 text-slate-500 hover:bg-slate-300'
                    }`}
                >
                  <span>Lancer l'Analyse</span>
                  <ArrowRight className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default App;
