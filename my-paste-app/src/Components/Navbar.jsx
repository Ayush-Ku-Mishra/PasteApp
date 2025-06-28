import React from 'react';
import { NavLink } from 'react-router-dom';
import MyPhoto from '../assets/Kurtapic1.ico';
import ThemeToggle from './ThemeToggle';

const Navbar = () => {
  return (
    <div className="flex justify-center gap-6 py-6 bg-white dark:bg-gray-800 shadow-md relative">
      {/* Theme Toggle (Left side) */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2">
        <ThemeToggle />
      </div>

      {/* NavLinks */}
      <NavLink
        to="/"
        className={({ isActive }) =>
          `px-5 py-2 rounded-md font-medium transition duration-300 ${
            isActive
              ? 'bg-blue-900 text-white shadow-lg'
              : 'text-gray-800 dark:text-white hover:bg-blue-100 hover:text-blue-700'
          }`
        }
      >
        Home
      </NavLink>

      <NavLink
        to="/pastes"
        className={({ isActive }) =>
          `px-5 py-2 rounded-md font-medium transition duration-300 ${
            isActive
              ? 'bg-blue-900 text-white shadow-lg'
              : 'text-gray-800 dark:text-white hover:bg-blue-100 hover:text-blue-700'
          }`
        }
      >
        Pastes
      </NavLink>

      {/* 👤 Profile image (Right side) */}
      <img
        src={MyPhoto}
        alt="Profile"
        title="Your Photo"
        className="w-12 h-12 rounded-full object-cover absolute right-4 top-1/2 -translate-y-1/2 border border-blue-500 shadow transition-transform duration-300 ease-in-out hover:scale-125 hover:shadow-[0_0_20px_4px_rgba(59,130,246,0.6)]"
      />
    </div>
  );
};

export default Navbar;
