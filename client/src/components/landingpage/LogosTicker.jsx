import React from 'react'
import Stanford from '../../assets/unilogos/Stanford.png'
import Oxford from '../../assets/unilogos/Oxford.png'
import Harvard from '../../assets/unilogos/Harvard.png'
import Cambridge from '../../assets/unilogos/Cambridge.png'
import akhawayn from '../../assets/unilogos/al-akhawayn-university-logo.png'
import hassan2 from '../../assets/unilogos/hassan-ii-university-of-casablanca-logo.png'
const LogosTicker = () => {
  return (
    <div className='py-4 mt-4 md:mt-8 md:w-full xl:w-full'>
        <div className='container'>
          <div className='flex items-center justify-center mb-6 text-sm text-black tracking-tight font-bold'>
            <h4 className='text-xl px-3 py-2 tracking-tight '>Used by student from </h4>
          </div>
          <div className='flex items-center justify-center overflow-hidden [mask-image:linear-gradient(to_right,transparent,black,transparent)] xl:flex xl:left-[300px]'>
            <div className='flex gap-14 flex-none md:gap-24 xl:gap-32'>
                <img src={Stanford} alt="Stanford logo"  className='logo-tricker-image'/>
                <img src={Oxford} alt="Oxford logo"  className='logo-tricker-image'/>
                <img src={Cambridge} alt="Cambridge logo" className='logo-tricker-image' />
                <img src={akhawayn} alt="akhawayn logo" className='logo-tricker-image' />
                <img src={hassan2} alt="hassan2 logo" className='logo-tricker-image' />
                <img src={Harvard} alt="Harvard logo" className='logo-tricker-image' />
              </div>
          </div>
            
        </div>
    </div>
  )
}

export default LogosTicker