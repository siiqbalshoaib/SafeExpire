import React from 'react'
import Navbar from '../components/NavBar'
import Footer from '../components/Footer'

const instruction = () => {
  return (
    
    <>
    <Navbar/>
        

    <section className="bg-[#EFE4D2] py-16 " id="about">
        <div className="min-h-screen flex items-center justify-center">
          {/* Text Section */}
          <div className="max-w-3xl text-center bg-white shadow-lg rounded-2xl p-10">
            <h2 className="text-3xl sm:text-4xl flex justify-center items-center font-bold text-[#954C2E] mb-4">
              How to Use SafeExpire
            </h2>
            
            <ul className="text-gray-700 space-y-2 mb-6">
              <li>✅ Enter Text or Upload a file you want to share</li>
              <li>✅ Select maxximum views</li>
              <li>✅ Select Expiry of Link</li>
              <li>✅ Click create link button</li>
              <li>✅ Wait for a minute </li>
              <li>✅ Copy created link and share </li>
            </ul>
            <p className="text-gray-800 font-semibold">
              We’re not just another tool — we’re your digital vault for trust.
            </p>
            <p className="text-gray-800 font-semibold">
              SafeExpire will be available with more features! Analytics,
              Dashboard etc. Very Soon!
            </p>
          </div>
        </div>
      </section>

      <Footer/>
    
    </>
  )
}

export default instruction