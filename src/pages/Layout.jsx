import React, { useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { Menu, X, LayoutDashboard } from 'lucide-react'
import Sidebar from '../components/Sidebar'
import { SignIn, useUser } from '@clerk/clerk-react'
import ThemeToggle from '../components/theme/ThemeToggle'
import { assets } from '../assets/assets'

const Layout = () => {
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user } = useUser()

  if (!user) {
    return (
      <div className='flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-950 px-4'>
        <div className="w-full max-w-md">
           <div 
            className='flex items-center justify-center gap-2 cursor-pointer group mb-8 scale-110'
            onClick={()=>navigate("/")}
           >
            <div className='w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-500/20'>
              N
            </div>
            <span className='font-bold text-2xl tracking-tighter dark:text-white'>Nero<span className='text-indigo-600'>.ai</span></span>
          </div>
          <SignIn />
        </div>
      </div>
    )
  }

  return (
    <div className='flex h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-500 overflow-hidden font-inter'>
      
      {/* Sidebar - Desktop Sticky / Mobile Drawer */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main Content Area */}
      <div className='flex-1 flex flex-col min-w-0 overflow-hidden relative'>
        
        {/* Workspace Header */}
        <header className='h-16 flex items-center justify-between px-6 sm:px-10 border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl z-20 shrink-0'>
          <div className='flex items-center gap-4'>
            <button 
              onClick={() => setSidebarOpen(true)}
              className='p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors lg:hidden'
            >
              <Menu className='w-5 h-5 text-gray-600 dark:text-gray-400' />
            </button>
            <div className='hidden sm:flex items-center gap-2 text-gray-400 dark:text-gray-600'>
               <LayoutDashboard className='w-4 h-4' />
               <span className='text-[10px] font-black uppercase tracking-[0.2em]'>Internal Laboratory</span>
            </div>
          </div>

          <div className='flex items-center gap-5'>
            <ThemeToggle />
            <div 
              className='flex items-center gap-2 cursor-pointer group lg:hidden'
              onClick={()=>navigate("/")}
            >
              <div className='w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-md'>
                N
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Workspace */}
        <main className='flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar bg-[#FDFDFE] dark:bg-gray-950 relative'>
          {/* Subtle Background Elements */}
          <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-indigo-50/20 dark:from-indigo-900/5 to-transparent pointer-events-none" />
          
          <div className='max-w-[1600px] mx-auto p-4 sm:p-8 lg:p-10'>
            <Outlet />
          </div>

          {/* Bottom Padding for Mobile */}
          <div className="h-20 lg:hidden" />
        </main>
      </div>

      {/* Overlay for Mobile Sidebar */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-gray-950/40 backdrop-blur-sm z-[45] lg:hidden transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  )
}

export default Layout
