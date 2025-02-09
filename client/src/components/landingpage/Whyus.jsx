import React from 'react'
import { whyus } from '../../constants'
import WUSwiper from './WUSwiper'
const Whyus = () => {
  return (<section>
        <div className="container lg-centered py-10 px-4">
            <div className="flex flex-col items-center gap-4 mb-4 md:mb-0 md:mt-4  max-w-[540px] mx-auto">
                <h2 className="section-title mt-2">Why Choose Our Quiz Generator?</h2>
            </div>
            <div className='hidden md:hidden lg:gap-4 xl:gap-14  lg:grid lg:grid-cols-3 xl:grid xl:grid-cols-3 gap-4  lg:items-start'>
                {whyus.map((why,i)=>{
                    return <div key={i} className='bg-white p-6 border  border-[#F1F1F1] rounded-3xl shadow-[0_7px_14px_#EAEAEA] mb-4 max-w-[300px] min-h-[200px] mx-auto '>
                        <div>
                            <h3 className='text-lg  md:text-xl font-bold mt-2'>{why.title}</h3>
                            <p className=' text-sm font-bold text-slate-500 mt-2 tracking-tight  my-auto mx-auto'>{why.subtitle}</p>
                        </div>
                    </div>
                })}
            </div>
            <WUSwiper/>
        </div>
  </section>
  )
}

export default Whyus