import { useRef, useEffect, useContext, useState } from 'react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { holdings } from '../data/demo'
import { ReducedMotionContext } from '../context'
import { useIsMobile } from '../hooks/useIsMobile'

const meridian = holdings.find(h => h.id === 'meridian')!

function GateCheck({ label, passed, show }: { label: string; passed: boolean | null; show: boolean }) {
  return (
    <div className={`flex items-start gap-3 transition-all duration-500 ${show ? 'opacity-100' : 'opacity-0'}`}>
      <span className={`font-mono text-lg w-5 flex-shrink-0 ${passed === true ? 'text-support' : passed === false ? 'text-erosion' : 'text-ink-mute'}`}>
        {passed === true ? '✓' : passed === false ? '✗' : '○'}
      </span>
      <span className="text-ink-mute text-sm md:text-base leading-snug">{label}</span>
    </div>
  )
}

function FlowBar({ width, color, label }: { width: number; color: string; label: string }) {
  return (
    <div className="mt-4">
      <p className="text-xs font-mono text-ink-mute mb-1">{label}</p>
      <div className="h-3 bg-rule rounded overflow-hidden">
        <div className="h-full rounded transition-all duration-700" style={{ width: `${width * 100}%`, backgroundColor: color }} />
      </div>
    </div>
  )
}

export default function AdditionalityGate() {
  const outerRef = useRef<HTMLDivElement>(null)
  const stickyRef = useRef<HTMLDivElement>(null)
  const [progress, setProgress] = useState(0)
  const reducedMotion = useContext(ReducedMotionContext)
  const isMobile = useIsMobile()
  const noMotion = reducedMotion || isMobile

  useEffect(() => {
    if (noMotion || !outerRef.current) return
    const trigger = ScrollTrigger.create({
      trigger: outerRef.current,
      start: 'top top',
      end: 'bottom bottom',
      pin: stickyRef.current,
      pinSpacing: false,
      scrub: 0.5,
      onUpdate: (self) => setProgress(self.progress),
    })
    return () => trigger.kill()
  }, [noMotion])

  const beat = noMotion ? 3 : Math.floor(progress * 3)
  const beatProg = noMotion ? 1 : (progress * 3) % 1

  const showMeridian = beat >= 0
  const showRooted = beat >= 1
  const showCivic = beat >= 2
  const meridianChecksShow = (showMeridian && beatProg > 0.2) || beat > 0
  const meridianFlowWidth = noMotion ? 0.02 : (beat === 0 ? Math.max(0.02, 1 - beatProg * 0.98) : 0.02)

  const gateCard = (
    <div className="bg-ground-2 border border-gate rounded-lg p-4 md:p-6">
      <p className="text-xs font-mono text-gate uppercase tracking-widest mb-4">Additionality Gate</p>

      <div className={`transition-all duration-500 ${showMeridian ? 'opacity-100' : 'opacity-0'}`}>
        <p className="text-ink font-medium mb-1">Meridian Foods plc</p>
        <p className="text-ink-mute text-xs md:text-sm font-mono mb-4">Listed equity · $12M</p>
        <div className="space-y-2 md:space-y-3 mb-4">
          <GateCheck label="① Did your capital reach the company directly?" passed={false} show={meridianChecksShow} />
          <GateCheck label="② Were below-market terms taken?" passed={false} show={meridianChecksShow} />
          <GateCheck label="③ Is the use of proceeds known?" passed={false} show={meridianChecksShow} />
        </div>
        <FlowBar width={meridianFlowWidth} color="var(--support)" label="Causal flow" />
        {(beat > 0 || beatProg > 0.7) && (
          <p className="text-xs font-mono text-gate mt-3 leading-relaxed">{meridian.additionality.note}</p>
        )}
      </div>

      <div className={`transition-all duration-500 ${showRooted ? 'opacity-100 mt-6' : 'opacity-0 mt-0 h-0 overflow-hidden'}`}>
        <p className="text-ink font-medium mb-1">Rooted Health</p>
        <p className="text-ink-mute text-xs md:text-sm font-mono mb-4">Private debt · $6M</p>
        <div className="space-y-2 md:space-y-3 mb-4">
          <GateCheck label="① Did your capital reach the company directly?" passed={true} show={showRooted} />
          <GateCheck label="② Were below-market terms taken?" passed={true} show={showRooted} />
          <GateCheck label="③ Is the use of proceeds known?" passed={true} show={showRooted} />
        </div>
        <FlowBar width={0.95} color="var(--support)" label="Causal flow — strong" />
      </div>

      <div className={`transition-all duration-500 ${showCivic ? 'opacity-100 mt-6' : 'opacity-0 mt-0 h-0 overflow-hidden'}`}>
        <p className="text-ink font-medium mb-1">Civic Roots</p>
        <p className="text-ink-mute text-xs md:text-sm font-mono mb-4">Grant · $5M</p>
        <div className="mb-4">
          <p className="text-xs font-mono text-gate mb-3">↺ Coherence path — grants play by different rules</p>
          <div className="space-y-2 md:space-y-3">
            <GateCheck label="Theory of change: plausible?" passed={true} show={showCivic} />
            <GateCheck label="Evidence grade: B" passed={null} show={showCivic} />
          </div>
        </div>
        <p className="text-xs font-mono text-gate border border-gate rounded px-3 py-1.5 inline-block">
          Coherence assessed — outcome not verified
        </p>
      </div>
    </div>
  )

  const narration = (
    <div className="text-ink-mute leading-relaxed space-y-4 text-sm md:text-lg">
      <p>Here is the test most impact tools never apply.</p>
      <p>To claim your capital <em className="text-ink not-italic">caused</em> something, the money has to have actually reached the enterprise — directly, often on terms a normal market wouldn't offer, for a use you can name.</p>
      <p>Buy a listed share and your money went to whoever sold it to you, not to the company. The honest causal figure is close to zero. You're still exposed. That doesn't disappear. But you didn't move anything.</p>
      <p>A direct loan on patient terms? That moved something real.</p>
      <p>And a grant plays by different rules — we don't pretend to verify the outcome, only to judge whether the theory holds together.</p>
      <p className="text-ink">This gate is where inflated impact collapses. We don't catch the portfolio when it falls.</p>
    </div>
  )

  if (noMotion) {
    return (
      <section id="gate" aria-label="The additionality gate" className="py-16 md:py-24 px-4 md:px-8">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8 md:gap-12">
          {gateCard}
          {narration}
        </div>
      </section>
    )
  }

  return (
    <section id="gate" aria-label="The additionality gate" ref={outerRef} style={{ height: '500vh' }}>
      <div ref={stickyRef} className="h-screen flex items-center justify-center px-4 md:px-8">
        <div className="max-w-5xl w-full grid md:grid-cols-2 gap-12 items-start">
          {gateCard}
          {narration}
        </div>
      </div>
    </section>
  )
}
