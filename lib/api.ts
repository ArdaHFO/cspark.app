/**
 * API client for communicating with the Creator Transformer Vercel API
 * Handles all HTTP requests and response parsing using Next.js API routes
 */

// Use Vercel API routes instead of external backend
const API_BASE = '/api';

/**
 * Base fetch wrapper with error handling
 */
async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE}${endpoint}`;
  
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: 'Unknown error occurred' }));
      throw new Error(errorData.detail || `HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Network error occurred');
  }
}

/**
 * Extract text from a URL using Vercel API route
 */
export async function extractText(url: string): Promise<{ 
  title?: string; 
  text: string; 
  description?: string;
  domain: string;
  wordCount: number;
}> {
  const response = await fetch(`${API_BASE}/extract`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ url }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: 'Failed to extract text' }));
    throw new Error(errorData.detail || `HTTP ${response.status}: ${response.statusText}`);
  }

  const result = await response.json();
  
  if (!result.success) {
    throw new Error(result.detail || 'Failed to extract text');
  }

  
  return result.data;
}

/**
 * Generate content from text using AI
 */
export interface GenerateRequest {
  input: string;
  task: 'summary' | 'youtube' | 'shorts' | 'social' | 'seo';
  tone?: 'casual' | 'professional' | 'energetic' | 'academic';
  length?: 'short' | 'medium' | 'long';
  lang?: 'tr' | 'en';
  max_tokens?: number;
  temperature?: number;
}

export interface GenerateResponse {
  result: string;
}

export async function generateContent(request: GenerateRequest): Promise<GenerateResponse> {
  return apiFetch('/generate', {
    method: 'POST',
    body: JSON.stringify(request),
  });
}

/**
 * Generate all content types at once (PRO feature)
 */
export interface GenerateAllRequest {
  input: string;
  lang?: 'tr' | 'en';
}

export interface GenerateAllResponse {
  summary?: string;
  youtube?: string;
  shorts?: string;
  social?: string;
  seo?: string;
}

export async function generateAllContent(request: GenerateAllRequest): Promise<GenerateAllResponse> {
  return apiFetch('/generate-all', {
    method: 'POST',
    body: JSON.stringify(request),
  });
}/**
 * Health check endpoint
 */
export async function healthCheck(): Promise<{ ok: boolean }> {
  return apiFetch('/health');
}

/**
 * Download text as a file
 */
export function downloadAsFile(content: string, filename: string = 'generated-content.txt') {
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
}

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text: string): Promise<void> {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
  } else {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    document.execCommand('copy');
    textArea.remove();
  }
}
