'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { generateContent } from '@/lib/api'
import { 
  ArrowLeft,
  Send,
  Sparkles,
  Copy,
  Download,
  RefreshCw,
  User,
  Bot,
  Zap,
  FileText,
  Settings,
  Star,
  MessageSquare,
  Heart,
  Share2,
  Sun,
  Moon,
  BookOpen,
  Video,
  Search,
  Users,
  Briefcase,
  GraduationCap,
  Newspaper,
  CheckCircle,
  Clock,
  Target
} from 'lucide-react'

interface Message {
  id: string
  type: 'user' | 'ai'
  content: string
  timestamp: Date
  isTyping?: boolean
}

interface TemplateConfig {
  id: string
  title: string
  description: string
  icon: React.ElementType
  color: string
  persona: string
  welcomeMessage: string
  prompts: string[]
  contentType: string
}

const templateConfigs: { [key: string]: TemplateConfig } = {
  'blog-yazilari': {
    id: 'blog-yazilari',
    title: 'Blog Yazı Uzmanı',
    description: 'SEO dostu blog yazıları ve makaleler oluşturur',
    icon: BookOpen,
    color: 'blue',
    persona: 'Deneyimli bir içerik editörü ve SEO uzmanı',
    welcomeMessage: 'Merhaba! Ben CSpark Blog Yazı Uzmanıyım 📝. SEO dostu, ilgi çekici blog yazıları oluşturmak için buradayım. Hangi konuda yazı yazmak istiyorsunuz?',
    prompts: [
      'Nasıl yapılır rehberi yazısı',
      'Ürün incelemesi yazısı',
      'Sektör analizi yazısı',
      'Liste formatında yazı'
    ],
    contentType: 'blog'
  },
  'sosyal-medya': {
    id: 'sosyal-medya',
    title: 'Sosyal Medya Uzmanı',
    description: 'Viral sosyal medya içerikleri oluşturur',
    icon: MessageSquare,
    color: 'green',
    persona: 'Yaratıcı sosyal medya editörü ve viral içerik uzmanı',
    welcomeMessage: 'Hey! Ben CSpark Sosyal Medya Uzmanıyım 🚀. Instagram, Twitter, LinkedIn için viral içerikler oluşturmaya hazırım. Hangi platform için içerik istiyorsunuz?',
    prompts: [
      'Instagram story serisi',
      'Twitter thread',
      'LinkedIn professional post',
      'Viral TikTok konsepti'
    ],
    contentType: 'social'
  },
  'video-icerigi': {
    id: 'video-icerigi',
    title: 'Video İçerik Uzmanı',
    description: 'YouTube ve video scriptleri oluşturur',
    icon: Video,
    color: 'red',
    persona: 'Profesyonel video editörü ve content creator',
    welcomeMessage: 'Selam! Ben CSpark Video İçerik Uzmanıyım 🎬. YouTube videoları, kısa form içerikleri ve eğitici videolar için scriptler hazırlıyorum. Ne tür video planlıyorsunuz?',
    prompts: [
      'YouTube video scripti',
      'Shorts içerik serisi',
      'Eğitici video planı',
      'Podcast bölüm özetı'
    ],
    contentType: 'video'
  },
  'seo-optimizasyonu': {
    id: 'seo-optimizasyonu',
    title: 'SEO Uzmanı',
    description: 'SEO stratejileri ve anahtar kelime analizi',
    icon: Search,
    color: 'purple',
    persona: 'Deneyimli SEO uzmanı ve digital marketing strategist',
    welcomeMessage: 'Merhaba! Ben CSpark SEO Uzmanıyım 🔍. Web sitenizin arama motorlarında üst sıralarda yer alması için SEO stratejileri geliştiriyorum. Hangi proje üzerinde çalışıyorsunuz?',
    prompts: [
      'Anahtar kelime analizi',
      'SEO içerik stratejisi',
      'Teknik SEO audit',
      'Rakip analizi'
    ],
    contentType: 'seo'
  },
  'is-icerigi': {
    id: 'is-icerigi',
    title: 'İş İçeriği Uzmanı',
    description: 'Profesyonel iş belgeleri ve sunumlar',
    icon: Briefcase,
    color: 'indigo',
    persona: 'Deneyimli iş danışmanı ve kurumsal iletişim uzmanı',
    welcomeMessage: 'Merhaba! Ben CSpark İş İçeriği Uzmanıyım 💼. Profesyonel sunumlar, raporlar ve iş belgeleri hazırlamak için buradayım. Hangi tür belge oluşturmak istiyorsunuz?',
    prompts: [
      'İş planı özeti',
      'Sunum içeriği',
      'Proje raporu',
      'E-posta şablonu'
    ],
    contentType: 'business'
  },
  'egitim-icerigi': {
    id: 'egitim-icerigi',
    title: 'Eğitim İçeriği Uzmanı',
    description: 'Öğretici kurslar ve eğitim materyalleri',
    icon: GraduationCap,
    color: 'yellow',
    persona: 'Deneyimli eğitimci ve öğretim tasarımcısı',
    welcomeMessage: 'Merhaba! Ben CSpark Eğitim İçeriği Uzmanıyım 🎓. Online kurslar, eğitim materyalleri ve öğretici içerikler oluşturmak için buradayım. Hangi konuda eğitim vermek istiyorsunuz?',
    prompts: [
      'Kurs müfredatı',
      'Eğitim sunumu',
      'Alıştırma soruları',
      'Sertifika programı'
    ],
    contentType: 'education'
  }
}

function AgentPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [currentTemplate, setCurrentTemplate] = useState<TemplateConfig | null>(null)
  const [showSuggestions, setShowSuggestions] = useState(true)

  // Animated background octopi
  const backgroundOctopi = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    size: Math.random() * 12 + 8,
    opacity: Math.random() * 0.05 + 0.02,
    left: Math.random() * 100,
    top: Math.random() * 100,
    rotation: Math.random() * 360,
    animationDelay: Math.random() * 5
  }))

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme')
    setIsDarkMode(savedTheme === 'dark' || !savedTheme)
  }, [])

  useEffect(() => {
    const templateId = searchParams.get('template')
    const templateName = searchParams.get('name')
    
    if (templateId && templateConfigs[templateId]) {
      const template = templateConfigs[templateId]
      setCurrentTemplate(template)
      
      // Set welcome message
      setMessages([{
        id: '1',
        type: 'ai',
        content: template.welcomeMessage,
        timestamp: new Date()
      }])
    } else if (templateName) {
      // Fallback for direct template names
      const fallbackTemplate: TemplateConfig = {
        id: 'custom',
        title: 'CSpark AI Uzmanı',
        description: 'Özel içerik oluşturma uzmanı',
        icon: Sparkles,
        color: 'purple',
        persona: 'Yaratıcı AI asistanı',
        welcomeMessage: `Merhaba! Ben "${templateName}" konusunda uzmanlaşmış CSpark AI asistanıyım. Size nasıl yardımcı olabilirim?`,
        prompts: [`${templateName} hakkında içerik`, `${templateName} analizi`, `${templateName} stratejisi`],
        contentType: 'general'
      }
      setCurrentTemplate(fallbackTemplate)
      setMessages([{
        id: '1',
        type: 'ai',
        content: fallbackTemplate.welcomeMessage,
        timestamp: new Date()
      }])
    } else {
      // Default agent
      setCurrentTemplate({
        id: 'default',
        title: 'CSpark AI Asistanı',
        description: 'Genel amaçlı içerik oluşturma asistanı',
        icon: Bot,
        color: 'purple',
        persona: 'Yaratıcı ve yardımsever AI asistanı',
        welcomeMessage: 'Merhaba! Ben CSpark AI asistanınım 🐙. Size hangi konuda yardımcı olabilirim?',
        prompts: ['Blog yazısı', 'Sosyal medya içeriği', 'E-posta metni', 'Yaratıcı metin'],
        contentType: 'general'
      })
      setMessages([{
        id: '1',
        type: 'ai',
        content: 'Merhaba! Ben CSpark AI asistanınım 🐙. Size hangi konuda yardımcı olabilirim?',
        timestamp: new Date()
      }])
    }
  }, [searchParams])

  const toggleTheme = () => {
    const newTheme = !isDarkMode
    setIsDarkMode(newTheme)
    localStorage.setItem('theme', newTheme ? 'dark' : 'light')
  }

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsLoading(true)
    setShowSuggestions(false)

    try {
      // Add typing indicator
      const typingMessage: Message = {
        id: 'typing',
        type: 'ai',
        content: '',
        timestamp: new Date(),
        isTyping: true
      }
      setMessages(prev => [...prev, typingMessage])

      // Prepare request for AI
      const request = {
        input: inputMessage,
        task: (currentTemplate?.contentType === 'blog' ? 'summary' : 
               currentTemplate?.contentType === 'video' ? 'youtube' :
               currentTemplate?.contentType === 'social' ? 'social' :
               currentTemplate?.contentType === 'seo' ? 'seo' : 
               'summary') as 'summary' | 'youtube' | 'shorts' | 'social' | 'seo',
        tone: 'casual' as const,
        length: 'medium' as const,
        lang: 'tr' as const
      }

      const result = await generateContent(request)

      // Remove typing indicator and add response
      setMessages(prev => prev.filter(m => m.id !== 'typing'))
      
      const aiMessage: Message = {
        id: Date.now().toString() + '_ai',
        type: 'ai',
        content: result.result,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, aiMessage])
    } catch (error) {
      setMessages(prev => prev.filter(m => m.id !== 'typing'))
      const errorMessage: Message = {
        id: Date.now().toString() + '_error',
        type: 'ai',
        content: 'Üzgünüm, bir hata oluştu. Lütfen tekrar deneyin.',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    setInputMessage(suggestion)
    setShowSuggestions(false)
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      // You could add a toast notification here
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  if (!currentTemplate) {
    return <div>Loading...</div>
  }

  return (
    <div className={`min-h-screen transition-all duration-500 relative overflow-hidden ${
      isDarkMode 
        ? 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900' 
        : 'bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50'
    }`}>
      {/* Animated background octopi */}
      <div className="absolute inset-0 pointer-events-none">
        {backgroundOctopi.map((octopus) => (
          <div
            key={octopus.id}
            className="absolute animate-pulse"
            style={{
              left: `${octopus.left}%`,
              top: `${octopus.top}%`,
              width: `${octopus.size}px`,
              height: `${octopus.size}px`,
              opacity: isDarkMode ? octopus.opacity : octopus.opacity * 0.4,
              transform: `rotate(${octopus.rotation}deg)`,
              animationDelay: `${octopus.animationDelay}s`,
              animationDuration: `${6 + Math.random() * 4}s`
            }}
          >
            <Image
              src="/octopus-logo.png"
              alt=""
              width={octopus.size}
              height={octopus.size}
              className="object-contain animate-bounce"
              style={{
                animationDelay: `${octopus.animationDelay}s`,
                animationDuration: `${8 + Math.random() * 6}s`
              }}
            />
          </div>
        ))}
      </div>

      {/* Header */}
      <div className={`relative z-10 backdrop-blur-md border-b transition-all duration-500 ${
        isDarkMode 
          ? 'bg-black/20 border-white/10' 
          : 'bg-white/30 border-gray-200/30'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/app')}
                className={`p-2 rounded-lg transition-all duration-200 group ${
                  isDarkMode ? 'hover:bg-white/10' : 'hover:bg-gray-200/20'
                }`}
              >
                <ArrowLeft className={`w-5 h-5 group-hover:-translate-x-1 transition-all duration-200 ${
                  isDarkMode ? 'text-gray-300 group-hover:text-white' : 'text-gray-600 group-hover:text-gray-800'
                }`} />
              </button>
              
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500 ${
                  isDarkMode 
                    ? `bg-${currentTemplate.color}-600/20 border-${currentTemplate.color}-500/30` 
                    : `bg-${currentTemplate.color}-500/20 border-${currentTemplate.color}-400/30`
                } border`}>
                  <currentTemplate.icon className={`w-5 h-5 text-${currentTemplate.color}-400`} />
                </div>
                <div>
                  <h1 className={`text-lg font-bold transition-colors duration-500 ${
                    isDarkMode ? 'text-white' : 'text-gray-800'
                  }`}>{currentTemplate.title}</h1>
                  <p className={`text-sm transition-colors duration-500 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>{currentTemplate.description}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  isDarkMode ? 'hover:bg-white/10' : 'hover:bg-gray-200/20'
                }`}
              >
                {isDarkMode ? (
                  <Sun className="w-5 h-5 text-yellow-400" />
                ) : (
                  <Moon className="w-5 h-5 text-gray-600" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Container */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 h-[calc(100vh-4rem)] flex flex-col">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-6 mb-6 scrollbar-hide">
          {messages.map((message) => (
            <div key={message.id} className={`flex gap-4 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              {message.type === 'ai' && (
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-500 ${
                  isDarkMode 
                    ? `bg-${currentTemplate.color}-600/20 border-${currentTemplate.color}-500/30` 
                    : `bg-${currentTemplate.color}-500/20 border-${currentTemplate.color}-400/30`
                } border`}>
                  {message.isTyping ? (
                    <div className="flex space-x-1">
                      <div className={`w-1 h-1 rounded-full animate-bounce bg-${currentTemplate.color}-400`} style={{animationDelay: '0ms'}}></div>
                      <div className={`w-1 h-1 rounded-full animate-bounce bg-${currentTemplate.color}-400`} style={{animationDelay: '150ms'}}></div>
                      <div className={`w-1 h-1 rounded-full animate-bounce bg-${currentTemplate.color}-400`} style={{animationDelay: '300ms'}}></div>
                    </div>
                  ) : (
                    <currentTemplate.icon className={`w-5 h-5 text-${currentTemplate.color}-400`} />
                  )}
                </div>
              )}
              
              <div className={`max-w-2xl rounded-2xl px-6 py-4 transition-all duration-500 ${
                message.type === 'user'
                  ? isDarkMode
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                    : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                  : isDarkMode
                    ? 'bg-white/10 backdrop-blur-md border border-white/20 text-white'
                    : 'bg-white/70 backdrop-blur-md border border-gray-200/50 text-gray-800'
              }`}>
                {message.isTyping ? (
                  <div className={`text-sm transition-colors duration-500 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>Yazıyor...</div>
                ) : (
                  <>
                    <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
                    {message.type === 'ai' && !message.isTyping && (
                      <div className="flex items-center gap-2 mt-4 pt-4 border-t border-white/10">
                        <button
                          onClick={() => copyToClipboard(message.content)}
                          className={`p-1.5 rounded-lg transition-colors duration-200 ${
                            isDarkMode 
                              ? 'hover:bg-white/10 text-gray-400 hover:text-white' 
                              : 'hover:bg-gray-200/30 text-gray-600 hover:text-gray-800'
                          }`}
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <button className={`p-1.5 rounded-lg transition-colors duration-200 ${
                          isDarkMode 
                            ? 'hover:bg-white/10 text-gray-400 hover:text-white' 
                            : 'hover:bg-gray-200/30 text-gray-600 hover:text-gray-800'
                        }`}>
                          <Heart className="w-4 h-4" />
                        </button>
                        <button className={`p-1.5 rounded-lg transition-colors duration-200 ${
                          isDarkMode 
                            ? 'hover:bg-white/10 text-gray-400 hover:text-white' 
                            : 'hover:bg-gray-200/30 text-gray-600 hover:text-gray-800'
                        }`}>
                          <Share2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>

              {message.type === 'user' && (
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-r flex items-center justify-center flex-shrink-0 ${
                  isDarkMode 
                    ? 'from-purple-600 to-pink-600' 
                    : 'from-blue-600 to-purple-600'
                }`}>
                  <User className="w-5 h-5 text-white" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Suggested Prompts */}
        {showSuggestions && messages.length === 1 && (
          <div className="mb-6">
            <p className={`text-sm mb-3 transition-colors duration-500 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>💡 Önerilen sorular:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {currentTemplate.prompts.map((prompt, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(prompt)}
                  className={`p-4 rounded-xl border text-left transition-all duration-200 hover:scale-105 ${
                    isDarkMode 
                      ? 'bg-white/5 border-white/10 hover:bg-white/10 text-gray-300 hover:text-white' 
                      : 'bg-white/60 border-gray-200/50 hover:bg-white/80 text-gray-700 hover:text-gray-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Sparkles className={`w-4 h-4 text-${currentTemplate.color}-400`} />
                    <span className="text-sm font-medium">{prompt}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className={`backdrop-blur-md rounded-2xl border p-4 transition-all duration-500 ${
          isDarkMode 
            ? 'bg-white/10 border-white/20' 
            : 'bg-white/70 border-gray-200/50'
        }`}>
          <div className="flex gap-4">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder={`${currentTemplate.title} ile konuşun...`}
              className={`flex-1 bg-transparent outline-none text-sm placeholder:transition-colors placeholder:duration-500 ${
                isDarkMode 
                  ? 'text-white placeholder:text-gray-400' 
                  : 'text-gray-800 placeholder:text-gray-600'
              }`}
              disabled={isLoading}
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isLoading}
              className={`p-3 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 ${
                isDarkMode 
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700' 
                  : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
              }`}
            >
              {isLoading ? (
                <RefreshCw className="w-5 h-5 text-white animate-spin" />
              ) : (
                <Send className="w-5 h-5 text-white" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
      <div className="text-white">Yükleniyor...</div>
    </div>
  )
}

export default function AgentPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <AgentPageContent />
    </Suspense>
  )
}
