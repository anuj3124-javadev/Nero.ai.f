import React from 'react'
import { Sparkles, Mail, Github, Twitter, Linkedin, Instagram } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const Footer = () => {
  const navigate = useNavigate();

  return (
    <footer className="bg-white dark:bg-gray-950 border-t border-gray-100 dark:border-gray-800 transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-24 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <div 
              className='flex items-center gap-2 mb-6 cursor-pointer group'
              onClick={()=>navigate("/")}
            >
              <div className='w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-500/20'>
                N
              </div>
              <span className='font-bold text-2xl tracking-tighter dark:text-white'>Nero<span className='text-indigo-600'>AI</span></span>
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-8 font-medium">
              Architecting the next generation of neural creative interfaces. Empowering professionals with studio-grade intelligence.
            </p>
            <div className="flex items-center gap-4">
               {[Github, Twitter, Linkedin, Instagram].map((Icon, i) => (
                 <a key={i} href="#" className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 flex items-center justify-center text-gray-400 hover:text-indigo-600 dark:hover:text-white hover:border-indigo-500/50 transition-all">
                    <Icon className="w-4.5 h-4.5" />
                 </a>
               ))}
            </div>
          </div>

          {/* Productivity Column */}
          <div>
            <h3 className="text-[10px] font-black uppercase tracking-[0.25em] text-gray-400 dark:text-gray-500 mb-8">Studio Suite</h3>
            <ul className="space-y-4">
              {["Visual Studio", "Neural Chat", "Writing Expert", "Portfolio Audit"].map((item) => (
                <li key={item}>
                  <a href="#" className="text-[13px] font-bold text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors uppercase tracking-widest">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Ecosystem Column */}
          <div>
            <h3 className="text-[10px] font-black uppercase tracking-[0.25em] text-gray-400 dark:text-gray-500 mb-8">Ecosystem</h3>
            <ul className="space-y-4">
              {["Community", "API Docs", "Changelog", "Security"].map((item) => (
                <li key={item}>
                  <a href="#" className="text-[13px] font-bold text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors uppercase tracking-widest">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter Column */}
          <div className="lg:col-span-1">
            <h3 className="text-[10px] font-black uppercase tracking-[0.25em] text-gray-400 dark:text-gray-500 mb-8">Neural Updates</h3>
            <p className="text-[13px] text-gray-500 dark:text-gray-400 mb-6 font-medium leading-relaxed">
              Synthesize with our latest releases and neural blueprints.
            </p>
            <div className="space-y-3">
               <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                  <input 
                    type="email" 
                    placeholder="nexus@example.com"
                    className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl py-4 pl-12 pr-4 text-sm outline-none focus:ring-4 ring-indigo-500/10 focus:border-indigo-500/50 transition-all dark:text-white font-medium" 
                  />
               </div>
               <button className="w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-black text-[10px] uppercase tracking-[0.25em] py-4 rounded-2xl shadow-xl hover:bg-indigo-600 dark:hover:bg-indigo-50 transition-all">
                  Subscribe
               </button>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-20 pt-8 border-t border-gray-50 dark:border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-6">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
            © 2026 Nero AI Collective. All rights reserved.
          </p>
          <div className="flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-400/5 rounded-full border border-indigo-500/10 animate-pulse">
             <Sparkles className="w-3 h-3 text-indigo-500" />
             <span className="text-[9px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400">Neural Node Active</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
