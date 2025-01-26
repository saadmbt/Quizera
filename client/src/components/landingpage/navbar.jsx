import React from 'react'
import { navlinks } from '../../constants'
import logo from '../../assets/logo.png'
const Navbar = () => {
  return (
    <nav>
      <div className='container'>
          {/* logo section  */}
            <div>
              <img src={logo} alt='logo' />
            </div>
          {/* Menu section  */}
          <div className='hidden lg:block'>
            <ul>
              {navlinks.map((link, index) => (
                <li key={index}>
                  <a href={link.url} className='text-lg font-poppins text-dark'>{link.title}</a>
                </li>
              ))}
            </ul>
          </div>
          {/* Button section */}
          {/* Mobile section */}
          <div className='block lg:hidden'>
              <button className='btn btn-primary'>☰</button>
          </div>
      </div> 
    </nav>
  )
}

export default Navbar