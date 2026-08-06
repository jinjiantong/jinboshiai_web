'use client'

import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import EnterpriseAI from '@/components/sections/EnterpriseAI'
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
        <EnterpriseAI />
        {/* 作品展示区域暂时隐藏，需要展示时取消下面注释即可 */}
        {/* <Portfolio /> */}
        <Activities />
        <Courses />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}
