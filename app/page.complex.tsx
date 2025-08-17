'use client';

import { useState } from 'react';
import { extractText, generateContent, downloadAsFile, copyToClipboard, type GenerateRequest } from '@/lib/api';

/**
 * Main page component for Creator Transformer
 * Provides UI for text extraction and content generation
 */
export default function Home() {
  // Form state
  const [url, setUrl] = useState('');
  const [text, setText] = useState('');
  const [mode, setMode] = useState<'summary' | 'youtube' | 'shorts'>('summary');
  const [tone, setTone] = useState<'casual' | 'professional' | 'energetic' | 'academic'>('casual');
  const [length, setLength] = useState<'short' | 'medium' | 'long'>('medium');
  const [lang, setLang] = useState<'tr' | 'en'>('tr');

  // UI state
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);

  /**
   * Extract text from URL
   */
  const handleExtractText = async () => {
    if (!url.trim()) {
      setError('Please enter a valid URL');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await extractText(url.trim());
      setText(response.text);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to extract text');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Generate content using AI
   */
  const handleGenerate = async (selectedMode: typeof mode) => {
    if (!text.trim()) {
      setError('Please enter some text or extract it from a URL first');
      return;
    }

    setLoading(true);
    setError('');
    setResult('');

    const request: GenerateRequest = {
      input: text.trim(),
      task: selectedMode,
      tone,
      length,
      lang,
    };

    try {
      const response = await generateContent(request);
      setResult(response.result);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate content');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Copy result to clipboard
   */
  const handleCopy = async () => {
    try {
      await copyToClipboard(result);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      setError('Failed to copy to clipboard');
    }
  };

  /**
   * Download result as text file
   */
  const handleDownload = () => {
    const filename = `${mode}-${Date.now()}.txt`;
    downloadAsFile(result, filename);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Creator Transformer
          </h1>
          <p className="text-lg text-gray-600">
            Transform web content into summaries, YouTube scripts, and Shorts scripts using AI
          </p>
        </div>

        {/* Main Form */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          {/* URL Input Section */}
          <div className="mb-6">
            <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-2">
              URL (optional)
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                id="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com/article"
                className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                disabled={loading}
              />
              <button
                onClick={handleExtractText}
                disabled={loading || !url.trim()}
                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Extract Text
              </button>
            </div>
          </div>

          {/* Text Input Section */}
          <div className="mb-6">
            <label htmlFor="text" className="block text-sm font-medium text-gray-700 mb-2">
              Text Content
            </label>
            <textarea
              id="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter your text here or extract it from a URL above..."
              rows={8}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              disabled={loading}
            />
          </div>

          {/* Options Section */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {/* Tone */}
            <div>
              <label htmlFor="tone" className="block text-sm font-medium text-gray-700 mb-2">
                Tone
              </label>
              <select
                id="tone"
                value={tone}
                onChange={(e) => setTone(e.target.value as 'casual' | 'professional' | 'energetic' | 'academic')}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                disabled={loading}
              >
                <option value="casual">Casual</option>
                <option value="professional">Professional</option>
                <option value="energetic">Energetic</option>
                <option value="academic">Academic</option>
              </select>
            </div>

            {/* Length */}
            <div>
              <label htmlFor="length" className="block text-sm font-medium text-gray-700 mb-2">
                Length
              </label>
              <select
                id="length"
                value={length}
                onChange={(e) => setLength(e.target.value as 'short' | 'medium' | 'long')}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                disabled={loading}
              >
                <option value="short">Short</option>
                <option value="medium">Medium</option>
                <option value="long">Long</option>
              </select>
            </div>

            {/* Language */}
            <div>
              <label htmlFor="lang" className="block text-sm font-medium text-gray-700 mb-2">
                Language
              </label>
              <select
                id="lang"
                value={lang}
                onChange={(e) => setLang(e.target.value as 'tr' | 'en')}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                disabled={loading}
              >
                <option value="tr">Turkish</option>
                <option value="en">English</option>
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => handleGenerate('summary')}
              disabled={loading || !text.trim()}
              className="px-6 py-2 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Generate Summary
            </button>
            <button
              onClick={() => handleGenerate('youtube')}
              disabled={loading || !text.trim()}
              className="px-6 py-2 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              YouTube Script
            </button>
            <button
              onClick={() => handleGenerate('shorts')}
              disabled={loading || !text.trim()}
              className="px-6 py-2 bg-purple-600 text-white font-medium rounded-md hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Shorts Script
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">Processing...</p>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Result Display */}
        {result && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Generated Content</h2>
              <div className="flex gap-2">
                <button
                  onClick={handleCopy}
                  className="px-3 py-1 bg-gray-600 text-white text-sm rounded-md hover:bg-gray-700"
                >
                  {copySuccess ? 'Copied!' : 'Copy'}
                </button>
                <button
                  onClick={handleDownload}
                  className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
                >
                  Download
                </button>
              </div>
            </div>
            <pre className="whitespace-pre-wrap text-sm text-gray-800 bg-gray-50 p-4 rounded-md border max-h-96 overflow-y-auto">
              {result}
            </pre>
          </div>
        )}

        {/* Footer */}
        <footer className="text-center mt-12 pt-8 border-t border-gray-200">
          <p className="text-gray-600 text-sm">
            Built with Next.js, FastAPI, and Hugging Face AI models
          </p>
        </footer>
      </div>
    </div>
  );
}
