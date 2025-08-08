import { useState } from "react";
import { Link } from 'react-router-dom';
import {  Menu, X } from "lucide-react";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="bg-[#131D4F] border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="text-3xl font-bold font-serif flex items-center gap-2">
          <span className="text-[#EFE4D2]">🛡️SafeExpire</span> 
        </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-[#EFE4D2] hover:text-blue-600 hover:text-2xl font-sans font-medium " to="/">Home</Link>
            <Link href="/about" className="text-[#EFE4D2] hover:text-blue-600 hover:text-2xl font-sans font-medium" to="/about">About</Link>
            <Link href="/contact" className="text-[#EFE4D2] hover:text-blue-600 hover:text-2xl font-sans font-medium" to="/contact">Contact</Link>
            <Link href="/faq" className="text-[#EFE4D2] hover:text-blue-600 hover:text-2xl font-sans font-medium" to="/faq">FAQ</Link>
            
            {/* <Link
              href="/login"
              className="bg-blue-600 text-white px-4 py-2 rounded-full font-medium hover:bg-blue-700 transition"
            >
              Login
            </Link> */}
          </div>

          {/* Mobile Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="text-gray-700 focus:outline-none"
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {mobileOpen && (
        <div className="md:hidden px-4 pb-4 space-y-3">
          <Link href="#features" className="block text-[#EFE4D2] hover:text-blue-600" to="/">Home</Link>
          <Link href="#pricing" className="block text-[#EFE4D2] hover:text-blue-600" to="/about">About</Link>
          <Link href="#pricing" className="block text-[#EFE4D2] hover:text-blue-600" to="/contact">Contact</Link>
          <Link href="#faq" className="block text-[#EFE4D2] hover:text-blue-600" to="/faq">FAQ</Link>
          <Link
            href="/login"
            className="block bg-blue-600 text-white text-center px-4 py-2 rounded-full hover:bg-blue-700 transition"
          >
            Login
          </Link>
        </div>
      )}
    </nav>
  );
}
