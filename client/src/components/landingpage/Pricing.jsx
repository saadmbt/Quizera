import React from 'react'
import {Link} from 'react-router-dom'
import { Check } from 'lucide-react';
import { X } from 'lucide-react';
import { pricingTiers } from '../../constants'
import { twMerge } from 'tailwind-merge'
import { motion } from "framer-motion"
import {fadeIn} from '../../constants/variants'
const Pricing = () => {
  return (
    <section className='bg-gradient-to-t from-[#FFFFFF] to-[#D2DCFF]' id='Pricing'>
        <div className="container lg-centered py-10 px-4">
            <motion.div 
            variants={fadeIn('left',0.3)}
            initial='hidden'
            whileInView={'show'}
            viewport={{once:false,amount:0.7}}
            className="flex flex-col items-center gap-4 mb-4 max-w-[540px] mx-auto">
                <h2 className="section-title  mt-2">Pricing</h2>
                <p className="section-Description ">Free Forever. Upgrade for unlimited Quizzes, better result and exclusive features </p>
            </motion.div>
            <div className=' lg:flex lg:gap-4 xl:flex xl:gap-14 md:justify-center lg:items-end'>
                { pricingTiers.map((tier,i)=>{
                    return <motion.div
                    variants={fadeIn('right',`${i+1/10}`)}
                    initial='hidden'
                    whileInView={'show'}
                    viewport={{once:false,amount:0.4}}
                    key={i} className={twMerge(' bg-white p-10 border border-[#F1F1F1] rounded-3xl shadow-[0_7px_14px_#EAEAEA] mb-6 relative overflow-hidden max-w-[450px] mx-auto ', tier.pp === true && "border-[3px] border-primary ")}>
                        <span className={twMerge("hidden",tier.pp === true &&'block text-sm font-medium absolute  top-2 right-2 md:right-2 md:top-2 px-4 py-2 bg-primary rounded-lg text-white')}>Most Popular</span>
                        <h3 className='text-2xl font-bold text-gray-900 text-center'>{tier.title}</h3>
                        <p className='text-md font-semibold text-gray-500 mt-2 mb-4 text-center'>{tier.subtitle}</p>
                           {/* price section */}
                        <div className='flex gap-3 w-full mt-[30px] mx-auto mb-6 justify-center md:justify-center '>
                            <span className='text-2xl text-center line-through text-gray-600 font-bold tracking-tighter leading-none text-black/60'>{(tier.old_price === null) ? '    ' : tier.old_price}</span>
                            <span className='text-4xl text-center font-bold tracking-tighter leading-none'>{tier.price}</span>
                        </div>
                        <ul className='flex flex-col gap-5 mt-6'>
                            {tier.features.map((feature, i) => {
                                return <li key={i} className='text-sm flex items-center gap-4'>
                                    {feature.icon==="Check"?<Check className="icon h-4 w-6 text-green-500 "/>:<X className="icon h-4 w-6 text-red-600 "/>}
                                    
                                    <span className='font-semibold'>{feature.text}</span>
                                </li>
                            })}
                        </ul>
                        <button className='btn btn-primary w-full mt-[30px]'>{tier.cta}</button>
                    </motion.div>
                })}
                {console.log(pricingTiers)}
            </div>
        </div>
    </section>
  )
}

export default Pricing