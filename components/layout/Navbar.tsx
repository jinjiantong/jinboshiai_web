'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, BookOpen, Files } from 'lucide-react'
import AmumuBot from '@/components/AmumuBot'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navItems = [
    { name: '核心模块', href: '#problem' },
    { name: '价格', href: '#pricing' },
    { name: '常见问题', href: '#faq' },
  ]

  return (
    <motion.nav
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm border-b border-astro-line py-2.5' : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <a href="#hero" className="flex items-center gap-2.5 group">
            <AmumuBot size={42} />
            <div className="flex flex-col leading-tight">
              <span className="text-astro-ink text-lg font-bold tracking-tight group-hover:text-astro-orange transition-colors">
                阿木木AI外挂
              </span>
              <span className="text-astro-muted text-[10px] font-medium tracking-[0.22em] uppercase">
                AI Sales Teacher
              </span>
            </div>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="px-4 py-2 text-sm font-medium text-astro-inkSoft hover:text-astro-orange rounded-full transition-colors"
              >
                {item.name}
              </a>
            ))}
            <a
              href="/guide"
              className="ml-1 inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-astro-orange/40 text-astro-orange text-sm font-semibold hover:bg-astro-orange hover:text-white transition-colors"
            >
              <BookOpen className="w-4 h-4" />
              使用说明
            </a>
            <a
              href="/reports"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-1 inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-astro-line text-astro-inkSoft text-sm font-semibold hover:border-astro-orange/40 hover:text-astro-orange transition-colors"
            >
              <Files className="w-4 h-4" />
              报告预览
            </a>
            <a
              href="#contact"
              className="ml-3 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-astro-orange hover:bg-astro-orangeDark text-white text-sm font-semibold transition-colors shadow-brand"
            >
              预约免费演示
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-astro-ink hover:text-astro-orange focus:outline-none p-2 transition-colors"
              aria-label="菜单"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
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
              <div className="bg-white border border-astro-line rounded-2xl shadow-soft mt-2 py-3">
                <div className="flex flex-col px-2">
                  {navItems.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className="text-astro-inkSoft hover:text-astro-orange hover:bg-astro-bgAlt transition-colors py-2.5 px-3 rounded-xl font-medium text-sm"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.name}
                    </a>
                  ))}
                  <a
                    href="/guide"
                    className="text-astro-orange hover:bg-astro-orange/10 transition-colors py-2.5 px-3 rounded-xl font-semibold text-sm inline-flex items-center gap-1.5"
                    onClick={() => setIsOpen(false)}
                  >
                    <BookOpen className="w-4 h-4" />
                    使用说明
                  </a>
                  <a
                    href="/reports"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-astro-inkSoft hover:text-astro-orange hover:bg-astro-bgAlt transition-colors py-2.5 px-3 rounded-xl font-semibold text-sm inline-flex items-center gap-1.5"
                    onClick={() => setIsOpen(false)}
                  >
                    <Files className="w-4 h-4" />
                    报告预览
                  </a>
                  <a
                    href="#contact"
                    className="mt-2 mx-3 mb-1 inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-astro-orange hover:bg-astro-orangeDark text-white text-sm font-semibold transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    预约免费演示
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  )
}
