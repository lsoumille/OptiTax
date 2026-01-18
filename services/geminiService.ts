
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from "../types";

const API_KEY = process.env.API_KEY || "";

export const analyzeTaxDocuments = async (
  files: { data: string; mimeType: string }[],
  userContext?: string
): Promise<AnalysisResult> => {
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  
  // Model selection: Gemini 3 Flash for fast document extraction and analysis
  const modelName = 'gemini-3-flash-preview';

  const prompt = `
    Agis en tant qu'expert en fiscalité française et Conseiller en Gestion de Patrimoine (CGP) senior.
    Analyse les documents d'imposition fournis (avis d'imposition, déclaration de revenus).
    
    ${userContext ? `CONTEXTE CLIENT SPÉCIFIQUE (À PRENDRE EN COMPTE PRIORITAIREMENT) : "${userContext}"` : ""}

    1. Extrais les données clés (TMI, Revenus, Charges, Crédits).
    2. Calcule la TMI précise.
    3. Effectue un audit exhaustif des opportunités d'optimisation.

    RÈGLE DE PRIORITÉ SUR LES RÉGIMES :
    Même si le client a "déjà implémenté" une stratégie de déclaration (ex: il a déclaré en Micro-Foncier), si cette stratégie repose sur un ABATTEMENT FORFAITAIRE, tu DOIS analyser si le passage au RÉEL (ou amortissement) serait plus bénéfique.
    
    Analyses spécifiques d'arbitrage (Abattement vs Réel) :
    - IMMOBILIER FONCIER : Si déclaré en Micro-Foncier (case 4BE - 30% abattement), compare avec le Réel (déduction intérêts, travaux, charges). Si le gain est probable, suggère le passage au Réel.
    - MEUBLÉ (LMNP) : Si déclaré en Micro-BIC (case 5ND/5OD - 50% abattement), calcule l'intérêt du passage au LMNP au RÉEL pour pratiquer l'amortissement comptable (souvent bien supérieur à 50% de charges).
    - SALAIRES : Si abattement de 10% appliqué par défaut, vérifie si le profil (gros revenus, éloignement géographique probable) justifierait les Frais Réels (kilomètres, repas).
    
    RÈGLE CRITIQUE DE NON-REDUNDANCE :
    Ne propose pas de "Verser sur un PER" si le plafond est déjà atteint. 
    Ne propose pas de "Faire des dons" si le client en fait déjà massivement par rapport à son impôt.
    Bref, ne propose pas ce qui est déjà optimisé au maximum.

    Niches fiscales et leviers à scanner :
    - Famille : Frais de garde (7GA), Scolarité (7EA), Emploi domicile (7DB).
    - Investissement : Girardin (G3), IR-PME/FIP/FCPI, SOFICA.
    - Retraite : PER (vérifier reliquat plafonds 6PS/6PT/6PU).
    - Arbitrage financier : PFU vs Barème (case 2OP).

    Retourne les données UNIQUEMENT au format JSON.
  `;

  const responseSchema = {
    type: Type.OBJECT,
    properties: {
      extractedData: {
        type: Type.OBJECT,
        properties: {
          fullName: { type: Type.STRING },
          year: { type: Type.NUMBER },
          householdParts: { type: Type.NUMBER },
          taxableIncome: { type: Type.NUMBER },
          tmi: { type: Type.NUMBER },
          totalTaxPaid: { type: Type.NUMBER },
          perCeilingAvailable: { type: Type.NUMBER },
          realEstateIncome: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                amount: { type: Type.NUMBER },
                regime: { type: Type.STRING },
                type: { type: Type.STRING }
              }
            }
          },
          financialIncome: {
            type: Type.OBJECT,
            properties: {
              dividends: { type: Type.NUMBER },
              capitalGains: { type: Type.NUMBER },
              regime: { type: Type.STRING }
            }
          }
        },
        required: ["fullName", "taxableIncome", "tmi"]
      },
      optimizations: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            category: { type: Type.STRING },
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            estimatedGain: { type: Type.STRING },
            complexity: { type: Type.STRING },
            actionable: { type: Type.STRING }
          }
        }
      },
      summary: { type: Type.STRING }
    },
    required: ["extractedData", "optimizations", "summary"]
  };

  const parts = files.map(f => ({
    inlineData: { data: f.data, mimeType: f.mimeType }
  }));

  const response = await ai.models.generateContent({
    model: modelName,
    contents: { parts: [...parts, { text: prompt }] },
    config: {
      responseMimeType: "application/json",
      responseSchema: responseSchema,
      temperature: 0.1,
    }
  });

  return JSON.parse(response.text || "{}");
};
