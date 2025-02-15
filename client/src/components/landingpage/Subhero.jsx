import React from 'react'
import { herotext2 } from '../../constants'
import { motion } from "framer-motion"
import {fadeIn} from '../../constants/variants'
import { RotateWords } from './textrotat'
const Subhero = () => {
  return (
    <motion.section 
    variants={fadeIn('up',0.3)}
    initial='hidden'
    whileInView={'show'}
    viewport={{once:false,amount:0.4}}
    className='py-8 px-8 md:py-5 md:px-8 lg:py-10 lg:px-2 lg:mt-12 mb-8'>
        <div className='container lg-centered'>
            <div className='flex justify-center flex-col items-center gap-6'>
                <RotateWords text={herotext2.title} words={herotext2.variable}/>
                <p className='text-center md:px-8 lg:px-64 '>{herotext2.subtitle}</p>
                <button className='btn btn-primary '>{herotext2.cta}</button>
            </div>
        </div>
    </motion.section>
  )
}

export default Subhero