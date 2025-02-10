import React from 'react'
import logo from '../../assets/logo3.png'
import { footerlinks } from '../../constants'
import {Facebook,Youtube,Instagram,Linkedin}  from 'lucide-react'
const Footer = () => {
  return (<footer className="border border-t-2 border-gray-300 text-sm  text-center">
        <div className='container lg-centered py-6 px-4'>
            <div className='flex justify-center items-center gap-4 '>
                <img src={logo} alt='logo' className='w-60 h-13'/>
            </div>
            <nav className='flex flex-col md:flex-row md:justify-center md:items-center gap-6 mt-4'>
                {footerlinks.map((Flink,i)=>{
                    return <a href={Flink.link} key={i} className=' hover:text-primary'>{Flink.title}</a>
                })}
            </nav>
            <div className='flex gap-6 mt-6 justify-center'>
                <a href='https://www.facebook.com/'><Facebook className='size-6 font-bold text-primary-600'/></a>
                <a href='https://www.youtube.com/'><Youtube className='size-6 font-bold text-red-600'/></a>
                <a href='https://www.instagram.com/'><Instagram className='size-6 font-bold '/></a>
                <a href='https://www.linkedin.com/'><Linkedin className='size-6 font-bold text-primary'/></a>
            </div>
            <p className='mt-6'>&copy; 2025 Prepgenius, Inc. All rights reserved</p>
        </div>
  </footer>
    
  )
}

export default Footer