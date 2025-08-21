# 🐙 CSpark - AI-Powered Content Creation Platform

Modern AI destekli içerik yaratım platformu. Yapay zeka ile YouTube videoları, özetler, sosyal medya içerikleri ve daha fazlasını oluşturun.

## 🚀 Canlı Demo

**Website:** [www.cspark.app](https://www.cspark.app)

## ✨ Özellikler

- 🐙 **CSpark AI Engine** - Llama-3.1-8B-Instruct modeli ile güçlendirilmiş
- 🎨 **Modern Arayüz** - Dark/Light theme desteği ile responsive tasarım  
- 🌐 **URL İçerik Çıkarma** - Web sitelerinden otomatik metin çıkarma
- � **YouTube İçerik Üretimi** - Script, thumbnail, SEO optimizasyonu
- 📱 **Çoklu Format Desteği** - Shorts, özet, sosyal medya içerikleri
- ☁️ **Serverless Mimari** - Ölçeklenebilir ve güvenilir altyapı
- 🎯 **SEO Optimizasyonu** - 25-30 hashtag ile kapsamlı SEO paketi

## 🏗️ Teknoloji Stack

### Frontend
- **Next.js 15.4.6** - React framework with Turbopack
- **React 19.1.0** - Modern UI library
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animations
- **Lucide React** - Beautiful icons

### Backend
- **Vercel API Routes** - Serverless functions
- **Hugging Face API** - AI model integration  
- **Python Flask** - Backend API server

### AI & Content
- **meta-llama/Llama-3.1-8B-Instruct** - Content generation
- **Anti-repetition algorithms** - Unique content guarantee
- **Advanced prompt engineering** - Quality content output

## 🚀 Kurulum ve Çalıştırma

### 1. Proje Klonlama
```bash
git clone https://github.com/your-username/cspark.git
cd cspark
```

### 2. Dependencies Kurulumu
```bash
npm install
```

### 3. Environment Variables
```bash
# .env.local dosyasını oluşturun
cp .env.example .env.local

# Hugging Face token'ınızı ekleyin
HF_API_TOKEN=your_hugging_face_token_here
```

### 4. Development Server
```bash
npm run dev
```

Site: http://localhost:3000

## 🌐 Production Deployment

### Vercel Deployment

1. Vercel Dashboard → New Project
2. GitHub repository'sini seçin
3. Environment Variables ekleyin:
   - `HF_API_TOKEN`: Hugging Face API token'ınız
4. Deploy butonuna tıklayın

### Environment Variables Ayarları

Vercel Dashboard → Settings → Environment Variables:

```
HF_API_TOKEN=hf_your_token_here
```

## 📋 API Endpoints

- `GET /api/health` - Sistem sağlık kontrolü
- `POST /api/generate` - AI içerik üretimi  
- `POST /api/extract` - URL'den içerik çıkarma

### API Kullanım Örneği

```bash
# İçerik üretimi
curl -X POST https://www.cspark.app/api/generate \
  -H "Content-Type: application/json" \
  -d '{
    "input": "Yapay zeka hakkında bir metin",
    "task": "summary", 
    "lang": "tr"
  }'

# URL'den içerik çıkarma
curl -X POST https://www.cspark.app/api/extract \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com"}'
```

## 🗂️ Proje Yapısı

```
cspark.app/
├── app/                    # Next.js App Router
│   ├── api/               # Vercel API Routes
│   │   ├── health/        # Health check endpoint
│   │   ├── generate/      # AI content generation
│   │   └── extract/       # URL content extraction
│   ├── landing/           # Landing page
│   ├── app/              # Main app interface
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Home page
├── lib/                   # Utility functions
│   └── api.ts            # API client
├── public/               # Static assets
├── backend/              # Legacy FastAPI backend (optional)
├── docs/                 # Documentation
└── package.json          # Dependencies
```

## 🧪 Test

```bash
# Health check
curl http://localhost:3000/api/health

# API test
npm run test
```

## 🤖 Desteklenen İçerik Türleri

- **summary** - Metin özetleme
- **youtube** - YouTube video senaryosu
- **shorts** - YouTube Shorts/TikTok içeriği
- **social** - Sosyal medya paylaşımları
- **seo** - SEO optimizasyonu

## 🌍 Dil Desteği

- **Türkçe** (tr) - Ana dil
- **İngilizce** (en) - İkincil dil

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için [LICENSE](LICENSE) dosyasına bakın.

## 🤝 Katkıda Bulunma

1. Fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit edin (`git commit -m 'Add amazing feature'`)
4. Push edin (`git push origin feature/amazing-feature`)
5. Pull Request açın

## 📞 İletişim

- **Website:** [www.cspark.app](https://www.cspark.app)
- **GitHub:** [ArdaHFO/cspark.app](https://github.com/ArdaHFO/cspark.app)

---

⭐ Bu projeyi beğendiyseniz yıldız vermeyi unutmayın!
