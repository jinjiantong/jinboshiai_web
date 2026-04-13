'use client'

import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Portfolio from '@/components/sections/Portfolio'
import LearningPath from '@/components/sections/LearningPath'
import Courses from '@/components/sections/Courses'
import About from '@/components/sections/About'
import Contact from '@/components/sections/Contact'

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        <Portfolio />
        <LearningPath />
        <Courses />
        <About />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}
