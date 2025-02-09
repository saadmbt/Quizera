import React from 'react'
import { whyus } from '../../constants'
import {Swiper, SwiperSlide} from 'swiper/react'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/free-mode'
import { Pagination ,FreeMode } from 'swiper/modules'
const WUSwiper = () => {
  return (
    <div className='flex items-center justify-center flex-col h-screen lg:hidden'>
        <Swiper
            breakpoints={
                {
                    340:{
                        slidesPerView: 1,
                        spaceBetween: 15,
                    },
                    700:{
                        slidesPerView: 2,
                        spaceBetween: 15,
                    },
                }
            }
            modules={[Pagination,FreeMode]}
            pagination={{ clickable: true }}
            freeMode={ true }
            className='max-w-[95%] md:max-w-[90%]'
            >
                {whyus.map((item, index) => (
                    <SwiperSlide key={index}>
                        <div className='bg-white p-6 border  border-[#F1F1F1] rounded-3xl shadow-[0_7px_14px_#EAEAEA] mb-10 max-w-[350px] min-h-[200px] mx-auto '>
                            <div className='flex  items-center gap-4'>
                                <img src={item.icon} className='w-10 h-10' />
                                <span className='text-lg  md:text-xl font-bold  '> {item.title}</span>
                            </div>
                            <p className=' text-sm font-bold text-slate-500 mt-2 tracking-tight  my-auto mx-auto'>{item.subtitle}</p>
                        </div>
                    </SwiperSlide>
                ))}
        </Swiper>
    </div>
  )
}

export default WUSwiper