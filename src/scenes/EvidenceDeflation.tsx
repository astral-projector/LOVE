import { useRef, useEffect, useContext, useState } from 'react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ReducedMotionContext } from '../context'

export default function EvidenceDeflation() {
  const outerRef = useRef<HTMLDivElement>(null)
  const stickyRef = useRef<HTMLDivElement>(null)
  const [dialValue, setDialValue] = useState(0.5)
  const reducedMotion = useContext(ReducedMotionContext)

  useEffect(() => {
    if (reducedMotion || !outerRef.current) return
    const trigger = ScrollTrigger.create({
      trigger: outerRef.current,
      start: 'top top',
      end: 'bottom bottom',
      pin: stickyRef.current,
      pinSpacing: false,
      scrub: 0.5,
    })
    return () => trigger.kill()
  }, [reducedMotion])

  const interpretations = [
    'Sceptical read',
    'Balanced read',
    'Charitable read',
  ]
  const interpIndex = Math.floor(dialValue * 2.99)

  const content = (
    <div className="max-w-3xl w-full space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-ground-2 border border-rule rounded-lg p-6">
          <p className="text-xs font-mono text-ink-mute mb-1">Grade A — strong evidence</p>
          <p className="text-ink mb-4">Rooted Health → Vitality</p>
          <div className="h-4 bg-rule rounded overflow-hidden">
            <div className="h-full bg-support rounded" style={{ width: '95%' }} />
          </div>
          <p className="text-xs font-mono text-support mt-2">Full signal</p>
        </div>
        <div className="bg-ground-2 border border-rule rounded-lg p-6">
          <p className="text-xs font-mono text-ink-mute mb-1">Grade C — self-reported</p>
          <p className="text-ink mb-4">Horizon Fund → Vitality</p>
          <div className="h-4 bg-rule rounded overflow-hidden">
            <div className="h-full rounded" style={{ width: '70%', backgroundColor: 'var(--support-deep)' }} />
          </div>
          <p className="text-xs font-mono mt-2" style={{ color: 'var(--support-deep)' }}>Signal deflated</p>
        </div>
      </div>

      <div className="bg-ground-2 border border-rule rounded-lg p-6">
        <p className="text-xs font-mono text-ink-mute mb-4 uppercase tracking-widest">Interpretation dial</p>
        <div className="relative">
          <div className="h-1 bg-rule rounded mb-4 relative">
            <div className="absolute left-1/2 top-1/2 -translate-y-1/2 w-0.5 h-3 bg-ink-mute opacity-40" />
            <div
              className="absolute top-1/2 -translate-y-1/2 w-0.5 h-4 bg-gate opacity-30"
              style={{ left: '50%' }}
              title="Honest default"
            />
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={dialValue}
            onChange={e => setDialValue(Number(e.target.value))}
            className="w-full accent-gate"
            aria-label="Interpretation dial"
          />
        </div>
        <div className="flex justify-between mt-2">
          <span className="text-xs font-mono text-ink-mute">Sceptical</span>
          <span className="text-sm font-mono text-gate">{interpretations[interpIndex]}</span>
          <span className="text-xs font-mono text-ink-mute">Charitable</span>
        </div>
        <p className="text-xs text-ink-mute mt-4">
          Evidence grade is locked. The ghost line marks the honest default — visible regardless of where the dial sits.
        </p>
      </div>
    </div>
  )

  if (reducedMotion) {
    return (
      <section id="deflate" aria-label="Evidence deflation" className="py-24 px-4 md:px-8">
        <div className="max-w-2xl mx-auto mb-8">
          <p className="text-ink-mute text-lg">Not all evidence is equal, so not all signal is equal. Weak evidence makes the flow thinner — always visibly, never in the fine print.</p>
        </div>
        <div className="flex justify-center">{content}</div>
      </section>
    )
  }

  return (
    <section id="deflate" aria-label="Evidence deflation" ref={outerRef} style={{ height: '300vh' }}>
      <div ref={stickyRef} className="h-screen flex flex-col justify-center items-center px-4 md:px-8 gap-8">
        <p className="text-ink-mute text-lg text-center max-w-2xl leading-relaxed">
          Not all evidence is equal, so not all signal is equal. Weak evidence makes the flow thinner — always visibly, never in the fine print.
        </p>
        {content}
      </div>
    </section>
  )
}
