import { useEffect, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ReducedMotionContext } from '../context'
import ScrollRail from './ScrollRail'
import ColdOpen from '../scenes/ColdOpen'
import Mandate from '../scenes/Mandate'
import Portfolio from '../scenes/Portfolio'
import Decompose from '../scenes/Decompose'
import TwoLedgers from '../scenes/TwoLedgers'
import AdditionalityGate from '../scenes/AdditionalityGate'
import Contest from '../scenes/Contest'
import EvidenceDeflation from '../scenes/EvidenceDeflation'
import LoveSankey from '../scenes/LoveSankey'
import Close from '../scenes/Close'

gsap.registerPlugin(ScrollTrigger)

export default function Walkthrough() {
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mq.matches)
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  // Note: GSAP ScrollTrigger pinning can feel slightly janky on mobile due to
  // iOS inertia scrolling, but the current sticky/pin setup works. Scene
  // heights are kept as-is intentionally.
  return (
    <ReducedMotionContext.Provider value={reducedMotion}>
      <div className="relative pl-0 md:pl-10">
        <ScrollRail />
        <ColdOpen />
        <Mandate />
        <Portfolio />
        <Decompose />
        <TwoLedgers />
        <AdditionalityGate />
        <Contest />
        <EvidenceDeflation />
        <LoveSankey />
        <Close />
      </div>
    </ReducedMotionContext.Provider>
  )
}
