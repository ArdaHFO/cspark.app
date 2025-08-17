"""
Text extraction utilities for web scraping
Multiple fallback methods for robust text extraction
"""

import re
from typing import Optional, Dict, Any
from urllib.parse import urlparse
import asyncio

try:
    import trafilatura
except ImportError:
    trafilatura = None

try:
    from newspaper import Article
except ImportError:
    Article = None

try:
    from readability import Document
    import requests
except ImportError:
    Document = None
    requests = None

try:
    from bs4 import BeautifulSoup
    import httpx
except ImportError:
    BeautifulSoup = None
    httpx = None


class TextExtractionError(Exception):
    """Custom exception for text extraction errors"""
    pass


def is_valid_url(url: str) -> bool:
    """Validate if the provided string is a valid URL"""
    try:
        result = urlparse(url)
        return all([result.scheme, result.netloc])
    except Exception:
        return False


def clean_text(text: str) -> str:
    """Clean extracted text by removing extra whitespace and formatting"""
    if not text:
        return ""
    
    # Remove extra whitespace
    text = re.sub(r'\s+', ' ', text)
    
    # Remove leading/trailing whitespace
    text = text.strip()
    
    # Remove common artifacts
    text = re.sub(r'\n+', '\n', text)
    text = re.sub(r'\t+', ' ', text)
    
    return text


async def extract_with_trafilatura(url: str) -> Optional[str]:
    """Extract text using Trafilatura (primary method)"""
    if not trafilatura:
        return None
    
    try:
        # Download and extract in a thread pool to avoid blocking
        loop = asyncio.get_event_loop()
        
        def _extract():
            downloaded = trafilatura.fetch_url(url)
            if downloaded:
                return trafilatura.extract(downloaded, include_comments=False)
            return None
        
        text = await loop.run_in_executor(None, _extract)
        return clean_text(text) if text else None
        
    except Exception as e:
        print(f"Trafilatura extraction failed: {e}")
        return None


async def extract_with_newspaper(url: str) -> Optional[str]:
    """Extract text using Newspaper3k (fallback method)"""
    if not Article:
        return None
    
    try:
        loop = asyncio.get_event_loop()
        
        def _extract():
            article = Article(url)
            article.download()
            article.parse()
            return article.text
        
        text = await loop.run_in_executor(None, _extract)
        return clean_text(text) if text else None
        
    except Exception as e:
        print(f"Newspaper extraction failed: {e}")
        return None


async def extract_with_readability(url: str) -> Optional[str]:
    """Extract text using Readability (fallback method)"""
    if not Document or not requests:
        return None
    
    try:
        loop = asyncio.get_event_loop()
        
        def _extract():
            response = requests.get(url, timeout=10)
            response.raise_for_status()
            doc = Document(response.content)
            return doc.summary()
        
        html = await loop.run_in_executor(None, _extract)
        
        if html and BeautifulSoup:
            soup = BeautifulSoup(html, 'html.parser')
            text = soup.get_text()
            return clean_text(text)
        
        return None
        
    except Exception as e:
        print(f"Readability extraction failed: {e}")
        return None


async def extract_with_beautifulsoup(url: str) -> Optional[str]:
    """Extract text using BeautifulSoup (last resort)"""
    if not BeautifulSoup or not httpx:
        return None
    
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(url)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # Remove script and style elements
            for script in soup(["script", "style"]):
                script.decompose()
            
            # Get text
            text = soup.get_text()
            return clean_text(text)
            
    except Exception as e:
        print(f"BeautifulSoup extraction failed: {e}")
        return None


async def extract_text_from_url(url: str) -> str:
    """
    Extract text from URL using multiple fallback methods
    
    Args:
        url: URL to extract text from
        
    Returns:
        Extracted and cleaned text
        
    Raises:
        TextExtractionError: If no method can extract text
    """
    if not is_valid_url(url):
        raise TextExtractionError("Invalid URL provided")
    
    # List of extraction methods in order of preference
    extractors = [
        ("Trafilatura", extract_with_trafilatura),
        ("Newspaper3k", extract_with_newspaper),
        ("Readability", extract_with_readability),
        ("BeautifulSoup", extract_with_beautifulsoup),
    ]
    
    last_error = None
    
    for extractor_name, extractor_func in extractors:
        try:
            text = await extractor_func(url)
            if text and len(text.strip()) > 50:  # Minimum viable text length
                print(f"Successfully extracted text using {extractor_name}")
                return text
        except Exception as e:
            last_error = e
            print(f"{extractor_name} failed: {e}")
            continue
    
    # If all methods failed
    error_msg = f"Failed to extract text from {url}"
    if last_error:
        error_msg += f". Last error: {last_error}"
    
    raise TextExtractionError(error_msg)


def get_extraction_info() -> Dict[str, Any]:
    """Get information about available extraction methods"""
    return {
        "trafilatura": trafilatura is not None,
        "newspaper3k": Article is not None,
        "readability": Document is not None and requests is not None,
        "beautifulsoup": BeautifulSoup is not None and httpx is not None,
    }
