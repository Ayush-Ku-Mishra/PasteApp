import React from 'react'
import { NavLink } from 'react-router-dom'
import MyPhoto from '../assets/Kurtapic1.ico';

const Navbar = () => {
  return (
    <div className="flex justify-center gap-6 py-6 bg-white shadow-md relative" >
  {/* NavLinks */}
  <NavLink to="/" className={({ isActive }) =>
    `px-5 py-2 rounded-md font-medium transition duration-300 ${
      isActive
        ? 'bg-blue-900 text-white shadow-lg'
        : 'text-gray-700 hover:bg-blue-100 hover:text-blue-700'
    }`
  }>
    Home
  </NavLink>

  <NavLink to="/pastes" className={({ isActive }) =>
    `px-5 py-2 rounded-md font-medium transition duration-300 ${
      isActive
        ? 'bg-blue-900 text-white shadow-lg'
        : 'text-gray-700 hover:bg-blue-100 hover:text-blue-700'
    }`
  }>
    Pastes
  </NavLink>

  {/* 👤 Profile image */}
  <img
    src={MyPhoto}
    alt="Profile"
    className="w-12 h-12 rounded-full object-cover absolute right-4 top-1/2 -translate-y-1/2 border border-blue-500 shadow"
    title="Your Photo"
  />
</div>

  )
}

export default Navbar

