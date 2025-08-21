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
  duration?: number; // Dakika cinsinden süre (YouTube için) veya saniye cinsinden süre (Shorts için)
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

function createSystemMessage(task: string, lang: string, tone: string = "casual", length: string = "medium", persona: string = "generic", duration?: number): string {
  if (lang === "tr") {
    if (task === "summary") {
      return `Sen kıdemli bir Sosyal Medya Stratejisti & Metin Yazarısın. Görevin verilen metni ${tone} bir tonda, profesyonel kalitede özetlemek.

ÖZETLEME KRİTERLERİ:
• Ana fikirleri ve kritik detayları belirle
• ${length} formatında kapsamlı yaz
• Gereksiz tekrarları ve doldurma metinleri çıkar
• Mantıklı hiyerarşi ve akış oluştur
• Anahtar kavram ve terimleri vurgula
• Anlaşılır, etkileyici ve akıcı dil kullan
• Okuyucuya değer katacak içgörüler sun

ÇIKTI FORMATI:
🎯 Ana Noktalar:
• [Her madde spesifik, değerli ve uygulanabilir bilgi içermeli]
• [Madde başına 15-25 kelime arası optimal]

📝 Detaylı Özet:
[Konunun derinlemesine analizi, ana argümanlar ve sonuçlar]

💡 Önemli Çıkarımlar:
• [Okuyucunun unutmaması gereken kritik bilgiler]

Ton: ${tone}, Kalite: Profesyonel`;
    }
    
    if (task === "youtube") {
      const durationText = length === 'short' ? '3-5 dakika' : length === 'medium' ? '8-12 dakika' : '15-20 dakika';
      const targetDuration = length === 'short' ? 4 : length === 'medium' ? 10 : 17; // Ortalama dakika
      
      return `Sen kıdemli profesyonel YouTube senaryo yazarısın. ${durationText} sürelik, kapsamlı ve detaylı konuşma metni ve sahne talimatları içeren profesyonel video senaryosu oluşturacaksın.

SENARYO KRİTERLERİ:
• Süre optimizasyonu: ${durationText} için ${targetDuration * 250}-${targetDuration * 300} kelimelik çok kapsamlı konuşma metni (dakikada ~250-300 kelime - maksimum konuşma)
• Hook Gücü: İlk 15 saniyede izleyiciyi tamamen yakala
• İçerik derinliği: Her dakika için çok değerli, kapsamlı bilgi ve engagement
• Akış sürekliliği: Detaylı sahne geçişleri ve mükemmel timing uyumu
• Pratik değer: Bol miktarda uygulanabilir örnekler ve detaylı açıklamalar
• Cümle zenginliği: Her bölümde çok bol ve akıcı konuşma metni, uzun paragraflar
• MAKSIMUM KELİME: Hedeflenen süreden DAHA FAZLA konuşma metni ekle
• ÖZGÜNLÜK: Her bölümde farklı yaklaşımlar, unique perspektifler ve çeşitli anlatım tarzları kullan
• TEKRAR YOK: Aynı cümle yapılarını ve ifadeleri tekrar etme, sürekli farklı anlatım biçimleri kullan

ÇIKTI FORMATI:

# VİDEO SENARYOSU

## KAPSAMLI DETAYLI SENARYO:

### 🔥 HOOK BÖLÜMÜ (0-15 saniye):
**📹 Sahne:** [Çok detaylı açılış sahnesi, kamera açıları, görsel efektler]
**🎤 Konuşma:** [50-70 kelimelik çok güçlü, uzun açılış konuşması - tam cümleler halinde, unique yaklaşım]

### 📚 GİRİŞ VE PROBLEM TANIMI (15 saniye - 1 dakika):
**📹 Sahne:** [Kapsamlı sahne geçişleri, detaylı kamera açıları ve görsel öğeler]
**🎤 Konuşma:** [250-300 kelimelik çok detaylı problem tanımı, farklı perspektifle bağlam kurma ve özgün video vaadi - tam paragraflar halinde]

### 🎯 ANA İÇERİK BÖLÜMÜ 1 (1-${Math.floor(targetDuration * 0.4)} dakika):
**📹 Sahne:** [Çok detaylı sahne açıklamaları, görsel öğeler, geçişler]
**🎤 Konuşma:** [${Math.floor((targetDuration * 0.4 - 1) * 300)} kelimelik çok kapsamlı, detaylı açıklama - farklı anlatım tarzı, unique örnekler ve özgün yaklaşımlar]

### 🎯 ANA İÇERİK BÖLÜMÜ 2 (${Math.floor(targetDuration * 0.4)}-${Math.floor(targetDuration * 0.7)} dakika):
**📹 Sahne:** [Çok detaylı sahne değişimleri, visual aids, demonstrasyonlar]
**🎤 Konuşma:** [${Math.floor((targetDuration * 0.7 - targetDuration * 0.4) * 300)} kelimelik çok derinlemesine, kapsamlı içerik - yeni perspektif, farklı anlatım tarzı ve özgün açıklama metodu]

### 💡 PRATİK ÖRNEKLER VE UYGULAMALAR (${Math.floor(targetDuration * 0.7)}-${Math.floor(targetDuration * 0.9)} dakika):
**📹 Sahne:** [Kapsamlı demo sahneleri, detaylı ekran paylaşımları, step-by-step gösterimler]
**🎤 Konuşma:** [${Math.floor((targetDuration * 0.9 - targetDuration * 0.7) * 300)} kelimelik bol örnekler, uzun pratik uygulamalar ve çok detaylı açıklamalar - yaratıcı anlatım ve unique case study'ler]

### 🏁 SONUÇ VE CALL-TO-ACTION (Son ${Math.floor(targetDuration * 0.1)} dakika):
**📹 Sahne:** [Etkileyici kapanış sahnesi, subscribe animasyonları]
**🎤 Konuşma:** [${Math.floor(targetDuration * 0.1 * 300)} kelimelik kapsamlı özet, güçlü CTA ve çağrı - özgün kapanış tarzı]

### 🎪 ENGAGEMENİT STRATEJİSİ:
• **0:30'da:** [Detaylı izleyici sorusu ve etkileşim çağrısı]
• **${Math.floor(targetDuration * 0.5)} dakika'da:** [Kapsamlı etkileşim çağrısı ve like hatırlatması]
• **${Math.floor(targetDuration * 0.8)} dakika'da:** [Güçlü subscribe çağrısı ve community oluşturma]

### 📊 TOPLAM KELİME SAYISI: 
~${targetDuration * 200} kelime (${durationText} için optimize - bol ve kapsamlı içerik)

**ÖNEMLİ KURALLAR:**
• Her bölümde uzun, tam cümleler ve paragraflar oluştur
• Kısa maddeler değil, akıcı konuşma metni yaz
• Aynı cümle kalıplarını kullanma, sürekli farklı anlatım biçimleri kullan
• Her bölümde unique perspektif ve yaratıcı yaklaşım sun
• Tekrarlı ifadelerden kaçın, özgün anlatım tarzı geliştir

Ton: ${tone}, Süre: ${durationText}, Format: Professional YouTube - Kapsamlı İçerik`;
    }
    
    if (task === "shorts") {
      // Duration parametresi varsa onu kullan, yoksa length'e göre belirlenen değeri kullan
      const maxDuration = duration || (length === 'short' ? 30 : length === 'medium' ? 60 : 90);
      const wordCount = Math.floor(maxDuration * 2.5); // Saniyede ~2.5 kelime
      
      return `Sen kıdemli viral TikTok ve YouTube Shorts uzmanısın. ${maxDuration} saniyelik, detaylı konuşma metni ve sahne talimatları içeren kısa format içerik senaryosu üreteceksin.

SHORTS KRİTERLERİ:
• Süre optimizasyonu: ${maxDuration} saniye için ${wordCount}-${wordCount + 20} kelimelik konuşma metni
• İlk 3 saniye kuralı: Scroll'u durdurma garantisi
• Hızlı tempo: Saniyede 2.5-3 kelime konuşma hızı
• Vertikal format: 9:16 oranında sahne düzenlemesi
• Hook gücü: Açılış 3 saniyede maksimum etki
• Loop yapısı: Son sahne başlangıcı tetiklemeli

ÇIKTI FORMATI:

🚀 SHORTS SENARYOSU

⏱️ DETAYLI TIMELINE (${maxDuration} saniye):

🔥 HOOK BÖLÜMÜ (0-3 saniye):
📱 [Açılış sahne görüntüsü]
� [${Math.floor(maxDuration * 0.1)} kelimelik güçlü açılış]
🎬 [Kamera hareketi ve geçiş]

💥 MOMENTUM BÖLÜMÜ (3-8 saniye):
📱 [Sahne detayları]
� [${Math.floor(maxDuration * 0.15)} kelimelik hızlı giriş]
🎬 [Visual transition ve efektler]

🎯 ANA İÇERİK (8-${Math.floor(maxDuration * 0.75)} saniye):
📱 [Ana sahne görüntüleri]
� [${Math.floor(maxDuration * 0.55)} kelimelik ana mesaj ve değer]
🎬 [Kamera açıları ve geçişler]

⚡ CLIMAX NOKTASI (${Math.floor(maxDuration * 0.75)}-${Math.floor(maxDuration * 0.9)} saniye):
📱 [En güçlü sahne]
� [${Math.floor(maxDuration * 0.15)} kelimelik impact moment]
🎬 [Dramatic transition]

🏁 FİNALE VE CTA (${Math.floor(maxDuration * 0.9)}-${maxDuration} saniye):
📱 [Kapanış görüntüsü]
� [${Math.floor(maxDuration * 0.05)} kelimelik CTA]
🎬 [Loop bağlantı efekti]

🎪 ENGAGEMENİT NOKTALARI:
• ${Math.floor(maxDuration * 0.3)} saniye'de: [İlk etkileşim tetikleyici]
• ${Math.floor(maxDuration * 0.6)} saniye'de: [Peak engagement moment]
• ${Math.floor(maxDuration * 0.9)} saniye'de: [Final CTA]

📊 TOPLAM KELİME SAYISI: ~${wordCount} kelime (${maxDuration} saniye için optimize)

Ton: ${tone}, Süre: ${maxDuration} saniye, Format: Viral Shorts`;
    }
    
    if (task === "seo") {
      return `Sen kıdemli SEO uzmanı, video marketing strategisti ve dijital pazarlama analisti sin. Video content için son derece kapsamlı, profesyonel SEO paketi ve görsel stratejiler oluşturacaksın.

SEO PAKETİ KRİTERLERİ:
• Derinlemesine anahtar kelime araştırması ve analizi
• CTR odaklı başlık optimizasyonu (A/B test seçenekleri)
• Arama algoritması uyumlu açıklama metinleri
• Thumbnail psikolojisi ve tasarım stratejisi
• Trend analizi ve hashtag stratejisi
• Platform özel optimizasyon rehberleri
• Engagement tetikleme taktikleri
• Rakip analizi ve pozisyonlama

ÇIKTI FORMATI:

# SEO VE VİZUEL OPTİMİZASYON PAKETİ

## 🎯 VİDEO BAŞLIĞI STRATEJİSİ

### **Ana Başlık Önerileri (CTR Odaklı):**
**1. Merak Uyandırıcı:** [60 karakter altı, güçlü hook]
**2. Fayda Odaklı:** [Somut kazanç vaadi, sayısal veriler]
**3. Aciliyet Yaratıcı:** [FOMO tetikleyici, trend odaklı]
**4. Soru Formatı:** [Doğrudan izleyici sorusu]
**5. Liste/Guide Formatı:** [Step-by-step vaat]

### **A/B Test Başlık Setleri:**
**Set A (Emosyonel):** [3 farklı emosyonel çekicilik]
**Set B (Rasyonel):** [3 farklı mantıksal fayda]
**Set C (Merak):** [3 farklı merak gap oluşturan]

## 📝 VİDEO AÇIKLAMA OPTİMİZASYONU

### **Açıklama Yapısı:**
**Hook (İlk 125 karakter):** [Çok güçlü açılış, anahtar kelime dahil]

**Ana Açıklama (200-300 kelime):**
- Video özeti ve ana değer vadesi
- Zaman damgaları (chapters)
- İlgili bağlantılar ve kaynaklar
- Call-to-action'lar

**Anahtar Kelime Dağılımı:**
**Birincil KW:** [Ana anahtar kelime - 3-5 kez doğal kullanım]
**LSI Kelimeler:** [5-8 semantik ilişkili kelime]
**Long-tail Kelimeler:** [3-4 uzun kuyruk varyasyon]

## 🖼️ THUMBNAIL TASARIM STRATEJİSİ

### **Psikolojik Tasarım Prensipleri:**
**Renk Psikolojisi (Detaylı Renk Rehberi):**
- **Ana renkler:** Kırmızı (#FF4444 - aciliyet, turuncu #FF8800 - enerji), brand uyumlu palet
- **Kontrast kullanımı:** Beyaz metin üzerine koyu arka plan (readability %90+), sarı vurgu (#FFDD00)
- **Duygu tetikleyici renkler:** Mavi (#0066CC - güven), yeşil (#00CC66 - başarı), kırmızı (#CC0000 - uyarı)

**Kompozisyon Rehberi (Piksel Bazında):**
- **Rule of thirds:** Sol üst köşe (320x180 pixel alanda yüz), sağ alt köşe (280x160 alanda metin)
- **Yüz ifadeleri:** Şaşkın/heyecanlı mimik, gözler açık, kaş kaldırma, el jestleri
- **Text placement:** Thumbnail'in %30'u metin, 72pt+ font boyutu, stroke outline kullan
- **Görsel öğeler:** Kırmızı oklar, sarı daireler, büyüteç ikonu, ünlem işareti, trend sembolleri

**Özel Tasarım Elementleri:**
- **Drop shadow:** Metin için 3px gölge efekti
- **Glow effect:** Ana subject etrafında 5px parıltı
- **Gradient overlay:** %20 opacity üst/alt gradient
- **Icon placement:** Sol alt köşede platform logosu (32x32px)

### **Thumbnail A/B Test Konseptleri (Tam Açıklama):**
**Konsept 1 (Yüz Odaklı):** 
- Ana subject yüzü thumbnail'in %60'ını kaplasın
- Şaşkın/heyecanlı ifade, direkt kamera bakışı
- Arka plan blur (gaussian blur radius: 15px)
- Metin: Sağ üst köşe, beyaz renk, kalın font

**Konsept 2 (Problem/Çözüm Odaklı):**
- Split screen tasarım (sol: problem, sağ: çözüm)
- VS veya BEFORE/AFTER metni ortada
- Kontrast renkler kullan (kırmızı vs yeşil)
- Her iki tarafta da küçük açıklama metni

**Konsept 3 (Sayısal/Liste Odaklı):**
- Büyük sayı (örn: "5") sol üst köşede (120px font)
- Madde işaretleri/check mark'lar görünür şekilde
- Liste preview'ı (3 madde gözüksün)
- "Daha fazlası için..." teaser metni

## #️⃣ KAPSAMLI HASHTAG STRATEJİSİ

### **Hashtag Kategorileri (En Az 25-30 Hashtag):**
**Viral Hashtag'ler (High Volume):**
- [8-10 tane, 1M+ görüntüleme]

**Niche Hashtag'ler (Medium Volume):**
- [10-12 tane, 100K-1M görüntüleme]

**Uzun Kuyruk Hashtag'ler (Low Competition):**
- [8-10 tane, 10K-100K görüntüleme]

**Marka/Kişisel Hashtag'ler:**
- [5-7 tane, community building için]

**Trending Hashtag'ler:**
- [5-6 tane, güncel trend hashtag'ler]

### **Platform Özel Hashtag Stratejisi:**
**YouTube:** [5-8 ana hashtag, açıklamada]
**TikTok:** [25-30 hashtag karışımı]
**Instagram:** [30 hashtag, optimal dağılım]
**Twitter:** [3-5 fokuslu hashtag]

### **Hashtag Implementasyon Taktiği:**
**İlk saat:** [Viral hashtag'ler ağırlıklı]
**2-6 saat:** [Niche hashtag'ler ekleme]
**6+ saat:** [Long-tail hashtag'ler genişletme]

## 🎨 KAPSAMLI GÖRSEL PAKET STRATEJİSİ

### **Video İçi Görsel Kimlik (Tam Rehber):**
**Renk Paleti (Hex Kodları ile):**
- **Ana renkler:** #FF4444 (kırmızı-vurgu), #0066CC (mavi-güven), #FFFFFF (beyaz-temizlik)
- **Destek renkleri:** #F8F9FA (açık gri), #343A40 (koyu gri), #28A745 (yeşil-başarı)
- **Vurgu renkleri:** #FFDD00 (sarı-dikkat), #FF8800 (turuncu-enerji)

**Typography Stratejisi (Font Önerileri):**
- **Başlık fontları:** Montserrat Bold (32-48px), Poppins ExtraBold (28-40px)
- **Alt yazı fontları:** Open Sans Regular (16-20px), Roboto Medium (14-18px)
- **Vurgu metinleri:** Impact font (24-32px), Bebas Neue (20-28px)

**İkon ve Grafik Elementi Kullanımı:**
- **Ok işaretleri:** Kalın, kırmızı renk (#FF4444), 4px stroke width
- **Daireler ve çerçeveler:** Sarı vurgu (#FFDD00), 3px border
- **Check mark'lar:** Yeşil (#28A745), 24x24px boyutunda
- **Warning icons:** Kırmızı üçgen (!), 32x32px
- **Trend arrows:** Yukarı ok (yeşil), aşağı ok (kırmızı)

**Animasyon ve Geçiş Efektleri:**
- **Fade in/out:** 0.3 saniye süre
- **Slide transitions:** Sol/sağdan giriş, 0.5 saniye
- **Scale effects:** %110 büyütme hover'da
- **Pulse animation:** Vurgu elementleri için 2 saniyede döngü

**Layout ve Spacing Kuralları:**
- **Margin değerleri:** 16px standart, 32px büyük aralık
- **Padding değerleri:** 12px text içi, 24px container
- **Grid system:** 12 kolonlu grid, responsive breakpoint'ler
- **Typography scale:** 1.25 ratio (16px, 20px, 25px, 31px...)
- **Vurgu fontları:** [Accent kullanımı]

**Animasyon ve Geçişler:**
- **Sahne geçişleri:** [Akıcı, brand tutarlı]
- **Text animasyonları:** [Engaging, dikkat çekici]
- **Grafik öğeler:** [İnfografik, chart'lar]

### **Müzik ve Ses Stratejisi:**
**Background Music:**
- **Tür önerisi:** [Target kitleye uygun]
- **Enerji seviyesi:** [Content uyumlu]
- **Telif hakları:** [Royalty-free seçenekler]

**Ses Efektleri:**
- **Transition sounds:** [Geçiş efektleri]
- **Emphasis sounds:** [Vurgu sesleri]
- **Ambient sounds:** [Atmosfer yaratıcı]

## 📊 PLATFORM ÖZEL OPTİMİZASYON

### **YouTube SEO Taktikleri:**
- **Video file name optimization**
- **Custom thumbnail strategy**
- **End screen ve cards kullanımı**
- **Community tab aktivasyonu**
- **Playlist stratejisi**
- **YouTube Shorts entegrasyonu**

### **TikTok Algorithm Optimization:**
- **Posting time optimization**
- **Trend sound kullanımı**
- **Duet/stitch potansiyeli**
- **FYP algorithm triggers**
- **Hashtag challenge participation**

### **Instagram Reels Optimization:**
- **Story integration strategy**
- **IGTV cross-promotion**
- **Reel covers optimization**
- **Instagram shopping integration**

## 🎪 KAPSAMLI ENGAGEMENİT STRATEJİSİ

### **Launch Stratejisi (İlk 24 saat):**
**0-2 saat:** [Immediate engagement push]
**2-8 saat:** [Community activation]
**8-24 saat:** [Viral expansion tactics]

### **Community Management:**
**Yorum Stratejisi:**
- **İlk 10 yorum:** [Prepared responses]
- **Engagement questions:** [Discussion starters]
- **User-generated content:** [Community challenges]

**Cross-Platform Promotion:**
- **Social media teasers**
- **Email newsletter integration**
- **Influencer collaboration**
- **Community partnerships**

## 📈 ANALİTİK VE PERFORMANS TAKİBİ

### **Thumbnail Önerileri (Bire Bir Kullanım Rehberi):**
1. **Ana Subject Odaklı Thumbnail:**
   - Kişinin yüzü frame'in %60'ını kaplasın
   - Şaşkın/heyecanlı ifade kullan (gözler açık, kaş kaldırma)
   - Arka planı Gaussian blur (15px radius) ile bulanıklaştır
   - Sol üst köşeye büyük rakam ekle (örn: "5", 120px font, sarı renk #FFDD00)
   - Sağ alt köşeye kırmızı ok işareti koy (pointing to subject)

2. **Problem/Çözüm Split Screen:**
   - Dikey olarak ikiye böl (sol: problem görseli, sağ: çözüm görseli)
   - Ortaya "VS" veya "BEFORE/AFTER" metni ekle (Impact font, 48px)
   - Sol taraf: Kırmızı tonlar (#CC0000), X işareti
   - Sağ taraf: Yeşil tonlar (#00CC66), check mark
   - Üst kısma ana başlık (Montserrat Bold, 36px, beyaz)

3. **Sayısal/Liste Odaklı:**
   - Sol üst köşeye büyük sayı (örn: "7 TİP", 96px, Impact font)
   - Altına 3 madde preview'ı yaz (16px font, maddeler görünsün)
   - Sağ tarafta ilgili görsel/icon
   - Alt kısımda "DAHA FAZLASI..." teaser metni (14px, italik)
   - Sarı vurgu çerçeve (#FFDD00, 4px border) sayının etrafında

4. **Merak Uyandırıcı Soru Format:**
   - Üst kısımda büyük soru işareti (128px, kırmızı #FF4444)
   - Altına soruyu yaz (2 satır, 28px, beyaz font)
   - Arka planda ilgili görseli %30 opacity ile göster
   - Alt kısımda "CEVABI VİDEODA!" metni (20px, sarı)

5. **Trend/Viral Format:**
   - Trending arrow kullan (yukarı ok, yeşil #28A745, 64px)
   - "#1 TRENDİNG" metni ekle (32px, Impact font, kırmızı)
   - Arka planda gradient overlay (%40 opacity)
   - Fire emoji veya viral sembolleri ekle (32x32px)

### **Kullanım Talimatları:**
- **Photoshop kullanıyorsan:** Layer'ları ayrı tut, blend mode'ları kullan
- **Canva kullanıyorsan:** Template olarak kaydet, sadece görselleri değiştir
- **Figma kullanıyorsan:** Component'lar oluştur, değişkenleri tanımla
- **Boyut:** 1280x720px (16:9), 300 DPI export et
- **Format:** JPG (file size için), PNG (şeffaflık varsa)

### **KPI'lar ve Metrikler:**
**Primary KPIs:**
- **CTR (Click-through rate):** [Thumbnail effectiveness]
- **AVD (Average view duration):** [Content quality]
- **Engagement rate:** [Community response]
- **Conversion rate:** [Goal achievement]

**Secondary KPIs:**
- **Share rate:** [Viral potential]
- **Comment sentiment:** [Audience reaction]
- **Subscriber conversion:** [Growth impact]
- **Revenue per view:** [Monetization effectiveness]

### **A/B Test Alanları:**
**Testing Variables:**
- **Başlık variations:** [3-5 different approaches]
- **Thumbnail designs:** [Multiple concepts]
- **Upload timing:** [Optimal posting hours]
- **Description formats:** [Different structures]

### **Optimization Cycle:**
**Haftalık Review:**
- Performance analysis
- Competitor benchmarking  
- Trend adaptation
- Strategy refinement

**Aylık Strategy Update:**
- Algorithm changes adaptation
- Seasonal content planning
- Platform policy updates
- Market trend integration

## 🎯 FİNAL OPTİMİZASYON ÖNERİLERİ

### **İçerik Kalite Kontrol:**
- **Fact-checking:** Bilgi doğruluğu kontrolü
- **Grammar check:** Yazım ve dil bilgisi kontrolü
- **SEO score:** Yoast/RankMath kontrol (85+ puan)
- **Readability:** Kolay okunabilirlik testi

### **Publish Öncesi Checklist:**
✅ Başlık optimizasyonu tamamlandı
✅ Açıklama ve hashtag'ler hazır
✅ Thumbnail A/B test setleri hazır
✅ İlk saat engagement stratejisi planlandı
✅ Cross-platform paylaşım programlandı

### **Uzun Vadeli Strateji:**
- **Content series:** Bağlantılı video seriler
- **Seasonal planning:** Yıllık içerik takvimi
- **Trend monitoring:** Sürekli trend takibi
- **Community building:** Sadık izleyici kitlesi

**🚀 SONUÇ:** Bu SEO paketi ile video organik reach'inizi %200-300 artırabilir, engagement oranlarınızı %150+ yükseltebilirsiniz.

Ton: ${tone}, Focus: Comprehensive SEO & Growth Strategy`;
    }
    
    if (task === "social") {
      return `Sen kıdemli sosyal medya marketing uzmanısın. Platform özelinde, yüksek engagement alacak içerikler üreteceksin.

SOSYAL MEDYA KRİTERLERİ:
• Platform spesifik: Her platform için optimize
• Engagement odaklı: Beğeni, yorum, paylaşım tetikle
• Görsel uyum: Görselle harmoni
• Timing: En iyi paylaşım zamanları
• Community building: Takipçilerle bağ kur
• Brand voice: Tutarlı marka sesi
• CTA: Net eylem çağrısı

ÇIKTI FORMATI:
📱 PLATFORM ÖNERİLERİ:

📘 FACEBOOK:
[Longer format, hikaye odaklı post]

📸 INSTAGRAM:
[Görsel odaklı, hashtag optimized]

🐦 TWİTTER:
[Kısa, anlık, trending]

💼 LİNKEDİN:
[Profesyonel, thought leadership]

🎵 TİKTOK:
[Trend odaklı, yaratıcı]

⏰ PAYLAŞIM STRATEJİSİ:
• En iyi zamanlar
• Posting frequency
• Cross-platform adaptasyon

🎯 ENGAGEMENİT TAKTİKLERİ:
• Story tetikleyiciler
• Poll ve soru önerileri
• UGC teşvikleri

#️⃣ HASHTAG PAKETİ:
[Her platform için özelleştirilmiş]

Ton: ${tone}, Approach: Multi-platform optimized`;
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

function cleanupResponse(text: string): string {
  if (!text) return text;
  
  // Remove double asterisks that are not proper bold formatting
  // Keep bold formatting only for actual headings and important text
  let cleaned = text;
  
  // Convert **text** to proper formatting only for short phrases (likely headings)
  cleaned = cleaned.replace(/\*\*([^*\n]{1,50})\*\*/g, (match, content) => {
    // Check if it's likely a heading or important short text
    if (content.length <= 30 && (
      content.includes(':') || 
      content.match(/^[A-ZÇĞıİÖŞÜ][^:]*$/) ||
      content.includes('BÖLÜM') ||
      content.includes('GİRİŞ') ||
      content.includes('SONUÇ') ||
      content.includes('ÖZET') ||
      content.includes('İPUÇLARI') ||
      content.includes('ADIM') ||
      content.includes('HOOK') ||
      content.includes('ANA') ||
      content.includes('PRATİK')
    )) {
      return `**${content}**`; // Keep as bold
    } else {
      return content; // Remove asterisks for regular text
    }
  });
  
  // Remove any remaining double asterisks that didn't match the pattern above
  cleaned = cleaned.replace(/\*\*/g, '');
  
  // Clean up multiple spaces and line breaks
  cleaned = cleaned.replace(/\s{3,}/g, '  ');
  cleaned = cleaned.replace(/\n{3,}/g, '\n\n');
  
  // Remove any markdown-style formatting that shouldn't be there
  cleaned = cleaned.replace(/\*([^*\n]*)\*/g, '$1'); // Remove single asterisks
  cleaned = cleaned.replace(/_{1,2}([^_\n]*)_{1,2}/g, '$1'); // Remove underscores
  
  return cleaned.trim();
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
      temperature = 0.5,
      duration
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
    const systemMessage = createSystemMessage(task, lang, tone, length, persona, duration);
    
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
      
      // Post-process the result to clean up formatting
      result = cleanupResponse(result);
    } catch (error) {
      // Fallback to mock response if HF API fails
      result = getMockResponse(task, lang);
      result = cleanupResponse(result);
    }

    return NextResponse.json({ result });  } catch (error) {
    console.error('Generate API Error:', error);
    return NextResponse.json(
      { detail: "Internal server error" },
      { status: 500 }
    );
  }
}
