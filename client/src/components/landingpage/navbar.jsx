import React from 'react'
import { navlinks } from '../../constants'
import logo from '../../assets/logo2.png'
const Navbar = () => {
  return (
    <nav className='sticky top-0   shadow-md backdrop-blur-sm'>
      <div className='container '>
          <div className='flex items-center justify-between '>
            <img src={logo} alt='logo' className='w-40 h-13'/>
            <button className='btn btn-primary h-10 w-5 md:hidden'>☰</button>
          
          <div className='hidden  md:flex gap-6 text-black/80 items-center '>
            {navlinks.map((link, index) => (
              <a key={index} href={link.url} className=' hover:text-primary'>{link.title}</a>
            ))}
            {console.log(navlinks)}
          </div>
           {/* Button section */}
          <div className='hidden md:flex gap-5 lg:flex lg:gap-6 '>
              <button className='btn border border-primary text-primary px-4 py-2 rounded-lg font-medium inline-flex algin-items justify-center '>sign up</button>
              <button className=' bg-primary text-white px-6 py-2 rounded-md font-medium inline-flex algin-items justify-center '>login</button>
          </div>
        </div>
      </div> 
    </nav>
  )
}

export default Navbar