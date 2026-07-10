'use client'

import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Portfolio from '@/components/sections/Portfolio'
import Activities from '@/components/sections/Activities'
import Courses from '@/components/sections/Courses'
import About from '@/components/sections/About'
import Contact from '@/components/sections/Contact'

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        <Portfolio />
        <Activities />
        <Courses />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}
