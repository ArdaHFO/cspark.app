"""
Content generation utilities and prompt templates
Handles AI-powered content generation with different modes
"""

import re
from typing import List, Tuple, Dict, Any
from app.hf import get_hf_client, HuggingFaceError
from app.config import get_settings

try:
    from langdetect import detect
except ImportError:
    detect = None


def detect_language(text: str) -> str:
    """Detect language of input text"""
    if not detect or not text.strip():
        return "en"  # Default to English
    
    try:
        detected = detect(text[:1000])  # Use first 1000 chars for detection
        return detected if detected in ["en", "tr"] else "en"
    except Exception:
        return "en"


def chunk_text(text: str, max_chunk_size: int = 4000) -> List[str]:
    """
    Split text into chunks for processing
    Tries to split on paragraphs, then sentences, then by characters
    """
    if len(text) <= max_chunk_size:
        return [text]
    
    chunks = []
    
    # First try to split by paragraphs
    paragraphs = text.split('\n\n')
    current_chunk = ""
    
    for paragraph in paragraphs:
        if len(current_chunk + paragraph) <= max_chunk_size:
            current_chunk += paragraph + "\n\n"
        else:
            if current_chunk:
                chunks.append(current_chunk.strip())
                current_chunk = paragraph + "\n\n"
            else:
                # Paragraph is too long, split by sentences
                sentences = re.split(r'[.!?]+', paragraph)
                temp_chunk = ""
                
                for sentence in sentences:
                    if len(temp_chunk + sentence) <= max_chunk_size:
                        temp_chunk += sentence + ". "
                    else:
                        if temp_chunk:
                            chunks.append(temp_chunk.strip())
                            temp_chunk = sentence + ". "
                        else:
                            # Sentence is too long, split by characters
                            for i in range(0, len(sentence), max_chunk_size):
                                chunks.append(sentence[i:i + max_chunk_size])
                
                if temp_chunk:
                    current_chunk = temp_chunk + "\n\n"
    
    if current_chunk:
        chunks.append(current_chunk.strip())
    
    return chunks


def get_summary_prompt(text: str, tone: str, length: str, lang: str) -> str:
    """Generate prompt for summarization"""
    
    # Tone instructions
    tone_instructions = {
        "neutral": "in a clear and objective manner",
        "energetic": "in an engaging and enthusiastic tone",
        "academic": "in a formal and scholarly manner"
    }
    
    # Length instructions
    length_instructions = {
        "short": "Create a concise summary with 3-5 bullet points and a brief paragraph.",
        "medium": "Create a comprehensive summary with 5-8 bullet points and 1-2 paragraphs.",
        "long": "Create a detailed summary with 8-12 bullet points and 2-3 paragraphs."
    }
    
    # Language instructions
    lang_instructions = {
        "en": "Respond in English.",
        "tr": "Türkçe olarak yanıtlayın.",
        "auto": "Respond in the same language as the input text."
    }
    
    prompt = f"""
Please summarize the following text {tone_instructions.get(tone, 'clearly')}.

{length_instructions.get(length, 'Create a summary')}

{lang_instructions.get(lang, 'Respond in English.')}

Format your response as:
• Bullet point 1
• Bullet point 2
• Bullet point 3
[Additional bullet points as needed]

Summary paragraph providing key insights and main takeaways.

Text to summarize:
{text}

Summary:"""
    
    return prompt.strip()


def get_youtube_prompt(text: str, tone: str, length: str, lang: str) -> str:
    """Generate prompt for YouTube script creation"""
    
    # Tone instructions
    tone_instructions = {
        "neutral": "professional and informative",
        "energetic": "enthusiastic and engaging",
        "academic": "educational and authoritative"
    }
    
    # Length instructions
    length_instructions = {
        "short": "a 5-7 minute video script",
        "medium": "an 8-12 minute video script", 
        "long": "a 12-18 minute video script"
    }
    
    # Language instructions
    lang_instructions = {
        "en": "Write the script in English.",
        "tr": "Senaryoyu Türkçe yazın.",
        "auto": "Write the script in the same language as the input text."
    }
    
    prompt = f"""
Create {length_instructions.get(length, 'a video script')} based on the following content. 
Use a {tone_instructions.get(tone, 'professional')} tone throughout.

{lang_instructions.get(lang, 'Write the script in English.')}

Structure the script with these sections:
1. HOOK (0-15 seconds): Attention-grabbing opening
2. INTRO (15-45 seconds): Brief overview and what viewers will learn
3. MAIN CONTENT (Sections 1-3): Core information broken into digestible segments
4. OUTRO & CTA (Last 30 seconds): Summary and call-to-action
5. B-ROLL SUGGESTIONS: Visual elements to accompany the script

Include natural transitions, engagement cues, and speaking directions in [brackets].

Source content:
{text}

YouTube Script:"""
    
    return prompt.strip()


def get_shorts_prompt(text: str, tone: str, length: str, lang: str) -> str:
    """Generate prompt for YouTube Shorts script creation"""
    
    # Tone instructions
    tone_instructions = {
        "neutral": "clear and direct",
        "energetic": "exciting and punchy",
        "academic": "informative yet concise"
    }
    
    # Language instructions
    lang_instructions = {
        "en": "Write the script in English.",
        "tr": "Senaryoyu Türkçe yazın.",
        "auto": "Write the script in the same language as the input text."
    }
    
    prompt = f"""
Create a YouTube Shorts script (30-60 seconds) based on the following content.
Use a {tone_instructions.get(tone, 'engaging')} tone that's perfect for short-form content.

{lang_instructions.get(lang, 'Write the script in English.')}

Structure:
• HOOK (0-3 seconds): Immediate attention grabber
• 3 KEY POINTS (3-4 seconds each): Main insights in punchy format
• CTA (Last 5 seconds): Strong call-to-action

Requirements:
- Total length: 30-60 seconds when spoken
- Each point should be impactful and memorable
- Use numbers, statistics, or surprising facts when possible
- Include visual cues in [brackets]
- End with engaging question or action

Source content:
{text}

YouTube Shorts Script:"""
    
    return prompt.strip()


async def generate_summary(text: str, tone: str, length: str, lang: str) -> Tuple[str, int]:
    """Generate summary using AI"""
    settings = get_settings()
    
    # Auto-detect language if needed
    if lang == "auto":
        lang = detect_language(text)
    
    # Check if text needs chunking
    if len(text) > settings.max_chunk_size:
        chunks = chunk_text(text, settings.max_chunk_size)
        summaries = []
        total_tokens = 0
        
        hf_client = get_hf_client()
        
        # Summarize each chunk
        for chunk in chunks:
            try:
                chunk_summary = await hf_client.summarize(
                    chunk, 
                    max_length=150,
                    min_length=30
                )
                summaries.append(chunk_summary)
                total_tokens += len(chunk.split()) // 4  # Rough token estimate
            except HuggingFaceError:
                # If HF summarization fails, use generation model
                prompt = get_summary_prompt(chunk, tone, "short", lang)
                chunk_summary = await hf_client.generate_text(
                    prompt, 
                    max_new_tokens=200,
                    temperature=0.3
                )
                summaries.append(chunk_summary)
                total_tokens += len(prompt.split()) // 4
        
        # Combine summaries and create final summary
        combined_text = "\n\n".join(summaries)
        final_prompt = get_summary_prompt(combined_text, tone, length, lang)
        
        final_summary = await hf_client.generate_text(
            final_prompt,
            max_new_tokens=400,
            temperature=0.3
        )
        
        return final_summary, total_tokens
    
    else:
        # Direct summarization for shorter texts
        hf_client = get_hf_client()
        prompt = get_summary_prompt(text, tone, length, lang)
        
        summary = await hf_client.generate_text(
            prompt,
            max_new_tokens=400,
            temperature=0.3
        )
        
        tokens = len(prompt.split()) // 4  # Rough estimate
        return summary, tokens


async def generate_youtube_script(text: str, tone: str, length: str, lang: str) -> Tuple[str, int]:
    """Generate YouTube script using AI"""
    settings = get_settings()
    
    # Auto-detect language if needed
    if lang == "auto":
        lang = detect_language(text)
    
    hf_client = get_hf_client()
    
    # Chunk if necessary
    if len(text) > settings.max_chunk_size:
        chunks = chunk_text(text, settings.max_chunk_size)
        # For scripts, we'll summarize chunks first, then create script
        summaries = []
        
        for chunk in chunks:
            chunk_summary = await hf_client.summarize(chunk, max_length=100)
            summaries.append(chunk_summary)
        
        text = "\n\n".join(summaries)
    
    prompt = get_youtube_prompt(text, tone, length, lang)
    
    script = await hf_client.generate_text(
        prompt,
        max_new_tokens=800,
        temperature=0.7
    )
    
    tokens = len(prompt.split()) // 4
    return script, tokens


async def generate_shorts_script(text: str, tone: str, length: str, lang: str) -> Tuple[str, int]:
    """Generate YouTube Shorts script using AI"""
    settings = get_settings()
    
    # Auto-detect language if needed
    if lang == "auto":
        lang = detect_language(text)
    
    hf_client = get_hf_client()
    
    # Chunk if necessary and summarize
    if len(text) > settings.max_chunk_size:
        chunks = chunk_text(text, settings.max_chunk_size)
        summaries = []
        
        for chunk in chunks:
            chunk_summary = await hf_client.summarize(chunk, max_length=80)
            summaries.append(chunk_summary)
        
        text = "\n\n".join(summaries)
    
    prompt = get_shorts_prompt(text, tone, length, lang)
    
    script = await hf_client.generate_text(
        prompt,
        max_new_tokens=300,
        temperature=0.8
    )
    
    tokens = len(prompt.split()) // 4
    return script, tokens


async def generate_content(
    text: str, 
    mode: str, 
    tone: str, 
    length: str, 
    lang: str
) -> Tuple[str, int]:
    """
    Main content generation function
    
    Args:
        text: Input text
        mode: Generation mode (summary, youtube, shorts)
        tone: Content tone (neutral, energetic, academic)
        length: Content length (short, medium, long)
        lang: Language (auto, en, tr)
        
    Returns:
        Tuple of (generated_content, estimated_tokens)
    """
    if mode == "summary":
        return await generate_summary(text, tone, length, lang)
    elif mode == "youtube":
        return await generate_youtube_script(text, tone, length, lang)
    elif mode == "shorts":
        return await generate_shorts_script(text, tone, length, lang)
    else:
        raise ValueError(f"Unsupported mode: {mode}")
