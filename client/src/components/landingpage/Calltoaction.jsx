import React from 'react'
import { signupse } from '../../constants'
import {ArrowUpRight}  from 'lucide-react'
const Calltoaction = () => {
  return (<section className='pt-14 bg-gradient-to-t from-[#FFFFFF] to-[#D2DCFF]'>
    <div className="container lg-centered py-10 px-4 max-w-[900px]">
        <div className='bg-gradient-to-r from-sky-500 to-cyan-400 text-gray-950 py-8 md:py-10 px-10 rounded-3xl text-center md:text-left transform transition duration-500 hover:scale-x-105 '> 
            <div className='flex flex-col md:flex-row lg:gap-24 '>
                <div>
                    <h2 className='font-poppins font-bold text-2xl '>{signupse.title}</h2>
                    <p className='text-sm mt-2 md:text-medium '>{signupse.subtitle}</p>
                </div>
                <div>
                    <button className=' text-white bg-gray-900 inline-flex items-center px-6 h-12 rounded-xl gap-2 mt-8 w-max border border-gray-900'>
                        <span className='font-semibold'>{signupse.cta}</span>
                        <ArrowUpRight className='size-4'/>
                    </button>
                </div>
                 
            </div>
        </div>
          
    </div>
  </section>
  )
}

export default Calltoaction