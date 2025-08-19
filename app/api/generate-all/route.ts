import { NextRequest, NextResponse } from 'next/server';

// This route can call multiple generate requests or implement bulk generation
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { input, lang = 'tr' } = body;
    
    // Generate multiple content types by calling individual /generate endpoint
    const tasks = ['summary', 'youtube', 'shorts', 'social', 'seo'];
    const results: any = {};
    
    for (const task of tasks) {
      try {
        const response = await fetch(`${request.nextUrl.origin}/api/generate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            input,
            task,
            lang,
            tone: 'casual',
            length: 'medium'
          })
        });
        
        if (response.ok) {
          const data = await response.json();
          results[task] = data.result;
        }
      } catch (error) {
        console.error(`Error generating ${task}:`, error);
        // Continue with other tasks even if one fails
      }
    }
    
    return NextResponse.json(results);

  } catch (error) {
    console.error('Generate-all error:', error);
    return NextResponse.json(
      { detail: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Health check
export async function GET() {
  return NextResponse.json({
    status: "ok",
    endpoint: "generate-all",
    description: "Tüm içerik türlerini tek seferde oluşturur (PRO özelliği)"
  });
}
