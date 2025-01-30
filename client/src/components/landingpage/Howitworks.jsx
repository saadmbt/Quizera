import React ,{ useEffect, useRef }from 'react'
import { howitworks } from '../../constants'
import video from "../../assets/landingpageexam.mp4"
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
    <section className='py-8 px-4'>
        <div className='container lg-centered'>
            <div className='flex justify-center flex-col items-center gap-4'>                            
                <h2 className='text-center text-2xl font-bold tracking-tighter bg-gradient-to-b from-black to-[#1884FF] text-transparent bg-clip-text'>{howitworks.title}</h2>
                <ul className='flex flex-col gap-2 md:gap-3  lg:flex-row lg:gap-8'>
                  {howitworks.Steps.map((item, i) => (
                    <li key={i} className='text-center font-bold '><span className='sp'>{i+1} :</span>{item}</li>
                  ))}
                </ul>
            </div>
            {/* video section i should be here and it will be play if it on the sceen */}
            <div  className='flex justify-center w-full my-4 px-4 md:px-0' >
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
        </div>
    </section>
  )
}

export default Howitworks