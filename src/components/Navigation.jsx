"use client"
import React,{ useState }  from 'react'

const Navigation = ({children}) => {
    const [isOpen,setIsOpen] = useState();
  return (
    <div className="flex">
      {/* Sidebar */}
      <div className={`w-64 bg-gray-800 text-white h-screen ${isOpen ? 'block' : 'hidden'} md:block`}>
        <div className="p-4">
          <h2 className="text-2xl font-bold">Mini Gallery Administration </h2>
          <ul>
            <li className="mt-4"><a href="/create-app">Create App</a></li>
            <li className="mt-4"><a href="/update-app">Update App</a></li>
            <li className="mt-4"><a href="/view-apps">View Apps</a></li>
            <li className="mt-4"><a href="/upload-image">Upload Image</a></li>
          </ul>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-gray-100 p-6">
        <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16m-7 6h7"
            />
          </svg>
        </button>
        {children}
      </div>
    </div>
  )
}

export default Navigation