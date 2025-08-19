'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowRight, CheckCircle, Star, Zap, Target, Users, Clock, TrendingUp, Play, ChevronDown, ChevronUp, Sparkles, Globe, Shield, Award } from 'lucide-react'
import { BackgroundBeamsWithCollision } from '@/components/ui/background-beams-with-collision'
import { CSparkFlipWordsDemo } from '@/components/cspark-flip-words-demo'

// Hero Section Component
const HeroSection = () => {
  const [isLoaded, setIsLoaded] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  const handleGetStarted = () => {
    router.push('/app')
  }

  const handleWatchDemo = () => {
    // Demo functionality
  }

  return (
    <BackgroundBeamsWithCollision>
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-transparent">
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

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400 mb-2">10K+</div>
                <div className="text-gray-400">İçerik Üretildi</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400 mb-2">50+</div>
                <div className="text-gray-400">Dil Desteği</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400 mb-2">99%</div>
                <div className="text-gray-400">Kullanıcı Memnuniyeti</div>
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
      role: "YouTuber",
      comment: "CSpark sayesinde video scriptlerimi çok daha hızlı hazırlıyorum. İçerik kalitesi de harika!",
      rating: 5,
      avatar: "AY"
    },
    {
      name: "Elif Kaya",
      role: "Dijital Pazarlama Uzmanı",
      comment: "SEO paketleri gerçekten işe yarıyor. Web sitemizin trafiği %200 arttı.",
      rating: 5,
      avatar: "EK"
    },
    {
      name: "Can Demir",
      role: "İçerik Üreticisi",
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

// Footer
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
          </div>

          {/* Product Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Ürün</h4>
            <ul className="space-y-3">
              <li><button onClick={() => handleLinkClick('/app')} className="text-gray-400 hover:text-purple-400 transition-colors">Uygulamaya Git</button></li>
              <li><button onClick={() => handleLinkClick('#pricing')} className="text-gray-400 hover:text-purple-400 transition-colors">Fiyatlandırma</button></li>
              <li><button onClick={() => handleLinkClick('/api-docs')} className="text-gray-400 hover:text-purple-400 transition-colors">API</button></li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Şirket</h4>
            <ul className="space-y-3">
              <li><button onClick={() => handleLinkClick('/about')} className="text-gray-400 hover:text-purple-400 transition-colors">Hakkımızda</button></li>
              <li><button onClick={() => handleLinkClick('/contact')} className="text-gray-400 hover:text-purple-400 transition-colors">İletişim</button></li>
              <li><button onClick={() => handleLinkClick('/privacy')} className="text-gray-400 hover:text-purple-400 transition-colors">Gizlilik</button></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center">
          <p className="text-gray-400">© 2025 CSpark. Tüm hakları saklıdır.</p>
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
      <Footer />
    </div>
  )
}
