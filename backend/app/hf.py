"""
Hugging Face API client for AI model inference
Handles communication with Hugging Face Inference API
"""

import asyncio
import json
from typing import Any, Dict, Optional, Union
import httpx
from app.config import get_settings


class HuggingFaceError(Exception):
    """Custom exception for Hugging Face API errors"""
    pass


class HuggingFaceClient:
    """Async client for Hugging Face Inference API"""
    
    def __init__(self):
        self.settings = get_settings()
        self.base_url = self.settings.hf_api_base
        self.headers = {
            "Authorization": f"Bearer {self.settings.hf_api_token}",
            "Content-Type": "application/json",
        }
        self.timeout = httpx.Timeout(60.0)  # 60 seconds timeout
    
    async def infer(
        self, 
        model: str, 
        payload: Dict[str, Any],
        max_retries: int = 3,
        retry_delay: float = 1.0
    ) -> Dict[str, Any]:
        """
        Make inference request to Hugging Face API
        
        Args:
            model: Model name (e.g., "facebook/bart-large-cnn")
            payload: Request payload for the model
            max_retries: Maximum number of retries on failure
            retry_delay: Delay between retries in seconds
            
        Returns:
            Model response as dictionary
            
        Raises:
            HuggingFaceError: If API request fails after retries
        """
        url = f"{self.base_url}/{model}"
        
        for attempt in range(max_retries + 1):
            try:
                async with httpx.AsyncClient(timeout=self.timeout) as client:
                    response = await client.post(
                        url,
                        headers=self.headers,
                        json=payload
                    )
                    
                    if response.status_code == 200:
                        return response.json()
                    
                    elif response.status_code == 503:
                        # Model is loading, wait and retry
                        error_data = response.json()
                        if "loading" in str(error_data).lower():
                            wait_time = retry_delay * (2 ** attempt)  # Exponential backoff
                            await asyncio.sleep(wait_time)
                            continue
                    
                    elif response.status_code == 429:
                        # Rate limited, wait and retry
                        wait_time = retry_delay * (2 ** attempt)
                        await asyncio.sleep(wait_time)
                        continue
                    
                    # Other error codes
                    error_data = response.json() if response.content else {}
                    error_message = error_data.get("error", f"HTTP {response.status_code}")
                    raise HuggingFaceError(f"API request failed: {error_message}")
                    
            except httpx.TimeoutException:
                if attempt < max_retries:
                    await asyncio.sleep(retry_delay * (2 ** attempt))
                    continue
                raise HuggingFaceError("Request timed out after multiple attempts")
            
            except httpx.RequestError as e:
                if attempt < max_retries:
                    await asyncio.sleep(retry_delay * (2 ** attempt))
                    continue
                raise HuggingFaceError(f"Network error: {str(e)}")
        
        raise HuggingFaceError("Max retries exceeded")
    
    async def summarize(
        self, 
        text: str, 
        max_length: Optional[int] = None,
        min_length: Optional[int] = None
    ) -> str:
        """
        Summarize text using the configured summarization model
        
        Args:
            text: Input text to summarize
            max_length: Maximum length of summary
            min_length: Minimum length of summary
            
        Returns:
            Generated summary text
        """
        payload = {"inputs": text}
        
        if max_length:
            payload["parameters"] = payload.get("parameters", {})
            payload["parameters"]["max_length"] = max_length
        
        if min_length:
            payload["parameters"] = payload.get("parameters", {})
            payload["parameters"]["min_length"] = min_length
        
        try:
            response = await self.infer(self.settings.sum_model, payload)
            
            if isinstance(response, list) and len(response) > 0:
                return response[0].get("summary_text", "")
            
            return response.get("summary_text", "")
            
        except Exception as e:
            raise HuggingFaceError(f"Summarization failed: {str(e)}")
    
    async def generate_text(
        self, 
        prompt: str, 
        max_new_tokens: int = 512,
        temperature: float = 0.7,
        top_p: float = 0.9
    ) -> str:
        """
        Generate text using the configured generation model
        
        Args:
            prompt: Input prompt for text generation
            max_new_tokens: Maximum number of tokens to generate
            temperature: Sampling temperature (0.0 to 1.0)
            top_p: Nucleus sampling parameter
            
        Returns:
            Generated text
        """
        payload = {
            "inputs": prompt,
            "parameters": {
                "max_new_tokens": max_new_tokens,
                "temperature": temperature,
                "top_p": top_p,
                "do_sample": True,
                "return_full_text": False,
            }
        }
        
        try:
            response = await self.infer(self.settings.gen_model, payload)
            
            if isinstance(response, list) and len(response) > 0:
                return response[0].get("generated_text", "").strip()
            
            return response.get("generated_text", "").strip()
            
        except Exception as e:
            raise HuggingFaceError(f"Text generation failed: {str(e)}")


# Global client instance
_hf_client: Optional[HuggingFaceClient] = None


def get_hf_client() -> HuggingFaceClient:
    """Get the global Hugging Face client instance"""
    global _hf_client
    if _hf_client is None:
        _hf_client = HuggingFaceClient()
    return _hf_client


async def test_models() -> Dict[str, bool]:
    """Test if both AI models are accessible"""
    client = get_hf_client()
    results = {}
    
    # Test summarization model
    try:
        await client.summarize("This is a test sentence for model availability.")
        results["summarization"] = True
    except Exception:
        results["summarization"] = False
    
    # Test generation model
    try:
        await client.generate_text("Test prompt", max_new_tokens=10)
        results["generation"] = True
    except Exception:
        results["generation"] = False
    
    return results
