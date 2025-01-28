import React from 'react'
import { herotext2 } from '../../constants'
const Subhero = () => {
  return (
    <section className='py-8 px-8 md:py-5 md:px-8 lg:py-10 lg:px-2 bg-[#F8F9FF]'>
        <div className='container'>
            <div className='flex justify-center flex-col items-center gap-4'>                            
                <h2 className='text-center text-xl font-bold tracking-tighter'>{herotext2.title} 
                    <span className='bg-gradient-to-b from-black to-[#1884FF] text-transparent bg-clip-text'>Doucment</span>
                </h2>
                <p className='text-center md:px-14 lg:px-48'>{herotext2.subtitle}</p>
                <button className='btn btn-primary '>{herotext2.cta}</button>
            </div>
        </div>
    </section>
  )
}

export default Subhero