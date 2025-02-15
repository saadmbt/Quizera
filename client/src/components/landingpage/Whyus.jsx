import React from 'react'
import { whyus } from '../../constants'
import WUSwiper from './WUSwiper'
import { motion } from "framer-motion"
import {fadeIn} from '../../constants/variants'
const Whyus = () => {
  return (<section className='bg-gradient-to-t from-[#FFFFFF] to-[#D2DCFF]' id='Whyus'>
        <div className="container lg-centered py-10 px-8">
            <motion.div
            variants={fadeIn('up',0.2)}
            initial='hidden'
            whileInView={'show'}
            
             className="flex flex-col items-center gap-4 lg:mb-10 md:mb-0 md:mt-4  max-w-[540px] mx-auto">
                <h2 className="section-title mt-2">Why Choose Our Quiz Generator?</h2>
            </motion.div>
            <motion.div
                variants={fadeIn('up',0.3)}
                initial='hidden'
                whileInView={'show'}
             className='hidden md:hidden lg:gap-4 xl:gap-14  lg:grid lg:grid-cols-3 xl:grid xl:grid-cols-3 gap-4  lg:items-start'>
                {whyus.map((why,i)=>{
                    return <div key={i} className='bg-white p-6 border  border-[#F1F1F1] rounded-3xl shadow-[0_7px_14px_#EAEAEA] mb-10 max-w-[380px] min-h-[200px] mx-auto transform transition duration-500 hover:scale-110'>
                            <div className='flex  items-center gap-4'>
                                <img src={why.icon} className='w-10 h-10' />
                                <span className='text-lg  md:text-lg lg:text-medium font-bold  '> {why.title}</span>
                            </div>
                            <p className=' text-sm font-bold text-slate-500 mt-2 tracking-tight  my-auto mx-auto'>{why.subtitle}</p>
                    </div>
                })}
            </motion.div>
            <WUSwiper/>
        </div>
  </section>
  )
}

export default Whyus