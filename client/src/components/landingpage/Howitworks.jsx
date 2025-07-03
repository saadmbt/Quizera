import React, { useState } from 'react'
import { UploadCloudIcon, WandIcon, BrainIcon, ShareIcon, Zap, Brain, Share, UploadCloud, ArrowRight } from 'lucide-react'
import Subhero from './Subhero'
import { motion } from 'framer-motion'

const Howitworks = () => {
  const [hoveredStep, setHoveredStep] = useState(null);

  const steps = [
    {
      title: 'Upload your file',
      description: 'Simply drag and drop your document, or select it from your device.',
      icon: <UploadCloud size={32} className="text-white" />,
      color: 'from-blue-500 to-blue-600',
      hoverColor: 'from-blue-600 to-blue-700',
      number: '01'
    },
    {
      title: 'Generate your quiz',
      description: 'Our AI analyzes your content and creates relevant questions automatically.',
      icon: <Zap size={32} className="text-white" />,
      color: 'from-purple-500 to-purple-600',
      hoverColor: 'from-purple-600 to-purple-700',
      number: '02'
    },
    {
      title: 'Test Your Knowledge',
      description: 'Take the quiz yourself or assign it to others to gauge understanding.',
      icon: <Brain size={32} className="text-white" />,
      color: 'from-emerald-500 to-emerald-600',
      hoverColor: 'from-emerald-600 to-emerald-700',
      number: '03'
    },
    {
      title: 'Share your quiz',
      description: 'Distribute your quiz via link, email, or embed it on your website.',
      icon: <Share size={32} className="text-white" />,
      color: 'from-orange-500 to-orange-600',
      hoverColor: 'from-orange-600 to-orange-700',
      number: '04'
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

  const stepVariants = {
    hidden: { 
      opacity: 0, 
      y: 50,
      scale: 0.8
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

  const lineVariants = {
    hidden: { scaleX: 0 },
    show: { 
      scaleX: 1,
      transition: {
        duration: 1.2,
        delay: 0.8,
        ease: "easeInOut"
      }
    }
  };

  return (
    <section className='py-14 px-4 bg-gradient-to-b from-[#FFFFFF] to-[#D2DCFF] relative overflow-hidden' id='howitworks'>
      {/* Background decorative elements */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-blue-200/20 rounded-full blur-2xl"></div>
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-purple-200/20 rounded-full blur-2xl"></div>
      
      <div className="container mx-auto px-4 max-w-6xl relative z-0">
        <motion.div 
          variants={headerVariants}
          initial='hidden'
          whileInView='show'
          viewport={{ once: true, amount: 0.3 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-blue-100/60 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Brain className="w-4 h-4" />
            Simple Process
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            How Quizera Works
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Creating quizzes has never been easier. Follow these simple steps to get started and transform your content into engaging assessments.
          </p>
        </motion.div>

        <div className="relative">
          {/* Enhanced connection line with animation */}
          <motion.div 
            variants={lineVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            className="hidden lg:block absolute top-[60px] left-[10%] right-[10%] h-1 bg-gradient-to-r from-blue-300 via-purple-300  to-orange-300 transform origin-left z-0 rounded-full"
          />
          
          {/* Animated dots on the line */}
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ delay: 1.2 + i * 0.2, duration: 0.4 }}
              viewport={{ once: true }}
              className={`hidden lg:block absolute top-[56px] w-3 h-3 bg-gray-300 rounded-full z-10`}
              style={{ left: `${25 + i * 25}%` }}
            />
          ))}

          <motion.div 
            variants={containerVariants}
            initial='hidden'
            whileInView='show'
            viewport={{ once: true, amount: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-20"
          >
            {steps.map((step, index) => {
              const isHovered = hoveredStep === index;
              
              return (
                <motion.div
                  key={index}
                  variants={stepVariants}
                  onHoverStart={() => setHoveredStep(index)}
                  onHoverEnd={() => setHoveredStep(null)}
                  className="flex flex-col items-center text-center group cursor-pointer"
                >
                  {/* Step number */}
                  <div className="text-gray-300 font-bold text-lg mb-2 transition-colors duration-300 group-hover:text-gray-400">
                    {step.number}
                  </div>

                  {/* Icon container  */}
                  <motion.div 
                    whileHover={{ 
                      scale: 1.1, 
                      rotate: [0, -5, 5, 0],
                      y: -5
                    }}
                    transition={{ 
                      rotate: { duration: 0.6 },
                      scale: { duration: 0.2 },
                      y: { duration: 0.2 }
                    }}
                    className={`
                      relative w-20 h-20 rounded-2xl flex items-center justify-center mb-6 
                      shadow-lg transform transition-all duration-300
                      bg-gradient-to-br ${isHovered ? step.hoverColor : step.color}
                      ${isHovered ? 'shadow-xl' : ''}
                    `}
                  >
                    {/* Glow effect */}
                    <div className={`
                      absolute inset-0 rounded-2xl transition-opacity duration-300
                      ${isHovered ? 'opacity-30' : 'opacity-0'}
                      bg-gradient-to-br ${step.color} blur-xl scale-110
                    `} />
                    
                    <div className="relative z-10">
                      {step.icon}
                    </div>

                    {/* Floating particles effect */}
                    {isHovered && (
                      <>
                        {[...Array(3)].map((_, i) => (
                          <motion.div
                            key={i}
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ 
                              scale: [0, 1, 0],
                              opacity: [0, 1, 0],
                              y: [-20, -40],
                              x: [0, (i - 1) * 20]
                            }}
                            transition={{ 
                              duration: 1.5,
                              delay: i * 0.2,
                              repeat: Infinity,
                              repeatDelay: 2
                            }}
                            className="absolute w-1 h-1 bg-white rounded-full top-0"
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
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-gray-700 transition-colors duration-200">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-200">
                      {step.description}
                    </p>
                  </motion.div>

                  {/* Arrow indicator for mobile */}
                  {index < steps.length - 1 && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      className="lg:hidden mt-6 text-gray-300"
                    >
                      <ArrowRight className="w-6 h-6 transform rotate-90" />
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
      
      <Subhero/>
    </section>
  );
};

export default Howitworks;