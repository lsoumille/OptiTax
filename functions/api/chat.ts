import { GoogleGenAI, Type } from "@google/genai";

// Cloudflare Pages Function type definitions
declare type PagesFunction<Env = unknown> = (context: {
  request: Request;
  env: Env;
  params: Record<string, string>;
  waitUntil: (promise: Promise<any>) => void;
  next: (input?: Request | string, init?: RequestInit) => Promise<Response>;
  data: Record<string, unknown>;
}) => Response | Promise<Response>;

interface Env {
  GEMINI_API_KEY: string;
  GEMINI_MODEL?: string;
}

// Configuration du modèle Gemini (configurable via variable d'environnement)
// Valeur par défaut: gemini-3-flash-preview
const DEFAULT_GEMINI_MODEL = 'gemini-3-flash-preview';

interface RequestBody {
  files: { data: string; mimeType: string }[];
  userContext?: string;
}

export const onRequest: PagesFunction<Env> = async (context) => {
  // CORS headers
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json",
  };

  // Handle preflight request
  if (context.request.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const startTime = Date.now();
    
    // Validate API key is configured
    if (!context.env.GEMINI_API_KEY) {
      console.error('[API] GEMINI_API_KEY not configured');
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "GEMINI_API_KEY not configured" 
        }),
        { status: 500, headers: corsHeaders }
      );
    }

    // Parse request body
    let body: RequestBody;
    try {
      body = await context.request.json();
    } catch (e) {
      console.error('[API] Invalid request body', e);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Invalid request format" 
        }),
        { status: 400, headers: corsHeaders }
      );
    }

    // Log request info
    console.log('[API] Request received', {
      fileCount: body.files.length,
      hasContext: !!body.userContext,
      totalSize: body.files.reduce((sum, f) => sum + (f.data?.length || 0), 0),
      timestamp: new Date().toISOString()
    });

    // Validate request body
    if (!body.files || !Array.isArray(body.files) || body.files.length === 0) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Invalid request format: files array required" 
        }),
        { status: 400, headers: corsHeaders }
      );
    }

    // Validate file sizes (10MB limit per file in base64 = ~7.5MB original)
    const MAX_FILE_SIZE = 10 * 1024 * 1024;
    for (const file of body.files) {
      if (!file.data || file.data.length > MAX_FILE_SIZE) {
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: "Fichier trop volumineux (limite: 10MB par fichier)" 
          }),
          { status: 400, headers: corsHeaders }
        );
      }
    }

    // Initialize Gemini API
    const ai = new GoogleGenAI({ apiKey: context.env.GEMINI_API_KEY });
    const modelName = context.env.GEMINI_MODEL || DEFAULT_GEMINI_MODEL;

    // Build prompt (identical to original geminiService.ts)
    const userContext = body.userContext || "";
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

    // Define response schema (identical to original)
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

    // Build parts array from files
    const parts = body.files.map(f => ({
      inlineData: { data: f.data, mimeType: f.mimeType }
    }));

    // Call Gemini API
    const response = await ai.models.generateContent({
      model: modelName,
      contents: { parts: [...parts, { text: prompt }] },
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.1,
      }
    });

    // Parse and return result
    const analysisResult = JSON.parse(response.text || "{}");
    
    // Validate response structure
    if (!analysisResult.extractedData || !analysisResult.optimizations || !analysisResult.summary) {
      console.error('[API] Invalid analysis result structure', analysisResult);
      throw new Error('Le résultat de l\'analyse est incomplet');
    }
    
    const duration = Date.now() - startTime;
    console.log('[API] Request successful', {
      duration: `${duration}ms`,
      timestamp: new Date().toISOString()
    });

    return new Response(
      JSON.stringify({ 
        success: true, 
        content: analysisResult 
      }),
      { status: 200, headers: corsHeaders }
    );

  } catch (error) {
    // Error handling with user-friendly message
    const errorMessage = error instanceof Error ? error.message : "Une erreur est survenue lors de l'analyse";
    
    console.error('[API] Request failed', {
      error: errorMessage,
      timestamp: new Date().toISOString()
    });
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: errorMessage 
      }),
      { status: 500, headers: corsHeaders }
    );
  }
};
