import React, { useState } from 'react';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-black text-yellow-400 sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 text-2xl font-bold">
            Golden Travels
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-6">
            <a href="#" className="hover:text-white transition">Home</a>
            <a href="#" className="hover:text-white transition">Destinations</a>
            <a href="#" className="hover:text-white transition">Packages</a>
            <a href="#" className="hover:text-white transition">Blog</a>
            <a href="#" className="hover:text-white transition">Contact</a>
          </div>

          {/* Mobile Hamburger */}
          <div className="md:hidden">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-yellow-400 focus:outline-none text-2xl"
            >
              &#9776;
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden px-4 pb-4">
          <a href="#" className="block py-2 hover:text-white">Home</a>
          <a href="#" className="block py-2 hover:text-white">Destinations</a>
          <a href="#" className="block py-2 hover:text-white">Packages</a>
          <a href="#" className="block py-2 hover:text-white">Blog</a>
          <a href="#" className="block py-2 hover:text-white">Contact</a>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
