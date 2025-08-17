"""
Configuration management for Creator Transformer backend
Handles environment variables and application settings
"""

import os
from typing import List, Optional
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application settings loaded from environment variables"""
    
    # Hugging Face API
    hf_api_token: str = ""
    hf_api_base: str = "https://api-inference.huggingface.co/models"
    
    # AI Models
    sum_model: str = "facebook/bart-large-cnn"
    gen_model: str = "mistralai/Mistral-7B-Instruct-v0.2"
    
    # API Configuration
    max_input_chars: int = 50000
    max_chunk_size: int = 4000
    
    # CORS
    allowed_origins: List[str] = [
        "http://localhost:3000",
        "https://localhost:3000",
    ]
    
    # Rate limiting
    extract_rate_limit: str = "10/minute"
    generate_rate_limit: str = "5/minute"
    
    # Cache settings
    cache_ttl_seconds: int = 24 * 60 * 60  # 24 hours
    cache_max_size: int = 1000
    
    # Server settings
    host: str = "0.0.0.0"
    port: int = 8000
    debug: bool = False
    
    class Config:
        env_file = ".env"
        case_sensitive = False


# Global settings instance
settings = Settings()


def get_settings() -> Settings:
    """Get application settings"""
    return settings


def validate_settings() -> None:
    """Validate required settings"""
    if not settings.hf_api_token:
        raise ValueError(
            "HF_API_TOKEN environment variable is required. "
            "Get your token from https://huggingface.co/settings/tokens"
        )


# Environment-specific configurations
def configure_for_environment():
    """Configure settings based on environment"""
    env = os.getenv("ENVIRONMENT", "development").lower()
    
    if env == "production":
        settings.debug = False
        # Add production-specific origins if needed
        prod_origins = os.getenv("PRODUCTION_ORIGINS", "").split(",")
        if prod_origins and prod_origins != [""]:
            settings.allowed_origins.extend(prod_origins)
    
    elif env == "development":
        settings.debug = True
        settings.allowed_origins.extend([
            "http://localhost:3000",
            "http://127.0.0.1:3000",
        ])
    
    # Validate settings after configuration
    if settings.hf_api_token:  # Only validate if token is provided
        validate_settings()
