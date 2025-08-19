'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { ArrowRight, CheckCircle, Star, Zap, Target, Users, Clock, TrendingUp, Play, ChevronDown, ChevronUp, Globe, Shield, Award } from 'lucide-react'

// Inline InfiniteMovingCards Component
interface TestimonialItem {
  quote: string
  name: string
  title: string
}

interface InfiniteMovingCardsProps {
  items: TestimonialItem[]
  direction?: 'left' | 'right'
  speed?: 'fast' | 'normal' | 'slow'
  pauseOnHover?: boolean
  className?: string
}

const InfiniteMovingCards: React.FC<InfiniteMovingCardsProps> = ({ 
  items, 
  direction = 'left', 
  speed = 'fast', 
  pauseOnHover = true, 
  className = '' 
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const scrollerRef = React.useRef<HTMLUListElement>(null)

  useEffect(() => {
    addAnimation()
  }, [])

  const [start, setStart] = useState(false)

  function addAnimation() {
    if (containerRef.current && scrollerRef.current) {
      const scrollerContent = Array.from(scrollerRef.current.children as HTMLCollectionOf<Element>)

      scrollerContent.forEach((item: Element) => {
        const duplicatedItem = item.cloneNode(true) as Element
        if (scrollerRef.current) {
          scrollerRef.current.appendChild(duplicatedItem)
        }
      })

      getDirection()
      getSpeed()
      setStart(true)
    }
  }

  const getDirection = () => {
    if (containerRef.current) {
      if (direction === 'left') {
        containerRef.current.style.setProperty('--animation-direction', 'forwards')
      } else {
        containerRef.current.style.setProperty('--animation-direction', 'reverse')
      }
    }
  }

  const getSpeed = () => {
    if (containerRef.current) {
      if (speed === 'fast') {
        containerRef.current.style.setProperty('--animation-duration', '20s')
      } else if (speed === 'normal') {
        containerRef.current.style.setProperty('--animation-duration', '40s')
      } else {
        containerRef.current.style.setProperty('--animation-duration', '80s')
      }
    }
  }

  return (
    <div className="relative">
      <style dangerouslySetInnerHTML={{
        __html: `
          .scroller-mask {
            mask-image: linear-gradient(to right, transparent, white 20%, white 80%, transparent);
            -webkit-mask-image: linear-gradient(to right, transparent, white 20%, white 80%, transparent);
          }
          
          .animate-scroll {
            animation: scroll var(--animation-duration) linear infinite var(--animation-direction);
          }
          
          @keyframes scroll {
            to {
              transform: translate(calc(-50% - 0.5rem));
            }
          }
        `
      }} />
      
      <div
        ref={containerRef}
        className={`scroller-mask relative z-20 max-w-7xl overflow-hidden ${className || ''}`}
      >
        <ul
          ref={scrollerRef}
          className={`flex min-w-full shrink-0 gap-4 py-4 w-max flex-nowrap ${
            start ? 'animate-scroll' : ''
          } ${pauseOnHover ? 'hover:[animation-play-state:paused]' : ''}`}
        >
          {items.map((item: TestimonialItem, idx: number) => (
            <li
              className="w-[320px] max-w-full relative rounded-2xl border border-b-0 flex-shrink-0 border-slate-700 px-6 py-5 md:w-[380px] bg-gradient-to-b from-slate-800 to-slate-900"
              key={idx}
            >
              <blockquote>
                <div
                  aria-hidden="true"
                  className="user-select-none -z-1 pointer-events-none absolute -left-0.5 -top-0.5 h-[calc(100%_+_4px)] w-[calc(100%_+_4px)]"
                ></div>
                <span className="relative z-20 text-sm leading-[1.5] text-gray-100 font-normal">
                  {item.quote}
                </span>
                <div className="relative z-20 mt-4 flex flex-row items-center">
                  <span className="flex flex-col gap-1">
                    <span className="text-sm leading-[1.5] text-gray-400 font-medium">
                      {item.name}
                    </span>
                    <span className="text-xs leading-[1.4] text-gray-500 font-normal">
                      {item.title}
                    </span>
                  </span>
                </div>
              </blockquote>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

// Hero Section Component
const HeroSection = () => {
  const [isLoaded, setIsLoaded] = useState(false)
  const [textVisible, setTextVisible] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setIsLoaded(true)
    
    // Text animation için timer
    const timer = setTimeout(() => {
      setTextVisible(true)
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  // Scroll observer için ref
  const textRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTextVisible(false)
          setTimeout(() => setTextVisible(true), 100)
        }
      },
      { threshold: 0.5 }
    )

    if (textRef.current) {
      observer.observe(textRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const handleGetStarted = () => router.push('/app')
  const handleWatchDemo = () => {}

  return (
    <section id="home" className="relative w-screen min-h-screen flex items-center justify-center pt-16 scroll-mt-16 bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900 overflow-hidden">
      {/* Kayan yıldızlar efekti */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-400/20 via-transparent to-transparent animate-pulse"></div>
      </div>

      {/* Main content container */}
      <div className={`relative z-10 w-full max-w-6xl px-6 sm:px-8 lg:px-10 text-center transition-all duration-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
        <div className="mx-auto max-w-4xl">
          {/* Brand header */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="relative w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 shadow-lg backdrop-blur-sm border border-purple-500/30 group cursor-pointer overflow-hidden">
              <Image
                src="/octopus-logo.png"
                alt="CSpark Octopus Logo"
                width={32}
                height={32}
                className="object-contain group-hover:scale-110 transition-transform duration-300 animate-pulse"
              />
              <div className="absolute inset-0 bg-purple-500/10 group-hover:bg-purple-500/20 transition-colors duration-300 rounded-full"></div>
            </div>
            <div className="text-center group cursor-pointer">
              <div className="text-3xl font-extrabold bg-gradient-to-r from-purple-300 via-white to-pink-300 bg-clip-text text-transparent hover:from-purple-200 hover:via-purple-100 hover:to-pink-200 transition-all duration-500 transform group-hover:scale-110 group-hover:tracking-wider animate-pulse">
                CSpark
              </div>
              <div className="text-xs text-purple-300 font-medium tracking-wide group-hover:text-purple-200 transition-colors duration-300">
                AI Content Studio
              </div>
            </div>
          </div>

          {/* Lead badge with hover animation */}
          <div className="group relative inline-flex items-center gap-3 px-5 py-3 bg-white/5 backdrop-blur-md rounded-full border border-white/10 mb-12 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105">
            <div className="w-5 h-5 relative flex items-center justify-center">
              <Image
                src="/octopus-logo.png"
                alt="CSpark Octopus"
                width={20}
                height={20}
                className="object-contain group-hover:scale-110 transition-transform duration-300"
              />
            </div>
            <span className="text-sm text-gray-200 font-medium">Meta LLAMA 3.1 Destekli İçerik</span>
            
            {/* Surprise tooltip - positioned at card level */}
            <div className="absolute top-1/2 -translate-y-1/2 -right-4 translate-x-full opacity-0 group-hover:opacity-100 transition-all duration-500 scale-95 group-hover:scale-100 pointer-events-none z-50">
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-xl relative whitespace-nowrap">
                🚀 Meta'nın en gelişmiş AI modeli!
                <div className="absolute top-1/2 right-full transform -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent border-r-purple-600"></div>
              </div>
            </div>
          </div>

          {/* Main headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight max-w-4xl mx-auto mb-6">
            <span className="bg-gradient-to-r from-purple-300 via-pink-300 to-purple-300 bg-clip-text text-transparent animate-pulse font-extrabold"> 
              CSpark
            </span>
            <span className="bg-gradient-to-r from-white via-purple-100 to-white bg-clip-text text-transparent">
              {" "}ile akıllıca büyüyün
            </span>
          </h1>

          {/* Subtitle with Custom Text Animation */}
          <div 
            ref={textRef}
            className="text-xl sm:text-2xl md:text-3xl leading-relaxed max-w-3xl mx-auto mb-8"
          >
            <div className="text-center font-medium">
              {["Saniyeler", "içinde", "profesyonel", "kalitede", "içerik", "üretimi", "için", "gelişmiş", "AI", "çözümler"].map((word, index) => (
                <span
                  key={index}
                  className={`inline-block mr-2 bg-gradient-to-r from-purple-300 via-white to-pink-300 bg-clip-text text-transparent transition-all duration-500 ${
                    textVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                  }`}
                  style={{
                    transitionDelay: textVisible ? `${index * 100}ms` : '0ms'
                  }}
                >
                  {word}
                </span>
              ))}
            </div>
          </div>

          {/* Description */}
          <p className="text-base sm:text-lg text-gray-300 mx-auto max-w-2xl bg-purple-900/20 backdrop-blur-md rounded-3xl p-6 border border-purple-500/30 shadow-lg shadow-purple-500/10 mb-10 leading-relaxed">
            Saniyeler içinde profesyonel kalitede <span className="text-purple-300 font-semibold">blog yazıları</span>, <span className="text-pink-300 font-semibold">video scriptleri</span> ve <span className="text-blue-300 font-semibold">sosyal medya içerikleri</span> üretin.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <button
              onClick={handleGetStarted}
              className="px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
            >
              <span className="flex items-center gap-2">
                Ücretsiz Başla
                <ArrowRight className="w-5 h-5" />
              </span>
            </button>
            <button
              onClick={handleWatchDemo}
              className="px-8 py-4 text-lg font-semibold text-white border-2 border-white/20 bg-white/5 backdrop-blur-sm rounded-xl shadow-lg hover:bg-white/10 hover:border-white/30 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2"
            >
              <span className="flex items-center gap-2">
                <Play className="w-5 h-5" />
                Demo İzle
              </span>
            </button>
          </div>

          {/* Trust badges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto mb-8">
            <div className="flex items-center justify-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-sm rounded-full border border-white/10 text-sm text-gray-200 shadow-sm hover:bg-white/10 transition-all duration-300">
              <Shield className="w-4 h-4 text-green-400" />
              <span>100% Güvenli</span>
            </div>
            <div className="flex items-center justify-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-sm rounded-full border border-white/10 text-sm text-gray-200 shadow-sm hover:bg-white/10 transition-all duration-300">
              <Award className="w-4 h-4 text-yellow-400" />
              <span>Kredi Kartı Gerektirmez</span>
            </div>
            <div className="flex items-center justify-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-sm rounded-full border border-white/10 text-sm text-gray-200 shadow-sm hover:bg-white/10 transition-all duration-300">
              <Globe className="w-4 h-4 text-blue-400" />
              <span>30 Saniyede Kurulum</span>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 shadow-lg text-center">
              <div className="text-3xl sm:text-4xl font-extrabold text-white mb-2">10K+</div>
              <div className="text-sm text-gray-400">İçerik Üretildi</div>
            </div>
            <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 shadow-lg text-center">
              <div className="text-3xl sm:text-4xl font-extrabold text-white mb-2">50+</div>
              <div className="text-sm text-gray-400">Dil Desteği</div>
            </div>
            <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 shadow-lg text-center">
              <div className="text-3xl sm:text-4xl font-extrabold text-white mb-2">99%</div>
              <div className="text-sm text-gray-400">Kullanıcı Memnuniyeti</div>
            </div>
          </div>
        </div>
      </div>
    </section>
    )
}

// Features Section Component
const FeaturesSection = () => {
  const [expandedCard, setExpandedCard] = useState<number | null>(null)

  const features = [
    {
      icon: <Play className="w-8 h-8" />,
      title: "YouTube Script",
      description: "Saniyeler içinde hazır video senaryoları. Giriş, ana içerik ve kapanış ile tam format.",
      gradient: "from-red-500 to-pink-500",
      content: () => (
        <div className="space-y-4">
          <p>CSpark'ın YouTube Script özelliği ile profesyonel video senaryoları saniyeler içinde oluşturun:</p>
          <ul className="space-y-2 text-sm">
            <li>• <strong>Giriş Hook'u:</strong> İzleyicileri çeken dikkat çekici açılışlar</li>
            <li>• <strong>Ana İçerik:</strong> Konuyu detaylı ve akıcı şekilde işleyen bölümler</li>
            <li>• <strong>Call-to-Action:</strong> İzleyicileri harekete geçiren kapanışlar</li>
            <li>• <strong>SEO Optimizasyonu:</strong> YouTube algoritması için optimize edilmiş anahtar kelimeler</li>
            <li>• <strong>Farklı Formatlar:</strong> Eğitim, eğlence, review gibi çeşitli içerik türleri</li>
          </ul>
        </div>
      )
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: "SEO Optimizasyonu",
      description: "Başlık, meta açıklama, anahtar kelimeler ve hashtag önerileri. Arama motoru dostu.",
      gradient: "from-green-500 to-blue-500",
      content: () => (
        <div className="space-y-4">
          <p>Google ve diğer arama motorlarında üst sıralarda görünün:</p>
          <ul className="space-y-2 text-sm">
            <li>• <strong>Anahtar Kelime Analizi:</strong> En çok aranan terimleri otomatik tespit</li>
            <li>• <strong>Meta Açıklama:</strong> Tıklanma oranını artıran açıklamalar</li>
            <li>• <strong>Başlık Optimizasyonu:</strong> SEO dostu ve çekici başlıklar</li>
            <li>• <strong>Hashtag Önerileri:</strong> Sosyal medya erişimini artıran etiketler</li>
            <li>• <strong>İçerik Analizi:</strong> SEO skorunuzu gösteren detaylı raporlar</li>
          </ul>
        </div>
      )
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Sosyal Medya Postları",
      description: "Twitter, Instagram, LinkedIn için optimize edilmiş içerikler. Platform özelinde format.",
      gradient: "from-purple-500 to-indigo-500",
      content: () => (
        <div className="space-y-4">
          <p>Her platform için özel optimize edilmiş içerikler üretin:</p>
          <ul className="space-y-2 text-sm">
            <li>• <strong>Twitter:</strong> Viral olabilecek kısa ve etkili tweetler</li>
            <li>• <strong>Instagram:</strong> Görsel uyumlu caption'lar ve hikayeler</li>
            <li>• <strong>LinkedIn:</strong> Profesyonel ve iş odaklı paylaşımlar</li>
            <li>• <strong>Facebook:</strong> Topluluk odaklı, etkileşimi artıran içerikler</li>
            <li>• <strong>TikTok:</strong> Trend'lere uygun kısa video açıklamaları</li>
          </ul>
        </div>
      )
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Persona Seçimi",
      description: "Haber spikeri, eğitmen, vlogger gibi farklı tonlarda içerik üretimi.",
      gradient: "from-orange-500 to-red-500",
      content: () => (
        <div className="space-y-4">
          <p>İçeriğinizin tonunu hedef kitlenize göre ayarlayın:</p>
          <ul className="space-y-2 text-sm">
            <li>• <strong>Haber Spikeri:</strong> Objektif ve güvenilir haber tonı</li>
            <li>• <strong>Eğitmen:</strong> Öğretici ve samimi eğitim dili</li>
            <li>• <strong>Vlogger:</strong> Kişisel ve samimi günlük dil</li>
            <li>• <strong>Pazarlama Uzmanı:</strong> İkna edici ve satış odaklı ton</li>
            <li>• <strong>Teknoloji Uzmanı:</strong> Teknik ama anlaşılır açıklamalar</li>
          </ul>
        </div>
      )
    }
  ]

  return (
    <section id="features" className="py-24 bg-gradient-to-b from-slate-900 via-purple-900/30 to-purple-800/20 relative">
      {/* Section divider */}
      <div className="absolute top-8 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Güçlü <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Özellikler</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-12">
            İçerik üretimini hızlandıracak ve kaliteyi artıracak gelişmiş AI özelliklerimizi keşfedin
          </p>
        </div>

        <div className="space-y-8">
          {/* Normal kartlar grid'i */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`group relative p-6 rounded-xl bg-gradient-to-b from-gray-800/90 to-gray-900/90 backdrop-blur-sm border transition-all duration-500 hover:transform hover:scale-105 cursor-pointer h-[280px] flex flex-col overflow-hidden ${
                  expandedCard === index 
                    ? 'border-purple-500/70 bg-gradient-to-b from-purple-900/30 to-gray-900/80 shadow-lg shadow-purple-500/20' 
                    : 'border-gray-700/50 hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/10'
                }`}
                onClick={() => setExpandedCard(expandedCard === index ? null : index)}
              >
                {/* Hover background effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 via-transparent to-pink-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Content */}
                <div className="relative z-10">
                  <div className={`mb-4 p-3 rounded-lg bg-gradient-to-r ${feature.gradient} w-fit transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                    <div className="text-white">
                      {feature.icon}
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-3 group-hover:text-purple-300 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-400 leading-relaxed flex-grow group-hover:text-gray-300 transition-colors duration-300">
                    {feature.description}
                  </p>
                  
                  <div className="mt-4 flex justify-center">
                    {expandedCard === index ? (
                      <ChevronUp className="w-5 h-5 text-purple-400 animate-bounce" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-purple-400 opacity-60 group-hover:opacity-100 transition-all duration-300 group-hover:animate-pulse" />
                    )}
                  </div>
                </div>
                
                {/* Selection indicator */}
                {expandedCard === index && (
                  <div className="absolute inset-0 border-2 border-purple-500/50 rounded-xl animate-pulse"></div>
                )}
              </div>
            ))}
          </div>

          {/* Expanded content - ayrı container */}
          {expandedCard !== null && (
            <div className="w-full overflow-hidden">
              <div className="transform transition-all duration-700 ease-out animate-in slide-in-from-top fade-in">
                <div className="relative p-8 bg-gradient-to-br from-purple-900/40 via-blue-900/30 to-indigo-900/40 backdrop-blur-md rounded-3xl border border-gradient-to-r from-purple-500/50 via-pink-500/30 to-blue-500/50 shadow-2xl shadow-purple-500/20 overflow-hidden">
                  
                  {/* Animated background gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-pink-600/5 to-blue-600/10 animate-pulse"></div>
                  
                  {/* Floating particles effect */}
                  <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute w-20 h-20 bg-purple-500/20 rounded-full blur-xl animate-bounce" style={{top: '10%', left: '10%', animationDelay: '0s'}}></div>
                    <div className="absolute w-16 h-16 bg-pink-500/20 rounded-full blur-xl animate-bounce" style={{top: '20%', right: '15%', animationDelay: '1s'}}></div>
                    <div className="absolute w-12 h-12 bg-blue-500/20 rounded-full blur-xl animate-bounce" style={{bottom: '15%', left: '20%', animationDelay: '2s'}}></div>
                  </div>
                  
                  <div className="relative z-10">
                    {/* Header section with enhanced styling */}
                    <div className="flex items-center gap-6 mb-8 transform transition-all duration-500 hover:scale-[1.02]">
                      <div className={`relative p-5 rounded-2xl bg-gradient-to-r ${features[expandedCard].gradient} shadow-lg group`}>
                        <div className="text-white text-2xl transform transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12">
                          {features[expandedCard].icon}
                        </div>
                        <div className="absolute inset-0 bg-white/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-3xl font-bold text-white mb-3 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                          {features[expandedCard].title}
                        </h3>
                        <p className="text-lg text-gray-300 leading-relaxed">
                          {features[expandedCard].description}
                        </p>
                      </div>
                    </div>
                    
                    {/* Content section with beautiful styling */}
                    <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 mb-6">
                      <div className="text-gray-200 leading-relaxed space-y-4">
                        {features[expandedCard].content()}
                      </div>
                    </div>
                    
                    {/* Enhanced close button */}
                    <div className="flex justify-center">
                      <button
                        onClick={() => setExpandedCard(null)}
                        className="group relative px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl hover:shadow-purple-500/25 flex items-center gap-3"
                      >
                        <ChevronUp className="w-5 h-5 transform transition-transform duration-300 group-hover:-translate-y-1" />
                        <span>Kapat</span>
                        <div className="absolute inset-0 bg-white/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

// How It Works Section
const HowItWorksSection = () => {
  const [hoveredStep, setHoveredStep] = useState<number | null>(null)

  const steps = [
    {
      number: "01",
      title: "Metni / URL'yi Gir",
      description: "İçerik üretmek istediğiniz metni yazın veya bir URL'yi yapıştırın",
      icon: <Clock className="w-8 h-8" />
    },
    {
      number: "02", 
      title: "Persona Seç",
      description: "Haber spikeri, eğitmen, vlogger gibi tonlardan birini seçin",
      icon: <Users className="w-8 h-8" />
    },
    {
      number: "03",
      title: "İçeriğini Al",
      description: "YouTube script, sosyal medya postu, SEO paketi ve daha fazlası hazır!",
      icon: <CheckCircle className="w-8 h-8" />
    }
  ]

  return (
    <section className="py-24 bg-gradient-to-b from-purple-800/20 via-indigo-900/40 to-slate-800 relative">
      {/* Section divider */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Nasıl <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Çalışır?</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Sadece 3 basit adımda profesyonel içeriklerinizi hazırlayın
          </p>
        </div>

        <div className="relative">
          {/* Connection Lines with Progress Effect */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-gray-700/50 rounded-full overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/30 via-pink-500/30 to-purple-500/30 h-full"></div>
            {hoveredStep !== null && (
              <div 
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-1000 ease-out"
                style={{ 
                  width: `${((hoveredStep + 1) / 3) * 100}%`,
                  animation: 'fillProgress 1s ease-out'
                }}
              />
            )}
          </div>
          
          <div className="grid lg:grid-cols-3 gap-12 relative">
            {steps.map((step, index) => (
              <div 
                key={index} 
                className="text-center relative group cursor-pointer"
                onMouseEnter={() => setHoveredStep(index)}
                onMouseLeave={() => setHoveredStep(null)}
              >
                {/* Step Number */}
                <div className={`relative mx-auto w-24 h-24 rounded-full flex items-center justify-center mb-8 shadow-xl transition-all duration-300 ${
                  hoveredStep === index 
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 scale-110' 
                    : 'bg-gradient-to-r from-purple-600 to-pink-600'
                }`}>
                  <span className="text-2xl font-bold text-white">{step.number}</span>
                  {hoveredStep === index && (
                    <div className="absolute inset-0 bg-white/20 rounded-full animate-ping opacity-50"></div>
                  )}
                </div>
                
                {/* Icon */}
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 backdrop-blur-sm border transition-all duration-300 ${
                  hoveredStep === index 
                    ? 'bg-purple-500/20 border-purple-400/50 text-purple-300 scale-105' 
                    : 'bg-gray-700/50 border-gray-600/50 text-purple-400'
                }`}>
                  {step.icon}
                </div>
                
                {/* Content */}
                <h3 className={`text-2xl font-bold mb-4 transition-colors duration-300 ${
                  hoveredStep === index ? 'text-purple-300' : 'text-white'
                }`}>
                  {step.title}
                </h3>
                <p className={`leading-relaxed max-w-sm mx-auto transition-colors duration-300 ${
                  hoveredStep === index ? 'text-gray-200' : 'text-gray-300'
                }`}>
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes fillProgress {
            from {
              width: 0%;
            }
            to {
              width: ${hoveredStep !== null ? ((hoveredStep + 1) / 3) * 100 : 0}%;
            }
          }
        `
      }} />
    </section>
  )
}

// Pricing Section
const PricingSection = () => {
  const router = useRouter()

  const handlePlanSelect = (plan: string) => {
    if (plan === 'Free') {
      router.push('/app')
    } else if (plan === 'Pro') {
      router.push('/app?upgrade=pro')
    } else if (plan === 'Agency') {
      window.location.href = 'mailto:info@cspark.com?subject=Agency Plan İnterest'
    }
  }

  const plans = [
    {
      name: "Free",
      price: "₺0",
      period: "/ay",
      description: "Başlamak için ideal",
      features: [
        "Günlük 3 içerik üretimi",
        "Temel persona seçenekleri",
        "YouTube ve sosyal medya",
        "Topluluk desteği"
      ],
      cta: "Ücretsiz Başla",
      popular: false,
      color: "gray"
    },
    {
      name: "Pro",
      price: "₺99",
      period: "/ay", 
      description: "Profesyoneller için",
      features: [
        "Sınırsız içerik üretimi",
        "Tüm persona seçenekleri",
        "SEO optimizasyon paketi",
        "Generate All özelliği",
        "Öncelikli destek",
        "Gelişmiş analitikler"
      ],
      cta: "Pro'ya Geç",
      popular: true,
      color: "purple"
    },
    {
      name: "Agency",
      price: "₺299",
      period: "/ay",
      description: "Ekipler ve ajanslar için",
      features: [
        "Pro'daki tüm özellikler",
        "10 kullanıcı hesabı",
        "Özel API erişimi",
        "White-label seçenekleri",
        "Özel entegrasyonlar",
        "Özel hesap yöneticisi"
      ],
      cta: "İletişime Geç",
      popular: false,
      color: "indigo"
    }
  ]

  return (
    <section id="pricing" className="py-24 bg-gradient-to-b from-slate-800 via-purple-900/30 to-purple-700/20 relative">
      {/* Section divider */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/60 to-transparent"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-28">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Basit <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Fiyatlandırma</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            İhtiyacınıza uygun planı seçin ve hemen başlayın
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 lg:gap-8 max-w-6xl mx-auto mt-14">
          {plans.map((plan, index) => (
            <div 
              key={index} 
              className={`relative transform transition-all duration-300 hover:scale-105 ${
                plan.popular ? 'lg:scale-110 lg:-translate-y-4' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 z-10">
                  <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg">
                    🔥 En Popüler
                  </span>
                </div>
              )}
              
              <div className={`bg-gray-800/50 backdrop-blur-sm rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 ${
                plan.popular ? 'border-purple-400/50 shadow-purple-500/20' : 'border-gray-700/50'
              } relative overflow-hidden group`}>
                
                {plan.popular && (
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-pink-900/20"></div>
                )}
                
                <div className="relative">
                  {/* Header */}
                  <div className="text-center mb-8">
                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 ${
                      plan.color === 'purple' ? 'bg-gradient-to-r from-purple-500 to-pink-500' :
                      plan.color === 'indigo' ? 'bg-gradient-to-r from-indigo-500 to-purple-500' :
                      'bg-gradient-to-r from-gray-500 to-gray-600'
                    }`}>
                      {plan.color === 'purple' && <Star className="w-8 h-8 text-white" />}
                      {plan.color === 'indigo' && <Users className="w-8 h-8 text-white" />}
                      {plan.color === 'gray' && <Zap className="w-8 h-8 text-white" />}
                    </div>
                    
                    <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                    <p className="text-gray-300 mb-4">{plan.description}</p>
                    <div className="flex items-baseline justify-center">
                      <span className="text-5xl font-bold text-white">{plan.price}</span>
                      <span className="text-gray-400 ml-1 text-lg">{plan.period}</span>
                    </div>
                  </div>

                  {/* Features */}
                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center group">
                        <CheckCircle className="w-5 h-5 text-green-400 mr-3 flex-shrink-0 group-hover:scale-110 transition-transform" />
                        <span className="text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <button 
                    onClick={() => handlePlanSelect(plan.name)}
                    className={`w-full py-4 px-6 rounded-2xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 ${
                      plan.popular 
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-xl hover:shadow-purple-500/25' 
                        : plan.color === 'indigo'
                        ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:shadow-xl hover:shadow-indigo-500/25'
                        : 'bg-gray-700/50 text-white hover:bg-gray-600/50 hover:shadow-lg border border-gray-600/50'
                    }`}
                  >
                    {plan.cta}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Additional info */}
        <div className="text-center mt-12">
          <p className="text-gray-300 mb-4">Tüm planlar aşağıdakileri içerir:</p>
          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-400">
            <span className="flex items-center">
              <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
              7/24 Destek
            </span>
            <span className="flex items-center">
              <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
              Türkçe & İngilizce
            </span>
            <span className="flex items-center">
              <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
              Mobil Uyumlu
            </span>
            <span className="flex items-center">
              <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
              API Entegrasyonu
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}

// Testimonials Section
const TestimonialsSection = () => {
  const testimonials = [
    {
      quote: "CSpark sayesinde video scriptlerimi çok daha hızlı hazırlıyorum. İçerik kalitesi de harika! Artık günde 5-6 video script üretebiliyorum.",
      name: "Ahmet Yılmaz",
      title: "YouTuber - 250K Abone"
    },
    {
      quote: "SEO paketleri gerçekten işe yarıyor. Web sitemizin trafiği %200 arttı. Müşterilerimize çok daha etkili içerikler sunabiliyoruz.",
      name: "Elif Kaya", 
      title: "Dijital Pazarlama Uzmanı"
    },
    {
      quote: "Farklı persona seçenekleri sayesinde her platform için uygun içerik üretebiliyorum. Zamandan tasarruf etmek için mükemmel bir araç.",
      name: "Can Demir",
      title: "İçerik Üreticisi"
    },
    {
      quote: "Blog yazılarımı artık dakikalar içinde hazırlayabiliyorum. CSpark'ın AI teknolojisi gerçekten etkileyici. Müşteri memnuniyeti arttı.",
      name: "Zeynep Özkan",
      title: "Blogger & İçerik Editörü"
    },
    {
      quote: "Sosyal medya postlarım için sürekli fikir bulmakta zorlanıyordum. CSpark ile bu sorun tamamen çözüldü. Engagement oranları %150 arttı.",
      name: "Murat Çelik",
      title: "Sosyal Medya Uzmanı"
    },
    {
      quote: "Müşterilerimiz için farklı tonlarda içerik üretebilmek harika. Ajansımızın verimliliği %300 arttı. CSpark olmazsa olmaz araçlarımızdan biri.",
      name: "Ayşe Türk",
      title: "Kreatif Direktör"
    },
    {
      quote: "E-ticaret ürün açıklamalarını hazırlamak için saatler harcıyordum. Artık saniyeler içinde SEO dostu açıklamalar üretebiliyorum.",
      name: "Burak Yıldız",
      title: "E-ticaret Uzmanı"
    },
    {
      quote: "Podcast scriptlerim için CSpark'ı kullanıyorum. Hem İngilizce hem Türkçe içerik üretmek çok kolay. Kalite ve hız mükemmel.",
      name: "Selin Akar",
      title: "Podcast Prodüktörü"
    }
  ]

  return (
    <section className="py-16 bg-gradient-to-b from-purple-700/20 via-pink-800/30 to-indigo-900/40 relative">
      {/* Section divider */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-pink-500/50 to-transparent"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Kullanıcılarımız <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Ne Diyor?</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Binlerce kullanıcımızın CSpark deneyimlerini keşfedin
          </p>
        </div>

        <div className="h-[20rem] rounded-md flex flex-col antialiased items-center justify-center relative overflow-hidden">
          <InfiniteMovingCards
            items={testimonials}
            direction="right"
            speed="slow"
          />
        </div>
      </div>
    </section>
  )
}


// FAQ Section
const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const faqs = [
    {
      question: "CSpark nasıl çalışır?",
      answer: "CSpark, Meta'nın gelişmiş LLAMA 3.1 AI modelini kullanarak içerik üretir. Sadece konunuzu girin, istediğiniz içerik türünü ve tonunu seçin. AI modelimiz milyonlarca veri üzerinde eğitilmiş olup, profesyonel kalitede, SEO uyumlu ve hedef kitlenize uygun içerikler üretir. Süreç tamamen otomatiktir ve saniyeler içinde tamamlanır."
    },
    {
      question: "Hangi tür içerikler üretebilirim?",
      answer: "CSpark ile şunları üretebilirsiniz: YouTube video scriptleri (giriş, ana içerik, kapanış), Instagram ve TikTok için sosyal medya postları, LinkedIn profesyonel paylaşımları, blog yazıları ve makaleleri, ürün açıklamaları, e-posta pazarlama metinleri, reklamcılık metinleri, SEO odaklı içerikler, podcast scriptleri, haber metinleri ve çok daha fazlası. Sürekli yeni özellikler ekleniyor."
    },
    {
      question: "Üretilen içerikler ne kadar özgün ve güvenilir?",
      answer: "Tüm içerikler %100 özgün olarak üretilir ve plagiarism kontrolünden geçer. AI modelimiz hiçbir zaman mevcut içeriği kopyalamaz, sadece öğrendiği dil yapılarından yararlanarak sizin talimatlarınıza özel yeni içerikler oluşturur. Her üretim benzersizdir ve telif hakkı sorunu yaşamazsınız. Ayrıca fact-checking önerileri ve kaynak kontrolleri de sağlanır."
    },
    {
      question: "Fiyatlandırma nasıl çalışıyor ve ödeme güvenli mi?",
      answer: "3 farklı planımız var: Ücretsiz plan (günde 3 içerik), Pro plan (₺99/ay - sınırsız içerik), Agency plan (₺299/ay - 10 kullanıcı). Kredi kartı bilgileriniz 256-bit SSL şifreleme ile korunur. Stripe ve PayPal gibi güvenilir ödeme sistemleri kullanırız. İstediğiniz zaman iptal edebilir, para iadesi garantisi vardır. Türk Lirası, Euro ve Dolar ödeme seçenekleri mevcuttur."
    },
    {
      question: "Teknik destek ve müşteri hizmetleri nasıl?",
      answer: "Pro ve Agency kullanıcıları 7/24 canlı destek alır. Ücretsiz kullanıcılar için e-posta desteği ve kapsamlı dokumentasyon mevcuttur. Türkçe ve İngilizce destek sağlıyoruz. Video eğitimleri, webinarlar ve kullanım kılavuzları da ücretsizdir. Ortalama yanıt süremiz 2 saattir. WhatsApp ve Discord topluluk desteği de vardır."
    },
    {
      question: "API entegrasyonu ve geliştiriciler için imkanlar neler?",
      answer: "Güçlü REST API'miz ile kendi uygulamalarınıza CSpark'ı entegre edebilirsiniz. SDK'lar: JavaScript, Python, PHP, Ruby. Rate limiting: Pro plan için 1000 istek/saat, Agency için 10.000 istek/saat. Webhook desteği, real-time içerik üretimi, bulk operations mevcut. Detaylı API dokümantasyonu, kod örnekleri ve Postman koleksiyonu sağlanır."
    },
    {
      question: "Dil desteği ve çoklu platform kullanımı nasıl?",
      answer: "50+ dilde içerik üretimi yapabilirsiniz: Türkçe, İngilizce, Almanca, Fransızca, İspanyolca, Japonca, Korece, Arapça ve daha fazlası. Mobil uygulamamız iOS ve Android'de mevcuttur. Web, desktop (Windows, Mac, Linux) ve API üzerinden erişim sağlayabilirsiniz. Çevrimdışı mod, bulut senkronizasyonu ve çapraz platform geçmişi desteklenir."
    },
    {
      question: "Veri güvenliği ve gizlilik nasıl sağlanıyor?",
      answer: "Verileriniz ISO 27001 sertifikalı sunucularda şifrelenerek saklanır. GDPR ve KVKK uyumludur. Kişisel verileriniz asla üçüncü taraflarla paylaşılmaz. İsteğiniz halinde tüm verilerinizi silebilir veya dışa aktarabilirsiniz. 2FA (iki faktörlü kimlik doğrulama) desteği mevcuttur. Düzenli güvenlik denetimleri yapılır ve penetrasyon testlerinden geçirilir."
    },
    {
      question: "İçerik kalitesi nasıl garanti ediliyor?",
      answer: "AI modelimiz sürekli eğitilir ve güncellenır. Kullanıcı geri bildirimlerinden öğrenir. İçerik kalite skorları, readability analizi, SEO uyumluluk kontrolü otomatiktir. A/B test önerileri, engagement tahminleri sağlanır. Profesyonel editörlerimiz düzenli olarak çıktıları inceler ve modeli optimize eder. %95+ kullanıcı memnuniyeti garantisi vardır."
    },
    {
      question: "Gelişmiş özellikler ve gelecek güncellemeler neler?",
      answer: "Yakında gelenler: Ses sentezi (text-to-speech), görsel içerik üretimi (AI images), video script'ten otomatik video oluşturma, brand voice özelleştirmesi, takım çalışması araçları, analytics dashboard, competitor analysis, trend monitoring. Kullanıcı önerilerine göre yeni özellikler ekleniyor. Roadmap'e web sitemizden ulaşabilirsiniz."
    }
  ]

  return (
    <section id="faq" className="py-20 bg-gradient-to-b from-indigo-900/40 via-purple-900/50 to-slate-900 relative">
      {/* Section divider */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/60 to-transparent"></div>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Sıkça Sorulan <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Sorular</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            CSpark hakkında merak ettiğiniz her şey. Detaylı açıklamalar ve kapsamlı bilgiler burada.
          </p>
        </div>

        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 overflow-hidden hover:border-purple-500/30 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <button
                className="w-full px-6 py-5 text-left flex justify-between items-center hover:bg-white/5 transition-all duration-300 group"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <h3 className="text-lg font-semibold text-white group-hover:text-purple-300 transition-colors duration-300">
                  {faq.question}
                </h3>
                <ChevronDown
                  className={`w-5 h-5 text-purple-400 transition-transform duration-300 ${
                    openIndex === index ? 'rotate-180' : ''
                  } group-hover:scale-110`}
                />
              </button>
              {openIndex === index && (
                <div className="px-6 pb-5 animate-in slide-in-from-top duration-300">
                  <div className="pt-2 border-t border-gray-700/30">
                    <p className="text-gray-300 leading-relaxed text-base">{faq.answer}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Footer
const Footer = () => {
  const router = useRouter()
  const [hoveredLink, setHoveredLink] = useState<string | null>(null)

  const handleLinkClick = (path: string) => {
    if (path.startsWith('mailto:') || path.startsWith('https://')) {
      window.location.href = path
    } else {
      router.push(path)
    }
  }

  const socialLinks = [
    { name: 'Twitter', icon: '𝕏', href: 'https://twitter.com/cspark' },
    { name: 'LinkedIn', icon: '💼', href: 'https://linkedin.com/company/cspark' },
    { name: 'GitHub', icon: '🐙', href: 'https://github.com/cspark' },
    { name: 'YouTube', icon: '📺', href: 'https://youtube.com/@cspark' }
  ]

  return (
    <footer className="relative bg-gradient-to-b from-slate-900 via-purple-900/40 to-black text-white py-20 overflow-hidden">
      {/* Section divider */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/70 to-transparent"></div>
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          {/* Brand Section */}
          <div className="md:col-span-2 space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="relative w-12 h-12 flex items-center justify-center rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 shadow-lg backdrop-blur-sm border border-purple-500/30 group cursor-pointer overflow-hidden">
                <Image
                  src="/octopus-logo.png"
                  alt="CSpark Octopus Logo"
                  width={32}
                  height={32}
                  className="object-contain group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-purple-500/10 group-hover:bg-purple-500/20 transition-colors duration-300 rounded-xl"></div>
              </div>
              <div>
                <h3 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  CSpark
                </h3>
                <p className="text-sm text-gray-400">AI Content Studio</p>
              </div>
            </div>
            
            <p className="text-gray-300 max-w-md text-lg leading-relaxed">
              AI destekli içerik üretim platformu. YouTube scriptleri, sosyal medya postları ve SEO paketi ile içerik üretiminizi hızlandırın.
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <button
                  key={social.name}
                  onClick={() => handleLinkClick(social.href)}
                  className="w-12 h-12 rounded-xl bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 flex items-center justify-center text-lg hover:bg-purple-500/20 hover:border-purple-500/50 transition-all duration-300 hover:scale-110"
                  onMouseEnter={() => setHoveredLink(social.name)}
                  onMouseLeave={() => setHoveredLink(null)}
                >
                  {social.icon}
                </button>
              ))}
            </div>
          </div>

          {/* Product Links */}
          <div className="space-y-6">
            <h4 className="text-lg font-semibold text-white mb-6 relative">
              Ürün
              <div className="absolute bottom-0 left-0 w-8 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
            </h4>
            <ul className="space-y-4">
              {[
                { name: 'Uygulamaya Git', path: '/app' },
                { name: 'Fiyatlandırma', path: '#pricing' },
                { name: 'API Dokümantasyonu', path: '/api-docs' },
                { name: 'Özellikler', path: '#features' }
              ].map((link) => (
                <li key={link.name}>
                  <button 
                    onClick={() => handleLinkClick(link.path)} 
                    className="text-gray-400 hover:text-purple-400 transition-all duration-300 relative group"
                    onMouseEnter={() => setHoveredLink(link.name)}
                    onMouseLeave={() => setHoveredLink(null)}
                  >
                    {link.name}
                    <span className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300 ${
                      hoveredLink === link.name ? 'w-full' : 'w-0'
                    }`}></span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div className="space-y-6">
            <h4 className="text-lg font-semibold text-white mb-6 relative">
              Şirket
              <div className="absolute bottom-0 left-0 w-8 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
            </h4>
            <ul className="space-y-4">
              {[
                { name: 'Hakkımızda', path: '/about' },
                { name: 'İletişim', path: '/contact' },
                { name: 'Gizlilik Politikası', path: '/privacy' },
                { name: 'Kullanım Şartları', path: '/terms' }
              ].map((link) => (
                <li key={link.name}>
                  <button 
                    onClick={() => handleLinkClick(link.path)} 
                    className="text-gray-400 hover:text-purple-400 transition-all duration-300 relative group"
                    onMouseEnter={() => setHoveredLink(link.name)}
                    onMouseLeave={() => setHoveredLink(null)}
                  >
                    {link.name}
                    <span className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300 ${
                      hoveredLink === link.name ? 'w-full' : 'w-0'
                    }`}></span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="border-t border-gray-800/50 pt-12 mb-12">
          <div className="max-w-2xl mx-auto text-center">
            <h4 className="text-2xl font-bold text-white mb-4">
              Yeniliklerden haberdar olun
            </h4>
            <p className="text-gray-400 mb-6">
              En son özellikler ve güncellemeler hakkında bilgi almak için bültenimize katılın.
            </p>
            <div className="flex gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="E-posta adresiniz"
                className="flex-1 px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
              />
              <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 hover:scale-105">
                Katıl
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800/50 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-center md:text-left">
            © 2025 CSpark. Tüm hakları saklıdır.
          </p>
          <div className="flex items-center gap-6 text-sm text-gray-400">
            <span className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              Tüm sistemler çalışıyor
            </span>
            <span>Türkiye'de yapıldı 🇹🇷</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

// Main Landing Page Component
export default function LandingPage() {

  return (
    <div className="min-h-screen bg-black">
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <PricingSection />
      <TestimonialsSection />
      <FAQ />
      <Footer />
    </div>
  )
}
