"""
Creator Transformer - Simple FastAPI backend for Hugging Face Space
Generates summaries, YouTube scripts, and Shorts scripts using Hugging Face models
"""

import os
import requests
from typing import Optional
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import logging
from urllib.parse import urlparse
import re
from bs4 import BeautifulSoup
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Creator Transformer API",
    description="AI-powered content generation for summaries and video scripts",
    version="1.0.0"
)

# CORS middleware for Vercel frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your Vercel domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models
class GenerateRequest(BaseModel):
    input: str  # Changed from 'text' to 'input'
    task: str  # "summary", "youtube", "shorts", "social", "seo"
    lang: str = "tr"  # "tr", "en"
    tone: str = "casual"  # "formal", "casual", "energetic"
    length: str = "medium"  # "short", "medium", "long"
    persona: str = "generic"  # "news_anchor", "educator", "vlogger", "influencer", "brand"
    max_tokens: int = 2048
    temperature: float = 0.5

class GenerateAllRequest(BaseModel):
    input: str
    lang: str = "tr"
    persona: str = "generic"
    temperature: float = 0.5

class GenerateResponse(BaseModel):
    result: str

class GenerateAllResponse(BaseModel):
    summary: str
    youtube: str
    shorts: str
    social: str
    seo: dict

# Hugging Face Router configuration
HF_API_TOKEN = os.getenv("HF_API_TOKEN")
HF_MODEL = "meta-llama/Llama-3.1-8B-Instruct:novita"
HF_BASE_URL = "https://router.huggingface.co/v1"
HF_TIMEOUT = 60
MAX_TOKENS_DEFAULT = 512

if not HF_API_TOKEN:
    logger.warning("HF_API_TOKEN not set - API calls will fail!")

def is_url(text: str) -> bool:
    """Check if the input text is a URL"""
    try:
        result = urlparse(text.strip())
        return all([result.scheme, result.netloc])
    except:
        return False

def extract_content_from_url(url: str) -> str:
    """Extract and clean text content from a URL with advanced processing"""
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'Accept-Encoding': 'gzip, deflate',
            'Connection': 'keep-alive',
        }
        
        response = requests.get(url, headers=headers, timeout=15, allow_redirects=True)
        response.raise_for_status()
        
        soup = BeautifulSoup(response.content, 'html.parser')
        
        # Remove unwanted elements
        for element in soup(['script', 'style', 'nav', 'header', 'footer', 'aside', 
                           'menu', 'form', 'button', 'input', 'select', 'textarea',
                           'iframe', 'noscript', 'meta', 'link']):
            element.decompose()
        
        # Try to find main content areas
        content_selectors = [
            'article', 'main', '[role="main"]', '.content', '.post-content', 
            '.entry-content', '.article-content', '.post-body', '.story-body',
            '.article-body', '.content-body', '#content', '#main-content'
        ]
        
        main_content = None
        for selector in content_selectors:
            elements = soup.select(selector)
            if elements:
                main_content = elements[0]
                break
        
        if main_content:
            text_content = main_content.get_text()
        else:
            # Fallback to body content
            body = soup.find('body')
            text_content = body.get_text() if body else soup.get_text()
        
        # Advanced text cleaning
        lines = text_content.split('\n')
        cleaned_lines = []
        
        for line in lines:
            line = line.strip()
            # Skip empty lines, very short lines, and common non-content
            if (len(line) > 10 and 
                not line.lower().startswith(('cookie', 'javascript', 'advertisement', 'ads', 'menu', 'navigation')) and
                not re.match(r'^[\s\W]*$', line)):  # Skip lines with only whitespace/symbols
                cleaned_lines.append(line)
        
        # Join and clean the text
        text = ' '.join(cleaned_lines)
        
        # Remove extra whitespace
        text = re.sub(r'\s+', ' ', text).strip()
        
        # Extract meaningful content (handle short content gracefully)
        if len(text) < 50:
            raise ValueError("İçerik çok kısa veya çıkarılamadı")
        elif len(text) < 100:
            # For very short content, try to get a reasonable message
            text = f"Kısa içerik bulundu: {text}"
        
        # Limit content length intelligently - try to end at sentence boundaries
        max_length = 8000
        if len(text) > max_length:
            # Try to cut at sentence boundary
            truncated = text[:max_length]
            last_sentence = truncated.rfind('.')
            if last_sentence > max_length - 500:  # If found a sentence end near the limit
                text = truncated[:last_sentence + 1]
            else:
                text = truncated + "..."
        
        # Add source URL info
        domain = urlparse(url).netloc
        text = f"[Kaynak: {domain}]\n\n{text}"
        
        logger.info(f"Successfully extracted {len(text)} characters from {domain}")
        return text
        
    except requests.exceptions.RequestException as e:
        logger.error(f"Request error for URL {url}: {str(e)}")
        raise HTTPException(
            status_code=400,
            detail=f"Web sitesine erişilemedi: {str(e)}"
        )
    except Exception as e:
        logger.error(f"Content extraction error for URL {url}: {str(e)}")
        raise HTTPException(
            status_code=400,
            detail=f"İçerik çıkarılamadı: {str(e)}"
        )

def get_hf_headers():
    """Get headers for Hugging Face Router API"""
    if not HF_API_TOKEN:
        raise HTTPException(
            status_code=500, 
            detail="HF_API_TOKEN environment variable not set"
        )
    return {
        "Authorization": f"Bearer {HF_API_TOKEN}",
        "Content-Type": "application/json"
    }

def create_system_message(task: str, lang: str, tone: str = "casual", length: str = "medium", persona: str = "generic") -> str:
    """Create optimized system message based on task, language, tone, length and persona"""
    
    # Persona configurations
    personas = {
        "news_anchor": {
            "tr": {"style": "objektif haber sunumu tarzında", "voice": "güvenilir ve profesyonel"},
            "en": {"style": "objective news presentation style", "voice": "credible and professional"}
        },
        "educator": {
            "tr": {"style": "eğitici ve açıklayıcı", "voice": "sabırlı ve anlaşılır"},
            "en": {"style": "educational and explanatory", "voice": "patient and clear"}
        },
        "vlogger": {
            "tr": {"style": "kişisel ve samimi vlog tarzında", "voice": "enerjik ve eğlenceli"},
            "en": {"style": "personal and intimate vlog style", "voice": "energetic and entertaining"}
        },
        "influencer": {
            "tr": {"style": "trend odaklı ve çekici", "voice": "karizmatik ve ikna edici"},
            "en": {"style": "trend-focused and engaging", "voice": "charismatic and persuasive"}
        },
        "brand": {
            "tr": {"style": "marka kimliği uyumlu", "voice": "profesyonel ve tutarlı"},
            "en": {"style": "brand identity aligned", "voice": "professional and consistent"}
        },
        "generic": {
            "tr": {"style": "genel içerik oluşturucu", "voice": "net ve etkili"},
            "en": {"style": "general content creator", "voice": "clear and effective"}
        }
    }
    
    # Length guidelines
    length_guide = {
        "short": {"summary": "2-3 madde, 1 paragraf", "youtube": "30-60 saniye", "shorts": "15-30 saniye", "social": "1-2 cümle", "seo": "kısa"},
        "medium": {"summary": "4-6 madde, 2 paragraf", "youtube": "2-5 dakika", "shorts": "30-60 saniye", "social": "2-3 cümle", "seo": "orta"},
        "long": {"summary": "6-10 madde, 3-4 paragraf", "youtube": "5-10 dakika", "shorts": "60-90 saniye", "social": "3-4 cümle", "seo": "uzun"}
    }
    
    # Tone adjustments
    tone_styles = {
        "casual": {"tr": "sohbet tarzında, samimi", "en": "conversational, friendly"},
        "formal": {"tr": "profesyonel, resmi", "en": "professional, formal"},
        "energetic": {"tr": "enerjik, heyecanlı", "en": "energetic, exciting"}
    }
    
    persona_config = personas.get(persona, personas["generic"])
    persona_style = persona_config[lang]["style"]
    persona_voice = persona_config[lang]["voice"]
    
    if lang == "tr":
        if task == "summary":
            return f"""Sen {persona_style} uzman bir içerik analisti ve özetleme uzmanısın. Görevin verilen metni {tone_styles[tone]['tr']} bir şekilde özetlemek.

PERSONA: {persona_voice} ses tonu kullan
ÖZETLEME KRİTERLERİ:
• Ana fikirleri ve önemli detayları kaybet
• {length_guide[length]['summary']} formatında yaz
• Gereksiz tekrarları çıkar
• Mantıklı akış ve yapı oluştur
• Anahtar kavramları vurgula
• Anlaşılır ve akıcı dil kullan

ÇIKTI FORMATI:
📋 Ana Noktalar:
• [Her madde için spesifik ve değerli bilgi]

📝 Özet:
[Konunun genel değerlendirmesi ve sonuç]

Ton: {tone_styles[tone]['tr']}"""

        elif task == "youtube":
            return f"""Sen {persona_style} profesyonel bir YouTube içerik yazarısın. Verilen konudan {length_guide[length]['youtube']} uzunluğunda YouTube video senaryosu oluşturacaksın.

PERSONA: {persona_voice} ses tonu kullan
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

Ton: {tone_styles[tone]['tr']}"""

        elif task == "shorts":
            return f"""Sen {persona_style} viral içerik uzmanısın. Verilen konudan {length_guide[length]['shorts']} uzunluğunda YouTube Shorts/TikTok senaryosu oluşturacaksın.

PERSONA: {persona_voice} ses tonu kullan
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

💥 ANA MESAJ (3-{length_guide[length]['shorts'].split('-')[0]} saniye):
[Hızlı bilgi aktarımı]

✨ KAPANIŞ:
[Güçlü sonuç ve çağrı]

📱 HASHTAGS: #viral #trending [konuya özel]

Ton: {tone_styles[tone]['tr']}"""

        elif task == "social":
            return f"""Sen {persona_style} sosyal medya uzmanısın. Verilen içerikten {length_guide[length]['social']} uzunluğunda sosyal medya paylaşımı oluşturacaksın.

PERSONA: {persona_voice} ses tonu kullan
SOSYAL MEDYA KRİTERLERİ:
• Dikkat çekici açılış
• Ana mesajı net ver
• Etkileşimi artıracak içerik
• Uygun hashtag'ler
• Call-to-action

ÇIKTI FORMATI:
📱 Sosyal Medya Paylaşımı:
[Ana içerik]

#hashtag #tag

Ton: {tone_styles[tone]['tr']}"""

        elif task == "seo":
            return f"""Sen {persona_style} SEO uzmanısın. Verilen içerik için kapsamlı SEO paketi oluşturacaksın.

PERSONA: {persona_voice} yaklaşım kullan
SEO KRİTERLERİ:
• Anahtar kelime optimizasyonu
• Meta açıklama
• Başlık önerileri
• Hashtag stratejisi
• İçerik yapısı

ÇIKTI FORMATI:
🔍 SEO Paketi:

📝 Başlık Önerileri:
• [3 farklı başlık seçeneği]

📄 Meta Açıklama:
[155 karakter meta açıklama]

🏷️ Anahtar Kelimeler:
[Ana ve destekleyici anahtar kelimeler]

#️⃣ Hashtag Önerileri:
[Platform bazlı hashtag'ler]

Ton: {tone_styles[tone]['tr']}"""
    
    else:  # English
        if task == "summary":
            return f"""You are an expert content analyst and summarization specialist with {persona_style} approach. Your task is to create a {tone_styles[tone]['en']} summary of the given content.

PERSONA: Use {persona_voice} tone
SUMMARIZATION CRITERIA:
• Extract key ideas and important details
• Format as {length_guide[length]['summary']}
• Remove unnecessary repetition
• Create logical flow and structure  
• Highlight key concepts
• Use clear and fluent language

OUTPUT FORMAT:
📋 Key Points:
• [Specific and valuable information for each point]

📝 Summary:
[Overall assessment and conclusion of the topic]

Tone: {tone_styles[tone]['en']}"""

        elif task == "youtube":
            return f"""You are a professional YouTube content writer with {persona_style} approach. Create a {length_guide[length]['youtube']} YouTube video script from the given topic.

PERSONA: Use {persona_voice} tone
SCRIPT CRITERIA:
• Start with an engaging hook
• Process main topics in logical order
• Ask engaging questions for viewers
• Provide examples and practical information
• Create a strong conclusion
• Include call-to-action

OUTPUT FORMAT:
🎬 YouTube Video Script

🚀 INTRO (0-15 seconds):
[Engaging opening, hook]

📚 MAIN CONTENT:
[Section 1: Basic information]
[Section 2: Details and examples]
[Section 3: Practical applications]

🎯 CONCLUSION:
[Summary and call-to-action]

Tone: {tone_styles[tone]['en']}"""

        elif task == "shorts":
            return f"""You are a viral content expert with {persona_style} approach. Create a {length_guide[length]['shorts']} YouTube Shorts/TikTok script from the given topic.

PERSONA: Use {persona_voice} tone
SHORTS CRITERIA:
• Grab attention in first 3 seconds
• Fast-paced and dynamic
• Include visual descriptions
• Use trending hashtags
• High viral potential
• Re-watchable quality

OUTPUT FORMAT:
⚡ Shorts/TikTok Script

🔥 OPENING (0-3 seconds):
[Striking question/claim]

💥 MAIN MESSAGE (3-{length_guide[length]['shorts'].split('-')[0]} seconds):
[Rapid information delivery]

✨ CLOSING:
[Strong conclusion and call]

📱 HASHTAGS: #viral #trending [topic-specific]

Tone: {tone_styles[tone]['en']}"""

        elif task == "social":
            return f"""You are a social media expert with {persona_style} approach. Create a {length_guide[length]['social']} social media post from the given content.

PERSONA: Use {persona_voice} tone
SOCIAL MEDIA CRITERIA:
• Attention-grabbing opening
• Clear main message
• Engagement-boosting content
• Appropriate hashtags
• Call-to-action

OUTPUT FORMAT:
📱 Social Media Post:
[Main content]

#hashtag #tag

Tone: {tone_styles[tone]['en']}"""

        elif task == "seo":
            return f"""You are an SEO expert with {persona_style} approach. Create a comprehensive SEO package for the given content.

PERSONA: Use {persona_voice} approach
SEO CRITERIA:
• Keyword optimization
• Meta description
• Title suggestions
• Hashtag strategy
• Content structure

OUTPUT FORMAT:
🔍 SEO Package:

📝 Title Suggestions:
• [3 different title options]

📄 Meta Description:
[155 character meta description]

🏷️ Keywords:
[Primary and supporting keywords]

#️⃣ Hashtag Suggestions:
[Platform-specific hashtags]

Tone: {tone_styles[tone]['en']}"""
    
    return f"You are a helpful {task} content creator with {persona_style} approach. Create {tone} content in {lang}."

async def call_hf_router(messages: list, max_tokens: int = MAX_TOKENS_DEFAULT, temperature: float = 0.3, task: str = "summary", lang: str = "tr") -> str:
    """Call Hugging Face Router API"""
    try:
        if not HF_API_TOKEN:
            logger.warning("No HF_API_TOKEN provided, returning mock response")
            return get_mock_response(task, lang)
        
        headers = get_hf_headers()
        
        # Prepare payload for HF Router
        payload = {
            "model": HF_MODEL,
            "messages": messages,
            "max_tokens": max_tokens,
            "temperature": temperature
        }
        
        logger.info(f"Calling HF Router with model: {HF_MODEL}")
        
        response = requests.post(
            f"{HF_BASE_URL}/chat/completions",
            headers=headers,
            json=payload,
            timeout=HF_TIMEOUT
        )
        
        if response.status_code != 200:
            error_msg = f"HF Router error: {response.status_code}"
            try:
                error_detail = response.json().get("error", {}).get("message", "Unknown error")
                error_msg += f" - {error_detail}"
            except:
                error_msg += f" - {response.text[:200]}"
            
            logger.error(f"HF Router API error: {error_msg}")
            raise HTTPException(
                status_code=502,
                detail=f"LLM provider error: {error_msg}"
            )
        
        result = response.json()
        
        # Parse response - try different fields
        if "choices" in result and len(result["choices"]) > 0:
            choice = result["choices"][0]
            if "message" in choice and "content" in choice["message"]:
                generated_text = choice["message"]["content"]
            elif "text" in choice:
                generated_text = choice["text"]
            else:
                logger.error(f"Unexpected response format: {result}")
                raise HTTPException(status_code=502, detail="LLM provider error: Invalid response format")
        else:
            logger.error(f"No choices in response: {result}")
            raise HTTPException(status_code=502, detail="LLM provider error: No content generated")
        
        if not generated_text or not generated_text.strip():
            raise HTTPException(status_code=502, detail="LLM provider error: Empty response")
        
        return generated_text.strip()
        
    except requests.exceptions.Timeout:
        logger.error("HF Router API timeout")
        raise HTTPException(status_code=502, detail="LLM provider error: Request timeout")
    except requests.exceptions.RequestException as e:
        logger.error(f"HF Router API request error: {str(e)}")
        # Return a fallback mock response instead of throwing error
        return get_mock_response(task, lang)
    except HTTPException as he:
        # If it's an HTTP exception, try to return mock response
        logger.error(f"HF Router HTTP error: {he.detail}")
        return get_mock_response(task, lang)
    except Exception as e:
        logger.error(f"Unexpected error in HF Router call: {str(e)}", exc_info=True)
        return get_mock_response(task, lang)

def get_mock_response(task: str, lang: str) -> str:
    """Generate mock response when API fails"""
    mock_responses = {
        "tr": {
            "summary": "Özet: Bu içerik hakkında bir özet oluşturulacaktı, ancak AI servisi şu anda kullanılamıyor. Lütfen daha sonra tekrar deneyin.",
            "youtube": "🎬 YouTube Video Script\n\nGiriş: Merhaba arkadaşlar!\n\nAna Konu: Bu videoda [konu] hakkında konuşacağız.\n\nSonuç: Bu konuda ne düşünüyorsunuz? Yorumlarda belirtin!\n\n[Not: AI servisi geçici olarak kullanılamıyor]",
            "shorts": "📱 Shorts Script\n\n🔥 DİKKAT ÇEKİCİ GİRİŞ\n✨ Hızlı bilgi\n🎯 Ana mesaj\n💫 Call to action\n\n[Not: AI servisi geçici olarak kullanılamıyor]",
            "social": "📱 Sosyal Medya Paylaşımı\n\n[İlginç başlık] 🚀\n\n[Açıklama metni]\n\n#hashtag #trending\n\n[Not: AI servisi geçici olarak kullanılamıyor]",
            "seo": "🔍 SEO Paketi\n\nÖnerilen Başlıklar:\n• Başlık 1\n• Başlık 2\n\nMeta Açıklama: [Açıklama]\n\nHashtag'ler: #hashtag1 #hashtag2\n\n[Not: AI servisi geçici olarak kullanılamıyor]"
        },
        "en": {
            "summary": "Summary: A summary would be generated for this content, but the AI service is currently unavailable. Please try again later.",
            "youtube": "🎬 YouTube Video Script\n\nIntro: Hello everyone!\n\nMain Topic: In this video we'll discuss [topic].\n\nConclusion: What do you think about this? Let me know in the comments!\n\n[Note: AI service temporarily unavailable]",
            "shorts": "📱 Shorts Script\n\n🔥 ATTENTION GRABBER\n✨ Quick info\n🎯 Main message\n💫 Call to action\n\n[Note: AI service temporarily unavailable]",
            "social": "📱 Social Media Post\n\n[Interesting title] 🚀\n\n[Description text]\n\n#hashtag #trending\n\n[Note: AI service temporarily unavailable]",
            "seo": "🔍 SEO Package\n\nSuggested Titles:\n• Title 1\n• Title 2\n\nMeta Description: [Description]\n\nHashtags: #hashtag1 #hashtag2\n\n[Note: AI service temporarily unavailable]"
        }
    }
    
    return mock_responses.get(lang, mock_responses["tr"]).get(task, "İçerik oluşturulamadı. AI servisi geçici olarak kullanılamıyor.")

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"ok": True, "status": "healthy"}

# Token validation endpoint
@app.get("/validate-token")
async def validate_token():
    """Validate HF API token"""
    if not HF_API_TOKEN:
        return {"valid": False, "error": "No token provided"}
    
    try:
        response = requests.get(
            "https://huggingface.co/api/whoami-v2",
            headers={"Authorization": f"Bearer {HF_API_TOKEN}"},
            timeout=10
        )
        if response.status_code == 200:
            data = response.json()
            return {
                "valid": True, 
                "name": data.get("name", "Unknown"),
                "auth_type": data.get("auth", {}).get("type", "Unknown")
            }
        else:
            return {"valid": False, "error": f"HTTP {response.status_code}"}
    except Exception as e:
        return {"valid": False, "error": str(e)}

@app.post("/generate", response_model=GenerateResponse)
async def generate_content(request: GenerateRequest):
    """Generate content based on task type using HF Router"""
    
    # Validate inputs
    if not request.input.strip():
        raise HTTPException(status_code=400, detail="Input text cannot be empty")
    
    if request.task not in ["summary", "youtube", "shorts", "social", "seo"]:
        raise HTTPException(
            status_code=400, 
            detail="Task must be one of: summary, youtube, shorts, social, seo"
        )
    
    if request.tone not in ["formal", "casual", "energetic"]:
        raise HTTPException(
            status_code=400,
            detail="Tone must be one of: formal, casual, energetic"
        )
    
    if request.length not in ["short", "medium", "long"]:
        raise HTTPException(
            status_code=400,
            detail="Length must be one of: short, medium, long"
        )
    
    if request.lang not in ["tr", "en"]:
        raise HTTPException(
            status_code=400,
            detail="Language must be one of: tr, en"
        )
    
    if request.persona not in ["news_anchor", "educator", "vlogger", "influencer", "brand", "generic"]:
        raise HTTPException(
            status_code=400,
            detail="Persona must be one of: news_anchor, educator, vlogger, influencer, brand, generic"
        )
    
    # Process input - check if it's a URL
    content_to_process = request.input.strip()
    
    if is_url(content_to_process):
        logger.info(f"Processing URL: {content_to_process}")
        try:
            content_to_process = extract_content_from_url(content_to_process)
            logger.info(f"Extracted {len(content_to_process)} characters from URL")
        except HTTPException as he:
            # If content extraction fails, provide a helpful fallback
            logger.warning(f"URL extraction failed: {he.detail}")
            content_to_process = f"URL: {content_to_process}\n\nNot: Bu URL'den içerik çıkarılamadı. Lütfen içeriği manuel olarak kopyalayıp yapıştırın veya farklı bir URL deneyin."
        except Exception as e:
            logger.warning(f"URL extraction error: {str(e)}")
            content_to_process = f"URL: {content_to_process}\n\nNot: Bu URL'den içerik çıkarılamadı. Lütfen içeriği manuel olarak kopyalayıp yapıştırın."
    
    # Create messages for chat completion with enhanced context
    system_message = create_system_message(request.task, request.lang, request.tone, request.length, request.persona)
    
    # Create enhanced user message with more context
    content_length = len(content_to_process)
    content_type = "URL içeriği" if is_url(request.input.strip()) else "Metin"
    
    # Determine optimal max_tokens based on task and length
    optimal_tokens = {
        "summary": {"short": 256, "medium": 512, "long": 768},
        "youtube": {"short": 384, "medium": 768, "long": 1024}, 
        "shorts": {"short": 192, "medium": 256, "long": 384},
        "social": {"short": 128, "medium": 192, "long": 256},
        "seo": {"short": 256, "medium": 384, "long": 512}
    }
    
    # Use user's setting or optimal default
    max_tokens = min(request.max_tokens, optimal_tokens.get(request.task, {}).get(request.length, 512))
    
    if request.lang == "tr":
        user_content = f"""İçerik Türü: {content_type}
İçerik Uzunluğu: {content_length} karakter
Görev: {request.task.title()} oluştur
Ton: {request.tone.title()}
Uzunluk: {request.length.title()}
Persona: {request.persona.title()}

İÇERİK:
{content_to_process}

Lütfen yukarıdaki içeriği belirtilen kriterlere göre işle ve kaliteli bir çıktı oluştur."""
    else:
        user_content = f"""Content Type: {content_type}
Content Length: {content_length} characters  
Task: Create {request.task}
Tone: {request.tone.title()}
Length: {request.length.title()}
Persona: {request.persona.title()}

CONTENT:
{content_to_process}

Please process the above content according to the specified criteria and create a high-quality output."""
    
    messages = [
        {"role": "system", "content": system_message},
        {"role": "user", "content": user_content}
    ]
    
    logger.info(f"Generating {request.task} content: persona={request.persona}, tone={request.tone}, length={request.length}, lang={request.lang}")
    
    try:
        result = await call_hf_router(
            messages=messages,
            max_tokens=max_tokens,
            temperature=request.temperature,
            task=request.task,
            lang=request.lang
        )
        
        # Post-process result for better quality
        result = result.strip()
        
        # Add quality indicators
        word_count = len(result.split())
        logger.info(f"Generated {word_count} words for {request.task}")
        
        return GenerateResponse(result=result)
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Content generation error: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=502,
            detail="LLM provider error: Content generation failed"
        )

@app.post("/generate-all", response_model=GenerateAllResponse)
async def generate_all_content(request: GenerateAllRequest):
    """Generate all content types from single input - PRO feature"""
    
    # Validate inputs
    if not request.input.strip():
        raise HTTPException(status_code=400, detail="Input text cannot be empty")
    
    if request.lang not in ["tr", "en"]:
        raise HTTPException(
            status_code=400,
            detail="Language must be one of: tr, en"
        )
    
    if request.persona not in ["news_anchor", "educator", "vlogger", "influencer", "brand", "generic"]:
        raise HTTPException(
            status_code=400,
            detail="Persona must be one of: news_anchor, educator, vlogger, influencer, brand, generic"
        )
    
    # Process input - check if it's a URL
    content_to_process = request.input.strip()
    
    if is_url(content_to_process):
        logger.info(f"Processing URL for generate-all: {content_to_process}")
        try:
            content_to_process = extract_content_from_url(content_to_process)
            logger.info(f"Extracted {len(content_to_process)} characters from URL")
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(
                status_code=400,
                detail=f"Failed to process URL: {str(e)}"
            )
    
    # Generate all content types
    results = {}
    tasks = [
        ("summary", "medium"),
        ("youtube", "medium"), 
        ("shorts", "short"),
        ("social", "short")
    ]
    
    for task, length in tasks:
        try:
            system_message = create_system_message(task, request.lang, "casual", length, request.persona)
            
            content_length = len(content_to_process)
            content_type = "URL içeriği" if is_url(request.input.strip()) else "Metin"
            
            if request.lang == "tr":
                user_content = f"""İçerik Türü: {content_type}
İçerik Uzunluğu: {content_length} karakter
Görev: {task.title()} oluştur
Persona: {request.persona.title()}

İÇERİK:
{content_to_process}

Lütfen yukarıdaki içeriği belirtilen kriterlere göre işle ve kaliteli bir çıktı oluştur."""
            else:
                user_content = f"""Content Type: {content_type}
Content Length: {content_length} characters  
Task: Create {task}
Persona: {request.persona.title()}

CONTENT:
{content_to_process}

Please process the above content according to the specified criteria and create a high-quality output."""
            
            messages = [
                {"role": "system", "content": system_message},
                {"role": "user", "content": user_content}
            ]
            
            # Determine optimal tokens for each task
            optimal_tokens = {
                "summary": 512,
                "youtube": 768,
                "shorts": 256,
                "social": 192
            }
            
            result = await call_hf_router(
                messages=messages,
                max_tokens=optimal_tokens[task],
                temperature=request.temperature,
                task=task,
                lang=request.lang
            )
            
            results[task] = result.strip()
            logger.info(f"Generated {task} content: {len(result.split())} words")
            
        except Exception as e:
            logger.error(f"Error generating {task}: {str(e)}")
            results[task] = f"Error generating {task}: {str(e)}"
    
    # Generate SEO package
    try:
        seo_system = create_system_message("seo", request.lang, "formal", "medium", request.persona)
        seo_user = f"""İçerik: {content_to_process[:1000]}...

Yukarıdaki içerik için kapsamlı SEO paketi oluştur.""" if request.lang == "tr" else f"""Content: {content_to_process[:1000]}...

Create a comprehensive SEO package for the above content."""
        
        seo_messages = [
            {"role": "system", "content": seo_system},
            {"role": "user", "content": seo_user}
        ]
        
        seo_result = await call_hf_router(
            messages=seo_messages,
            max_tokens=384,
            temperature=0.3,
            task="seo",
            lang=request.lang
        )
        
        # Parse SEO result into structured format
        seo_data = {
            "title_suggestions": ["SEO Başlık 1", "SEO Başlık 2", "SEO Başlık 3"],
            "meta_description": "SEO meta açıklaması...",
            "keywords": ["anahtar", "kelime", "listesi"],
            "hashtags": ["#hashtag1", "#hashtag2", "#hashtag3"],
            "full_result": seo_result.strip()
        }
        
    except Exception as e:
        logger.error(f"Error generating SEO: {str(e)}")
        seo_data = {
            "title_suggestions": ["Başlık bulunamadı"],
            "meta_description": "Meta açıklama oluşturulamadı",
            "keywords": ["anahtar kelime bulunamadı"],
            "hashtags": ["#error"],
            "full_result": f"SEO oluşturulamadı: {str(e)}"
        }
    
    logger.info("Generate-all completed successfully")
    
    return GenerateAllResponse(
        summary=results.get("summary", "Özet oluşturulamadı"),
        youtube=results.get("youtube", "YouTube senaryosu oluşturulamadı"), 
        shorts=results.get("shorts", "Shorts senaryosu oluşturulamadı"),
        social=results.get("social", "Sosyal medya paylaşımı oluşturulamadı"),
        seo=seo_data
    )

@app.get("/")
async def root():
    """Root endpoint with API information"""
    return {
        "message": "Creator Transformer API",
        "version": "1.0.0",
        "endpoints": {
            "health": "/health",
            "generate": "/generate (POST)"
        },
        "docs": "/docs"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=7861)  # Port 7861 for new version
