"""
Creator Transformer Backend - FastAPI Application
Main application file with API endpoints and middleware configuration
"""

import time
from contextlib import asynccontextmanager
from typing import Any, Dict
import uvicorn
from fastapi import FastAPI, HTTPException, Depends, Form, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field, validator
from cachetools import TTLCache
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

# Local imports
from app.config import get_settings, configure_for_environment
from app.extractors import extract_text_from_url, TextExtractionError, get_extraction_info
from app.generator import generate_content
from app.hf import get_hf_client, HuggingFaceError, test_models


# Initialize settings and configuration
configure_for_environment()
settings = get_settings()

# Initialize cache
cache = TTLCache(
    maxsize=settings.cache_max_size,
    ttl=settings.cache_ttl_seconds
)

# Initialize rate limiter
limiter = Limiter(key_func=get_remote_address)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan management"""
    # Startup
    print("🚀 Starting Creator Transformer Backend...")
    
    # Test HF API connection if token is provided
    if settings.hf_api_token:
        try:
            model_status = await test_models()
            print(f"📊 Model Status: {model_status}")
        except Exception as e:
            print(f"⚠️  Warning: Could not test models: {e}")
    else:
        print("⚠️  Warning: No HF API token provided")
    
    # Check extraction methods
    extraction_info = get_extraction_info()
    available_methods = [k for k, v in extraction_info.items() if v]
    print(f"🔧 Available extraction methods: {available_methods}")
    
    yield
    
    # Shutdown
    print("🛑 Shutting down Creator Transformer Backend...")


# Create FastAPI app
app = FastAPI(
    title="Creator Transformer API",
    description="Transform web content into summaries, YouTube scripts, and Shorts scripts using AI",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=False,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

# Add rate limiting
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)


# Pydantic models
class GenerateRequest(BaseModel):
    """Request model for content generation"""
    text: str = Field(..., min_length=10, max_length=50000)
    mode: str = Field(..., regex="^(summary|youtube|shorts)$")
    tone: str = Field(..., regex="^(neutral|energetic|academic)$")
    length: str = Field(..., regex="^(short|medium|long)$")
    lang: str = Field(..., regex="^(auto|en|tr)$")
    
    @validator('text')
    def validate_text(cls, v):
        if not v.strip():
            raise ValueError('Text cannot be empty')
        return v.strip()


class GenerateResponse(BaseModel):
    """Response model for content generation"""
    output: str
    tokens: int
    cached: bool = False


class ExtractResponse(BaseModel):
    """Response model for text extraction"""
    text: str
    url: str
    cached: bool = False


class HealthResponse(BaseModel):
    """Response model for health check"""
    ok: bool
    timestamp: float
    version: str = "1.0.0"
    models_available: Dict[str, bool] = {}


# Utility functions
def get_cache_key(prefix: str, **kwargs) -> str:
    """Generate cache key from parameters"""
    key_parts = [prefix]
    for k, v in sorted(kwargs.items()):
        key_parts.append(f"{k}:{v}")
    return "|".join(key_parts)


async def get_cached_or_generate(cache_key: str, generator_func, *args, **kwargs):
    """Get from cache or generate new content"""
    # Check cache first
    if cache_key in cache:
        result = cache[cache_key]
        if isinstance(result, dict):
            result["cached"] = True
        return result
    
    # Generate new content
    result = await generator_func(*args, **kwargs)
    
    # Cache the result
    cache[cache_key] = result
    
    return result


# API Endpoints
@app.get("/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint"""
    models_status = {}
    
    if settings.hf_api_token:
        try:
            models_status = await test_models()
        except Exception:
            models_status = {"summarization": False, "generation": False}
    
    return HealthResponse(
        ok=True,
        timestamp=time.time(),
        models_available=models_status
    )


@app.post("/extract", response_model=ExtractResponse)
@limiter.limit(settings.extract_rate_limit)
async def extract_text(request: Request, url: str = Form(...)):
    """Extract text from URL"""
    try:
        # Validate URL format
        if not url.strip():
            raise HTTPException(status_code=400, detail="URL cannot be empty")
        
        url = url.strip()
        cache_key = get_cache_key("extract", url=url)
        
        async def _extract():
            text = await extract_text_from_url(url)
            return ExtractResponse(text=text, url=url)
        
        result = await get_cached_or_generate(cache_key, _extract)
        return result
        
    except TextExtractionError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Extraction failed: {str(e)}")


@app.post("/generate", response_model=GenerateResponse)
@limiter.limit(settings.generate_rate_limit)
async def generate_content_endpoint(request: Request, req: GenerateRequest):
    """Generate content from text"""
    try:
        # Check if HF token is available
        if not settings.hf_api_token:
            raise HTTPException(
                status_code=503, 
                detail="AI models not available. Please configure HF_API_TOKEN."
            )
        
        # Validate text length
        if len(req.text) > settings.max_input_chars:
            raise HTTPException(
                status_code=400,
                detail=f"Text too long. Maximum {settings.max_input_chars} characters allowed."
            )
        
        cache_key = get_cache_key(
            "generate",
            text_hash=hash(req.text),
            mode=req.mode,
            tone=req.tone,
            length=req.length,
            lang=req.lang
        )
        
        async def _generate():
            output, tokens = await generate_content(
                req.text, req.mode, req.tone, req.length, req.lang
            )
            return GenerateResponse(output=output, tokens=tokens)
        
        result = await get_cached_or_generate(cache_key, _generate)
        return result
        
    except HuggingFaceError as e:
        raise HTTPException(status_code=503, detail=f"AI service error: {str(e)}")
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Generation failed: {str(e)}")


@app.get("/info")
async def get_info():
    """Get API information and available features"""
    extraction_info = get_extraction_info()
    
    return {
        "version": "1.0.0",
        "features": {
            "text_extraction": True,
            "content_generation": bool(settings.hf_api_token),
            "caching": True,
            "rate_limiting": True,
        },
        "extraction_methods": extraction_info,
        "supported_modes": ["summary", "youtube", "shorts"],
        "supported_tones": ["neutral", "energetic", "academic"],
        "supported_lengths": ["short", "medium", "long"],
        "supported_languages": ["auto", "en", "tr"],
        "limits": {
            "max_input_chars": settings.max_input_chars,
            "extract_rate": settings.extract_rate_limit,
            "generate_rate": settings.generate_rate_limit,
        }
    }


# Error handlers
@app.exception_handler(404)
async def not_found_handler(request: Request, exc):
    return JSONResponse(
        status_code=404,
        content={"detail": "Endpoint not found"}
    )


@app.exception_handler(500)
async def internal_error_handler(request: Request, exc):
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error"}
    )


# Root endpoint
@app.get("/")
async def root():
    """Root endpoint with API information"""
    return {
        "message": "Creator Transformer API",
        "version": "1.0.0",
        "docs": "/docs",
        "health": "/health",
        "info": "/info"
    }


if __name__ == "__main__":
    uvicorn.run(
        "app.main:app",
        host=settings.host,
        port=settings.port,
        reload=settings.debug,
        log_level="info" if not settings.debug else "debug"
    )
