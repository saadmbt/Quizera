import React from 'react'
import { features } from '../../constants'
import flashcard from '../../assets/Featuresimg/flashcard.png'
import shareq from '../../assets/Featuresimg/shareQ.png'
import doc from '../../assets/Featuresimg/doc.png'
const Features = () => {
  return (<section className='bg-gradient-to-b from-[#FFFFFF] to-[#D2DCFF]' id='Pricing'>
    <div className="container lg-centered py-10 px-4">
        <div className="flex flex-col items-center gap-4 mb-4 max-w-[540px] mx-auto">
            <h2 className="section-title  mt-2">Our Best Features</h2>
            <p className="section-Description ">Unleash your full potential with our best features</p>
        </div>
        <div className='lg:flex lg:gap-4 xl:flex xl:gap-14 md:grid md:grid-cols-2 gap-4 md:justify-center lg:items-end'>
            {features.map((feature,i)=>{
                return <div key={i} className='bg-white p-6 border  border-[#F1F1F1] rounded-3xl shadow-[0_7px_14px_#EAEAEA] mb-6 max-w-[300px]  mx-auto'>
                    <div className='aspect-video w-[150px] mx-auto'>
                        <img src={(feature.image==="flashcard")?flashcard:(feature.image==="shareq")?shareq:doc} alt="" />
                    </div>
                    <div>
                        <h3 className='text-lg  md:text-xl font-bold mt-2'>{feature.title}</h3>
                        <p className=' text-sm font-bold text-slate-500 mt-2 tracking-tight'>{feature.subtitle}</p>
                    </div>
                    <button className='btn btn-text py-1 mt-4 bottom-0'>{feature.cta}</button>
                </div>
            })}
        </div>
    </div>
  </section>
  )
}

export default Features