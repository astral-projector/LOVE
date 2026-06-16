import { useRef, useEffect, useContext, useState } from 'react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { holdings, causalWeight, exposureWeight } from '../data/demo'
import { ReducedMotionContext } from '../context'
import { useIsMobile } from '../hooks/useIsMobile'

const meridian = holdings.find(h => h.id === 'meridian')!

function formatMoney(n: number) {
  return `$${(n / 1000).toFixed(0)}k`
}

export default function TwoLedgers() {
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

  const p = noMotion ? 1 : progress
  const causal = causalWeight(meridian)
  const exposure = exposureWeight(meridian)

  const content = (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-px md:bg-rule max-w-3xl w-full rounded-lg md:overflow-hidden">
      <div
        className="bg-ground-2 p-5 md:p-8 rounded-lg md:rounded-none border border-rule md:border-0"
        style={{ opacity: Math.min(1, p * 2), transform: `translateX(${(1 - Math.min(1, p * 2)) * -20}px)`, transition: 'none' }}
      >
        <p className="text-xs font-mono text-ink-mute uppercase tracking-widest mb-4 md:mb-6">Causal</p>
        <p className="text-ink text-lg md:text-xl mb-2">What your capital moved</p>
        <div className="mt-4 md:mt-8 space-y-3">
          {meridian.activities.map(a => (
            <div key={a.id} className="flex items-center justify-between gap-2">
              <span className="text-ink-mute text-xs md:text-sm">{a.label}</span>
              <span className="font-mono text-sm text-ink flex-shrink-0">{formatMoney(causal / 3)}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 md:mt-6 pt-4 md:pt-6 border-t border-rule">
          <p className="text-xs font-mono text-gate">~2% causal credit</p>
          <p className="text-xs text-ink-mute mt-1 leading-relaxed">{meridian.additionality.note}</p>
        </div>
      </div>

      <div
        className="bg-ground-2 p-5 md:p-8 rounded-lg md:rounded-none border border-rule md:border-0"
        style={{ opacity: Math.min(1, p * 2 - 0.2), transform: `translateX(${(1 - Math.min(1, p * 2 - 0.2)) * 20}px)`, transition: 'none' }}
      >
        <p className="text-xs font-mono text-ink-mute uppercase tracking-widest mb-4 md:mb-6">Exposure</p>
        <p className="text-ink text-lg md:text-xl mb-2">What you're attached to</p>
        <div className="mt-4 md:mt-8 space-y-3">
          {meridian.activities.map(a => (
            <div key={a.id} className="flex items-center justify-between gap-2">
              <span className="text-ink-mute text-xs md:text-sm">{a.label}</span>
              <span className="font-mono text-sm text-ink flex-shrink-0">{formatMoney(exposure / 3)}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 md:mt-6 pt-4 md:pt-6 border-t border-rule">
          <p className="text-xs font-mono text-ink-mute">Full allocation retained</p>
        </div>
      </div>
    </div>
  )

  if (noMotion) {
    return (
      <section id="ledgers" aria-label="Two ledgers" className="py-16 md:py-24 px-4 md:px-8">
        <div className="max-w-2xl mx-auto mb-6 md:mb-8">
          <p className="text-ink-mute text-base md:text-lg">Two questions that almost everyone collapses into one. What did your money actually <em>cause</em> to happen? And what are you simply <em>attached to</em>?</p>
        </div>
        <div className="flex justify-center">{content}</div>
      </section>
    )
  }

  return (
    <section id="ledgers" aria-label="Two ledgers" ref={outerRef} style={{ height: '300vh' }}>
      <div ref={stickyRef} className="h-screen flex flex-col justify-center items-center px-4 md:px-8 gap-8">
        <p className="text-ink-mute text-lg text-center max-w-2xl leading-relaxed">
          Two questions that almost everyone collapses into one. What did your money actually <em className="not-italic text-ink">cause</em> to happen? And what are you simply <em className="not-italic text-ink">attached to</em>?
        </p>
        {content}
      </div>
    </section>
  )
}
