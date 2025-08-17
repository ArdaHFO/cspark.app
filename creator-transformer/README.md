# Creator Transformer

A powerful content transformation tool that extracts text from URLs and generates summaries, YouTube scripts, and YouTube Shorts scripts using AI. Built as a modern monorepo with Next.js frontend and FastAPI backend.

## Features

- **Text Extraction**: Extract clean text from any URL using advanced web scraping
- **AI-Powered Content Generation**:
  - Summaries with bullet points and paragraphs
  - YouTube video scripts with structured sections
  - YouTube Shorts scripts optimized for 30-60 seconds
- **Customizable Options**:
  - Multiple tones: neutral, energetic, academic
  - Various lengths: short, medium, long
  - Language support: auto-detect, Turkish, English
- **Modern UI**: Clean, responsive interface built with Next.js and Tailwind CSS
- **Fast API**: High-performance backend with rate limiting and caching

## Tech Stack

### Frontend
- **Next.js 14** with TypeScript
- **Tailwind CSS** for styling
- **Vercel** for deployment

### Backend
- **FastAPI** with Python
- **Hugging Face Inference API** for AI models
- **Trafilatura** for text extraction
- **Railway/Render** for deployment

### AI Models
- **Summarization**: facebook/bart-large-cnn
- **Script Generation**: mistralai/Mistral-7B-Instruct-v0.2

## Quick Start

### Prerequisites
- Node.js 18+ and npm
- Python 3.9+
- Hugging Face API token

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

The frontend will run on http://localhost:3000

### Backend Setup
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

The backend will run on http://localhost:8000

## Environment Variables

### Frontend (.env.local)
| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_BASE` | Backend API URL | `http://localhost:8000` |

### Backend (.env)
| Variable | Description | Required |
|----------|-------------|----------|
| `HF_API_TOKEN` | Hugging Face API token | Yes |
| `ALLOWED_ORIGINS` | CORS allowed origins | No |
| `MAX_INPUT_CHARS` | Max input text length | No |
| `SUM_MODEL` | Summarization model | No |
| `GEN_MODEL` | Generation model | No |

## API Endpoints

### GET /health
Health check endpoint
```json
{
  "ok": true
}
```

### POST /extract
Extract text from URL
```bash
curl -X POST "http://localhost:8000/extract" \
  -F "url=https://example.com"
```

### POST /generate
Generate content from text
```bash
curl -X POST "http://localhost:8000/generate" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Your input text here",
    "mode": "summary",
    "tone": "neutral",
    "length": "medium",
    "lang": "auto"
  }'
```

## Deployment

### Frontend (Vercel)
1. Connect your GitHub repository to Vercel
2. Set environment variable: `NEXT_PUBLIC_API_BASE=https://your-backend-url.railway.app`
3. Deploy automatically on git push

### Backend (Railway)
1. Connect your GitHub repository to Railway
2. Set environment variables:
   - `HF_API_TOKEN=your_hugging_face_token`
   - `ALLOWED_ORIGINS=https://your-frontend-url.vercel.app`
3. Deploy automatically on git push

## Development

### Project Structure
```
creator-transformer/
├── frontend/           # Next.js application
├── backend/           # FastAPI application
├── .github/           # GitHub workflows
├── docs/              # Documentation
└── README.md          # This file
```

### Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Support

For issues and questions, please open a GitHub issue or contact the maintainers.
