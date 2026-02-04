import { AnalysisResult } from '../types';

/**
 * API response type from /api/chat endpoint
 */
interface ApiResponse {
  success: boolean;
  content?: AnalysisResult;
  error?: string;
}

/**
 * Analyze tax documents using the Cloudflare Pages Function backend
 * @param files - Array of base64-encoded files with mimeType
 * @param userContext - Optional user context for personalized analysis
 * @returns Promise<AnalysisResult> - Structured tax analysis result
 */
export const analyzeTaxDocuments = async (
  files: { data: string; mimeType: string }[],
  userContext?: string
): Promise<AnalysisResult> => {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        files, 
        userContext 
      }),
    });

    // Validate Content-Type before parsing
    const contentType = response.headers.get('content-type');
    if (!contentType?.includes('application/json')) {
      throw new Error('Réponse serveur invalide (type de contenu incorrect)');
    }

    const data = await response.json() as ApiResponse;

    if (!response.ok || !data.success) {
      throw new Error(data.error || 'Erreur lors de l\'analyse des documents');
    }

    if (!data.content) {
      throw new Error('Réponse API invalide: contenu manquant');
    }

    return data.content;
  } catch (error) {
    // User-friendly French error message
    if (error instanceof Error) {
      throw new Error(`Erreur d'analyse: ${error.message}`);
    }
    throw new Error('Une erreur inattendue est survenue lors de l\'analyse');
  }
};
