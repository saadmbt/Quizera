import React from 'react'
import { howitworks } from '../../constants'
const Howitworks = () => {
  return (
    <section>
        <div className='container'>
            <div className='flex justify-center flex-col items-center gap-4'>                            
                <h2 className='text-center text-2xl font-bold tracking-tighter bg-gradient-to-b from-black to-[#1884FF] text-transparent bg-clip-text'>{howitworks.title}</h2>
                <ul className='flex flex-col gap-2 md:gap-3  lg:flex-row lg:gap-8'>
                  {howitworks.Steps.map((item, i) => (
                    <li key={i} className='text-center font-bold '>{item}</li>
                  ))}
                </ul>
            </div>
            {/* video section i should be here and it will be play if it on the sceen */}
        </div>
    </section>
  )
}

export default Howitworks