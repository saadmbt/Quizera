import React, { useState } from 'react';
import { navlinks } from '../../constants';
import logo from '../../assets/logo3.png';
import { X } from 'lucide-react';
import { AlignJustify } from 'lucide-react';
import { motion } from 'framer-motion';
import {Link} from 'react-scroll'
import { twMerge } from 'tailwind-merge';

const Navbar = (props) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className={twMerge('sticky top-0 z-10 py-3 px-2 shadow-md backdrop-blur-sm', props.ishowing === false && "hidden md:hidden")}>
      <div className='container lg-centered'>
        <div className='flex items-center justify-between'>
          <a href='/' className='cursor-pointer'>
            <img src={logo} alt='logo' className='w-40 h-13' />
          </a>

          {/* Hamburger menu */}
          <button onClick={() => setIsOpen(!isOpen)} className='font-semibold h-10 w-5 mr-2 md:hidden'>
            {isOpen ? <X size={24} /> : <AlignJustify size={24} />}
          </button>
          {/* Desktop menu */}
          <div className='hidden md:flex gap-6 text-black/80'>
            {navlinks.map((link, index) => (
              link.external ? (
                <a key={index} href={link.url} className='cursor-pointer hover:text-primary hover:scale-105'>
                  {link.title}
                </a>
              ) : (
                <Link key={index} to={link.url} smooth={true} duration={500} className='cursor-pointer hover:text-primary hover:scale-105'>
                  {link.title}
                </Link>
              )
            ))}
          </div>

          {/* Button section */}
          <div className='hidden md:flex gap-5 lg:flex lg:gap-6'>
            <a href='/auth/Signup' className='btn border border-primary text-primary px-6 py-2 rounded-lg font-medium inline-flex align-items justify-center hover:scale-95'>
              sign up
            </a>
            <a href='/auth/Login' className='bg-primary text-white px-8 py-2 rounded-md font-medium inline-flex align-items justify-center hover:scale-95'>
              login
            </a>
          </div>
        </div>
        {/* Mobile menu */}
        <motion.div
            initial={{ height: 0 }}
            animate={{ height: isOpen ? 'auto' : 0 }}
            className='overflow-hidden md:hidden'
          >
            <div className='flex flex-col items-center gap-6 text-black/80'>
              {navlinks.map((link, index) => (
              link.external ? (
                <a key={index} href={link.url} className='cursor-pointer hover:text-primary hover:scale-105'>
                  {link.title}
                </a>
              ) : (
                <Link key={index} to={link.url} smooth={true} duration={500} className='cursor-pointer hover:text-primary hover:scale-105'>
                  {link.title}
                </Link>
              )
            ))}
            </div>
            <div className='flex  items-center justify-center gap-5 mt-4'>
              <a href='/auth/Signup' className='btn border border-primary text-primary px-6 py-2 rounded-lg font-medium inline-flex align-items justify-center hover:scale-95'>
                sign up
              </a>
              <a href='/auth/Login' className='bg-primary text-white px-8 py-2 rounded-md font-medium inline-flex align-items justify-center hover:scale-95'>
                login
              </a>
            </div>
          </motion.div>
      </div>
    </nav>
  );
};

export default Navbar;