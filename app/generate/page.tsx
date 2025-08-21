'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
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
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Heart,
  Share2,
  Sun,
  Moon
} from 'lucide-react'

interface Message {
  id: string
  type: 'user' | 'ai'
  content: string
  timestamp: Date
}

export default function GeneratePage() {
  const router = useRouter()
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: 'Merhaba! Ben CSpark AI asistanınım. Size nasıl yardımcı olabilirim? Blog yazısı, sosyal medya içeriği, e-posta metni veya başka bir içerik türü oluşturmak ister misiniz?',
      timestamp: new Date()
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)

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

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsLoading(true)

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: `Tabii ki! "${inputMessage}" konusunda size yardımcı olabilirim. İşte önerilerim:

1. **İçerik Yapısı**: Konuyu giriş, gelişim ve sonuç bölümlerine ayırabiliriz.
2. **Hedef Kitle**: Kimler için yazıyoruz, hangi yaş grubu?
3. **Ton ve Stil**: Resmi mi, günlük mi, eğlenceli mi olsun?

Hangi konuda daha detaya girmek istiyorsunuz?`,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, aiMessage])
      setIsLoading(false)
    }, 2000)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content)
  }

  const downloadContent = () => {
    const allMessages = messages
      .filter(msg => msg.type === 'ai')
      .map(msg => msg.content)
      .join('\n\n')
    
    const blob = new Blob([allMessages], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'cspark-ai-content.txt'
    a.click()
  }

  return (
    <div className={`min-h-screen relative overflow-hidden transition-all duration-500 ${
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
              opacity: isDarkMode ? octopus.opacity : octopus.opacity * 0.3,
              transform: `rotate(${octopus.rotation}deg)`,
              animationDelay: `${octopus.animationDelay}s`,
              animationDuration: `${6 + Math.random() * 4}s`,
              filter: isDarkMode ? 'none' : 'hue-rotate(180deg) brightness(1.5)'
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
          : 'bg-white/20 border-gray-200/30'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Back Button & Logo */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/app')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors duration-200 ${
                  isDarkMode 
                    ? 'bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white' 
                    : 'bg-gray-200/50 hover:bg-gray-200/70 text-gray-700 hover:text-gray-900'
                }`}
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Geri</span>
              </button>
              
              <div className="flex items-center gap-3">
                <div className={`relative w-10 h-10 flex items-center justify-center rounded-full shadow-lg backdrop-blur-sm border transition-all duration-500 ${
                  isDarkMode 
                    ? 'bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-purple-500/30' 
                    : 'bg-gradient-to-br from-blue-500/20 to-purple-500/20 border-blue-500/30'
                }`}>
                  <Image
                    src="/octopus-logo.png"
                    alt="CSpark"
                    width={28}
                    height={28}
                    className="object-contain animate-pulse"
                  />
                </div>
                <div>
                  <div className={`text-xl font-bold bg-gradient-to-r bg-clip-text text-transparent transition-all duration-500 ${
                    isDarkMode 
                      ? 'from-purple-300 to-pink-300' 
                      : 'from-purple-600 to-pink-600'
                  }`}>
                    🐙 CSpark
                  </div>
                  <div className={`text-xs -mt-1 transition-colors duration-500 ${
                    isDarkMode ? 'text-purple-300' : 'text-purple-600'
                  }`}>AI İçerik Üretici</div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              {/* Theme Toggle */}
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 text-sm ${
                  isDarkMode 
                    ? 'bg-yellow-600/20 hover:bg-yellow-600/30 text-yellow-300' 
                    : 'bg-purple-600/20 hover:bg-purple-600/30 text-purple-600'
                }`}
                title={isDarkMode ? 'Açık Temaya Geç' : 'Koyu Temaya Geç'}
              >
                {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                <span className="hidden sm:inline">{isDarkMode ? 'Açık' : 'Koyu'}</span>
              </button>
              
              <button
                onClick={downloadContent}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors duration-200 text-sm ${
                  isDarkMode 
                    ? 'bg-green-600/20 hover:bg-green-600/30 text-green-300' 
                    : 'bg-green-600/20 hover:bg-green-600/30 text-green-600'
                }`}
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">İndir</span>
              </button>
              <button
                onClick={() => setMessages([messages[0]])}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors duration-200 text-sm ${
                  isDarkMode 
                    ? 'bg-yellow-600/20 hover:bg-yellow-600/30 text-yellow-300' 
                    : 'bg-orange-600/20 hover:bg-orange-600/30 text-orange-600'
                }`}
              >
                <RefreshCw className="w-4 h-4" />
                <span className="hidden sm:inline">Temizle</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Container */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col h-[calc(100vh-4rem)]">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-6 mb-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-4 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.type === 'ai' && (
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-500 ${
                  isDarkMode 
                    ? 'bg-gradient-to-br from-purple-500 to-pink-500' 
                    : 'bg-gradient-to-br from-blue-500 to-purple-500'
                }`}>
                  <div className="text-lg">🐙</div>
                </div>
              )}
              
              <div className={`max-w-[80%] ${message.type === 'user' ? 'order-2' : ''}`}>
                <div
                  className={`p-4 rounded-2xl transition-all duration-500 ${
                    message.type === 'user'
                      ? isDarkMode 
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                        : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                      : isDarkMode
                        ? 'bg-white/10 backdrop-blur-md border border-white/20 text-gray-100'
                        : 'bg-white/80 backdrop-blur-md border border-gray-200/50 text-gray-800'
                  }`}
                >
                  <div className="whitespace-pre-wrap">{message.content}</div>
                </div>
                
                <div className={`flex items-center gap-2 mt-2 text-xs transition-colors duration-500 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  <span>{message.timestamp.toLocaleTimeString()}</span>
                  {message.type === 'ai' && (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => copyMessage(message.content)}
                        className={`p-1 rounded transition-colors duration-200 ${
                          isDarkMode ? 'hover:bg-white/10' : 'hover:bg-gray-200/50'
                        }`}
                        title="Kopyala"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                      <button
                        className={`p-1 rounded transition-colors duration-200 ${
                          isDarkMode ? 'hover:bg-white/10' : 'hover:bg-gray-200/50'
                        }`}
                        title="Beğen"
                      >
                        <Heart className="w-3 h-3" />
                      </button>
                      <button
                        className={`p-1 rounded transition-colors duration-200 ${
                          isDarkMode ? 'hover:bg-white/10' : 'hover:bg-gray-200/50'
                        }`}
                        title="Paylaş"
                      >
                        <Share2 className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {message.type === 'user' && (
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0 order-3">
                  <User className="w-5 h-5 text-white" />
                </div>
              )}
            </div>
          ))}

          {/* Loading */}
          {isLoading && (
            <div className="flex gap-4 justify-start">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <span className="text-gray-300 text-sm ml-2">AI düşünüyor...</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className={`backdrop-blur-md rounded-xl border p-4 transition-all duration-500 ${
          isDarkMode 
            ? 'bg-white/5 border-white/20' 
            : 'bg-white/60 border-gray-200/50'
        }`}>
          <div className="flex items-end gap-3">
            <div className="flex-1">
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="🐙 CSpark AI asistanınıza bir mesaj yazın..."
                className={`w-full bg-transparent resize-none outline-none min-h-[60px] max-h-[120px] transition-colors duration-500 ${
                  isDarkMode 
                    ? 'text-white placeholder-gray-400' 
                    : 'text-gray-800 placeholder-gray-500'
                }`}
                rows={2}
              />
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsListening(!isListening)}
                className={`p-3 rounded-lg transition-colors duration-200 ${
                  isListening 
                    ? 'bg-red-600/20 text-red-300 hover:bg-red-600/30' 
                    : isDarkMode
                      ? 'bg-blue-600/20 text-blue-300 hover:bg-blue-600/30'
                      : 'bg-blue-600/20 text-blue-600 hover:bg-blue-600/30'
                }`}
                title={isListening ? 'Dinlemeyi Durdur' : 'Sesli Mesaj'}
              >
                {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>
              
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isLoading}
                className={`p-3 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-all duration-200 flex items-center justify-center ${
                  isDarkMode
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
                    : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
                }`}
                title="Gönder"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          {/* Quick Actions */}
          <div className="flex items-center gap-2 mt-3 flex-wrap">
            <span className={`text-xs transition-colors duration-500 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>🚀 Hızlı başlangıç:</span>
            {[
              '📝 Blog yazısı yaz',
              '📱 Sosyal medya gönderisi',
              '📧 E-posta şablonu',
              '🛍️ Ürün açıklaması'
            ].map((suggestion, index) => (
              <button
                key={index}
                onClick={() => setInputMessage(suggestion)}
                className={`text-xs px-3 py-1 rounded-full transition-all duration-200 hover:scale-105 ${
                  isDarkMode 
                    ? 'bg-white/10 hover:bg-white/20 text-gray-300' 
                    : 'bg-gray-200/60 hover:bg-gray-200/80 text-gray-700'
                }`}
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
