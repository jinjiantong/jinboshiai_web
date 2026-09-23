'use client'

import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import CrmHero from '@/components/sections/CrmHero'
import CrmProblem from '@/components/sections/CrmProblem'
import CrmCases from '@/components/sections/CrmCases'
import CrmIndustries from '@/components/sections/CrmIndustries'
import CrmPricing from '@/components/sections/CrmPricing'
import CrmTestimonials from '@/components/sections/CrmTestimonials'
import CrmModulesDetail from '@/components/sections/CrmModulesDetail'
import CrmFaq from '@/components/sections/CrmFaq'
import CrmTechArchitecture from '@/components/sections/CrmTechArchitecture'
import CrmCta from '@/components/sections/CrmCta'

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-astro-ink antialiased">
      <Navbar />
      <main>
        <CrmHero />
        <CrmProblem />
        <CrmCases />
        <CrmIndustries />
        <CrmPricing />
        <CrmTestimonials />
        <CrmModulesDetail />
        <CrmFaq />
        <CrmTechArchitecture />
        <CrmCta />
      </main>
      <Footer />
    </div>
  )
}
