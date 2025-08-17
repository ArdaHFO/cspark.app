# Vercel Deployment Guide

Bu proje Vercel API routes kullanarak ücretsiz hosting sağlar.

## Environment Variables

Vercel dashboard'ında aşağıdaki environment variable'ı ekleyin:

```
HF_API_TOKEN=your_hugging_face_token_here
```

### Adımlar:

1. [Vercel Dashboard](https://vercel.com/dashboard) → Projeniz → Settings → Environment Variables
2. `HF_API_TOKEN` adında yeni variable ekleyin  
3. Değer olarak Hugging Face token'ınızı girin
4. Production, Preview ve Development environment'larında kullanılacak şekilde işaretleyin
5. Redeploy yapın

## Hugging Face Token

Token almanız için:

1. [Hugging Face](https://huggingface.co/settings/tokens) hesabınıza giriş yapın
2. "New token" butonuna tıklayın
3. "Read" yetkisi ile token oluşturun
4. Token'ı kopyalayın ve Vercel'e ekleyin

## API Endpoints

Projede aşağıdaki API route'ları bulunur:

- `GET /api/health` - Sistem sağlık kontrolü
- `POST /api/generate` - AI içerik üretimi
- `POST /api/extract` - URL'den içerik çıkarma

## Test

Local test için:

```bash
# Health check
curl http://localhost:3000/api/health

# Generate content  
curl -X POST http://localhost:3000/api/generate \
  -H "Content-Type: application/json" \
  -d '{"input": "Test metni", "task": "summary", "lang": "tr"}'
```
