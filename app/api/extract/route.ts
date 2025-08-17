import { NextRequest, NextResponse } from 'next/server';

interface ExtractRequest {
  url: string;
}

function isValidUrl(text: string): boolean {
  try {
    const url = new URL(text.trim());
    return ['http:', 'https:'].includes(url.protocol);
  } catch {
    return false;
  }
}

async function extractTextFromUrl(url: string): Promise<{ 
  title?: string; 
  text: string; 
  description?: string;
  domain: string;
  wordCount: number;
}> {
  try {
    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
      'Accept-Language': 'tr-TR,tr;q=0.9,en;q=0.8',
      'Accept-Encoding': 'gzip, deflate, br',
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache'
    };
    
    const response = await fetch(url, { 
      headers, 
      signal: AbortSignal.timeout(15000),
      redirect: 'follow'
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const contentType = response.headers.get('content-type') || '';
    
    if (!contentType.includes('text/html')) {
      throw new Error('URL HTML içeriği değil');
    }
    
    const html = await response.text();
    
    // Extract title
    const titleMatch = html.match(/<title[^>]*>([^<]+)</i);
    const title = titleMatch?.[1]?.trim() || '';
    
    // Extract meta description
    const descMatch = html.match(/<meta[^>]*name="description"[^>]*content="([^"]*)"[^>]*>/i) ||
                      html.match(/<meta[^>]*content="([^"]*)"[^>]*name="description"[^>]*>/i);
    const description = descMatch?.[1]?.trim() || '';
    
    // Remove script and style tags
    let cleanHtml = html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<noscript[^>]*>[\s\S]*?<\/noscript>/gi, '')
      .replace(/<!--[\s\S]*?-->/g, '')
      .replace(/<svg[^>]*>[\s\S]*?<\/svg>/gi, '');
    
    // Remove common navigation and footer elements
    cleanHtml = cleanHtml
      .replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, '')
      .replace(/<header[^>]*>[\s\S]*?<\/header>/gi, '')
      .replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, '')
      .replace(/<aside[^>]*>[\s\S]*?<\/aside>/gi, '');
    
    // Extract text content from remaining HTML
    let textContent = cleanHtml
      .replace(/<[^>]*>/g, ' ')
      .replace(/&[#\w]+;/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    
    // Clean up whitespace and remove common noise
    textContent = textContent
      .replace(/\n\s*\n/g, '\n')
      .replace(/^\s+|\s+$/gm, '')
      .replace(/\s{2,}/g, ' ')
      .trim();
    
    if (textContent.length < 50) {
      throw new Error('İçerik çok kısa veya çıkarılamadı');
    }
    
    // Limit content length to prevent excessive processing
    const maxLength = 10000;
    if (textContent.length > maxLength) {
      textContent = textContent.substring(0, maxLength) + '...';
    }
    
    const domain = new URL(url).hostname;
    const wordCount = textContent.split(/\s+/).filter(word => word.length > 0).length;
    
    return {
      title: title || undefined,
      text: textContent,
      description: description || undefined,
      domain,
      wordCount
    };
    
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new Error('İstek zaman aşımına uğradı');
      }
      throw new Error(`Web sitesine erişilemedi: ${error.message}`);
    }
    throw new Error('Bilinmeyen bir hata oluştu');
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: ExtractRequest = await request.json();
    
    if (!body.url?.trim()) {
      return NextResponse.json(
        { detail: "URL boş olamaz" },
        { status: 400 }
      );
    }
    
    const url = body.url.trim();
    
    if (!isValidUrl(url)) {
      return NextResponse.json(
        { detail: "Geçersiz URL formatı" },
        { status: 400 }
      );
    }
    
    const extractedContent = await extractTextFromUrl(url);
    
    return NextResponse.json({
      success: true,
      data: extractedContent
    });
    
  } catch (error) {
    console.error('Extract API Error:', error);
    
    const errorMessage = error instanceof Error ? error.message : "İçerik çıkarılamadı";
    
    return NextResponse.json(
      { 
        success: false,
        detail: errorMessage 
      },
      { status: 400 }
    );
  }
}

// Health check for extract endpoint
export async function GET() {
  return NextResponse.json({
    status: "ok",
    endpoint: "extract",
    description: "URL'den metin içeriği çıkarır"
  });
}
