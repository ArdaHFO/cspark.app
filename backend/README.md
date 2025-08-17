# Creator Transformer

AI-powered content generator that creates summaries, YouTube scripts, and Shorts scripts from text input.

## Features

- **Summary Generation**: Create concise summaries of any text
- **YouTube Script**: Generate engaging video scripts for YouTube
- **Shorts Script**: Create punchy scripts for short-form content
- **Multi-language Support**: Turkish and English support with auto-detection
- **Customizable Options**: Choose tone (formal, casual, energetic) and length (short, medium, long)

## API Endpoints

- `GET /health` - Health check
- `POST /generate` - Generate content

### Generate Content

```bash
curl -X POST "https://your-space.hf.space/generate" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Your input text here",
    "task": "summary",
    "tone": "casual",
    "length": "medium",
    "lang": "auto"
  }'
```

## Deployment

This app is designed to run on Hugging Face Spaces with the following configuration:

1. **SDK**: `fastapi`
2. **Python Version**: `3.10`
3. **App File**: `app.py`
4. **Requirements**: See `requirements.txt`

### Environment Variables

- `HF_API_TOKEN`: Your Hugging Face API token (set in Space secrets)

## Usage with Frontend

This backend is designed to work with a Next.js frontend deployed on Vercel. The frontend should set:

```javascript
NEXT_PUBLIC_API_BASE=https://your-space.hf.space
```

## Models Used

- **Text Generation**: `mistralai/Mistral-7B-Instruct-v0.3`
- Supports Turkish and English content generation
- Optimized prompts for different content types

## License

MIT License
