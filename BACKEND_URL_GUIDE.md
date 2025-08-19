# Backend URL Çözümleri

Bu projede backend URL'ini nasıl bulacağınıza dair farklı seçenekler:

## 1. 🏠 Local Development (Geliştirme)
```bash
# Backend'i local'de çalıştırın
cd backend
source venv/bin/activate  # veya simple_venv/bin/activate
uvicorn app.main:app --reload --port 8000

# Backend URL: http://localhost:8000
```

## 2. ☁️ Cloud Deployment Seçenekleri

### A. Hugging Face Spaces (Backend README'ye göre)
- Hugging Face Spaces'te FastAPI uygulaması deploy edin
- URL formatı: `https://your-space-name.hf.space`
- Örnek: `https://creator-transformer.hf.space`

### B. Railway Deployment
1. Railway.app'e gidin
2. GitHub repository'nizi bağlayın
3. Environment variables ekleyin:
   - `HF_API_TOKEN=your_token_here`
   - `ALLOWED_ORIGINS=https://your-frontend-url.vercel.app`
4. URL formatı: `https://your-app-name.railway.app`

### C. Render Deployment
1. Render.com'a gidin
2. GitHub repository'nizi bağlayın
3. Web Service olarak deploy edin
4. Environment variables ekleyin
5. URL formatı: `https://your-app-name.onrender.com`

### D. Vercel (Serverless Functions)
- Şu an backend'i Vercel Functions olarak da kullanabilirsiniz
- `app/api/` klasöründeki route'lar zaten Vercel'de çalışır
- Bu durumda BACKEND_URL'e ihtiyaç olmayabilir

## 3. 🔧 Environment Variables Ayarları

### Local Development (.env dosyaları)
```bash
# backend/.env
HF_API_TOKEN=your_hugging_face_token_here
ALLOWED_ORIGINS=http://localhost:3000

# .env.local (frontend için)
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

### Production (.env dosyaları)
```bash
# Production backend
HF_API_TOKEN=your_hugging_face_token_here
ALLOWED_ORIGINS=https://your-frontend.vercel.app
ENVIRONMENT=production

# Production frontend (Vercel'de set edilecek)
NEXT_PUBLIC_API_BASE_URL=https://your-backend.railway.app
BACKEND_URL=https://your-backend.railway.app  # proxy route'lar için
```

## 4. 🚀 Hızlı Çözüm

En kolay yol şu an mevcut local setup'ı kullanmak:

```bash
# Terminal 1: Backend'i başlat
cd backend
source simple_venv/bin/activate
uvicorn app.main:app --reload --port 8000

# Terminal 2: Frontend'i başlat  
npm run dev

# Backend URL: http://localhost:8000
```

## 5. 📱 Production İçin Önerilen Akış

1. **Backend'i Railway'e deploy edin**
2. **Frontend environment variable'ını güncelleyin**
3. **Proxy route'ları backend URL'e yönlendirin**

Hangi seçeneği tercih edersiniz?
