import React, { useEffect } from 'react'
import { Globe2Icon, SparklesIcon, ArrowRightIcon, ArrowDownRightIcon, ArrowDownIcon } from 'lucide-react'
export default function Hero() {
  useEffect(() => {
    const elements = document.querySelectorAll('.animate-in')
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in')
        }
      })
    })
    elements.forEach((element) => observer.observe(element))
    return () => observer.disconnect()
  }, [])
  return (
    <section className="relative w-full min-h-[90vh] bg-gradient-to-b from-indigo-50 via-white to-white pt-32 overflow-hidden mb-6">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Gradient orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-200/30 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-200/30 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/3 w-96 h-96 bg-blue-200/30 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
        {/* Geometric shapes */}
        <div className="absolute top-1/4 left-1/4 w-12 h-12 border-2 border-indigo-200 rounded-lg transform rotate-45 animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-8 h-8 bg-blue-100 rounded-full animate-float animation-delay-2000"></div>
        <div className="absolute top-1/3 right-1/3 w-6 h-6 bg-indigo-100 transform rotate-12 animate-float animation-delay-4000"></div>
      </div>
      <div className="relative container mx-auto px-4 text-center">
        {/* New Feature Badge */}
        <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-indigo-100 mb-8 animate-in">
          <SparklesIcon size={16} className="text-blue-600" />
          <span className="text-sm font-medium bg-gradient-to-r from-indigo-600 to-blue-600 text-transparent bg-clip-text">
            Introducing AI-Powered Quiz Generation
          </span>
        </div>
        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-8 animate-in">
            Create Quizzes{' '}
            <span className="relative">
              <span className="relative z-10 bg-gradient-to-r from-indigo-600 to-blue-600 text-transparent bg-clip-text">
                Instantly
              </span>
              <svg
                className="absolute -bottom-2 left-0 w-full h-3 text-indigo-200 z-0"
                viewBox="0 0 100 12"
                preserveAspectRatio="none"
              >
                <path d="M0,0 Q50,12 100,0" fill="currentColor" />
              </svg>
            </span>
            <br />
            with Your Own Files
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8 animate-in">
            Transform your documents into engaging quizzes in seconds. Perfect
            for educators, students, and professionals seeking efficient
            learning assessment tools.
          </p>
          {/* Language Support */}
          <div className="inline-flex items-center gap-2 text-blue-400 mb-12 animate-in">
            <div className="p-2 bg-white rounded-full shadow-md">
              <Globe2Icon size={24} className="animate-pulse" />
            </div>
            <span className="font-semibold">Available in All Languages</span>
          </div>
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-in">
            <button
              onClick={() => window.location.href = '/auth/Signup'} 
            className="group relative px-8 py-4 bg-gradient-to-r from-primary to-blue-800 text-white rounded-full font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-indigo-200">
              <span className="flex items-center justify-center gap-2">
                Create Your First Quiz
                <ArrowRightIcon
                  size={20}
                  className="transition-transform group-hover:translate-x-1"
                />
              </span>
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-200 to-blue-600 blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>
            </button>
            <button 
            // on click scroll down to the next section 
            onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
            className="flex  justify-center text-center px-6 py-4 bg-white text-blue-600 rounded-full font-medium border-2 border-indigo-100 transition-all duration-300 hover:border-indigo-200 hover:bg-indigo-50">
              learn more
              <ArrowDownIcon
                size={20}
                className="ml-2 transition-transform group-hover:translate-x-1"
              />
            </button>
          </div>
          {/* Trust Indicators */}
          {/* <div className="animate-in">
            <p className="text-sm text-gray-500 mb-6">
              Trusted by leading organizations worldwide
            </p>
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/2560px-Google_2015_logo.svg.png"
                alt="Google"
                className="h-5 sm:h-6 grayscale hover:grayscale-0 transition-all duration-300"
              />
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Microsoft_logo_%282012%29.svg/2560px-Microsoft_logo_%282012%29.svg.png"
                alt="Microsoft"
                className="h-5 sm:h-6 grayscale hover:grayscale-0 transition-all duration-300"
              />
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/IBM_logo.svg/2560px-IBM_logo.svg.png"
                alt="IBM"
                className="h-5 sm:h-6 grayscale hover:grayscale-0 transition-all duration-300"
              />
            </div>
          </div> */}
        </div>
      </div>
    </section>
  )
}
