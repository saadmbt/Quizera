import React from 'react'
import { herotext } from '../../constants'
import { ArrowDown } from 'lucide-react'
import heroimage from '../../assets/heroimage.png'
import LogosTicker from './LogosTicker'
const Hero = () => {
  return (
    <section className='pt-8 pl-4 pb-20 md:pt-5 md:pb-[59px] lg:pt-2 lg:pb-[68px] bg-[radial-gradient(ellipse_200%_100%_at_bottom_left,#183EC2,#fafcff_45%)] md:bg-[radial-gradient(ellipse_200%_100%_at_bottom_left,#183EC2,#fafcff_66%)] overflow-x-clip'>
        {/* text section */}
        <div>
            <div className='container'>
                <div className='md:flex items-center gap-6'>
                    <div className='md:w-[478px]'>
                        <div>
                            <div className='text-sm inline-flex border border-primary px-3 py-1 rounded-lg tracking-tight shadow-md'>{herotext.upsub}</div>
                            <h1 className='text-5xl font-bold tracking-tighter bg-gradient-to-b from-black to-[#1884FF] text-transparent bg-clip-text mt-6'>{herotext.title}</h1>
                            <p className='text-xl text-[#010D3E] tracking-tighter mt-6 md:text-lg'>{herotext.subtitle}</p>
                        </div>
                        {/* buttons section */}
                        <div className='flex gap-2 items-center mt-8'>
                            <button className='btn btn-primary'>{herotext.cta}</button>
                            <button className='btn btn-text gap-2'> 
                                <span>{herotext.lmbtn}</span>
                                <ArrowDown className='h-5 w-5'/>
                            </button>
                        </div>
                    </div>
                    {/* image section */}
                    <div className=' hidden md:block mt-20 md:mt-0 md:w-2/3 lg:w-2/4 lg:ml-28 lg:right-0 xl:ml-40 xl:right-0'>
                        <img src={heroimage} alt=" Prepgenius hero image"  />
                    </div>
                </div>
                
            </div>
            
        </div>
        {/* Logos section */}
        <LogosTicker/>
    </section>
  )
}

export default Hero