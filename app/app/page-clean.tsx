'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { 
  User, 
  Settings, 
  LogOut,
  FileText,
  Edit3,
  Sparkles,
  Zap,
  Clock,
  TrendingUp,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Calendar,
  BookOpen,
  PenTool,
  MessageSquare,
  Mail,
  Share2,
  Download,
  Heart,
  Eye,
  Copy,
  Trash2
} from 'lucide-react'

interface ContentItem {
  id: string
  title: string
  type: 'blog' | 'social' | 'email' | 'ad'
  content: string
  createdAt: string
  wordCount: number
  status: 'draft' | 'completed'
}

export default function AppPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'dashboard' | 'content' | 'templates'>('dashboard')
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'blog' | 'social' | 'email' | 'ad'>('all')

  // Animated background octopi
  const backgroundOctopi = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    size: Math.random() * 15 + 10,
    opacity: Math.random() * 0.06 + 0.02,
    left: Math.random() * 100,
    top: Math.random() * 100,
    rotation: Math.random() * 360,
    animationDelay: Math.random() * 5
  }))

  // Mock content data
  const [contentItems] = useState<ContentItem[]>([
    {
      id: '1',
      title: 'E-ticaret Mağazanız İçin SEO Rehberi',
      type: 'blog',
      content: 'E-ticaret SEO stratejileri ile online mağazanızın görünürlüğünü artırın...',
      createdAt: '2024-01-20',
      wordCount: 1250,
      status: 'completed'
    },
    {
      id: '2',
      title: 'Instagram Hikaye Serisi',
      type: 'social',
      content: 'Markanızı öne çıkaracak yaratıcı Instagram hikayeleri...',
      createdAt: '2024-01-19',
      wordCount: 320,
      status: 'draft'
    },
    {
      id: '3',
      title: 'Haftalık Newsletter',
      type: 'email',
      content: 'Müşterilerinizle etkili iletişim kuracak e-posta içeriği...',
      createdAt: '2024-01-18',
      wordCount: 680,
      status: 'completed'
    }
  ])

  const handleLogout = () => {
    localStorage.removeItem('rememberedEmail')
    localStorage.removeItem('rememberMe')
    router.push('/login')
  }

  const filteredContent = contentItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = selectedFilter === 'all' || item.type === selectedFilter
    return matchesSearch && matchesFilter
  })

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'blog': return <BookOpen className="w-4 h-4" />
      case 'social': return <MessageSquare className="w-4 h-4" />
      case 'email': return <Mail className="w-4 h-4" />
      case 'ad': return <Sparkles className="w-4 h-4" />
      default: return <FileText className="w-4 h-4" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'blog': return 'text-blue-400 bg-blue-400/10'
      case 'social': return 'text-green-400 bg-green-400/10'
      case 'email': return 'text-orange-400 bg-orange-400/10'
      case 'ad': return 'text-purple-400 bg-purple-400/10'
      default: return 'text-gray-400 bg-gray-400/10'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
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
              opacity: octopus.opacity,
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
      <div className="relative z-10 bg-black/20 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo & Brand */}
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => router.push('/app')}>
              <div className="relative w-8 h-8 flex items-center justify-center rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 shadow-lg backdrop-blur-sm border border-purple-500/30">
                <Image
                  src="/octopus-logo.png"
                  alt="CSpark"
                  width={24}
                  height={24}
                  className="object-contain"
                />
              </div>
              <div>
                <div className="text-xl font-bold bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
                  CSpark
                </div>
                <div className="text-xs text-purple-300 -mt-1">AI Studio</div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              {[
                { id: 'dashboard', label: 'Dashboard', icon: TrendingUp },
                { id: 'content', label: 'İçerikler', icon: FileText },
                { id: 'templates', label: 'Şablonlar', icon: Edit3 }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-purple-600/30 to-pink-600/30 border border-purple-500/50 text-white'
                      : 'text-gray-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              ))}
            </nav>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-3 p-2 hover:bg-white/10 rounded-lg transition-colors duration-200 group"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div className="hidden sm:block text-left">
                  <div className="text-sm font-medium text-white">Ahmet Y.</div>
                  <div className="text-xs text-gray-400">Pro Plan</div>
                </div>
              </button>

              {/* Dropdown Menu */}
              {showUserMenu && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-black/80 backdrop-blur-md border border-white/20 rounded-xl shadow-xl z-50">
                  <div className="p-2">
                    <button
                      onClick={() => {
                        router.push('/profile')
                        setShowUserMenu(false)
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2 text-left text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors duration-200"
                    >
                      <User className="w-4 h-4" />
                      <span>Profil</span>
                    </button>
                    <button
                      onClick={() => {
                        router.push('/settings')
                        setShowUserMenu(false)
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2 text-left text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors duration-200"
                    >
                      <Settings className="w-4 h-4" />
                      <span>Ayarlar</span>
                    </button>
                    <hr className="my-2 border-white/10" />
                    <button
                      onClick={() => {
                        handleLogout()
                        setShowUserMenu(false)
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2 text-left text-red-300 hover:text-red-200 hover:bg-red-600/10 rounded-lg transition-colors duration-200"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Çıkış Yap</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-white mb-2">Hoş geldin, Ahmet!</h1>
                  <p className="text-gray-300">Bugün hangi içeriği oluşturacaksın?</p>
                </div>
                <button
                  onClick={() => setActiveTab('templates')}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg transition-all duration-200 group"
                >
                  <Plus className="w-5 h-5" />
                  <span className="font-medium">Yeni İçerik</span>
                </button>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: 'Bu Ay Üretilen', value: '23', icon: FileText, color: 'blue' },
                { label: 'Toplam Kelime', value: '12.5K', icon: Edit3, color: 'green' },
                { label: 'Kalan Kredi', value: '850', icon: Zap, color: 'yellow' },
                { label: 'Aktif Proje', value: '7', icon: Clock, color: 'purple' }
              ].map((stat, index) => (
                <div key={index} className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-10 h-10 rounded-lg bg-${stat.color}-600/20 flex items-center justify-center`}>
                      <stat.icon className={`w-5 h-5 text-${stat.color}-400`} />
                    </div>
                    <TrendingUp className="w-4 h-4 text-green-400" />
                  </div>
                  <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Recent Content */}
            <div className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">Son İçerikler</h2>
                <button
                  onClick={() => setActiveTab('content')}
                  className="text-purple-400 hover:text-purple-300 text-sm font-medium transition-colors duration-200"
                >
                  Tümünü Gör →
                </button>
              </div>
              <div className="space-y-4">
                {contentItems.slice(0, 3).map((item) => (
                  <div key={item.id} className="flex items-center gap-4 p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors duration-200 cursor-pointer">
                    <div className={`w-10 h-10 rounded-lg ${getTypeColor(item.type)} flex items-center justify-center`}>
                      {getTypeIcon(item.type)}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-white">{item.title}</div>
                      <div className="text-sm text-gray-400">{item.wordCount} kelime • {item.createdAt}</div>
                    </div>
                    <div className={`px-2 py-1 rounded text-xs font-medium ${
                      item.status === 'completed' ? 'bg-green-600/20 text-green-400' : 'bg-yellow-600/20 text-yellow-400'
                    }`}>
                      {item.status === 'completed' ? 'Tamamlandı' : 'Taslak'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Content Tab */}
        {activeTab === 'content' && (
          <div className="space-y-6">
            {/* Search & Filter */}
            <div className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="İçeriklerde ara..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200"
                  />
                </div>
                <select
                  value={selectedFilter}
                  onChange={(e) => setSelectedFilter(e.target.value as any)}
                  className="px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200"
                >
                  <option value="all">Tüm Türler</option>
                  <option value="blog">Blog Yazıları</option>
                  <option value="social">Sosyal Medya</option>
                  <option value="email">E-posta</option>
                  <option value="ad">Reklamlar</option>
                </select>
              </div>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredContent.map((item) => (
                <div key={item.id} className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 p-6 hover:bg-white/10 transition-all duration-200 group cursor-pointer">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-10 h-10 rounded-lg ${getTypeColor(item.type)} flex items-center justify-center`}>
                      {getTypeIcon(item.type)}
                    </div>
                    <button className="opacity-0 group-hover:opacity-100 p-1 hover:bg-white/10 rounded transition-all duration-200">
                      <MoreVertical className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                  <h3 className="font-semibold text-white mb-2 line-clamp-2">{item.title}</h3>
                  <p className="text-sm text-gray-400 mb-4 line-clamp-3">{item.content}</p>
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-gray-500">{item.wordCount} kelime</div>
                    <div className={`px-2 py-1 rounded text-xs font-medium ${
                      item.status === 'completed' ? 'bg-green-600/20 text-green-400' : 'bg-yellow-600/20 text-yellow-400'
                    }`}>
                      {item.status === 'completed' ? 'Tamamlandı' : 'Taslak'}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button className="flex items-center gap-1 px-2 py-1 text-xs text-gray-400 hover:text-white transition-colors duration-200">
                      <Eye className="w-3 h-3" />
                      Görüntüle
                    </button>
                    <button className="flex items-center gap-1 px-2 py-1 text-xs text-gray-400 hover:text-white transition-colors duration-200">
                      <Copy className="w-3 h-3" />
                      Kopyala
                    </button>
                    <button className="flex items-center gap-1 px-2 py-1 text-xs text-gray-400 hover:text-white transition-colors duration-200">
                      <Share2 className="w-3 h-3" />
                      Paylaş
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Templates Tab */}
        {activeTab === 'templates' && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-4">İçerik Şablonları</h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Profesyonel kalitede içerik üretmek için hazırlanmış şablonlarımızdan birini seçin
              </p>
            </div>

            {/* Template Categories */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: 'Blog Yazıları',
                  description: 'SEO dostu blog yazıları ve makaleler',
                  icon: BookOpen,
                  color: 'blue',
                  templates: ['Nasıl Yapılır Rehberi', 'Ürün İncelemesi', 'Sektör Analizi']
                },
                {
                  title: 'Sosyal Medya',
                  description: 'Instagram, Twitter ve LinkedIn paylaşımları',
                  icon: MessageSquare,
                  color: 'green',
                  templates: ['Instagram Gönderi', 'Twitter Thread', 'LinkedIn Makale']
                },
                {
                  title: 'E-posta Pazarlama',
                  description: 'Etkili e-posta kampanyaları ve newsletter',
                  icon: Mail,
                  color: 'orange',
                  templates: ['Hoş Geldin E-postası', 'Ürün Tanıtımı', 'Haftalık Bülten']
                },
                {
                  title: 'Reklam Metinleri',
                  description: 'Google Ads ve Facebook reklam metinleri',
                  icon: Sparkles,
                  color: 'purple',
                  templates: ['Google Ads', 'Facebook Reklamı', 'YouTube Açıklama']
                },
                {
                  title: 'Web İçeriği',
                  description: 'Web sitesi sayfa içerikleri ve açıklamalar',
                  icon: PenTool,
                  color: 'pink',
                  templates: ['Ana Sayfa', 'Hakkımızda', 'Ürün Açıklaması']
                },
                {
                  title: 'Kreatif Yazım',
                  description: 'Hikaye, senaryo ve kreatif metinler',
                  icon: Edit3,
                  color: 'indigo',
                  templates: ['Kısa Hikaye', 'Video Senaryosu', 'Kreatif Metin']
                }
              ].map((category, index) => (
                <div key={index} className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 p-6 hover:bg-white/10 transition-all duration-200 group cursor-pointer">
                  <div className={`w-12 h-12 rounded-xl bg-${category.color}-600/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200`}>
                    <category.icon className={`w-6 h-6 text-${category.color}-400`} />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{category.title}</h3>
                  <p className="text-sm text-gray-400 mb-4">{category.description}</p>
                  <div className="space-y-2">
                    {category.templates.map((template, idx) => (
                      <div key={idx} className="text-xs text-gray-500 bg-white/5 rounded px-2 py-1 inline-block mr-2">
                        {template}
                      </div>
                    ))}
                  </div>
                  <button className="w-full mt-4 py-2 bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 text-purple-300 rounded-lg hover:from-purple-600/30 hover:to-pink-600/30 transition-all duration-200 opacity-0 group-hover:opacity-100">
                    Şablonları Keşfet
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Click outside to close menu */}
      {showUserMenu && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowUserMenu(false)}
        ></div>
      )}
    </div>
  )
}
