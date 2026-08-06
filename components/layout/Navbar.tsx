'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, ChevronDown } from 'lucide-react'
import Link from 'next/link'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [showPortfolioDropdown, setShowPortfolioDropdown] = useState(false)
  const [showAlert, setShowAlert] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowPortfolioDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleStudentWorks = () => {
    setShowPortfolioDropdown(false)
    setShowAlert(true)
    setTimeout(() => setShowAlert(false), 3000)
  }

  const navItems = [
    { name: '往期活动', href: '#activities' },
    { name: '课程体系', href: '#courses' },
    { name: '联系我们', href: '#join' },
  ]

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-xl shadow-[0_1px_3px_rgba(0,0,0,0.04)] border-b border-slate-100 py-2.5' : 'bg-transparent py-4'}`}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center gap-3 group">
              <img src="/newlogo_blue.png" alt="金博士AI Logo" className="h-16 w-auto animate-logo-bounce" />
              <div className="flex flex-col leading-tight">
                <span className="text-slate-400 text-[10px] font-semibold tracking-[0.25em] uppercase">Jin Dr. AI</span>
                <span className="text-slate-800 text-lg font-bold tracking-wide group-hover:text-blue-600 transition-colors">金博士AI实验室</span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            <a
              href="#enterprise-ai"
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-blue-600 hover:bg-blue-50/60 rounded-lg transition-all"
            >
              企业AI落地
            </a>
            <div ref={dropdownRef} className="relative">
              <button
                onMouseEnter={() => setShowPortfolioDropdown(true)}
                onClick={() => setShowPortfolioDropdown(!showPortfolioDropdown)}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-blue-600 hover:bg-blue-50/60 rounded-lg transition-all flex items-center gap-1"
              >
                作品展示
                <motion.div
                  animate={{ rotate: showPortfolioDropdown ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="w-3.5 h-3.5" />
                </motion.div>
              </button>
              
              <AnimatePresence>
                {showPortfolioDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    transition={{ duration: 0.15 }}
                    onMouseLeave={() => setShowPortfolioDropdown(false)}
                    className="absolute top-full left-0 mt-1.5 w-40 bg-white rounded-xl shadow-lg border border-slate-100 py-1.5 z-50 ring-1 ring-black/5"
                  >
                    <Link
                      href="/portfolio"
                      className="block px-4 py-2.5 text-sm text-slate-600 hover:text-blue-600 hover:bg-blue-50/60 transition-colors font-medium"
                      onClick={() => setShowPortfolioDropdown(false)}
                    >
                      作品展示台
                    </Link>
                    <button
                      onClick={handleStudentWorks}
                      className="w-full text-left px-4 py-2.5 text-sm text-slate-600 hover:text-blue-600 hover:bg-blue-50/60 transition-colors font-medium"
                    >
                      学员作品
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-blue-600 hover:bg-blue-50/60 rounded-lg transition-all"
              >
                {item.name}
              </a>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-700 hover:text-blue-600 focus:outline-none p-2 transition-colors"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden overflow-hidden"
            >
              <div className="bg-white rounded-2xl shadow-lg mt-2 py-3 border border-slate-100">
                <div className="flex flex-col px-2">
                  {[
                    { name: '企业AI落地', href: '#enterprise-ai' },
                    { name: '作品展示台', href: '/portfolio' },
                    ...navItems,
                  ].map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="text-slate-600 hover:text-blue-600 hover:bg-blue-50/60 transition-colors py-2.5 px-3 rounded-lg font-medium text-sm"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                  <button
                    onClick={() => {
                      setIsOpen(false)
                      setShowAlert(true)
                      setTimeout(() => setShowAlert(false), 3000)
                    }}
                    className="w-full text-left text-slate-600 hover:text-blue-600 hover:bg-blue-50/60 transition-colors py-2.5 px-3 rounded-lg font-medium text-sm"
                  >
                    学员作品
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Alert Toast */}
      <AnimatePresence>
        {showAlert && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-6 py-3 rounded-xl shadow-xl"
          >
            <p className="text-sm font-medium">正在制作中，尽情期待...</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
