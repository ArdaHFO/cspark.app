# Architecture Documentation

## System Overview

Creator Transformer is a full-stack application that transforms web content into various formats using AI. The system follows a clean separation of concerns with a React frontend and Python backend.

## High-Level Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│                 │    │                 │    │                 │
│   Frontend      │    │    Backend      │    │  Hugging Face   │
│   (Next.js)     │───▶│   (FastAPI)     │───▶│     API         │
│                 │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │
         │                       │
         ▼                       ▼
┌─────────────────┐    ┌─────────────────┐
│                 │    │                 │
│    Vercel       │    │   Railway/      │
│   (Hosting)     │    │    Render       │
│                 │    │   (Hosting)     │
└─────────────────┘    └─────────────────┘
```

## Component Details

### Frontend (Next.js + TypeScript)
- **Location**: `/frontend`
- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS
- **State Management**: React built-in state
- **API Communication**: Custom fetch wrapper

#### Key Components:
- `app/page.tsx` - Main UI page
- `lib/api.ts` - API communication layer
- `components/` - Reusable UI components

### Backend (FastAPI + Python)
- **Location**: `/backend`
- **Framework**: FastAPI with async/await
- **Text Extraction**: Trafilatura, Newspaper3k, Readability
- **AI Integration**: Hugging Face Inference API
- **Caching**: In-memory with TTL
- **Rate Limiting**: IP-based throttling

#### Key Modules:
- `app/main.py` - FastAPI application entry point
- `app/hf.py` - Hugging Face API client
- `app/config.py` - Configuration management
- `app/extractors.py` - Text extraction utilities

## Data Flow

### Text Extraction Flow
1. User enters URL in frontend
2. Frontend sends POST to `/extract`
3. Backend scrapes URL using Trafilatura
4. Fallback to Newspaper3k if Trafilatura fails
5. Return clean text to frontend

### Content Generation Flow
1. User enters text and selects options
2. Frontend sends POST to `/generate`
3. Backend processes request:
   - Auto-detect language if needed
   - Chunk text if too long
   - Generate appropriate prompt
   - Call Hugging Face API
   - Return generated content

## AI Models

### Summarization Model
- **Model**: facebook/bart-large-cnn
- **Use Case**: Creating bullet-point summaries
- **Max Input**: 1024 tokens
- **Strategy**: Chunk long text, summarize chunks, merge results

### Generation Model
- **Model**: mistralai/Mistral-7B-Instruct-v0.2
- **Use Case**: YouTube scripts, Shorts scripts
- **Max Input**: 4096 tokens
- **Strategy**: Template-based prompts with context

## Security & Performance

### Rate Limiting
- `/extract`: 10 requests per minute per IP
- `/generate`: 5 requests per minute per IP
- Uses sliding window algorithm

### Caching Strategy
- Cache key: URL + parameters hash
- TTL: 24 hours
- Storage: In-memory (suitable for single instance)

### CORS Configuration
- Configurable allowed origins
- Supports development and production domains
- Credentials not included for security

## Deployment Strategy

### Frontend Deployment (Vercel)
- Automatic builds on git push
- Environment variables injected at build time
- CDN distribution for global performance
- Automatic SSL/TLS certificates

### Backend Deployment (Railway/Render)
- Docker containerization
- Environment variable management
- Automatic scaling based on load
- Health check endpoints for monitoring

## Environment Configuration

### Development
- Frontend: `http://localhost:3000`
- Backend: `http://localhost:8000`
- Hot reload enabled for both

### Production
- Frontend: Custom domain via Vercel
- Backend: Railway/Render provided domain
- HTTPS enforced
- Environment separation

## Monitoring & Logging

### Health Checks
- GET `/health` endpoint for backend status
- Frontend build status via Vercel dashboard
- Model availability through HF API

### Error Handling
- Graceful degradation for model failures
- User-friendly error messages
- Fallback text extraction methods
- Request validation and sanitization

## Future Enhancements

### Potential Improvements
1. **Database Integration**: PostgreSQL for persistent caching
2. **User Authentication**: Account management and usage tracking
3. **Batch Processing**: Multiple URL processing
4. **Custom Models**: Fine-tuned models for specific use cases
5. **Analytics**: Usage statistics and performance metrics
6. **Websockets**: Real-time generation progress
7. **CDN Integration**: Asset optimization and caching
