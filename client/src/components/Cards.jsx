import React from 'react'

const Cards = () => {
  return (
    <div className='bg-[#EFE4D2]'>
    <div className="mt-0.5 w-full max-w-6xl mx-auto px-3 py-3">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1 */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 text-center hover:shadow-md hover:scale-110 transition">
          <div className="text-4xl mb-4 text-blue-600">🛡️</div>
          <h3 className="text-lg font-semibold mb-2 text-gray-800">Secure & Encrypted</h3>
          <p className="text-sm text-gray-600">
            End-to-end encryption keeps your shared content private and protected at all times.
          </p>
        </div>

        {/* Card 2 */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 text-center hover:shadow-md hover:scale-110 transition">
          <div className="text-4xl mb-4 text-blue-600">🔒</div>
          <h3 className="text-lg font-semibold mb-2 text-gray-800">One-Time Access</h3>
          <p className="text-sm text-gray-600">
            Set limits and expiry to ensure your links can’t be reused or accessed indefinitely.
          </p>
        </div>

        {/* Card 3 */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 text-center hover:shadow-md hover:scale-110 transition">
          <div className="text-4xl mb-4 text-blue-600">⚡️</div>
          <h3 className="text-lg font-semibold mb-2 text-gray-800">Fast & Reliable</h3>
          <p className="text-sm text-gray-600">
            Lightning-fast link generation with highly available infrastructure for reliability.
          </p>
        </div>
      </div>
    </div>
    </div>
  )
}

export default Cards