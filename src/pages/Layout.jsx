import React, { useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets'
import { Menu,  X } from 'lucide-react'
import Sidebar from '../components/Sidebar'
import { SignIn,useUser } from '@clerk/clerk-react'
import ThemeToggle from '../components/theme/ThemeToggle'

const Layout = () => {
  const navigate = useNavigate()
  const [sidebar, setSidebar] = useState(false)
  const {user} = useUser()
  return user ?(
    <div className='flex flex-col items-start justify-start min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300'>
      <nav className='w-full px-8 min-h-14 flex items-center justify-between
      border-b border-gray-200 dark:border-gray-800 transition-colors duration-300 sticky top-0 z-20 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md'>
        <div 
          className='flex items-center gap-2 cursor-pointer group'
          onClick={()=>navigate("/")}
        >
          <div className='w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-200 dark:shadow-none transition-transform group-hover:scale-110'>
            N
          </div>
          <span className='font-bold text-xl tracking-tight dark:text-white'>Nero<span className='text-primary'>.ai</span></span>
        </div>
        
        <div className='flex items-center gap-4'>
          <ThemeToggle />
          {
            sidebar ?<X onClick={()=> setSidebar(false)} className='w-6 h-6 text-gray-600 dark:text-gray-400 sm:hidden'/>
            : <Menu onClick={()=> setSidebar(true)} className='w-6 h-6 text-gray-600 dark:text-gray-400 sm:hidden'/>
          }
        </div>
      </nav>
      <div className='flex-1 w-full flex relative'>
        {/* Mobile Sidebar Backdrop */}
        {sidebar && (
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 sm:hidden"
            onClick={() => setSidebar(false)}
          />
        )}
        
        <div className="sticky top-14 h-[calc(100vh-56px)] z-40">
          <Sidebar sidebar={sidebar} setSidebar={setSidebar}/>
        </div>
        <div className='flex-1 bg-[#F4F7FB] dark:bg-gray-950 min-h-screen pt-4'>
          <div className="pb-20 px-4">
            <Outlet/>
          </div>
        </div>
      </div>
      
    </div>
  ) : (
    <div className='flex items-center justify-center h-screen'>
      <SignIn/>
    </div>
  )
}

export default Layout
