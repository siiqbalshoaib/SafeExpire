import React from 'react'
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-[#EFE4D2] border-t border-gray-200 mt-0.5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Column 1: Brand Info */}
          <div>
            <h2 className="text-2xl font-bold font-serif text-[#131D4F]">🛡️SafeExpire</h2>
            <p className="text-gray-600 mt-2 text-sm">
              Securely share text and files with one-time or time-limited access. Built for privacy and simplicity.
              A product of ShoAfTech
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-gray-800 font-semibold mb-2">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="#features" className="text-gray-600 hover:text-blue-600" to="/">Privacy Policy</Link></li>
              {/* <li><a href="#pricing" className="text-gray-600 hover:text-blue-600">Pricing</a></li>
              <li><a href="#faq" className="text-gray-600 hover:text-blue-600">FAQ</a></li>
              <li><a href="/login" className="text-gray-600 hover:text-blue-600">Login</a></li> */}
            </ul>
          </div>

          {/* Column 3: Contact / Social */}
          <div>
            <h3 className="text-gray-800 font-semibold mb-2">Contact</h3>
            <p className="text-sm text-gray-600">shoaftech@gmail.com</p>
            <div className="flex space-x-4 mt-4">
             
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-10 border-t pt-6 text-center text-sm text-[#954C2E]">
          &copy; {new Date().getFullYear()} SafeExpire & ShoAfTech. All rights reserved.
        </div>
      </div>
    </footer>
  )
}

export default Footer