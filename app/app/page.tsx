'use client';
// Use relative API endpoints and lib/api.ts
import { generateContent, generateAllContent } from '../../lib/api';
import { GenerateRequest, GenerateAllRequest } from '../../lib/api';

// Define your API base URL here (adjust as needed)
const API_BASE_URL = '/api';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

// Types
type Step = 'input' | 'generate' | 'seo' | 'social';
type Persona = 'generic' | 'news_anchor' | 'educator' | 'vlogger' | 'influencer' | 'brand';
type InputType = 'text' | 'url';
type Theme = 'dark' | 'light';
type ProcessingState = 'idle' | 'preparing' | 'generating' | 'finalizing' | 'complete';

interface GeneratedContent {
  summary?: string;
  youtube?: string;
  shorts?: string;
  social?: string;
  seo?: {
    title_suggestions: string[];
    meta_description: string;
    keywords: string[];
    hashtags: string[];
    full_result: string;
  };
}

// ...existing code...

function AppContent() {
  // ...existing code...
  // Removed duplicate generateSingleContent function to fix redeclaration error.
  // URL params and routing
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // Core state
  const [currentStep, setCurrentStep] = useState<Step>('input');
  const [inputType, setInputType] = useState<InputType>('text');
  const [textInput, setTextInput] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const [persona, setPersona] = useState<Persona>('generic');
  const [tone, setTone] = useState('casual');
  const [length, setLength] = useState('medium');
  const [temperature, setTemperature] = useState(0.5);
  
  // Processing state
  const [processingState, setProcessingState] = useState<ProcessingState>('idle');
  const [progress, setProgress] = useState(0);
  const [currentTask, setCurrentTask] = useState('');
  
  // Generated content
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent>({});
  const [error, setError] = useState('');
  
  // UI state
  const [theme, setTheme] = useState<Theme>('dark');
  const [isProUser, setIsProUser] = useState(false);
  const [dailyLimit, setDailyLimit] = useState({ used: 1, total: 3 });
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [notifications, setNotifications] = useState<Array<{id: string, type: 'success' | 'error', message: string}>>([]);

  // Load theme from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme') as Theme;
      if (savedTheme) {
        setTheme(savedTheme);
        document.documentElement.setAttribute('data-theme', savedTheme);
      }
    }
  }, []);

  // Handle step changes from URL
  useEffect(() => {
    const step = searchParams.get('step') as Step;
    if (step && ['input', 'generate', 'seo', 'social'].includes(step)) {
      setCurrentStep(step);
    }
  }, [searchParams]);

  // Theme toggle
  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', newTheme);
      document.documentElement.setAttribute('data-theme', newTheme);
    }
  };

  // Update URL with step
  const updateStep = (step: Step) => {
    setCurrentStep(step);
    router.push(`?step=${step}`);
  };

  // Add notification
  const addNotification = (type: 'success' | 'error', message: string) => {
    const id = Date.now().toString();
    setNotifications(prev => [...prev, { id, type, message }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);
  };

  // Persona configurations
  const personas = {
    generic: { name: 'Genel İçerik', icon: '✍️', description: 'Genel amaçlı içerik' },
    news_anchor: { name: 'Haber Sunucusu', icon: '📺', description: 'Objektif ve güvenilir' },
    educator: { name: 'Eğitimci', icon: '🎓', description: 'Açıklayıcı ve öğretici' },
    vlogger: { name: 'Vlogger', icon: '🎥', description: 'Kişisel ve samimi' },
    influencer: { name: 'Influencer', icon: '⭐', description: 'Trend ve çekici' },
    brand: { name: 'Marka', icon: '🏢', description: 'Profesyonel ve tutarlı' }
  };

  // Steps configuration
  const steps = [
    { id: 'input', name: 'Metin/URL', icon: '📝', description: 'İçeriğinizi girin' },
    { id: 'generate', name: 'Video Script', icon: '🎬', description: 'Script oluşturun' },
    { id: 'seo', name: 'SEO', icon: '🔍', description: 'SEO optimizasyonu' },
    { id: 'social', name: 'Sosyal Medya', icon: '📱', description: 'Sosyal paylaşım' }
  ];

  // Validate input
  const isInputValid = () => {
    const input = inputType === 'text' ? textInput : urlInput;
    return input.trim().length > 10;
  };

  // Check if user can generate
  const canGenerate = () => {
    if (!isProUser && dailyLimit.used >= dailyLimit.total) {
      return false;
    }
    return isInputValid();
  };

  // Single content generation
  const generateSingleContent = async (task: 'summary' | 'youtube' | 'shorts' | 'social' | 'seo') => {
    console.log('generateSingleContent called with task:', task);
    
    if (!canGenerate()) {
      console.log('canGenerate() returned false');
      return;
    }

    console.log('Starting generation for task:', task);
    setProcessingState('preparing');
    setProgress(20);
    setCurrentTask(`${task} hazırlanıyor...`);
    setError('');

    try {
      const input = inputType === 'text' ? textInput : urlInput;
      const request: GenerateRequest = {
        input,
        task,
        lang: 'tr',
        tone: tone as 'casual' | 'professional' | 'energetic' | 'academic',
        length: length as 'short' | 'medium' | 'long',
        temperature,
        max_tokens: 1024
      };

      setProcessingState('generating');
      setProgress(60);
      setCurrentTask(`${task} oluşturuluyor...`);

      const data = await generateContent(request);
      
      setProcessingState('finalizing');
      setProgress(90);
      setCurrentTask('Sonuçlandırılıyor...');

      // Handle SEO response differently
      if (task === 'seo') {
        setGeneratedContent(prev => ({
          ...prev,
          seo: {
            full_result: data.result,
            title_suggestions: [],
            meta_description: '',
            keywords: [],
            hashtags: []
          }
        }));
      } else {
        setGeneratedContent(prev => ({
          ...prev,
          [task]: data.result
        }));
      }

      // Update daily limit
      if (!isProUser) {
        setDailyLimit(prev => ({ ...prev, used: prev.used + 1 }));
      }

      setProcessingState('complete');
      setProgress(100);
      setCurrentTask('Tamamlandı!');
      
      addNotification('success', `${task} başarıyla oluşturuldu!`);

      // Auto-navigate to next step
      setTimeout(() => {
        if (task === 'summary') updateStep('generate');
        else if (task === 'youtube' || task === 'shorts') updateStep('seo');
        else if (task === 'seo') updateStep('social');
        setProcessingState('idle');
        setProgress(0);
        setCurrentTask('');
      }, 1500);

    } catch (error) {
      console.error('Generation error:', error);
      setError(error instanceof Error ? error.message : 'Bir hata oluştu');
      setProcessingState('idle');
      setProgress(0);
      setCurrentTask('');
      addNotification('error', 'İçerik oluşturulamadı');
    }
  };

  // Generate all content (PRO feature)
  const generateAllContentFunction = async () => {
    if (!isProUser) {
      setShowUpgrade(true);
      return;
    }

    if (!canGenerate()) return;

    setProcessingState('preparing');
    setProgress(10);
    setCurrentTask('Tüm içerikler hazırlanıyor...');
    setError('');

    try {
      const input = inputType === 'text' ? textInput : urlInput;
      const request: GenerateAllRequest = {
        input,
        lang: 'tr'
      };

      setProcessingState('generating');
      setProgress(50);
      setCurrentTask('AI içerikleri oluşturuyor...');

      const data = await generateAllContent(request);

      setProcessingState('finalizing');
      setProgress(90);
      setCurrentTask('Sonuçlandırılıyor...');

      // Handle the response data properly
      const processedData = {
        ...data,
        seo: data.seo ? { 
          title_suggestions: [],
          meta_description: '',
          keywords: [],
          hashtags: [],
          full_result: typeof data.seo === 'string' ? data.seo : JSON.stringify(data.seo)
        } : undefined
      };
      
      setGeneratedContent(processedData);

      // Update daily limit
      if (!isProUser) {
        setDailyLimit(prev => ({ ...prev, used: prev.used + 5 }));
      }

      setProcessingState('complete');
      setProgress(100);
      setCurrentTask('Tüm içerikler hazır!');
      
      addNotification('success', 'Tüm içerikler başarıyla oluşturuldu!');

      // Navigate to results
      setTimeout(() => {
        updateStep('generate');
        setProcessingState('idle');
        setProgress(0);
        setCurrentTask('');
      }, 2000);

    } catch (error) {
      console.error('Generate all error:', error);
      setError(error instanceof Error ? error.message : 'Bir hata oluştu');
      setProcessingState('idle');
      setProgress(0);
      setCurrentTask('');
      addNotification('error', 'İçerikler oluşturulamadı');
    }
  };

  // Copy to clipboard
  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      addNotification('success', `${label} kopyalandı!`);
    } catch (error) {
      addNotification('error', 'Kopyalama başarısız');
    }
  };

  // Download as file
  const downloadContent = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}-${Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    addNotification('success', `${filename} indirildi!`);
  };

  // Cancel processing
  const cancelProcessing = () => {
    setProcessingState('idle');
    setProgress(0);
    setCurrentTask('');
    addNotification('success', 'İşlem iptal edildi');
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      theme === 'dark' 
        ? 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white' 
        : 'bg-gradient-to-br from-gray-50 via-blue-50 to-gray-50 text-gray-900'
    }`}>
      {/* Notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {notifications.map(notification => (
          <div
            key={notification.id}
            className={`px-4 py-3 rounded-lg shadow-lg transition-all duration-300 ${
              notification.type === 'success'
                ? 'bg-green-500 text-white'
                : 'bg-red-500 text-white'
            }`}
          >
            {notification.message}
          </div>
        ))}
      </div>

      {/* Header */}
      <header className="relative z-10 px-4 py-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
                <span className="text-2xl">🚀</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold">Creator Transformer</h1>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                  AI-powered content generation
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Daily Limit Badge */}
              {!isProUser && (
                <div className="flex items-center gap-2 px-3 py-2 bg-purple-500/20 rounded-lg border border-purple-500/30">
                  <span className="text-sm">Kalan:</span>
                  <span className="font-semibold">{dailyLimit.total - dailyLimit.used}/{dailyLimit.total}</span>
                </div>
              )}
              
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-lg border transition-colors ${
                  theme === 'dark'
                    ? 'border-gray-600 hover:border-gray-500 text-gray-300'
                    : 'border-gray-300 hover:border-gray-400 text-gray-600'
                }`}
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? '☀️' : '🌙'}
              </button>
              
              {/* Upgrade Button */}
              {!isProUser && (
                <button
                  onClick={() => setShowUpgrade(true)}
                  className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
                >
                  ⭐ Pro'ya Geç
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Progress Steps */}
      <div className="relative z-10 px-4 mb-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-4 overflow-x-auto pb-2">
            {steps.map((step, index) => {
              const isActive = currentStep === step.id;
              const isCompleted = steps.findIndex(s => s.id === currentStep) > index;
              
              return (
                <div key={step.id} className="flex items-center flex-shrink-0">
                  <button
                    onClick={() => updateStep(step.id as Step)}
                    className={`flex flex-col items-center p-4 rounded-xl transition-all min-w-[120px] ${
                      isActive
                        ? 'bg-purple-500/20 border-2 border-purple-500'
                        : isCompleted
                        ? 'bg-green-500/20 border-2 border-green-500'
                        : theme === 'dark'
                        ? 'bg-gray-800/50 border border-gray-700 hover:border-gray-600'
                        : 'bg-white/50 border border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <div className={`text-2xl mb-2 ${
                      isActive ? 'animate-bounce' : ''
                    }`}>
                      {isCompleted ? '✅' : step.icon}
                    </div>
                    <div className="text-sm font-semibold">{step.name}</div>
                    <div className={`text-xs mt-1 text-center ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {step.description}
                    </div>
                  </button>
                  
                  {index < steps.length - 1 && (
                    <div className={`w-8 h-0.5 mx-2 ${
                      isCompleted ? 'bg-green-500' : theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="relative z-10 px-4 pb-20">
        <div className="max-w-4xl mx-auto">
          
          {/* Step 1: Input */}
          {currentStep === 'input' && (
            <InputStep 
              theme={theme}
              inputType={inputType}
              setInputType={setInputType}
              textInput={textInput}
              setTextInput={setTextInput}
              urlInput={urlInput}
              setUrlInput={setUrlInput}
              persona={persona}
              setPersona={setPersona}
              personas={personas}
              tone={tone}
              setTone={setTone}
              length={length}
              setLength={setLength}
              temperature={temperature}
              setTemperature={setTemperature}
              generateSingleContent={generateSingleContent}
              generateAllContent={2}
              canGenerate={canGenerate}
              processingState={processingState}
              isProUser={isProUser}
              setGeneratedContent={setGeneratedContent}
              setError={setError}
            />
          )}

          {/* Step 2: Generate/Scripts */}
          {currentStep === 'generate' && (
            <GenerateStep
              theme={theme}
              generatedContent={generatedContent}
              copyToClipboard={copyToClipboard}
              downloadContent={downloadContent}
              generateSingleContent={generateSingleContent}
              generateAllContent={generateAllContentFunction}
              processingState={processingState}
            />
          )}

          {/* Step 3: SEO */}
          {currentStep === 'seo' && (
            <SEOStep
              theme={theme}
              generatedContent={generatedContent}
              copyToClipboard={copyToClipboard}
              downloadContent={downloadContent}
              generateSingleContent={generateSingleContent}
              processingState={processingState}
            />
          )}

          {/* Step 4: Social */}
          {currentStep === 'social' && (
            <SocialStep
              theme={theme}
              generatedContent={generatedContent}
              copyToClipboard={copyToClipboard}
              downloadContent={downloadContent}
              generateSingleContent={generateSingleContent}
              processingState={processingState}
            />
          )}

        </div>
      </main>

      {/* Processing Overlay */}
      {processingState !== 'idle' && (
        <ProcessingOverlay
          theme={theme}
          currentTask={currentTask}
          progress={progress}
          cancelProcessing={cancelProcessing}
        />
      )}

      {/* Upgrade Modal */}
      {showUpgrade && (
        <UpgradeModal
          onClose={() => setShowUpgrade(false)}
          theme={theme}
        />
      )}

      {/* Error Banner */}
      {error && (
        <ErrorBanner
          error={error}
          onClose={() => setError('')}
        />
      )}

      {/* Mobile Sticky Generate Button */}
      <MobileStickyButton
        currentStep={currentStep}
        canGenerate={canGenerate}
        processingState={processingState}
        generateSingleContent={generateSingleContent}
        updateStep={updateStep}
      />
    </div>
  );
}

// Input Step Component
function InputStep({ 
  theme, inputType, setInputType, textInput, setTextInput, urlInput, setUrlInput,
  persona, setPersona, personas, tone, setTone, length, setLength, temperature, setTemperature,
  generateSingleContent, generateAllContent, canGenerate, processingState, isProUser,
  setGeneratedContent, setError 
}: any) {
  return (
    <div className={`backdrop-blur-lg rounded-3xl p-8 border shadow-2xl ${
      theme === 'dark' 
        ? 'bg-white/5 border-white/10' 
        : 'bg-white/80 border-gray-200'
    }`}>
      <h2 className="text-3xl font-bold mb-6 text-center">
        İçeriğinizi Girin
      </h2>
      
      {/* Input Type Toggle */}
      <div className="flex justify-center mb-6">
        <div className={`flex rounded-xl p-1 ${
          theme === 'dark' ? 'bg-gray-800/50' : 'bg-gray-100'
        }`}>
          <button
            onClick={() => setInputType('text')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              inputType === 'text'
                ? 'bg-purple-500 text-white shadow-lg'
                : theme === 'dark'
                ? 'text-gray-300 hover:text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            📝 Metin
          </button>
          <button
            onClick={() => setInputType('url')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              inputType === 'url'
                ? 'bg-purple-500 text-white shadow-lg'
                : theme === 'dark'
                ? 'text-gray-300 hover:text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            🔗 URL
          </button>
        </div>
      </div>

      {/* Input Area */}
      <div className="mb-6">
        {inputType === 'text' ? (
          <textarea
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder="Örn: Yeni iPhone lansmanı haberi metnini yapıştırın veya hakkında video script oluşturmak istediğiniz konuyu yazın..."
            className={`w-full h-40 px-4 py-3 rounded-xl border resize-none transition-colors ${
              theme === 'dark'
                ? 'bg-gray-800/50 border-gray-700 focus:border-purple-500 text-white placeholder-gray-400'
                : 'bg-white border-gray-300 focus:border-purple-500 text-gray-900 placeholder-gray-500'
            } focus:outline-none focus:ring-2 focus:ring-purple-500/20`}
            aria-label="Metin girişi"
          />
        ) : (
          <input
            type="url"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="Örn: https://example.com/article-url"
            className={`w-full px-4 py-3 rounded-xl border transition-colors ${
              theme === 'dark'
                ? 'bg-gray-800/50 border-gray-700 focus:border-purple-500 text-white placeholder-gray-400'
                : 'bg-white border-gray-300 focus:border-purple-500 text-gray-900 placeholder-gray-500'
            } focus:outline-none focus:ring-2 focus:ring-purple-500/20`}
            aria-label="URL girişi"
          />
        )}
      </div>

      {/* Persona Selection */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">Persona Seçin</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {Object.entries(personas).map(([key, config]: [string, any]) => (
            <button
              key={key}
              onClick={() => setPersona(key)}
              className={`p-4 rounded-xl border-2 transition-all ${
                persona === key
                  ? 'border-purple-500 bg-purple-500/20'
                  : theme === 'dark'
                  ? 'border-gray-700 hover:border-gray-600 bg-gray-800/30'
                  : 'border-gray-200 hover:border-gray-300 bg-gray-50'
              }`}
            >
              <div className="text-2xl mb-2">{config.icon}</div>
              <div className="font-semibold text-sm">{config.name}</div>
              <div className={`text-xs mt-1 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {config.description}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Advanced Settings */}
      <details className={`mb-8 rounded-xl border ${
        theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
      }`}>
        <summary className={`p-4 cursor-pointer font-semibold ${
          theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
        }`}>
          ⚙️ Gelişmiş Ayarlar
        </summary>
        <div className="p-4 pt-0 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Ton</label>
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className={`w-full px-3 py-2 rounded-lg border ${
                theme === 'dark'
                  ? 'bg-gray-800 border-gray-700 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            >
              <option value="casual">Rahat</option>
              <option value="formal">Resmi</option>
              <option value="energetic">Enerjik</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Uzunluk</label>
            <select
              value={length}
              onChange={(e) => setLength(e.target.value)}
              className={`w-full px-3 py-2 rounded-lg border ${
                theme === 'dark'
                  ? 'bg-gray-800 border-gray-700 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            >
              <option value="short">Kısa</option>
              <option value="medium">Orta</option>
              <option value="long">Uzun</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Yaratıcılık: {temperature}
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={temperature}
              onChange={(e) => setTemperature(Number(e.target.value))}
              className="w-full accent-purple-500"
            />
          </div>
        </div>
      </details>

      {/* Action Buttons */}
      <div className="space-y-4">
        {/* Main Generate Button */}
        <button
          onClick={() => generateSingleContent('summary')}
          disabled={!canGenerate() || processingState !== 'idle'}
          className={`w-full py-4 px-8 rounded-2xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-3 ${
            canGenerate() && processingState === 'idle'
              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]'
              : 'bg-gray-400 text-gray-700 cursor-not-allowed'
          }`}
          aria-label="İçerik oluştur"
        >
          {processingState !== 'idle' ? (
            <>
              <svg className="animate-spin w-6 h-6" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              İşlem Devam Ediyor...
            </>
          ) : (
            <>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Özet Oluştur
            </>
          )}
        </button>

        {/* Generate All Button (PRO) */}
        <div className="relative">
          <button
            onClick={generateAllContent}
            disabled={processingState !== 'idle'}
            className={`w-full py-4 px-8 rounded-2xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-3 ${
              isProUser
                ? processingState === 'idle'
                  ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]'
                  : 'bg-gray-400 text-gray-700 cursor-not-allowed'
                : 'bg-gray-600 text-gray-300 cursor-not-allowed relative'
            }`}
            aria-label="Tüm içerikleri oluştur"
          >
            {!isProUser && (
              <div className="absolute inset-0 bg-black/50 rounded-2xl flex items-center justify-center">
                <span className="text-yellow-400 font-bold">🔒 PRO</span>
              </div>
            )}
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            Tüm İçerikleri Oluştur
          </button>
        </div>

        {/* Quick Actions */}
        <div className="flex justify-center gap-3 text-sm">
          <button
            onClick={() => {
              setTextInput('');
              setUrlInput('');
              setGeneratedContent({});
              setError('');
            }}
            className={`px-4 py-2 border rounded-lg transition-colors ${
              theme === 'dark'
                ? 'border-gray-600 text-gray-300 hover:border-gray-500'
                : 'border-gray-300 text-gray-600 hover:border-gray-400'
            }`}
          >
            🗑️ Temizle
          </button>
          <button
            onClick={() => {
              setPersona('generic');
              setTone('casual');
              setLength('medium');
              setTemperature(0.5);
            }}
            className={`px-4 py-2 border rounded-lg transition-colors ${
              theme === 'dark'
                ? 'border-gray-600 text-gray-300 hover:border-gray-500'
                : 'border-gray-300 text-gray-600 hover:border-gray-400'
            }`}
          >
            🔄 Sıfırla
          </button>
        </div>
      </div>
    </div>
  );
}

// Generate Step Component  
function GenerateStep({ theme, generatedContent, copyToClipboard, downloadContent, generateSingleContent, processingState }: any) {
  return (
    <div className="space-y-6">
      {/* Content Cards */}
      {generatedContent.summary && (
        <ContentCard
          title="📝 İçerik Özeti"
          content={generatedContent.summary}
          onCopy={() => copyToClipboard(generatedContent.summary, 'Özet')}
          onDownload={() => downloadContent(generatedContent.summary, 'ozet')}
          onRegenerate={() => generateSingleContent('summary')}
          theme={theme}
        />
      )}

      {/* Script Generation Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ScriptGenerateButton
          title="YouTube Script"
          icon="🎬"
          description="Uzun format video senaryosu"
          onClick={() => generateSingleContent('youtube')}
          generated={!!generatedContent.youtube}
          theme={theme}
          disabled={processingState !== 'idle'}
        />
        <ScriptGenerateButton
          title="Shorts/TikTok"
          icon="⚡"
          description="Kısa format viral içerik"
          onClick={() => generateSingleContent('shorts')}
          generated={!!generatedContent.shorts}
          theme={theme}
          disabled={processingState !== 'idle'}
        />
      </div>

      {/* Generated Scripts */}
      {generatedContent.youtube && (
        <ContentCard
          title="🎬 YouTube Script"
          content={generatedContent.youtube}
          onCopy={() => copyToClipboard(generatedContent.youtube, 'YouTube Script')}
          onDownload={() => downloadContent(generatedContent.youtube, 'youtube-script')}
          onRegenerate={() => generateSingleContent('youtube')}
          theme={theme}
        />
      )}

      {generatedContent.shorts && (
        <ContentCard
          title="⚡ Shorts/TikTok Script"
          content={generatedContent.shorts}
          onCopy={() => copyToClipboard(generatedContent.shorts, 'Shorts Script')}
          onDownload={() => downloadContent(generatedContent.shorts, 'shorts-script')}
          onRegenerate={() => generateSingleContent('shorts')}
          theme={theme}
        />
      )}
    </div>
  );
}

// SEO Step Component
function SEOStep({ theme, generatedContent, copyToClipboard, downloadContent, generateSingleContent, processingState }: any) {
  return (
    <div className="space-y-6">
      {!generatedContent.seo ? (
        <div className={`text-center p-8 rounded-2xl border ${
          theme === 'dark' 
            ? 'bg-gray-800/30 border-gray-700' 
            : 'bg-gray-50 border-gray-200'
        }`}>
          <div className="text-4xl mb-4">🔍</div>
          <h3 className="text-xl font-bold mb-2">SEO Paketi Oluştur</h3>
          <p className={`mb-6 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
            İçeriğiniz için başlık, meta açıklama ve hashtag önerileri oluşturun
          </p>
          <button
            onClick={() => generateSingleContent('seo')}
            disabled={processingState !== 'idle'}
            className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50"
          >
            🔍 SEO Paketi Oluştur
          </button>
        </div>
      ) : (
        <ContentCard
          title="🔍 SEO Paketi"
          content={generatedContent.seo.full_result}
          onCopy={() => copyToClipboard(generatedContent.seo.full_result, 'SEO Paketi')}
          onDownload={() => downloadContent(generatedContent.seo.full_result, 'seo-paketi')}
          onRegenerate={() => generateSingleContent('seo')}
          theme={theme}
        />
      )}
    </div>
  );
}

// Social Step Component
function SocialStep({ theme, generatedContent, copyToClipboard, downloadContent, generateSingleContent, processingState }: any) {
  return (
    <div className="space-y-6">
      {!generatedContent.social ? (
        <div className={`text-center p-8 rounded-2xl border ${
          theme === 'dark' 
            ? 'bg-gray-800/30 border-gray-700' 
            : 'bg-gray-50 border-gray-200'
        }`}>
          <div className="text-4xl mb-4">📱</div>
          <h3 className="text-xl font-bold mb-2">Sosyal Medya Paylaşımı</h3>
          <p className={`mb-6 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
            İçeriğinizi sosyal medyada paylaşmak için optimize edilmiş metin oluşturun
          </p>
          <button
            onClick={() => generateSingleContent('social')}
            disabled={processingState !== 'idle'}
            className="px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50"
          >
            📱 Sosyal Medya Oluştur
          </button>
        </div>
      ) : (
        <ContentCard
          title="📱 Sosyal Medya Paylaşımı"
          content={generatedContent.social}
          onCopy={() => copyToClipboard(generatedContent.social, 'Sosyal Medya')}
          onDownload={() => downloadContent(generatedContent.social, 'sosyal-medya')}
          onRegenerate={() => generateSingleContent('social')}
          theme={theme}
        />
      )}
    </div>
  );
}

// Content Card Component
function ContentCard({ title, content, onCopy, onDownload, onRegenerate, theme }: any) {
  return (
    <div className={`backdrop-blur-lg rounded-2xl p-6 border shadow-xl ${
      theme === 'dark' 
        ? 'bg-white/5 border-white/10' 
        : 'bg-white/80 border-gray-200'
    }`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold">{title}</h3>
        <div className="flex gap-2">
          <button
            onClick={onCopy}
            className={`p-2 rounded-lg border transition-colors ${
              theme === 'dark'
                ? 'border-gray-600 text-gray-300 hover:border-gray-500'
                : 'border-gray-300 text-gray-600 hover:border-gray-400'
            }`}
            title="Kopyala"
          >
            📋
          </button>
          <button
            onClick={onDownload}
            className={`p-2 rounded-lg border transition-colors ${
              theme === 'dark'
                ? 'border-gray-600 text-gray-300 hover:border-gray-500'
                : 'border-gray-300 text-gray-600 hover:border-gray-400'
            }`}
            title="İndir"
          >
            💾
          </button>
          <button
            onClick={onRegenerate}
            className={`p-2 rounded-lg border transition-colors ${
              theme === 'dark'
                ? 'border-gray-600 text-gray-300 hover:border-gray-500'
                : 'border-gray-300 text-gray-600 hover:border-gray-400'
            }`}
            title="Yeniden Oluştur"
          >
            🔄
          </button>
        </div>
      </div>
      <div className={`p-4 rounded-xl border ${
        theme === 'dark' ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-50 border-gray-200'
      }`}>
        <pre className="whitespace-pre-wrap text-sm leading-relaxed font-mono">
          {content}
        </pre>
      </div>
    </div>
  );
}

// Script Generate Button Component
function ScriptGenerateButton({ title, icon, description, onClick, generated, theme, disabled }: any) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`p-6 rounded-2xl border transition-all ${
        generated
          ? 'border-green-500 bg-green-500/20'
          : theme === 'dark'
          ? 'border-gray-700 bg-gray-800/30 hover:border-gray-600'
          : 'border-gray-200 bg-gray-50 hover:border-gray-300'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg'}`}
    >
      <div className="text-center">
        <div className="text-3xl mb-2">{generated ? '✅' : icon}</div>
        <div className="font-bold mb-1">{title}</div>
        <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
          {description}
        </div>
      </div>
    </button>
  );
}

// Processing Overlay Component
function ProcessingOverlay({ theme, currentTask, progress, cancelProcessing }: any) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className={`max-w-md w-full mx-4 p-8 rounded-2xl ${
        theme === 'dark' ? 'bg-gray-900' : 'bg-white'
      }`}>
        <div className="text-center">
          <div className="text-4xl mb-4">🚀</div>
          <h3 className="text-xl font-bold mb-2">AI İçerik Oluşturuyor</h3>
          <p className={`mb-6 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
            {currentTask}
          </p>
          
          {/* Progress Bar */}
          <div className={`w-full bg-gray-200 rounded-full h-3 mb-6 ${
            theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
          }`}>
            <div 
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          
          <div className="flex justify-center gap-4">
            <button
              onClick={cancelProcessing}
              className={`px-6 py-2 border rounded-lg transition-colors ${
                theme === 'dark'
                  ? 'border-gray-600 text-gray-300 hover:border-gray-500'
                  : 'border-gray-300 text-gray-600 hover:border-gray-400'
              }`}
            >
              ❌ İptal
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Upgrade Modal Component
function UpgradeModal({ onClose, theme }: any) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className={`max-w-2xl w-full p-8 rounded-2xl ${
        theme === 'dark' ? 'bg-gray-900' : 'bg-white'
      }`}>
        <div className="text-center mb-8">
          <div className="text-4xl mb-4">⭐</div>
          <h2 className="text-2xl font-bold mb-2">Pro'ya Geçin</h2>
          <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
            Gelişmiş özelliklerle içerik üretiminizi artırın
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <PricingCard
            title="Free"
            price="₺0"
            features={["3 günlük üretim", "Temel scriptler", "Standart SEO"]}
            theme={theme}
            current={true}
          />
          <PricingCard
            title="Pro"
            price="₺99"
            period="/ay"
            features={["Sınırsız üretim", "Generate All", "Gelişmiş SEO", "Öncelikli destek"]}
            theme={theme}
            highlighted={true}
          />
          <PricingCard
            title="Agency"
            price="₺299"
            period="/ay"
            features={["Tüm Pro özellikler", "API erişimi", "Toplu üretim", "Özel entegrasyon"]}
            theme={theme}
          />
        </div>

        <div className="flex justify-center gap-4">
          <button
            onClick={onClose}
            className={`px-6 py-3 border rounded-lg ${
              theme === 'dark'
                ? 'border-gray-600 text-gray-300 hover:border-gray-500'
                : 'border-gray-300 text-gray-600 hover:border-gray-400'
            }`}
          >
            Kapat
          </button>
          <button
            onClick={() => {
              // Handle upgrade
              onClose();
            }}
            className="px-8 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
          >
            Pro'ya Geç
          </button>
        </div>
      </div>
    </div>
  );
}

// Pricing Card Component
function PricingCard({ title, price, period = '', features, theme, current = false, highlighted = false }: any) {
  return (
    <div className={`p-6 rounded-xl border ${
      highlighted
        ? 'border-yellow-500 bg-yellow-500/10'
        : current
        ? 'border-green-500 bg-green-500/10'
        : theme === 'dark'
        ? 'border-gray-700 bg-gray-800/30'
        : 'border-gray-200 bg-gray-50'
    }`}>
      <div className="text-center mb-4">
        <h3 className="font-bold text-lg">{title}</h3>
        <div className="text-2xl font-bold">
          {price}<span className="text-sm font-normal">{period}</span>
        </div>
      </div>
      <ul className="space-y-2">
        {features.map((feature: string, index: number) => (
          <li key={index} className="flex items-center gap-2 text-sm">
            <span className="text-green-500">✓</span>
            {feature}
          </li>
        ))}
      </ul>
      {current && (
        <div className="mt-4 text-center text-sm text-green-500 font-semibold">
          Mevcut Plan
        </div>
      )}
    </div>
  );
}

// Error Banner Component
function ErrorBanner({ error, onClose }: any) {
  return (
    <div className="fixed top-20 left-4 right-4 z-40">
      <div className="max-w-4xl mx-auto">
        <div className="bg-red-500/90 backdrop-blur-lg text-white px-6 py-4 rounded-xl border border-red-400 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-red-200"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}

// Mobile Sticky Button Component
function MobileStickyButton({ currentStep, canGenerate, processingState, generateSingleContent, updateStep }: any) {
  return (
    <div className="fixed bottom-0 left-0 right-0 md:hidden z-30 p-4 bg-gradient-to-t from-black/50 to-transparent">
      <button
        onClick={() => {
          if (currentStep === 'input') {
            generateSingleContent('summary');
          } else if (currentStep === 'generate') {
            updateStep('seo');
          } else if (currentStep === 'seo') {
            updateStep('social');
          }
        }}
        disabled={!canGenerate() || processingState !== 'idle'}
        className={`w-full py-4 px-8 rounded-2xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-3 ${
          canGenerate() && processingState === 'idle'
            ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-xl'
            : 'bg-gray-400 text-gray-700 cursor-not-allowed'
        }`}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
        {currentStep === 'input' ? 'İçerik Oluştur' : 'Sonraki Adım'}
      </button>
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600 mx-auto mb-8"></div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Creator Transformer</h2>
          <p className="text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    }>
      <AppContent />
    </Suspense>
  );
}
