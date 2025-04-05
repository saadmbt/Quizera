import React from 'react'
import { herotext } from '../../constants'
import { ArrowDown, CheckCircle, FileText, HelpCircle } from 'lucide-react'
import heroimage from '../../assets/heroimage.png'
import LogosTicker from './LogosTicker'
import { motion } from "framer-motion"
import { fadeIn } from '../../constants/variants'
import { Link } from 'react-scroll'

const Hero = () => {
  return (
    <section className='pt-8 pl-4 pb-20 md:pt-5 md:pb-[59px] lg:pt-2 lg:pb-[68px] bg-[radial-gradient(ellipse_200%_100%_at_bottom_left,#D2DCFF,#fafcff_45%)] md:bg-[radial-gradient(ellipse_200%_100%_at_bottom_left,#D2DCFF,#fafcff_66%)] overflow-x-clip relative'>
      <div className='container lg-centered'>
        <div className='md:flex items-center gap-6'>
          {/* text section */}
          <motion.div 
            variants={fadeIn('right', 0.3)}
            initial='hidden'
            whileInView={'show'}
            viewport={{once: false, amount: 0.4}}
            className='max-w-[400px] md:w-[470px] lg:max-w-[500px]'
          >
            <div>
              <div className='text-sm inline-flex border border-primary px-3 py-1 mt-1 md:mt-4 rounded-lg tracking-tight shadow-md bg-white/50 backdrop-blur-sm'>{herotext.upsub}</div>
              <h1 className='text-4xl md:text-3xl lg:text-5xl font-bold tracking-tighter mt-6'>
                <span className='text-[#1884FF]'>Create a Quiz</span> <br />
                <span className='text-gray-800'>instantly, with your</span> <br />
                <span className='text-[#1884FF]'>own files!</span>
              </h1>
              <p className='text-lg text-[#010D3E] tracking-tight lg:text-xl mt-6 md:text-medium'>{herotext.subtitle}</p>
            </div>
            
            {/* Quick steps */}
            <div className='flex gap-4 mt-6 mb-8'>
              <div className='flex gap-2 items-center'>
                <span className='text-[#1884FF] text-xs font-bold'>1. UPLOAD</span>
                <FileText className='h-4 w-4 text-[#1884FF]' />
              </div>
              <div className='flex gap-2 items-center'>
                <span className='text-[#1884FF] text-xs font-bold'>2. GENERATE</span>
                <HelpCircle className='h-4 w-4 text-[#1884FF]' />
              </div>
              <div className='flex gap-2 items-center'>
                <span className='text-[#1884FF] text-xs font-bold'>3. SHARE</span>
                <CheckCircle className='h-4 w-4 text-[#1884FF]' />
              </div>
            </div>
            
            {/* buttons section */}
            <div className='flex gap-4 items-center mt-8'>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }} 
                className='btn btn-primary text-white bg-[#1884FF] hover:bg-[#0066cc] px-6 md:px-3 py-3 rounded-lg font-medium shadow-lg shadow-blue-200'
              >
                <a href="/auth/login">{herotext.cta}</a>
              </motion.button>
              <motion.button 
                whileHover={{ y: 2 }}
                whileTap={{ scale: 0.85 }} 
                className='btn btn-text flex items-center gap-2 text-gray-700 hover:text-[#1884FF]'
              > 
                <Link to="howitworks" smooth={true} duration={500}>{herotext.lmbtn}</Link>
                <motion.div
                  animate={{ y: [0, 5, 0] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  <ArrowDown className='h-5 w-5'/>
                </motion.div>
              </motion.button>
            </div>
          </motion.div>
          
          {/* illustration section */}
          <motion.div 
            variants={fadeIn('left', 0.3)}
            initial='hidden'
            whileInView={'show'}
            viewport={{once: false, amount: 0.4}}
            className='relative hidden md:block mt-20 md:mt-0 md:w-2/3 lg:w-2/4 lg:ml-28 xl:ml-40'
            id='usedby'
          >
            {/* Icon animations
            <motion.div 
              className="absolute -top-4 left-20 bg-white p-2 rounded-full shadow-lg z-10"
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 3, delay: 0.5 }}
            >
              <FileText className="h-6 w-6 text-[#1884FF]" />
            </motion.div>
            
            <motion.div 
              className="absolute top-1/4 -left-4 bg-white p-2 rounded-full shadow-lg z-10"
              animate={{ x: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 3 }}
            >
              <HelpCircle className="h-6 w-6 text-[#1884FF]" /> 
            </motion.div>*/}
            
            {/* <motion.div 
              className="absolute bottom-1/4 right-4 bg-white p-2 rounded-full shadow-lg z-10"
              animate={{ rotate: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 2, delay: 1 }}
            >
              <CheckCircle className="h-6 w-6 text-green-500" />
            </motion.div> */}
            
            {/* Main image with enhancement */}
            <div className="relative">
              <div className="absolute  rounded-2xl"></div>
              <img 
                src={heroimage} 
                alt="PrepGenius quiz creation illustration" 
                className="relative z-0 rounded-2xl "
              />
            </div>
            
            {/* Social proof badge */}
            <motion.div 
              className="absolute bottom-4 left-10 bg-white px-3 py-2 rounded-lg shadow-lg z-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
            >
              <p className="text-xs font-medium text-gray-800">Trusted by <span className="text-[#1884FF] font-bold">10,000+</span> educators</p>
            </motion.div>
          </motion.div>
        </div>
      </div>
      
      {/* Logos section */}
      <div className="mt-12 md:mt-16">
        <LogosTicker />
      </div>
    </section>
  )
}

export default Hero