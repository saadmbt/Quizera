import React from 'react'
import { herotext } from '../../constants'
import { ArrowDown } from 'lucide-react'
import heroimage from '../../assets/heroimage.png'
import LogosTicker from './LogosTicker'
import { motion } from "framer-motion"
import {fadeIn} from '../../constants/variants'
import { Link } from 'react-scroll'
const Hero = () => {
  return (
    <section className='pt-8 pl-4 pb-20 md:pt-5 md:pb-[59px] lg:pt-2 lg:pb-[68px] bg-[radial-gradient(ellipse_200%_100%_at_bottom_left,#D2DCFF,#fafcff_45%)] md:bg-[radial-gradient(ellipse_200%_100%_at_bottom_left,#D2DCFF,#fafcff_66%)] overflow-x-clip'>
        
            <div className='container lg-centered'>
                <div className='md:flex items-center gap-6'>
                    {/* text section */}
                    <motion.div 
                        variants={fadeIn('right',0.3)}
                        initial='hidden'
                        whileInView={'show'}
                        viewport={{once:false,amount:0.4}}
                    className='max-w-[400px] md:w-[470px] lg:max-w-[500px]'>
                        <div>
                            <div className='text-sm inline-flex border border-primary px-3 py-1 mt-1 md:mt-4 rounded-lg tracking-tight shadow-md'>{herotext.upsub}</div>
                            <h1 className='text-4xl md:text-3xl lg:text-5xl font-bold tracking-tighter bg-gradient-to-b from-black to-[#1884FF] text-transparent bg-clip-text mt-6'>{herotext.title}</h1>
                            <p className='text-lg text-[#010D3E] tracking-tight lg:text-xl mt-6 md:text-medium'>{herotext.subtitle}</p>
                        </div>
                        {/* buttons section */}
                        <div className='flex gap-2 items-center mt-8'>
                            <motion.button whileTap={{ scale: 0.85 }} className='btn btn-primary'><a href="/login">{herotext.cta}</a></motion.button>
                            <motion.button whileTap={{ scale: 0.85 }} className='btn btn-text gap-2'> 
                                <Link to="howitworks" smooth={true} duration={500}>{herotext.lmbtn}</Link>
                                <ArrowDown className='h-5 w-5'/>
                            </motion.button>
                        </div>
                    </motion.div>
                    {/* image section */}
                    <motion.div 
                        variants={fadeIn('left',0.3)}
                        initial='hidden'
                        whileInView={'show'}
                        viewport={{once:false,amount:0.4}}
                    className=' hidden md:block mt-20 md:mt-0 md:w-2/3 lg:w-2/4 lg:ml-28 lg:right-0 xl:ml-40 xl:right-0' id='usedby'>
                        <img src={heroimage} alt=" Prepgenius hero image" />
                    </motion.div>
                </div>
                
            </div>
        {/* Logos section */}
        <LogosTicker/>
    </section>
  )
}

export default Hero