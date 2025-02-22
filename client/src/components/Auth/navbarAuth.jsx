import React from 'react'
import logo from '../../assets/authnavbarlogo.png'
const NavbarAuth = () => {
  return (
        <nav className=" bg-blue-100 sticky top-0 z-10 py-3 px-2 shadow-sm backdrop-blur-sm">
            <div className="container lg-centered ">
                <div className="flex justify-center items-center ">
                    <a href="/" className="cursor-pointer">
                        <img src={logo} alt="Logo" className="w-48 h-13"/>
                    </a>
                </div>
            </div>
        </nav>
  )
}

export default NavbarAuth