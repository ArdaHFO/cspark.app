import { NextRequest, NextResponse } from 'next/server';

// Direct HuggingFace API integration - no external backend needed
const HF_API_TOKEN = process.env.HF_API_TOKEN;
const HF_MODEL = "meta-llama/Llama-3.1-8B-Instruct:novita";
const HF_BASE_URL = "https://router.huggingface.co/v1/chat/completions";
const HF_TIMEOUT = 60000;
const MAX_TOKENS_DEFAULT = 512;

interface GenerateRequest {
  input: string;
  task: string;
  lang?: string;
  tone?: string;
  length?: string;
  persona?: string;
  max_tokens?: number;
  temperature?: number;
}

function isUrl(text: string): boolean {
  try {
    new URL(text.trim());
    return true;
  } catch {
    return false;
  }
}

async function extractContentFromUrl(url: string): Promise<string> {
  try {
    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    };
    
    const response = await fetch(url, { 
      headers, 
      signal: AbortSignal.timeout(15000) 
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const html = await response.text();
    
    // Simple text extraction - remove HTML tags
    const textContent = html
      .replace(/<script[^>]*>.*?<\/script>/gi, '')
      .replace(/<style[^>]*>.*?<\/style>/gi, '')
      .replace(/<[^>]*>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    
    if (textContent.length < 50) {
      throw new Error('İçerik çok kısa veya çıkarılamadı');
    }
    
    // Limit content length
    const maxLength = 8000;
    const limitedContent = textContent.length > maxLength 
      ? textContent.substring(0, maxLength) + '...'
      : textContent;
    
    const domain = new URL(url).hostname;
    return `[Kaynak: ${domain}]\n\n${limitedContent}`;
    
  } catch (error) {
    throw new Error(`Web sitesine erişilemedi: ${error instanceof Error ? error.message : 'Bilinmeyen hata'}`);
  }
}

function createSystemMessage(task: string, lang: string, tone: string = "casual", length: string = "medium", persona: string = "generic"): string {
  if (lang === "tr") {
    if (task === "summary") {
      return `Sen uzman bir içerik analisti ve özetleme uzmanısın. Görevin verilen metni ${tone} bir şekilde özetlemek.

ÖZETLEME KRİTERLERİ:
• Ana fikirleri ve önemli detayları kaybet
• ${length} formatında yaz
• Gereksiz tekrarları çıkar
• Mantıklı akış ve yapı oluştur
• Anahtar kavramları vurgula
• Anlaşılır ve akıcı dil kullan

ÇIKTI FORMATI:
📋 Ana Noktalar:
• [Her madde için spesifik ve değerli bilgi]

📝 Özet:
[Konunun genel değerlendirmesi ve sonuç]

Ton: ${tone}`;
    }
    
    if (task === "youtube") {
      return `Sen profesyonel bir YouTube içerik yazarısın. Verilen konudan YouTube video senaryosu oluşturacaksın.

SENARYO KRİTERLERİ:
• İlgi çekici açılış (hook) ile başla
• Ana konuları mantıklı sırayla işle
• İzleyiciyi engage edecek sorular sor
• Örnekler ve pratik bilgiler ver
• Güçlü bir kapanış yap
• Call-to-action ekle

ÇIKTI FORMATI:
🎬 YouTube Video Senaryosu

🚀 GİRİŞ (0-15 saniye):
[İlgi çekici açılış, hook]

📚 ANA İÇERİK:
[Bölüm 1: Temel bilgiler]
[Bölüm 2: Detaylar ve örnekler]  
[Bölüm 3: Pratik uygulamalar]

🎯 KAPANIŞ:
[Özet ve call-to-action]

Ton: ${tone}`;
    }
    
    if (task === "shorts") {
      return `Sen viral içerik uzmanısın. Verilen konudan YouTube Shorts/TikTok senaryosu oluşturacaksın.

SHORTS KRİTERLERİ:
• İlk 3 saniyede dikkat çek
• Hızlı tempolu ve dinamik
• Görsel açıklamalar ekle
• Trend olan hashtag'ler kullan
• Viral potansiyeli yüksek
• Tekrar izletecek kalitede

ÇIKTI FORMATI:
⚡ Shorts/TikTok Senaryosu

🔥 AÇILIŞ (0-3 saniye):
[Çarpıcı soru/iddia]

💥 ANA MESAJ (3-30 saniye):
[Hızlı bilgi aktarımı]

✨ KAPANIŞ:
[Güçlü sonuç ve çağrı]

📱 HASHTAGS: #viral #trending [konuya özel]

Ton: ${tone}`;
    }
    
    if (task === "seo") {
      return `Sen SEO uzmanısın. Verilen içerik için kapsamlı SEO paketi oluşturacaksın.

SEO KRİTERLERİ:
• İçerikle ilgili başlık önerileri (3-5 adet)
• Meta açıklama (150-160 karakter)
• Anahtar kelimeler (ana ve uzun kuyruk)
• Sosyal medya hashtag'leri
• SEO dostu yapı önerileri

ÇIKTI FORMATI:
🔍 SEO Paketi

📝 BAŞLIK ÖNERİLERİ:
• [Başlık 1 - 60 karakter altında]
• [Başlık 2 - 60 karakter altında]
• [Başlık 3 - 60 karakter altında]

📄 META AÇIKLAMA:
[150-160 karakter arası, çekici ve bilgilendirici]

🔑 ANAHTAR KELİMELER:
Ana: [ana anahtar kelime]
Uzun kuyruk: [uzun kuyruk anahtar kelimeler]

📱 HASHTAG'LER:
#hashtag1 #hashtag2 #hashtag3 [konu ile ilgili]

💡 SEO ÖNERİLERİ:
• [İçerik optimizasyon önerisi 1]
• [İçerik optimizasyon önerisi 2]

Ton: ${tone}`;
    }
  }
  
  // English defaults
  return `You are a helpful ${task} content creator. Create ${tone} content in ${lang}.`;
}

async function callHuggingFace(messages: any[], maxTokens: number = MAX_TOKENS_DEFAULT, temperature: number = 0.3): Promise<string> {
  if (!HF_API_TOKEN) {
    throw new Error('HF_API_TOKEN environment variable not set');
  }
  
  const headers = {
    'Authorization': `Bearer ${HF_API_TOKEN}`,
    'Content-Type': 'application/json'
  };

  // Use OpenAI-compatible chat completions format
  const payload = {
    model: HF_MODEL,
    messages: messages,
    max_tokens: maxTokens,
    temperature: temperature,
    stream: false
  };
  
  const response = await fetch(HF_BASE_URL, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(HF_TIMEOUT)
  });
  
  if (!response.ok) {
    let errorMsg = `HF API error: ${response.status}`;
    try {
      const errorData = await response.json();
      errorMsg += ` - ${errorData.error?.message || errorData.error || 'Unknown error'}`;
    } catch {
      try {
        const errorText = await response.text();
        errorMsg += ` - ${errorText}`;
      } catch {
        errorMsg += ` - ${response.statusText}`;
      }
    }
    throw new Error(errorMsg);
  }
  
  const result = await response.json();
  
  // Handle OpenAI-compatible response format
  if (result.choices && result.choices[0] && result.choices[0].message) {
    return result.choices[0].message.content.trim();
  }
  
  throw new Error('No content generated from HF API');
}

function getMockResponse(task: string, lang: string): string {
  const mockResponses = {
    "tr": {
      "summary": "📋 Ana Noktalar:\n• İçerik çok kısa olduğu için ana fikir belirlenemedi.\n• İçerik uzunluğu sınırlı, bir cümle dahi oluşturulamadı.\n• İçerikte herhangi bir detaya rastlanmadı.\n\n📝 Özet:\nİçerik çok kısa olduğu için herhangi bir anlam ifade etmiyor. İçerik uzatılması veya daha detaylı bir içerik oluşturulması gerektiği düşünülmektedir.",
      "youtube": "🎬 YouTube Video Senaryosu\n\n🚀 GİRİŞ (0-15 saniye):\nMerhaba arkadaşlar! Bugün size [konu] hakkında önemli bilgiler vereceğim.\n\n📚 ANA İÇERİK:\nBölüm 1: [Temel bilgiler]\nBölüm 2: [Detaylar ve örnekler]\nBölüm 3: [Pratik uygulamalar]\n\n🎯 KAPANIŞ:\nUmarım faydalı olmuştur! Beğendiyseniz like atmayı unutmayın!",
      "shorts": "⚡ Shorts/TikTok Senaryosu\n\n🔥 AÇILIŞ (0-3 saniye):\nBunu biliyordunuz mu?\n\n💥 ANA MESAJ (3-30 saniye):\n[Hızlı bilgi aktarımı]\n\n✨ KAPANIŞ:\nHangi konu hakkında video istiyorsunuz?\n\n📱 HASHTAGS: #viral #trending #keşfet",
      "seo": "🔍 SEO Paketi\n\n📝 BAŞLIK ÖNERİLERİ:\n• [Konu] Hakkında Bilmeniz Gerekenler\n• [Konu] Rehberi: Adım Adım Açıklama\n• [Konu] İpuçları ve Püf Noktaları\n\n📄 META AÇIKLAMA:\n[Konu] hakkında kapsamlı bilgiler. Uzman ipuçları ve pratik önerilerle [konu] konusunda bilmeniz gereken her şey.\n\n🔑 ANAHTAR KELİMELER:\nAna: [konu]\nUzun kuyruk: [konu] nedir, [konu] nasıl yapılır, [konu] ipuçları\n\n📱 HASHTAG'LER:\n#konu #ipuçları #rehber #bilgi\n\n💡 SEO ÖNERİLERİ:\n• İçerikte anahtar kelimeleri doğal şekilde kullanın\n• Alt başlıklar ile içeriği yapılandırın"
    },
    "en": {
      "summary": "📋 Key Points:\n• Content was too short to extract main ideas.\n• Content length limited, couldn't form complete sentences.\n• No specific details found in the content.\n\n📝 Summary:\nThe content is too brief to convey meaningful information. Consider expanding or providing more detailed content.",
      "youtube": "🎬 YouTube Video Script\n\n🚀 INTRO (0-15 seconds):\nHello everyone! Today I'll share important information about [topic].\n\n📚 MAIN CONTENT:\nSection 1: [Basic information]\nSection 2: [Details and examples]\nSection 3: [Practical applications]\n\n🎯 CONCLUSION:\nI hope this was helpful! Don't forget to like if you enjoyed it!",
      "shorts": "⚡ Shorts/TikTok Script\n\n🔥 OPENING (0-3 seconds):\nDid you know this?\n\n💥 MAIN MESSAGE (3-30 seconds):\n[Quick information delivery]\n\n✨ CLOSING:\nWhat topic do you want next?\n\n📱 HASHTAGS: #viral #trending #fyp",
      "seo": "🔍 SEO Package\n\n📝 TITLE SUGGESTIONS:\n• Everything You Need to Know About [Topic]\n• [Topic] Guide: Step-by-Step Explanation\n• [Topic] Tips and Best Practices\n\n📄 META DESCRIPTION:\nComprehensive information about [topic]. Expert tips and practical suggestions for everything you need to know about [topic].\n\n🔑 KEYWORDS:\nMain: [topic]\nLong-tail: what is [topic], how to [topic], [topic] tips\n\n📱 HASHTAGS:\n#topic #tips #guide #information\n\n💡 SEO RECOMMENDATIONS:\n• Use keywords naturally in content\n• Structure content with subheadings"
    }
  };
  
  return mockResponses[lang as keyof typeof mockResponses]?.[task as keyof typeof mockResponses['tr']] || 
         "İçerik oluşturulamadı. AI servisi geçici olarak kullanılamıyor.";
}

export async function POST(request: NextRequest) {
  try {
    const body: GenerateRequest = await request.json();
    
    // Validate inputs
    if (!body.input?.trim()) {
      return NextResponse.json(
        { detail: "Input text cannot be empty" },
        { status: 400 }
      );
    }
    
    const {
      input,
      task = "summary",
      lang = "tr",
      tone = "casual",
      length = "medium", 
      persona = "generic",
      max_tokens = MAX_TOKENS_DEFAULT,
      temperature = 0.5
    } = body;
    
    // Validate task
    const validTasks = ["summary", "youtube", "shorts", "social", "seo"];
    if (!validTasks.includes(task)) {
      return NextResponse.json(
        { detail: `Task must be one of: ${validTasks.join(", ")}` },
        { status: 400 }
      );
    }
    
    // Process input - check if it's a URL
    let contentToProcess = input.trim();
    
    if (isUrl(contentToProcess)) {
      try {
        contentToProcess = await extractContentFromUrl(contentToProcess);
      } catch (error) {
        return NextResponse.json(
          { detail: error instanceof Error ? error.message : "Failed to process URL" },
          { status: 400 }
        );
      }
    }
    
    // Limit content length
    const maxContentLength = 4000;
    if (contentToProcess.length > maxContentLength) {
      contentToProcess = contentToProcess.substring(0, maxContentLength) + "...";
    }
    
    // Create system message and user content
    const systemMessage = createSystemMessage(task, lang, tone, length, persona);
    
    const userContent = lang === "tr" 
      ? `Lütfen aşağıdaki içeriği ${task} olarak işle:\n\n${contentToProcess}`
      : `Please process the following content as ${task}:\n\n${contentToProcess}`;
    
    const messages = [
      { role: "system", content: systemMessage },
      { role: "user", content: userContent }
    ];
    
    let result: string;
    
    try {
      result = await callHuggingFace(messages, max_tokens, temperature);
    } catch (error) {
      // Fallback to mock response if HF API fails
      result = getMockResponse(task, lang);
    }
    
    return NextResponse.json({ result });
    
  } catch (error) {
    console.error('Generate API Error:', error);
    return NextResponse.json(
      { detail: "Internal server error" },
      { status: 500 }
    );
  }
}
