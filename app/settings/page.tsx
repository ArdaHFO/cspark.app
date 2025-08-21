'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { 
  ArrowLeft, 
  Settings, 
  Bell, 
  Shield, 
  Palette,
  Globe,
  Key,
  Download,
  Trash2,
  Save,
  Edit,
  X,
  Eye,
  EyeOff,
  AlertTriangle
} from 'lucide-react'

export default function SettingsPage() {
  const router = useRouter()
  const [activeSection, setActiveSection] = useState<'general' | 'notifications' | 'security' | 'preferences' | 'data'>('general')
  const [isEditing, setIsEditing] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(true)

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme')
    setIsDarkMode(savedTheme === 'dark' || !savedTheme)
  }, [])

  const toggleTheme = () => {
    const newTheme = !isDarkMode
    setIsDarkMode(newTheme)
    localStorage.setItem('theme', newTheme ? 'dark' : 'light')
    setGeneralSettings(prev => ({
      ...prev,
      theme: newTheme ? 'dark' : 'light'
    }))
  }

  // Form states
  const [generalSettings, setGeneralSettings] = useState({
    language: 'tr',
    timezone: 'Europe/Istanbul',
    theme: 'dark',
    autoSave: true
  })

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    creditAlerts: true,
    weeklyReports: true,
    productUpdates: false,
    marketingEmails: false
  })

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    sessionTimeout: '24h',
    loginAlerts: true
  })

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  // Animated background octopi
  const backgroundOctopi = Array.from({ length: 10 }, (_, i) => ({
    id: i,
    size: Math.random() * 12 + 8,
    opacity: Math.random() * 0.05 + 0.02,
    left: Math.random() * 100,
    top: Math.random() * 100,
    rotation: Math.random() * 360,
    animationDelay: Math.random() * 5
  }))

  const handleSaveSettings = () => {
    // Simulate API call to save settings
    console.log('Settings saved:', { generalSettings, notificationSettings, securitySettings })
    setIsEditing(false)
  }

  const handlePasswordChange = () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert('Yeni şifreler eşleşmiyor!')
      return
    }
    
    // Simulate API call to change password
    console.log('Password change requested')
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
    alert('Şifreniz başarıyla değiştirildi!')
  }

  const handleDeleteAccount = () => {
    // Simulate account deletion
    console.log('Account deletion requested')
    setShowDeleteModal(false)
    router.push('/login')
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
      <div className="relative z-10 bg-black/20 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/app')}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors duration-200 group"
              >
                <ArrowLeft className="w-5 h-5 text-gray-300 group-hover:text-white group-hover:-translate-x-1 transition-all duration-200" />
              </button>
              <div className="flex items-center gap-3">
                <div className="relative w-8 h-8 flex items-center justify-center rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 shadow-lg backdrop-blur-sm border border-purple-500/30">
                  <Image
                    src="/octopus-logo.png"
                    alt="CSpark"
                    width={24}
                    height={24}
                    className="object-contain"
                  />
                </div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
                  Ayarlar
                </h1>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6 shadow-xl">
              <nav className="space-y-2">
                {[
                  { id: 'general', label: 'Genel Ayarlar', icon: Settings },
                  { id: 'notifications', label: 'Bildirimler', icon: Bell },
                  { id: 'security', label: 'Güvenlik', icon: Shield },
                  { id: 'preferences', label: 'Tercihler', icon: Palette },
                  { id: 'data', label: 'Veri & Gizlilik', icon: Globe }
                ].map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id as any)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-left ${
                      activeSection === section.id
                        ? 'bg-gradient-to-r from-purple-600/30 to-pink-600/30 border border-purple-500/50 text-white shadow-lg'
                        : 'hover:bg-white/5 text-gray-300 hover:text-white'
                    }`}
                  >
                    <section.icon className="w-5 h-5" />
                    <span className="font-medium">{section.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6 shadow-xl">
              {/* General Settings */}
              {activeSection === 'general' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-bold text-white">Genel Ayarlar</h3>
                    <button
                      onClick={() => setIsEditing(!isEditing)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                        isEditing
                          ? 'bg-red-600/20 text-red-300 border border-red-600/30'
                          : 'bg-purple-600/20 text-purple-300 border border-purple-600/30'
                      }`}
                    >
                      {isEditing ? <X className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
                      {isEditing ? 'İptal' : 'Düzenle'}
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Dil</label>
                      <select
                        value={generalSettings.language}
                        onChange={(e) => setGeneralSettings(prev => ({ ...prev, language: e.target.value }))}
                        disabled={!isEditing}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200 disabled:opacity-50"
                      >
                        <option value="tr">Türkçe</option>
                        <option value="en">English</option>
                        <option value="de">Deutsch</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Saat Dilimi</label>
                      <select
                        value={generalSettings.timezone}
                        onChange={(e) => setGeneralSettings(prev => ({ ...prev, timezone: e.target.value }))}
                        disabled={!isEditing}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200 disabled:opacity-50"
                      >
                        <option value="Europe/Istanbul">İstanbul (UTC+3)</option>
                        <option value="Europe/London">Londra (UTC+0)</option>
                        <option value="America/New_York">New York (UTC-5)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Tema</label>
                      <select
                        value={generalSettings.theme}
                        onChange={(e) => setGeneralSettings(prev => ({ ...prev, theme: e.target.value }))}
                        disabled={!isEditing}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200 disabled:opacity-50"
                      >
                        <option value="dark">Koyu Tema</option>
                        <option value="light">Açık Tema</option>
                        <option value="auto">Otomatik</option>
                      </select>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                      <div>
                        <div className="font-medium text-white">Otomatik Kaydetme</div>
                        <div className="text-sm text-gray-400">Çalışmaları otomatik kaydet</div>
                      </div>
                      <input
                        type="checkbox"
                        checked={generalSettings.autoSave}
                        onChange={(e) => setGeneralSettings(prev => ({ ...prev, autoSave: e.target.checked }))}
                        disabled={!isEditing}
                        className="w-5 h-5 rounded border-gray-600 bg-gray-800 text-purple-600 focus:ring-purple-500 disabled:opacity-50"
                      />
                    </div>
                  </div>

                  {isEditing && (
                    <div className="flex gap-3">
                      <button
                        onClick={handleSaveSettings}
                        className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200"
                      >
                        <Save className="w-4 h-4" />
                        Kaydet
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Notifications */}
              {activeSection === 'notifications' && (
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-white">Bildirim Ayarları</h3>
                  <div className="space-y-4">
                    {[
                      { key: 'emailNotifications', label: 'E-posta Bildirimleri', desc: 'Önemli güncellemeler için e-posta al' },
                      { key: 'creditAlerts', label: 'Kredi Uyarıları', desc: 'Krediniz azaldığında bildirim al' },
                      { key: 'weeklyReports', label: 'Haftalık Raporlar', desc: 'Kullanım istatistiklerini e-posta ile al' },
                      { key: 'productUpdates', label: 'Ürün Güncellemeleri', desc: 'Yeni özellikler hakkında bilgi al' },
                      { key: 'marketingEmails', label: 'Pazarlama E-postaları', desc: 'Promosyon ve kampanya e-postaları' }
                    ].map((setting) => (
                      <div key={setting.key} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                        <div>
                          <div className="font-medium text-white">{setting.label}</div>
                          <div className="text-sm text-gray-400">{setting.desc}</div>
                        </div>
                        <input
                          type="checkbox"
                          checked={notificationSettings[setting.key as keyof typeof notificationSettings]}
                          onChange={(e) => setNotificationSettings(prev => ({ ...prev, [setting.key]: e.target.checked }))}
                          className="w-5 h-5 rounded border-gray-600 bg-gray-800 text-purple-600 focus:ring-purple-500"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Security */}
              {activeSection === 'security' && (
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-white">Güvenlik Ayarları</h3>
                  
                  {/* Password Change */}
                  <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                    <h4 className="text-lg font-semibold text-white mb-4">Şifre Değiştir</h4>
                    <div className="space-y-4">
                      <div className="relative">
                        <label className="block text-sm font-medium text-gray-300 mb-2">Mevcut Şifre</label>
                        <div className="relative">
                          <input
                            type={showCurrentPassword ? 'text' : 'password'}
                            value={passwordForm.currentPassword}
                            onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                            className="w-full px-4 py-3 pr-10 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200"
                          />
                          <button
                            type="button"
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                          >
                            {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      <div className="relative">
                        <label className="block text-sm font-medium text-gray-300 mb-2">Yeni Şifre</label>
                        <div className="relative">
                          <input
                            type={showNewPassword ? 'text' : 'password'}
                            value={passwordForm.newPassword}
                            onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                            className="w-full px-4 py-3 pr-10 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200"
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                          >
                            {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Yeni Şifre (Tekrar)</label>
                        <input
                          type="password"
                          value={passwordForm.confirmPassword}
                          onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200"
                        />
                      </div>

                      <button
                        onClick={handlePasswordChange}
                        className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200"
                      >
                        <Key className="w-4 h-4" />
                        Şifreyi Değiştir
                      </button>
                    </div>
                  </div>

                  {/* Security Options */}
                  <div className="space-y-4">
                    {[
                      { key: 'twoFactorAuth', label: 'İki Faktörlü Doğrulama', desc: 'Hesabınız için ek güvenlik katmanı' },
                      { key: 'loginAlerts', label: 'Giriş Uyarıları', desc: 'Yeni cihazdan giriş yapıldığında bildirim al' }
                    ].map((setting) => (
                      <div key={setting.key} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                        <div>
                          <div className="font-medium text-white">{setting.label}</div>
                          <div className="text-sm text-gray-400">{setting.desc}</div>
                        </div>
                        <input
                          type="checkbox"
                          checked={securitySettings[setting.key as keyof typeof securitySettings] as boolean}
                          onChange={(e) => setSecuritySettings(prev => ({ ...prev, [setting.key]: e.target.checked }))}
                          className="w-5 h-5 rounded border-gray-600 bg-gray-800 text-purple-600 focus:ring-purple-500"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Data & Privacy */}
              {activeSection === 'data' && (
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-white">Veri & Gizlilik</h3>
                  
                  <div className="space-y-4">
                    <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                      <h4 className="text-lg font-semibold text-white mb-4">Veri İndirme</h4>
                      <p className="text-gray-400 mb-4">
                        Hesabınızla ilgili tüm verileri indirebilirsiniz. Bu işlem birkaç dakika sürebilir.
                      </p>
                      <button className="flex items-center gap-2 px-6 py-2 bg-blue-600/20 border border-blue-600/30 text-blue-300 rounded-lg hover:bg-blue-600/30 transition-all duration-200">
                        <Download className="w-4 h-4" />
                        Verilerimi İndir
                      </button>
                    </div>

                    <div className="bg-red-600/10 border border-red-600/30 rounded-xl p-6">
                      <h4 className="text-lg font-semibold text-red-300 mb-4 flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5" />
                        Hesap Silme
                      </h4>
                      <p className="text-gray-400 mb-4">
                        Hesabınızı kalıcı olarak silebilirsiniz. Bu işlem geri alınamaz ve tüm verileriniz silinir.
                      </p>
                      <button
                        onClick={() => setShowDeleteModal(true)}
                        className="flex items-center gap-2 px-6 py-2 bg-red-600/20 border border-red-600/30 text-red-300 rounded-lg hover:bg-red-600/30 transition-all duration-200"
                      >
                        <Trash2 className="w-4 h-4" />
                        Hesabı Sil
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 max-w-md w-full mx-4 shadow-xl">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-red-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Hesabı Silmek İstediğinizden Emin misiniz?</h3>
              <p className="text-gray-400 mb-6">
                Bu işlem geri alınamaz. Tüm verileriniz kalıcı olarak silinecek.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all duration-200"
                >
                  İptal
                </button>
                <button
                  onClick={handleDeleteAccount}
                  className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all duration-200"
                >
                  Hesabı Sil
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
