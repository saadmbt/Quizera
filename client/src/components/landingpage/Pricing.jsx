import React from 'react'
import {Link} from 'react-router-dom'
import { Check } from 'lucide-react';
import { pricingTiers } from '../../constants'
import { twMerge } from 'tailwind-merge'
const Pricing = () => {
  return (
    <section className='bg-slate-50'>
        <div className="container py-10 px-4">
            <div className="flex flex-col items-center gap-4 mb-4">
                <h2 className="section-title  mt-3">Pricing</h2>
                <p className="section-Description mt-1 ">Free Forever. Upgrade for unlimited Quizzes, better result and exclusive features </p>
            </div>
            <div className='bg-white'>
                { pricingTiers.map((tier,i)=>{
                    return <div key={i} className='p-10 border border-[#F1F1F1] rounded-3xl shadow-[0_7px_14px_#EAEAEA] mb-6 '>
                        <h3 className='text-2xl font-bold text-gray-900 text-center'>{tier.title}</h3>
                        <p className='text-lg font-semibold text-gray-700 mt-2 mb-4 text-center'>{tier.subtitle}</p>
                           {/* price section */}
                        <div className='flex gap-3 w-full mt-[30px] mx-auto mb-6 justify-center md:justify-center '>
                            <span className='text-2xl text-center line-through text-gray-600 font-bold tracking-tighter leading-none text-black/60'>{(tier.old_price===null)?'    ':tier.old_price}</span>
                            <span className='text-4xl text-center font-bold tracking-tighter leading-none'>{tier.price}</span>
                        </div>
                        <ul className='flex flex-col gap-5 mt-6'>
                            {tier.features.map((feature,i)=>{
                                return <li key={i} className='text-sm flex items-center gap-4'>
                                    <Check className="icon h-4 w-6 text-green-500 "/>
                                    <span className='font-semibold'>{feature}</span>
                                </li>
                            })}
                        </ul>
                        <button className='btn btn-primary w-full mt-[30px]'>{tier.cta}</button>
                    </div>
                })}
                {console.log(pricingTiers)}
            </div>
        </div>
    </section>
  )
}

export default Pricing