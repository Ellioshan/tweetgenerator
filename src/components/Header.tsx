import React from 'react'
import { Twitter } from 'lucide-react'

const Header = () => {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="bg-blue-500 text-white p-2 rounded-lg">
            <Twitter size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Tweet Idea Generator</h1>
            <p className="text-gray-600 text-sm">For interns building their personal brand</p>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
