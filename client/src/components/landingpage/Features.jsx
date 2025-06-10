import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Zap, Users, ArrowRight, Sparkles } from 'lucide-react';

const Features = () => {
  const [hoveredFeature, setHoveredFeature] = useState(null);

  const features = [
    {
      title: 'Create quizzes from any document',
      description: 'Upload PDFs, Word documents, PowerPoint presentations, or even images, and our AI will generate relevant questions automatically.',
      icon: <FileText size={32} className="text-white" />,
      gradient: 'from-blue-500 to-indigo-600',
      hoverGradient: 'from-blue-600 to-indigo-700',
      bgGradient: 'from-blue-50 to-indigo-50',
      delay: 0,
      stats: '50+ formats'
    },
    {
      title: 'Instant quizzes',
      description: 'No waiting - our advanced algorithms process your documents in seconds, creating comprehensive quizzes ready for immediate use.',
      icon: <Zap size={32} className="text-white" />,
      gradient: 'from-purple-500 to-pink-600',
      hoverGradient: 'from-purple-600 to-pink-700',
      bgGradient: 'from-purple-50 to-pink-50',
      delay: 0.1,
      stats: '< 30 seconds'
    },
    {
      title: 'Collaborate with others',
      description: 'Share your quizzes with classmates, colleagues, or students. Work together to create the perfect assessment tool.',
      icon: <Users size={32} className="text-white" />,
      gradient: 'from-emerald-500 to-teal-600',
      hoverGradient: 'from-emerald-600 to-teal-700',
      bgGradient: 'from-emerald-50 to-teal-50',
      delay: 0.2,
      stats: 'Unlimited shares'
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 60,
      scale: 0.9
    },
    show: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        damping: 20,
        stiffness: 300
      }
    }
  };

  const headerVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <section className='bg-gradient-to-b from-[#FFFFFF] to-[#D2DCFF] py-20 relative overflow-hidden' id='Features'>
      {/* Background decorative elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-indigo-200/20 rounded-full blur-2xl"></div>
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-purple-200/20 rounded-full blur-2xl"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-100/10 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-4 max-w-6xl relative z-0">
        <motion.div 
          variants={headerVariants}
          initial='hidden'
          whileInView='show'
          viewport={{ once: true, amount: 0.3 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-indigo-100/60 text-indigo-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            Why Choose Us
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Powerful Features
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Our platform offers everything you need to create, customize, and share quizzes efficiently with cutting-edge AI technology.
          </p>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial='hidden'
          whileInView='show'
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => {
            const isHovered = hoveredFeature === index;
            
            return (
              <motion.div
                key={index}
                variants={cardVariants}
                onHoverStart={() => setHoveredFeature(index)}
                onHoverEnd={() => setHoveredFeature(null)}
                className={`
                  relative group cursor-pointer overflow-hidden
                  bg-white border border-gray-100 rounded-3xl p-8 
                  shadow-lg hover:shadow-2xl 
                  transition-all duration-500 ease-out
                  ${isHovered ? 'transform -translate-y-4 scale-105' : ''}
                `}
              >
                {/* Background gradient overlay */}
                <div className={`
                  absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-500
                  bg-gradient-to-br ${feature.bgGradient}
                `} />

                {/* Stats badge */}
                <div className="absolute top-4 right-4 bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-medium">
                  {feature.stats}
                </div>

                {/* Icon container with enhanced styling */}
                <motion.div 
                  whileHover={{ 
                    scale: 1.1,
                    rotate: [0, -5, 5, 0]
                  }}
                  transition={{ 
                    rotate: { duration: 0.6 },
                    scale: { duration: 0.2 }
                  }}
                  className={`
                    relative w-16 h-16 rounded-2xl flex items-center justify-center mb-6
                    bg-gradient-to-br ${isHovered ? feature.hoverGradient : feature.gradient}
                    shadow-lg group-hover:shadow-xl transition-all duration-300
                  `}
                >
                  {/* Glow effect */}
                  <div className={`
                    absolute inset-0 rounded-2xl transition-opacity duration-300
                    ${isHovered ? 'opacity-30' : 'opacity-0'}
                    bg-gradient-to-br ${feature.gradient} blur-xl scale-110
                  `} />
                  
                  <div className="relative z-10">
                    {feature.icon}
                  </div>

                  {/* Floating sparkles */}
                  {isHovered && (
                    <>
                      {[...Array(3)].map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ 
                            scale: [0, 1, 0],
                            opacity: [0, 1, 0],
                            y: [-15, -30],
                            x: [0, (i - 1) * 15]
                          }}
                          transition={{ 
                            duration: 1.2,
                            delay: i * 0.2,
                            repeat: Infinity,
                            repeatDelay: 2
                          }}
                          className="absolute w-1 h-1 bg-white rounded-full top-2"
                        />
                      ))}
                    </>
                  )}
                </motion.div>

                {/* Content */}
                <motion.div
                  animate={{
                    y: isHovered ? -2 : 0
                  }}
                  transition={{ duration: 0.2 }}
                >
                  <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-gray-800 transition-colors duration-200">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 mb-6 leading-relaxed group-hover:text-gray-700 transition-colors duration-200">
                    {feature.description}
                  </p>
                </motion.div>

                {/* Enhanced CTA button */}
                <motion.button 
                  whileHover={{ x: 5 }}
                  whileTap={{ scale: 0.95 }}
                  className={`
                    flex items-center gap-2 font-semibold transition-all duration-300
                    ${isHovered ? 'text-indigo-700' : 'text-indigo-600'}
                    hover:gap-3
                  `}
                >
                  Try it now
                  <motion.div
                    animate={{ x: isHovered ? 3 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ArrowRight className="w-4 h-4" />
                  </motion.div>
                </motion.button>

                {/* Hover border effect */}
                <div className={`
                  absolute inset-0 rounded-3xl transition-all duration-300 pointer-events-none
                  ${isHovered ? 'ring-2 ring-indigo-200 ring-opacity-60' : ''}
                `} />
              </motion.div>
            );
          })}
        </motion.div>

        {/* Bottom CTA section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <p className="text-gray-600 mb-6">
            Ready to experience the power of AI-driven quiz creation?
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200 inline-flex items-center gap-2"
          >
            Get Started Free
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default Features;