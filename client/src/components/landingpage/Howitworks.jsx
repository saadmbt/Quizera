import React ,{ useEffect, useRef }from 'react'
import { howitworks } from '../../constants'
import video from "../../assets/landingpageexam.mp4"
import { motion} from "framer-motion"
import {fadeIn} from '../../constants/variants'
import Subhero from './Subhero'

const Howitworks = () => {
  const videoRef = useRef(null)
  useEffect(()=>{
    const observ= new IntersectionObserver((entries)=>{
      if(entries[0].isIntersecting){
        videoRef.current.play()
        } else {
          videoRef.current.pause()
        }
    },{
      threshold: 1.0
    });
    observ.observe(videoRef.current);
    return ()=>observ.unobserve(videoRef.current);
  },[])
  return (
    <section className='py-14 px-4 bg-gradient-to-b from-[#FFFFFF] to-[#D2DCFF]' id='howitworks'>
        <motion.div 
        variants={fadeIn('up',0.1)}
        initial='hidden'
        whileInView={'show'}
        viewport={{once:false,amount:0.4}}
        className='container lg-centered mt-4'>
            <div className='flex justify-center flex-col items-center gap-4'>                            
                <h2 className='section-title'>{howitworks.title}</h2>
                <ul className='flex flex-col gap-2 px-4 md:grid md:grid-cols-2   md:gap-4 lg:flex lg:flex-row lg:gap-8'>
                  {howitworks.Steps.map((item, i) => (
                    <motion.li 
                    variants={fadeIn('right',`${i+2/10}`)}
                    initial='hidden'
                    whileInView={'show'}
                    viewport={{once:false,amount:0.5}}
                    key={i} className='text-center font-bold '><span className='sp'>{i+1}  </span>{item}</motion.li>
                  ))}
                </ul>
            </div>
            {/* video section i should be here and it will be play if it on the screen */}
            <div  className='flex justify-center w-full my-6 px-4 md:px-0' >
                <div className='w-full max-w-4xl md:max-w-lg border-2 border-gray-200  rounded-xl p-4 shadow-lg'>
                      <video
                      ref={videoRef}
                      className=' w-full h-auto rounded-lg'
                      src={video}
                      type='video/mp4'
                      muted
                      loop
                      playsInline
                      
              
                    />
                </div>
            </div>
        </motion.div>
        <Subhero/>
    </section>
  )
}

export default Howitworks