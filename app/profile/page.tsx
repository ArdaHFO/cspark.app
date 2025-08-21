'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { 
  ArrowLeft, 
  User, 
  Settings, 
  CreditCard, 
  BarChart3, 
  Zap, 
  Crown, 
  Calendar,
  Clock,
  FileText,
  Target,
  TrendingUp,
  Shield,
  Bell,
  Palette,
  Globe,
  LogOut,
  Edit,
  Save,
  X
} from 'lucide-react'

interface UserStats {
  contentGenerated: number
  wordsGenerated: number
  planType: 'Free' | 'Pro' | 'Premium'
  remainingCredits: number
  totalCredits: number
  joinDate: string
  lastActive: string
}

interface UserProfile {
  name: string
  email: string
  avatar?: string
  stats: UserStats
}

export default function ProfilePage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'overview' | 'usage'>('overview')
  const [isEditing, setIsEditing] = useState(false)
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(true)
  
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme')
    setIsDarkMode(savedTheme === 'dark' || !savedTheme)
  }, [])

  const toggleTheme = () => {
    const newTheme = !isDarkMode
    setIsDarkMode(newTheme)
    localStorage.setItem('theme', newTheme ? 'dark' : 'light')
  }
  
  // Mock user data - gerçek uygulamada API'den gelecek
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: 'Ahmet Yılmaz',
    email: 'ahmet@example.com',
    stats: {
      contentGenerated: 47,
      wordsGenerated: 12340,
      planType: 'Pro',
      remainingCredits: 850,
      totalCredits: 1000,
      joinDate: '2024-01-15',
      lastActive: '2024-01-25'
    }
  })

  const [editForm, setEditForm] = useState({
    name: userProfile.name,
    email: userProfile.email
  })

  // Animasyonlu octopus arka plan elemanları
  const backgroundOctopi = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    size: Math.random() * 20 + 15,
    opacity: Math.random() * 0.1 + 0.03,
    left: Math.random() * 100,
    top: Math.random() * 100,
    rotation: Math.random() * 360,
    animationDelay: Math.random() * 5
  }))

  const handleSaveProfile = () => {
    setUserProfile(prev => ({
      ...prev,
      name: editForm.name,
      email: editForm.email
    }))
    setIsEditing(false)
  }

  const handleLogout = () => {
    // localStorage'dan credential'ları temizle
    localStorage.removeItem('rememberedEmail')
    localStorage.removeItem('rememberMe')
    router.push('/login')
  }

  const progressPercentage = (userProfile.stats.remainingCredits / userProfile.stats.totalCredits) * 100

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
                <div className={`relative w-8 h-8 flex items-center justify-center rounded-full shadow-lg backdrop-blur-sm border transition-all duration-500 ${
                  isDarkMode 
                    ? 'bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-purple-500/30' 
                    : 'bg-gradient-to-br from-blue-500/20 to-purple-500/20 border-blue-500/30'
                }`}>
                  <Image
                    src="/octopus-logo.png"
                    alt="CSpark"
                    width={24}
                    height={24}
                    className="object-contain"
                  />
                </div>
                <h1 className={`text-xl font-bold bg-clip-text text-transparent transition-all duration-500 ${
                  isDarkMode 
                    ? 'bg-gradient-to-r from-purple-300 to-pink-300' 
                    : 'bg-gradient-to-r from-blue-600 to-purple-600'
                }`}>
                  🐙 CSpark Profil
                </h1>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-lg transition-all duration-200 group ${
                  isDarkMode ? 'hover:bg-white/10' : 'hover:bg-gray-200/20'
                }`}
                title={isDarkMode ? 'Açık temaya geç' : 'Koyu temaya geç'}
              >
                {isDarkMode ? (
                  <span className="text-2xl group-hover:scale-110 transition-transform duration-200">☀️</span>
                ) : (
                  <span className="text-2xl group-hover:scale-110 transition-transform duration-200">🌙</span>
                )}
              </button>
              <button
                onClick={() => setShowLogoutModal(true)}
                className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-all duration-200 ${
                  isDarkMode 
                    ? 'bg-red-600/20 hover:bg-red-600/30 text-red-300 hover:text-red-200 border-red-600/30' 
                    : 'bg-red-500/10 hover:bg-red-500/20 text-red-600 hover:text-red-700 border-red-500/30'
                }`}
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Çıkış Yap</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className={`backdrop-blur-md rounded-2xl border p-6 shadow-xl transition-all duration-500 ${
              isDarkMode 
                ? 'bg-white/5 border-white/10' 
                : 'bg-white/60 border-gray-200/30'
            }`}>
              {/* User Avatar & Info */}
              <div className="text-center mb-6">
                <div className="relative w-20 h-20 mx-auto mb-4">
                  <div className={`w-full h-full rounded-full flex items-center justify-center shadow-lg transition-all duration-500 ${
                    isDarkMode 
                      ? 'bg-gradient-to-br from-purple-500 to-pink-500' 
                      : 'bg-gradient-to-br from-blue-500 to-purple-500'
                  }`}>
                    <User className="w-10 h-10 text-white" />
                  </div>
                  <div className={`absolute -bottom-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${
                    isDarkMode 
                      ? 'bg-gradient-to-r from-yellow-400 to-orange-500 border-slate-900' 
                      : 'bg-gradient-to-r from-yellow-400 to-orange-500 border-white'
                  }`}>
                    <Crown className="w-4 h-4 text-white" />
                  </div>
                </div>
                <h2 className={`text-lg font-semibold mb-1 transition-colors duration-500 ${
                  isDarkMode ? 'text-white' : 'text-gray-800'
                }`}>{userProfile.name}</h2>
                <p className={`text-sm transition-colors duration-500 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>{userProfile.email}</p>
                <span className={`inline-block px-3 py-1 border rounded-full text-xs font-medium mt-2 transition-all duration-500 ${
                  isDarkMode 
                    ? 'bg-gradient-to-r from-purple-600/20 to-pink-600/20 border-purple-500/30 text-purple-300' 
                    : 'bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-blue-500/30 text-blue-600'
                }`}>
                  🐙 {userProfile.stats.planType} Plan
                </span>
              </div>

              {/* Navigation Tabs */}
              <nav className="space-y-2">
                {[
                  { id: 'overview', label: 'Genel Bakış', icon: BarChart3 },
                  { id: 'usage', label: 'Kullanım İstatistikleri', icon: TrendingUp }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-left ${
                      activeTab === tab.id
                        ? isDarkMode 
                          ? 'bg-gradient-to-r from-purple-600/30 to-pink-600/30 border border-purple-500/50 text-white shadow-lg'
                          : 'bg-gradient-to-r from-blue-600/30 to-purple-600/30 border border-blue-500/50 text-gray-800 shadow-lg'
                        : isDarkMode
                          ? 'hover:bg-white/5 text-gray-300 hover:text-white'
                          : 'hover:bg-gray-200/20 text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    <tab.icon className="w-5 h-5" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className={`backdrop-blur-md rounded-2xl border p-6 shadow-xl transition-all duration-500 ${
              isDarkMode 
                ? 'bg-white/5 border-white/10' 
                : 'bg-white/60 border-gray-200/30'
            }`}>
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <BarChart3 className={`w-6 h-6 transition-colors duration-500 ${
                      isDarkMode ? 'text-purple-400' : 'text-blue-500'
                    }`} />
                    <h3 className={`text-2xl font-bold transition-colors duration-500 ${
                      isDarkMode ? 'text-white' : 'text-gray-800'
                    }`}>🐙 Genel Bakış</h3>
                  </div>

                  {/* Credit Usage Card */}
                  <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-semibold text-white">Kalan Kredi</h4>
                      <Zap className="w-6 h-6 text-yellow-400" />
                    </div>
                    <div className="mb-4">
                      <div className="flex justify-between text-sm text-gray-300 mb-2">
                        <span>{userProfile.stats.remainingCredits} kalan</span>
                        <span>{userProfile.stats.totalCredits} toplam</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-3">
                        <div
                          className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-500"
                          style={{ width: `${progressPercentage}%` }}
                        ></div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-400">
                      Bu ay {userProfile.stats.totalCredits - userProfile.stats.remainingCredits} kredi kullandınız
                    </p>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                      <div className="flex items-center gap-3 mb-2">
                        <FileText className="w-5 h-5 text-blue-400" />
                        <span className="text-sm text-gray-400">Üretilen İçerik</span>
                      </div>
                      <div className="text-2xl font-bold text-white">{userProfile.stats.contentGenerated}</div>
                      <div className="text-xs text-green-400">+12 bu ay</div>
                    </div>

                    <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                      <div className="flex items-center gap-3 mb-2">
                        <Target className="w-5 h-5 text-green-400" />
                        <span className="text-sm text-gray-400">Toplam Kelime</span>
                      </div>
                      <div className="text-2xl font-bold text-white">{userProfile.stats.wordsGenerated.toLocaleString()}</div>
                      <div className="text-xs text-green-400">+2.4K bu ay</div>
                    </div>

                    <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                      <div className="flex items-center gap-3 mb-2">
                        <Clock className="w-5 h-5 text-purple-400" />
                        <span className="text-sm text-gray-400">Aktif Süre</span>
                      </div>
                      <div className="text-2xl font-bold text-white">47h</div>
                      <div className="text-xs text-green-400">+8h bu hafta</div>
                    </div>
                  </div>

                  {/* Recent Activity */}
                  <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                    <h4 className="text-lg font-semibold text-white mb-4">Son Aktiviteler</h4>
                    <div className="space-y-3">
                      {[
                        { action: 'Blog yazısı oluşturuldu', time: '2 saat önce', type: 'content' },
                        { action: 'SEO metinleri üretildi', time: '5 saat önce', type: 'seo' },
                        { action: 'Sosyal medya gönderileri', time: '1 gün önce', type: 'social' },
                        { action: 'E-mail kampanyası metni', time: '2 gün önce', type: 'email' }
                      ].map((activity, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                          <div className="flex-1">
                            <div className="text-sm text-white">{activity.action}</div>
                            <div className="text-xs text-gray-400">{activity.time}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Usage Tab */}
              {activeTab === 'usage' && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <TrendingUp className="w-6 h-6 text-purple-400" />
                    <h3 className="text-2xl font-bold text-white">Kullanım İstatistikleri</h3>
                  </div>

                  {/* Usage Charts - Placeholder */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                      <h4 className="text-lg font-semibold text-white mb-4">Aylık Kullanım</h4>
                      <div className="h-40 bg-gradient-to-t from-purple-600/20 to-transparent rounded-lg flex items-end justify-center">
                        <div className="text-6xl text-purple-400/30">📊</div>
                      </div>
                      <div className="mt-4 text-center text-gray-400">
                        Bu ay toplam {userProfile.stats.totalCredits - userProfile.stats.remainingCredits} kredi kullanıldı
                      </div>
                    </div>

                    <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                      <h4 className="text-lg font-semibold text-white mb-4">İçerik Türleri</h4>
                      <div className="space-y-3">
                        {[
                          { type: 'Blog Yazıları', count: 23, percentage: 48 },
                          { type: 'Sosyal Medya', count: 15, percentage: 32 },
                          { type: 'E-posta', count: 9, percentage: 20 }
                        ].map((item, index) => (
                          <div key={index} className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-white">{item.type}</span>
                              <span className="text-gray-400">{item.count} adet</span>
                            </div>
                            <div className="w-full bg-gray-700 rounded-full h-2">
                              <div
                                className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                                style={{ width: `${item.percentage}%` }}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Detailed Stats */}
                  <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                    <h4 className="text-lg font-semibold text-white mb-4">Detaylı İstatistikler</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {[
                        { label: 'Ortalama Kelime/İçerik', value: '262', icon: Target },
                        { label: 'En Verimli Gün', value: 'Salı', icon: Calendar },
                        { label: 'Toplam Oturum', value: '89', icon: Clock },
                        { label: 'Başarı Oranı', value: '%94', icon: TrendingUp }
                      ].map((stat, index) => (
                        <div key={index} className="bg-white/5 rounded-lg p-4 border border-white/10">
                          <div className="flex items-center gap-2 mb-2">
                            <stat.icon className="w-4 h-4 text-purple-400" />
                            <span className="text-xs text-gray-400">{stat.label}</span>
                          </div>
                          <div className="text-xl font-bold text-white">{stat.value}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Logout Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 max-w-md w-full mx-4 shadow-xl">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <LogOut className="w-8 h-8 text-red-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Çıkış Yapmak İstediğinizden Emin misiniz?</h3>
              <p className="text-gray-400 mb-6">
                Oturumunuz sonlandırılacak ve giriş sayfasına yönlendirileceksiniz.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowLogoutModal(false)}
                  className="flex-1 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all duration-200"
                >
                  İptal
                </button>
                <button
                  onClick={handleLogout}
                  className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all duration-200"
                >
                  Çıkış Yap
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
