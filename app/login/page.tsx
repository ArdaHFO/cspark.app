'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Eye, EyeOff, Mail, Lock, ArrowRight, Phone } from 'lucide-react'

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    phone: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  // Load saved credentials on mount
  useEffect(() => {
    const savedEmail = localStorage.getItem('rememberedEmail')
    const savedRememberMe = localStorage.getItem('rememberMe') === 'true'
    
    if (savedEmail && savedRememberMe) {
      setFormData(prev => ({ ...prev, email: savedEmail }))
      setRememberMe(true)
    }
  }, [])

  // Form verilerini temizle when switching tabs
  useEffect(() => {
    const savedEmail = rememberMe ? formData.email : ''
    setFormData({
      email: savedEmail,
      password: '',
      confirmPassword: '',
      name: '',
      phone: ''
    })
    setShowPassword(false)
  }, [isLogin])

    const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (isLogin) {
      // Remember me logic
      if (rememberMe) {
        localStorage.setItem('rememberedEmail', formData.email)
        localStorage.setItem('rememberMe', 'true')
      } else {
        localStorage.removeItem('rememberedEmail')
        localStorage.removeItem('rememberMe')
      }
      
      // Simulate successful login - redirect to app
      router.push('/app')
    } else {
      // Handle registration logic here
      console.log('Registration submitted', { 
        email: formData.email, 
        password: formData.password,
        name: formData.name,
        phone: formData.phone 
      })
      // After successful registration, also redirect to app
      router.push('/app')
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 flex items-center justify-center px-4 py-8 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Floating Octopus Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Large background octopus - floating */}
        <div className="absolute top-10 right-10 w-48 h-48 opacity-5 animate-float">
          <Image
            src="/octopus-logo.png"
            alt="Background Octopus"
            width={192}
            height={192}
            className="object-contain transform rotate-12"
          />
        </div>
        
        {/* Medium octopus - bottom left */}
        <div className="absolute bottom-20 left-20 w-32 h-32 opacity-10 animate-float-reverse">
          <Image
            src="/octopus-logo.png"
            alt="Background Octopus"
            width={128}
            height={128}
            className="object-contain transform -rotate-12"
          />
        </div>
        
        {/* Small octopus - top left */}
        <div className="absolute top-32 left-32 w-20 h-20 opacity-8 animate-float-slow">
          <Image
            src="/octopus-logo.png"
            alt="Background Octopus"
            width={80}
            height={80}
            className="object-contain transform rotate-45"
          />
        </div>
        
        {/* Small octopus - bottom right */}
        <div className="absolute bottom-32 right-32 w-24 h-24 opacity-6 animate-float-fast">
          <Image
            src="/octopus-logo.png"
            alt="Background Octopus"
            width={96}
            height={96}
            className="object-contain transform -rotate-30"
          />
        </div>

        {/* EXISTING OCTOPUS ADDITIONS */}
        
        {/* Extra Large octopus - center back */}
        <div className="absolute top-1/2 left-1/4 w-64 h-64 opacity-3 animate-float-super-slow">
          <Image
            src="/octopus-logo.png"
            alt="Background Octopus"
            width={256}
            height={256}
            className="object-contain transform rotate-90"
          />
        </div>
        
        {/* Medium octopus - top right */}
        <div className="absolute top-16 right-1/4 w-36 h-36 opacity-7 animate-float-diagonal">
          <Image
            src="/octopus-logo.png"
            alt="Background Octopus"
            width={144}
            height={144}
            className="object-contain transform rotate-180"
          />
        </div>
        
        {/* Tiny octopus - top center */}
        <div className="absolute top-8 left-1/2 w-16 h-16 opacity-12 animate-float-tiny">
          <Image
            src="/octopus-logo.png"
            alt="Background Octopus"
            width={64}
            height={64}
            className="object-contain transform rotate-270"
          />
        </div>
        
        {/* Small octopus - bottom center */}
        <div className="absolute bottom-16 left-1/2 w-28 h-28 opacity-8 animate-float-bounce">
          <Image
            src="/octopus-logo.png"
            alt="Background Octopus"
            width={112}
            height={112}
            className="object-contain transform rotate-135"
          />
        </div>
        
        {/* Medium octopus - left center */}
        <div className="absolute top-1/2 left-8 w-40 h-40 opacity-6 animate-float-swing">
          <Image
            src="/octopus-logo.png"
            alt="Background Octopus"
            width={160}
            height={160}
            className="object-contain transform -rotate-45"
          />
        </div>
        
        {/* Small octopus - right center */}
        <div className="absolute top-1/3 right-8 w-24 h-24 opacity-9 animate-float-spin">
          <Image
            src="/octopus-logo.png"
            alt="Background Octopus"
            width={96}
            height={96}
            className="object-contain transform rotate-225"
          />
        </div>
        
        {/* Tiny octopus - top left corner */}
        <div className="absolute top-4 left-4 w-14 h-14 opacity-15 animate-float-orbit">
          <Image
            src="/octopus-logo.png"
            alt="Background Octopus"
            width={56}
            height={56}
            className="object-contain transform rotate-315"
          />
        </div>
        
        {/* Small octopus - bottom right corner */}
        <div className="absolute bottom-4 right-4 w-18 h-18 opacity-11 animate-float-wave">
          <Image
            src="/octopus-logo.png"
            alt="Background Octopus"
            width={72}
            height={72}
            className="object-contain transform rotate-60"
          />
        </div>

        {/* NEW ADDITIONAL OCTOPUS ARMY! */}
        
        {/* Extra octopus - mid left */}
        <div className="absolute top-1/4 left-16 w-22 h-22 opacity-9 animate-float-gentle-1">
          <Image
            src="/octopus-logo.png"
            alt="Background Octopus"
            width={88}
            height={88}
            className="object-contain transform rotate-150"
          />
        </div>
        
        {/* Extra octopus - mid right */}
        <div className="absolute top-3/4 right-16 w-26 h-26 opacity-7 animate-float-gentle-2">
          <Image
            src="/octopus-logo.png"
            alt="Background Octopus"
            width={104}
            height={104}
            className="object-contain transform rotate-240"
          />
        </div>
        
        {/* Tiny octopus - upper mid left */}
        <div className="absolute top-20 left-1/3 w-12 h-12 opacity-14 animate-float-gentle-3">
          <Image
            src="/octopus-logo.png"
            alt="Background Octopus"
            width={48}
            height={48}
            className="object-contain transform rotate-300"
          />
        </div>
        
        {/* Small octopus - lower mid right */}
        <div className="absolute bottom-24 right-1/3 w-20 h-20 opacity-10 animate-float-gentle-4">
          <Image
            src="/octopus-logo.png"
            alt="Background Octopus"
            width={80}
            height={80}
            className="object-contain transform rotate-120"
          />
        </div>
        
        {/* Medium octopus - center left */}
        <div className="absolute top-2/3 left-12 w-32 h-32 opacity-5 animate-float-gentle-5">
          <Image
            src="/octopus-logo.png"
            alt="Background Octopus"
            width={128}
            height={128}
            className="object-contain transform rotate-210"
          />
        </div>
        
        {/* Small octopus - center right */}
        <div className="absolute top-1/5 right-12 w-24 h-24 opacity-8 animate-float-gentle-6">
          <Image
            src="/octopus-logo.png"
            alt="Background Octopus"
            width={96}
            height={96}
            className="object-contain transform rotate-75"
          />
        </div>
        
        {/* Tiny octopus - random position 1 */}
        <div className="absolute top-3/5 left-1/5 w-16 h-16 opacity-12 animate-float-gentle-7">
          <Image
            src="/octopus-logo.png"
            alt="Background Octopus"
            width={64}
            height={64}
            className="object-contain transform rotate-165"
          />
        </div>
        
        {/* Tiny octopus - random position 2 */}
        <div className="absolute top-1/6 right-1/5 w-14 h-14 opacity-13 animate-float-gentle-8">
          <Image
            src="/octopus-logo.png"
            alt="Background Octopus"
            width={56}
            height={56}
            className="object-contain transform rotate-285"
          />
        </div>
      </div>

      {/* Custom CSS for all animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(12deg); }
          50% { transform: translateY(-18px) rotate(15deg); }
        }
        
        @keyframes float-reverse {
          0%, 100% { transform: translateY(0px) rotate(-12deg); }
          50% { transform: translateY(-12px) rotate(-15deg); }
        }
        
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) rotate(45deg); }
          50% { transform: translateY(-8px) rotate(48deg); }
        }
        
        @keyframes float-fast {
          0%, 100% { transform: translateY(0px) rotate(-30deg); }
          50% { transform: translateY(-22px) rotate(-33deg); }
        }
        
        @keyframes bounce-gentle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        
        /* ENHANCED FLOATING ANIMATIONS - More fluid and swimming-like */
        
        @keyframes float-super-slow {
          0%, 100% { transform: translateY(0px) translateX(0px) rotate(90deg) scale(1); }
          25% { transform: translateY(-6px) translateX(3px) rotate(92deg) scale(1.02); }
          50% { transform: translateY(-10px) translateX(0px) rotate(90deg) scale(1.05); }
          75% { transform: translateY(-6px) translateX(-3px) rotate(88deg) scale(1.02); }
        }
        
        @keyframes float-diagonal {
          0%, 100% { transform: translateY(0px) translateX(0px) rotate(180deg); }
          25% { transform: translateY(-8px) translateX(5px) rotate(182deg); }
          50% { transform: translateY(-14px) translateX(8px) rotate(180deg); }
          75% { transform: translateY(-8px) translateX(5px) rotate(178deg); }
        }
        
        @keyframes float-tiny {
          0%, 100% { transform: translateY(0px) rotate(270deg) scale(1); }
          33% { transform: translateY(-4px) rotate(272deg) scale(1.08); }
          66% { transform: translateY(-8px) rotate(270deg) scale(0.95); }
        }
        
        @keyframes float-bounce {
          0%, 100% { transform: translateY(0px) rotate(135deg) scale(1); }
          20% { transform: translateY(-10px) rotate(137deg) scale(1.05); }
          40% { transform: translateY(-3px) rotate(135deg) scale(0.98); }
          60% { transform: translateY(-15px) rotate(133deg) scale(1.08); }
          80% { transform: translateY(-6px) rotate(135deg) scale(1.02); }
        }
        
        @keyframes float-swing {
          0%, 100% { transform: translateX(0px) translateY(0px) rotate(-45deg); }
          25% { transform: translateX(6px) translateY(-5px) rotate(-43deg); }
          50% { transform: translateX(12px) translateY(-8px) rotate(-45deg); }
          75% { transform: translateX(6px) translateY(-5px) rotate(-47deg); }
        }
        
        @keyframes float-spin {
          0% { transform: translateY(0px) rotate(225deg) scale(1); }
          25% { transform: translateY(-5px) rotate(250deg) scale(1.03); }
          50% { transform: translateY(-10px) rotate(275deg) scale(0.97); }
          75% { transform: translateY(-5px) rotate(300deg) scale(1.03); }
          100% { transform: translateY(0px) rotate(325deg) scale(1); }
        }
        
        @keyframes float-orbit {
          0% { transform: translateX(0px) translateY(0px) rotate(315deg); }
          25% { transform: translateX(5px) translateY(-3px) rotate(335deg); }
          50% { transform: translateX(8px) translateY(0px) rotate(355deg); }
          75% { transform: translateX(5px) translateY(3px) rotate(375deg); }
          100% { transform: translateX(0px) translateY(0px) rotate(395deg); }
        }
        
        @keyframes float-wave {
          0%, 100% { transform: translateY(0px) translateX(0px) rotate(60deg); }
          20% { transform: translateY(-3px) translateX(2px) rotate(62deg); }
          40% { transform: translateY(-8px) translateX(-1px) rotate(60deg); }
          60% { transform: translateY(-5px) translateX(3px) rotate(58deg); }
          80% { transform: translateY(-10px) translateX(-2px) rotate(60deg); }
        }
        
        /* NEW GENTLE ANIMATIONS FOR ADDITIONAL OCTOPUS */
        
        @keyframes float-gentle-1 {
          0%, 100% { transform: translateY(0px) translateX(0px) rotate(150deg); }
          50% { transform: translateY(-6px) translateX(4px) rotate(153deg); }
        }
        
        @keyframes float-gentle-2 {
          0%, 100% { transform: translateY(0px) translateX(0px) rotate(240deg); }
          50% { transform: translateY(-8px) translateX(-3px) rotate(237deg); }
        }
        
        @keyframes float-gentle-3 {
          0%, 100% { transform: translateY(0px) translateX(0px) rotate(300deg); }
          50% { transform: translateY(-4px) translateX(2px) rotate(303deg); }
        }
        
        @keyframes float-gentle-4 {
          0%, 100% { transform: translateY(0px) translateX(0px) rotate(120deg); }
          50% { transform: translateY(-7px) translateX(-2px) rotate(117deg); }
        }
        
        @keyframes float-gentle-5 {
          0%, 100% { transform: translateY(0px) translateX(0px) rotate(210deg); }
          50% { transform: translateY(-9px) translateX(3px) rotate(213deg); }
        }
        
        @keyframes float-gentle-6 {
          0%, 100% { transform: translateY(0px) translateX(0px) rotate(75deg); }
          50% { transform: translateY(-5px) translateX(-4px) rotate(72deg); }
        }
        
        @keyframes float-gentle-7 {
          0%, 100% { transform: translateY(0px) translateX(0px) rotate(165deg); }
          50% { transform: translateY(-6px) translateX(1px) rotate(168deg); }
        }
        
        @keyframes float-gentle-8 {
          0%, 100% { transform: translateY(0px) translateX(0px) rotate(285deg); }
          50% { transform: translateY(-4px) translateX(-1px) rotate(282deg); }
        }
        
        /* SLOWER Animation Classes for swimming effect */
        
        .animate-float {
          animation: float 8s ease-in-out infinite;
        }
        
        .animate-float-reverse {
          animation: float-reverse 10s ease-in-out infinite;
        }
        
        .animate-float-slow {
          animation: float-slow 12s ease-in-out infinite;
        }
        
        .animate-float-fast {
          animation: float-fast 6s ease-in-out infinite;
        }
        
        .animate-bounce-gentle {
          animation: bounce-gentle 4s ease-in-out infinite;
        }
        
        .animate-float-super-slow {
          animation: float-super-slow 18s ease-in-out infinite;
        }
        
        .animate-float-diagonal {
          animation: float-diagonal 9s ease-in-out infinite;
        }
        
        .animate-float-tiny {
          animation: float-tiny 5s ease-in-out infinite;
        }
        
        .animate-float-bounce {
          animation: float-bounce 7s ease-in-out infinite;
        }
        
        .animate-float-swing {
          animation: float-swing 11s ease-in-out infinite;
        }
        
        .animate-float-spin {
          animation: float-spin 9s ease-in-out infinite;
        }
        
        .animate-float-orbit {
          animation: float-orbit 14s ease-in-out infinite;
        }
        
        .animate-float-wave {
          animation: float-wave 6s ease-in-out infinite;
        }
        
        /* NEW GENTLE ANIMATION CLASSES */
        
        .animate-float-gentle-1 {
          animation: float-gentle-1 7s ease-in-out infinite;
        }
        
        .animate-float-gentle-2 {
          animation: float-gentle-2 9s ease-in-out infinite;
        }
        
        .animate-float-gentle-3 {
          animation: float-gentle-3 5s ease-in-out infinite;
        }
        
        .animate-float-gentle-4 {
          animation: float-gentle-4 8s ease-in-out infinite;
        }
        
        .animate-float-gentle-5 {
          animation: float-gentle-5 11s ease-in-out infinite;
        }
        
        .animate-float-gentle-6 {
          animation: float-gentle-6 6s ease-in-out infinite;
        }
        
        .animate-float-gentle-7 {
          animation: float-gentle-7 10s ease-in-out infinite;
        }
        
        .animate-float-gentle-8 {
          animation: float-gentle-8 7s ease-in-out infinite;
        }
      `}</style>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo and Brand Section */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-6">
            <div className="relative w-24 h-24 flex items-center justify-center rounded-3xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 shadow-2xl backdrop-blur-sm border border-purple-500/30 group cursor-pointer overflow-hidden">
              <Image
                src="/octopus-logo.png"
                alt="CSpark Octopus Logo"
                width={64}
                height={64}
                className="object-contain transform transition-all duration-500 group-hover:scale-110 animate-bounce-gentle"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-3xl animate-pulse"></div>
              {/* Glowing effect */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-purple-400/20 to-pink-400/20 blur-xl animate-pulse"></div>
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-2">
            <span className="bg-gradient-to-r from-purple-300 via-white to-pink-300 bg-clip-text text-transparent">
              CSpark
            </span>
          </h1>
          <p className="text-purple-300 text-lg font-medium mb-2">AI Content Studio</p>
          <p className="text-gray-300 text-sm">
            {isLogin ? 'Hesabınıza giriş yapın' : 'Yeni hesap oluşturun'}
          </p>
        </div>

        {/* Login/Register Form */}
        <div className="bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 shadow-2xl p-8 relative overflow-hidden">
          {/* Form background effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 via-transparent to-pink-600/5"></div>
          
          <div className="relative z-10">
            {/* Tab Switcher */}
            <div className="flex bg-gray-800/50 rounded-2xl p-1 mb-8">
              <button
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-3 px-4 text-sm font-semibold rounded-xl transition-all duration-300 ${
                  isLogin 
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg' 
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                Giriş Yap
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-3 px-4 text-sm font-semibold rounded-xl transition-all duration-300 ${
                  !isLogin 
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg' 
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                Kayıt Ol
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {!isLogin && (
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Ad Soyad
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required={!isLogin}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                    placeholder="Adınızı girin"
                  />
                </div>
              )}

              <div className="relative">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  E-posta
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                    placeholder="ornek@email.com"
                  />
                </div>
              </div>

              {!isLogin && (
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Telefon
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required={!isLogin}
                      className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                      placeholder="+90 (555) 123 45 67"
                    />
                  </div>
                </div>
              )}

              <div className="relative">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Şifre
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    className="w-full pl-12 pr-12 py-3 bg-gray-800/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                    placeholder="Şifrenizi girin"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-300"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {!isLogin && (
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Şifre Tekrar
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      required={!isLogin}
                      className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                      placeholder="Şifrenizi tekrar girin"
                    />
                  </div>
                </div>
              )}

              {isLogin && (
                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="mr-2 rounded w-4 h-4 text-purple-600 bg-gray-800 border-gray-600 focus:ring-purple-500 focus:ring-2" 
                    />
                    <span className="text-gray-300">Beni hatırla</span>
                  </label>
                  <button 
                    type="button" 
                    onClick={() => setShowForgotPassword(true)}
                    className="text-purple-400 hover:text-purple-300 transition-colors duration-300"
                  >
                    Şifremi unuttum
                  </button>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-3 ${
                  isLoading
                    ? 'bg-gray-600 cursor-not-allowed'
                    : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl hover:shadow-purple-500/25'
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Giriş yapılıyor...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <span>{isLogin ? 'Giriş Yap' : 'Hesap Oluştur'}</span>
                    <ArrowRight className="w-5 h-5" />
                  </div>
                )}
              </button>
            </form>

            {/* Social Login Options */}
            <div className="mt-8 pt-6 border-t border-gray-700/50">
              <p className="text-center text-gray-400 text-sm mb-4">
                veya Google hesabınızla
              </p>
              <button className="w-full py-3 px-4 bg-gray-800/50 border border-gray-600/50 rounded-xl text-white hover:bg-gray-700/50 transition-all duration-300 flex items-center justify-center gap-3">
                <Image
                  src="/search.png"
                  alt="Google Logo"
                  width={20}
                  height={20}
                  className="object-contain"
                />
                <span className="font-medium">Google ile {isLogin ? 'Giriş Yap' : 'Kayıt Ol'}</span>
              </button>
            </div>

            {/* Terms */}
            {!isLogin && (
              <p className="mt-6 text-xs text-gray-400 text-center">
                Hesap oluşturarak{' '}
                <button className="text-purple-400 hover:text-purple-300 transition-colors duration-300">
                  Kullanım Şartları
                </button>{' '}
                ve{' '}
                <button className="text-purple-400 hover:text-purple-300 transition-colors duration-300">
                  Gizlilik Politikası
                </button>
                'nı kabul etmiş olursunuz.
              </p>
            )}
          </div>
        </div>

        {/* Back to Landing */}
        <div className="text-center mt-6">
          <button 
            onClick={() => router.push('/landing')}
            className="text-gray-400 hover:text-white transition-colors duration-300 text-sm"
          >
            ← Ana sayfaya dön
          </button>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800/90 backdrop-blur-md rounded-3xl border border-gray-700/50 shadow-2xl p-8 max-w-md w-full relative overflow-hidden">
            {/* Background effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 via-transparent to-pink-600/5"></div>
            
            <div className="relative z-10">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                  <Lock className="w-8 h-8 text-purple-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Şifremi Unuttum</h3>
                <p className="text-gray-300 text-sm">
                  E-posta adresinizi girin, şifre sıfırlama bağlantısını gönderelim.
                </p>
              </div>

              <form className="space-y-6">
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    E-posta Adresi
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      placeholder="ornek@email.com"
                      className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                    />
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(false)}
                    className="flex-1 py-3 px-4 bg-gray-700/50 border border-gray-600/50 rounded-xl text-gray-300 hover:text-white hover:bg-gray-600/50 transition-all duration-300"
                  >
                    İptal
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 px-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 hover:scale-105"
                  >
                    Gönder
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
