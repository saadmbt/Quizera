import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, X, Sparkles} from 'lucide-react';
import { pricingTiers } from '../../constants'

// i need to up date the animtion

/**
 * Pricing component displays various pricing tiers with animations and interactive features.
 * It includes a header, pricing cards, and call-to-action buttons for selecting plans.
 * Each pricing tier showcases its features, price, and popularity status.
 */
const Pricing = () =>{
    const [hoveredTier, setHoveredTier] = useState(null);
  
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
        y: 50,
        scale: 0.95
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
  
    return (<section className='relative bg-gradient-to-t from-[#FFFFFF] to-[#D2DCFF] overflow-hidden' id='pricing'>
        {/* Background decoration */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl"></div>
        
        <div className="relative container mx-auto py-20 px-4 lg:px-8">
          <motion.div 
            variants={headerVariants}
            initial='hidden'
            whileInView='show'
            viewport={{ once: true, amount: 0.3 }}
            className="text-center mb-16 max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 bg-blue-100/50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Sparkles className="w-4 h-4" />
              Simple Pricing
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Choose Your Perfect Plan
            </h2>
            <p className="text-xl text-gray-600 leading-relaxed">
              Start free forever. Upgrade for unlimited quizzes, advanced analytics, and exclusive features.
            </p>
          </motion.div>
  
          <motion.div 
            variants={containerVariants}
            initial='hidden'
            whileInView='show'
            viewport={{ once: true, amount: 0.2 }}
            className='grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto'
          >
            {pricingTiers.map((tier, index) => {
              const IconComponent = tier.icon;
              const isPopular = tier.pp;
              const isHovered = hoveredTier === index;
              
              return (
                <motion.div
                  key={index}
                  variants={cardVariants}
                  onHoverStart={() => setHoveredTier(index)}
                  onHoverEnd={() => setHoveredTier(null)}
                  className={`
                    relative group cursor-pointer
                    ${isPopular ? 'lg:-mt-8' : ''}
                  `}
                >
                  <div className={`
                    relative bg-white rounded-3xl p-8 border-2 transition-all duration-300
                    shadow-lg hover:shadow-2xl
                    ${isPopular 
                      ? 'border-blue-500 shadow-blue-100/50' 
                      : 'border-gray-100 hover:border-gray-200'
                    }
                    ${isHovered ? 'scale-105 -translate-y-2' : ''}
                  `}>
                    
                    {/* Popular badge */}
                    {isPopular && (
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg">
                          ⭐ Most Popular
                        </div>
                      </div>
                    )}
  
                    {/* Icon */}
                    <div className={`
                      w-16 h-16 rounded-2xl flex items-center justify-center mb-6 mx-auto
                      bg-gradient-to-br ${tier.gradient}
                    `}>
                      <IconComponent className="w-8 h-8 text-gray-700" />
                    </div>
  
                    {/* Header */}
                    <div className="text-center mb-8">
                      <h3 className='text-2xl font-bold text-gray-900 mb-2'>
                        {tier.title}
                      </h3>
                      <p className='text-gray-600 mb-6'>
                        {tier.subtitle}
                      </p>
                      
                      <div className='flex items-baseline justify-center gap-2 mb-2'>
                        {tier.old_price && (
                          <span className='text-lg text-gray-400 line-through font-medium'>
                            {tier.old_price}
                          </span>
                        )}
                        <span className='text-5xl font-bold text-gray-900'>
                          {tier.price}
                        </span>
                        {tier.price !== "Contact Sales" && (
                          <span className='text-gray-500 font-medium'>
                            /month
                          </span>
                        )}
                      </div>
                    </div>
  
                    {/* Features */}
                    <ul className='space-y-4 mb-8'>
                      {tier.features.map((feature, featureIndex) => (
                        <motion.li 
                          key={featureIndex}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ delay: featureIndex * 0.1 }}
                          className='flex items-center gap-3'
                        >
                          {feature.icon === "Check" ? (
                            <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                              <Check className="w-3 h-3 text-green-600" />
                            </div>
                          ) : (
                            <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                              <X className="w-3 h-3 text-gray-400" />
                            </div>
                          )}
                          <span className={`text-sm ${feature.icon === "Check" ? 'text-gray-700' : 'text-gray-400'}`}>
                            {feature.text}
                          </span>
                        </motion.li>
                      ))}
                    </ul>
  
                    {/* CTA Button */}
                    <motion.button 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`
                        w-full py-4 px-6 rounded-xl font-semibold text-sm transition-all duration-200
                        ${isPopular 
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-purple-700' 
                          : 'bg-gray-900 text-white hover:bg-gray-800'
                        }
                      `}
                    >
                      {tier.cta}
                    </motion.button>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
  
        </div>
      </section>
    );
  };
export default Pricing;