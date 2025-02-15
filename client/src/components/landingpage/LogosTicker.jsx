import React from 'react'
import Stanford from '../../assets/unilogos/Stanford.png'
import Oxford from '../../assets/unilogos/Oxford.png'
import Harvard from '../../assets/unilogos/Harvard.png'
import Cambridge from '../../assets/unilogos/Cambridge.png'
import akhawayn from '../../assets/unilogos/al-akhawayn-university-logo.png'
import hassan2 from '../../assets/unilogos/hassan-ii-university-of-casablanca-logo.png'
import { motion } from "framer-motion"
import {fadeIn} from '../../constants/variants'
const LogosTicker = () => {
  return (
    <motion.div 
        variants={fadeIn('up',0.2)}
        initial='hidden'
        whileInView={'show'}
        viewport={{once:false,amount:0.7}}
    className='py-4 mt-4 md:mt-8 md:w-full xl:w-full'>
        <div className='container lg-centered'>
          <div className='flex items-center justify-center mb-6 text-sm text-black tracking-tight font-bold'>
            <h4 className='text-xl px-3 py-2 tracking-tight '>Used by student from </h4>
          </div>
          <div className='flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black,transparent)] '>
            <motion.div className='flex gap-14 flex-none pr-14 md:gap-20 lg:pr-20 xl:gap-30 xl:pr-24'
              animate={{ translateX: "-50%" }}
              transition={{ 
                duration: 20,
                repeat: Infinity,
                repeatType: "loop",
                ease: "linear"
               }}
            >
                <img src={Stanford} alt="Stanford logo" className='logo-tricker-image'/>
                <img src={Oxford} alt="Oxford logo" className='logo-tricker-image'/>
                <img src={Cambridge} alt="Cambridge logo" className='logo-tricker-image'/>
                <img src={akhawayn} alt="akhawayn logo" className='logo-tricker-image'/>
                <img src={hassan2} alt="hassan2 logo" className='logo-tricker-image'/>
                <img src={Harvard} alt="Harvard logo" className='logo-tricker-image'/>

                {/* Second set of logos of animation */}
                
                <img src={Stanford} alt="Stanford logo" className='logo-tricker-image'/>
                <img src={Oxford} alt="Oxford logo" className='logo-tricker-image'/>
                <img src={Cambridge} alt="Cambridge logo" className='logo-tricker-image'/>
                <img src={akhawayn} alt="akhawayn logo" className='logo-tricker-image'/>
                <img src={hassan2} alt="hassan2 logo" className='logo-tricker-image'/>
                <img src={Harvard} alt="Harvard logo" className='logo-tricker-image'/>
              </motion.div>
          </div>
            
        </div>
    </motion.div>
  )
}

export default LogosTicker