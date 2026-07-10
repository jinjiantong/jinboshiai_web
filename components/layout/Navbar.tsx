'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, ChevronDown } from 'lucide-react'
import Link from 'next/link'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [showPortfolioDropdown, setShowPortfolioDropdown] = useState(false)
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

  const navItems = [
    { name: '往期活动', href: '#portfolio' },
    { name: '课程体系', href: '#courses' },
    { name: '联系我们', href: '#join' },
  ]

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-5'}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center">
              <img src="/newlogo_blue.png" alt="金博士AI Logo" className="h-20 w-auto animate-logo-bounce" style={{ imageRendering: 'auto' }} />
              <div className="ml-3 flex flex-col leading-tight mt-2">
                <span className="text-slate-600 text-xs font-semibold tracking-widest uppercase">Jin Dr. AI</span>
                <span className="text-slate-600 text-xl font-bold tracking-wider">金博士AI实验室</span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <div ref={dropdownRef} className="relative">
              <motion.button
                onMouseEnter={() => setShowPortfolioDropdown(true)}
                onClick={() => setShowPortfolioDropdown(!showPortfolioDropdown)}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="text-slate-600 hover:text-primary transition-colors font-medium flex items-center gap-1"
              >
                作品展示
                <motion.div
                  animate={{ rotate: showPortfolioDropdown ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="w-4 h-4" />
                </motion.div>
              </motion.button>
              
              <AnimatePresence>
                {showPortfolioDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    onMouseLeave={() => setShowPortfolioDropdown(false)}
                    className="absolute top-full left-0 mt-2 w-40 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50"
                  >
                    <Link
                      href="/portfolio"
                      className="block px-4 py-3 text-sm text-slate-600 hover:text-primary hover:bg-slate-50 transition-colors font-medium"
                      onClick={() => setShowPortfolioDropdown(false)}
                    >
                      作品展示台
                    </Link>
                    <Link
                      href="#portfolio"
                      className="block px-4 py-3 text-sm text-slate-600 hover:text-primary hover:bg-slate-50 transition-colors font-medium"
                      onClick={() => setShowPortfolioDropdown(false)}
                    >
                      往期活动
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {navItems.map((item) => (
              <motion.a
                key={item.name}
                href={item.href}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="text-slate-600 hover:text-primary transition-colors font-medium"
              >
                {item.name}
              </motion.a>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <motion.button
              onClick={() => setIsOpen(!isOpen)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="text-slate-600 hover:text-slate-900 focus:outline-none p-2"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden bg-white rounded-2xl shadow-xl mt-2 py-4 border border-slate-100">
            <div className="flex flex-col space-y-2 px-4">
              <Link
                href="/portfolio"
                className="text-slate-600 hover:text-primary transition-colors py-3 px-4 rounded-lg hover:bg-slate-50 font-medium"
                onClick={() => setIsOpen(false)}
              >
                作品展示台
              </Link>
              <Link
                href="#portfolio"
                className="text-slate-600 hover:text-primary transition-colors py-3 px-4 rounded-lg hover:bg-slate-50 font-medium"
                onClick={() => setIsOpen(false)}
              >
                往期活动
              </Link>
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-slate-600 hover:text-primary transition-colors py-3 px-4 rounded-lg hover:bg-slate-50 font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.nav>
  )
}
