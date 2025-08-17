/**
 * API client for communicating with the Creator Transformer backend
 * Handles all HTTP requests and response parsing
 */

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8000';

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
 * Extract text from a URL
 */
export async function extractText(url: string): Promise<{ text: string }> {
  const formData = new FormData();
  formData.append('url', url);

  const response = await fetch(`${API_BASE}/extract`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: 'Failed to extract text' }));
    throw new Error(errorData.detail || `HTTP ${response.status}: ${response.statusText}`);
  }

  return await response.json();
}

/**
 * Generate content from text using AI
 */
export interface GenerateRequest {
  text: string;
  mode: 'summary' | 'youtube' | 'shorts';
  tone: 'neutral' | 'energetic' | 'academic';
  length: 'short' | 'medium' | 'long';
  lang: 'auto' | 'tr' | 'en';
}

export interface GenerateResponse {
  output: string;
  tokens: number;
}

export async function generateContent(request: GenerateRequest): Promise<GenerateResponse> {
  return apiFetch('/generate', {
    method: 'POST',
    body: JSON.stringify(request),
  });
}

/**
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
