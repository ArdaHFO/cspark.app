'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowRight, CheckCircle, Star, Zap, Target, Users, Clock, TrendingUp, Play, ChevronDown, ChevronUp, Sparkles, Globe, Shield, Award } from 'lucide-react'
import { BackgroundBeamsWithCollision } from '@/components/ui/background-beams-with-collision'
import { HeroParallax } from '@/components/ui/hero-parallax'
import { CSparkFlipWordsDemo } from '@/components/cspark-flip-words-demo'

// Hero Section Component
const HeroSection = () => {
  const router = useRouter()
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  const handleGetStarted = () => {
    router.push('/app')
  }

  const handleWatchDemo = () => {
    // Demo video modal veya redirect işlemi
    alert('Demo video yakında gelecek!')
  }

  return (
    <BackgroundBeamsWithCollision>
      <section className="relative h-screen flex items-center justify-center overflow-hidden bg-transparent">
        {/* Content stays the same, but we remove the background elements */}
        <div className={`relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="max-w-5xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-8">
              <Sparkles className="w-4 h-4 text-yellow-400 mr-2" />
              <span className="text-white/90 text-sm font-medium">AI Destekli İçerik Üretimi</span>
            </div>

            {/* Main Headline with FlipWords */}
            <div className="mb-8">
              <CSparkFlipWordsDemo />
            </div>
            
            {/* Enhanced Tagline */}
            <p className="text-xl sm:text-2xl md:text-3xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed font-light">
              Saniyeler içinde profesyonel kalitede 
              <span className="text-purple-300 font-semibold"> blog yazıları</span>, 
              <span className="text-pink-300 font-semibold"> video scriptleri</span> ve 
              <span className="text-indigo-300 font-semibold"> sosyal medya içerikleri</span> üretin.
            </p>

            {/* Enhanced CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
              <button
                onClick={handleGetStarted}
                className="group relative w-full sm:w-auto overflow-hidden"
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative w-full sm:w-auto px-10 py-5 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xl font-bold rounded-2xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center">
                  <Zap className="mr-3 h-6 w-6 group-hover:animate-bounce" />
                  Ücretsiz Başla
                  <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
              
              <button
                onClick={handleWatchDemo}
                className="group w-full sm:w-auto px-10 py-5 border-2 border-white/30 text-white text-xl font-semibold rounded-2xl backdrop-blur-sm hover:bg-white/10 hover:border-white/50 transition-all duration-300 flex items-center justify-center"
              >
                <Play className="mr-3 h-6 w-6 group-hover:scale-110 transition-transform" />
                Demo İzle
              </button>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-8 mb-16 text-white/70">
              <div className="flex items-center">
                <Shield className="w-5 h-5 mr-2 text-green-400" />
                <span>100% Güvenli</span>
              </div>
              <div className="flex items-center">
                <Award className="w-5 h-5 mr-2 text-yellow-400" />
                <span>Kredi Kartı Gerektirmez</span>
              </div>
              <div className="flex items-center">
                <Globe className="w-5 h-5 mr-2 text-blue-400" />
                <span>30 Saniyede Kurulum</span>
              </div>
            </div>

            {/* Enhanced Demo Area */}
            <div className="relative max-w-5xl mx-auto">
              <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-2xl hover:bg-white/15 transition-all duration-500">
                <div className="aspect-video bg-gradient-to-br from-purple-800/50 to-pink-800/50 rounded-2xl flex items-center justify-center relative overflow-hidden group cursor-pointer" onClick={handleWatchDemo}>
                  {/* Background pattern */}
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20"></div>
                  
                  <div className="text-center relative z-10">
                    <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                      <Play className="w-10 h-10 text-white ml-1" />
                    </div>
                    <h3 className="text-white text-2xl font-bold mb-2">Nasıl Çalıştığını İzleyin</h3>
                    <p className="text-white/80 text-lg">2 dakikada tüm özellikleri keşfedin</p>
                  </div>
                  
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </BackgroundBeamsWithCollision>
  )
}

// Features Section Component
const FeaturesSection = () => {
  const features = [
    {
      icon: <Play className="w-8 h-8" />,
      title: "YouTube Script",
      description: "Saniyeler içinde hazır video senaryoları. Giriş, ana içerik ve kapanış ile tam format.",
      gradient: "from-red-500 to-pink-500"
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: "SEO Optimizasyonu",
      description: "Başlık, meta açıklama, anahtar kelimeler ve hashtag önerileri. Arama motoru dostu.",
      gradient: "from-green-500 to-blue-500"
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Sosyal Medya Postları",
      description: "Twitter, Instagram, LinkedIn için optimize edilmiş içerikler. Platform özelinde format.",
      gradient: "from-purple-500 to-indigo-500"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Persona Seçimi",
      description: "Haber spikeri, eğitmen, vlogger gibi farklı tonlarda içerik üretimi.",
      gradient: "from-orange-500 to-red-500"
    }
  ]

  return (
    <section className="py-24 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Güçlü <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Özellikler</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            İçerik üretimini hızlandıracak ve kaliteyi artıracak gelişmiş AI özelliklerimizi keşfedin
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <div key={index} className="group relative">
              <div className="relative bg-gray-800/50 backdrop-blur-sm rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-700/50">
                {/* Icon */}
                <div className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                
                {/* Content */}
                <h3 className="text-xl font-bold text-white mb-4">{feature.title}</h3>
                <p className="text-gray-300 leading-relaxed">{feature.description}</p>
                
                {/* Hover Effect */}
                <div className={`absolute inset-0 bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-10 rounded-3xl transition-opacity duration-300`}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// How It Works Section
const HowItWorksSection = () => {
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
    <section className="py-24 bg-gray-800">
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
          {/* Connection Lines */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500/30 via-pink-500/30 to-purple-500/30"></div>
          
          <div className="grid lg:grid-cols-3 gap-12 relative">
            {steps.map((step, index) => (
              <div key={index} className="text-center relative">
                {/* Step Number */}
                <div className="relative mx-auto w-24 h-24 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mb-8 shadow-xl">
                  <span className="text-2xl font-bold text-white">{step.number}</span>
                  <div className="absolute inset-0 bg-white/20 rounded-full animate-ping opacity-25"></div>
                </div>
                
                {/* Icon */}
                <div className="w-16 h-16 bg-gray-700/50 rounded-2xl flex items-center justify-center text-purple-400 mx-auto mb-6 backdrop-blur-sm border border-gray-600/50">
                  {step.icon}
                </div>
                
                {/* Content */}
                <h3 className="text-2xl font-bold text-white mb-4">{step.title}</h3>
                <p className="text-gray-300 leading-relaxed max-w-sm mx-auto">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// Pricing Section Component
const PricingSection = () => {
  const router = useRouter()

  const handlePlanSelect = (plan: string) => {
    if (plan === 'Free') {
      router.push('/app')
    } else if (plan === 'Pro') {
      router.push('/app?upgrade=pro')
    } else if (plan === 'Agency') {
      // Contact form or email
      window.location.href = 'mailto:info@creatortransformer.com?subject=Agency Plan İnterest'
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
    <section id="pricing" className="py-24 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Basit <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Fiyatlandırma</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            İhtiyacınıza uygun planı seçin ve hemen başlayın
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div 
              key={index} 
              className={`relative transform transition-all duration-300 hover:scale-105 ${
                plan.popular ? 'lg:scale-110 lg:-translate-y-4' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
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
      name: "Ahmet Yılmaz",
      role: "İçerik Üreticisi",
      comment: "Bu araçla haftada 10 saat tasarruf ettim. YouTube kanalım için script yazma süreci artık çok hızlı!",
      rating: 5,
      avatar: "AY"
    },
    {
      name: "Elif Kaya",
      role: "Dijital Pazarlama Uzmanı",
      comment: "SEO önerileri gerçekten işe yarıyor. Google'da sıralamamız belirgin şekilde iyileşti.",
      rating: 5,
      avatar: "EK"
    },
    {
      name: "Can Demir",
      role: "Sosyal Medya Uzmanı",
      comment: "Farklı persona seçenekleri sayesinde her platform için uygun içerik üretebiliyorum.",
      rating: 5,
      avatar: "CD"
    }
  ]

  return (
    <section className="py-24 bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Kullanıcılarımız <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Ne Diyor?</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-gray-700/50 backdrop-blur-sm rounded-3xl p-8 hover:shadow-lg transition-all duration-300 border border-gray-600/50">
              {/* Stars */}
              <div className="flex mb-6">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              
              {/* Comment */}
              <p className="text-gray-300 text-lg leading-relaxed mb-6">"{testimonial.comment}"</p>
              
              {/* Author */}
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white font-semibold mr-4">
                  {testimonial.avatar}
                </div>
                <div>
                  <h4 className="font-semibold text-white">{testimonial.name}</h4>
                  <p className="text-gray-400 text-sm">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// FAQ Section
const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const faqs = [
    {
      question: "Ücretsiz plan limiti nedir?",
      answer: "Ücretsiz planda günde 3 içerik üretebilirsiniz. Bu YouTube script, sosyal medya postu veya özet olabilir."
    },
    {
      question: "Pro planda hangi özellikler var?",
      answer: "Pro planda sınırsız içerik üretimi, tüm persona seçenekleri, SEO paketi, Generate All özelliği ve öncelikli destek bulunmaktadır."
    },
    {
      question: "Hangi dilleri destekliyorsunuz?",
      answer: "Şu anda Türkçe ve İngilizce desteklenmektedir. Yakında diğer diller de eklenecek."
    },
    {
      question: "İçerik kalitesi nasıl?",
      answer: "GPT-4 tabanlı gelişmiş AI modelimiz, profesyonel yazarlar seviyesinde kaliteli içerik üretir."
    },
    {
      question: "Planımı nasıl değiştirebilirim?",
      answer: "Hesap ayarlarınızdan istediğiniz zaman plan değişikliği yapabilirsiniz. Değişiklik anında geçerli olur."
    }
  ]

  return (
    <section className="py-24 bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Sık Sorulan <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Sorular</span>
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-700/50">
              <button
                className="w-full px-8 py-6 text-left flex items-center justify-between hover:bg-gray-700/30 transition-colors duration-200"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <span className="text-lg font-semibold text-white">{faq.question}</span>
                {openIndex === index ? (
                  <ChevronUp className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </button>
              
              {openIndex === index && (
                <div className="px-8 pb-6">
                  <p className="text-gray-300 leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Final CTA Section
const FinalCTASection = () => {
  const router = useRouter()

  const handleGetStarted = () => {
    router.push('/app')
  }

  return (
    <section className="py-24 bg-gradient-to-br from-purple-900 via-indigo-900 to-pink-900 relative overflow-hidden">
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-3/4 left-3/4 w-32 h-32 bg-indigo-500/20 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>

      {/* Animated particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white/10 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          />
        ))}
      </div>

      <div className="relative max-w-5xl mx-auto text-center px-4 sm:px-6 lg:px-8">
        {/* Enhanced headline */}
        <h2 className="text-5xl md:text-7xl font-bold text-white mb-8 leading-tight">
          Hazır mısın?
          <span className="block text-4xl md:text-6xl bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent mt-2">
            İçeriğini Dönüştür!
          </span>
        </h2>
        
        <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
          İçerik üretiminde devrim yaratın. Saniyeler içinde profesyonel kalitede içerikler oluşturun 
          ve rakiplerinizin önüne geçin.
        </p>
        
        {/* Enhanced CTA buttons */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
          <button
            onClick={handleGetStarted}
            className="group relative w-full sm:w-auto overflow-hidden"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-1000"></div>
            <div className="relative w-full sm:w-auto px-12 py-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xl font-bold rounded-2xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center">
              <Zap className="mr-3 h-6 w-6 group-hover:animate-bounce" />
              Ücretsiz Denemeye Başla
              <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>
          
          <button
            onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
            className="group w-full sm:w-auto px-12 py-6 border-2 border-white/30 text-white text-xl font-semibold rounded-2xl backdrop-blur-sm hover:bg-white/10 hover:border-white/50 transition-all duration-300 flex items-center justify-center"
          >
            <Star className="mr-3 h-6 w-6 group-hover:scale-110 transition-transform" />
            Fiyatları İncele
          </button>
        </div>

        {/* Trust indicators */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-8 mb-8 text-white/70">
          <div className="flex items-center text-lg">
            <Shield className="w-6 h-6 mr-2 text-green-400" />
            <span>100% Güvenli & Özel</span>
          </div>
          <div className="flex items-center text-lg">
            <Award className="w-6 h-6 mr-2 text-yellow-400" />
            <span>Kredi Kartı Gerektirmez</span>
          </div>
          <div className="flex items-center text-lg">
            <Clock className="w-6 h-6 mr-2 text-blue-400" />
            <span>Anında Kullanıma Hazır</span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-2">10,000+</div>
            <div className="text-white/70">Oluşturulan İçerik</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-2">5 Saniye</div>
            <div className="text-white/70">Ortalama Üretim Süresi</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-2">98%</div>
            <div className="text-white/70">Kullanıcı Memnuniyeti</div>
          </div>
        </div>
      </div>
    </section>
  )
}

// Footer Component
const Footer = () => {
  const router = useRouter()

  const handleLinkClick = (path: string) => {
    if (path.startsWith('mailto:') || path.startsWith('https://')) {
      window.location.href = path
    } else {
      router.push(path)
    }
  }

  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <h3 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
              CSpark
            </h3>
            <p className="text-gray-400 mb-6 max-w-md text-lg leading-relaxed">
              AI destekli içerik üretim platformu. YouTube scriptleri, sosyal medya postları ve SEO paketi ile içerik üretiminizi hızlandırın.
            </p>
            <div className="flex space-x-6">
              <button 
                onClick={() => handleLinkClick('https://twitter.com/creatortransformer')}
                className="text-gray-400 hover:text-purple-400 transition-colors duration-300 transform hover:scale-110"
              >
                <span className="sr-only">Twitter</span>
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </button>
              <button 
                onClick={() => handleLinkClick('https://linkedin.com/company/creatortransformer')}
                className="text-gray-400 hover:text-blue-400 transition-colors duration-300 transform hover:scale-110"
              >
                <span className="sr-only">LinkedIn</span>
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </button>
              <button 
                onClick={() => handleLinkClick('https://instagram.com/creatortransformer')}
                className="text-gray-400 hover:text-pink-400 transition-colors duration-300 transform hover:scale-110"
              >
                <span className="sr-only">Instagram</span>
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.621 5.367 11.988 11.988 11.988s11.987-5.367 11.987-11.988C24.004 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.324-1.297C4.198 14.895 3.708 13.744 3.708 12.447s.49-2.448 1.297-3.324c.876-.807 2.027-1.297 3.324-1.297s2.448.49 3.324 1.297c.807.876 1.297 2.027 1.297 3.324s-.49 2.448-1.297 3.324c-.876.807-2.027 1.297-3.324 1.297zm7.239-2.209a.887.887 0 01-.623-.258.887.887 0 01-.258-.623.887.887 0 01.258-.623.887.887 0 01.623-.258.887.887 0 01.623.258.887.887 0 01.258.623.887.887 0 01-.258.623.887.887 0 01-.623.258z"/>
                </svg>
              </button>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="font-semibold mb-6 text-white">Ürün</h4>
            <ul className="space-y-3 text-gray-400">
              <li>
                <button 
                  onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
                  className="hover:text-white transition-colors duration-300"
                >
                  Özellikler
                </button>
              </li>
              <li>
                <button 
                  onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
                  className="hover:text-white transition-colors duration-300"
                >
                  Fiyatlandırma
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleLinkClick('/app')}
                  className="hover:text-white transition-colors duration-300"
                >
                  Demo
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleLinkClick('mailto:api@creatortransformer.com')}
                  className="hover:text-white transition-colors duration-300"
                >
                  API
                </button>
              </li>
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="font-semibold mb-6 text-white">Destek</h4>
            <ul className="space-y-3 text-gray-400">
              <li>
                <button 
                  onClick={() => handleLinkClick('mailto:help@creatortransformer.com')}
                  className="hover:text-white transition-colors duration-300"
                >
                  Yardım Merkezi
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleLinkClick('mailto:info@creatortransformer.com')}
                  className="hover:text-white transition-colors duration-300"
                >
                  İletişim
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleLinkClick('/privacy')}
                  className="hover:text-white transition-colors duration-300"
                >
                  Gizlilik Politikası
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleLinkClick('/terms')}
                  className="hover:text-white transition-colors duration-300"
                >
                  Kullanım Şartları
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom section */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <p className="text-gray-400 text-center md:text-left">
              &copy; 2025 Creator Transformer. Tüm hakları saklıdır.
            </p>
            <div className="flex items-center mt-4 md:mt-0 space-x-6">
              <span className="text-gray-400 text-sm">Türkiye'de yapıldı</span>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-green-400 text-sm">Sistem Aktif</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

// Main Landing Page Component
export default function LandingPage() {
  // Products data for HeroParallax
  const products = [
    {
      title: "YouTube Creator Studio",
      link: "#",
      thumbnail: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=600&h=400&fit=crop&crop=top",
    },
    {
      title: "TikTok Content Lab",
      link: "#",
      thumbnail: "https://images.unsplash.com/photo-1632472938728-3faee92c0578?w=600&h=400&fit=crop&crop=center",
    },
    {
      title: "Instagram Reels AI",
      link: "#",
      thumbnail: "https://images.unsplash.com/photo-1562577309-4932fdd64cd1?w=600&h=400&fit=crop&crop=center",
    },
    {
      title: "SEO Content Engine",
      link: "#",
      thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop&crop=center",
    },
    {
      title: "Blog Writer AI",
      link: "#",
      thumbnail: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=600&h=400&fit=crop&crop=center",
    },
    {
      title: "Social Media Scheduler",
      link: "#",
      thumbnail: "https://images.unsplash.com/photo-1611926653458-09294b3142bf?w=600&h=400&fit=crop&crop=center",
    },
    {
      title: "Video Script Generator",
      link: "#",
      thumbnail: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=600&h=400&fit=crop&crop=center",
    },
    {
      title: "Content Analytics",
      link: "#",
      thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop&crop=center",
    },
    {
      title: "Hashtag Optimizer",
      link: "#",
      thumbnail: "https://images.unsplash.com/photo-1611224923700-7d9ada276bf7?w=600&h=400&fit=crop&crop=center",
    },
    {
      title: "Thumbnail Designer",
      link: "#",
      thumbnail: "https://images.unsplash.com/photo-1558655146-364adaf25fb9?w=600&h=400&fit=crop&crop=center",
    },
    {
      title: "Voice-to-Text AI",
      link: "#",
      thumbnail: "https://images.unsplash.com/photo-1589254065909-42fa4dd46734?w=600&h=400&fit=crop&crop=center",
    },
    {
      title: "Translation Hub",
      link: "#",
      thumbnail: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=600&h=400&fit=crop&crop=center",
    },
    {
      title: "Trend Analyzer",
      link: "#",
      thumbnail: "https://images.unsplash.com/photo-1590736969955-71cc94901144?w=600&h=400&fit=crop&crop=center",
    },
    {
      title: "Content Calendar",
      link: "#",
      thumbnail: "https://images.unsplash.com/photo-1434626881859-194d67b2b86f?w=600&h=400&fit=crop&crop=center",
    },
    {
      title: "Brand Voice AI",
      link: "#",
      thumbnail: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop&crop=center",
    },
  ];

  return (
    <HeroParallax products={products}>
      <div className="min-h-screen bg-black">
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <PricingSection />
        <TestimonialsSection />
        <FAQSection />
        <FinalCTASection />
        <Footer />
      </div>
    </HeroParallax>
  )
}
